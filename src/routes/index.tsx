import Routes from './Routes';
import AppRouter from './AppRouter';

const routeNames = {
  school: {
    path: '/escola',
    create: { path: '/escola/criar' },
    configure: { path: '/escola/configurar' },
  },
  terms: {
    path: '/bimestres',
    create: { path: '/bimestres/criar' },
  },
};

export { Routes as default, Routes, AppRouter, routeNames };
