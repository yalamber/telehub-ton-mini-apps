import crypto from 'crypto';

export function auth(apiToken: string, telegramInitData: string): boolean {
  const initData = new URLSearchParams(telegramInitData);

  const sortedEntries = Array.from(initData.entries()).sort();
  const hash = initData.get('hash');
  initData.delete('hash');

  const dataToCheck = sortedEntries
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', apiToken)
    .update('WebAppData')
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataToCheck)
    .digest('hex');

  return hash === computedHash;
}
