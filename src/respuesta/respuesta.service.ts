import { Injectable } from '@nestjs/common';
import { respuesta, respuesta_dia } from '@prisma/client';
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

const validTypes = ['day', 'dialog'];

@Injectable()
export class RespuestasService {
  constructor(private prisma: PrismaService) {}

  async getAllRespuestas(): Promise<respuesta[]> {
    return this.prisma.respuesta.findMany();
  }

  async getRespuestaById(
    id: string,
    request: any,
    type: string,
  ): Promise<string[] | undefined> {
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

    //Si es especial, crear nuevo lanzamiento
    if (specials.includes(id)) {
      userThrows.throws[user.email] = {
        throws: [
          ...userThrows.throws[user.email].throws,
          { throw: '', special: true },
        ],
        currentThrow: userThrows.throws[user.email].currentThrow + 1,
      };
    }
    userThrows.throws[user.email].throws[
      userThrows.throws[user.email].currentThrow
    ].throw += id;

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
    }

    if (answer) {
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].throw = answer.respuesta;
      if (userThrows.throws[user.email].currentThrow) {
        userThrows.throws[user.email].currentThrow -= 1;
      } else {
        const result = userThrows.throws[user.email].throws.map(
          (answer) => answer.throw,
        );
        userThrows.throws[user.email] = void 0;
        return result;
      }
    }

    return void 0;
  }

  async createRespuesta(data: respuesta): Promise<respuesta> {
    return this.prisma.respuesta.create({ data });
  }
}
