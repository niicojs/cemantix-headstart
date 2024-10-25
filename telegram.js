import { ofetch } from 'ofetch';

export default function Telegram(config) {
  const token = config?.telegram?.token || process.env.TELEGRAM_API_KEY;
  const chatId = config?.telegram?.chatId || process.env.TELEGRAM_CHAT_ID;
  const throttling = config?.telegram?.throttling || 0;

  const wait = async (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  let last = new Date().getTime() - throttling;
  const throttle = async () => {
    if (throttling > 0 && new Date().getTime() < last + throttling) {
      await wait(throttling);
    }
    last = new Date().getTime();
  };

  const client = ofetch.create({
    method: 'POST',
    baseURL: `https://api.telegram.org/bot${token}`,
  });

  const escape = (text) => {
    if (!text) return '\\.';
    return text.replace(
      /(\_|\*|\[|\]|\(|\)|\~|\`|\>|\#|\+|\-|\=|\||\{|\}|\.|\!)/g,
      '\\$1'
    );
  };

  const sendMessage = async (message) => {
    await throttle();

    await client('sendMessage', {
      body: {
        chat_id: chatId,
        parse_mode: 'MarkdownV2',
        text: message,
      },
    });
  };

  return { client, sendMessage, escape };
}
