import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Theme, useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, useMediaQuery } from '@mui/material';
import { useAppStore } from '../../store';
import TopBar from '../../components/TopBar';
import { ErrorBoundary } from '../../components';
import SideBar from '../../components/SideBar/SideBar';
import { LinkToPage } from '../../utils/type';

const TITLE_PRIVATE = 'Área Administrativa ';
const MOBILE_SIDEBAR_ANCHOR = 'left'; // 'right';
const DESKTOP_SIDEBAR_ANCHOR = 'left'; // 'right';
export const SIDEBAR_WIDTH = 240; // 240px

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: '100vh', // Full screen height
    paddingTop: 56,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
  },
  header: {},
  shiftContent: {
    paddingLeft: DESKTOP_SIDEBAR_ANCHOR.includes('left') ? SIDEBAR_WIDTH : 0,
    paddingRight: DESKTOP_SIDEBAR_ANCHOR.includes('right') ? SIDEBAR_WIDTH : 0,
  },
  content: {
    flexGrow: 1, // Takes all possible space
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  footer: {},
}));

/**
 * Centralized place in the App to update document.title
 */

function updateDocumentTitle(role: string) {
  const titleRole = {
    admin: 'Administrador',
    teacher: 'Professor',
    student: 'Aluno',
    responsible: 'Responsável',
  };

  const title = titleRole[role as keyof typeof titleRole];
  if (title) {
    document.title = `Área do ${title}`;
  } else {
    document.title = TITLE_PRIVATE;
  }
  return document.title.toUpperCase();
}

/**
 * "Link to Page" items in Sidebar
 */
const SIDE_BAR_GUEST_ITEMS: Array<LinkToPage> = [
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
const SIDE_BAR_STUDENT_ITEMS: Array<LinkToPage> = [
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
const SIDE_BAR_TEACHER_ITEMS: Array<LinkToPage> = [
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
const SIDE_BAR_ADMIN_ITEMS: Array<LinkToPage> = [
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
    title: 'Definir Horários',
    path: '/horarios',
    icon: 'clock',
    subMenus: [
      {
        title: 'Definir por Turma',
        path: '/horarios/turma',
        icon: 'search',
      },

      {
        title: 'Definir por Professor',
        path: '/horarios/professor',
        icon: 'search',
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
    title: 'Bimestres',
    path: '/bimestres',
    icon: 'calendar',
    subMenus: [
      {
        title: 'Listar Bimestres',
        path: '/bimestres',
        icon: 'calendar',
      },
      {
        title: 'Criar Bimestre',
        path: '/bimestres/criar',
        icon: 'calendar',
      },
    ],
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
  {
    title: 'Sobre',
    path: '/about',
    icon: 'info',
  },
];

const SideBarItens: Record<string, Array<LinkToPage>> = {
  admin: SIDE_BAR_ADMIN_ITEMS,
  teacher: SIDE_BAR_TEACHER_ITEMS,
  student: SIDE_BAR_STUDENT_ITEMS,
  guest: SIDE_BAR_GUEST_ITEMS,
};

/**
 * Renders "Private Layout" composition
 */
const PrivateLayout: React.FC = ({ children }) => {
  const [state] = useAppStore();

  const role = state.currentUser?.role;
  const [openSideBar, setOpenSideBar] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { defaultMatches: true });
  const history = useHistory();

  const handleLogoClick = useCallback(() => {
    // Navigate to '/' when clicking on Logo/Menu icon when the SideBar is already visible
    history.push('/');
  }, [history]);

  const handleSideBarOpen = useCallback(() => {
    if (!openSideBar) setOpenSideBar(true);
  }, [openSideBar]);

  const handleSideBarClose = useCallback(() => {
    if (openSideBar) setOpenSideBar(false);
  }, [openSideBar]);

  const classRoot = clsx({
    [classes.root]: true,
    [classes.shiftContent]: isDesktop,
  });
  const title = updateDocumentTitle(state?.currentUser?.role as string);
  const shouldOpenSideBar = isDesktop ? true : openSideBar;

  return (
    <Grid container direction="column" className={classRoot}>
      <Grid item className={classes.header} component="header">
        <TopBar
          isAuthenticated={state.isAuthenticated}
          title={title}
          isMenuOpen={shouldOpenSideBar}
          onMenu={shouldOpenSideBar ? handleLogoClick : handleSideBarOpen}
        />

        <SideBar
          anchor={isDesktop ? DESKTOP_SIDEBAR_ANCHOR : MOBILE_SIDEBAR_ANCHOR}
          open={shouldOpenSideBar}
          variant={isDesktop ? 'persistent' : 'temporary'}
          items={SideBarItens[role || 'guest']}
          onClose={handleSideBarClose}
        />
      </Grid>

      <Grid className={classes.content} component="main">
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Grid>
    </Grid>
  );
};

export default PrivateLayout;
