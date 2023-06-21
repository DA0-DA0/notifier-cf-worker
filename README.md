# notifier-cf-worker

A [Cloudflare Worker](https://workers.cloudflare.com/) that forwards events from
the indexer to the inbox. An event may trigger a notification to be sent to
multiple addresses; this notifier acts as a middleman between the indexer and
the inbox, and is responsible for determining which addresses should receive
notifications.

Used template for [Cosmos wallet
authentication](https://github.com/NoahSaso/cloudflare-worker-cosmos-auth) to
authenticate requests via a [Cosmos](https://cosmos.network) wallet signature.

## Development

### Run locally

```sh
npm run dev
# OR
wrangler dev --local --persist
```

### Configuration

1. Copy `wrangler.toml.example` to `wrangler.toml`.

2. Configure secrets:

```sh
echo <VALUE> | npx wrangler secret put NOTIFY_SECRET
echo <VALUE> | npx wrangler secret put INBOX_SECRET
```

## Deploy

```sh
wrangler publish
# OR
npm run deploy
```
