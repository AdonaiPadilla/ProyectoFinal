const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
    }
    next();
  };
};

module.exports = permitirRoles;

/* 
Explicación
(...rolesPermitidos): usa rest parameters, permite pasar varios roles como argumentos, por ejemplo permitirRoles('admin', 'gerente').
Regresa una función middleware (patrón común en Express para middlewares "configurables") — por eso se usa así en las rutas: permitirRoles('admin') y no solo permitirRoles.
req.usuario.rol: aquí es donde se usa lo que dejó guardado auth.middleware.js — por eso este middleware siempre va después de protegerRuta en la cadena de una ruta, nunca solo.
Si el rol del usuario no está en la lista permitida, 403 Forbidden (diferente de 401: aquí sí sabemos quién es, solo no tiene permiso).
3. Cómo se usan juntos en una ruta (ejemplo)
javascript
const express = require('express');
const router = express.Router();
const protegerRuta = require('../middlewares/auth.middleware');
const permitirRoles = require('../middlewares/role.middleware');

// Cualquier usuario logueado puede ver esto
router.get('/perfil', protegerRuta, (req, res) => {
  res.json({ usuario: req.usuario });
});

// Solo admin puede ver esto
router.get('/reportes', protegerRuta, permitirRoles('admin'), (req, res) => {
  res.json({ message: 'Reportes solo para admin' });
});

module.exports = router;

Fíjate en el orden: protegerRuta primero (valida que haya token y esté logueado), luego permitirRoles(...) (valida que ese usuario tenga el rol correcto). Express ejecuta los middlewares de una ruta en el orden en que los listas.
*/