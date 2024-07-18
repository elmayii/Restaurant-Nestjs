import { PriceDTO } from "./dtos";

export function calculatePrice(esencia:number) : PriceDTO {
    let descInf: number;
    let descSup: number;
    // 5 -- 0%
    if(esencia <= 5){
        return {
            descuento:0,
            costo:esencia,
            esencia:esencia
        }
    }
    // 15 -- 4%
    else if(esencia > 5 && esencia <= 15){
        return procedure(esencia,5,15,0,4)
    }
    // 25 -- 6%
    else if(esencia > 15 && esencia <= 25){
        return procedure(esencia,15,25,4,6)
    }
    // 50 -- 8%
    else if(esencia > 25 && esencia <= 50){
        return procedure(esencia,25,50,6,8)
    }
    // 100 -- 10%
    else if(esencia > 50 && esencia <= 100){
        return procedure(esencia,50,100,8,10)
    }
    // 250 -- 15%
    else if(esencia > 100 && esencia <= 250){
        return procedure(esencia,100,250,10,15)
    }
    // 1000 -- 28%
    else if(esencia > 250 && esencia <= 1000){
        return procedure(esencia,250,1000,15,28)
    }
    // 10000 -- 32%
    else if(esencia > 1000 && esencia <= 10000){
        return procedure(esencia,1000,10000,28,32)
    }
    // 100000 -- 34%
    else if(esencia > 10000 && esencia <= 100000){
        return procedure(esencia,10000,100000,32,26)
    }
    // 1000000 -- 40%
    else if(esencia > 100000 && esencia <= 1000000){
        return procedure(esencia,100000,1000000,36,40)
    }
}

function procedure (
    value:number,
    costInf:number,
    costSup:number,
    descInf:number,
    descSup:number
    ) {
        let balance = descSup - descInf
        let distance = costSup - costInf
        let laps = distance/balance

        let incrised = value - costInf
        incrised = incrised / laps

        let descuento = incrised + descInf
        let costo = value - (descuento/100) * value
        return {
            descuento: Number(descuento.toFixed(2)),
            costo: Number(costo.toFixed(2)),
            esencia: value
        }
}