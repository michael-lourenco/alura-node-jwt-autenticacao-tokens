const blackList = require('./blackList');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const  { createHash } = require('crypto');

const existsAsync = promisify(blackList.exists).bind(blackList);
const setAsync = promisify(blackList.set).bind(blackList);


const geraTokenHash = (token) => {
    return createHash('sha256').update(token).digest('hex');
}

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await setAsync(tokenHash, '');
        blackList.expireat(tokenHash, dataExpiracao);
    },

    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        const resultado = await existsAsync(tokenHash);
        return resultado === 1;
    }
}