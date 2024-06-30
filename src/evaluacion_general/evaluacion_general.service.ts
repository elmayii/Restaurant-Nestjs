import { Injectable } from '@nestjs/common';
import { espiritu, respuesta_dia } from '@prisma/client';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { generalThrows } from 'src/lanzamientos/lanzamiento';
import { parados, specials } from 'src/lib/constants';
import { PrismaService } from 'src/prisma/prisma.service';

const generalEvaluationOrder = [
  'respuesta_general1',
  'respuesta_general2',
  'respuesta_general3',
  'respuesta_general4',
] as const;

@Injectable()
export class EvaluacionGeneralService {
  constructor(
    private prisma: PrismaService,
    private espiritu: EspiritusService,
  ) {}
  async getCurrentStep(userId: string) {
    const generalData = await this.prisma.evaluacion_general.findFirst({
      where: { user_id: userId },
    });
    if (!generalData) return generalEvaluationOrder[0];
    for (const index in generalEvaluationOrder) {
      if (!generalData[generalEvaluationOrder[index]]) {
        return generalEvaluationOrder[index];
      }
    }
    return void 0;
  }

  async processEvaluacionGeneral(id: string, userId: string): Promise<string> {
    //Obtener usuario
    const user = await this.prisma.usuario.findFirst({
      where: { id: userId },
    });
    //Crear instancia si no existe
    if (!generalThrows.gThrows[user.email]) {
      generalThrows.gThrows[user.email] = {
        currentThrow: 0,
        throws: [{ throw: '', special: false }],
      };
    }

    const userThrowData = generalThrows.gThrows[user.email];
    const specialThrowsCount = userThrowData.throws.filter(
      (t) => t.special,
    ).length;

    // Verificar límite de lanzamientos especiales
    if (specials.includes(id) && specialThrowsCount >= 4) {
      return 'LIMIT_REACHED';
    }

    if (parados.includes(id)) {
      const date = new Date();
      const formattedDateTime = date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      this.espiritu.createEspiritu(
        {
          descripcion_sistema: `Este espíritu se creó a través de un lanzamiento especial el ${formattedDateTime}`,
        } as espiritu,
        userId,
      );
    }

    //Si es especial, crear nuevo lanzamiento
    if (specials.includes(id)) {
      generalThrows.gThrows[user.email].throws = [
        ...generalThrows.gThrows[user.email].throws,
        { throw: id, special: true },
      ];
      if (generalThrows.gThrows[user.email].currentThrow === 0) {
        generalThrows.gThrows[user.email].currentThrow =
          generalThrows.gThrows[user.email].throws.length - 1;
      }
    } else {
      generalThrows.gThrows[user.email].throws[
        generalThrows.gThrows[user.email].currentThrow
      ].throw += id;
    }

    //Chequear respuesta
    let answer: respuesta_dia;
    const currentColumn = await this.getCurrentStep(userId);

    if (!currentColumn) return 'La evaluación ya esta completada';

    if (
      generalThrows.gThrows[user.email].throws[
        generalThrows.gThrows[user.email].currentThrow
      ].special
    ) {
      answer = await this.prisma.respuesta_especial.findFirst({
        where: {
          id: generalThrows.gThrows[user.email].throws[
            generalThrows.gThrows[user.email].currentThrow
          ].throw,
        },
      });
    } else {
      switch (currentColumn) {
        case 'respuesta_general1':
          answer = await this.prisma.respuesta_general1.findFirst({
            where: {
              id: generalThrows.gThrows[user.email].throws[
                generalThrows.gThrows[user.email].currentThrow
              ].throw,
            },
          });

          break;
        case 'respuesta_general2':
          answer = await this.prisma.respuesta_general2.findFirst({
            where: {
              id: generalThrows.gThrows[user.email].throws[
                generalThrows.gThrows[user.email].currentThrow
              ].throw,
            },
          });

          break;

        case 'respuesta_general3':
          answer = await this.prisma.respuesta_general3.findFirst({
            where: {
              id: generalThrows.gThrows[user.email].throws[
                generalThrows.gThrows[user.email].currentThrow
              ].throw,
            },
          });

          break;

        case 'respuesta_general4':
          answer = await this.prisma.respuesta_general4.findFirst({
            where: {
              id: generalThrows.gThrows[user.email].throws[
                generalThrows.gThrows[user.email].currentThrow
              ].throw,
            },
          });

          break;
      }
    }

    if (answer) {
      generalThrows.gThrows[user.email].throws[
        generalThrows.gThrows[user.email].currentThrow
      ].throw = answer.respuesta;
      if (!generalThrows.gThrows[user.email].currentThrow) {
        const result = generalThrows.gThrows[user.email].throws
          .filter((answer) => answer.special)
          .map((answer) => answer.throw)
          .join(';');
        generalThrows.gThrows[user.email] = void 0;
        switch (currentColumn) {
          case 'respuesta_general1':
            await this.prisma.evaluacion_general.create({
              data: { respuesta_general1: answer.respuesta, user_id: userId },
            });
            break;
          case 'respuesta_general2':
            await this.prisma.evaluacion_general.update({
              where: { user_id: userId },
              data: { respuesta_general2: answer.respuesta },
            });
            break;
          case 'respuesta_general3':
            await this.prisma.evaluacion_general.update({
              where: { user_id: userId },
              data: { respuesta_general3: answer.respuesta },
            });
            break;
          case 'respuesta_general4':
            await this.prisma.evaluacion_general.update({
              where: { user_id: userId },
              data: { respuesta_general4: answer.respuesta },
            });
            break;
        }
        const generalData = await this.prisma.evaluacion_general.findFirst({
          where: { user_id: userId },
        });
        if (currentColumn === 'respuesta_general3') {
          return `${generalData.respuesta_general1 + generalData.respuesta_general2 + generalData.respuesta_general3} ${result}`;
        }
        return result;
      } else {
        if (
          generalThrows.gThrows[user.email].throws.length - 1 >
          generalThrows.gThrows[user.email].currentThrow
        ) {
          generalThrows.gThrows[user.email].currentThrow += 1;
          return 'Vuelve a tirar para caracterizar el lanzamiento especial';
        } else {
          generalThrows.gThrows[user.email].currentThrow = 0;
          return 'Vuelve a tirar';
        }
      }
    } else {
      if (
        generalThrows.gThrows[user.email].throws[
          generalThrows.gThrows[user.email].currentThrow
        ].special
      ) {
        return 'Vuelve a tirar para caracterizar el lanzamiento especial';
      } else {
        return 'Vuelve a tirar';
      }
    }
  }
}
