const ruta = require("express").Router();
const multer = require('multer');
const path = require('path');
const UsuarioClase = require("../clases/usuarioClase")
const UsuarioBD = require("../bd/UsuariosBD");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

ruta.get("/", (req, res) => {
    res.render("login", {
        nameError: "",
        emailError: "",
        passwordError: "",
        signinEmailError: "",
        signinPasswordError: ""
    });
})

ruta.post("/", async (req, res) => {
    const formtype = req.body.form_type;
    let nameError = "";
    let emailError = "";
    let passwordError = "";
    let signinEmailError = "";
    let signinPasswordError = "";
    if (formtype == 'signup') {
        try {
            const usuario1 = new UsuarioClase(req.body);
            let valid = true;
            // if (usuario1.nombre != undefined && usuario1.email != undefined && usuario1.contra != undefined) {
            // }
            if (!usuario1.nombre) {
                nameError = "Nombre invalido";
                valid = false;
            }
            if (!usuario1.email) {
                emailError = "Correo invalido";
                valid = false;
            }
            if (!usuario1.contra) {
                passwordError = "Contraseña invalida";
                valid = false;
            }
            if (valid) {
                console.log("Los datos del usuario nuevo: ");
                console.log(usuario1.mostrarDatos);
                // Almacenar los datos del usuario en una session
                req.session.usuario = usuario1.mostrarDatos;
                req.session.isNewUser = true; // Establecer la variable en la sesión
                res.redirect("/perfil");
            } else {
                res.render("login", {
                    nameError,
                    emailError,
                    passwordError,
                    signinEmailError,
                    signinPasswordError
                });
            }
        } catch (error) {
            console.error("Error durante el registro del usuario: ", error);
            res.render("login", {
                nameError: "Error en el registro",
                emailError: "Error en el registro",
                passwordError: "Error en el registro",
                signinEmailError: "",
                signinPasswordError: ""
            });
        }
    } else if (formtype == 'signin') {
        try {
            const { email, contra } = req.body;
            const usuariobd = new UsuarioBD();
            try {
                const usuario = await usuariobd.buscarUsuario(email);
                if (usuario) {
                    if (usuario.contra === contra) {
                        // const usuario1 = new UsuarioClase(usuario);
                        req.session.usuarioId = usuario.id_usu;
                        console.log("Usuario autenticado por ID: ", usuario.id_usu);
                        req.session.isNewUser = false; // Establecer la variable en la sesión
                        res.redirect("/inicio");
                    }
                } else if (usuario && usuario.contra !== contra) {
                    console.log("La contraseña es incorrecta, ingrese de nuevo");
                    res.render("login", {
                        signinEmailError: "Correo invalido",
                        signinPasswordError: "",
                        nameError: "",
                        emailError: "",
                        passwordError: ""
                    });
                } else {
                    console.log("El correo es incorrecto, ingrese de nuevo");
                    res.render("login", {
                        signinPasswordError: "Contraseña invalida",
                        signinEmailError: "",
                        nameError: "",
                        emailError: "",
                        passwordError: ""
                    });
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario : ", error);
                res.render("login", {
                    signinEmailError: "Error en el inicio de sesion",
                    signinPasswordError: "Error en el inicio de sesion",
                    nameError: "",
                    emailError: "",
                    passwordError: ""
                });
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión: ", error);
        }
    } else {
        res.status(400).send("Formulario desconocido")
    }
})

ruta.get("/perfil", (req, res) => {
    if (req.session.usuario) {
        res.render("perfil", { usuario: req.session.usuario });
    } else {
        res.redirect("/");
    }
})

ruta.post("/perfil", upload.single('foto'), async (req, res) => {
    try {
        console.log("Datos recibidos en /perfil : ", req.body);
        if (req.session.usuario) {
            const usuario1 = new UsuarioClase(req.body);
            if (req.file) {
                usuario1.foto = `/uploads/${req.file.filename}`; //Guardar la ruta de la imagen
            }
            console.log("Datos del formulario perfil : ", usuario1.mostrarDatos);
            const usuariobd = new UsuarioBD();
            await usuariobd.nuevoUsuario(usuario1.mostrarDatos);

            //Buscar el usuario creado para obtener su ID
            const usuarioID = await usuariobd.buscarUsuario(usuario1.email);
            if (usuarioID) {
                req.session.usuarioId = usuarioID.id_usu;
                console.log("ID del usuario creado : ", usuarioID.id_usu);
                res.redirect("/inicio");
            } else {
                console.log("Error al obtener el id");
                res.redirect("/");
            }
            // req.session.usuario = usuario1.mostrarDatos //Actualizar la sesion con la nueva imagen
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error durante la actualizacion del perfil: ", error);
        res.redirect("/perfil");
    }
    res.end();
})

ruta.get("/inicio", async (req, res) => {
    if (req.session.usuarioId) {
        const usuariobd = new UsuarioBD();
        const usuario = await usuariobd.buscarID(req.session.usuarioId);
        res.render("inicio", { usuario, isNewUser: req.session.isNewUser });
    } else {
        res.redirect("/");
    }
});

ruta.get("/cursos", async (req,res) =>{
    if (req.session.usuarioId) {
        const usuariobd = new UsuarioBD();
        const usuario = await usuariobd.buscarID(req.session.usuarioId);
        res.render("cursos", { usuario, isNewUser : req.session.usuarioId });
    } else {
        res.redirect("/");
    }
})

ruta.get("/cuestionario", async(req,res)=>{
    if (req.session.usuarioId) {
        const usuariobd = new UsuarioBD();
        const usuario = await usuariobd.buscarID(req.session.usuarioId);
        res.render("cuestionario", { usuario, isNewUser : req.session.usuarioId });
    } else{
        res.redirect("/cursos");
    }
})

ruta.get("/ajustes", async (req, res) => {
    if (req.session.usuarioId) {
        const usuariobd = new UsuarioBD();
        try {
            const usuarioBd = await usuariobd.buscarID(req.session.usuarioId);
            if (usuarioBd) {
                res.render("ajustes", { usuario: usuarioBd });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario : ", error);
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
})

ruta.post("/ajustes", upload.single('foto'), async (req, res) => {
    try {
        console.log("Datos recibidos en /ajustes : ", req.body);
        if (req.session.usuarioId) {
            const usuariobd = new UsuarioBD();
            const usuarioActual = await usuariobd.buscarID(req.session.usuarioId);
            const usuario1 = new UsuarioClase(req.body);
            if (!req.file) {
                usuario1.foto = usuarioActual.foto_usu;
            } else {
                usuario1.foto = `/uploads/${req.file.filename}`; //Guardar la ruta de la imagen
            }
            console.log("Datos del formulario : ", usuario1.mostrarDatos);
            await usuariobd.modiUsuario(req.session.usuarioId, usuario1.mostrarDatos);
            console.log("Perfil actualizado con existo");
            res.redirect("/ajustes");
        } else {
            console.log("Usuario no autenticado");
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error durante la actualizacion del perfil en ajustes : ", error);
        res.redirect("/ajustes")
    }
})

ruta.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/ajustes")
        }
        res.clearCookie('connect.sid');
        res.redirect("/");
    })
})

ruta.get("/delete", async (req, res) => {
    try {
        if (req.session.usuarioId) {
            const usuariobd = new UsuarioBD();
            console.log("Id del usuario : ", req.session.usuarioId);
            await usuariobd.eliminarCuenta(req.session.usuarioId);
            req.session.destroy((err) => {
                if (err) {
                    return res.redirect("/ajustes");
                }
                res.clearCookie('connect.sid');
                res.redirect("/");
            });
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error al eliminar la cuenta : ", error);
        res.redirect("/ajustes");
    }
})

module.exports = ruta;