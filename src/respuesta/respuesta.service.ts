import { Injectable } from '@nestjs/common';
import { espiritu, respuesta, respuesta_dia } from '@prisma/client';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { userThrows } from 'src/lanzamientos/lanzamiento';
import { actions, parados, specials, validTypes } from 'src/lib/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RespuestasService {
  constructor(
    private prisma: PrismaService,
    private espiritu: EspiritusService,
  ) {}

  async getAllRespuestas(): Promise<respuesta[]> {
    return this.prisma.respuesta_predialogo.findMany();
  }

  async getRespuestaById(
    id: string,
    userId: string,
    type: string,
    action: string | null | undefined,
    param1: number | null | undefined,
    param2: string | null | undefined,
  ): Promise<string | undefined | string> {
    if (!validTypes.includes(type)) {
      throw new Error('Invalid type');
    }

    //Obtener usuario
    const user = await this.prisma.usuario.findFirst({
      where: { id: userId },
    });
    //Crear instancia si no existe
    if (!userThrows.throws[user.email]) {
      userThrows.throws[user.email] = {
        currentThrow: 0,
        throws: [{ throw: '', special: false }],
      };
    }

    const userThrowData = userThrows.throws[user.email];
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
      userThrows.throws[user.email].throws = [
        ...userThrows.throws[user.email].throws,
        { throw: id, special: true },
      ];
      if (userThrows.throws[user.email].currentThrow === 0) {
        userThrows.throws[user.email].currentThrow =
          userThrows.throws[user.email].throws.length - 1;
      }
    } else {
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].throw += id;
    }

    //Chequear respuesta
    let answer: respuesta_dia;

    if (
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].special
    ) {
      answer = await this.prisma.respuesta_especial.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
    } else if (type === 'day') {
      answer = await this.prisma.respuesta_dia.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
    } else if (type === 'predialog' && action) {
      answer = await this.prisma.respuesta_predialogo.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
      console.log('action:', action);
      if (
        answer &&
        !answer?.respuesta?.includes('04') &&
        actions.includes(action)
      ) {
        if (action == '01' && param1) {
          console.log('elim');
          await this.espiritu.deleteEspiritu(Number(param1));
        } else if (action == '02' && param1 && param2) {
          await this.espiritu.updateEspiritu(
            {
              ...(await this.espiritu.getEspirituById(param1)),
              foto: param2,
            },
            param1,
          );
        } else if (action == '03' && param1 && param2) {
          await this.espiritu.updateEspiritu(
            {
              ...(await this.espiritu.getEspirituById(param1)),
              nombre: param2,
            },
            param1,
          );
        } else if (action == '04' && param1 && param2) {
          await this.espiritu.updateEspiritu(
            {
              ...(await this.espiritu.getEspirituById(param1)),
              descripcion: param2,
            },
            param1,
          );
        }
      }
    } else {
      answer = await this.prisma.respuesta.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
      console.log(
        userThrows.throws[user.email].throws[
          userThrows.throws[user.email].currentThrow
        ].throw,
      );
    }

    if (answer) {
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].throw = answer.respuesta;
      if (!userThrows.throws[user.email].currentThrow) {
        const result = userThrows.throws[user.email].throws
          .map((answer) => answer.throw)
          .join(';');
        userThrows.throws[user.email] = void 0;
        return result;
      } else {
        if (
          userThrows.throws[user.email].throws.length - 1 >
          userThrows.throws[user.email].currentThrow
        ) {
          userThrows.throws[user.email].currentThrow += 1;
          return 'Vuelve a tirar para caracterizar el lanzamiento especial';
        } else {
          userThrows.throws[user.email].currentThrow = 0;
          return 'Vuelve a tirar';
        }
      }
    } else {
      if (
        userThrows.throws[user.email].throws[
          userThrows.throws[user.email].currentThrow
        ].special
      ) {
        return 'Vuelve a tirar para caracterizar el lanzamiento especial';
      } else {
        return 'Vuelve a tirar';
      }
    }
  }

  async createRespuesta(data: respuesta): Promise<respuesta> {
    return this.prisma.respuesta.create({ data });
  }

  async closeDialog(email: string) {
    const user = await this.prisma.usuario.findFirst({
      where: { email },
    });
    return (userThrows.throws[user.email] = void 0);
  }

  async deleteRespuesta() {
    return this.prisma.respuesta.deleteMany();
  }
}
