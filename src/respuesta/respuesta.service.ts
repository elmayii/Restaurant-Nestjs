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
    console.log(user, request.email);

    //Crear instancia si no existe
    if (!userThrows.throws[user.email]) {
      console.log('creando instancia');
      userThrows.throws[user.email] = {
        currentThrow: 0,
        throws: [{ throw: '', special: false }],
      };
    }

    console.log('ID QUE LLEGA: ', id);

    //Si es especial, crear nuevo lanzamiento
    if (specials.includes(id)) {
      userThrows.throws[user.email].throws = [
        ...userThrows.throws[user.email].throws,
        { throw: id, special: true },
      ];
      console.log('nuevo lanzamiento creado por ser especial');
      if (userThrows.throws[user.email].currentThrow === 0) {
        console.log('me muevo al ultimo lanzamiento nuevo especial');
        userThrows.throws[user.email].currentThrow =
          userThrows.throws[user.email].throws.length - 1;
      }
    } else {
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].throw += id;
    }
    console.log('Lo que tiene: ', userThrows.throws[user.email]);

    //Chequear respuesta
    let answer: respuesta_dia;
    if (
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].special
    ) {
      console.log(
        'BUscando',
        userThrows.throws[user.email].throws[
          userThrows.throws[user.email].currentThrow
        ].throw,
      );
      answer = await this.prisma.respuesta_especial.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
      console.log(answer);
    } else if (type === 'day') {
      answer = await this.prisma.respuesta_dia.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
    } else {
      console.log(
        'id que busca: ',
        userThrows.throws[user.email].throws[
          userThrows.throws[user.email].currentThrow
        ].throw,
      );
      answer = await this.prisma.respuesta.findFirst({
        where: {
          id: userThrows.throws[user.email].throws[
            userThrows.throws[user.email].currentThrow
          ].throw,
        },
      });
    }

    if (answer) {
      console.log('Respuesta encontrada', answer);
      userThrows.throws[user.email].throws[
        userThrows.throws[user.email].currentThrow
      ].throw = answer.respuesta;
      if (!userThrows.throws[user.email].currentThrow) {
        console.log('Ya hay resultado');
        const result = userThrows.throws[user.email].throws.map(
          (answer) => answer.throw,
        );
        console.log(result);
        userThrows.throws[user.email] = void 0;
        return result;
      } else {
        if (
          userThrows.throws[user.email].throws.length - 1 >
          userThrows.throws[user.email].currentThrow
        ) {
          console.log('avanzando de paso al proximo');
          userThrows.throws[user.email].currentThrow += 1;
        } else {
          console.log('volvi al principio');
          userThrows.throws[user.email].currentThrow = 0;
        }
      }
    }

    return void 0;
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
