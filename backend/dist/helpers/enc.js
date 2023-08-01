export default class EncryptionMachine {
    constructor(config) {
        this.config = config;
    }
    encrypt(data) {
        const _start = Math.floor(Math.random() * this.config.length);
        let start = _start;
        let encrypted = '';
        for (let letter of data) {
            encrypted += (letter.charCodeAt(0) + this.config[start]).toString(2) + ' ';
            start = start === this.config.length - 1 ? 0 : start + 1;
        }
        return `${encrypted}\b-${_start}`;
    }
    decrypt(data) {
        let [encrypted, _start] = data.split('-');
        let start = +_start;
        let decrypted = '';
        for (let letter of encrypted.split(' ')) {
            decrypted += String.fromCharCode(parseInt(letter, 2) - this.config[+start]);
            start = (+start === this.config.length - 1 ? 0 : start + 1);
        }
        return decrypted.replace(/\x00/g, '');
    }
}
