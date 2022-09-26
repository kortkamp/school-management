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
import {
  SIDE_BAR_ADMIN_ITEMS,
  SIDE_BAR_PRINCIPAL_ITEMS,
  SIDE_BAR_REGISTER_ITEMS,
  SIDE_BAR_STUDENT_ITEMS,
  SIDE_BAR_TEACHER_ITEMS,
} from './sidebarMenus';

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
    flexWrap: 'nowrap',
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

const SideBarItens: Record<string, Array<LinkToPage>> = {
  [RoleTypes.ADMIN]: SIDE_BAR_ADMIN_ITEMS,
  [RoleTypes.TEACHER]: SIDE_BAR_TEACHER_ITEMS,
  [RoleTypes.STUDENT]: SIDE_BAR_STUDENT_ITEMS,
  [RoleTypes.REGISTER]: SIDE_BAR_REGISTER_ITEMS,
  [RoleTypes.PRINCIPAL]: SIDE_BAR_PRINCIPAL_ITEMS,
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
