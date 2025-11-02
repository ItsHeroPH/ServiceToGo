import chalk from "chalk"


function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours() % 12);
  const mi = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
}

/**
 * @param {string} tag 
 * @param {string} msg 
 */
const info = (tag, msg) => {
    console.log(`${chalk.blue.bold(`[${getTimestamp()} INFO]: [${tag}]`)} ${msg}`)
}

/**
 * @param {string} tag 
 * @param {string} msg 
 */
const warn = (tag, msg) => {
    console.log(`${chalk.yellow.bold(`[${getTimestamp()} WARN]: [${tag}]`)} ${msg}`)
}

/**
 * @param {string} tag 
 * @param {string} msg 
 */
const error = (tag, msg) => {
    console.log(`${chalk.red.bold(`[${getTimestamp()} ERROR]: [${tag}]`)} ${msg}`)
}

export default { info, warn, error }