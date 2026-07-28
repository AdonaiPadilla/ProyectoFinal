import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { usuario, logout } = useAuth();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¡Bienvenido, {usuario?.nombre}!</Text>
      <Text>Email: {usuario?.email}</Text>
      <Text>Rol: {usuario?.rol}</Text>
      <View style={{ marginTop: 24 }}>
        <Button title="Cerrar sesión" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
});