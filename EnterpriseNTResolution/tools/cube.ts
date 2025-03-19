import moment from "moment";
import { getAgeAsString, getDemographicsValue, htmlEntities } from "./common";

const demosH = [
    { id: -1, name: 'Nombre 1', value: 'lab21c3' },
    { id: -2, name: 'Nombre 2', value: 'lab21c4' },
    { id: -3, name: 'Apellido 1', value: 'lab21c5' },
    { id: -4, name: 'Apellido 2', value: 'lab21c6' },
    { id: -5, name: 'Fecha Creación Paciente', value: 'lab21c20' },
    { id: -6, name: 'Fecha Modificación Paciente', value: 'lab21c12' },
    { id: -7, name: 'Fecha de Nacimiento', value: 'lab21c7' },
    { id: -8, name: 'Genero', value: 's.lab80c4' },
    { id: -9, name: 'Historia', value: 'lab21c2' },
    { id: -10, name: 'Id Historia', value: 'lab22.lab21c1' },
    { id: -11, name: 'Usuario Creación', value: 'lab21lab04c.lab04c4 as lab21lab04clab04c4' },
    { id: -12, name: 'Usuario Modificación', value: 'lab21lab04u.lab04c4 as lab21lab04ulab04c4' },
    { id: -13, name: 'Correo', value: 'lab21c8' },
    { id: -14, name: 'Tipo de documento', value: 'lab21lab54.lab54c3 AS lab21lab54lab54c3' },
    { id: -15, name: 'Teléfono', value: 'lab21c16' },
    { id: -16, name: 'Dirección', value: 'lab21c17' },
    { id: -17, name: 'Id tipo de documento', value: 'lab21lab54.lab54c1 AS lab21lab54lab54c1' },
    { id: -18, name: 'Abreviatura tipo de documento', value: 'lab21lab54.lab54c2 AS lab21lab54lab54c2' },
    { id: -19, name: 'Edad', value: 'lab21c7' },
    { id: -20, name: 'Abreviatura Genero', value: 's.lab80c4' },
];

const demosO = [
    { id: -101, name: 'Número de Orden', value: '' },
    { id: -102, name: 'Fecha', value: 'lab22c2' },
    { id: -103, name: 'Fecha Creación Orden', value: 'lab22c3' },
    { id: -104, name: 'Fecha Modificación Orden', value: 'lab22c6' },
    { id: -105, name: 'Sede', value: 'lab05.lab05c4' },
    { id: -106, name: 'Cliente', value: 'lab14.lab14c3' },
    { id: -107, name: 'Año', value: 'lab22c3' },
    { id: -108, name: 'Mes', value: 'lab22c3' },
    { id: -109, name: 'Día', value: 'lab22c3' },
    { id: -110, name: 'Usuario Creación', value: 'lab22lab04c.lab04c4 as lab22lab04clab04c4' },
    { id: -111, name: 'Usuario Modificación', value: 'lab22lab04u.lab04c4 as lab22lab04ulab04c4' },
    { id: -112, name: 'Tipo de orden', value: 'lab103c3' },
    { id: -113, name: 'Estado de la orden', value: 'lab22.lab07c1 as statusOrder' },
    { id: -114, name: 'Orden His', value: 'lab22c7' },
    { id: -115, name: 'Servicio', value: 'lab10c2' },
    { id: -116, name: 'Medico', value: 'lab19c2, lab19c3' },
    { id: -117, name: 'Tarifa', value: 'lab904c3' },
    { id: -118, name: 'Entidad', value: '' },
    { id: -119, name: 'Nit', value: '' },
];

const demosR = [
    { id: -201, name: 'Código Prueba', value: 'lab39.lab39c2 as codeTest' },
    { id: -202, name: 'Abreviatura Prueba', value: 'lab39.lab39c3 as abbrTest' },
    { id: -203, name: 'Prueba', value: 'lab39.lab39c4 as nameTest' },
    { id: -204, name: 'Código Area', value: 'lab43.lab43c3' },
    { id: -205, name: 'Area', value: 'lab43.lab43c4' },
    { id: -206, name: 'Resultado', value: 'lab57.lab57c1' },
    { id: -207, name: 'Fecha Resultado', value: 'lab57c2' },
    { id: -208, name: 'Usuario Resultado', value: 'lab57lab04r.lab04c4 as lab57lab04rlab04c4' },
    { id: -209, name: 'Fecha Ingreso', value: 'lab57c4' },
    { id: -210, name: 'Usuario Ingreso', value: 'lab57lab04i.lab04c4 as lab57lab04ilab04c4' },
    { id: -213, name: 'Estado del resultado', value: 'lab57c8' },
    { id: -214, name: 'Patología', value: 'lab57.lab57c9' },
    { id: -215, name: 'Bloqueo', value: 'lab57c10' },
    { id: -216, name: 'Fecha Bloqueo', value: 'lab57c11' },
    { id: -217, name: 'Usuario Bloqueo', value: 'lab57lab04b.lab04c4 as lab57lab04blab04c4' },
    { id: -218, name: 'Código Perfil', value: 'p.lab39c2 as codeProfile' },
    { id: -219, name: 'Abreviatura Perfil', value: 'p.lab39c3 as abbrProfile' },
    { id: -220, name: 'Perfil', value: 'p.lab39c4 as nameProfile' },
    { id: -221, name: 'Código Paquete', value: 'pq.lab39c2 as codePackage' },
    { id: -222, name: 'Abreviatura paquete', value: 'pq.lab39c3 as abbrPackage' },
    { id: -223, name: 'Paquete', value: 'pq.lab39c4 as namePackage' },
    { id: -224, name: 'Cups', value: 'lab61c1' },
    { id: -225, name: 'Estado de la muestra', value: 'lab57c16' },
    { id: -226, name: 'Fecha validación', value: 'lab57c18' },
    { id: -227, name: 'Usuario validación', value: 'lab57lab04v.lab04c4 as lab57lab04vlab04c4' },
    { id: -228, name: 'Fecha prevalidación', value: 'lab57c20' },
    { id: -229, name: 'Usuario prevalidación', value: 'lab57lab04pv.lab04c4 as lab57lab04pvlab04c4' },
    { id: -230, name: 'Fecha impresión', value: 'lab57c22' },
    { id: -231, name: 'Usuario impresión', value: 'lab57lab04p.lab04c4 as lab57lab04plab04c4' },
    { id: -232, name: 'Unidad', value: 'lab45c2' },
    { id: -233, name: 'Método', value: 'lab64c3' },
    { id: -234, name: 'Imprime', value: 'lab57c25' },
    { id: -235, name: 'Delta mínimo', value: 'lab57c27' },
    { id: -236, name: 'Delta máximo', value: 'lab57c28' },
    { id: -237, name: 'Laboratorio', value: 'lab40c3' },
    { id: -238, name: 'Pánico mínimo', value: 'lab48c5' },
    { id: -239, name: 'Pánico máximo', value: 'lab48c6' },
    { id: -240, name: 'Normal mínimo', value: 'lab48c12' },
    { id: -241, name: 'Normal máximo', value: 'lab48c13' },
    { id: -242, name: 'Reportable mínimo', value: 'lab48c14' },
    { id: -243, name: 'Reportable máximo', value: 'lab48c15' },
    { id: -244, name: 'Tipo de ingreso resultado', value: 'lab57c35' },
    { id: -245, name: 'Fecha verificación', value: 'lab57c37' },
    { id: -246, name: 'Usuario verificación', value: 'lab57lab04uv.lab04c4 as lab57lab04uvlab04c4' },
    { id: -247, name: 'Fecha toma', value: 'lab57c39' },
    { id: -248, name: 'Usuario toma', value: 'lab57lab04t.lab04c4 as lab57lab04tlab04c4' },
    { id: -249, name: 'Muestra', value: 'lab24.lab24c2 as sample' },
    { id: -250, name: 'Código muestra', value: 'lab24.lab24c9 as codeSample' },
    { id: -251, name: 'SubMuestra', value: 'sub.lab24c2 as subsample' },
    { id: -252, name: 'Código submuestra', value: 'sub.lab24c9 as codeSubsample' },
    { id: -253, name: 'Sitio anatómico', value: 'lab158c2' },
    { id: -254, name: 'Método de recolección', value: 'lab201c2' },
    { id: -255, name: 'Fecha de retoma', value: 'lab57c44' },
    { id: -256, name: 'Usuario de retoma', value: 'lab57lab04ur.lab04c4 as lab57lab04urlab04c4' },
    { id: -257, name: 'Fecha de repetición', value: 'lab57c46' },
    { id: -258, name: 'Usuario de repetición', value: 'lab57lab04re.lab04c4 as lab57lab04relab04c4' },
    { id: -259, name: 'Dilución', value: 'lab57c53' },
    { id: -260, name: 'Remisión', value: 'lab57c54' },
    { id: -261, name: 'Comentario', value: 'lab95c1' },
    { id: -262, name: 'Precio Servicio', value: 'lab900c2' },
    { id: -263, name: 'Precio Paciente', value: 'lab900c3' },
    { id: -264, name: 'Precio Cliente', value: 'lab900c4' },
    { id: -265, name: 'Número de factura', value: 'lab901c1I.lab901c2 as invoiceClient' }
];

const demosM = [
    { id: -301, name: 'Nombre del microorganismo', value: 'lab76.Lab76c2 AS nameMic' },
    { id: -302, name: 'Interpretacion', value: 'lab205.lab205c2 AS Result' },
    { id: -303, name: 'Nombre del antibiograma', value: 'lab77.lab77c4 AS ABName' },
    { id: -304, name: 'Comentario microbiologia', value: 'lab204.lab204c2 AS Comment' },
    { id: -305, name: 'Comentario recuentos', value: 'lab204.lab204c4 AS recount' },
    { id: -306, name: 'Comentario complementaciones', value: 'lab204.lab204c6 AS complement' },
    { id: -307, name: 'CMI', value: 'lab205.lab205c1 AS CMI' },
    { id: -308, name: 'Antibiotico', value: 'lab79.lab79c2 AS antibiotic' }
];

export const loadListDemographics = async (demographics: any) => {
    //Cargar demograficos historia
    const demosHAll: any = [];
    const demosOAll: any = [];
    const demosRAll: any = [];
    const demosMAll: any = [];

    demographics.filter((demo: any) => demo.origin === 'H').forEach((demo: any) => {
        demosHAll.push({
            id: demo.id,
            name: demo.name,
            encoded: demo.encoded
        });
    });
    demographics.filter((demo: any) => demo.origin === 'O').forEach((demo: any) => {
        demosOAll.push({
            id: demo.id,
            name: demo.name,
            encoded: demo.encoded
        });
    });

    demosH.forEach((demo: any) => {
        demosHAll.push({
            id: demo.id,
            name: demo.name
        });
    });

    demosO.forEach((demo: any) => {
        demosOAll.push({
            id: demo.id,
            name: demo.name
        });
    });

    demosR.forEach((demo: any) => {
        demosRAll.push({
            id: demo.id,
            name: demo.name
        });
    });

    demosM.forEach((demo: any) => {
        demosMAll.push({
            id: demo.id,
            name: demo.name
        });
    });

    return { demosHAll, demosOAll, demosRAll, demosMAll };
}

export const mapQuery = async (body: any, year: any, centralSystem: any) => {

    //FROM
    let currentYear = new Date().getFullYear();
    let lab22 = year === currentYear ? "lab22" : "lab22_" + year;
    let lab57 = year === currentYear ? "lab57" : "lab57_" + year;
    let lab95 = year === currentYear ? "lab95" : "lab95_" + year;
    let lab900 = year === currentYear ? "lab900" : "lab900_" + year;


    let select = ' SELECT DISTINCT lab57.lab22c1, lab57.lab39c1, lab57.lab57c14 ';

    let from = `
    FROM ${lab57} AS lab57
    INNER JOIN ${lab22} AS lab22 ON lab22.lab22c1 = lab57.lab22c1
    INNER JOIN lab21 ON lab21.lab21c1 = lab22.lab21c1
    INNER JOIN lab93 ON lab93.lab05c1 = lab22.lab05c1 
    `;

    //Demográficos historia
    let demosHAll = [];
    if (body.listDemosH !== null && body.listDemosH !== undefined && body.listDemosH.length > 0) {
        const idsDemosH = body.listDemosH.map((demo: any) => demo.id);
        //FROM 

        if (idsDemosH.filter((demo: any) => demo === -14 || demo === -17 || demo === -18).length > 0) {
            from += "LEFT JOIN lab54 lab21lab54 ON lab21lab54.lab54c1 = lab21.lab54c1  ";
        }

        if (idsDemosH.filter((demo: any) => demo === -8 || demo === -20).length > 0) {
            from += "LEFT JOIN lab80 s ON s.lab80c1 = lab21.lab80c1 ";
        }

        idsDemosH.forEach((demo: any) => {
            switch (demo) {
                case -11:
                    from += "LEFT JOIN lab04 lab21lab04c ON lab21lab04c.lab04c1 = lab21.lab04c1_2 ";
                    break;
                case -12:
                    from += "LEFT JOIN lab04 lab21lab04u ON lab21lab04u.lab04c1 = lab21.lab04c1 ";
                    break;
            }
        });
        //SELECT 
        demosHAll = demosH.filter((demo: any) => idsDemosH.includes(demo.id)).map((demo: any) => demo.value);
        body.listDemosH.filter((demo: any) => demo.id > 0).forEach((demo: any) => {
            if (demo.encoded) {
                demosHAll.push(`demo${demo.id}.lab63c1 as demo${demo.id}_id`);
                demosHAll.push(`demo${demo.id}.lab63c2 as demo${demo.id}_code`);
                demosHAll.push(`demo${demo.id}.lab63c3 as demo${demo.id}_name`);
                from += `LEFT JOIN lab63 demo${demo.id} ON lab21.lab_demo_${demo.id} = demo${demo.id}.lab63c1 `;
            } else {
                demosHAll.push(`lab21.lab_demo_${demo.id}`);
            }
        });
    }

    //Demográficos orden
    let demosOAll = [];
    if (body.listDemosO !== null && body.listDemosO !== undefined && body.listDemosO.length > 0) {
        const idsDemosO = body.listDemosO.map((demo: any) => +demo.id);
        idsDemosO.forEach((demo: any) => {
            switch (demo) {
                case -105:
                    from += "INNER JOIN lab05 ON lab05.lab05c1 = lab22.lab05c1  ";
                    break;
                case -106:
                    from += "LEFT JOIN lab14 ON lab14.lab14c1 = lab22.lab14c1  ";
                    break;
                case -110:
                    from += "LEFT JOIN lab04 lab22lab04c ON lab22lab04c.lab04c1 = lab22.lab04c1_1 ";
                    break;
                case -111:
                    from += "LEFT JOIN lab04 lab22lab04u ON lab22lab04u.lab04c1 = lab22.lab04c1 ";
                    break;
                case -112:
                    from += "LEFT JOIN lab103 ON lab22.lab103c1 = lab103.lab103c1 ";
                    break;
                case -115:
                    from += "LEFT JOIN lab10 ON lab22.lab10c1 = lab10.lab10c1 ";
                    break;
                case -116:
                    from += "LEFT JOIN lab19 ON lab22.lab19c1 = lab19.lab19c1 ";
                    break;
                case -117:
                    from += "LEFT JOIN lab904 ON lab22.lab904c1 = lab904.lab904c1 ";
                    break;
            }
        });
        //SELECT
        demosOAll = demosO.filter((demo: any) => demo.id !== -101 && demo.id !== -118 && demo.id !== -119).filter((demo: any) => idsDemosO.includes(demo.id)).map((demo: any) => demo.value);
        body.listDemosO.filter((demo: any) => demo.id > 0).forEach((demo: any) => {
            if (demo.encoded) {
                demosOAll.push(`demo${demo.id}.lab63c1 as demo${demo.id}_id`);
                demosOAll.push(`demo${demo.id}.lab63c2 as demo${demo.id}_code`);
                demosOAll.push(`demo${demo.id}.lab63c3 as demo${demo.id}_name`);
                from += `LEFT JOIN Lab63 demo${demo.id} ON lab22.lab_demo_${demo.id} = demo${demo.id}.lab63c1 `;
            } else {
                demosOAll.push(`lab22.lab_demo_${demo.id}`);
            }
        });
    }

    //Demográficos resultados
    let demosRAll = [];
    if (body.listDemosR !== null && body.listDemosR !== undefined && body.listDemosR.length > 0) {
        const idsDemosR = body.listDemosR.map((demo: any) => demo.id);
        if (idsDemosR.filter((demo: any) => demo === -201 || demo === -202 || demo === -203 || demo === -205 || demo === -249 || demo === -250).length > 0) {
            select += ", lab39.lab39c42 "
            from += "INNER JOIN lab39 ON lab39.lab39c1 = lab57.lab39c1  ";
        }
        if (idsDemosR.filter((demo: any) => demo === -204 || demo === -205 || demo === -203).length > 0) {
            from += "LEFT JOIN lab43 ON lab43.lab43c1 = lab39.lab43c1 ";
        }
        if (idsDemosR.filter((demo: any) => demo === -218 || demo === -219 || demo === -220).length > 0) {
            from += "LEFT JOIN lab39 p ON p.lab39c1 = lab57.lab57c14  ";
        }
        if (idsDemosR.filter((demo: any) => demo === -221 || demo === -222 || demo === -223).length > 0) {
            from += "LEFT JOIN lab39 pq ON pq.lab39c1 = lab57.lab57c15  ";
        }
        if (idsDemosR.filter((demo: any) => demo === -249 || demo === -250).length > 0) {
            from += "LEFT JOIN lab24 ON lab24.lab24c1 = lab39.lab24c1 ";
        }
        if (idsDemosR.filter((demo: any) => demo === -251 || demo === -252).length > 0) {
            from += "LEFT JOIN lab24 sub ON sub.lab24c1 = lab57.lab24c1_1 ";
        }
        if (idsDemosR.filter((demo: any) => demo === -262 || demo === -263 || demo === -264 || demo === -265).length > 0) {
            from += " LEFT JOIN " + lab900 + " AS lab900 ON lab900.lab22c1 = lab57.lab22c1 AND lab900.lab39c1 = lab57.lab39c1 ";
            if (idsDemosR.filter((demo: any) => demo === -265).length > 0) {
                from += " LEFT JOIN lab901 lab901c1I ON lab901c1I.lab901c1 = lab900.lab901c1I ";
            }
        }

        idsDemosR.forEach((demo: any) => {
            switch (demo) {
                case -208:
                    from += "LEFT JOIN lab04 lab57lab04r ON lab57lab04r.lab04c1 = lab57.lab57c3 ";
                    break;
                case -210:
                    from += "LEFT JOIN lab04 lab57lab04i ON lab57lab04i.lab04c1 = lab57.lab57c5 ";
                    break;
                case -217:
                    from += "LEFT JOIN lab04 lab57lab04b ON lab57lab04b.lab04c1 = lab57.lab57c12 ";
                    break;
                case -224:
                    if (centralSystem) {
                        from += " LEFT JOIN lab61 ON lab61.lab39c1 = lab57.lab39c1 and lab61.lab118c1 = " + centralSystem + " " + " AND lab61c1 != '' ";
                    }
                    break;
                case -227:
                    from += "LEFT JOIN lab04 lab57lab04v ON lab57lab04v.lab04c1 = lab57.lab57c19 ";
                    break;
                case -229:
                    from += "LEFT JOIN lab04 lab57lab04pv ON lab57lab04pv.lab04c1 = lab57.lab57c21 ";
                    break;
                case -231:
                    from += "LEFT JOIN lab04 lab57lab04p ON lab57lab04p.lab04c1 = lab57.lab57c23 ";
                    break;
                case -233:
                    from += "LEFT JOIN lab64 ON lab64.lab64c1 = lab57.lab64c1 ";
                    break;
                case -237:
                    from += "LEFT JOIN lab40 ON lab40.lab40c1 = lab57.lab40c1 ";
                    break;
                case -246:
                    from += "LEFT JOIN lab04 lab57lab04uv ON lab57lab04uv.lab04c1 = lab57.lab57c38 ";
                    break;
                case -248:
                    from += "LEFT JOIN lab04 lab57lab04t ON lab57lab04t.lab04c1 = lab57.lab57c40 ";
                    break;
                case -253:
                    from += "LEFT JOIN lab158 ON lab158.lab158c1 = lab57.lab158c1 ";
                    break;
                case -254:
                    from += "LEFT JOIN lab201 ON lab201.lab201c1 = lab57.lab201c1 ";
                    break;
                case -256:
                    from += "LEFT JOIN lab04 lab57lab04ur ON lab57lab04ur.lab04c1 = lab57.lab57c45 ";
                    break;
                case -258:
                    from += "LEFT JOIN lab04 lab57lab04re ON lab57lab04re.lab04c1 = lab57.lab57c47 ";
                    break;
                case -261:
                    from += " LEFT JOIN " + lab95 + " AS lab95 ON lab95.lab22c1 = lab57.lab22c1 AND lab95.lab39c1 = lab57.lab39c1 ";
                    break;
            }
        });

        //SELECT
        demosRAll = demosR.filter((demo: any) => idsDemosR.includes(demo.id)).map((demo: any) => demo.value);
        if (idsDemosR.find((demo: any) => demo === -224)) {
            if (!centralSystem) {
                demosRAll = demosR.filter((demo: any) => demo.id !== -224).filter((demo: any) => idsDemosR.includes(demo.id)).map((demo: any) => demo.value);
            }
        }
    }
    //"INNER JOIN lab79 ON lab79.lab79c1 = lab57.lab79c1 ";
    //Demográficos microbiología
    let demosMAll = [];
    if (body.listDemosM !== null && body.listDemosM !== undefined && body.listDemosM.length > 0) {
        select = select.replace('DISTINCT', '');
        const idsDemosM = body.listDemosM.map((demo: any) => demo.id);
        if (idsDemosM.filter((demo: any) => demo === -301 || demo === -302 || demo === -303 || demo === -304 || demo === -305 || demo === -306 || demo === -307 || demo === -308).length > 0) {
            from += ` 
            LEFT JOIN lab204 ON lab204.lab22c1 = lab57.lab22c1 AND lab204.lab39c1 = lab57.lab39c1 
            LEFT JOIN lab205 ON lab204.lab204c1 = lab205.lab204c1
            `
        }

        if (idsDemosM.filter((demo: any) => demo === -301).length > 0) {
            from += ` LEFT JOIN lab76 ON lab76.lab76c1 = lab204.lab76c1 `;
        }

        if (idsDemosM.filter((demo: any) => demo === -303).length > 0) {
            from += ` LEFT JOIN lab77 ON lab77.lab77c1 = lab204.lab77c1 `
        }

        if (idsDemosM.filter((demo: any) => demo === -308).length > 0) {
            from += ` LEFT JOIN lab79 ON lab79.lab79c1 = lab205.lab79c1 `;
        }


        //SELECT
        demosMAll = demosM.filter((demo: any) => idsDemosM.includes(demo.id)).map((demo: any) => demo.value);

    }

    if (demosHAll.length > 0) {
        select += ',';
        select += demosHAll.join();
    }
    if (demosOAll.length > 0) {
        select += ',';
        select += demosOAll.join();
    }

    if (demosRAll.length > 0) {
        select += ',';
        select += demosRAll.join();
    }
    if (demosMAll.length > 0) {
        select += ',';
        select += demosMAll.join();
    }
    return { select, from }
}

export const mapData = async (body: any, data: any, centralSystem: any, info: any) => {
    let list: any[] = [];

    const demosHFixed = body.listDemosH.filter((demo: any) => demo.id < 0);
    const demosHDynamic = body.listDemosH.filter((demo: any) => demo.id > 0);

    const demosOFixed = body.listDemosO.filter((demo: any) => demo.id < 0);
    const demosODynamic = body.listDemosO.filter((demo: any) => demo.id > 0);
    data.forEach((order: any) => {
        if (list[order.lab22c1] === undefined || list[order.lab22c1] === null) {

            list[order.lab22c1] = {};
            list[order.lab22c1].orderNumber = order.lab22c1;
            list[order.lab22c1].tests = [];

            //Demograficos paciente
            if (demosHFixed.length > 0 || demosHDynamic.length > 0) {
                list[order.lab22c1].patient = {};
            }

            if (demosHFixed.length > 0) {
                demosHFixed.forEach((demo: any) => {
                    switch (demo.id) {
                        case -1: list[order.lab22c1].patient.name1 = order.lab21c3;
                            break;
                        case -2: list[order.lab22c1].patient.name2 = order.lab21c4;
                            break;
                        case -3: list[order.lab22c1].patient.lastName = order.lab21c5;
                            break;
                        case -4: list[order.lab22c1].patient.surName = order.lab21c6;
                            break;
                        case -5: list[order.lab22c1].patient.creationDate = order.lab21c20 === null || order.lab21c20 === undefined ? '' : moment.utc(order.lab21c20).format('DD/MM/YYYY HH:mm:ss');
                            break;
                        case -6: list[order.lab22c1].patient.updateDate = order.lab21c12 === null || order.lab21c12 === undefined ? '' : moment.utc(order.lab21c12).format('DD/MM/YYYY HH:mm:ss');
                            break;
                        case -7:
                            const birthday = (new Date(order.lab21c7)).toISOString().split("T"); list[order.lab22c1].patient.birthday = birthday[0];
                            break;
                        case -8: list[order.lab22c1].patient.sex = order.lab80c4;
                            break;
                        case -9: list[order.lab22c1].patient.patientId = order.lab21c2;
                            break;
                        case -10: list[order.lab22c1].patient.patientIdBD = order.lab21c1;
                            break;
                        case -11: list[order.lab22c1].patient.userCreation = order.lab21lab04clab04c4;
                            break;
                        case -12: list[order.lab22c1].patient.userUpdate = order.lab21lab04ulab04c4;
                            break;
                        case -13: list[order.lab22c1].patient.email = order.lab21c8;
                            break;
                        case -14: list[order.lab22c1].patient.documentType = order.lab21lab54lab54c3;
                            break;
                        case -15: list[order.lab22c1].patient.phone = order.lab21c16;
                            break;
                        case -16:
                            let address = order.lab21c17 === null || order.lab21c17 === undefined || order.lab21c17 === "" ? "" : order.lab21c17.replace(/<br\s*\/?>/g, '');
                            address = address === null || address === undefined || address === "" ? "" : htmlEntities(address);
                            address = address.replaceAll(',', '');
                            address = address.replace(/(\r\n|\n|\r)/gm, ""); list[order.lab22c1].patient.address = address;
                            break;
                        case -17: list[order.lab22c1].patient.idDocumentType = order.lab21lab54lab54c1;
                            break;
                        case -18: list[order.lab22c1].patient.abbrDocumentType = order.lab21lab54lab54c2;
                            break;
                        case -19:
                            const age = getAgeAsString(moment.utc(order.lab21c7).format('DD/MM/YYYY'), 'DD/MM/YYYY'); list[order.lab22c1].patient.age = age;
                            break;
                        case -20: list[order.lab22c1].patient.sexCode = order.lab80c4[0];
                            break;
                    }
                });
            }
            if (demosHDynamic.length > 0) {
                let demosPatient: any = [];
                demosHDynamic.forEach(async (demo: any) => {
                    let data = [];
                    if (demo.encoded) {
                        data[0] = order[`demo${demo.id}_id`];
                        data[1] = order[`demo${demo.id}_code`];
                        data[2] = order[`demo${demo.id}_name`];
                    } else {
                        data[0] = order[`lab_demo_${demo.id}`];
                    }
                    let demoValue = await getDemographicsValue(demo, data);
                    demosPatient.push(demoValue);
                });
                list[order.lab22c1].patient.demosPatient = demosPatient;
            }

            //Demograficos orden
            if (demosOFixed.length > 0) {
                let date = null;
                demosOFixed.forEach((demo: any) => {
                    switch (demo.id) {
                        case -102: list[order.lab22c1].date = order.lab22c2;
                            break;
                        case -103: list[order.lab22c1].creationDate = order.lab22c3 === null || order.lab22c3 === undefined ? '' : moment.utc(order.lab22c3).format('DD/MM/YYYY HH:mm:ss');
                            break;
                        case -104: list[order.lab22c1].updateDate = order.lab22c6 === null || order.lab22c6 === undefined ? '' : moment.utc(order.lab22c6).format('DD/MM/YYYY HH:mm:ss');
                            break;
                        case -105: list[order.lab22c1].branch = order.lab05c4;
                            break;
                        case -106: list[order.lab22c1].client = order.lab14c3;
                            break;
                        case -107:
                            date = moment.utc(order.lab22c3, 'DD/MM/YYYY'); list[order.lab22c1].year = date.year();
                            break;
                        case -108:
                            date = moment.utc(order.lab22c3, 'DD/MM/YYYY'); list[order.lab22c1].month = date.month() + 1;
                            break;
                        case -109:
                            date = moment.utc(order.lab22c3, 'DD/MM/YYYY'); list[order.lab22c1].day = date.date();
                            break;
                        case -110: list[order.lab22c1].userCreation = order.lab22lab04clab04c4;
                            break;
                        case -111: list[order.lab22c1].userUpdate = order.lab22lab04ulab04c4;
                            break;
                        case -112: list[order.lab22c1].orderType = order.lab103c3;
                            break;
                        case -113: list[order.lab22c1].statusOrder = order.statusOrder;
                            break;
                        case -114: list[order.lab22c1].orderHis = order.lab22c7;
                            break;
                        case -115: list[order.lab22c1].service = order.lab10c2;
                            break;
                        case -116:
                            const physician = (order.lab19c2 === undefined || order.lab19c2 === null ? "" : order.lab19c2) + " " + (order.lab19c3 === undefined || order.lab19c3 === null ? "" : order.lab19c3)
                            list[order.lab22c1].physician = physician;
                            break;
                        case -117: list[order.lab22c1].rate = order.lab904c3;
                            break;
                        case -118: list[order.lab22c1].entity = info.entity;
                            break;
                        case -119: list[order.lab22c1].nit = info.nit;
                            break;
                    }
                });
            }

            if (demosODynamic.length > 0) {
                let demosOrder: any = [];
                demosODynamic.forEach(async (demo: any) => {
                    let data = [];
                    if (demo.encoded) {
                        data[0] = order[`demo${demo.id}_id`];
                        data[1] = order[`demo${demo.id}_code`];
                        data[2] = order[`demo${demo.id}_name`];
                    } else {
                        data[0] = order[`lab_demo_${demo.id}`];
                    }
                    let demoValue = await getDemographicsValue(demo, data);
                    demosOrder.push(demoValue);
                });
                list[order.lab22c1].demosOrder = demosOrder;
            }
        }
        //Demograficos resultados
        // Demográficos resultados y microbiología
        if (body.listDemosR.length > 0 || body.listDemosM.length > 0) {
            // Ensure the order exists in the list and initialize tests array if necessary
            if (!list[order.lab22c1].tests) {
                list[order.lab22c1].tests = [];
            }
            // Función auxiliar para obtener valores seguros
            const safeGet = (value: any, defaultValue: any = ''): any => {
                return value === null || value === undefined ? defaultValue : value;
            }
            //let validateTest = list[order.lab22c1].tests.find((test: any) => test.idTest === order.lab39c1);

            // Initialize the test object
            let test: any = {
                idTest: order.lab39c1,
                idProfile: order.lab57c14,
                orderPrint: order.lab39c42
            };

            // Procesamiento de listDemosR
            body.listDemosR.forEach((demo: any) => {
                switch (demo.id) {
                    case -201: test.codeTest = order.codeTest; break;
                    case -202: test.abbrTest = order.abbrTest; break;
                    case -203: test.nameTest = order.nameTest; break;
                    case -204: test.codeArea = order.lab43c3; break;
                    case -205: test.nameArea = order.lab43c4; break;
                    case -206: test.result = order.lab57c1; break;
                    case -207: test.dateResult = order.lab57c2 ? moment.utc(order.lab57c2).format('DD/MM/YYYY HH:mm:ss') : ''; break;
                    case -208: test.userResult = order.lab57lab04rlab04c4; break;
                    case -209: test.dateEntry = order.lab57c4 ? moment.utc(order.lab57c4).format('DD/MM/YYYY HH:mm:ss') : ''; break;
                    case -210: test.userEntry = order.lab57lab04ilab04c4; break;
                    case -213: test.statusResult = order.lab57c8; break;
                    case -214: test.pathology = order.lab57c9; break;
                    case -215: test.blocking = order.lab57c10; break;
                    case -216: test.dateBlocking = order.lab57c11 === null || order.lab57c11 === undefined ? '' : moment.utc(order.lab57c11).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -217: test.userBlocking = order.lab57lab04blab04c4; break;
                    case -218: test.codeProfile = order.codeProfile === null || order.codeProfile === undefined ? '' : order.codeProfile; break;
                    case -219: test.abbrProfile = order.abbrProfile === null || order.abbrProfile === undefined ? '' : order.abbrProfile; break;
                    case -220: test.nameProfile = order.nameProfile === null || order.nameProfile === undefined ? '' : order.nameProfile; break;
                    case -221: test.codePackage = order.codePackage === null || order.codePackage === undefined ? '' : order.codePackage; break;
                    case -222: test.abbrPackage = order.abbrPackage === null || order.abbrPackage === undefined ? '' : order.abbrPackage; break;
                    case -223: test.namePackage = order.namePackage === null || order.namePackage === undefined ? '' : order.namePackage; break;
                    case -224:
                        if (centralSystem) {
                            test.cups = order.lab61c1;
                        }
                        break;
                    case -225: test.statusSample = order.lab57c16; break;
                    case -226: test.dateValidation = order.lab57c18 === null || order.lab57c18 === undefined ? '' : moment.utc(order.lab57c18).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -227: test.userValidation = order.lab57lab04vlab04c4; break;
                    case -228: test.datePrevalidation = order.lab57c20 === null || order.lab57c20 === undefined ? '' : moment.utc(order.lab57c20).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -229: test.userPrevalidation = order.lab57lab04pvlab04c4; break;
                    case -230: test.datePrint = order.lab57c22 === null || order.lab57c22 === undefined ? '' : moment.utc(order.lab57c22).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -231: test.userPrint = order.lab57lab04plab04c4; break;
                    case -232:
                        let unit = null;
                        unit = order.lab45c2 === null || order.lab45c2 === undefined || order.lab45c2 === "" ? "" : order.lab45c2.replace(/<br\s*\/?>/g, '')
                        unit = unit === null || unit === undefined || unit === "" ? "" : htmlEntities(unit);
                        unit = unit.replaceAll(',', '');
                        unit = unit.replace(/(\r\n|\n|\r)/gm, "");
                        test.unit = unit; break;
                    case -233: test.method = order.lab64c3 === null || order.lab64c3 === undefined ? '' : order.lab64c3; break;
                    case -234: test.print = order.lab57c25; break;
                    case -235: test.minimumDelta = safeGet(order.lab57c27) 
                        break;
                    case -236: test.maximumDelta = safeGet(order.lab57c28) ; break;
                    case -237: test.laboratory = safeGet(order.lab40c3); break;
                    case -238: test.minimalPanic = order.lab48c5 === null || order.lab48c5 === undefined ? '' : order.lab48c5; break;
                    case -239: test.maximumPanic = order.lab48c6 === null || order.lab48c6 === undefined ? '' : order.lab48c6; break;
                    case -240: test.minimalNormal = order.lab48c12 === null || order.lab48c12 === undefined ? '' : order.lab48c12; break;
                    case -241: test.maximumNormal = order.lab48c13 === null || order.lab48c13 === undefined ? '' : order.lab48c13; break;
                    case -242: test.minimumReportable = order.lab48c14 === null || order.lab48c14 === undefined ? '' : order.lab48c14; break;
                    case -243: test.maximumReportable = order.lab48c15 === null || order.lab48c15 === undefined ? '' : order.lab48c15; break;
                    case -244: test.typeEntry = order.lab57c35; break;
                    case -245: test.dateVerification = order.lab57c37 === null || order.lab57c37 === undefined ? '' : moment.utc(order.lab57c37).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -246: test.userVerification = order.lab57lab04uvlab04c4; break;
                    case -247: test.dateTake = order.lab57c39 === null || order.lab57c39 === undefined ? '' : moment.utc(order.lab57c39).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -248: test.userTake = order.lab57lab04tlab04c4; break;
                    case -249: test.sample = order.sample === null || order.sample === undefined ? '' : order.sample; break;
                    case -250: test.codeSample = order.codeSample === null || order.codeSample === undefined ? '' : order.codeSample; break;
                    case -251: test.subsample = order.subsample === null || order.subsample === undefined ? '' : order.subsample; break;
                    case -252: test.codeSubsample = order.codeSubsample === null || order.codeSubsample === undefined ? '' : order.codeSubsample; break;
                    case -253: test.anatomicalSite = order.lab158c2 === null || order.lab158c2 === undefined ? '' : order.lab158c2; break;
                    case -254: test.collectionMethod = order.lab201c2 === null || order.lab201c2 === undefined ? '' : order.lab201c2; break;
                    case -255: test.dateRetake = order.lab57c44 === null || order.lab57c44 === undefined ? '' : moment.utc(order.lab57c44).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -256: test.userRetake = order.lab57lab04urlab04c4; break;
                    case -257: test.dateRepetition = order.lab57c46 === null || order.lab57c46 === undefined ? '' : moment.utc(order.lab57c46).format('DD/MM/YYYY HH:mm:ss'); break;
                    case -258: test.userRepetition = order.lab57lab04relab04c4; break;
                    case -259: test.dilution = order.lab57c53; break;
                    case -260: test.remission = order.lab57c54 === null || order.lab57c54 === undefined ? 0 : order.lab57c54; break;
                    case -261:
                        //Comentario del resultado
                        let comment = null;
                        comment = order.lab95c1 === null || order.lab95c1 === undefined || order.lab95c1 === "" ? "" : order.lab95c1.replace(/<br\s*\/?>/g, '')
                        comment = comment === null || comment === undefined || comment === "" ? "" : htmlEntities(comment);
                        comment = comment.replaceAll(',', '');
                        comment = comment.replace(/(\r\n|\n|\r)/gm, "");
                        test.comment = comment; break;
                    case -262: test.servicePrice = order.lab900c2 === null || order.lab900c2 === undefined ? 0 : order.lab900c2; break;
                    case -263: test.patientPrice = order.lab900c3 === null || order.lab900c3 === undefined ? 0 : order.lab900c3; break;
                    case -264: test.insurancePrice = order.lab900c4 === null || order.lab900c4 === undefined ? 0 : order.lab900c4; break;
                    case -265: test.invoiceClient = order.invoiceClient === null || order.invoiceClient === undefined ? '' : order.invoiceClient; break;
                    // Resto de los casos hasta -265

                }
            });
            // Procesamiento de listDemosM
            body.listDemosM.forEach((demo: any) => {
                switch (demo.id) {
                    case -301: test.nameMic = safeGet(order.nameMic); break;
                    case -302: test.Result = safeGet(order.Result); break;
                    case -303: test.ABName = safeGet(order.ABName); break;
                    case -304: test.Comment = safeGet(order.Comment); break;
                    case -305: test.recount = safeGet(order.recount); break;
                    case -306: test.complement = safeGet(order.complement); break;
                    case -307: test.CMI = safeGet(order.CMI); break;
                    case -308: test.antiotic = safeGet(order.antibiotic);

                }
            });
            if (Object.values(test).length > 0) {
                list[order.lab22c1].tests.push(test);
            }

        }

    });
    return list;
}
