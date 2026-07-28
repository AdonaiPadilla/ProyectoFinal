import axios from 'axios';

// En Android emulator usa 10.0.2.2 en vez de localhost
// En celular físico (Expo Go) usa la IP de tu compu en la red local, ej. 192.168.1.X
const API_URL = 'http://192.168.0.102:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;