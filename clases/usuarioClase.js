class Usuario {
    constructor(usuario1) {
        this.id = usuario1.id_usu;
        this.nombre = usuario1.nom_usu;
        this.email = usuario1.email;
        this.contra = usuario1.contra;
        this.foto = usuario1.foto_usu;
    }
    set id(id) {
        this._id = id;
    }
    set nombre(nombre) {
        var regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ_]+(?: [A-Za-zÁÉÍÓÚÑáéíóúñ_]+)*$/;
        if (regexNombre.test(nombre)) {
            this._nombre = nombre;
        }
    };
    set email(email) {
        var regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regexEmail.test(email)) {
            this._email = email;
        }
    };
    set contra(contra) {
        var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*_\-!])[A-Za-z\d@#$%^&*_\-!]{8,}$/;
        if (regexPassword.test(contra)){
            this._contra = contra;
        }
    };
    set foto(foto) {
        this._foto = foto;
    }
    get id(){
        return this._id;
    };
    get nombre(){
        return this._nombre;
    };
    get email(){
        return this._email;
    };
    get contra(){
        return this._contra;
    };
    get foto() {
        return this._foto;
    }
    get mostrarDatos(){
        return {
            nombre : this.nombre,
            email : this.email,
            contra : this.contra,
            foto : this.foto
        }
    }
}

module.exports = Usuario;