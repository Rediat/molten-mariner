import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // Inject build timestamp at build time for automatic versioning
        __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    },
})
