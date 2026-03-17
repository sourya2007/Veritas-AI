import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { FeedPage } from './pages/FeedPage'
import { ModelShowcasePage } from './pages/ModelShowcasePage'
import { VerifyPage } from './pages/VerifyPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/model-showcase" element={<ModelShowcasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
