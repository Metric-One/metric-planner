import { Routes, Route, Navigate } from 'react-router-dom'
import { MeshBackground } from '@/shared/components/MeshBackground.jsx'
import Landing from '@/portals/app/Landing.jsx'
import Onboarding from '@/portals/onboarding/Onboarding.jsx'

export default function App() {
  return (
    <>
      <MeshBackground />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
