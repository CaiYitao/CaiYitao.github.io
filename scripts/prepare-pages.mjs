import { copyFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDir = fileURLToPath(new URL('../dist/', import.meta.url))

// GitHub Pages has no SPA rewrite rules. Serving the app shell as 404.html
// lets React Router resolve direct visits to /research, /posts/scgrip, etc.
await copyFile(join(distDir, 'index.html'), join(distDir, '404.html'))
await writeFile(join(distDir, '.nojekyll'), '')

console.log('GitHub Pages fallback and .nojekyll are ready.')
