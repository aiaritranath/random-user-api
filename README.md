# Random User API

A Node.js serverless API project designed to generate fictional random user profiles in JSON. It supports API-key authentication, optional filters, and deployment on Vercel.

> **Implementation note:** In the current `api/index.js`, the handler calls `generateUser`, `CREATOR`, and `crypto`, but these are not defined or imported in the provided source file. The endpoint will need those definitions (and a `crypto` import such as `const crypto = require("crypto")`) before it can generate successful responses. See **Before deploying** below.

## Features

- API-key authentication using an `x-api-key` header, a Bearer token, or an `api_key` query parameter
- Optional gender filter: `male` or `female`
- Optional nationality filter
- Generate between 1 and 50 profiles per request
- Optional metadata in the JSON response
- CORS preflight handling
- Vercel serverless-function structure

## Tech Stack

- Node.js 18+
- JavaScript (CommonJS)
- Vercel Serverless Functions

## Project Structure

```text
random-user-api/
├── api/
│   └── index.js       # API request handler
├── package.json       # Project metadata and dev command
├── vercel.json        # Root route rewrite
└── .gitignore         # Ignores local dependencies and environment files
```

## Deployment

After deploying to Vercel, the API endpoint is typically:

```text
https://YOUR-PROJECT.vercel.app/api
```

The included `vercel.json` rewrites `/` to `/api`, so the root URL is also configured as an alias.

**HTTP method:** `GET`  
**Authentication:** Required, except for CORS `OPTIONS` preflight requests.

## Configure the API key

Set an environment variable named `API_KEY` in your Vercel project:

1. Open the project in the Vercel dashboard.
2. Go to **Settings → Environment Variables**.
3. Add `API_KEY` with a long, unpredictable secret value.
4. Redeploy the project.

For local development, create a `.env.local` file in the project root:

```env
API_KEY=replace_with_a_long_random_secret
```

Do not commit `.env.local` or expose the key in frontend JavaScript. The repository's `.gitignore` already excludes `.env` and `.env.local`.

## Authentication

Send the key using one of these methods.

### Recommended: `x-api-key` header

```bash
curl "https://YOUR-PROJECT.vercel.app/api?results=3" \
  -H "x-api-key: YOUR_API_KEY"
```

### Bearer token

```bash
curl "https://YOUR-PROJECT.vercel.app/api?results=3" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Query parameter

```text
https://YOUR-PROJECT.vercel.app/api?api_key=YOUR_API_KEY&results=3
```

Using a header is preferred because query parameters may be recorded in logs, browser history, or analytics.

## Query Parameters

| Parameter | Aliases | Description | Example |
|---|---|---|---|
| `gender` | `g`, `sex` | Optional gender filter. Accepted values include `male`, `m`, `man`, `boy`, `female`, `f`, `woman`, and `girl`. Omit it, or use `all`/`any`, for random gender selection. | `gender=female` |
| `nat` | `country`, `nationality` | Optional nationality code. Supported codes: `US`, `GB`, `CA`, `AU`, `IN`, `DE`, `FR`, `DK`, `UA`, `BR`. | `nat=IN` |
| `results` | `count`, `limit` | Number of profiles requested. Defaults to `1` and is clamped to the range `1–50`. | `results=5` |
| `seed` | — | Included in response metadata. It does **not** currently make generated results reproducible. | `seed=demo123` |
| `noinfo` | — | Set to `true` to omit the `info` metadata object. | `noinfo=true` |
| `api_key` | — | API key when not using an authentication header. | `api_key=YOUR_API_KEY` |

Invalid gender or nationality values return `400 Bad Request`.

## Example Requests

### cURL

```bash
curl "https://YOUR-PROJECT.vercel.app/api?results=3&gender=female&nat=IN" \
  -H "x-api-key: YOUR_API_KEY"
```

### JavaScript

```javascript
const response = await fetch(
  "https://YOUR-PROJECT.vercel.app/api?results=2&nat=GB",
  {
    headers: {
      "x-api-key": "YOUR_API_KEY",
    },
  }
);

if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}

const data = await response.json();
console.log(data.results);
```

## Response Format

The intended successful response has a `results` array and creator metadata. Unless `noinfo=true` is supplied, it also includes an `info` object.

```json
{
  "results": [
    {
      "gender": "female",
      "name": {
        "title": "Ms",
        "first": "Example",
        "last": "User"
      },
      "email": "example.user@example.com",
      "nat": "IN"
    }
  ],
  "info": {
    "seed": "demo123",
    "results": 1,
    "page": 1,
    "version": "1.0.0",
    "generatedAt": "2026-01-01T00:00:00.000Z",
    "filters": {
      "gender": "female",
      "nat": "IN"
    }
  },
  "creator": {
    "name": "Aritra Nath",
    "project": "Private Random User API"
  }
}
```

This is an illustrative schema, not a verified live response. The exact profile fields depend on the implementation of `generateUser`.

## Error Responses

| HTTP status | Meaning | Typical cause |
|---|---|---|
| `200 OK` | Success | Profiles generated successfully |
| `400 Bad Request` | Invalid filter | Unsupported gender or nationality value |
| `401 Unauthorized` | Missing or incorrect API key | Provide the configured key |
| `405 Method Not Allowed` | Unsupported method | Use `GET`; `OPTIONS` is supported for CORS preflight |
| `500 Server Misconfigured` | Missing server configuration | Set `API_KEY` in the deployment environment |

The current handler also returns a `500` response if `API_KEY` is not configured.

## Run Locally

### Requirements

- [Node.js 18 or newer](https://nodejs.org/)
- npm
- [Vercel CLI](https://vercel.com/docs/cli)

Install the Vercel CLI if needed:

```bash
npm install -g vercel
```

Install project dependencies (the current project declares no runtime dependencies):

```bash
npm install
```

Create `.env.local` in the project root and add your API key:

```env
API_KEY=replace_with_a_long_random_secret
```

Start the local Vercel development server:

```bash
npm run dev
```

Test the endpoint (Vercel's local server commonly uses port `3000`):

```bash
curl "http://localhost:3000/api?results=2&nat=IN" \
  -H "x-api-key: replace_with_a_long_random_secret"
```

## Before Deploying

Review and complete the implementation in `api/index.js`:

1. Define or import `generateUser({ gender, nat })`.
2. Define the `CREATOR` metadata object used by success and error responses.
3. Import Node's crypto module, for example `const crypto = require("crypto");`.
4. Test valid requests, invalid filters, missing API keys, and the `noinfo=true` option locally before deploying.

Until these missing symbols are implemented, the handler cannot return successful generated profiles.

## Security and Usage Notes

- **Use fictional data only.** Generated profiles should be used for development, demos, and testing—not to impersonate real people.
- Do not use placeholder identity numbers, passwords, or contact details for real-world identity verification or account access.
- Keep `API_KEY` private and rotate it if it is exposed.
- The current CORS configuration allows all origins (`*`). Restrict it if your application requires a limited set of trusted origins.
- The current project does not implement rate limiting or usage quotas. Add these before exposing the API to broad public use.
- The `seed` parameter is metadata only; it does not currently guarantee repeatable results.

## Creator

**Aritra Nath**

- Instagram: [@its_aritra_nath](https://instagram.com/its_aritra_nath)

## License

No `LICENSE` file is included. Unless you add a license, others should not assume they have permission to reuse, modify, or redistribute this project.
