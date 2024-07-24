import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const significados: { [key: string]: string } = {
  '01': 'Círculo grande blanco y círculo pequeño blanco',
  '02': 'Círculo grande blanco y círculo pequeño negro',
  '03': 'Círculo grande negro y círculo pequeño blanco',
  '04': 'Círculo grande negro y círculo pequeño negro',
};

const valores = ['01', '02', '03', '04'];

async function main() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        for (let l = 0; l < 4; l++) {
          const id = `${valores[i]}${valores[j]}${valores[k]}${valores[l]}`;
          const respuesta = `Primer lanzamiento: ${significados[valores[i]]}, segundo lanzamiento: ${significados[valores[j]]}, tercer lanzamiento: ${significados[valores[k]]}, cuarto lanzamiento: ${significados[valores[l]]}`;

          await prisma.respuesta_dia.create({
            data: {
              id,
              respuesta,
            },
          });
        }
      }
    }
  }
}

main()
  .then(() => console.log('Inserciones completadas'))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
