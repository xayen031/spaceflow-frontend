import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

// Components
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header';

// Route Protection
import ProtectedRoute from '@/components/routes/ProtectedRoute'

// Pages
import LoginPage from '@/pages/LoginPage'
import LogoutPage from '@/pages/LogoutPage'

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
              {/* Header'ı burada render edin */}
              <Header />
              {/* Outlet, bu Route'un altındaki eşleşen alt rotaların içeriğini render eder. */}
              {/* Header ve altındaki içerik arasında boşluk sağlamak için bir div eklenebilir */}
              <div className="container mx-auto p-4">
                <Outlet />
              </div>
            </ProtectedRoute>
          }
        >
          <Route path="/anasayfa" element={<div>Kontrol Paneli - Korumalı</div>} />
          <Route path="/cikis" element={<LogoutPage />} />
          {/* Diğer korumalı rotalarınızı buraya ekleyin */}
          {/* Örn: <Route path="/ihale-arama" element={<div>İhale Arama Sayfası</div>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App