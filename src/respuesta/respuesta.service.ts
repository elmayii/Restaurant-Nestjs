import { Injectable } from '@nestjs/common';
import { espiritu, respuesta, respuesta_dia } from '@prisma/client';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { userThrows } from 'src/lanzamientos/lanzamiento';
import { PrismaService } from 'src/prisma/prisma.service';

const specials = [
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
];

const parados = ['21', '22', '23', '24'];

const validTypes = ['day', 'dialog'];

@Injectable()
export class RespuestasService {
  constructor(
    private prisma: PrismaService,
    private espiritu: EspiritusService,
  ) {}

  async getAllRespuestas(): Promise<respuesta[]> {
    return this.prisma.respuesta.findMany();
  }

  async getRespuestaById(
    id: string,
    request: any,
    type: string,
  ): Promise<string | undefined | string> {
    if (!validTypes.includes(type)) {
      throw new Error('Invalid type');
    }
    //Obtener usuario
    const user = await this.prisma.usuario.findFirst({
      where: { email: request.email },
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
        request,
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
