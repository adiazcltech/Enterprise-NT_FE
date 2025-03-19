import moment from "moment";
import { getAgeAsString, getDemographicsValue, htmlEntities } from "../tools/common";
import { db } from "./config/conection";
import axios from "axios";
import { buildSQLDemographicFilter, createDemographicsQuery } from "../tools/resultschecking/management";
import { listDemographics } from "./demographics";

const urlServices = process.env.URL_NT || "http://192.168.1.6:8080/Enterprise_NT_PRU/api";


const getResolution = async (body: any) => {

    const authLogin = body.authToken
    // let respAudh = await login(authLogin);
    if(!authLogin) {
        return 501;
    }

    console.log("Inicia el proceso ", toISOStringLocal(new Date()));
 
    //Digitos de la orden
    let orderDigits = await getValueKey('DigitosOrden');

    let account = await getValueKey('ManejoCliente') === 'True';
    let physician = await getValueKey('ManejoMedico') === 'True';
    let rate = await getValueKey('ManejoTarifa') === 'True';
    let checkCentralSystem = await getValueKey('ConsultarSistemaCentral') === 'True';
    let documenttype = await getValueKey('ManejoTipoDocumento') === 'True';
    let race = await getValueKey('ManejoRaza') === 'True';
    let service = await getValueKey('ManejoServicio') === 'True';
    let idCentralSystem = 0;
    if(checkCentralSystem) {
        idCentralSystem = await getValueKey('SistemaCentralListados');
    }
 
    let orderInit = body.init + "0".repeat(orderDigits);
    let orderEnd = body.end + "9".repeat(orderDigits);
 
    const startYear = body.init.substring(0, 4);
    const endYear = body.end.substring(0, 4);
 
    //Historicos
    let years = [];
    let yearTraveled = +startYear;
    while (yearTraveled <= +endYear) {
        years.push(yearTraveled);
        yearTraveled++;
    }
 
    let list: any[] = [];
    // Consulta
    const demographics = await listDemographics(1);
 
    await Promise.all(
        years.map(async (year) => {

            let json = {
                account,
                physician,
                rate,
                race,
                checkCentralSystem,
                documenttype,
                service,
                idCentralSystem,
                comment: body.comment,
                demographicsFilter: body.demographics,
                profiles: body.profiles,
                tests: body.listTests,
                demographics: demographics
            }

            let response = await getResolutionByYear(year, orderInit, orderEnd, json);
            if (response.length > 0) {
                response.forEach((order: any) => {
                    if (list[order.lab22c1] === undefined || list[order.lab22c1] === null) {
                        const age = getAgeAsString(moment(order.lab21c7).format('DD/MM/YYYY'), 'DD/MM/YYYY');
                        const unityYears = age.split(" ");
                        const birthday = (new Date(order.lab21c7)).toISOString().split("T");
 
                        let address = order.lab21c17 === null || order.lab21c17 === undefined || order.lab21c17 === "" ? "" : order.lab21c17.replace(/<br\s*\/?>/g, '');
                        address = address === null || address === undefined || address === "" ? "" : htmlEntities(address);
                        address = address.replaceAll(',', '');
                        address = address.replace(/(\r\n|\n|\r)/gm, "");
 
                        list[order.lab22c1] = {
                            order: order.lab22c1,
                            orderCreation: moment(order.lab22c3).format('DD/MM/YYYY HH:mm:ss'),
                            patientId: order.lab21c2,
                            name1: order.lab21c3,
                            name2: order.lab21c4,
                            lastName: order.lab21c5,
                            surName: order.lab21c6,
                            nameBranch: order.lab05c4,
                            age: unityYears[0],
                            unityYears: unityYears[1],
                            birthday: birthday[0],
                            address: address,
                            email: order.lab21c8,
                            phone: order.lab21c16,
                            orderStatus: order.lab07c1 === 0 ? 2 : 1,
                            sex: {
                                code: order.lab80c3,
                                esCo: order.lab80c4,
                            },
                            documentType: {},
                            tests: [],
                            service: {},
                            account: {},
                            physician: {},
                            rate: {},
                            race: {},
                            allDemographics: [],
                            balance: order.lab902c9 === null || order.lab902c9 === undefined ? 0 : order.lab902c9,
                            discount: order.lab901c3 === null || order.lab901c3 === undefined ? 0 : order.lab901c3,
                            payments: order.lab902c8 === null || order.lab902c8 === undefined ? 0 : order.lab902c8
                        }

                        if (json.documenttype) {
                            list[order.lab22c1].documentType = {
                                id:     order.lab21lab54lab54c1,
                                abbr:   order.lab21lab54lab54c2,
                                name:   order.lab21lab54lab54c3
                            }
                        }
                        if (json.service) {
                            list[order.lab22c1].service = {
                                id:         order.lab10c1,
                                code:       order.lab10c7,
                                name:       order.lab10c2
                            }
                        }
                        if (json.account) {
                            list[order.lab22c1].account = {
                                nit:                            order.lab14c2,
                                id:                             order.lab14c1,
                                name:                           order.lab14c3,
                                encryptionReportResult:         order.lab14c32
                            }
                        }
                        if (json.physician) {
                            list[order.lab22c1].physician = {
                                id:         order.lab19c1,
                                name:       order.lab19c2,
                                email:      order.lab19c21
                            }
                        }
                        if (json.rate) {
                            list[order.lab22c1].rate = {
                                id:         order.lab904c1,
                                code:       order.lab904c2,
                                name:       order.lab904c3
                            }
                        }

                        if (json.race) {
                            list[order.lab22c1].race = {
                                id:         order.lab21lab08lab08c1,
                                code:       order.lab21lab08lab08c5,
                                name:       order.lab21lab08lab08c2
                            }
                        }

                        let demosOrder:any = [];
                        if(json.demographics) {
                            json.demographics.forEach( async (demo:any) => {
                                let data = [];
                                if(demo.encoded) {
                                    data[0] =  order[`demo${demo.id}_id`];
                                    data[1] =  order[`demo${demo.id}_code`];
                                    data[2] =  order[`demo${demo.id}_name`];
                                } else {
                                    data[0] =  order[`lab_demo_${demo.id}`];
                                }
                                let demoValue = await getDemographicsValue(demo,data);
                                demosOrder.push(demoValue);
                            });
                            list[order.lab22c1].allDemographics = demosOrder;
                        }
                    }
 
                    if (list[order.lab22c1].tests === undefined && list[order.lab22c1].tests === null) {
                        list[order.lab22c1].tests = [];
                    } else {
                        let validateTest = list[order.lab22c1].tests.find((test: any) => test.idTest === order.lab39c1);
                        if (!validateTest) {
 
                            //Fecha de ingreso
                            let entryDate = [];
                            let entryTime = [];
                            let tomaDate = [];
                            let tomaTime = [];
                            if (order.lab57c4 !== null && order.lab57c4 !== undefined && order.lab57c4 !== '') {
                                entryDate = (new Date(order.lab57c4)).toISOString().split("T");
                                entryTime = entryDate[1].split(".");
                            } else {
                                entryDate[0] = '';
                                entryTime[0] = '';
                            }
                            if (order.lab57c39 !== null && order.lab57c39 !== undefined && order.lab57c39 !== '') {
                                tomaDate = (new Date(order.lab57c39)).toISOString().split("T");
                                tomaTime = tomaDate[1].split(".");
                            }
                            else {
                                tomaDate[0] = '';
                                tomaTime[0] = '';
                            }
                            //Fecha de validacion 
                            let validationDate = [];
                            let validationTime = [];
 
                            if (order.lab57c18 !== null && order.lab57c18 !== undefined && order.lab57c18 !== '') {
                                validationDate = (new Date(order.lab57c18)).toISOString().split("T");
                                validationTime = validationDate[1].split(".");
                            } else {
                                validationDate[0] = '';
                                validationTime[0] = '';
                            }
 
                            //Fecha de resultado
                            let resultDate = [];
                            let resultTime = [];
 
                            if (order.lab57c2 !== null && order.lab57c2 !== undefined && order.lab57c2 !== '') {
                                resultDate = (new Date(order.lab57c2)).toISOString().split("T");
                                resultTime = resultDate[1].split(".");
                            } else {
                                resultDate[0] = '';
                                resultTime[0] = '';
                            }

                            //Fecha de verificacion
                            let verificationDate = [];
                            if (order.lab57c37 !== null && order.lab57c37 !== undefined && order.lab57c37 !== '') {
                                verificationDate = (new Date(order.lab57c37)).toISOString().split("T");
                            } else {
                                verificationDate[0] = '';
                            }
                            
 
                            //Comentario del resultado
                            let comment = null;
                            if (body.comment) {
                                comment = order.lab95c1 === null || order.lab95c1 === undefined || order.lab95c1 === "" ? "" : order.lab95c1.replace(/<br\s*\/?>/g, '');
                                comment = comment === null || comment === undefined || comment === "" ? "" : htmlEntities(comment);
                                comment = comment.replaceAll(',', '');
                                comment = comment.replace(/(\r\n|\n|\r)/gm, "");
                            }
 
                            list[order.lab22c1].tests.push({
                                idTest: order.lab39c1,
                                codeArea: order.lab43c2,
                                nameArea: order.lab43c4.trim(),
                                codeTest: order.lab39c2,
                                nameTest: order.lab39c4.replaceAll(',', ''),
                                result: order.lab57c1,
                                testComment: comment,
                                testStatus: 1,
                                cups: order.lab61c1,
                                userValidation: order.lab04c4 === undefined ? "" : order.lab04c4,
                                insurancePrice: order.lab900c4 === null || order.lab900c4 === undefined ? 0 : order.lab900c4,
                                testPrice: order.lab900c3 === null || order.lab900c3 === undefined ? 0 : order.lab900c3,
                                testTax: order.lab900c5 === null || order.lab900c5 === undefined ? 0 : order.lab900c5,
                                entryDate: entryDate[0],
                                entryTime: entryTime[0],
                                validationDate: validationDate[0],
                                validationTime: validationTime[0],
                                resultDate: resultDate[0],
                                resultTime: resultTime[0],
                                verificationDate: verificationDate[0],
                            });
                        }
                    }
                });
            }
        })
    );



    await Promise.all(
        years.map(async (year) => {
            let response = await getResolutionByYearRemoveTest(year, orderInit, orderEnd );
            if (response.length > 0) {
                response.forEach((order: any) => {
                    if (list[order.lab22c1] === undefined || list[order.lab22c1] === null) {

                        const age = getAgeAsString(moment(order.lab21c7).format('DD/MM/YYYY'), 'DD/MM/YYYY');
                        const unityYears = age.split(" ");
                        const birthday = (new Date(order.lab21c7)).toISOString().split("T");

                        let address = order.lab21c17 === null || order.lab21c17 === undefined || order.lab21c17 === "" ? "" : order.lab21c17.replace(/<br\s*\/?>/g, '');
                        address = address === null || address === undefined || address === "" ? "" : htmlEntities(address);
                        address = address.replaceAll(',', '');
                        address = address.replace(/(\r\n|\n|\r)/gm, "");

                        list[order.lab22c1] = {
                            order: order.lab22c1,
                            patientId: order.lab21c2,
                            name1: order.lab21c3,
                            name2: order.lab21c4,
                            lastName: order.lab21c5,
                            surName: order.lab21c6,
                            age: unityYears[0],
                            unityYears: unityYears[1],
                            birthday: birthday[0],
                            address: address,
                            email: order.lab21c8,
                            phone: order.lab21c16,
                            orderStatus: order.lab07c1 === 0 ? 2 : 1,
                            sex: {
                                code: order.lab80c3,
                                esCo: order.lab80c4
                            },
                            documentType: {
                                abbr: order.lab21lab54lab54c2
                            },
                            codeRate: order.lab904c2 == undefined ? "" : order.lab904c2,
                            nameRate: order.lab904c3 == undefined ? "" : order.lab904c3,
                            physician: (order.lab19c2 === undefined || order.lab19c2 === null ? "" : order.lab19c2) + " " + (order.lab19c3 === undefined || order.lab19c3 === null ? "" : order.lab19c3),
                            tests: [],
                            valuePyP: "",
                            valuesubAccount: "",
                            valuenumberAtt: "",
                            valuenumEntry: "",
                            valuebranch: "",
                            codebranch: "",
                            valueKeyInt: ""
                        }

                        list[order.lab22c1].rate = {
                            id:         order.lab904c1,
                            code:       order.lab904c2,
                            name:       order.lab904c3
                        }
                        
                    }

                    if (list[order.lab22c1].tests === undefined && list[order.lab22c1].tests === null) {
                        list[order.lab22c1].tests = [];
                    } else {
                        let validateTest = list[order.lab22c1].tests.find((test: any) => test.idTest === order.lab39c1);
                        if (!validateTest) {

                            //Fecha de ingreso
                            let entryDate = [];
                            let entryTime = [];
                            if (order.lab57c4 !== null && order.lab57c4 !== undefined && order.lab57c4 !== '') {
                                entryDate = (new Date(order.lab57c4)).toISOString().split("T");
                                entryTime = entryDate[1].split(".");
                            } else {
                                entryDate[0] = '';
                                entryTime[0] = '';
                            }

                            //Fecha de validacion 
                            let validationDate = [];
                            let validationTime = [];

                            if (order.lab57c18 !== null && order.lab57c18 !== undefined && order.lab57c18 !== '') {
                                validationDate = (new Date(order.lab57c18)).toISOString().split("T");
                                validationTime = validationDate[1].split(".");
                            } else {
                                validationDate[0] = '';
                                validationTime[0] = '';
                            }

                            //Fecha de resultado
                            let resultDate = [];
                            let resultTime = [];

                            if (order.lab57c2 !== null && order.lab57c2 !== undefined && order.lab57c2 !== '') {
                                resultDate = (new Date(order.lab57c2)).toISOString().split("T");
                                resultTime = resultDate[1].split(".");
                            } else {
                                resultDate[0] = '';
                                resultTime[0] = '';
                            }

                            //Comentario del resultado
                            let comment = null;
                            if (body.comment) {
                                comment = order.lab95c1 === null || order.lab95c1 === undefined || order.lab95c1 === "" ? "" : order.lab95c1.replace(/<br\s*\/?>/g, '')
                                comment = comment === null || comment === undefined || comment === "" ? "" : htmlEntities(comment);
                                comment = comment.replaceAll(',', '');
                                comment = comment.replace(/(\r\n|\n|\r)/gm, "");
                            }

                            list[order.lab22c1].tests.push({
                                idTest: order.lab39c1,
                                codeArea: order.lab43c2,
                                nameArea: order.lab43c4,
                                codeTest: order.lab39c2,
                                nameTest: order.lab39c4,
                                result: order.lab57c1,
                                testComment: comment,
                                testStatus: 2,
                                cups: order.lab61c1,
                                userValidation: order.lab04c4 === undefined ? "" : order.lab04c4,
                                insurancePrice: order.lab900c4,
                                entryDate: entryDate[0],
                                entryTime: entryTime[0],
                                validationDate: validationDate[0],
                                validationTime: validationTime[0],
                                resultDate: resultDate[0],
                                resultTime: resultTime[0],
                               
                            });
                        }
                    }
                });
            }
        })
    );


 
    let finalData = Object.values(list);
    const decrypt: any = {};
    if (finalData.length > 0) {
        finalData.forEach((result: any) => {
            decrypt[`${result.order}_document`] = result.patientId;
            decrypt[`${result.order}_name1`] = result.name1;
            decrypt[`${result.order}_name2`] = result.name2;
            decrypt[`${result.order}_lastName`] = result.lastName;
            decrypt[`${result.order}_surName`] = result.surName;
            result.tests.forEach((test: any) => {
                if (test.result !== undefined && test.result !== null && test.result !== "") {
                    decrypt[`${result.order}_${test.idTest}`] = test.result;
                }
            });
        });
        let listOfData: any = await decryptData(decrypt);
        if (listOfData !== null && listOfData !== undefined && Object.keys(listOfData).length > 0) {
            finalData.forEach((result) => {
                result.patientId = listOfData[`${result.order}_document`];
                result.name1 = listOfData[`${result.order}_name1`];
                result.name2 = listOfData[`${result.order}_name2`];
                result.lastName = listOfData[`${result.order}_lastName`];
                result.surName = listOfData[`${result.order}_surName`];
                result.name1 = result.name1 === null || result.name1 === undefined || result.name1 === "" ? "" : result.name1.trim();
                result.name2 = result.name2 === null || result.name2 === undefined || result.name2 === "" ? "" : result.name2.trim();
                result.lastName = result.lastName === null || result.lastName === undefined || result.lastName === "" ? "" : result.lastName.trim();
                result.surName = result.surName === null || result.surName === undefined || result.surName === "" ? "" : result.surName.trim();
                result.tests.forEach((test: any) => {
                    if (test.result !== undefined && test.result !== null && test.result !== "") {
                        test.result = listOfData[`${result.order}_${test.idTest}`];
                        let resultDes = test.result === null || test.result === undefined || test.result === "" ? "" : test.result.replace(/<br\s*\/?>/g, '');
                        resultDes = resultDes.replaceAll(',', '');
                        resultDes = resultDes.replace(/(\r\n|\n|\r)/gm, "");
                        test.result = resultDes;
                    }
                });
            });
        } else {
            return 501;
        }
    }
    console.log("Finalizo el proceso ", toISOStringLocal(new Date()));
    console.log("====================================");
    return Object.values(list);
}

function toISOStringLocal(d:any) {
    function z(n:any){return (n<10?'0':'') + n}
    return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
           z(d.getDate()) + ' ' + z(d.getHours()) + ':' +
           z(d.getMinutes()) + ':' + z(d.getSeconds())
            
}

const getValueKey = async (value: string) => {
    const [key]: any = await db.query(" SELECT lab98c2 FROM lab98 WHERE lab98c1 = '"+ value +"' ");
    return key[0].lab98c2;
}

const getResolutionByYear =  async (year: number, orderInit: string, orderEnd: string, json: any) => {

    let currentYear = new Date().getFullYear();
    let lab22 = year === currentYear ? "lab22" : "lab22_" + year;
    let lab57 = year === currentYear ? "lab57" : "lab57_" + year;
    let lab95 = year === currentYear ? "lab95" : "lab95_" + year;
    let lab900 = year === currentYear ? "lab900" : "lab900_" + year;

    let query = ` SELECT lab57.lab22c1, lab57.lab39c1, lab57c14, lab57c16, lab57c25, lab22c3, lab21c2, lab21c3, lab21c4, lab21c5, lab21c6, s.lab80c1, s.lab80c3, s.lab80c4, 
                s.lab80c5, lab21c7, lab21c17, lab21c8, lab21c16, lab22c3, lab22.lab07c1, lab39.lab43c1, lab43c2  , lab43c3, lab43c4, lab39.lab07c1 as testStatus, 
                lab39c2, lab39c4, lab39c37, lab57c4,lab57c39, lab39c4, lab57c8, lab57c1, lab57c18, lab57c2, lab57c34, lab57c37, uv.lab04c2, uv.lab04c3, uv.lab04c4, lab05c4, lab95c1 , 
                lab900c2, lab900c3, lab900c4, lab900c5 , lab901.lab901c3`;

    let from = ` FROM ${lab57} AS lab57 
                INNER JOIN ${lab22} AS lab22 ON lab22.lab22c1 = lab57.lab22c1
                INNER JOIN lab05 ON lab05.lab05c1 = lab22.lab05c1  
                INNER JOIN lab21 ON lab21.lab21c1 = lab22.lab21c1  
                INNER JOIN lab39 ON lab39.lab39c1 = lab57.lab39c1  
                INNER JOIN lab80 s ON s.lab80c1 = lab21.lab80c1 
                INNER JOIN lab43 ON lab43.lab43c1 = lab39.lab43c1 
                LEFT JOIN lab04 uv ON lab57.lab57c19 = uv.lab04c1 
                LEFT JOIN ${ lab900 } AS lab900 ON lab900.lab22c1 = lab57.lab22c1 AND lab900.lab39c1 = lab57.lab39c1   
                LEFT join lab901 on lab900.lab901c1p = lab901.lab901c1
                LEFT JOIN ${ lab95 } AS lab95 ON lab95.lab22c1 = lab57.lab22c1 AND lab95.lab39c1 = lab57.lab39c1
    `;

    if (json.account) {
        query += `, lab22.lab14c1,  lab14c2, lab14c3`;
        from += ` LEFT JOIN lab14 ON lab14.lab14c1 = lab22.lab14c1 `;
    }

    if (json.service) {
        query += " , lab22.lab10c1, lab10c2, lab10c7 ";
        from += " LEFT JOIN lab10 ON lab10.lab10c1 = lab22.lab10c1  ";
    }

    if (json.physician) {
        query += ` ,lab22.lab19c1,  lab19c2, lab19c3 `
        from += ` LEFT JOIN lab19 ON lab19.lab19c1 = lab22.lab19c1  `
    }
    if (json.rate) {
        query += ` , lab22.lab904c1, lab904c2, lab904c3 , lab902.lab902c9 ,lab902c8`
        from += ` LEFT JOIN lab904 ON lab904.lab904c1 = lab22.lab904c1  
                  LEFT JOIN lab902 on lab904.lab904c1 = lab902.lab904c1 and lab902.lab22c1 = lab22.lab22c1`
    }
    
    if (json.documenttype) {
        query += ` ,lab21lab54.lab54c1 AS lab21lab54lab54c1,  lab21lab54.lab54c2 AS lab21lab54lab54c2, lab21lab54.lab54c3 AS lab21lab54lab54c3 `
        from += ` LEFT JOIN lab54 lab21lab54 ON lab21lab54.lab54c1 = lab21.lab54c1  `
    }

    if (json.race) {
        query += " , lab21lab08.lab08c1 AS lab21lab08lab08c1, lab21lab08.lab08c2 AS lab21lab08lab08c2, lab21lab08.lab08c5 AS lab21lab08lab08c5 ";
        from += " LEFT JOIN lab08 lab21lab08 ON lab21lab08.lab08c1 = lab21.lab08c1  ";
    }
    
    if (json.checkCentralSystem) {
        query += ` , lab61c1 `;
        from += `LEFT JOIN lab61 ON lab61.lab39c1 = lab57.lab39c1 and lab61.lab118c1 = ${json.idCentralSystem} `;
    }

    if(json.demographics !== null && json.demographics !== undefined && json.demographics.length > 0) {
        let querysDemos:any = await createDemographicsQuery(json.demographics.filter((demo:any) => demo.id > 0));
        query += querysDemos.select;
        from += querysDemos.from;
    }

    from += " WHERE lab22.lab22c1 BETWEEN '" + orderInit + "' AND "+ "'" + orderEnd + "'";

    if(json.profiles) {
        from += " AND lab57.lab57c14 IS NULL ";
    }

    if(json.tests !== null && json.tests !== undefined && json.tests.length > 0) {
        from += ` AND lab57.lab39c1 IN ( ${json.tests.join()} ) `;  
    }

    let finalQuery = undefined;

    if (json.demographicsFilter !== null && json.demographicsFilter !== undefined && json.demographicsFilter.length > 0) {
        finalQuery = await buildSQLDemographicFilter(json.demographicsFilter, query, from);
    }

    if (finalQuery !== undefined) {
        query = finalQuery.select;
        from = finalQuery.where;
    }
    //console.log(query + from);
    const [results] = await db.query(query + from);
    
    console.log('Respondio normal ', toISOStringLocal(new Date()));

    return results;
}

const getResolutionByYearRemoveTest =  async (year: number, orderInit: string, orderEnd: string) => {

    let currentYear = new Date().getFullYear();
    let lab22 = year === currentYear ? "lab22" : "lab22_" + year;
    let lab57 = year === currentYear ? "lab57" : "lab57_" + year;
    let lab03 = year === currentYear ? "lab03" : "lab03_" + year;


    let query = `SELECT DISTINCT lab03.lab22c1 , lab39.lab39c1 , lab21c2, lab21c3, lab21c4, lab21c5, lab21c6, s.lab80c3, s.lab80c4, lab21c7, 
    lab21c17, lab21c8, lab21c16, lab22.lab07c1, lab43c2, lab43c4, lab39c2, lab39c4, lab904c2, lab904c3, lab19c2, lab19c3, lab61c1 ,
    lab21lab54.lab54c2 AS lab21lab54lab54c2, lab22c3 `;

    let from = ` FROM ${lab22} AS lab22 
    INNER JOIN ${lab03} AS lab03 ON lab03.lab22c1 = lab22.lab22c1 AND lab03c2 = 'D' AND lab03c3 = 'T' 
    INNER JOIN lab39 ON lab39.lab39c1 = lab03.lab03c1 
    INNER JOIN lab21 ON lab21.lab21c1 = lab22.lab21c1
    LEFT JOIN lab54 lab21lab54 ON lab21lab54.lab54c1 = lab21.lab54c1
    INNER JOIN lab80 s ON s.lab80c1 = lab21.lab80c1
    INNER JOIN lab43 ON lab43.lab43c1 = lab39.lab43c1
    LEFT JOIN lab904 ON lab904.lab904c1 = lab22.lab904c1
    LEFT JOIN lab19 ON lab19.lab19c1 = lab22.lab19c1
    INNER JOIN lab61 ON lab61.lab39c1 = lab39.lab39c1 and lab61.lab118c1 = 1 AND lab61c1 != ''
      WHERE lab22.lab22c1 BETWEEN '${orderInit}' AND '${orderEnd}'
        AND NOT EXISTS (SELECT 1 FROM ${lab57} as lab57 WHERE lab39c1 = lab03.lab03c1 AND lab57.lab22c1 = lab03.lab22c1 AND lab57.lab22c1 BETWEEN '${orderInit}' AND '${orderEnd}')
    `;
    console.log(query + from);
    const [results] = await db.query(query + from).finally(() => {
        console.log('Cierra conexión con la base de datos del lis');
       // db.connectionManager.close();
    });

    console.log('Respondio auditoria ', toISOStringLocal(new Date()));

    return results;
}

const decryptData = async (json : any) => {
    let data : any[] = [];
    await axios.patch(urlServices + '/encode/decrypt', json)
        .then(function (response) {
            data = response.data;
            console.log('Respondio encriptación ', toISOStringLocal(new Date()));
        }).catch(function (error) {
            console.log("Problemas con el servicio de desencriptar datos " + error);
        });
    return data;
}

const login = async (authJson : any) => {
    let data = null;
    await axios.post(urlServices + '/authentication', authJson)
        .then(function (response) {
            data = response.data;
            console.log('Respondio autenticación ', toISOStringLocal(new Date()));
        }).catch(function (error) {
            console.log("Problemas con la autenticación" + error);
        });
    return data;
}

export default getResolution;
