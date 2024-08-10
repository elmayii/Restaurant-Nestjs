import { PriceDTO } from './dtos';

export function calculatePrice(esencia: number): PriceDTO {
  // 5 -- 0%
  if (esencia <= 5) {
    return {
      descuento: 0,
      costo: esencia,
      esencia: esencia,
    };
  }
  // 15 -- 4%
  else if (esencia > 5 && esencia <= 15) {
    return procedure(esencia, 5, 15, 0, 4);
  }
  // 25 -- 6%
  else if (esencia > 15 && esencia <= 25) {
    return procedure(esencia, 15, 25, 4, 6);
  }
  // 50 -- 8%
  else if (esencia > 25 && esencia <= 50) {
    return procedure(esencia, 25, 50, 6, 8);
  }
  // 100 -- 10%
  else if (esencia > 50 && esencia <= 100) {
    return procedure(esencia, 50, 100, 8, 10);
  }
  // 250 -- 15%
  else if (esencia > 100 && esencia <= 250) {
    return procedure(esencia, 100, 250, 10, 15);
  }
  // 1000 -- 28%
  else if (esencia > 250 && esencia <= 1000) {
    return procedure(esencia, 250, 1000, 15, 28);
  }
  // 10000 -- 32%
  else if (esencia > 1000 && esencia <= 10000) {
    return procedure(esencia, 1000, 10000, 28, 32);
  }
  // 100000 -- 34%
  else if (esencia > 10000 && esencia <= 100000) {
    return procedure(esencia, 10000, 100000, 32, 36);
  }
  // 1000000 -- 40%
  else if (esencia > 100000 && esencia <= 1000000) {
    return procedure(esencia, 100000, 1000000, 36, 40);
  }
}

function procedure(
  value: number,
  costInf: number,
  costSup: number,
  descInf: number,
  descSup: number,
) {
  const balance = descSup - descInf;
  const distance = costSup - costInf;
  const laps = distance / balance;

  let incrised = value - costInf;
  incrised = incrised / laps;

  let descuento = Number(incrised + descInf);
  let costo = Number(value - (descuento / 100) * value);

  const op = transformDecimalTo99(Number(descuento.toFixed(2)),Number(costo.toFixed(2)))
  return {
    descuento: op.descuento,
    costo: op.costo,
    esencia: value,
  };
}

interface numbersTranformed{
  descuento:number;
  costo:number
}

function transformDecimalTo99(descuento:number,costo:number): numbersTranformed {
  // Convertir el valor a una cadena para manipular los decimales
  const valueAsString = costo.toString();

  // Separar la parte entera de la decimal
  const [integerPart, decimalPart] = valueAsString.split('.');

  // Verificar si todos los decimales son ceros
  const allDecimalsAreZero = decimalPart === '00' || !decimalPart;

  // Si todos los decimales son ceros, reemplazarlos por .99
  if (allDecimalsAreZero) {
    costo = parseFloat(`${integerPart}.99`) - 1;
    descuento = descuento + 0.01
  }

  // Si no, retornar el valor original
  return {costo,descuento};
}