"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var significadosNormales = {
    '01': 'Círculo grande blanco y círculo pequeño blanco',
    '02': 'Círculo grande blanco y círculo pequeño negro',
    '03': 'Círculo grande negro y círculo pequeño blanco',
    '04': 'Círculo grande negro y círculo pequeño negro',
};
var significadosEspeciales = {
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
var valoresNormales = ['01', '02', '03', '04'];
var valoresEspeciales = [
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var e, i, j, k, id, respuesta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e = 0;
                    _a.label = 1;
                case 1:
                    if (!(e < valoresEspeciales.length)) return [3 /*break*/, 10];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < 4)) return [3 /*break*/, 9];
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < 4)) return [3 /*break*/, 8];
                    k = 0;
                    _a.label = 4;
                case 4:
                    if (!(k < 4)) return [3 /*break*/, 7];
                    id = "".concat(valoresEspeciales[e]).concat(valoresNormales[i]).concat(valoresNormales[j]).concat(valoresNormales[k]);
                    respuesta = "".concat(significadosEspeciales[valoresEspeciales[e]], ", Primer lanzamiento: ").concat(significadosNormales[valoresNormales[i]], ", segundo lanzamiento: ").concat(significadosNormales[valoresNormales[j]], ", tercer lanzamiento: ").concat(significadosNormales[valoresNormales[k]]);
                    return [4 /*yield*/, prisma.respuesta_especial.create({
                            data: {
                                id: id,
                                respuesta: respuesta,
                            },
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    k++;
                    return [3 /*break*/, 4];
                case 7:
                    j++;
                    return [3 /*break*/, 3];
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9:
                    e++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return console.log('Inserciones completadas'); })
    .catch(function (e) { return console.error(e); })
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
