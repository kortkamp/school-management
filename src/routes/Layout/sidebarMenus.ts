import { LinkToPage } from '../../utils/type';
import { routePaths } from '../RoutePaths';

export const SIDE_BAR_REGISTER_ITEMS: Array<LinkToPage> = [
  {
    title: 'Cadastrar Instituição',
    path: '/registro',
    icon: 'school',
  },
  {
    title: 'Cadastrar Funcionário',
    path: '/funcionarios/criar',
    icon: 'person',
  },
];
export const SIDE_BAR_STUDENT_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile',
    path: '/user',
    icon: 'account',
  },
];
export const SIDE_BAR_TEACHER_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile',
    path: '/user',
    icon: 'account',
  },
  {
    title: 'Avaliações',
    path: '/exames',
    icon: 'exams',
    subMenus: [
      {
        title: 'Listar Avaliações',
        path: '/exames',
        icon: 'exams',
      },
      {
        title: 'Criar Avaliações',
        path: '/exames/criar',
        icon: 'exams',
      },
      {
        title: 'Notas',
        path: '/exames/notas',
        icon: 'exams',
      },
    ],
  },
];
export const SIDE_BAR_PRINCIPAL_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile',
    path: '/user',
    icon: 'account',
  },
  {
    title: 'Instituição',
    path: `${routePaths.school.path}`,
    icon: 'school',
    subMenus: [
      {
        title: 'Dados',
        path: `${routePaths.school.data.path}`,
        icon: 'search',
      },
      {
        title: 'Parâmetros',
        path: `${routePaths.school.configure.path}`,
        icon: 'search',
      },
      {
        title: 'Cursos',
        path: `${routePaths.courses.path}`,
        icon: 'clock',
      },
      {
        title: 'Turnos',
        path: `${routePaths.routines.path}`,
        icon: 'clock',
      },
    ],
  },
  {
    title: 'Professores',
    icon: 'teacher',
    subMenus: [
      {
        title: 'Listar Professores',
        path: '/professores',
        icon: 'search',
      },
      {
        title: 'Cadastrar Professor',
        path: '/professores/criar',
        icon: 'search',
      },
      {
        title: 'Associar Turma',
        path: '/professores/turmas',
        icon: 'search',
      },
      {
        title: 'Associar Disciplina',
        path: '/professores/disciplinas',
        icon: 'search',
      },
    ],
  },
  {
    title: 'Funcionários',
    icon: 'person',
    subMenus: [
      {
        title: 'Listar',
        path: `${routePaths.employees.path}`,
        icon: 'search',
      },
      {
        title: 'Cadastrar',
        path: `${routePaths.employees.create.path}`,
        icon: 'search',
      },
    ],
  },
  {
    title: 'Alunos',
    icon: 'person',
    subMenus: [
      {
        title: 'Listar Alunos',
        path: '/alunos',
        icon: 'search',
      },
      {
        title: 'Cadastrar Aluno',
        path: '/alunos/criar',
        icon: 'search',
      },
      {
        title: 'Designar Turma',
        path: '/alunos/designar',
        icon: 'search',
      },
    ],
  },

  {
    title: 'Turmas',
    path: '/turmas',
    icon: 'group',
    subMenus: [
      {
        title: 'Listar Turmas',
        path: '/turmas',
        icon: 'group',
      },
      {
        title: 'Criar Turma',
        path: '/turmas/criar',
        icon: 'group',
      },
    ],
  },
  {
    title: 'Sobre',
    path: '/about',
    icon: 'info',
  },
];

export const SIDE_BAR_ADMIN_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile',
    path: '/user',
    icon: 'account',
  },
];
