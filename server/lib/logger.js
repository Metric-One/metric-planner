// Minimal structured logger (Part 3, layer 7). Emits one JSON object per line.
// stdout/stderr are captured by the process manager (pm2 / systemd / docker),
// so logs survive a restart without needing a paid APM for V1.
function emit(level, msg, meta = {}) {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...meta })
  if (level === 'error' || level === 'warn') process.stderr.write(line + '\n')
  else process.stdout.write(line + '\n')
}

export const logger = {
  info: (msg, meta) => emit('info', msg, meta),
  warn: (msg, meta) => emit('warn', msg, meta),
  error: (msg, meta) => emit('error', msg, meta)
}
