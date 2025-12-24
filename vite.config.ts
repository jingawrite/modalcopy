import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  // Vercel에서는 루트 경로, GitHub Pages에서는 서브 경로 사용
  base: process.env.VERCEL ? '/' : '/modalcopy/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // 빌드 후 404.html을 index.html의 복사본으로 생성
    {
      name: 'copy-404',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist')
        try {
          copyFileSync(
            path.join(distPath, 'index.html'),
            path.join(distPath, '404.html')
          )
        } catch (err) {
          console.warn('Failed to copy index.html to 404.html:', err)
        }
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
