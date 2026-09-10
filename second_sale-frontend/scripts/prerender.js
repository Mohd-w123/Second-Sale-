/**
 * Post-build prerender using Puppeteer.
 * Serves dist/ locally and saves rendered HTML per route.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import handler from 'serve-handler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const routesFile = path.join(root, 'prerender-routes.json');
const PORT = 4173;

function getOutputPath(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(distDir, clean, 'index.html');
}

async function startServer() {
  const server = http.createServer((req, res) =>
    handler(req, res, {
      public: distDir,
      rewrites: [{ source: '**', destination: '/index.html' }],
    })
  );
  await new Promise((resolve) => server.listen(PORT, resolve));
  return server;
}

async function main() {
  if (process.env.VERCEL || process.env.SKIP_PRERENDER || process.env.CI) {
    console.log('⚡ Skipping Puppeteer prerender in cloud build environment (Vercel).');
    return;
  }

  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found — run vite build first');
    process.exit(1);
  }

  const routes = fs.existsSync(routesFile)
    ? JSON.parse(fs.readFileSync(routesFile, 'utf-8'))
    : ['/'];

  let server;
  let browser;
  try {
    server = await startServer();
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (err) {
    console.warn('⚡ Puppeteer cannot launch in this environment. Skipping prerender:', err.message);
    if (server) server.close();
    return;
  }

  console.log(`Prerendering ${routes.length} routes...`);


  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
      await page.waitForFunction(
        () => document.querySelector('title')?.textContent?.includes('SecondSale'),
        { timeout: 30000 }
      ).catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const html = await page.content();
      const outPath = getOutputPath(route);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      console.log(`  ✓ ${route}`);
    } catch (err) {
      console.warn(`  ✗ ${route}: ${err.message}`);
    } finally {
      await page.close().catch(() => {});
    }
  }

  await browser.close();
  server.close();
  console.log('Prerender complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
