import Crypto from "crypto-js";

const key = Crypto.enc.Utf8.parse(process.env.SECRET_KEY);
const iv = Crypto.enc.Hex.parse("00000000000000000000000000000000");

export function encrypt(string) {
  const encrypted = Crypto.AES.encrypt(string, key, { iv });
  return encrypted.toString();
}

export function decrypt(string) {
  const decrypted = Crypto.AES.decrypt(string, key, { iv });
  return decrypted.toString(Crypto.enc.Utf8);
}