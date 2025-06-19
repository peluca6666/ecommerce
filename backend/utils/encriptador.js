import bcrypt from 'bcrypt';

export async function encriptarContrasenia(contraseniaPlano) {
  const saltRounds = 13; // número de rondas para generar el salt
  const hash = await bcrypt.hash(contraseniaPlano, saltRounds);
  return hash;
}

export async function compararContrasenia(contraseniaPlano, hashAlmacenado) {
  return await bcrypt.compare(contraseniaPlano, hashAlmacenado);
}
