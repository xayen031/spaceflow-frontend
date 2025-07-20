// src/components/routes/ProtectedRoute.tsx
import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const [loading, setLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    const checkSessionAndRole = async () => {
      setLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        setLoading(false);
        setHasPermission(false);
        return;
      }

      if (currentSession) {
        const userId = currentSession.user?.id;
        if (userId) {
          // Fetch user role from the 'profiles' table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('rol') // Select the 'rol' column
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError.message);
            setHasPermission(false);
          } else if (profile) {
            const userRole = profile.rol;
            if (requiredRoles && requiredRoles.length > 0) {
              setHasPermission(requiredRoles.includes(userRole));
            } else {
              setHasPermission(true); // No specific roles required, so allow access
            }
          } else {
            setHasPermission(false); // Profile not found
          }
        } else {
          setHasPermission(false); // User ID not found in session
        }
      } else {
        setHasPermission(false); // No active session
      }
      setLoading(false);
    };

    checkSessionAndRole();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, _newSession) => {
        // Re-run the check when auth state changes
        checkSessionAndRole();
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [requiredRoles]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // If user does not have permission, redirect to login page
  if (!hasPermission) {
    return <Navigate to="/giris" replace />;
  }

  // If user has permission, render children or Outlet
  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute