const newHost = 'api.listenbrainz.org'
const encoder = new TextEncoder();
const noBodyMethods = ['GET', 'HEAD'];

async function checkAuth(request, env){
  const authHeader = request.headers.get('authorization');
  if (authHeader === null || !authHeader.startsWith('Token ')) return false;
  const token = authHeader.substring(6);
  const hash =  new Uint8Array(
    await crypto.subtle.digest('SHA-256', encoder.encode(token))
  ).toHex();

  return hash === env.LB_TOKEN_HASH;
}

async function createLBRequest(request){
    const url = new URL(request.url);
    url.hostname = newHost;

    const headers = new Headers(request.headers);
    headers.set('host', url.host);

    let body = request.body;
    if (noBodyMethods.includes(request.method.toUpperCase())){
      headers.delete('content-length');
      headers.delete('content-type');
      body = null;
    }

    return new Request(url, { headers, body, method: request.method });
}

export default {
  async fetch(request, env, ctx) {
    if (! await checkAuth(request, env)){
      return new Response('Unauthorized in lb-proxy', {status: 401, statusText: 'Unauthorized'});
    }
    return fetch(await createLBRequest(request));
  }
};
