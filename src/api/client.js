// API layer. Dev requests hit /api and Vite proxies them to the Express server
// (see vite.config.js). Onboarding is the ONLY write wired so far — everything
// else stays read-only until the Founder approves it (see CLAUDE.md).
export const apiBase = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`)
    err.status = res.status
    err.fields = body.fields
    throw err
  }
  return body
}

// POST the 10 locked answers → { workspaceId }
export function saveOnboarding(answers) {
  return request('/api/onboarding', { method: 'POST', body: JSON.stringify(answers) })
}

// Read the persisted profile back → { profile }
export function getOnboarding(workspaceId) {
  return request(`/api/onboarding/${encodeURIComponent(workspaceId)}`)
}
