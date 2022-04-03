const { Pool } = require("pg"); //npm i pg

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "13991987Ft",
  database: "skatepark",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

let email = "fidonoso@gmail.com";
let nombre = "Fernando Donoso";
let password = "desafio1234";
let anos_experiencia = 1;
let especialidad = "desarrollo";
let foto = "/img/admin.png";
let estado = true;
let tipo = "admin";

let values = [
  email,
  nombre,
  password,
  anos_experiencia,
  especialidad,
  foto,
  estado,
  tipo,
];

let consulta = {
  text: `INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado, tipo) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  values,
};
const admins=async ()=>{

    try {
        const result = await pool.query(consulta);
        console.log(result.rows);
    } catch (e) {
        console.log(e);
    }
}
admins()    