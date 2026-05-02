# lb-proxy
Cloudflare workers proxy for ListenBrainz API.

## Why
If you are sharing your public IP with malicious bots, your IP can get autimatically blocked.  
Metabrainz support team can unblock it upon your request but in the meantime you are going to lose your scrobbles.  
To keep your scrobbling uninterrupted you can set up a proxy.  
HTTP proxies are often paid or require you to rent a VPS. Free proxies are often unreliable.  
Cloudflare workers are free.  
This repo contains a js script that can be used on your cloudflare worker as a proxy to ListenBrainz API.
Thus you can keep scrobbling even when LB website is inaccessible for you.

## The Guide
### Set up Cloudflare worker
1. Open the [Cloudflare dashboard](https://dash.cloudflare.com)
2. Go to the `Compute > Workers & Pages`
3. Create a new Hello World worker application
4. Copy-paste [`lb-proxy.js`](./lb-proxy.js) content into code editor
5. Save the worker and rename it into something meaningful, like `lb-proxy`
6. Generate a SHA-256 hash of your ListenBrainz token.
    - macOS example: `sha256 -s '00000000-0000-0000-0000-000000000000'`
    - Debian example: `echo -ne '00000000-0000-0000-0000-000000000000' | sha256sum`
7. Open worker's `Settings > Variables and Secrets` and create a variable named `LB_TOKEN_HASH` containing the hash from the previous step

Note the `Domains and routes` section in the Settings. You can see there a `workers.dev` domain, something like `lb-proxy.yourusername.workers.dev`. You can use that domain as a replacement for  `api.listenbrainz.org` in your music application. 

### Navidrome setup example
**Option A.** Put `ListenBrainz.BaseURL=https://lb-proxy.yourusername.workers.dev/1` into your `navidrome.toml`. Replace `lb-proxy.yourusername.workers.dev` with your actual worker's domain. Restart Navidrome.  
**Option B.** Stop Navidrome. Restart it with environment variable `ND_LISTENBRAINZ_BASEURL=https://lb-proxy.yourusername.workers.dev/1`. Replace `lb-proxy.yourusername.workers.dev` with your actual worker's domain. 

**[My own example with docker compose](https://github.com/kamaeff/home-server/blob/c25dfd5e0aea366c6fb43fc71e4263a1cc487efb/navidrome/docker-compose.yml#L20)**

For more details on configuration refer to [Navidrome docs](https://www.navidrome.org/docs/usage/configuration/options/).
