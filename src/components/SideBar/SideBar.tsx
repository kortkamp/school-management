import { useCallback } from 'react';
import clsx from 'clsx';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useAppStore } from '../../store/AppStore';
import { AppIconButton } from '../../components';
import UserInfo from '../UserInfo/UserInfo';
import SideBarNavigation from './SideBarNavigation';
import { SIDEBAR_WIDTH } from '../../routes/Layout/PrivateLayout';
import { LinkToPage } from '../../utils/type';
import { useHistory } from 'react-router';
import SchoolRoleSelector from '../SchoolRoleSelector';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
  },
  paperInDrawer: {
    width: SIDEBAR_WIDTH,
    [theme.breakpoints.up('md')]: {
      marginTop: 48,
      height: 'calc(100% - 48px)',
    },
  },
  profile: {
    marginBottom: theme.spacing(2),
  },
  nav: {},
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
}));

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @class SideBar
 * @param {string} [prop.anchor] - 'left' or 'right'
 * @param {string} [prop.className] - optional className for <div> tag
 * @param {boolean} props.open - the Drawer is visible when true
 * @param {string} props.variant - variant of the Drawer, one of 'permanent', 'persistent', 'temporary'
 * @param {func} [props.onClose] - called when the Drawer is closing
 */
interface Props extends Pick<DrawerProps, 'anchor' | 'className' | 'open' | 'variant' | 'onClose'> {
  items: Array<LinkToPage>;
}
const SideBar: React.FC<Props> = ({ anchor, className, open, variant, items, onClose, ...restOfProps }) => {
  const [state, dispatch] = useAppStore();
  const classes = useStyles();

  const history = useHistory();

  const handleSwitchDarkMode = useCallback(() => {
    dispatch({
      type: 'DARK_MODE',
      darkMode: !state.darkMode,
      payload: !state.darkMode,
    });
  }, [state, dispatch]);

  const handleOnLogout = useCallback(async () => {
    // await api.auth.logout();
    dispatch({ type: 'LOG_OUT' });
    history.push('/');
  }, [dispatch, history]);

  const handleAfterLinkClick = useCallback(
    (event: React.MouseEvent) => {
      if (variant === 'temporary' && typeof onClose === 'function') {
        onClose(event, 'backdropClick');
      }
    },
    [variant, onClose]
  );

  const drawerClasses = {
    // See: https://material-ui.com/api/drawer/#css
    paper: classes.paperInDrawer,
  };
  const classRoot = clsx(classes.root, className);

  return (
    <Drawer anchor={anchor} classes={drawerClasses} open={open} variant={variant} onClose={onClose}>
      <div className={classRoot} {...restOfProps}>
        {state.isAuthenticated && state?.currentUser && (
          <>
            <UserInfo className={classes.profile} user={state.currentUser} school={state.currentSchool} showAvatar />
            {state.currentUser?.schools.length > 0 && state.currentSchool && <SchoolRoleSelector />}
            <Divider />
          </>
        )}

        <SideBarNavigation className={classes.nav} items={items} showIcons afterLinkClick={handleAfterLinkClick} />
        <Divider />

        <div className={classes.buttons}>
          <Tooltip title={state.darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>
            <FormControlLabel
              label={!state.darkMode ? 'Modo Claro' : 'Modo Escuro'}
              control={<Switch checked={state.darkMode} onChange={handleSwitchDarkMode} />}
            />
          </Tooltip>

          {state.isAuthenticated && <AppIconButton icon="logout" title="Sair do Sistema" onClick={handleOnLogout} />}
        </div>
      </div>
    </Drawer>
  );
};

export default SideBar;
