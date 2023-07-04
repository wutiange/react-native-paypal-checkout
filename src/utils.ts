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

// 对字符串进行 encode 和 base64，需要指定编码方式
function encodeAndBase64(str: string, encoding: BufferEncoding) {
  return Buffer.from(str, encoding).toString('base64');
}

function createAuthorization(clientId: string) {
  const usernameAndPassword = `${clientId}:`;
  const encoded = encodeAndBase64(usernameAndPassword, 'latin1');
  return `Basic ${encoded}`;
}

export { envStrToUrl, createAuthorization };
