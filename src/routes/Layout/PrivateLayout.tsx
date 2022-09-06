import { useState, useCallback, ReactNode } from 'react';
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
import { MessagesDialog } from '../../components/dialogs';
import { RoleTypes } from '../../services/models/IRole';
import SelectSchoolView from '../../views/Schools/SelectSchoolView';

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

function updateDocumentTitle(roleName: string) {
  if (roleName) {
    document.title = `Área do ${roleName}`;
  } else {
    document.title = TITLE_PRIVATE;
  }
  return document.title.toUpperCase();
}

/**
 * "Link to Page" items in Sidebar
 */

const SIDE_BAR_REGISTER_ITEMS: Array<LinkToPage> = [
  {
    title: 'Cadastrar Instituição',
    path: '/registro',
    icon: 'school',
  },
  {
    title: 'Cadastrar Funcionário',
    path: '/funcionarios',
    icon: 'person',
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
    title: 'Escola',
    path: '/escola',
    icon: 'school',
    subMenus: [
      {
        title: 'Editar Dados',
        path: '/escola/atualizar',
        icon: 'search',
      },
    ],
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
  [RoleTypes.ADMIN]: SIDE_BAR_ADMIN_ITEMS,
  [RoleTypes.TEACHER]: SIDE_BAR_TEACHER_ITEMS,
  [RoleTypes.STUDENT]: SIDE_BAR_STUDENT_ITEMS,
  [RoleTypes.REGISTER]: SIDE_BAR_REGISTER_ITEMS,
  [RoleTypes.PRINCIPAL]: SIDE_BAR_ADMIN_ITEMS,
};

/**
 *
 * Renders "Private Layout" composition
 */
const PrivateLayout: React.FC = ({ children }) => {
  const [state] = useAppStore();

  const [messagesModal, setMessagesModal] = useState<ReactNode | null>(null);

  const role = state.currentSchool?.role;
  const [openSideBar, setOpenSideBar] = useState(false);
  const theme = useTheme();
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { defaultMatches: true });
  const history = useHistory();

  const onCloseMessageModal = () => {
    setMessagesModal(null);
  };

  const onSwitchMessagesModal = () => {
    setMessagesModal(<MessagesDialog open onClose={onCloseMessageModal} />);
  };

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
  const title = updateDocumentTitle(state?.currentSchool?.role_name as string);
  const shouldOpenSideBar = isDesktop ? true : openSideBar;

  return (
    <Grid container direction="column" className={classRoot}>
      <Grid item className={classes.header} component="header">
        <TopBar
          isAuthenticated={state.isAuthenticated}
          title={title}
          isMenuOpen={shouldOpenSideBar}
          onMenu={shouldOpenSideBar ? handleLogoClick : handleSideBarOpen}
          onNotifications={onSwitchMessagesModal}
        />

        <SideBar
          anchor={isDesktop ? DESKTOP_SIDEBAR_ANCHOR : MOBILE_SIDEBAR_ANCHOR}
          open={shouldOpenSideBar}
          variant={isDesktop ? 'persistent' : 'temporary'}
          items={SideBarItens[role || 'no_role'] || []}
          onClose={handleSideBarClose}
        />
      </Grid>

      <Grid className={classes.content} component="main">
        <>
          {messagesModal}
          {state.currentSchool ? (
            <ErrorBoundary name="Content">{children}</ErrorBoundary>
          ) : (
            <SelectSchoolView schools={state.currentUser?.schools} />
          )}
        </>
      </Grid>
    </Grid>
  );
};

export default PrivateLayout;
