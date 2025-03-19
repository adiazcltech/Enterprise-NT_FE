
import { db } from "../db/config/conection";

export const migratePatients = async () => {
    try {
        const migration = await db.query(`select lab98c2 from lab98 where lab98c1 = 'Migration'`) as Array<{ lab98c2: string }>;

        if (migration[0].lab98c2 === 'True') {

            const urlMigracion = await db.query(`select lab98c2 from lab98 where lab98c1 = 'UrlMigracion'`) as Array<{ lab98c2: string }>;
            const urlApi = urlMigracion[0].lab98c2;

            if (urlApi && urlApi !== '') {


                const patients: Array<{ lab995c1:number , lab21c1: number, lab39c1: number, lab995c3: boolean | null }> =
                    await db.query(`SELECT * FROM lab995 
                    WHERE lab995c3 = false or lab995c3 is null`) as
                    Array<{ lab995c1:number , lab21c1: number, lab39c1: number, lab995c3: boolean | null }>


                for (const patient of patients) {
                    // hacer peticion a la api
                    const datasend = {
                        id: patient.lab21c1,//id de la historia clinica
                        examenid: patient.lab39c1,
                    }
                    const response = await fetch(urlApi, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(datasend)
                    });
                    if (response.ok) {
                        const datares = await response.json();
                        // actualizar el estado de la migracion
                        await db.query(`DELETE FROM lab995 WHERE lab995c1 = ${patient.lab995c1}`);

                        await db.query(`INSERT INTO lab17 (lab21c1, lab39c1 , lab17c1 ,lab17c2 )
                             VALUES ('${datares.historiaId}', '${datares.examenId}','${datares.resultado}','${datares.fechaResultado}) `);


                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al migrar pacientes', error);
    }
}