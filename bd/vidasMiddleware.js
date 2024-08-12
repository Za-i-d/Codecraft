const UsuarioBD = require('./UsuariosBD');
const usuariobd = new UsuarioBD();

async function verificarVidasMiddleware(req, res, next) {
    if (req.session.usuarioId) {
        const vidasData = await usuariobd.verificarVidas(req.session.usuarioId);
        if (vidasData) {
            res.locals.vidas = vidasData.vidas;
            res.locals.tiempoRestante = Math.ceil(vidasData.tiempoRestante / 1000); // Convertir a segundos
        }
    }
    next();
}

module.exports = verificarVidasMiddleware;