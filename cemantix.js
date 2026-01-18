import { ofetch } from 'ofetch';

export const client = ofetch.create({
  baseURL: 'https://cemantix.certitudes.org',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: 'https://cemantix.certitudes.org',
  },
  method: 'POST',
  retry: 3,
  retryDelay: 1000,
});

export async function getPuzzleNumber() {
  const body = await client('/', { method: 'GET' });
  let part = body.slice(body.indexOf('data-puzzle-number="') + 'data-puzzle-number="'.length);
  part = part.slice(0, part.indexOf('"'));
  return part;
}

export async function checkWord(puzzle, word) {
  const data = await client('/score', {
    query: { n: puzzle },
    body: 'word=' + word,
  });
  if (data.e) return { score: 0, percentile: 0 };
  const { s, p } = data;
  return { score: s * 100, percentile: p || 0 };
}
