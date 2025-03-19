import { getValueKey } from "../tools/common";
import { db } from "./config/conection";
import { DashboardModule } from "../tools/constants";
import { sendDataServiceDashboard, decryptData, sendDataUpdateServiceDashboard } from "../helpers/dashboard";

export const sendDataDashboard = async () => {
    try {
        if (await getValueKey("IntegracionDashBoard")  === 'True')
        {
            let keyValidation = await getValueKey("TableroValidacion")  === 'True';
            let keyOpportunityTime = await getValueKey("TableroTiempoDeOportunidad")  === 'True';
            let keyTestTracking = await getValueKey("TableroSeguimientoDePruebas")  === 'True';

            let uriValidate = await getValueKey("UrlDashBoard") + "/BoardV";
            let uriOpportunityTime = await getValueKey("UrlDashBoard") + "/BoardTOE";
            let uriTracing = await getValueKey("UrlDashBoard") + "/BoardSPU";

            let demoHospitalLocation = await getValueKey("UbicacionHospitalaria") === '0' ? "" : await getValueKey("UbicacionHospitalaria");
            let demographicSendDashboard = await getValueKey("demoTableros");
            let itemSendDashboardDemographic = await getValueKey("itemDemoTableros");
            
            let responseordered = await getDashboardData(demographicSendDashboard, itemSendDashboardDemographic,demoHospitalLocation, DashboardModule.ORDERED);
            console.log('responde datos tablero INGRESO ' + responseordered.length);
            if(responseordered.length > 0) {
                var dataentryflag: any[] = [];
                let dataentry = await mapperDashboardData(responseordered);
            
                if(keyValidation){
                    var prueba = await sendDataServiceDashboard(dataentry, uriValidate);
                    console.log(JSON.stringify(prueba))
                }
                if(keyOpportunityTime){
                    await sendDataServiceDashboard(dataentry, uriOpportunityTime);
                }
                if(keyTestTracking){
                    var prueba = await sendDataServiceDashboard(dataentry, uriTracing);
                    console.log(JSON.stringify(prueba))
                }
                dataentryflag = dataentryflag.concat(dataentry);
                console.log("dataflag... " + dataentryflag.length)
                await changeFlagDashboard(dataentryflag, 1);

            } else {
                console.log('No Ordenes ingresadas para enviar');
            }

            let responsecheck = await getDashboardData(demographicSendDashboard, itemSendDashboardDemographic,demoHospitalLocation, DashboardModule.CHECKED);
            console.log('responde datos tablero VERIFICACION ' + responsecheck.length);
            if(responsecheck.length > 0) {
                var datacheckflag: any[] = [];
                let datacheck = await mapperDashboardData(responsecheck);

                if(keyValidation){
                    await sendDataUpdateServiceDashboard(datacheck, uriValidate);
                }
                if(keyOpportunityTime){
                    await sendDataUpdateServiceDashboard(datacheck, uriOpportunityTime);
                }
                if(keyTestTracking){
                
                    await sendDataUpdateServiceDashboard(datacheck, uriTracing);
                }

                datacheckflag =  datacheckflag.concat(datacheck);
                await changeFlagDashboard(datacheckflag, 2);

            } else {
                console.log('No Ordenes verificadas para enviar');
            }

            let responsereported = await getDashboardData(demographicSendDashboard, itemSendDashboardDemographic,demoHospitalLocation, DashboardModule.REPORTED);
            console.log('responde datos tablero RESULTADOS ' + responsereported.length);
            if(responsereported.length > 0) {
                var datareportedflag: any[] = [];
                
                let datareported = await mapperDashboardData(responsereported);
                
                if(keyValidation){
                    await sendDataUpdateServiceDashboard(datareported, uriValidate);
                }
                if(keyOpportunityTime){
                    await sendDataUpdateServiceDashboard(datareported, uriOpportunityTime);
                    
                }
                if(keyTestTracking){
                    //pendiente construir data
                    await sendDataUpdateServiceDashboard(datareported, uriTracing);
                }

                datareportedflag = datareportedflag.concat(datareported);
                
                await changeFlagDashboard(datareportedflag, 3);
                

            } else {
                console.log('No Ordenes con resultado para enviar');
            }

            let responsevalidated = await getDashboardData(demographicSendDashboard, itemSendDashboardDemographic,demoHospitalLocation, DashboardModule.VALIDATED);
            console.log('responde datos tablero VALIDACION ' + responsevalidated.length);
            if(responsevalidated.length > 0) {
                var datavalidatedflag: any[] = [];
                let datavalidated = await mapperDashboardData(responsevalidated);

                if(keyValidation){
                    await sendDataUpdateServiceDashboard(datavalidated, uriValidate);
                }
                if(keyOpportunityTime){
                    await sendDataUpdateServiceDashboard(datavalidated, uriOpportunityTime);
                }
                if(keyTestTracking){
                    await sendDataUpdateServiceDashboard(datavalidated, uriTracing);
                }

                datavalidatedflag = datavalidatedflag.concat(datavalidated);
                await changeFlagDashboard(datavalidatedflag, 4);

            } else {
                console.log('No Ordenes con validacion para enviar');
            }

        }
    } catch (error) {
        console.log('error', error);
    }
}

const getDashboardData = async( demographicSendDashboard:any , itemSendDashboardDemographic:any, demoHospitalLocation:any, type:any) => {
   
    var condicionalDashoard = "";
    let query = " ";
    let querydemoHospitalLocation = " ";
    let from = ` `;

    if(itemSendDashboardDemographic != "" &&  itemSendDashboardDemographic != "0"){
       condicionalDashoard = " AND lab22.lab_demo_" + demographicSendDashboard + " = " + itemSendDashboardDemographic;
    }

     // Demografico Ubicación hospitalaria
     if (demoHospitalLocation != ""){
        querydemoHospitalLocation += "   ,  lab22.lab_demo_" + demoHospitalLocation + " AS demoHospitalLocation ";
    }

    
    query += `  SELECT TOP 100  lab22.lab22c1,
                        lab10.lab10c1,
                        lab10.lab10c2,
                        lab10.lab10c7,
                        lab39.lab39c1,
                        lab39.lab39c2,
                        lab39.lab39c3,
                        lab39.lab39c4,
                        lab05.lab05c1,
                        lab05.lab05c4,
                        lab103.lab103c2,
                        lab21.lab21c3,
                        lab21.lab21c4,
                        lab21.lab21c5,
                        lab21.lab21c6,
                        lab21.lab21c2,
                        lab22.lab22c3,
                        lab57.lab57c8,
                        lab57.lab57c18,
                        lab43.lab43c1,
                        lab57.lab57c37 AS verifyDate,
                        lab57.lab57c39 AS dateTake,
                        lab57.lab57c2 AS dateresult,
                        lab43.lab43c4
    `;

    query += querydemoHospitalLocation
    from += `   FROM       lab57  as lab57
                INNER JOIN  lab22  as lab22 ON lab22.lab22c1 = lab57.lab22c1
                INNER JOIN lab39 ON lab39.lab39c1 = lab57.lab39c1
                LEFT JOIN lab21 ON lab21.lab21c1 = lab22.lab21c1
                LEFT JOIN lab10 ON lab10.lab10c1 = lab22.lab10c1
                LEFT JOIN lab05 ON lab05.lab05c1 = lab22.lab05c1
                LEFT JOIN lab103 ON lab103.lab103c1 = lab22.lab103c1
                LEFT JOIN lab43 ON lab43.lab43c1 = lab39.lab43c1
    `;

    if(type ==  DashboardModule.ORDERED)
    {
        from += " WHERE (lab57c76 = 0 OR lab57c76 IS NULL)   " ;
    }
    else if(type ==  DashboardModule.CHECKED)
    {
        from += " WHERE (lab57c76 = 1 and lab57c16 = 4)   " ;
    }
    else if(type ==  DashboardModule.REPORTED)
    {
        from += " WHERE (lab57c76 = 2 and lab57c8 >= 2)   " ;
    }
    else if(type ==  DashboardModule.VALIDATED)
    {
        from += " WHERE (lab57c76 = 3 and lab57c8 >= 4)   " ;
    }

    from += condicionalDashoard;

  
    const [dataentry] = await db.query(query + from);

    console.log(`Respondio consulta de tablero ingreso.... ` + dataentry.length);

    return dataentry;
}

const mapperDashboardData = async( data:any ) => {
    try {
        const decrypt: any = {};
        data.forEach((patient: any) => {
          decrypt[patient.lab21c2 + "_lab21c2"] = patient.lab21c2;
          decrypt[patient.lab21c2 + "_lab21c3"] = patient.lab21c3;
          decrypt[patient.lab21c2 + "_lab21c4"] = patient.lab21c4;
          decrypt[patient.lab21c2 + "_lab21c5"] = patient.lab21c5;
          decrypt[patient.lab21c2 + "_lab21c6"] = patient.lab21c6;
        });
    
        let listOfData: any = await decryptData(decrypt);
        let datamapper: any[] = [];
    
        data.forEach((resp: any) => {
          var patientName =
            listOfData[resp.lab21c2 + "_lab21c3"] +
            " " +
            (resp.lab21c4 == null ? "" : listOfData[resp.lab21c2 + "_lab21c4"]) +
            " " +
            listOfData[resp.lab21c2 + "_lab21c5"] +
            " " +
            (resp.lab21c6 == null ? "" : listOfData[resp.lab21c2 + "_lab21c6"]);

          var patientHistory = listOfData[resp.lab21c2 + "_lab21c2"];
         
          var state = resp.lab57c8 == 0 ? 1 : resp.lab57c8 >= 4 ? 3 : 2;
          var validate = state == 3 ? true : false;
    
          datamapper.push({
            order: resp.lab22c1,
            idService: resp.lab10c1,
            serviceCode: resp.lab10c7,
            serviceName: resp.lab10c2,
            idTest: resp.lab39c1,
            testCode: resp.lab39c2,
            testAbbreviation: resp.lab39c3,
            testName: resp.lab39c4,
            idBranch: resp.lab05c1,
            branchName: resp.lab05c4,
            orderType: resp.lab103c2,
            patientName: patientName,
            patientHistory: patientHistory,
            orderDate: resp.lab22c3,
            validated: validate,
            validateDate: resp.lab57c18,
            idSection: resp.lab43c1,
            sectionName: resp.lab43c4,
            verifyDate: resp.verifyDate,
            dateTake: resp.dateTake,
            resultDate: resp.dateresult,
            section: resp.lab43c4,
            hospitalUbication: resp.demoHospitalLocation,
            state: state,
          });
        });
    
        return datamapper;
      } catch (error) {
        console.error("Error in mapperDashboardData:", error);
        throw new Error("An error occurred while mapping the dashboard data.");
      }
  
}

export const changeFlagDashboard = async( dataupdate: any[], statedashboard: any ) => {
    const query = `UPDATE lab57 SET lab57c76 = :statedashboard WHERE lab22c1 = :ordernumber and lab39c1 = :idTest` 
    dataupdate.forEach( async(doc) => {
        
        if(doc.order!= undefined)
        {
            const [numFiles] = await db.query(query,
                {
                replacements: { statedashboard: statedashboard, ordernumber: doc.order, idTest: doc.idTest }
                }
            );
        }
    });
}

