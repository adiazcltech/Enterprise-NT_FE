import { buildSQLDemographicFilter, containsDemographicList, createDemographicsQuery, filterExcludeTestByProfileList } from "../tools/resultschecking/management";
import { arrayDatesRange, decryptData, getDemographicsValue, getValueKey } from "../tools/common";
import { ResultSampleState, ResultTestState } from "../tools/constants";
import { db } from "./config/conection";
import { listDemographics } from "./demographics";
import moment from "moment";


export const getManagement = async (body: any) => {

    console.log("Inicia consulta revisión de resultados gestión: ", toISOStringLocal(new Date()));
    if (!body.pending) {
        body = await getStatesManagement(body);
    } else {
        body = await getPendingState(body);
    }
    // Digitos de la orden
    let account = await getValueKey('ManejoCliente') === 'True';
    let physician = await getValueKey('ManejoMedico') === 'True';
    let rate = await getValueKey('ManejoTarifa') === 'True';
    let service = await getValueKey('ManejoServicio') === 'True';
    let race = await getValueKey('ManejoRaza') === 'True';
    let documenttype = await getValueKey('ManejoTipoDocumento') === 'True';
    let consultarSistemaCentral = await getValueKey('ConsultarSistemaCentral') === 'True';
    let sistemaCentralListados = 0;
    if (consultarSistemaCentral) {
        sistemaCentralListados = await getValueKey('SistemaCentralListados');
    }

    // Consulta
    const demographics = await listDemographics(1);

    // Consulta normal
    let filters = {
        account,
        physician,
        rate,
        service,
        race,
        documenttype,
        consultarSistemaCentral,
        sistemaCentralListados,
        demographics,
        body
    };

    try {
        const dates = await arrayDatesRange(body.init, body.end, 5);
        const resp = await getDataByDate(dates, 0, [], filters);
        //console.log("resp",resp)
        let finalData = Object.values(resp);
        if (finalData.length > 0) {
            const decrypt: any = {};
            finalData.forEach((order: any) => {
                decrypt[`${order.orderNumber}_document`] = order.patient.patientId;
                decrypt[`${order.orderNumber}_name1`] = order.patient.name1;
                decrypt[`${order.orderNumber}_name2`] = order.patient.name2;
                decrypt[`${order.orderNumber}_lastName`] = order.patient.lastName;
                decrypt[`${order.orderNumber}_surName`] = order.patient.surName;
                order.tests.forEach((test: any) => {
                    if (test.result !== undefined && test.result !== null && test.result.result !== "") {

                        decrypt[`${order.orderNumber}_${test.id}`] = test.result.result;
                    }
                });
            });
            let listOfData: any = await decryptData(decrypt);
            if (listOfData !== null && listOfData !== undefined) {
                finalData.forEach((order: any) => {
                    order.patient.patientId = listOfData[`${order.orderNumber}_document`];
                    order.patient.name1 = listOfData[`${order.orderNumber}_name1`];
                    order.patient.name2 = listOfData[`${order.orderNumber}_name2`];
                    order.patient.lastName = listOfData[`${order.orderNumber}_lastName`];
                    order.patient.surName = listOfData[`${order.orderNumber}_surName`];
                    order.tests.forEach((test: any) => {
                        if (test.result !== undefined && test.result !== null && test.result.result !== "") {
                            test.result.result = listOfData[`${order.orderNumber}_${test.id}`];
                        }
                    });
                });
            }

            if (finalData.length > 0) {
                // Filtro demograficos no codificados
                finalData = await containsDemographicList(body.demographics, finalData);
            }
            //console.log("finalData0",finalData)

            // if (finalData.length > 0) {
            //     // Agrupar perfiles
            //     finalData = await filterExcludeTestByProfileList(finalData, body.groupProfiles);
            // }
        }
        console.log("Finalizo revisión de resultados gestión: ", toISOStringLocal(new Date()));
        console.log("====================================");
        return finalData;

    } catch (error) {
        console.log('error', error);
        return false;
    }
};
const getDataByDate = async (dates: any[], index: number, final: any, body: any): Promise<any> => {
    const response = await listBasic(dates[index].start, dates[index].end, body);
    let list: any = {};

    response.forEach((order: any) => {
        if (!list[order.lab22c1]) {
            list[order.lab22c1] = createOrderObject(order, body);
        }

        if (order.commentOrder) {
            addCommentToOrder(list[order.lab22c1], order);
        }

        if (order.lab39c1) {
            addTestToOrder(list[order.lab22c1], order, body);
           // console.log("order",order)
            if (order.lab70c1) {
                addInterviewToTest(list[order.lab22c1].tests.find((test: any) => test.id  === order.lab39c1) , order);
            }
        }
        
        //console.log("list",list)
        //console.log("list2",list[order.lab22c1].tests)
    });

    final = { ...final, ...list };

    if (index < dates.length - 1) {

        return getDataByDate(dates, index + 1, final, body);
    } else {
        //console.log("final",final)
        //console.log (final)
        return final;
    }
};

const createOrderObject = (order: any, body: any) => {

    //console.log("demo "  +await getAllDemographics(order, body.demographics))
    const orderObj: any = {
        orderNumber: order.lab22c1,
        createdDateShort: order.lab22c2,
        createdDate: order.lab22c3,
        externalId: order.lab22c7,
        lastUpdateUser: {
            name: order.lab04c2,
            lastName: order.lab04c3,
            userName: order.lab04c4
        },
        type: {
            id: order.lab103c1,
            code: order.lab103c2,
            name: order.lab103c3
        },
        patient: createPatientObject(order, body),
        branch: {
            id: order.lab05c1,
            code: order.lab05c10,
            name: order.lab05c4
        },
        service: body.service ? createServiceObject(order) : {},
        account: body.account ? createAccountObject(order) : {},
        physician: body.physician ? createPhysicianObject(order) : {},
        rate: body.rate ? createRateObject(order) : {},
        race: body.race ? createRaceObject(order) : {},
        allDemographics: body.demographics ? getAllDemographics(order, body.demographics) : [],
        tests: [],
        comments: [],
        userValidation : order.userValidationc2 ? order.userValidationc2 +  order.userValidationc3?  order.userValidationc2 : '' : '',

    };


    return orderObj;
};

const createPatientObject = (order: any, body: any) => ({
    id: order.lab21c1,
    patientId: order.lab21c2,
    name1: order.lab21c3,
    name2: order.lab21c4,
    lastName: order.lab21c5,
    surName: order.lab21c6,
    birthday: order.lab21c7 ? moment.utc(order.lab21c7).format('YYYY-MM-DD') : undefined, 
    email: order.lab21c8,
    size: order.lab21c9,
    weight: order.lab21c10,
    phone: order.lab21c16,
    address: order.lab21c17,
    sex: {
        id: order.lab21lab80lab80c1,
        code: order.lab21lab80lab80c3,
        esCo: order.lab21lab80lab80c4,
        enUsa: order.lab21lab80lab80c5
    },
    documenttype: body.documenttype ? createDocumentTypeObject(order) : {}
});

const createServiceObject = (order: any) => ({
    id: order.lab10c1,
    code: order.lab10c7,
    name: order.lab10c2
});

const createAccountObject = (order: any) => ({
    nit: order.lab14c2,
    id: order.lab14c1,
    name: order.lab14c3,
    encryptionReportResult: order.lab14c32
});

const createPhysicianObject = (order: any) => ({
    id: order.lab19c1,
    name: order.lab19c2,
    email: order.lab19c21
});

const createRateObject = (order: any) => ({
    id: order.lab904c1,
    code: order.lab904c2,
    name: order.lab904c3
});

const createRaceObject = (order: any) => ({
    id: order.lab21lab08lab08c1,
    code: order.lab21lab08lab08c5,
    name: order.lab21lab08lab08c2
});

const createDocumentTypeObject = (order: any) => ({
    id: order.lab21lab54lab54c1,
    abbr: order.lab21lab54lab54c2,
    name: order.lab21lab54lab54c3
});

const addCommentToOrder = (orderObj: any, order: any) => {
    if (!orderObj.comments) {
        orderObj.comments = [];
    }

    const validateComment = orderObj.comments.find((comment: any) => comment.id === order.idCommentOrder);
    if (!validateComment) {
        orderObj.comments.push({
            id: order.idCommentOrder,
            idRecord: orderObj.orderNumber,
            comment: order.commentOrder,
            type: order.typeCommentOrder,
            print: order.isPrintCommentOrder === 1
        });
    }
};

const addTestToOrder = (orderObj: any, order: any, body: any) => {
    if (!orderObj.tests) {
        orderObj.tests = [];
    }

    const validateTest = orderObj.tests.find((test: any) => test.id === order.lab39c1);
    if (!validateTest) {
        const test = createTestObject(order, body);
        orderObj.tests.push(test);
    }
};

const addInterviewToTest = (orderObj: any, order: any) => {
    console.log("orderObj",orderObj)
    if (!orderObj.interviews) {
        orderObj.interviews = [];
    }

    const validateInterview = orderObj.interviews.find((interview: any) => interview.questionId === order.lab70c1);
    if (!validateInterview) {
        orderObj.interviews.push(createInterviewObject(order));
    }
}

const createInterviewObject = (order: any) => ({
    questionId : order.lab70c1? order.lab70c1 : null,
    question : order.lab70c3? order.lab70c3 : null,
    answerId : order.lab90c1 !== undefined || order.lab90c1 !== null ? order.lab90c1 : 0,
    answer : order.lab179c1? order.lab179c1 : null,
    answerClose : order.lab90c2? order.lab90c2 :  null,
    panic : order.lab179c3? order.lab179c3 : null,
    delta: order.lab179c4? order.lab179c4 : null,
    critic: order.lab179c5? order.lab179c5 : null,

});

const createTestObject = (order: any, body: any) => {
    const test: any = {
        id: order.lab39c1,
        code: order.lab39c2,
        abbr: order.lab39c3,
        name: order.lab39c4,
        viewquery: order.lab39c26,
        temperatureTest: order.lab39c56,
        tentativeDeliveryDate: order.lab57c56,
        testType: order.lab39c37,
        confidential: order.lab39c27 === 1,
        gender: {
            id: order.lab39c6
        },
        idSexPatient:order.lab21lab80lab80c1,
        stateOrder : order.lab57c8,
        remission: order.lab57c54,
        profile: order.lab57c14,
        excluideTestProfile: order.panellab39c39,
        result: createResultObject(order),
        laboratory: {
            code: order.lab40c2,
            name: order.lab40c3
        },
        area: {
            abbreviation: order.lab43c3,
            name: order.lab43c4,
        },
        sample: {
            id: order.lab24c1,
            name: order.lab24c2,
            codesample: order.lab24c9,
            container: {
                name: order.lab56c2
            },
            takeDate: order.lab57c39
        },
        rackStore: order.lab16c3,
        positionStore: order.lab11c1,
        unit: {
            name: order.lab45c2
        },
        resultComment: createResultCommentObject(order),
       
    };

    if (order.userResultc1) {
        test.result.userRes = createUserResultObject(order);
    }

    if (order.userValidationc1) {
        test.result.userVal = createUserValidationObject(order);
    }

    if (order.userPrintedc1) {
        test.result.userPri = createUserPrintedObject(order);
    }

    if (order.panellab39c1) {
        test.panel = createPanelObject(order);
    }

    if (order.packlab39c1) {
        test.pack = createPackObject(order);
    }

    if (body.consultarSistemaCentral) {
        test.homologationCodes = order.lab61c1;
    }

    if (body.price) {
        test.testPrice = {
            servicePrice: order.lab900c2,
            patientPrice: order.lab900c3,
            insurancePrice: order.lab900c4,
            tax: order.lab900c5
        };
    }

    return test;
};
//new Date(order.lab57c4.toString().replace("Z","")).getTime() + " " +order.lab57c4 + " " 
const createResultObject = (order: any) => ({
    result: order.lab57c1,
    dateResult: order.lab57c2 ? moment.utc(order.lab57c2).valueOf() : undefined,
    dateOrdered: order.lab57c4 ? moment.utc(order.lab57c4).valueOf() : undefined,
    dateTake: order.lab57c39 ? moment.utc(order.lab57c39).valueOf() : undefined,
    dateValidation: order.lab57c18 ? moment.utc(order.lab57c18).valueOf() : undefined,
    dateVerific: order.lab57c37 ? moment.utc(order.lab57c37).valueOf() : undefined,
    diffValidationEntry: moment(order.lab57c18).diff(moment(order.lab57c4), 'minutes'),
    state: order.lab57c8,
    sampleState: order.lab57c16,
    pathology: order.lab57c9,
    datePrint: order.lab57c22 ? moment.utc(order.lab57c22).valueOf() : undefined,
    print: order.lab57c25 === 1
});

const createResultCommentObject = (order: any) => ({
    order: order.lab22c1,
    testId: order.lab39c1,
    comment: order.lab95c1,
    commentDate: order.lab95c2,
    pathology: order.lab95c3,
    userId: order.userComment,
    commentChanged: false
});

const createUserResultObject = (order: any) => ({
    id: order.userResultc1,
    name: order.userResultc2,
    lastName: order.userResultc3
});

const createUserValidationObject = (order: any) => ({
    id: order.userValidationc1,
    name: order.userValidationc2,
    lastName: order.userValidationc3
});

const createUserPrintedObject = (order: any) => ({
    id: order.userPrintedc1,
    name: order.userPrintedc2,
    lastName: order.userPrintedc3
});

const createPanelObject = (order: any) => ({
    id: order.panellab39c1,
    code: order.panellab39c2,
    abbr: order.panellab39c3,
    name: order.panellab39c4,
    testType: order.panellab39c37
});

const createPackObject = (order: any) => ({
    id: order.packlab39c1,
    code: order.packlab39c2,
    abbr: order.packlab39c3,
    name: order.packlab39c4,
    testType: order.packlab39c37
});

const getAllDemographics = (order: any, demographics: any[]) => {
    let demoResults = [] as any[];
    demographics.forEach((demo: any) => {
        let data = [];
        if (demo.encoded) {
            data = [
                order[`demo${demo.id}_id`],
                order[`demo${demo.id}_code`],
                order[`demo${demo.id}_name`]
            ];
        } else {
            data[0] = order[`lab_demo_${demo.id}`];
        }
        demoResults.push(getDemographicsValue(demo, data));
    });
    return demoResults;
};

const listBasic = async (vInitial: string, vFinal: string, filters: any) => {
    let currentYear = new Date().getFullYear();
    let start = vInitial.split('-');
    let lab22 = +start[0] === currentYear ? "lab22" : `lab22_${+start[0]}`;
    let lab57 = +start[0] === currentYear ? "lab57" : `lab57_${+start[0]}`;
    let lab60 = +start[0] === currentYear ? "lab60" : `lab60_${+start[0]}`;
    let lab95 = +start[0] === currentYear ? "lab95" : `lab95_${+start[0]}`;
    let lab179 = +start[0] === currentYear ? "lab179" : `lab179_${+start[0]}`;
    let lab900 = +start[0] === currentYear ? "lab900" : `lab900_${+start[0]}`;


    console.log(`Inicia consulta de gestión desde ${vInitial} hasta ${vFinal} a las: `, toISOStringLocal(new Date()));

    let query = ` SELECT lab22.lab22c1, lab22c2, lab22c3, lab22c7, lab22.lab103c1, lab103c2, lab103c3, 
        lab21.lab21c1, lab21c2, lab21c3, lab21c4, lab21c5, lab21c6, lab21c7, lab21c8, lab21c9, lab21c10, lab21c16, lab21c17, 
        lab21lab80.lab80c1 AS lab21lab80lab80c1, lab21lab80.lab80c3 AS lab21lab80lab80c3, lab21lab80.lab80c4 AS lab21lab80lab80c4, 
        lab21lab80.lab80c5 AS lab21lab80lab80c5, lab05.lab05c1, lab05c10, lab05c4, lab04.lab04c2, lab04.lab04c3, lab04.lab04c4, 
        lab57.lab57c1, lab57.lab57c2, lab57.lab57c8, lab57.lab57c9, lab57.lab57c14, lab57.lab57c15, lab57.lab57c16, lab57.lab57c4, lab57.lab57c18, lab57.lab57c39, lab57c37, lab57c22, lab57c25, lab57c56, 
        userResult.lab04c1 AS userResultc1, userResult.lab04c2 AS userResultc2, userResult.lab04c3 AS userResultc3,  
        userValidation.lab04c1 AS userValidationc1, userValidation.lab04c2 AS userValidationc2, userValidation.lab04c3 AS userValidationc3,  
        userPrinted.lab04c1 AS userPrintedc1, userPrinted.lab04c2 AS userPrintedc2, userPrinted.lab04c3 AS userPrintedc3,  
        lab39.lab39c1, lab39.lab39c2, lab39.lab39c3, lab39.lab39c4, lab39.lab39c6,lab39.lab39c37, lab39.lab39c27, lab39.lab39c26, lab39.lab39c56, 
        lab43c3, lab43.lab43c4, lab39.lab24c1, lab24c2, lab24c9, lab45.lab45c2, lab56.lab56c2, 
        panel.lab39c1 AS panellab39c1, panel.lab39c2 AS panellab39c2, panel.lab39c3 AS panellab39c3, panel.lab39c4 AS panellab39c4, panel.lab39c37 AS panellab39c37, lab39.lab39c39 AS panellab39c39, 
        pack.lab39c1 AS packlab39c1, pack.lab39c2 AS packlab39c2, pack.lab39c3 AS packlab39c3, pack.lab39c4 AS packlab39c4, pack.lab39c37 AS packlab39c37,  lab39.lab39c39 AS packlab39c39, 
        lab40.lab40c2, lab40.lab40c3, lab16.lab16c3, lab11.lab11c1, lab57.lab57c54, lab57.lab57c39, 
        lab60.lab60c1 as idCommentOrder, lab60.lab60c3 as commentOrder, lab60.lab60c4 as typeCommentOrder, lab60.lab60c6 as isPrintCommentOrder, 
        lab95c1, lab95c2, lab95c3, lab95.lab04c1 as userComment
    `;

    let from = `  
        FROM ${lab57} AS lab57 
        INNER JOIN ${lab22} AS lab22 ON lab22.lab22c1 = lab57.lab22c1 
        INNER JOIN lab05 ON lab05.lab05c1 = lab22.lab05c1  
        INNER JOIN lab21 ON lab21.lab21c1 = lab22.lab21c1  
        INNER JOIN lab39 ON lab39.lab39c1 = lab57.lab39c1  
        INNER JOIN lab80 lab21lab80 ON lab21lab80.lab80c1 = lab21.lab80c1  
        INNER JOIN lab103 ON lab103.lab103c1 = lab22.lab103c1  
        LEFT JOIN lab04 ON lab04.lab04c1 = lab22.lab04c1  
        LEFT JOIN lab39 panel ON panel.lab39c1 = lab57.lab57c14 
        LEFT JOIN lab39 pack ON pack.lab39c1 = lab57.lab57c15 
        LEFT JOIN lab43 ON lab43.lab43c1 = lab39.lab43c1 
        LEFT JOIN lab24 ON lab24.lab24c1 = lab39.lab24c1 
        LEFT JOIN lab45 ON lab45.lab45c1 = lab39.lab45c1 
        LEFT JOIN lab40 ON lab40.lab40c1 = lab57.lab40c1 
        LEFT JOIN lab56 ON lab56.lab56c1 = lab24.lab56c1 
        LEFT JOIN ${lab60} AS lab60 ON lab60.lab60c2 = lab57.lab22c1 
        LEFT JOIN lab11 ON lab11.lab24c1 = lab57.lab24c1 AND lab11.lab22c1 = lab57.lab22c1 
        LEFT JOIN lab16 ON lab16.lab16c1 = lab11.lab16c1 
        LEFT JOIN lab04 AS userResult ON userResult.lab04c1 = lab57.lab57c3 
        LEFT JOIN lab04 AS userValidation ON userValidation.lab04c1 = lab57.lab57c19 
        LEFT JOIN lab04 AS userPrinted ON userPrinted.lab04c1 = lab57.lab57c23 
        LEFT JOIN ${lab95} AS lab95 ON lab95.lab22c1 = lab57.lab22c1 AND lab95.lab39c1 = lab57.lab39c1 
    `;
    if (filters.price) {
        query += ", lab900c2, lab900c3, lab900c4, lab900c5 ";
        from += ` LEFT JOIN ${lab900} AS lab900 ON lab900.lab22c1 = lab57.lab22c1 AND lab900.lab39c1 = lab57.lab39c1`;
    }
    // ordenes canceladas
    if (filters.canceledorders) {

        from += `LEFT JOIN lab03 ON lab22.lab22c1 = LAB03.lab22c1 and lab03c1 is null and lab03c2 = 'D' 
                 LEFT JOIN lab30 ON lab30.lab30c1 = LAB03.lab30c1 LEFT JOIN lab04 as userinactive ON userinactive.lab04c1 = LAB03.lab04c1 ` ;
    }

    if (filters.documenttype) {
        query += " ,lab21lab54.lab54c1 AS lab21lab54lab54c1,  lab21lab54.lab54c2 AS lab21lab54lab54c2, lab21lab54.lab54c3 AS lab21lab54lab54c3 ";
        from += " LEFT JOIN lab54 lab21lab54 ON lab21lab54.lab54c1 = lab21.lab54c1  ";
    }
    if (filters.service) {
        query += " , lab22.lab10c1, lab10c2, lab10c7 ";
        from += " LEFT JOIN lab10 ON lab10.lab10c1 = lab22.lab10c1  ";
    }
    if (filters.account) {
        query += " ,lab22.lab14c1,  lab14c2, lab14c3, lab14c32 ";
        from += " LEFT JOIN lab14 ON lab14.lab14c1 = lab22.lab14c1  ";
    }
    if (filters.physician) {
        query += " ,lab22.lab19c1,  lab19c2, lab19c3, lab19c21 ";
        from += " LEFT JOIN lab19 ON lab19.lab19c1 = lab22.lab19c1  ";
    }
    if (filters.rate) {
        query += " , lab22.lab904c1, lab904c2, lab904c3 ";
        from += " LEFT JOIN lab904 ON lab904.lab904c1 = lab22.lab904c1  ";
    }
    if (filters.race) {
        query += " , lab21lab08.lab08c1 AS lab21lab08lab08c1, lab21lab08.lab08c2 AS lab21lab08lab08c2, lab21lab08.lab08c5 AS lab21lab08lab08c5 ";
        from += " LEFT JOIN lab08 lab21lab08 ON lab21lab08.lab08c1 = lab21.lab08c1  ";
    }
    if (filters.consultarSistemaCentral) {
        query += " , lab61c1 ";
        from += ` LEFT JOIN lab61 ON lab61.lab39c1 = lab57.lab39c1 and lab61.lab118c1 = ${filters.sistemaCentralListados} `;
    }

    let querysDemos: any = await createDemographicsQuery(filters.demographics);
    query += querysDemos.select;
    from += querysDemos.from;

    if (!filters.body.groupPackages && filters.body.testFilterType !== 2) {
        from += " WHERE lab39.lab39c37 = 0  AND ";
        // if (!filters.body.pending) {
        //     from += " lab57c14 is not null AND ";
        // }
    } else {
        from += " WHERE ";
    }

    switch (+filters.body.rangeType) {
        case 0:
            from += ` (lab57.lab57c34 BETWEEN ${vInitial.split('-').join('')} AND ${vFinal.split('-').join('')} ) `;
            break;
        case 1:
            from += ` (lab22.lab22c1 BETWEEN ${filters.body.init} AND ${filters.body.end} ) `;
            break;
        case 3:
            from += ` (lab22.lab22c2 BETWEEN ${vInitial.split('-').join('')} AND ${vFinal.split('-').join('')} ) `;
            break;
        default:
            from += ` lab22.lab22c1 IN ( ${filters.body.orders.join()} )`;
            break;
    }


    if (filters.body.groupPackages) {
        from += " AND lab57.lab57c14 IS NULL AND lab57.lab57c15 IS NULL ";
    }

    // Filtro por tipo de orden
    if (filters.body.orderType !== 0 && filters.body.orderType !== null) {
        from += ` AND lab22.lab103c1 = ${filters.body.orderType} `;
    }

    //Filtro por examenes confidenciales y areas

    switch (filters.body.testFilterType) {
        case 1:
            from += ` AND lab39.lab43c1 IN ( ${filters.body.tests.join()} )`;
            break;
        case 2:
            from += ` AND (lab57.lab57c14 IN ( ${filters.body.tests.join()} ) or lab39.lab39c1 IN ( ${filters.body.tests.join()}))`;
            break;
        case 3:
            from += ` AND (lab57.lab57c14 IN ( ${filters.body.tests.join()} )) or lab39.lab39c1 IN ( ${filters.body.tests.join()}))`;
            break;
        default:
            break;
    }

    // Filtro por laboratorio 
    if (filters.body.laboratory !== 0 && filters.body.laboratory !== null && filters.body.laboratory !== undefined) {
        from += ` AND lab57.lab40c1 = ${filters.body.laboratory} `;
    }

    //Filtro por descripcion de paquetes
    if (filters.body.packageDescription) {
        from += " AND lab57.lab57c15 is not null";
    }

    if (filters.body.testState.length > 0 && filters.body.sampleState.length > 0) {
        if (filters.body.groupProfiles) {
            //en or estaba lab39.lab39c37 = 1 or lab57.lab57c8
            from += ` AND ( lab57c14 IS NULL  and lab57.lab57c8 IN( ${filters.body.testState.join()} ) AND (lab57.lab57c16 IN( ${filters.body.sampleState.join()})  )  ) `;
        } else {
            from += ` AND ( lab39.lab39c37 = 0 and lab57.lab57c8 IN( ${filters.body.testState.join()} ) AND (lab57.lab57c16 IN( ${filters.body.sampleState.join()} )  )  ) `;
        }
    } else if (filters.body.testState.length > 0) {
        if (filters.body.groupProfiles) {
            from += ` AND (  lab57c14 IS NULL  and lab57.lab57c8 IN( ${filters.body.testState.join()} )) `;
        } else {
            from += ` AND ( lab39.lab39c37 = 0 and lab57.lab57c8 IN( ${filters.body.testState.join()} )) `;
        }
    } else if (filters.body.sampleState.length > 0) {
        if (filters.body.groupProfiles) {
            from += ` AND ( lab57c14 IS NULL  and  lab57.lab57c16 IN( ${filters.body.sampleState.join()} ) ) `;
        } else {
            from += ` AND ( lab57.lab57c16 IN( ${filters.body.sampleState.join()} ) ) `;
        }
    }

    if (filters.body.resultState && filters.body.resultState.length > 0) {
        switch (filters.body.resultState[0]) {
            case 1: //modificado
                from += "  ";
                break;
            case 2://repeticion
                from += " AND (lab57.lab24c1 is null or lab57.lab57c48 is not null) ";
                break;
            case 3://patologico
                if (filters.body.groupProfiles) {
                    from += " AND (lab57c14 IS NULL and lab57.lab57c9 IN(1,2,3)) ";
                } else {
                   
                    from += " AND lab57.lab57c9 IN(1,2,3) ";
                }
                break;
            case 4://panico
                if (filters.body.groupProfiles) {
                    from += " AND (  lab57c14 IS NULL  and lab57.lab57c9 IN(4,5,6)) ";
                } else {
                    query += " ,lab70.lab70c1,lab70c3,lab90.lab90c1,lab90c2,lab179.lab179c1,lab179c3,lab179c4,lab179c5 ";

                    from= from.replace("WHERE",
                         `LEFT JOIN ${lab179} as lab179 ON lab179.lab39c1 = lab39.lab39c1 and lab179.lab22c1 = lab22.lab22c1
	                      LEFT JOIN lab70 ON lab70.lab70c1 = lab179.lab70c1 
                          LEFT JOIN lab90 ON Lab90.lab90c1 = lab179.lab90c1
                          WHERE`);

                    from += " AND lab57.lab57c9 IN(4,5,6) ";
                }
                break;
            case 5://deltacheck
                from += " ";
                break;
            default:
                break;
        }
    }

    if (!filters.body.groupPackages) {
        //filtro por estado de la muestra.
        switch (filters.body.check) {
            case 1:
                from += ` AND lab57.lab57c16 = ${ResultSampleState.CHECKED} `;
                break;
            case 2:
                from += ` AND (lab57.lab24c1 is null or lab57.lab57c16 < ${ResultSampleState.CHECKED} ) `;
                break;
            default:
                break;
        }
    } else {
        //filtro por estado de la muestra.
        switch (filters.body.check) {
            case 1:
                from += ` AND ((SELECT MIN(lab57c16) FROM ${lab57} AS lab57 WHERE lab57.lab22c1 = lab22.lab22c1 AND (lab39.lab39c1 = lab57.lab57c14 OR lab39.lab39c1 = lab57.lab57c15)) = ${ResultSampleState.CHECKED} OR ( lab39.lab39c37 = 0 AND lab57.lab57c16 = ${ResultSampleState.CHECKED} )) `;
                break;
            case 2:
                from += ` AND ((SELECT MIN(lab57c16) FROM ${lab57} AS lab57 WHERE lab57.lab22c1 = lab22.lab22c1 AND (lab39.lab39c1 = lab57.lab57c14 OR lab39.lab39c1 = lab57.lab57c15)) < ${ResultSampleState.CHECKED} OR ( lab39.lab39c37 = 0 AND  lab57.lab57c16 < ${ResultSampleState.CHECKED} )) `;
                break;
            default:
                break;
        }
    }

    if (filters.body.facturation === 1) {
        from += ` AND ((SELECT MIN(lab57c16) FROM ${lab57} AS lab57 WHERE lab57.lab22c1 = lab22.lab22c1 AND (lab39.lab39c1 = lab57.lab57c14 OR lab39.lab39c1 = lab57.lab57c15)) > ${ResultSampleState.NEW_SAMPLE} OR ( lab39.lab39c37 = 0 AND lab57.lab57c16 > ${ResultSampleState.NEW_SAMPLE} )) `;
    }
    if (filters.body.canceledorders) {
        from += " AND lab22.lab07C1 = 0 and lab21.lab21c1 != 0 ";
    } else {
        from += " AND lab22.lab07C1 != 0 and lab21.lab21c1 != 0 ";
    }

    let finalQuery = undefined;

    if (filters.body.demographics.length > 0) {
        finalQuery = await buildSQLDemographicFilter(filters.body.demographics, query, from);
    }

    if (finalQuery !== undefined) {
        query = finalQuery.select;
        from = finalQuery.where;
    }
    //console.log(query + from);
    const [data] = await db.query(query + from);
    console.log('Responde consulta gestión:  ', toISOStringLocal(new Date()));
    console.log('====================================');
    return data;
}

const getStatesManagement = async (body: any) => {
    body.sampleState = [];
    body.testState = [];
    body.filterState = body.filterState ? body.filterState : [];
    for (let i of body.filterState) {
        switch (i) {
            case 0:
                body.sampleState.push(ResultSampleState.ORDERED);
                body.testState.push(ResultTestState.ORDERED);
                break;
            case 1:
                if (!body.sampleState.find((s: any) => s === ResultSampleState.CHECKED)) {
                    body.sampleState.push(ResultSampleState.CHECKED);
                }
                if (!body.testState.find((s: any) => s === ResultTestState.RERUN)) {
                    body.testState.push(ResultTestState.RERUN);
                }
                break;
            case 2:
                if (!body.sampleState.find((s: any) => s === ResultSampleState.CHECKED)) {
                    body.sampleState.push(ResultSampleState.CHECKED);
                }
                if (!body.testState.find((s: any) => s === ResultTestState.REPORTED)) {
                    body.testState.push(ResultTestState.REPORTED);
                }
                break;
            case 3:
                if (!body.sampleState.find((s: any) => s === ResultSampleState.CHECKED)) {
                    body.sampleState.push(ResultSampleState.CHECKED);
                }
                if (!body.testState.find((s: any) => s === ResultTestState.PREVIEW)) {
                    body.testState.push(ResultTestState.PREVIEW);
                }
                break;
            case 4:
                if (!body.sampleState.find((s: any) => s === ResultSampleState.CHECKED)) {
                    body.sampleState.push(ResultSampleState.CHECKED);
                }
                if (!body.testState.find((s: any) => s === ResultTestState.VALIDATED)) {
                    body.testState.push(ResultTestState.VALIDATED);
                }
                break;
            case 5:
                if (!body.sampleState.find((s: any) => s === ResultSampleState.CHECKED)) {
                    body.sampleState.push(ResultSampleState.CHECKED);
                }
                if (!body.testState.find((s: any) => s === ResultTestState.DELIVERED)) {
                    body.testState.push(ResultTestState.DELIVERED);
                }
                break;
        }
    }
    return body;
}

// PENDIENTES
const getPendingState = async (body: any) => {
    body.sampleState = [];
    body.testState = [];
    body.filterState = body.filterState ? body.filterState : [];
    for (let i of body.filterState) {
        switch (i) {
            case 0:
                body.sampleState.push(ResultSampleState.ORDERED);
                body.sampleState.push(ResultSampleState.COLLECTED);
                body.testState.push(ResultSampleState.CHECKED);

                body.testState.push(ResultTestState.ORDERED);
                body.testState.push(ResultTestState.RERUN);
                body.testState.push(ResultTestState.REPORTED);
                body.testState.push(ResultTestState.PREVIEW);
                body.testState.push(ResultTestState.VALIDATED);
                break;
            case 1:
                body.sampleState.push(ResultSampleState.ORDERED);
                break;
            case 2:
                body.sampleState.push(ResultSampleState.ORDERED);
                body.sampleState.push(ResultSampleState.COLLECTED);
                body.sampleState.push(ResultSampleState.NEW_SAMPLE);
                body.sampleState.push(ResultSampleState.PENDING);
                body.sampleState.push(ResultSampleState.REJECTED);
                break;
            case 3:
                body.sampleState.push(ResultSampleState.CHECKED);
                body.testState.push(ResultTestState.ORDERED);
                body.testState.push(ResultTestState.RERUN);
                break;
            case 4:
                body.testState.push(ResultTestState.REPORTED);


                body.testState.push(ResultTestState.PREVIEW);
                break
            case 5:
                body.testState.push(ResultTestState.VALIDATED);
                break;

        }
    }
    return body;
}
function toISOStringLocal(d: any) {
    function z(n: any) { return (n < 10 ? '0' : '') + n }
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' +
        z(d.getDate()) + ' ' + z(d.getHours()) + ':' +
        z(d.getMinutes()) + ':' + z(d.getSeconds())

}
