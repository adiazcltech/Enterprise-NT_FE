import { Response } from "express";
import { arrayDatesRange, buildSQLDemographicFilterStatistics, decryptData, listOfConsecutiveYears } from "../tools/common";
import { db, dbStat } from "./config/conection";
import { Constants } from "../tools/constants";
import * as _ from "lodash";
import moment from 'moment';



export const getStatistics = async (body: any) => {
    try {
        // Consulta
        const dates = await arrayDatesRange(body.init, body.end, 5);
        const resp = await getStatisticByDate(dates, 0, [], body);
        
        let list: any[] = resp as any[];
        let finalData = {};
        
        if (Object.values(list).length > 0) {
            if (body.prices === true) {
                const min = Math.min.apply(null, Object.values(list).map((order) => +order.order));
                const max = Math.max.apply(null, Object.values(list).map((order) => +order.order));

                let patients: any[] = [];

                const years = await listOfConsecutiveYears(String(min), String(max));

                await Promise.all(
                    years.map(async (year) => {
                        let response = await getDataPatients(year, min, max);
                        response.forEach((resp: any) => {
                            if (patients[resp.lab21c1] === undefined || patients[resp.lab21c1] === null) {
                                patients[resp.lab21c1] = {
                                    id: resp.lab21c1,
                                    document: resp.lab21c2,
                                    name1: resp.lab21c3,
                                    name2: resp.lab21c4,
                                    lastName: resp.lab21c5,
                                    surName: resp.lab21c6,
                                }
                            }
                        });
                    })
                );

                console.log("Iniciar encriptación: ", toISOStringLocal(new Date()));

                let finalDataPatients = Object.values(patients);
                const decrypt: any = {};
                if (finalDataPatients.length > 0) {
                    finalDataPatients.forEach((patient: any) => {
                        decrypt[patient.id + "_document"] = patient.document;
                        decrypt[patient.id + "_name1"] = patient.name1;
                        decrypt[patient.id + "_name2"] = patient.name2;
                        decrypt[patient.id + "_lastName"] = patient.lastName;
                        decrypt[patient.id + "_surName"] = patient.surName;
                    });
                    let listOfData: any = await decryptData(decrypt);
                    if (listOfData !== null && listOfData !== undefined) {
                        Object.values(list).forEach((data: any) => {
                            data.patient.patientId = listOfData[data.patient.id + "_document"];
                            data.patient.name1 = listOfData[data.patient.id + "_name1"];
                            data.patient.name2 = listOfData[data.patient.id + "_name2"];
                            data.patient.lastName = listOfData[data.patient.id + "_lastName"];
                            data.patient.surName = listOfData[data.patient.id + "_surName"];
                        });
                    }
                }

                if (Object.values(list).length !== 0) {
                    let listorders = Object.values(list);
                    // REPORTE DETALLADO
                    if (body.typeReport === 5 || body.typeReport === 1) {
                        let listOrders: any = [];
                        listorders.forEach((value: any) => {
                            let validate = [];
                            if (body.searchby === 0) {
                                validate = value.results.filter((o: any) => o.pricePatient > 0 && o.priceAccount === 0);
                            }
                            if (body.searchby === 1) {
                                validate = value.results.filter((o: any) => o.pricePatient === 0 && o.priceAccount > 0);
                            }
                            if (validate.length > 0) {
                                value.results = validate;
                                listOrders.push(value);
                            }
                        });
                        listorders = listOrders;
                    }
                    switch (body.typeGroup) {
                        case 1:
                            finalData = await relationSimplePrice(listorders, body);
                            break;
                        case 2:
                            finalData = await relationDoublePrice(listorders, body);
                            break;
                        case 3:
                            finalData = await relationMultiplePrice(listorders, body);
                            break;
                        default:
                            break;
                    }
                }
            } else {
                if (Object.values(list).length !== 0) {
                    switch (body.typeGroup) {
                        case 1:
                            finalData = await relationsimple(Object.values(list), body);
                            break;
                        case 2:
                            finalData = await doublerelation(Object.values(list), body);
                            break;
                        case 3:
                            finalData = await multiplerelation(Object.values(list), body);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        
        return finalData;

    } catch (error) {
        console.log('error', error);
        return false;
    }
}
const getStatisticByDate = (dates: any, index: any, final: any, body: any) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            let response = await getGeneralStaticsticsByYear(
                body.rangeType,
                dates[index].start,
                dates[index].end,
                false,
                body.prices,
                false,
                body.testState,
                body.areas,
                body.laboratories,
                body.tests,
                body.levels,
                body.demographics
            );
            let list: any[] = [];
            response.forEach((resp: any) => {
                if (list[resp.sta2c1] === undefined || list[resp.sta2c1] === null) {
                    list[resp.sta2c1] = {
                        order: resp.sta2c1,
                        orderType: resp.sta2c2,
                        orderTypeCode: resp.sta2c3,
                        orderTypeName: resp.sta2c4,
                        branch: resp.sta2c5,
                        branchCode: resp.sta2c6,
                        branchName: resp.sta2c7,
                        service: resp.sta2c8,
                        serviceCode: resp.sta2c9,
                        serviceName: resp.sta2c10,
                        physician: resp.sta2c11,
                        physicianCode: resp.sta2c12,
                        physicianName: resp.sta2c13,
                        account: resp.sta2c14,
                        accountCode: resp.sta2c15,
                        accountName: resp.sta2c16,
                        rate: resp.sta2c17,
                        rateCode: resp.sta2c18,
                        rateName: resp.sta2c19,
                        date: resp.sta2c20,
                        dateTime: resp.sta2c21,
                        age: resp.sta2c22,
                        unit: resp.sta2c23,
                        ageGroup: resp.sta2c26 === null || resp.sta2c26 === undefined ? null : resp.sta2c26,
                        ageGroupCode: resp.sta2c27,
                        ageGroupName: resp.sta2c28,
                        weight: resp.sta2c24,
                        demographics: [],
                        allDemographics: [],
                        results: [],
                        patient: {
                            id: resp.sta1c1,
                            gender: resp.sta1c2,
                            genderSpanish: resp.sta1c3,
                            genderEnglish: resp.sta1c4,
                            documentType: resp.sta1c5,
                            documentTypeCode: resp.sta1c6,
                            documentTypeName: resp.sta1c7,
                            demographics: []
                        }
                    }
                    body.demographics.forEach((demofilter: any) => {
                        if (demofilter.demographic !== null && demofilter.demographic > 0) {
                            if (demofilter.origin !== null) {
                                let demoValue: any = {
                                    idDemographic: demofilter.demographic,
                                    id: demofilter.demographic
                                };
                                if (resp[`sta_demo_${demofilter.demographic}`] !== null) {
                                    demoValue.idOrder = resp.sta2c1;
                                    demoValue.codifiedId = resp[`sta_demo_${demofilter.demographic}`];
                                    demoValue.codifiedCode = resp[`sta_demo_${demofilter.demographic}_code`];
                                    demoValue.codifiedName = resp[`sta_demo_${demofilter.demographic}_name`];
                                }
                                if (demofilter.origin === "O") {
                                    list[resp.sta2c1].demographics.push(demoValue);
                                } else {
                                    list[resp.sta2c1].patient.demographics.push(demoValue);
                                }
                            }
                        }
                    });

                    if (list[resp.sta2c1].demographics.length > 0) {
                        list[resp.sta2c1].allDemographics = [...list[resp.sta2c1].allDemographics, ...list[resp.sta2c1].demographics];
                    }
                    if (list[resp.sta2c1].patient.demographics.length > 0) {
                        list[resp.sta2c1].allDemographics = [...list[resp.sta2c1].allDemographics, ...list[resp.sta2c1].patient.demographics];
                    }
                }

                if (list[resp.sta2c1].results === undefined && list[resp.sta2c1].results === null) {
                    list[resp.sta2c1].results = [];
                } else {
                    let validateTest = list[resp.sta2c1].results.find((test: any) => test.id === resp.sta3c1);
                    if (!validateTest) {
                        list[resp.sta2c1].results.push({
                            id: resp.sta3c1,
                            orderNumber: resp.sta2c1,
                            code: resp.sta3c2,
                            name: resp.sta3c3,
                            sectionId: resp.sta3c4,
                            sectionCode: resp.sta3c5,
                            sectionName: resp.sta3c6,
                            laboratoryId: resp.sta3c7,
                            laboratoryCode: resp.sta3c8,
                            laboratoryName: resp.sta3c9,
                            testState: resp.sta3c10,
                            sampleState: resp.sta3c11,
                            pathology: resp.sta3c12,
                            repeats: resp.sta3c13,
                            modifications: resp.sta3c14,
                            validationDate: resp.sta3c15,
                            levelComplex: resp.sta3c16,
                            multiplyBy: resp.sta3c24,
                            profile: resp.sta3c27,
                            applyStadistic: resp.sta3c23,
                            rate: resp.sta3c17,
                            rateCode: resp.sta3c18,
                            rateName: resp.sta3c19,
                            basic: resp.sta3c25,
                            priceService: resp.sta3c20,
                            pricePatient: resp.sta3c21,
                            priceAccount: resp.sta3c22
                        });
                    }
                }
            });
            final = { ...final, ...list };
            if (index < (dates.length - 1)) {
                resolve(getStatisticByDate(dates, index + 1, final, body));
            } else {
                resolve(final);
            }
        });
    });
}

const getGeneralStaticsticsByYear = async (
    // year: any,
    searchType: number,
    vInitial: string,
    vFinal: string,
    repeated: boolean,
    prices: boolean,
    isGroupProfiles: boolean,
    testState: number,
    areas: Array<number>,
    laboratories: Array<number>,
    tests: Array<number>,
    levels: Array<number>,
    demos: Array<any>
) => {

    let currentYear = new Date().getFullYear();

    let start = vInitial.split('-');

    let sta2 = +start[0] === currentYear ? "sta2" : "sta2_" + start[0];
    let sta3 = +start[0] === currentYear ? "sta3" : "sta3_" + start[0];

    console.log(`Inicia consulta de estadisticas desde ${vInitial} hasta ${vFinal} a las: `, toISOStringLocal(new Date()));

    let query = " ";

    query +=
        "SELECT sta2.sta2c1, "
        + "sta2c2, "
        + "sta2c3, "
        + "sta2c4, "
        + "sta2c5, "
        + "sta2c6, "
        + "sta2c7, "
        + "sta2c8, "
        + "sta2c9, "
        + "sta2c10, "
        + "sta2c11, "
        + "sta2c12, "
        + "sta2c13, "
        + "sta2c14, "
        + "sta2c15, "
        + "sta2c16, "
        + "sta2c17, "
        + "sta2c18, "
        + "sta2c19, "
        + "sta2c20, "
        + "sta2c21, "
        + "sta2c22, "
        + "sta2c23, "
        + "sta2c26, "
        + "sta2c27, "
        + "sta2c28, "
        + "sta2c24, "
        + "sta1.sta1c1, "
        + "sta1.sta1c2, "
        + "sta1.sta1c3, "
        + "sta1.sta1c4, "
        + "sta1.sta1c5, "
        + "sta1.sta1c6, "
        + "sta1.sta1c7, "
        + "sta1.sta1c11, "
        + "sta3.sta3c1, "
        + "sta3c2, "
        + "sta3c3, "
        + "sta3c4, "
        + "sta3c5, "
        + "sta3c6, "
        + "sta3c7, "
        + "sta3c8, "
        + "sta3c9, "
        + "sta3c10, "
        + "sta3c11, "
        + "sta3c12, "
        + "sta3c13, "
        + "sta3c14, "
        + "sta3c15, "
        + "sta3c16, "
        + "sta3c17, "
        + "sta3c18, "
        + "sta3c19, "
        + "sta3c23, "
        + "sta3c24, "
        + "sta3c25, "
        + "sta3c26, "
        + "sta3c27, "
        + "sta3c20, "
        + "sta3c21, "
        + "sta3c22 ";

    let from = " ";

    from += " FROM " + sta2 + " AS sta2 "
        + "INNER JOIN sta1 ON sta1.sta1c1 = sta2.sta1c1 "
        + "INNER JOIN " + sta3 + " AS sta3 ON sta3.sta2c1 = sta2.sta2c1 ";

    switch (searchType) {
        case 0:
            from += ` WHERE sta2.sta2c20 BETWEEN ${vInitial.split('-').join('')} AND ${vFinal.split('-').join('')} `;
            break;
        case 1:
            from += ` WHERE sta3.sta3c15 BETWEEN ${vInitial.split('-').join('')} AND ${vFinal.split('-').join('')} `;
            break;
        case 2:
            from += ` WHERE sta2.sta2c1 BETWEEN ${vInitial.split('-').join('')} AND ${vFinal.split('-').join('')} `;
            break;
    }

    if (repeated) {
        from += " AND sta3c13 > 0 ";
    }

    if (prices) {
        from += " AND sta3c26 = 1 ";
    } else if (!isGroupProfiles) {
        from += " AND sta3c23 = 1 ";
    }

    switch (testState) {
        case Constants.FILTER_TEST_ALL:
            from += " AND sta3c10 >= " + Constants.ORDERED;
            break;
        case Constants.FILTER_TEST_VALID_PRINTED:
            // from += " AND sta3c10 >= " + Constants.VALIDATED;
            from += ` AND ((SELECT MIN(sta3c10) FROM ${sta3} AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) >= ${Constants.VALIDATED} OR ( sta3c28 = 0 AND sta3.sta3c10 >= ${Constants.VALIDATED} )) `;
            break;
        case Constants.FILTER_TEST_PRINTED:
            // from += " AND sta3c10 = " + Constants.DELIVERED;
            from += ` AND ((SELECT MIN(sta3c10) FROM ${sta3} AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) = ${Constants.DELIVERED} OR ( sta3c28 = 0 AND sta3.sta3c10 = ${Constants.DELIVERED} )) `;

            break;
        case Constants.FILTER_TEST_NOT_VALID:
            // from += " AND sta3c10 < " + Constants.VALIDATED;
            from += ` AND ((SELECT MIN(sta3c10) FROM ${sta3} AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) < ${Constants.VALIDATED} OR ( sta3c28 = 0 AND sta3.sta3c10 < ${Constants.VALIDATED} )) `;

            break;
        case Constants.FILTER_TEST_RESULT:
            // from += " AND sta3c10 = " + Constants.REPORTED;
            from += ` AND ((SELECT MIN(sta3c10) FROM ${sta3} AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) = ${Constants.REPORTED} OR ( sta3c28 = 0 AND sta3.sta3c10 = ${Constants.REPORTED} )) `;

            break;
        case Constants.FILTER_TEST_VALID:
            // from += " AND sta3c10 = " + Constants.VALIDATED;
            from += ` AND ((SELECT MIN(sta3c10) FROM ${sta3} AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) = ${Constants.VALIDATED} OR ( sta3c28 = 0 AND sta3.sta3c10 = ${Constants.VALIDATED} )) `;

            break;
        default:
            break;
    }

    if (areas && areas.length > 0) {
        from += ` AND sta3.sta3c4 IN ( ${areas.join()} )`;
    }

    if (tests.length > 0) {
        from += ` AND sta3.sta3c1 IN ( ${tests.join()} )`;
    }

    if (laboratories.length > 0) {
        from += ` AND sta3.sta3c7 IN ( ${laboratories.join()} )`;
    }

    if (levels && levels.length > 0) {
        from += ` AND sta3.sta3c16 IN ( ${levels.join()} )`;
    }

    if (!prices) {
        from += " AND sta2c25 = 1 ";
    }

    from += " AND sta1.sta1c1 != 0 ";

    if (prices) {
        from += " AND ((SELECT MIN(sta3c11) FROM " + sta3 + " AS e WHERE e.sta2c1 = sta2.sta2c1 AND e.sta3c27 = sta3.sta3c1 AND e.sta3c28 = 0 ) > " + Constants.NEW_SAMPLE + " OR ( sta3c28 = 0 AND sta3.sta3c11 > " + Constants.NEW_SAMPLE + " ))  ";
    }

    let finalQuery = undefined;

    if (demos.length > 0) {
        finalQuery = await buildSQLDemographicFilterStatistics(demos, query, from);
    }

    if (finalQuery !== undefined) {
        query = finalQuery.select;
        from = finalQuery.where;
    }
    console.log(query + from);
    const [results] = await dbStat.query(query + from);

    console.log(`Respondio estadistica general desde ${vInitial} hasta ${vFinal} a las: `, toISOStringLocal(new Date()));

    return results;
}

const relationsimple = async (data: Array<any>, body: any) => {

    console.log("Inicia construcción de estadisticas: ", toISOStringLocal(new Date()));

    let datareport: any = [];

    let allPatient = data.filter((value, index, self) =>
        index === self.findIndex((el) => el.patient.id === value.patient.id)
    );

    let dataall = {
        alltest: 0,
        allrepeat: 0,
        allpatology: 0,
        allH: allPatient.filter( p => p.patient.gender === 7).length,
        allM: allPatient.filter( p => p.patient.gender === 8).length,
        allI: allPatient.filter( p => p.patient.gender === 9).length,
        allhitory: _.uniqBy(data, item => item.patient.id).length,
        allorder: data.length
    }

    data.forEach((value: any) => {
        if (body.canttests > 0) {
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: null,
                    group1name: null,
                    group2: null,
                    group2name: null,
                    group3: null,
                    group3name: null,
                    group4: null,
                    group4name: null,
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                item.group1 = body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].field] : valuetest[body.listgroup[0].field];
                item.group1name = body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].fieldname] : valuetest[body.listgroup[0].fieldcode] + ' ' + valuetest[body.listgroup[0].fieldname];
                item.group2 = body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].field] : body.listgroup[1] === undefined ? null : valuetest[body.listgroup[1].field];
                item.group2name = body.listgroup[1] === undefined ? null : body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].fieldname] : valuetest[body.listgroup[1].fieldcode] + ' ' + valuetest[body.listgroup[1].fieldname];
                item.group3 = body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].field] : body.listgroup[2] === undefined ? null : valuetest[body.listgroup[2].field];
                item.group3name = body.listgroup[2] === undefined ? null : body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].fieldname] : valuetest[body.listgroup[2].fieldcode] + ' ' + valuetest[body.listgroup[2].fieldname];
                item.group4 = body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].field] : body.listgroup[3] === undefined ? null : valuetest[body.listgroup[3].field];
                item.group4name = body.listgroup[3] === undefined ? null : body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].fieldname] : valuetest[body.listgroup[3].fieldcode] + ' ' + valuetest[body.listgroup[3].fieldname];

                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }

                item.multiplyBy = valuetest.multiplyBy;
                item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month();
                }
                if (datareport.length === 0) {
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    let compared = [];
                    if (body.typeReport === 3) {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month);
                    } else {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    }
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        const history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            });
        } else if (body.dynamicdemographics > 0) {

            let item1 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[0].filter2);
            let item2 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[1].filter2);
            let item3 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[2].filter2);
            let item4 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[3].filter2)
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: item1[body.listgroup[0].field],
                    group1name: `${item1[body.listgroup[0].fieldcode]} ${item1[body.listgroup[0].fieldname]}`,
                    group2: item2 === undefined ? null : item2[body.listgroup[1].field],
                    group2name: item2 === undefined ? null : `${item2[body.listgroup[1].fieldcode]} ${item2[body.listgroup[1].fieldname]}`,
                    group3: item3 === undefined ? null : item3[body.listgroup[2].field],
                    group3name: item3 === undefined ? null : `${item3[body.listgroup[2].fieldcode]} ${item3[body.listgroup[2].fieldname]}`,
                    group4: item4 === undefined ? null : item4[body.listgroup[3].field],
                    group4name: item4 === undefined ? null : `${item4[body.listgroup[3].fieldcode]} ${item4[body.listgroup[3].fieldname]}`,
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                    item.multiplyBy = valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                    item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                } else {
                    item.multiplyBy += valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? item.patology + valuetest.multiplyBy : item.patology;
                    item.repeat = valuetest.repeats === 1 ? item.repeat + valuetest.multiplyBy : item.repeat;
                }
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month();
                }
                if (body.typeReport === 2) {
                    if (datareport.length === 0) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                        if (!compared) {
                            datareport.push(JSON.parse(JSON.stringify(item)));
                        } else {
                            compared.multiplyBy += item.multiplyBy;
                            compared.patology += item.patology;
                            compared.repeat += item.repeat;
                            const history = compared.allpatient.find((e: any) => e === item.history);
                            if (!history) {
                                compared.allpatient.push(item.history);
                                compared.canpatient = compared.allpatient.length
                                compared.H += item.H;
                                compared.M += item.M;
                                compared.I += item.I;
                            }
                            let order = compared.allorder.find((e: any) => e === item.orderNumber);
                            if (!order) {
                                compared.allorder.push(item.orderNumber);
                                compared.cantorder += 1;
                            }
                        }
                    }
                } else if (body.typeReport !== 2) {
                    let compared = [];
                    if (body.typeReport === 3) {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month);
                    } else {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    }
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        let history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            });
        } else {
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1] === undefined ? null : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1] === undefined ? null : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2] === undefined ? null : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2] === undefined ? null : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3] === undefined ? null : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3] === undefined ? null : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                    item.multiplyBy = valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                    item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                } else {
                    item.multiplyBy += valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? item.patology + valuetest.multiplyBy : item.patology;
                    item.repeat = valuetest.repeats === 1 ? item.repeat + valuetest.multiplyBy : item.repeat;
                }
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;

                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month();
                }
                if (body.typeReport === 2) {
                    if (datareport.length === 0) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);

                        if (!compared) {
                            datareport.push(JSON.parse(JSON.stringify(item)));
                        } else {
                            compared.multiplyBy += item.multiplyBy;
                            compared.patology += item.patology;
                            compared.repeat += item.repeat;
                            const history = compared.allpatient.indexOf(item.history);
                            if (history === -1) {
                                compared.allpatient.push(item.history);
                                compared.canpatient = compared.allpatient.length
                                compared.H += item.H;
                                compared.M += item.M;
                                compared.I += item.I;
                            }
                            let order = compared.allorder.find((e: any) => e === item.orderNumber);
                            if (!order) {
                                compared.allorder.push(item.orderNumber);
                                compared.cantorder += 1;
                            }
                        }
                    }
                } else {
                    let compared = [];
                    if (body.typeReport === 3) {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month);
                    } else {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    }
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        const history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient += 1;
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            });
        }
    });

    // if (body.typeReport !== 3) {
    //     if (body.canttests === 0 && body.dynamicdemographics === 0) {
    //         if (datareport.length !== 0) {
    //             if (datareport.length === 1) {
    //                 datareport[0].cantorder = dataall.allorder;
    //             } else {
    //                 let dataorderby: any = {};
    //                 if (body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10) {
    //                     dataorderby = _.groupBy(datacompared, (e) => {
    //                         return e.patient[body.listgroup[0].field]
    //                     });
    //                 } else {
    //                     dataorderby = _.groupBy(datacompared, (e) => {
    //                         return e[body.listgroup[0].field]
    //                     });
    //                 }
    //                 datareport.map((value: any) => {
    //                     value.cantorder = dataorderby[value.group1].length;
    //                 });
    //             }
    //         }
    //     }
    // }

    // dataall.allhitory = _.sumBy(datareport, (o: any) => { return o.canpatient; });

    console.log("Finaliza construcción de estadisticas: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}

const doublerelation = async (data: Array<any>, body: any) => {
    console.log("Inicia construcción de estadisticas: ", toISOStringLocal(new Date()));
    

    let datareport: any = [];

    let allPatient = data.filter((value, index, self) =>
        index === self.findIndex((el) => el.patient.id === value.patient.id)
    );

    let dataall = {
        alltest: 0,
        allrepeat: 0,
        allpatology: 0,
        allH: allPatient.filter( p => p.patient.gender === 7).length,
        allM: allPatient.filter( p => p.patient.gender === 8).length,
        allI: allPatient.filter( p => p.patient.gender === 9).length,
        allhitory: _.uniqBy(data, item => item.patient.id).length,
        allorder: data.length
    }

    data.forEach((value: any) => {
        if (body.canttests > 0 && body.dynamicdemographics > 0 && body.cantfixeddemographics === 0) {
            let item1 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[0].filter2);
            let item2 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[1].filter2);
            let item3 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[2].filter2);
            let item4 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[3].filter2);
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: null,
                    group1name: null,
                    group2: null,
                    group2name: null,
                    group3: null,
                    group3name: null,
                    group4: null,
                    group4name: null,
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                item.group1 = body.listgroup[0].filter1 === '1' ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].field] : value[body.listgroup[0].field];
                item.group1name = body.listgroup[0].filter1 === '1' ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].fieldcode] + ' ' + valuetest[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname];
                item.group2 = body.listgroup[1].filter1 === '1' ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].field] : value[body.listgroup[1].field];
                item.group2name = body.listgroup[1].filter1 === '1' ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].fieldcode] + ' ' + valuetest[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname];
                item.group3 = body.listgroup[2].filter1 === '1' ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].field] : value[body.listgroup[2].field];
                item.group3name = body.listgroup[2].filter1 === '1' ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].fieldcode] + ' ' + valuetest[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname];
                item.group4 = body.listgroup[3].filter1 === '1' ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].field] : value[body.listgroup[3].field];
                item.group4name = body.listgroup[3].filter1 === '1' ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].fieldcode] + ' ' + valuetest[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname];
                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                    item.multiplyBy = valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                    item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                } else {
                    item.multiplyBy += valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? item.patology + valuetest.multiplyBy : item.patology;
                    item.repeat = valuetest.repeats === 1 ? item.repeat + valuetest.multiplyBy : item.repeat;
                }
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month()
                }
                if (body.typeReport === 2) {
                    if (datareport.length === 0) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                        if (!compared) {
                            datareport.push(JSON.parse(JSON.stringify(item)));
                        } else {
                            compared.multiplyBy += item.multiplyBy;
                            compared.patology += item.patology;
                            compared.repeat += item.repeat;
                            let history = compared.allpatient.find((e: any) => e === item.history);
                            if (!history) {
                                compared.allpatient.push(item.history);
                                compared.canpatient = compared.allpatient.length
                                compared.H += item.H;
                                compared.M += item.M;
                                compared.I += item.I;
                            }
                            let order = compared.allorder.find((e: any) => e === item.orderNumber);
                            if (!order) {
                                compared.allorder.push(item.orderNumber);
                                compared.cantorder += 1;
                            }
                        }
                    }
                } else if (body.typeReport !== 2) {
                    let compared = [];
                    if (body.typeReport === 3) {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month);
                    } else {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    }
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        let history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            });

        } else if (body.canttests > 0 && body.dynamicdemographics === 0 && body.cantfixeddemographics > 0) {
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: null,
                    group1name: null,
                    group2: null,
                    group2name: null,
                    group3: null,
                    group3name: null,
                    group4: null,
                    group4name: null,
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                item.group1 = body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].field] : value[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field];
                item.group1name = body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].fieldcode] + ' ' + valuetest[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname];
                item.group2 = body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].field] : value[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field];
                item.group2name = body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].fieldcode] + ' ' + valuetest[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname];
                item.group3 = body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].field] : value[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field];
                item.group3name = body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].fieldcode] + ' ' + valuetest[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname];
                item.group4 = body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].field] : value[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field];
                item.group4name = body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].fieldcode] + ' ' + valuetest[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname];
                item.group5 = null;
                item.group5name = "";
                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }
                item.multiplyBy = valuetest.multiplyBy;
                item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month();
                }
                if (datareport.length === 0) {
                    datareport.push(JSON.parse(JSON.stringify(item))); 
                } else {
                    let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if(compared) {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        let history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length;
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    } else {
                        datareport.push(JSON.parse(JSON.stringify(item))); 
                    }
                }
            });
        } else {
            let item1 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[0].filter2);
            let item2 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[1].filter2);
            let item3 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[2].filter2);
            let item4 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[3].filter2);
            value.results.forEach((valuetest: any) => {
                let item = {
                    cantorder: 1,
                    allorder: [value.order],
                    canpatient: 1,
                    allpatient: [value.patient.id],
                    history: value.patient.id,
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    multiplyBy: 0,
                    patology: 0,
                    repeat: 0,
                    H: value.patient.gender === 7 ? 1 : 0,
                    M: value.patient.gender === 8 ? 1 : 0,
                    I: value.patient.gender === 9 ? 1 : 0,
                    month: 0
                }
                if (body.typeReport === 2) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`
                    item.multiplyBy = valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                    item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
                } else {
                    item.multiplyBy += valuetest.multiplyBy;
                    item.patology = valuetest.pathology > 0 ? item.patology + valuetest.multiplyBy : item.patology;
                    item.repeat = valuetest.repeats === 1 ? item.repeat + valuetest.multiplyBy : item.repeat;
                }
                dataall.alltest += valuetest.multiplyBy;
                if (valuetest.repeats === 1) {
                    dataall.allrepeat += valuetest.multiplyBy;
                }
                if (valuetest.pathology > 0) {
                    dataall.allpatology += valuetest.multiplyBy;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport === 3) {
                    item.month = moment(value.dateTime).month();
                }
                if (body.typeReport === 2) {
                    if (datareport.length === 0) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                        if (!compared) {
                            datareport.push(JSON.parse(JSON.stringify(item)));
                        } else {
                            compared.multiplyBy += item.multiplyBy;
                            compared.patology += item.patology;
                            compared.repeat += item.repeat;
                            let history = compared.allpatient.find((e: any) => e === item.history);
                            if (!history) {
                                compared.allpatient.push(item.history);
                                compared.canpatient += 1;
                                compared.H += item.H;
                                compared.M += item.M;
                                compared.I += item.I;
                            }
                            let order = compared.allorder.find((e: any) => e === item.orderNumber);
                            if (!order) {
                                compared.allorder.push(item.orderNumber);
                                compared.cantorder += 1;
                            }
                        }
                    }
                }
                if (body.typeReport !== 2) {
                    let compared = [];
                    if (body.typeReport === 3) {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month);
                    } else {
                        compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    }
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        let history = compared.allpatient.find((e: any) => e === item.history);
                        if (!history) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            });
        }
    });

    // dataall.allhitory = _.sumBy(datareport, (o: any) => { return o.canpatient; });

    console.log("Finaliza construcción de estadisticas: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}

const multiplerelation = async (data: Array<any>, body: any) => {
    console.log("Inicia construcción de estadisticas: ", toISOStringLocal(new Date()));

    let datareport: any = [];

    let allPatient = data.filter((value, index, self) =>
        index === self.findIndex((el) => el.patient.id === value.patient.id)
    );

    let dataall = {
        alltest: 0,
        allrepeat: 0,
        allpatology: 0,
        allH: allPatient.filter( p => p.patient.gender === 7).length,
        allM: allPatient.filter( p => p.patient.gender === 8).length,
        allI: allPatient.filter( p => p.patient.gender === 9).length,
        allhitory: _.uniqBy(data, item => item.patient.id).length,
        allorder: data.length
    }

    data.forEach((value: any) => {
        let item1 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[0].filter2);
        let item2 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[1].filter2);
        let item3 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[2].filter2);
        let item4 = value.allDemographics.find((o: any) => o.idDemographic === body.listgroup[3].filter2);
        let item = {
            cantorder: 1,
            allorder: [value.order],
            canpatient: 1,
            allpatient: [value.patient.id],
            history: value.patient.id,
            orderNumber: value.order,
            group1: null,
            group1name: null,
            group2: null,
            group2name: null,
            group3: null,
            group3name: null,
            group4: null,
            group4name: null,
            group5: null,
            group5name: "",
            multiplyBy: 0,
            patology: 0,
            repeat: 0,
            H: value.patient.gender === 7 ? 1 : 0,
            M: value.patient.gender === 8 ? 1 : 0,
            I: value.patient.gender === 9 ? 1 : 0,
            month: 0
        }

        value.results.forEach((valuetest: any) => {
            item.group1 = body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].field] : valuetest[body.listgroup[0].field] : body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field];
            item.group1name = body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].fieldname] : valuetest[body.listgroup[0].fieldcode] + ' ' + valuetest[body.listgroup[0].fieldname] : body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname];
            item.group2 = body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].field] : valuetest[body.listgroup[1].field] : body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field];
            item.group2name = body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].fieldname] : valuetest[body.listgroup[1].fieldcode] + ' ' + valuetest[body.listgroup[1].fieldname] : body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname];
            item.group3 = body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].field] : valuetest[body.listgroup[2].field] : body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field];
            item.group3name = body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].fieldname] : valuetest[body.listgroup[2].fieldcode] + ' ' + valuetest[body.listgroup[2].fieldname] : body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname];
            item.group4 = body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].field] : valuetest[body.listgroup[3].field] : body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field];
            item.group4name = body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].fieldname] : valuetest[body.listgroup[3].fieldcode] + ' ' + valuetest[body.listgroup[3].fieldname] : body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname];
            
            if (body.typeReport === 2) {
                item.group5 = valuetest.id;
                item.group5name = `${valuetest.code} ${valuetest.name}`
                item.multiplyBy = valuetest.multiplyBy;
                item.patology = valuetest.pathology > 0 ? valuetest.multiplyBy : 0;
                item.repeat = valuetest.repeats === 1 ? valuetest.multiplyBy : 0;
            } else {
                item.multiplyBy = valuetest.multiplyBy;
                item.patology = valuetest.pathology > 0 ? item.patology + valuetest.multiplyBy : item.patology;
                item.repeat = valuetest.repeats === 1 ? item.repeat + valuetest.multiplyBy : item.repeat;
            }
            dataall.alltest += valuetest.multiplyBy;
            if (valuetest.repeats === 1) {
                dataall.allrepeat += valuetest.multiplyBy;
            }
            if (valuetest.pathology > 0) {
                dataall.allpatology += valuetest.multiplyBy;
            }
            item.group2 = item.group2 === undefined ? null : item.group2;
            item.group3 = item.group3 === undefined ? null : item.group3;
            item.group4 = item.group4 === undefined ? null : item.group4;
            if (body.typeReport === 3) {
                item.month = moment(value.dateTime).month();
            }
            if (body.typeReport === 2) {
                if (datareport.length === 0) {
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    let compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.multiplyBy += item.multiplyBy;
                        compared.patology += item.patology;
                        compared.repeat += item.repeat;
                        // let history = compared.allpatient.find((e: any) => e === item.history);
                        const history = compared.allpatient.indexOf(item.history);
                        if (history === -1) {
                            compared.allpatient.push(item.history);
                            compared.canpatient = compared.allpatient.length
                            compared.H += item.H;
                            compared.M += item.M;
                            compared.I += item.I;
                        }
                        let order = compared.allorder.find((e: any) => e === item.orderNumber);
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                    }
                }
            }
            if (body.typeReport !== 2) {
                let compared = [];
                if (body.typeReport === 3) {
                    compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5 && e.month === item.month)
                } else {
                    compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                }
                    
                if (!compared) {
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    compared.multiplyBy += item.multiplyBy;
                    compared.patology += item.patology;
                    compared.repeat += item.repeat;
                    // let history = compared.allpatient.find((e: any) => e === item.history);
                    const history = compared.allpatient.indexOf(item.history);
                    if (history === -1) {
                        compared.allpatient.push(item.history);
                        compared.canpatient = compared.allpatient.length
                        compared.H += item.H;
                        compared.M += item.M;
                        compared.I += item.I;
                    }
                    let order = compared.allorder.find((e: any) => e === item.orderNumber);
                    if (!order) {
                        compared.allorder.push(item.orderNumber);
                        compared.cantorder += 1;
                    }
                }
            }
        });
    });

    // dataall.allhitory = _.sumBy(datareport, (o: any) => { return o.canpatient; });

    console.log("Finaliza construcción de estadisticas: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}

const getDataPatients = async (year: any, min: any, max: any) => {

    console.log(`Inicia consulta de pacientes`, toISOStringLocal(new Date()));

    let currentYear = new Date().getFullYear();
    let lab22 = year === currentYear ? "lab22" : "lab22_" + year;

    let query = " ";

    query +=
        " SELECT DISTINCT lab21.lab21c1, lab21c2, lab21c3, lab21c4, lab21c5, lab21c6 ";
    let from = " ";

    from += " FROM lab21 "
        + " INNER JOIN " + lab22 + " as lab22  ON lab21.lab21c1 = lab22.lab21c1 AND lab22.lab07c1 = 1  ";

    from += ` WHERE lab22c1 BETWEEN ${min} AND ${max} `;

    const [data] = await db.query(query + from);

    console.log(`Respondio de pacientes: `, toISOStringLocal(new Date()));

    return data;
}

const relationSimplePrice = async (data: Array<any>, body: any) => {

    console.log("Inicia construcción de estadisticas con precios: ", toISOStringLocal(new Date()));

    let datareport: any = [];

    let dataall = {
        allorder: data.length,
        allpriceorder: 0,
        allcopago: 0,
        alldiscountorder: 0,
        allbalanceorder: 0,
        allpayorder: 0,
        alltest: 0,
        cantallhitory: 0,
        allhitory: new Array<any>,
        allpriceService: 0,
        allpricePatient: 0,
        allpriceAccount: 0
    }

    data.forEach((value: any) => {
        if (dataall.allhitory.length === 0) {
            dataall.allhitory = [value.patient.id];
            dataall.cantallhitory = 1;
        } else {
            const history = dataall.allhitory.find((e: any) => value.patient.id);
            if (!history) {
                dataall.allhitory.push(value.patient.id);
                dataall.cantallhitory += 1;
            }
        }

        dataall.alltest += value.results.length;

        if (value.hasOwnProperty('copay')) {
            dataall.allcopago += parseInt(value.copay);
        }

        if (body.canttests > 0) {
            value.results.forEach((valuetest: any) => {
                let item = {
                    orderNumber: value.order,
                    group1: valuetest[body.listgroup[0].field],
                    group1name: `${valuetest[body.listgroup[0].fieldcode]} ${valuetest[body.listgroup[0].fieldname]}`,
                    group2: body.listgroup[1] === undefined ? null : valuetest[body.listgroup[1].field],
                    group2name: body.listgroup[1] === undefined ? null : `${valuetest[body.listgroup[1].fieldcode]} ${valuetest[body.listgroup[1].fieldname]}`,
                    group3: body.listgroup[2] === undefined ? null : valuetest[body.listgroup[2].field],
                    group3name: body.listgroup[2] === undefined ? null : `${valuetest[body.listgroup[2].fieldcode]} ${valuetest[body.listgroup[2].fieldname]}`,
                    group4: body.listgroup[3] === undefined ? null : valuetest[body.listgroup[3].field],
                    group4name: body.listgroup[3] === undefined ? null : `${valuetest[body.listgroup[3].fieldcode]} ${valuetest[body.listgroup[3].fieldname]}`,
                    group5: null,
                    group5name: "",
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    priceService: valuetest.priceService === undefined ? 0 : valuetest.priceService,
                    pricePatient: valuetest.pricePatient == undefined ? 0 : valuetest.pricePatient,
                    priceAccount: valuetest.priceAccount === undefined ? 0 : valuetest.priceAccount,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    cantpatient: 0,
                    allorder: new Array<any>,
                    allhistory: new Array<any>
                }
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber];
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
            });
        }
        else if (body.dynamicdemographics > 0) {
            value.results.forEach((valuetest: any) => {
                const item1 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[0].filter2);
                const item2 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[1].filter2);
                const item3 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[2].filter2);
                const item4 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[3].filter2);
                let item = {
                    orderNumber: value.order,
                    group1: item1[body.listgroup[0].field],
                    group1name: `${item1[body.listgroup[0].fieldcode]} ${item1[body.listgroup[0].fieldname]}`,
                    group2: item2 === undefined ? null : item2[body.listgroup[1].field],
                    group2name: item2 === undefined ? null : `${item2[body.listgroup[1].fieldcode]} ${item2[body.listgroup[1].fieldname]}`,
                    group3: item3 === undefined ? null : item3[body.listgroup[2].field],
                    group3name: item3 === undefined ? null : `${item3[body.listgroup[2].fieldcode]} ${item3[body.listgroup[2].fieldname]}`,
                    group4: item4 === undefined ? null : item4[body.listgroup[3].field],
                    group4name: item4 === undefined ? null : `${item4[body.listgroup[3].fieldcode]} ${item4[body.listgroup[3].fieldname]}`,
                    group5: null,
                    group5name: "",
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    priceService: valuetest.priceService === undefined ? 0 : valuetest.priceService,
                    pricePatient: valuetest.pricePatient == undefined ? 0 : valuetest.pricePatient,
                    priceAccount: valuetest.priceAccount === undefined ? 0 : valuetest.priceAccount,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    allorder: new Array<any>,
                    cantpatient: 0,
                    allhistory: new Array<any>
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber]
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
            });
        }
        else {
            value.results.forEach((valuetest: any) => {
                var item = {
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1] === undefined ? null : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1] === undefined ? null : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2] === undefined ? null : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2] === undefined ? null : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3] === undefined ? null : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3] === undefined ? null : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    priceService: valuetest.priceService === undefined ? 0 : valuetest.priceService,
                    pricePatient: valuetest.pricePatient == undefined ? 0 : valuetest.pricePatient,
                    priceAccount: valuetest.priceAccount === undefined ? 0 : valuetest.priceAccount,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    allorder: new Array<any>,
                    cantpatient: 0,
                    allhistory: new Array<any>
                }
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber]
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
            });
        }
    });

    console.log("Finaliza construcción de estadisticas con precios: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}

const relationDoublePrice = async (data: Array<any>, body: any) => {
    let datareport: any = [];
    let dataall = {
        allorder: data.length,
        allpriceorder: 0,
        allcopago: 0,
        alldiscountorder: 0,
        allbalanceorder: 0,
        allpayorder: 0,
        alltest: 0,
        cantallhitory: 0,
        allhitory: new Array<any>,
        allpriceService: 0,
        allpricePatient: 0,
        allpriceAccount: 0
    }
    data.forEach((value: any) => {
        if (dataall.allhitory.length === 0) {
            dataall.allhitory = [value.patient.id];
            dataall.cantallhitory = 1;
        } else {
            const history = dataall.allhitory.find((e: any) => e === value.patient.id);
            if (!history) {
                dataall.allhitory.push(value.patient.id);
                dataall.cantallhitory += 1;
            }
        }
        if (body.canttests > 0 && body.dynamicdemographics > 0 && body.cantfixeddemographics === 0) {
            dataall.alltest += value.results.length;
            if (value.hasOwnProperty('copay')) {
                dataall.allcopago += parseInt(value.copay);
            }
            for (let i = 0; i < value.results.length; i++) {
                const item1 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[0].filter2);
                const item2 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[1].filter2);
                const item3 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[2].filter2);
                const item4 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[3].filter2);
                let item = {
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter1 === '1' ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 !== 5 ? value.results[i][body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter1 === '1' ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 !== 5 ? value.results[i][body.listgroup[0].fieldcode] + ' ' + value.results[i][body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1].filter1 === '1' ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 !== 5 ? value.results[i][body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1].filter1 === '1' ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 !== 5 ? value.results[i][body.listgroup[1].fieldcode] + ' ' + value.results[i][body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2].filter1 === '1' ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 !== 5 ? value.results[i][body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2].filter1 === '1' ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 !== 5 ? value.results[i][body.listgroup[2].fieldcode] + ' ' + value.results[i][body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3].filter1 === '1' ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 !== 5 ? value.results[i][body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3].filter1 === '1' ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 !== 5 ? value.results[i][body.listgroup[3].fieldcode] + ' ' + value.results[i][body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    priceService: value.results[i].priceService === undefined ? 0 : value.results[i].priceService,
                    pricePatient: value.results[i].pricePatient == undefined ? 0 : value.results[i].pricePatient,
                    priceAccount: value.results[i].priceAccount === undefined ? 0 : value.results[i].priceAccount,
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    allorder: new Array<any>,
                    cantpatient: 0,
                    allhistory: new Array<any>
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = value.results[i].id;
                    item.group5name = `${value.results[i].code} ${value.results[i].name}`;
                }
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber]
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
                datareport.push(JSON.parse(JSON.stringify(item)));
            }
        }
        else if (body.canttests > 0 && body.dynamicdemographics === 0 && body.cantfixeddemographics > 0) {
            dataall.alltest += value.results.length;
            if (value.hasOwnProperty('copay')) {
                dataall.allcopago += parseInt(value.copay);
            }
            value.results.forEach((valuetest: any) => {
                let item = {
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].field] : value[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 !== 5 ? valuetest[body.listgroup[0].fieldcode] + ' ' + valuetest[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].field] : value[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 !== 5 ? valuetest[body.listgroup[1].fieldcode] + ' ' + valuetest[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].field] : value[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 !== 5 ? valuetest[body.listgroup[2].fieldcode] + ' ' + valuetest[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].field] : value[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 !== 5 ? valuetest[body.listgroup[3].fieldcode] + ' ' + valuetest[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    priceService: valuetest.priceService === undefined ? 0 : valuetest.priceService,
                    pricePatient: valuetest.pricePatient == undefined ? 0 : valuetest.pricePatient,
                    priceAccount: valuetest.priceAccount === undefined ? 0 : valuetest.priceAccount,
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    allorder: new Array<any>,
                    cantpatient: 0,
                    allhistory: new Array<any>
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = valuetest.id;
                    item.group5name = `${valuetest.code} ${valuetest.name}`;
                }
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber]
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
            })
        }
        else {
            dataall.alltest += value.results.length;
            if (value.hasOwnProperty('copay')) {
                dataall.allcopago += parseInt(value.copay);
            }
            value.results.forEach((valuetest: any) => {
                const item1 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[0].filter2);
                const item2 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[1].filter2);
                const item3 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[2].filter2);
                const item4 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[3].filter2);
                var item = {
                    orderNumber: value.order,
                    group1: body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                    group1name: body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname],
                    group2: body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                    group2name: body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname],
                    group3: body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                    group3name: body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname],
                    group4: body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                    group4name: body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname],
                    group5: null,
                    group5name: "",
                    priceService: valuetest.priceService === undefined ? 0 : valuetest.priceService,
                    pricePatient: valuetest.pricePatient == undefined ? 0 : valuetest.pricePatient,
                    priceAccount: valuetest.priceAccount === undefined ? 0 : valuetest.priceAccount,
                    history: value.patient.patientId,
                    patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                    copay: value.copay,
                    discounts: value.discounts,
                    taxe: value.taxe,
                    payment: value.payment,
                    balance: value.balance,
                    cantorder: 0,
                    canttest: 0,
                    allorder: new Array<any>,
                    cantpatient: 0,
                    allhistory: new Array<any>
                }
                item.group2 = item.group2 === undefined ? null : item.group2;
                item.group3 = item.group3 === undefined ? null : item.group3;
                item.group4 = item.group4 === undefined ? null : item.group4;
                dataall.allpriceService += item.priceService;
                dataall.allpricePatient += item.pricePatient;
                dataall.allpriceAccount += item.priceAccount;
                if (body.typeReport !== 1 && body.typeReport !== 3) {
                    item.group5 = valuetest.id;
                    item.group5name = valuetest.code + ' ' + valuetest.name;
                }
                if (body.typeReport === 5 || body.typeReport === 1) {
                    item.cantorder = 1;
                    item.canttest = 1;
                    const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (compared.length > 0) {
                        const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                        if (order) {
                            item.cantorder = 0;
                        }
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else if (datareport.length === 0) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber]
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                    if (!compared) {
                        item.cantorder = 1;
                        item.allorder = [item.orderNumber];
                        item.canttest = 1;
                        item.cantpatient = 1;
                        if (item.history !== null && item.history !== undefined) {
                            item.allhistory = [item.history];
                        }
                        datareport.push(JSON.parse(JSON.stringify(item)));
                    } else {
                        compared.canttest += 1;
                        const order = compared.allorder.find((e: any) => e === item.orderNumber);
                        compared.priceService += item.priceService;
                        compared.pricePatient += item.pricePatient;
                        compared.priceAccount += item.priceAccount;
                        if (!order) {
                            compared.allorder.push(item.orderNumber);
                            compared.cantorder += 1;
                        }
                        const history = compared.allhistory.find((e: any) => e === item.history);
                        if (!history) {
                            if (item.history !== null && item.history !== undefined) {
                                compared.allhistory.push(item.history);
                            }
                            compared.cantpatient += 1;
                        }
                    }
                }
            });
        }
    });

    console.log("Finaliza construcción de estadisticas con precios: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}

const relationMultiplePrice = async (data: Array<any>, body: any) => {
    let datareport: any = [];
    let dataall = {
        allorder: data.length,
        allpriceorder: 0,
        allcopago: 0,
        alldiscountorder: 0,
        allbalanceorder: 0,
        allpayorder: 0,
        alltest: 0,
        cantallhitory: 0,
        allhitory: new Array<any>,
        allpriceService: 0,
        allpricePatient: 0,
        allpriceAccount: 0
    }
    data.forEach((value: any) => {
        if (dataall.allhitory.length === 0) {
            dataall.allhitory = [value.patient.id];
            dataall.cantallhitory = 1;
        } else {
            const history = dataall.allhitory.find((e: any) => e === value.patient.id);
            if (!history) {
                dataall.allhitory.push(value.patient.id);
                dataall.cantallhitory += 1;
            }
        }
        dataall.alltest += value.results.length;
        if (value.hasOwnProperty('copay')) {
            dataall.allcopago += parseInt(value.copay);
        }
        for (let i = 0; i < value.results.length; i++) {
            const item1 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[0].filter2);
            const item2 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[1].filter2);
            const item3 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[2].filter2);
            const item4 = value.allDemographics.find((e: any) => e.idDemographic === body.listgroup[3].filter2);
            let item = {
                orderNumber: value.order,
                group1: body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].field] : value.results[i][body.listgroup[0].field] : body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].field] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].field] : value[body.listgroup[0].field],
                group1name: body.listgroup[0].filter1 === '2' ? body.listgroup[0].filter2 === 5 ? value[body.listgroup[0].fieldname] : value.results[i][body.listgroup[0].fieldcode] + ' ' + value.results[i][body.listgroup[0].fieldname] : body.listgroup[0].filter2 > 0 ? item1[body.listgroup[0].fieldcode] + ' ' + item1[body.listgroup[0].fieldname] : body.listgroup[0].filter2 === -7 || body.listgroup[0].filter2 === -10 ? value.patient[body.listgroup[0].fieldcode] + ' ' + value.patient[body.listgroup[0].fieldname] : value[body.listgroup[0].fieldcode] + ' ' + value[body.listgroup[0].fieldname],
                group2: body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].field] : value.results[i][body.listgroup[1].field] : body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].field] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].field] : value[body.listgroup[1].field],
                group2name: body.listgroup[1].filter1 === '2' ? body.listgroup[1].filter2 === 5 ? value[body.listgroup[1].fieldname] : value.results[i][body.listgroup[1].fieldcode] + ' ' + value.results[i][body.listgroup[1].fieldname] : body.listgroup[1].filter2 > 0 ? item2[body.listgroup[1].fieldcode] + ' ' + item2[body.listgroup[1].fieldname] : body.listgroup[1].filter2 === -7 || body.listgroup[1].filter2 === -10 ? value.patient[body.listgroup[1].fieldcode] + ' ' + value.patient[body.listgroup[1].fieldname] : value[body.listgroup[1].fieldcode] + ' ' + value[body.listgroup[1].fieldname],
                group3: body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].field] : value.results[i][body.listgroup[2].field] : body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].field] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].field] : value[body.listgroup[2].field],
                group3name: body.listgroup[2].filter1 === '2' ? body.listgroup[2].filter2 === 5 ? value[body.listgroup[2].fieldname] : value.results[i][body.listgroup[2].fieldcode] + ' ' + value.results[i][body.listgroup[2].fieldname] : body.listgroup[2].filter2 > 0 ? item3[body.listgroup[2].fieldcode] + ' ' + item3[body.listgroup[2].fieldname] : body.listgroup[2].filter2 === -7 || body.listgroup[2].filter2 === -10 ? value.patient[body.listgroup[2].fieldcode] + ' ' + value.patient[body.listgroup[2].fieldname] : value[body.listgroup[2].fieldcode] + ' ' + value[body.listgroup[2].fieldname],
                group4: body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].field] : value.results[i][body.listgroup[3].field] : body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].field] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].field] : value[body.listgroup[3].field],
                group4name: body.listgroup[3].filter1 === '2' ? body.listgroup[3].filter2 === 5 ? value[body.listgroup[3].fieldname] : value.results[i][body.listgroup[3].fieldcode] + ' ' + value.results[i][body.listgroup[3].fieldname] : body.listgroup[3].filter2 > 0 ? item4[body.listgroup[3].fieldcode] + ' ' + item4[body.listgroup[3].fieldname] : body.listgroup[3].filter2 === -7 || body.listgroup[3].filter2 === -10 ? value.patient[body.listgroup[3].fieldcode] + ' ' + value.patient[body.listgroup[3].fieldname] : value[body.listgroup[3].fieldcode] + ' ' + value[body.listgroup[3].fieldname],
                group5: null,
                group5name: "",
                history: value.patient.patientId,
                patientname: `${value.patient.name1} ${value.patient.name2} ${value.patient.lastName} ${value.patient.surName}`,
                priceService: value.results[i].priceService === undefined ? 0 : value.results[i].priceService,
                pricePatient: value.results[i].pricePatient == undefined ? 0 : value.results[i].pricePatient,
                priceAccount: value.results[i].priceAccount === undefined ? 0 : value.results[i].priceAccount,
                copay: value.copay,
                discounts: value.discounts,
                taxe: value.taxe,
                payment: value.payment,
                balance: value.balance,
                cantorder: 0,
                canttest: 0,
                allorder: new Array<any>,
                cantpatient: 0,
                allhistory: new Array<any>
            }
            item.group2 = item.group2 === undefined ? null : item.group2;
            item.group3 = item.group3 === undefined ? null : item.group3;
            item.group4 = item.group4 === undefined ? null : item.group4;
            dataall.allpriceService += item.priceService;
            dataall.allpricePatient += item.pricePatient;
            dataall.allpriceAccount += item.priceAccount;
            if (body.typeReport !== 1 && body.typeReport !== 3) {
                item.group5 = value.results[i].id;
                item.group5name = `${value.results[i].code} ${value.results[i].name}`;
            }
            if (body.typeReport === 5 || body.typeReport === 1) {
                item.cantorder = 1;
                item.canttest = 1;
                const compared = datareport.filter((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                if (compared.length > 0) {
                    const order = compared.find((e: any) => e.orderNumber === item.orderNumber);
                    if (order) {
                        item.cantorder = 0;
                    }
                }
                datareport.push(JSON.parse(JSON.stringify(item)));
            } else if (datareport.length === 0) {
                item.cantorder = 1;
                item.allorder = [item.orderNumber]
                item.canttest = 1;
                item.cantpatient = 1;
                if (item.history !== null && item.history !== undefined) {
                    item.allhistory = [item.history];
                }
                datareport.push(JSON.parse(JSON.stringify(item)));
            } else {
                const compared = datareport.find((e: any) => e.group1 === item.group1 && e.group2 === item.group2 && e.group3 === item.group3 && e.group4 === item.group4 && e.group5 === item.group5);
                if (!compared) {
                    item.cantorder = 1;
                    item.allorder = [item.orderNumber];
                    item.canttest = 1;
                    item.cantpatient = 1;
                    if (item.history !== null && item.history !== undefined) {
                        item.allhistory = [item.history];
                    }
                    datareport.push(JSON.parse(JSON.stringify(item)));
                } else {
                    compared.canttest += 1;
                    const order = compared.allorder.find((e: any) => e === item.orderNumber);
                    compared.priceService += item.priceService;
                    compared.pricePatient += item.pricePatient;
                    compared.priceAccount += item.priceAccount;
                    if (!order) {
                        compared.allorder.push(item.orderNumber);
                        compared.cantorder += 1;
                    }
                    const history = compared.allhistory.find((e: any) => e === item.history);
                    if (!history) {
                        if (item.history !== null && item.history !== undefined) {
                            compared.allhistory.push(item.history);
                        }
                        compared.cantpatient += 1;
                    }
                }
            }
        }
    });

    console.log("Finaliza construcción de estadisticas con precios: ", toISOStringLocal(new Date()));

    return { dataall, datareport }
}



function toISOStringLocal(d: any) {
    function z(n: any) { return (n < 10 ? '0' : '') + n }
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + ' ' + z(d.getHours()) + ':' +
        z(d.getMinutes()) + ':' + z(d.getSeconds())

}



