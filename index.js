import { readFileSync } from 'fs';

import { checkWord } from './cemantix.js';
import Telegram from './telegram.js';
import getConfig from './config.js';

console.info('**********************');
console.info('* CEMANTIX HEADSTART *');
console.info('**********************');

const config = getConfig();
// console.log(config);

const words = readFileSync(wordsfile, 'utf-8')
  .split(/\r?\n/)
  .filter((w) => w && w.length > 2)
  .map((w) => w.trim().toLowerCase());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function shuffle(array) {
  let i = array.length;

  while (i !== 0) {
    let rnd = Math.floor(Math.random() * i);
    i--;
    [array[i], array[rnd]] = [array[rnd], array[i]];
  }
}

shuffle(words);

const interesting = [];

for (const word of words) {
  const res = await checkWord(word);
  if (res.percentile && res.percentile > 0) {
    console.log(res.percentile, word);
    interesting.push({ word, ...res });
    if (res.percentile > 600) break;
  }
  await sleep(80);
}

interesting.sort((a, b) => b.score - a.score);

const telegram = Telegram(config);
let message = '*Cemantix Headstart*\n';
for (const { word, percentile } of interesting) {
  message += `${percentile.toString().padStart(4, ' ')} \\- ${word}\n`;
}
message += `[cémantix](https://cemantix.certitudes.org)\n`;

telegram.sendMessage(message);

console.info('Done.');
