import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Toaster } from 'sonner'

import LoginPage from '@/pages/LoginPage'

function App() {
  return (
    <BrowserRouter>
    <Toaster />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/giris" element={<LoginPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App