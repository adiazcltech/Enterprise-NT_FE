//import moment from "moment";
import { decryptData, encryptData,  getValueKey } from "../tools/common";
import { mapData, mapQuery } from "../tools/cube";
import { db } from "./config/conection";
import { buildSQLDemographicFilter } from "../tools/resultschecking/management";

export const getDataCube = async (body:any, iduser:number) => {

    //Digitos de la orden
    let orderDigits = await getValueKey('DigitosOrden');
    let centralSystem = await getValueKey('SistemaCentralListados');
    let entity = await getValueKey('Entidad');;
    let nit = await getValueKey('NITEntidad');

    const info = { entity, nit }

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

    const filterByEncriptData = body.demographics.filter( (demo:any) => demo.demographic === -100 ||  demo.demographic === -101 ||  demo.demographic === -102 || demo.demographic === -103 ||  demo.demographic === -109);
    if(filterByEncriptData.length) {
        const encryptDataFilter: any = {};
        filterByEncriptData.forEach( (demo:any) => {
            encryptDataFilter[`${demo.demographic}`] = demo.value;
        });
        if(Object.values(encryptDataFilter).length > 0) {
            let data: any = await encryptData(encryptDataFilter);
            if (data !== null && data !== undefined && Object.keys(data).length > 0) {
                filterByEncriptData.forEach( (demo:any) => {
                    const findDemo = body.demographics.find( (demoFilter:any) => demoFilter.demographic === demo.demographic);
                    if(findDemo) {
                        findDemo.value = data[`${demo.demographic}`];
                    }
                });
            }
        }
    }
    
    let list:any = [];
    await Promise.all(
        years.map(async (year) => {
            let { select, from } = await mapQuery(body, year, centralSystem);
            let json = {
                select, 
                from,
                orderInit,
                orderEnd,
                profiles        : body.profiles,
                areas           : body.listAreas,
                demographics    : body.demographics,
                tests           : body.listTests,
                iduser
            }
            let response = await getData(json);
            if (response.length > 0) {
                const result = await mapData(body, response, centralSystem, info);
                if(list.length > 0) {
                    list = [{...list}, {...result}];
                } else {
                    list = result;
                }
            }
        })
    );


    let finalData = Object.values(list);
    const decrypt: any = {};
    if (finalData.length > 0) {
        finalData.forEach((data: any) => {
            if(data.patient) {
                if(data.patient.patientId) {
                    decrypt[`${data.orderNumber}_document`] = data.patient.patientId;
                }
                if(data.patient.name1) {
                    decrypt[`${data.orderNumber}_name1`] = data.patient.name1;
                }
                if(data.patient.name2) {
                    decrypt[`${data.orderNumber}_name2`] = data.patient.name2;
                }
                if(data.patient.lastName) {
                    decrypt[`${data.orderNumber}_lastName`] = data.patient.lastName;
                }
                if(data.patient.surName) {
                    decrypt[`${data.orderNumber}_surName`] = data.patient.surName;
                }
            }
            if(data.tests.length > 0) {
                data.tests.forEach((test: any) => {
                    if (test.result !== undefined && test.result !== null && test.result !== "") {
                        decrypt[`${data.orderNumber}_${test.idTest}`] = test.result;
                    }
                });
            }
        });
        if(Object.values(decrypt).length > 0) {
            let listOfData: any = await decryptData(decrypt);
            if (listOfData !== null && listOfData !== undefined && Object.keys(listOfData).length > 0) {
                finalData.forEach((data:any) => {
                    if(data.patient) {
                        if(data.patient.patientId) {
                            data.patient.patientId = listOfData[`${data.orderNumber}_document`];
                        }
                        if(data.patient.name1) {
                            data.patient.name1 = listOfData[`${data.orderNumber}_name1`];
                            data.patient.name1 = data.patient.name1 === null || data.patient.name1 === undefined || data.patient.name1 === "" ? "" : data.patient.name1.trim();
                        }
                        if(data.patient.name2) {
                            data.patient.name2 = listOfData[`${data.orderNumber}_name2`];
                            data.patient.name2 = data.patient.name2 === null || data.patient.name2 === undefined || data.patient.name2 === "" ? "" : data.patient.name2.trim();
                        }
                        if(data.patient.lastName) {
                            data.patient.lastName = listOfData[`${data.orderNumber}_lastName`];
                            data.patient.lastName = data.patient.lastName === null || data.patient.lastName === undefined || data.patient.lastName === "" ? "" : data.patient.lastName.trim();
                        }
                        if(data.patient.surName) {
                            data.patient.surName = listOfData[`${data.orderNumber}_surName`];
                            data.patient.surName = data.patient.surName === null || data.patient.surName === undefined || data.patient.surName === "" ? "" : data.patient.surName.trim();
                        }
                    }
                    if(data.tests.length > 0) {
                        data.tests.forEach((test: any) => {
                            if (test.result !== undefined && test.result !== null && test.result !== "") {
                                test.result = listOfData[`${data.orderNumber}_${test.idTest}`];
                                let resultDes = test.result === null || test.result === undefined || test.result === "" ? "" : test.result.replace(/<br\s*\/?>/g, '');
                                resultDes = resultDes.replaceAll(',', '');
                                resultDes = resultDes.replace(/(\r\n|\n|\r)/gm, "");
                                test.result = resultDes;
                            }
                        });
                    }
                });
            } else {
                return 501;
            }
        }
    }
    return finalData;

};


const getData = async (json: any) => {
    let conditions = [];

    conditions.push(`lab22.lab22c1 BETWEEN '${json.orderInit}' AND '${json.orderEnd}'`);

    if (json.iduser) {
        conditions.push(`lab93.lab04c1 = ${json.iduser}`);
    }

    if (json.profiles) {
        conditions.push(`lab57.lab57c14 IS NULL`);
    }

    if (json.tests && json.tests.length > 0) {
        conditions.push(`lab57.lab39c1 IN (${json.tests.join()})`);
    }

    let finalQuery = undefined;
    let where = `WHERE ${conditions.join(' AND ')}`
    if (json.demographics && json.demographics.length > 0) {
        finalQuery = await buildSQLDemographicFilter(json.demographics, json.select, where);
    }
 
    if (finalQuery) {
        json.select = finalQuery.select;
        where = finalQuery.where;
    }

    const query = `${json.select} ${json.from} ${where}`;
    console.log(query);
    const [results] = await db.query(query);
    return results;
}

export const insertTemplate = async (body:any) => {
    // comprobar si jsonFilterDemographics existe y si no existe ponerlo como ""
    if (!body.jsonFilterDemographics) {
        body.jsonFilterDemographics = "";
    }

    const [, resp] = await db.query(`INSERT INTO lab35
        (lab35c2, lab35c3, lab35c4, lab35c5, lab35c6, 
        lab35c7, lab35c8, lab35c9, lab35c10, lab35c11,
        lab35c12,lab35c13 ) VALUES 
        (:lab35c2, :lab35c3, :lab35c4, :lab35c5, :lab35c6,
         :lab35c7, :lab35c8, :lab35c9, :lab35c10, :lab35c11,
         :lab35c12, :lab35c13  )`, {
        replacements: { 
            lab35c2: body.name, 
            lab35c3: body.idsDemosH, 
            lab35c4: body.idsDemosO, 
            lab35c5: body.idsDemosR, 
            lab35c6: body.init, 
            lab35c7: body.end, 
            lab35c8: body.profiles === true ? 1 : 0,
            lab35c9: body.idsDemosM,
            lab35c10: body.ordering,
            lab35c11: body.typeAreaTest,
            lab35c12:JSON.stringify(body.jsonFilterAreaTest),
            lab35c13: JSON.stringify(body.jsonFilterDemographics)
           
        }
    });
    return resp;
}

export const getTemplate = async () => {
    let templates: any[] = [];

    let query = " ";
    query += `SELECT lab35c1, lab35c2
        , lab35c3, lab35c4
        , lab35c5, lab35c6
        , lab35c7, lab35c8, lab35c9
        , lab35c10,lab35c11,  lab35c12, lab35c13 `;

    let from = " ";
    from += " FROM lab35 ";

    const [resp] = await db.query(query + from);
    resp.map( (template: any) => {
        templates.push({
            id: template.lab35c1,
            name: template.lab35c2,
            idstemplatesH: template.lab35c3,
            idstemplatesO: template.lab35c4,
            idstemplatesR: template.lab35c5,
            idstemplatesM: template.lab35c9 === null ? "" : template.lab35c9,
            init: template.lab35c6,              
            end: template.lab35c7,
            profiles: template.lab35c8,
            ordering                : template.lab35c10,
            typeAreaTest            : template.lab35c11 === null ? 0 : template.lab35c11,
         
            jsonFilterAreaTest      : template.lab35c12,
            jsonFilterDemographics  : template.lab35c13
        });
    });

    return templates;
}

export const deleteTemplate = async (id:any) => {
    const [, resp] = await db.query("DELETE FROM lab35 WHERE lab35c1 = :lab35c1", {
        replacements: { 
            lab35c1: id
        }
    });
    return resp;
}