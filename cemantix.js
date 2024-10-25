import { ofetch } from 'ofetch';

export const client = ofetch.create({
  baseURL: 'https://cemantix.certitudes.org',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: 'https://cemantix.certitudes.org',
  },
  method: 'POST',
});

export async function checkWord(word) {
  const { score, percentile } = await client('/score', {
    body: 'word=' + word,
  });
  return { score: score * 100, percentile };
}
