import { readFileSync } from 'fs';

import { checkWord, getPuzzleNumber } from './cemantix.js';
import Telegram from './telegram.js';
import getConfig from './config.js';

process.env.HTTP_PROXY = 'http://127.0.0.1:9090';

console.info('┌────────────────────┐');
console.info('│ CEMANTIX HEADSTART │');
console.info('└────────────────────┘');

const config = getConfig();
// console.log(config);

const telegram = Telegram(config);

console.log('Opening word file...');
const words = readFileSync(config.wordsfile, 'utf-8')
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

try {
  console.log('Get puzzle number...');
  const puzzle = await getPuzzleNumber();
  console.log('Testing words...');
  for (const word of words) {
    const res = await checkWord(puzzle, word);
    console.log(res);
    if (res.percentile && res.percentile > 0) {
      console.log(res.percentile, word);
      interesting.push({ word, ...res });
      if (res.percentile > 600) break;
    }
    await sleep(80);
  }

  interesting.sort((a, b) => b.score - a.score);

  let message = '[Cémantix Headstart](https://cemantix.certitudes.org)\n';
  for (const { word, percentile } of interesting) {
    const w = telegram.escape(word);
    message += `${percentile.toString().padStart(4, ' ')} \\- ${w}\n`;
  }

  telegram.sendMessage(message);
} catch (e) {
  let message = '[Cémantix Headstart](https://cemantix.certitudes.org)\n';
  for (const { word, percentile } of interesting) {
    const w = telegram.escape(word);
    message += `${percentile.toString().padStart(4, ' ')} \\- ${w}\n`;
  }

  message += '\n*ERROR*\n' + e.message;

  telegram.sendMessage(message);
}

console.info('Done.');
