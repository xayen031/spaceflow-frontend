// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

// Components
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header';

// Route Protection
import ProtectedRoute from '@/components/routes/ProtectedRoute'

// App Pages
import LoginPage from '@/pages/LoginPage'
import LogoutPage from '@/pages/LogoutPage'
import ProfilePage from '@/pages/ProfilePage'

// Admin Management Pages
import ManagementPage from '@/pages/ManagementPage';

function App() {
  return (
    <BrowserRouter>
    <Toaster />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/giris" element={<LoginPage/>} />
        <Route
          element={
            <ProtectedRoute>
              <Header />
              <div className="container mx-auto p-4">
                <Outlet />
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="/anasayfa" element={<div>Kontrol Paneli - Korumalı</div>} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/cikis" element={<LogoutPage />} />
          <Route path="/yonetim" element={<ProtectedRoute requiredRoles={['admin']}><ManagementPage/></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App