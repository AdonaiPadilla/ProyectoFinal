import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

function Navegacion() {
  const { token, cargando } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (cargando) return;

    const enHome = segments[0] === 'home';

    if (!token && enHome) {
      router.replace('/'); // no hay sesión, manda al login
    } else if (token && !enHome) {
      router.replace('/home'); // ya hay sesión, manda a Home
    }
  }, [token, cargando, segments]);

  if (cargando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="home" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navegacion />
    </AuthProvider>
  );
}