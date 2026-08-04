const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { generateToken } = require('../utils/jwt.util');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    // Nota: NO tomamos "rol" del body por seguridad —
    // cualquiera que se registre queda como 'usuario' por defecto.
    // Crear admins/gerentes se hace desde un endpoint protegido aparte.

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(409).json({ message: 'Ese email ya está registrado' });
    }

    const passwordHasheada = await hashPassword(password);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: passwordHasheada
    });

    const token = generateToken({ id: nuevoUsuario._id, rol: nuevoUsuario.rol });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValida = await comparePassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: usuario._id, rol: usuario.rol });

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };