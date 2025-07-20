// src/components/ProtectedRoute.tsx
import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mevcut oturumu kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Oturum değişikliklerini dinle
    const { data } = supabase.auth.onAuthStateChange( // 'data' is the object containing 'subscription'
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    // Bileşen ayrıldığında dinleyiciyi kaldır
    return () => {
      if (data?.subscription) { // Check if subscription exists before unsubscribing
        data.subscription.unsubscribe() // Correctly call unsubscribe on the subscription object
      }
    }
  }, [])

  if (loading) {
    // Yükleniyor durumunda bir yüklenme göstergesi veya boş bir sayfa gösterebilirsiniz
    return <div>Yükleniyor...</div>
  }

  if (!session) {
    // Kullanıcı kimliği doğrulanmamışsa giriş sayfasına yönlendir
    return <Navigate to="/giris" replace />
  }

  // Kullanıcı kimliği doğrulanmışsa, alt bileşenleri veya Outlet'i render et
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute