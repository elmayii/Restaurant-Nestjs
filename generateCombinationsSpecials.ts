import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const significadosNormales: { [key: string]: string } = {
  '01': 'Círculo grande blanco y círculo pequeño blanco',
  '02': 'Círculo grande blanco y círculo pequeño negro',
  '03': 'Círculo grande negro y círculo pequeño blanco',
  '04': 'Círculo grande negro y círculo pequeño negro',
};

const significadosEspeciales: { [key: string]: string } = {
  '05': 'Círculo grande blanco encima de círculo pequeño blanco',
  '06': 'Círculo pequeño blanco encima de círculo grande blanco',
  '07': 'Círculo grande negro encima de círculo pequeño negro',
  '08': 'Círculo pequeño negro encima de círculo grande negro',
  '09': 'Círculo grande blanco encima de círculo pequeño negro',
  '10': 'Círculo pequeño blanco encima de círculo grande negro',
  '11': 'Círculo grande negro encima de círculo pequeño blanco',
  '12': 'Círculo pequeño negro encima de círculo grande blanco',
  '13': 'Círculo grande blanco parado y círculo pequeño blanco normal',
  '14': 'Círculo grande blanco parado y círculo pequeño negro normal',
  '15': 'Círculo grande negro parado y círculo pequeño blanco normal',
  '16': 'Círculo grande negro parado y círculo pequeño negro normal',
  '17': 'Círculo pequeño blanco parado y círculo grande blanco normal',
  '18': 'Círculo pequeño blanco parado y círculo grande negro normal',
  '19': 'Círculo pequeño negro parado y círculo grande blanco normal',
  '20': 'Círculo pequeño negro parado y círculo grande negro normal',
  '21': 'Círculo grande blanco y círculo pequeño blanco, ambos parados',
  '22': 'Círculo grande blanco y círculo pequeño negro, ambos parados',
  '23': 'Círculo grande negro y círculo pequeño blanco, ambos parados',
  '24': 'Círculo grande negro y círculo pequeño negro, ambos parados',
  '25': 'Círculo grande blanco delante de círculo pequeño blanco',
  '26': 'Círculo pequeño blanco delante de círculo grande blanco',
  '27': 'Círculo grande negro delante de círculo pequeño negro',
  '28': 'Círculo pequeño negro delante de círculo grande negro',
  '29': 'Círculo grande blanco delante de círculo pequeño negro',
  '30': 'Círculo pequeño blanco delante de círculo grande negro',
  '31': 'Círculo grande negro delante de círculo pequeño blanco',
  '32': 'Círculo pequeño negro delante de círculo grande blanco',
  '33': 'Ambas monedas cayeron de forma transversal',
  '34': 'Una moneda transversal y círculo grande blanco',
  '35': 'Una moneda transversal y círculo grande negro',
  '36': 'Una moneda transversal y círculo pequeño blanco',
  '37': 'Una moneda transversal y círculo pequeño negro',
};

const valoresNormales = ['01', '02', '03', '04'];
const valoresEspeciales = [
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

async function main() {
  for (let e = 0; e < valoresEspeciales.length; e++) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          const id = `${valoresEspeciales[e]}${valoresNormales[i]}${valoresNormales[j]}${valoresNormales[k]}`;
          const respuesta = `Primer lanzamiento: ${significadosEspeciales[valoresEspeciales[e]]}, segundo lanzamiento: ${significadosNormales[valoresNormales[i]]}, tercer lanzamiento: ${significadosNormales[valoresNormales[j]]}, cuarto lanzamiento: ${significadosNormales[valoresNormales[k]]}`;

          await prisma.respuesta_especial.create({
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
