import Routes from './Routes';
import AppRouter from './AppRouter';

const routeNames = {
  school: {
    path: '/escola',
    create: { path: '/escola/dados' },
    configure: { path: '/escola/parametros' },
  },
  terms: {
    path: '/bimestres',
    create: { path: '/bimestres/criar' },
  },
  schoolYear: {
    path: '/ano-letivo',
    create: { path: '/ano-letivo/criar' },
  },
};

export { Routes as default, Routes, AppRouter, routeNames };
