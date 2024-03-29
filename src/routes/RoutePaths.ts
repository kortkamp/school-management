export const routePaths = {
  welcome: {
    path: '/bem-vindo',
  },
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
  employees: {
    path: '/funcionarios',
    create: { path: '/funcionarios/criar' },
  },
  students: {
    path: '/alunos',
    create: { path: '/alunos/cadastrar' },
    designate: { path: '/alunos/designar' },
    createMany: { path: '/alunos/cadastrar-por-lista' },
  },
  classGroups: {
    path: '/turmas',
  },
  person: {
    view: { path: '/pessoa/:id' },
    path: '/pessoa/',
  },
};
