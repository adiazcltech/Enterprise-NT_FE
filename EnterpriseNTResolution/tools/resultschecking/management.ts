import { getValueKey } from "../common";
import { Constants } from "../constants";
import moment from 'moment';

export const createDemographicsQuery = async(demographics: any) => {
    let querys = {
        select: "",
        from: ""
    };
    demographics.forEach( (demo:any) => {
        let query:any = {};
        if(demo.origin === "O") {
            query = createEncodedDemographicQuery(demo, "lab22.lab_demo_", "lab22");
        } else if(demo.origin === "H") {
            query = createEncodedDemographicQuery(demo, "Lab21.lab_demo_", "lab21");
        }
        querys.select += query.select;
        querys.from += query.from;
    }); 
    return querys;
}

function createEncodedDemographicQuery(demographic: any, type:string, table: string) {
    let select = '';
    let from = '';
    if(demographic.encoded) {
        select += `, demo${demographic.id}.lab63c1 as demo${demographic.id}_id `;
        select += `, demo${demographic.id}.lab63c2 as demo${demographic.id}_code `;
        select += `, demo${demographic.id}.lab63c3 as demo${demographic.id}_name `;
        from += `LEFT JOIN Lab63 demo${demographic.id} ON ${type}${demographic.id} = demo${demographic.id}.lab63c1 `
    } else {
        select += `, ${table}.lab_demo_${demographic.id}`;
    }
    return { select, from };
}

// Construir el filtro SQL para listados
export const buildSQLDemographicFilter = async (demographics: Array<any>, select: string, where: string ) => {
    if(demographics !== null && demographics.length > 0) {
        demographics.map( (demo:any) => {
            if(demo.demographic !== null) {
                if(demo.demographicItems.length > 0) {
                    switch (demo.demographic) {
                        case Constants.BRANCH:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab05c1 in ( ${ demo.demographicItems.join() } ) `; 
                            }
                            break;
                        case Constants.SERVICE:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab10c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.PHYSICIAN:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab19c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.ACCOUNT:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab14c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.RATE:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab904c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.RACE:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab21.lab08c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.PATIENT_SEX:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab21.lab80c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.DOCUMENT_TYPE:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab21.lab54c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        case Constants.ORDERTYPE:
                            if (demo.demographicItems != null && demo.demographicItems.length > 0)
                            {
                                where += ` AND lab22.lab103c1 in ( ${ demo.demographicItems.join() } )`; 
                            }
                            break;
                        default:
                            if (demo.demographic > 0) {
                                if (demo.origin != null) {
                                    if(demo.demographicItems !== null && demo.demographicItems.length > 0 ) {
                                        where += ` AND lab_demo_${demo.demographic} in ( ${ demo.demographicItems.join() } )`;
                                    } else {
                                        where += ` AND lab_demo_${demo.demographic} = ${ demo.value } `;
                                    }
                                }
                            }
                            break;
                    }
                }
            }
        });
    }
    return { select, where }
}

// Construir el filtro SQL para listados
export const containsDemographicList = async (demographics: Array<any>, list:any) => {
    if(demographics !== null && demographics.length > 0) {
        let demosNotCodid = demographics.filter( demo => !demo.encoded);
        if(demosNotCodid.length > 0) {
            list = list.filter( (order:any) => {
                for( let key in demosNotCodid ) {
                    if(demosNotCodid[key].demographic !== null) {
                        if(demosNotCodid[key].value !== null && demosNotCodid[key].value !== undefined && demosNotCodid[key].value !== "") {
                            switch (demosNotCodid[key].demographic) {
                                case Constants.PATIENT_ID:
                                    if(demosNotCodid[key].value !== order.patient.patientId) {
                                        return false;
                                    }
                                    break;
                                case Constants.PATIENT_LAST_NAME:
                                    if(demosNotCodid[key].value !== order.patient.lastName) {
                                        return false;
                                    }
                                    break;
                                case Constants.PATIENT_SURNAME:
                                    if(demosNotCodid[key].value !== order.patient.surName) {
                                        return false;
                                    }
                                    break;
                                case Constants.PATIENT_NAME:
                                    if(demosNotCodid[key].value !== order.patient.name1) {
                                        return false;
                                    }
                                    break;
                                case Constants.PATIENT_SECOND_NAME:
                                    if(demosNotCodid[key].value !== order.patient.name2) {
                                        return false;
                                    }
                                    break;
                                case Constants.PATIENT_AGE:
                                    const now = new Date();
                                    const year = now.getFullYear();
                                    let month = now.getMonth();
                                    const day = now.getDate();
                                    let date = "";
                                    
                                    switch (demosNotCodid[key].unidAge)//edad 1 -> años, 2 -> meses, 3 -> dias
                                    {
                                        case "1":
                                            date = `${demosNotCodid[key].value}${(month < 10 ? `0${month}` : month)}${(day < 10 ? `0${day}` : day)}`;
                                            break;
                                        case "2":
                                            date = `${year}${demosNotCodid[key].value}${(day < 10 ? `0${day}` : day)}`
                                            break;
                                        default:
                                            date = demosNotCodid[key].value; `${year}${(month < 10 ? `0${month}` : month)}${demosNotCodid[key].value}`;
                                            break;
                                    }
                                    date = moment(date).format('YYYYMMDD');
                                    let patientYear = moment(order.patient.birthday).format('YYYYMMDD');
                                    switch (demosNotCodid[key].operator)
                                    {
                                        case "2":
                                            if (!(date >= patientYear))
                                            {
                                                return false;
                                            }
                                            break;
                                        case "3":
                                            if (!(date <= patientYear))
                                            {
                                                return false;
                                            }
                                            break;
                                        default:
                                            break;
                                    }

                                    break;
                                default:
                                    return true;
                            }
                        }
                    }
                }
                return true;
            });
        }
    }
    return list;
}

// agrupar perfiles
export const filterExcludeTestByProfileList = async (list:any, groupProfiles:any) => {
    if(groupProfiles) {
        let validationByAnalite = await getValueKey('FechaValidacionAnalitoEnPerfil') === 'True';
        list.forEach( (order:any) => {
            const profiles = order.tests.filter( (test:any) => test.testType !== 0);
            if(profiles.length > 0) {
                profiles.forEach( (profile:any) => {
                    let analites = order.tests.filter( (test:any) => test.profile === profile.id);
                    if(profile.testType === 1 && analites.length > 0 ) {
                        let min = Math.min(...analites.map((analite:any) => analite.result.state));
                        profile.result.state = min;
                    }
                    if(analites.length === 0) {
                        const index = order.tests.findIndex( (test:any) => test.id === profile.id); 
                        if(index >= 0) {
                            order.tests.splice(index, 1);
                        }
                    } else {
                        if(validationByAnalite) {
                            profile.result.dateValidation = analites[0].result.dateValidation;
                        }
                    }
                });
            }
            order.tests = order.tests.filter( (test:any) => !test.profile);
        });
    }
    return list;
}