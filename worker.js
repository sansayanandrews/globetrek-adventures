export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Root / or /index.html or /project or /view-project -> serve view-project.html first
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/project' || url.pathname === '/view-project') {
      return env.ASSETS.fetch(new Request('https://assets.local/view-project.html', request));
    }

    // 2. /app or /app/ or /app.html -> serve app.html (the React app)
    if (url.pathname === '/app' || url.pathname === '/app/' || url.pathname === '/app.html') {
      return env.ASSETS.fetch(new Request('https://assets.local/app.html', request));
    }

    // 3. Try to serve exact static asset (e.g. /assets/*, /docs/*, /favicon.svg, .zip)
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // 4. Any other route (/login, /packages, /dashboard, etc.) -> serve app.html for React Router
    return env.ASSETS.fetch(new Request('https://assets.local/app.html', request));
  }
};
