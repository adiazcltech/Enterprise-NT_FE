import { db } from "../db/config/conection";
import { EnterpriseNTTokenException } from "../exceptions/ResponseUtils";
import { Constants } from "./constants";
import axios from "axios";
import moment from 'moment';
import { jwtVerify, JWTVerifyResult, JWTPayload } from 'jose';

const JWT_KEY = new TextEncoder().encode('104F');
const JWT_AUDIENCE = 'Enterprise NT';
const JWT_ISSUER = 'CLTech';


//Consulta lista de años para historicos
export const listOfConsecutiveYears = async (init: string, end: string) => {
    const startYear = init.substring(0, 4);
    const endYear = end.substring(0, 4);
    let years = [];
    let yearTraveled = +startYear;
    while (yearTraveled <= +endYear) {
        years.push(yearTraveled);
        yearTraveled++;
    }

    return years;
}

// Construir el filtro SQL para estadisticas
export const buildSQLDemographicFilterStatistics = async (demographics: Array<any>, select: string, where: string) => {
    if (demographics !== null && demographics.length > 0) {
        demographics.map((demo: any) => {
            if (demo.demographic !== null) {
                switch (demo.demographic) {
                    case Constants.BRANCH:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            // if(demo.demographicItems.length === 1) {
                            //     where += ` AND sta2.sta2c5 = ${ demo.demographicItems[0]} `;
                            // } else {
                            // }
                            where += ` AND sta2.sta2c5 in ( ${demo.demographicItems.join()} ) `;
                        }
                        break;
                    case Constants.SERVICE:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta2.sta2c8 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.PHYSICIAN:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta2.sta2c11 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.ACCOUNT:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta2.sta2c14 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.RATE:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta2.sta2c17 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.RACE:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta1.sta1c8 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.PATIENT_SEX:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta1.sta1c2 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.DOCUMENT_TYPE:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta1.sta1c5 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    case Constants.ORDERTYPE:
                        if (demo.demographicItems != null && demo.demographicItems.length > 0) {
                            where += ` AND sta2.sta2c2 in ( ${demo.demographicItems.join()} )`;
                        }
                        break;
                    default:
                        if (demo.demographic > 0) {
                            if (demo.origin != null) {
                                if (demo.origin === "O") {
                                    select += `, sta2.sta_demo_${demo.demographic}`;
                                    select += `, sta2.sta_demo_${demo.demographic}_code`;
                                    select += `, sta2.sta_demo_${demo.demographic}_name`;
                                } else {
                                    select += `, sta1.sta_demo_${demo.demographic}`;
                                    select += `, sta1.sta_demo_${demo.demographic}_code`;
                                    select += `, sta1.sta_demo_${demo.demographic}_name`;
                                }
                                if (demo.demographicItems !== null && demo.demographicItems.length > 0) {
                                    where += ` AND sta_demo_${demo.demographic} in ( ${demo.demographicItems.join()} )`;
                                } else {
                                    where += ` AND sta_demo_${demo.demographic} = ${demo.value} `;
                                }
                            }
                        }
                        break;
                }

            }

        });
    }
    return { select, where }
}

export const getDemographicsValue = (demographic: any, data: any) => {
    let demoValue: any = {
        idDemographic: demographic.id,
        demographic: demographic.name,
        encoded: demographic.encoded
    }
    if (demographic.encoded) {
        if (data[0] != null) {
            demoValue.codifiedId = +data[0],
                demoValue.codifiedCode = data[1],
                demoValue.codifiedName = data[2]
        }
        return demoValue;
    } else {
        demoValue.notCodifiedValue = data[0];
        return demoValue;
    }
}

//Obtiene el rango de fechas para las estadisticas
export const dateRange = async (startDate: any, endDate: any) => {
    let startYear = parseInt(startDate.substring(0, 4));
    let endYear = parseInt(endDate.substring(0, 4));
    let dates = [];
    for (let i = startYear; i <= endYear; i++) {
        let endMonth = i != endYear ? 11 : parseInt(endDate.substring(4, 6)) - 1;
        let startMon = i === startYear ? parseInt(startDate.substring(4, 6)) - 1 : 0;
        for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            let month = j + 1;
            let displayMonth = month < 10 ? '0' + month : month;
            let day = String(displayMonth) === startDate.substring(4, 6) ? startDate.substring(startDate.length - 2) : '01';
            let lastDay = lastDayMonth(i, displayMonth);
            lastDay = String(displayMonth) === endDate.substring(4, 6) ? endDate.substring(startDate.length - 2) : lastDay;
            dates.push({
                'start': [i, displayMonth, day].join('-'),
                'end': [i, displayMonth, lastDay].join('-')
            });
        }
    }
    return dates;
}

function lastDayMonth(year: any, month: any) {
    return new Date(year, month, 0).getDate();
}

//Funcion para desencriptar datos
export const decryptData = async (json: any) => {
    let data: any[] = [];
    const urlServices = process.env.URL_NT || "http://192.168.1.6:8080/Enterprise_NT_PRU/api";
    await axios.patch(urlServices + '/encode/decrypt', json)
        .then(function (response) {
            data = response.data;
            console.log('Respondio encriptación: ', toISOStringLocal(new Date()));
        }).catch(function (error) {
            console.log("Problemas con el servicio de desencriptar datos " + error);
        });
    return data;
}

export const getValueKey = async (value: string) => {
    const [key]: any = await db.query(" SELECT lab98c2 FROM lab98 WHERE lab98c1 = '" + value + "' ");
    return key[0].lab98c2;
}

export const getValueKeyWebQuery = async (value: string) => {
    const [key]: any = await db.query(" SELECT lab99c2 FROM lab99 WHERE lab99c1 = '" + value + "' ");
    return key[0].lab99c2;
}

//Funcion para ecriptar datos
export const encryptData = async (json: any) => {
    let data: any[] = [];
    const urlServices = process.env.URL_NT || "http://192.168.1.6:8080/Enterprise_NT_PRU/api";
    await axios.patch(urlServices + '/encode/encrypt', json)
        .then(function (response) {
            data = response.data;
            console.log('Respondio encriptación: ', toISOStringLocal(new Date()));
        }).catch(function (error) {
            console.log("Problemas con el servicio de desencriptar datos " + error);
        });
    return data;
}

function toISOStringLocal(d: any) {
    function z(n: any) { return (n < 10 ? '0' : '') + n }
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + ' ' + z(d.getHours()) + ':' +
        z(d.getMinutes()) + ':' + z(d.getSeconds())

}

export const getAgeAsString = (date: any, format: any) => {
    var age = getAge(date, format);
    if (age !== '') {
        var ageFields = age.split(".");
        if (Number(ageFields[0]) !== 0) {
            if (Number(ageFields[0]) === 1) {
                //Año
                return ageFields[0] + " " + "Año";
            } else {
                //Años
                return ageFields[0] + " " + "Años";
            }
        } else if (Number(ageFields[1]) !== 0) {
            if (Number(ageFields[1]) === 1) {
                //Mes
                return ageFields[1] + " " + "Mes";
            } else {
                //Meses
                return ageFields[1] + " " + "Meses";
            }
        } else {
            if (Number(ageFields[2]) === 1) {
                //Dia
                return ageFields[2] + " " + "Día";
            } else {
                //Dias
                return ageFields[2] + " " + "Días";
            }
        }
    } else {
        return "Edad no valida";
    }
}

export const getAge = (date: any, format: any) => {
    if (!moment(date, format, true).isValid()) {
        return "";
    }
    var birthday = moment(date, format).toDate();
    var current = new Date();
    var diaActual = current.getDate();
    var mesActual = current.getMonth() + 1;
    var anioActual = current.getFullYear();
    var diaInicio = birthday.getDate();
    var mesInicio = birthday.getMonth() + 1;
    var anioInicio = birthday.getFullYear();
    var b = 0;
    var mes = mesInicio;
    if (mes === 2) {
        if ((anioActual % 4 === 0 && anioActual % 100 !== 0) || anioActual % 400 === 0) {
            b = 29;
        } else {
            b = 28;
        }
    } else if (mes <= 7) {
        if (mes === 0) {
            b = 31;
        } else if (mes % 2 === 0) {
            b = 30;
        } else {
            b = 31;
        }
    } else if (mes > 7) {
        if (mes % 2 === 0) {
            b = 31;
        } else {
            b = 30;
        }
    }

    var anios = -1;
    var meses = -1;
    var dies = -1;
    if ((anioInicio > anioActual) || (anioInicio === anioActual && mesInicio > mesActual) ||
        (anioInicio === anioActual && mesInicio === mesActual && diaInicio > diaActual)) {
        return "";
    } else if (mesInicio <= mesActual) {
        anios = anioActual - anioInicio;
        if (diaInicio <= diaActual) {
            meses = mesActual - mesInicio;
            dies = diaActual - diaInicio;
        } else {
            if (mesActual === mesInicio) {
                anios = anios - 1;
            }
            meses = (mesActual - mesInicio - 1 + 12) % 12;
            dies = b - (diaInicio - diaActual);
        }
    } else {
        anios = anioActual - anioInicio - 1;
        if (diaInicio > diaActual) {
            meses = mesActual - mesInicio - 1 + 12;
            dies = b - (diaInicio - diaActual);
        } else {
            meses = mesActual - mesInicio + 12;
            dies = diaActual - diaInicio;
        }
    }
    return (anios < 10 ? "0" + anios : anios) + "." + (meses < 10 ? "0" + meses : meses) + "." + (dies < 10 ? "0" + dies : dies);
}

export const htmlEntities = (str: any) => {
    let valorhtml = String(str).replace(/&ntilde;/g, 'ñ')
        .replace(/\n/g, "  ")
        .replace(/&nbsp;/g, ' ')
        .replace(/['"]+/g, '')
        .replace(/<[^>]*>?/g, '')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&amp;/g, '&')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&Agrave;/g, 'À')
        .replace(/&Aacute;/g, 'Á')
        .replace(/&Acirc;/g, 'Â')
        .replace(/&Atilde;/g, 'Ã')
        .replace(/&Auml;/g, 'Ä')
        .replace(/&Aring;/g, 'Å')
        .replace(/&AElig;/g, 'Æ')
        .replace(/&Ccedil;/g, 'Ç')
        .replace(/&Egrave;/g, 'È')
        .replace(/&Eacute;/g, 'É')
        .replace(/&Ecirc;/g, 'Ê')
        .replace(/&Euml;/g, 'Ë')
        .replace(/&Igrave;/g, 'Ì')
        .replace(/&Iacute;/g, 'Í')
        .replace(/&Icirc;/g, 'Î')
        .replace(/&Iuml;/g, 'Ï')
        .replace(/&ETH;/g, 'Ð')
        .replace(/&Ntilde;/g, 'Ñ')
        .replace(/&Ograve;/g, 'Ò')
        .replace(/&Oacute;/g, 'Ó')
        .replace(/&Ocirc;/g, 'Ô')
        .replace(/&Otilde;/g, 'Õ')
        .replace(/&Ouml;/g, 'Ö')
        .replace(/&Oslash;/g, 'Ø')
        .replace(/&Ugrave;/g, 'Ù')
        .replace(/&Uacute;/g, 'Ú')
        .replace(/&Ucirc;/g, 'Û')
        .replace(/&Uuml;/g, 'Ü')
        .replace(/&Yacute;/g, 'Ý')
        .replace(/&THORN;/g, 'Þ')
        .replace(/&szlig;/g, 'ß')
        .replace(/&agrave;/g, 'à')
        .replace(/&aacute;/g, 'á')
        .replace(/&acirc;/g, 'â')
        .replace(/&atilde;/g, 'ã')
        .replace(/&auml;/g, 'ä')
        .replace(/&aring;/g, 'å')
        .replace(/&aelig;/g, 'æ')
        .replace(/&ccedil;/g, 'ç')
        .replace(/&egrave;/g, 'è')
        .replace(/&eacute;/g, 'é')
        .replace(/&ecirc;/g, 'ê')
        .replace(/&euml;/g, 'ë')
        .replace(/&igrave;/g, 'ì')
        .replace(/&iacute;/g, 'í')
        .replace(/&icirc;/g, 'î')
        .replace(/&iuml;/g, 'ï')
        .replace(/&eth;/g, 'ð')
        .replace(/&ntilde;/g, 'ñ')
        .replace(/&ograve;/g, 'ò')
        .replace(/&oacute;/g, 'ó')
        .replace(/&ocirc;/g, 'ô')
        .replace(/&otilde;/g, 'õ')
        .replace(/&ouml;/g, 'ö')
        .replace(/&oslash;/g, 'ø')
        .replace(/&ugrave;/g, 'ù')
        .replace(/&uacute;/g, 'ú')
        .replace(/&ucirc;/g, 'û')
        .replace(/&uuml;/g, 'ü')
        .replace(/&yacute;/g, 'ý')
        .replace(/&thorn;/g, 'þ')
        .replace(/&yuml;/g, 'ÿ')
        .replace(/<[^>]+>/gm, '')
        .replace(/<br\s*\/?>/g, '');

    return replaceAll(valorhtml, ";", '');
}

export const replaceAll = (str: any, find: any, replace: any) => {
    let escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

export const arrayDatesRange = async (start: any, end: any, days: number) => {
    const dates: any[] = [];

    // Extraer los años de las fechas de inicio y fin
    let startYear = start.substring(0, 8);
    let endYear = end.substring(0, 8);

    // Crear objetos moment para las fechas de inicio y fin
    let initDate = moment(startYear);
    let endDate = moment(endYear);

    while (initDate <= endDate) {
        let currentYear = initDate.year();
        let finalEnd = moment(initDate).add(days, 'days');

        // Si finalEnd cruza al siguiente año, ajustamos finalEnd al último día del año actual
        if (finalEnd.year() > currentYear) {
            finalEnd = moment(`${currentYear}-12-31`);
        }

        // Si finalEnd es mayor que endDate, ajustamos finalEnd a endDate
        if (finalEnd > endDate) {
            finalEnd = endDate;
        }

        dates.push({
            'start': moment(initDate).format('YYYY-MM-DD'),
            'end': finalEnd.format('YYYY-MM-DD')
        });

        // Incrementar initDate sumando days + 1 días
        initDate = moment(finalEnd).add(1, 'days');
    }

    return dates;
}

//validar token
export const validateToken = async (token: string): Promise<number> => {
    try {
        // Validar la estructura del token antes de decodificar
        if (!token.includes('.')) {
            throw new EnterpriseNTTokenException('Invalid token structure');
        }
        // Verificar y decodificar el token
        const { payload } = await jwtVerify(token, JWT_KEY, {
            audience: JWT_AUDIENCE,
            issuer: JWT_ISSUER,

            clockTolerance: 60
        }) as JWTVerifyResult<JWTPayload>;

        // Validar que todos los claims necesarios están presentes
        if (!payload.id) throw new EnterpriseNTTokenException('Claim id not found in token');
        if (!payload.lastName) throw new EnterpriseNTTokenException('Claim lastName not found in token');
        if (!payload.name) throw new EnterpriseNTTokenException('Claim name not found in token');
        if (!payload.user) throw new EnterpriseNTTokenException('Claim user not found in token');

        // Validar la expiración del token
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            throw new EnterpriseNTTokenException('Token has expired');
        }
        //rerorna el id del token como un entero

        return parseInt(payload.id.toString());
    } catch (error) {

        return 0;

    }
};