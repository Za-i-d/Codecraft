const express = require("express");
const path = require("path");
const session = require("express-session")
const usuariosRutas = require("./routes/usuariosRutas");
const app = express();

app.use(session({
    secret: 'h3Gz9Lk1wQn8Xs4Tp2Yr7Uv6Ej5aBm9Q', // Cambia esto por una cadena secreta única
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // En producción, deberías usar true si tu sitio usa HTTPS
}));

app.use("/", express.static(path.join(__dirname, "/web")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir archivos estaticos
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use("/",usuariosRutas);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Servidor en http://127.0.0.1:"+port);
});