const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError } = require('../erros');

function verificaUsuario(usuario) {
    if(!usuario) {
        throw new InvalidArgumentError('Usuário não encontrado!');
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);

    if(!senhaValida) {
        throw new InvalidArgumentError('Senha inválida!');
    }
    
    return ;
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUsuario(usuario);
            await verificaSenha(senha, usuario.senhaHash);
            done(null, usuario);    
        } catch (error) {
            done(error);
        }

    })
);