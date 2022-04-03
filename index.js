//npm i express pg jsonwebtoken body-parser express-fileupload express-handlebars bootstrap nodemailer
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");
const exphbs = require("express-handlebars");
const { nuevoSkater, getSkaters, getUser,skaterStatus,skaterUpdate,skaterDelete } = require("./consultas.js");
const { send } = require("express/lib/response");
const text = require("body-parser/lib/types/text");

const secretKey = "desafioLatam";
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el limite permitido",
  })
);
app.use("/css", express.static(__dirname + "node_modules/bootstrap/dist/css"));
//Configuracion handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
      nom: function(texto){
        texto=texto.trim();
        return texto.replace(/\s+/g, '_');
      }
    },
    defaultLayout: "main",
    layoutsDir: `${__dirname}/views/mainLayouts`,
  })
);
app.set("view engine", "handlebars");

//Rutas
app.get("/", async (req, res) => {
  try {
    const results = await getSkaters();
    let users = results.filter((el) => el.tipo !== "admin");
    res.render("index", { users });
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal...${e}`,
      code: 500,
    });
    console.log(e);
  }
});

app.get("/registro", (req, res) => {
  res.render("Registro");
});

app.post("/skaters", async (req, res) => {
  const { foto } = req.files;
  const { name } = foto;
  req.body.foto = `/img/${name}`;
  req.body.estado = false;
  req.body.tipo = "user";
  foto.mv(`${__dirname}/public/img/${name}`, (err) => {
    console.log("Archivo cargado con éxito");
  });
  try {
    const skater = await nuevoSkater(req.body);  
     setTimeout(() =>{
      res.status(201).redirect('/');
    },1500)
  } catch (e) {
    res.status(500).send({
      error: `Algo salió mal...${e}`,
      code: 500,
    });
    console.log(e);
  }
});

app.get("/skaters", async (req, res) => {
  const results = await getSkaters();
  let users = results.filter((el) => el.tipo !== "admin");
  res.send(users);
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/verificacion", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  if (user) {
    if (user.tipo == "admin") {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 180,
          data: user,
        },
        secretKey
      );
      res.send({
        tipo: "admin",
        token: token,
      });
    } else {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 180,
          data: user,
        },
        secretKey
      );
      res.send({
        tipo: "user",
        token
      });
    }
  } else {
    res.status(404).send({
      error: "Este usuario no está registrado en la base de datos",
      code: 404,
    });
  }
});

app.get("/admin", async (req, res) => {
  const { token } = req.query;
  const results = await getSkaters();
  let users = results.filter((el) => el.tipo !== "admin");
  jwt.verify(token, secretKey, (err, decoded) => {
    const { data } = decoded;
    const { nombre, email, foto } = data;
   
    err
      ? res.status(401).send(
          res.send({
            error: "401 Unauthorized",
            message: "Usted no está autorizado",
            token_error: err.message,
          })
        )
      : res.render("Admin", { users, nombre, email, foto });
  });
});

app.get('/skater', async (req, res)=>{
  const { token } = req.query;
  jwt.verify(token, secretKey, (err, decoded) => {
    const { data } = decoded;
    if(err){
      res.status(401).send(
          res.send({
            error: "401 Unauthorized",
            message: "Usted no está autorizado",
            token_error: err.message,
          })
        )
      }else{ 
        res.render("Datos", {
              email: data.email,
              password: data.password,
              nombre: data.nombre,
              anos_experiencia: data.anos_experiencia,
              especialidad: data.especialidad,
            });
          }      
  });
})

app.put("/skaters", async (req, res) => {
    const {id, status}=req.body
    try{
        const skater = await skaterStatus(id, status)
        res.status(200).send(JSON.stringify(skater))
    }catch(e){
        res.status(500).send({
            error: `Algo salió mal...${e}`,
            code: 500
        })
    }
});

app.put('/updateSkater', async (req, res) => {
  try{
    const skater = await skaterUpdate(req.body)
    res.status(200).send(JSON.stringify(skater))
  }catch(e){
    res.status(500).send({
        error: `Algo salió mal...${e}`,
        code: 500
    })
  }
})

app.delete('/deleteSkater', async (req, res) => {
  try{
    const skater = await skaterDelete(req.body)
    res.status(200).send(JSON.stringify(skater))
  }catch(e){
    res.status(500).send({
        error: `Algo salió mal...${e}`,
        code: 500
    })
  }
})
