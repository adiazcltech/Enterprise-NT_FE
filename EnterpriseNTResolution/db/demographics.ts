import { loadListDemographics } from "../tools/cube";
import { db } from "./config/conection";

export const listDemographics =  async (state:number) => {

    let demos: any[] = [];

    let query = " ";
    query += `SELECT lab62.lab62c1
        , lab62c2, lab62c3, lab62c4
        , lab62c5, lab62c6, lab62c7, lab62c8, lab62c9
        , lab62c10, lab62c11, lab62c12, lab62.lab07c1
        , lab62.lab04c1, lab195c1, lab04c2, lab04c3
        , lab04c4, lab62c13, lab62c14, lab63c1`;

    let from = " ";

    from += ` FROM lab62 
    LEFT JOIN lab04 ON lab04.lab04c1 = lab62.lab04c1 
    LEFT JOIN lab195 ON lab195.lab62c1 = lab62.lab62c1`;

    switch (state) {
        case 0:
            from += " WHERE lab62.lab07c1 = 0 ";
            break;
        case 1:
                from += " WHERE lab62.lab07c1 = 1 ";
                break;
        default:
            break;
    }
    const [resp] = await db.query(query + from);
    resp.map( (demo: any) => {
        demos.push({
            id: demo.lab62c1,
            name: demo.lab62c2,
            origin: demo.lab62c3,
            encoded: demo.lab62c4 === 1,
            obligatory: demo.lab62c5,
            ordering: demo.lab62c6,              
            orderingDemo: demo.lab195c1,
            format: demo.lab62c7,
            defaultValue: demo.lab62c8,
            statistics: demo.lab62c9 === 1,
            lastOrder: demo.lab62c10 === 1,
            canCreateItemInOrder: demo.lab62c11 === 1,
            lastTransaction: demo.lab62c12,
            /*Usuario*/
            user: {
                id: demo.lab04c1,
                name: demo.lab04c2,
                lastName: demo.lab04c3,
                userName: demo.lab04c4,
            },
            state: demo.lab07c1 === 1,
            modify: demo.lab62c13 === 1,
            defaultValueRequired: demo.lab62c14,
            demographicItem: demo.lab63c1,
            item: null,
            value: null,
            code: null,
            source: demo.lab62c3,
            type: demo.lab62c4,
            coded: demo.lab62c4
        });
    });

    return demos;
}

export const listDemographicsCube =  async () => {
    const demos: any = await listDemographics(1);
    return await loadListDemographics(demos);
}
