export const routePaths = {
  school: {
    path: '/escola',
    data: { path: '/escola/dados' },
    configure: { path: '/escola/parametros' },
    select: { path: '/selecionar-escola' },
  },
  courses: {
    path: '/cursos',
  },
  terms: {
    path: '/bimestres',
    create: { path: '/bimestres/criar' },
  },
  schoolYear: {
    path: '/ano-letivo',
    create: { path: '/ano-letivo/criar' },
  },
  routines: {
    path: '/turnos',
  },
};
