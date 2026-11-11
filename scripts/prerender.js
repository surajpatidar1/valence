import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function injectRoot(html, content) {
  return html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${content}</div>`);
}

async function prerender() {
  console.log('Building SSR bundle...');
  await build({
    root: rootDir,
    build: {
      ssr: path.resolve(rootDir, 'src/entry-server.tsx'),
      outDir: path.resolve(rootDir, 'dist-ssr'),
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
    },
  });

  const serverEntryPath = path.resolve(rootDir, 'dist-ssr/entry-server.js');
  const { render } = await import(pathToFileURL(serverEntryPath).href);

  console.log('Pre-rendering / (index.html)...');
  const homeHtml = render('/');
  const distIndexPath = path.resolve(rootDir, 'dist/index.html');
  if (fs.existsSync(distIndexPath)) {
    let html = fs.readFileSync(distIndexPath, 'utf-8');
    html = injectRoot(html, homeHtml);
    fs.writeFileSync(distIndexPath, html, 'utf-8');
    console.log('✓ Injected pre-rendered HTML into dist/index.html');
  }

  console.log('Pre-rendering /partners (partners/index.html)...');
  const partnerHtml = render('/partners');
  const distPartnerPath = path.resolve(rootDir, 'dist/partners/index.html');
  if (fs.existsSync(distPartnerPath)) {
    let html = fs.readFileSync(distPartnerPath, 'utf-8');
    html = injectRoot(html, partnerHtml);
    fs.writeFileSync(distPartnerPath, html, 'utf-8');
    console.log('✓ Injected pre-rendered HTML into dist/partners/index.html');
  }

  console.log('Pre-rendering /reviews (reviews/index.html)...');
  const reviewsHtml = render('/reviews');
  const distReviewsPath = path.resolve(rootDir, 'dist/reviews/index.html');
  if (fs.existsSync(distReviewsPath)) {
    let html = fs.readFileSync(distReviewsPath, 'utf-8');
    html = injectRoot(html, reviewsHtml);
    fs.writeFileSync(distReviewsPath, html, 'utf-8');
    console.log('✓ Injected pre-rendered HTML into dist/reviews/index.html');
  }

  // Clean up dist-ssr
  fs.rmSync(path.resolve(rootDir, 'dist-ssr'), { recursive: true, force: true });
  console.log('✓ Cleaned up dist-ssr');
  console.log('Pre-rendering completed successfully!');
}

prerender().catch((err) => {
  console.error('Error during prerendering:', err);
  process.exit(1);
});
