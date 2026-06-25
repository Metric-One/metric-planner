// Living multi-layer gradient mesh (shared Metric brand). GPU-friendly
// (transform/opacity only), fixed behind content. Intensity rides --aurora.
const blobs = [
  { c: 'rgba(59,130,246,0.52)', cls: 'left-[8%] top-[-12%] h-[64vh] w-[64vh]', anim: 'meshA 26s ease-in-out infinite', delay: '0s' },
  { c: 'rgba(96,165,250,0.40)', cls: 'right-[-6%] top-[16%] h-[58vh] w-[58vh]', anim: 'meshB 32s ease-in-out infinite', delay: '-6s' },
  { c: 'rgba(124,58,237,0.26)', cls: 'bottom-[-16%] left-[24%] h-[54vh] w-[54vh]', anim: 'meshC 30s ease-in-out infinite', delay: '-12s' },
  { c: 'rgba(37,99,235,0.30)', cls: 'right-[18%] bottom-[4%] h-[42vh] w-[42vh]', anim: 'meshA 38s ease-in-out infinite', delay: '-20s' }
]

export function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ opacity: 'var(--aurora)' }} aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[130px] ${b.cls}`}
          style={{ background: `radial-gradient(circle, ${b.c}, transparent 62%)`, animation: b.anim, animationDelay: b.delay, willChange: 'transform' }}
        />
      ))}
    </div>
  )
}
