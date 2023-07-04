import data from './data.json';
function envStrToUrl(env: string): string {
  switch (env) {
    case 'LIVE':
      return 'https://api.paypal.com';
    case 'SANDBOX':
      return 'https://api.sandbox.paypal.com';
    case 'STAGE':
      return 'https://api.stage.paypal.com';
    case 'LOCAL':
      return 'http://localhost:8080';
    default:
      return env;
  }
}

const scriptEncoded = (data ?? {}) as Record<string, string>;

function getAuthorization(accountType: string): string {
  if (!scriptEncoded[accountType]) {
    throw new Error('accountType is not set');
  }
  return scriptEncoded[accountType] ?? '';
}

export { envStrToUrl, getAuthorization };
