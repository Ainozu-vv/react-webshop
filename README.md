# React Webshop (Vite)

## Development

```bash
npm install
npm run dev
```

## API base URL

The app talks to the Express API described in `api.md`.

- Default API URL: `http://localhost:3000`
- Override with: `VITE_API_BASE_URL`

Example (PowerShell):

```powershell
$env:VITE_API_BASE_URL='http://localhost:3000'
npm run dev
```