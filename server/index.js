import { createApp } from './app.js'
import { logger } from './lib/logger.js'
import { prisma } from './db/prisma.js'

// API_PORT, not PORT — PORT is reserved for the Vite dev server (vite.config.js).
const PORT = Number(process.env.API_PORT || 4001)

const server = createApp().listen(PORT, () => {
  logger.info('server.listening', { port: PORT })
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    logger.info('server.shutdown', { sig })
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  })
}
