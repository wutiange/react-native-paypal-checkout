export function envStrToUrl(env: string): string {
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
