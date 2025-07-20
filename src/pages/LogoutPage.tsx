// src/pages/LogoutPage.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase' // Supabase istemcinizin yolu
import { toast } from 'sonner' // toast bileşenini içe aktarın

export default function LogoutPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error("Çıkış yapılırken hata oluştu: " + error.message, { //
          duration: 3000,
        })
        console.error("Çıkış yapılırken hata oluştu:", error.message)
        // Hata durumunda da giriş sayfasına yönlendirme yapabiliriz
        navigate('/giris')
      } else {
        toast.success("Başarıyla çıkış yapıldı.", { //
          duration: 2000,
        })
        navigate('/giris') // Başarılı çıkış sonrası giriş sayfasına yönlendir
      }
    }

    handleLogout()
  }, [navigate]) // navigate bağımlılığı eklendi

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p>Çıkış yapılıyor...</p>
    </div>
  )
}