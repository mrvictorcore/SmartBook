import bcrypt from 'bcryptjs';

const verifyPassword = (plainPassword, hash) => {
    const isValid = bcrypt.compareSync(plainPassword, hash);
    console.log('Contraseña ingresada:', plainPassword);
    console.log('Hash almacenado:', hash);
    console.log('Contraseña válida:', isValid);
    return isValid;
};

// Ejemplo de uso
const plainPassword = '1234';
const storedHash = '$2a$08$NDdXhdo1ivH7nBILPwGpre/gj8DtN3pmQ8pEqMnUi0uopk1bj5ppu';

verifyPassword(plainPassword, storedHash);
