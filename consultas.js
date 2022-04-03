const { Pool } = require ( "pg" ); //npm i pg
const fs= require ( "fs" );

// const pool = new Pool({
// user: "fidonoso_desafiolatam" ,
// host: "postgresql-fidonoso.alwaysdata.net" ,
// password: "desafiolatam1234" ,
// database: "fidonoso_skatepark" ,
// port: 5432 ,
// max: 20,
// idleTimeoutMillis: 5000,
// connectionTimeoutMillis: 2000,
// });

const pool = new Pool({
    user: "postgres" ,
    host: "localhost" ,
    password: "13991987Ft" ,
    database: "skatepark" ,
    port: 5432 ,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
    });


async function nuevoSkater(obj) {
    let valores=Object.values(obj)
    obj.anos_experiencia=Number(obj.anos_experiencia)
    let consulta={
        text: `INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado, tipo) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        values: valores
    }
    try{
        const result = await pool.query(consulta);
        return result.rows;
    }catch(e){
        return e;
    }
};

getSkaters=async ()=>{
    try {
        const result= await pool.query('select * from skaters;')
        return result.rows;
    } catch (error) {
        return error
    }
};

const getUser=async (email, password)=>{
    let consulta={
        text: 'select * from skaters WHERE email=$1 and password=$2;',
        values: [email, password]
    }
    try {
        const result= await pool.query(consulta)
        return result.rows[0];
    } catch (error) {
        return error
    }
}
skaterStatus=async (id, status)=>{
    let consulta={
        text: `UPDATE skaters SET estado= $2 WHERE id= $1 RETURNING *;`,
        values: [id, status]
    }
    try {
        const result= await pool.query(consulta)
        return result.rows[0];
    } catch (error) {
        return error
    }
}
skaterUpdate=async ({email, nombre, password, anos_experiencia, especialidad})=>{
    try {
        const result = await pool.query(`UPDATE skaters SET nombre='${nombre}', password='${password}', anos_experiencia='${Number(anos_experiencia)}', especialidad='${especialidad}' WHERE email='${email}' AND tipo='user' RETURNING *;`)
        return result.rows;

    }catch(error) {
        return error
    }
};

skaterDelete=async({email})=>{
    try {
        const imagen=await pool.query(`select foto from skaters where email='${email}' and tipo='user';`)
        const urlImg=await imagen.rows[0].foto
        fs.unlink(__dirname + '/public' + urlImg, (err)=>{
            if (err) throw err;
            console.log(`${__dirname + urlImg} borrada con éxito.`);
        })
        const result= await pool.query(`DELETE FROM skaters WHERE email='${email}' AND tipo='user' RETURNING *;`)
        return result.rowCount
    }catch(error){
     console.log(error)   
    }
};

module.exports = {
    nuevoSkater,
    getSkaters,
    getUser,
    skaterStatus,
    skaterUpdate,
    skaterDelete
    };