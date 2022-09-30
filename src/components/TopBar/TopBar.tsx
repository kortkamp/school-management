/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import { Theme, AppBar, Toolbar, Typography, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AppIconButton from '../AppIconButton';
import { SIDEBAR_WIDTH } from '../../routes/Layout/PrivateLayout';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // boxShadow: 'none', // Uncomment to hide shadow
    minWidth: '20rem',
    // backgroundColor: theme.palette.primary.main, // Uncomment if you also need colored background in dark mode
  },
  toolbar: {
    // paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    // height: theme.spacing(5),
    // padding: theme.spacing(1, 3),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.contrastText,
    paddingLeft: theme.spacing(3),

    // color: theme.palette.button,
    textDecoration: 'none',
    justifyContent: 'flex-start',
    letterSpacing: 0,
    width: '100%',
    // fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    paddingBottom: 6,
  },
  title: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    // flexGrow: 1,
    // textAlign: 'center',
    // whiteSpace: 'nowrap',
    marginLeft: 48,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  buttons: {},
  menu: {
    color: theme.palette.primary.contrastText,

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

/**
 * Renders TopBar composition
 */
interface Props {
  className?: string;
  title?: string;
  isAuthenticated?: boolean;
  isMenuOpen?: boolean;
  onMenu?: () => void;
  onNotifications?: () => void;
}
const TopBar: React.FC<Props> = ({
  className,
  title = '',
  isAuthenticated,
  isMenuOpen,
  onMenu,
  onNotifications,
  ...restOfProps
}) => {
  const classes = useStyles();
  // const iconMenu = isAuthenticated ? 'account' : 'menu';

  return (
    <AppBar {...restOfProps} className={clsx(classes.root, className)} component="div">
      <Toolbar className={classes.toolbar} disableGutters variant="dense">
        <AppIconButton icon="menu" className={classes.menu} onClick={onMenu} />
        <AppLink className={classes.logo} to="/" style={{ width: SIDEBAR_WIDTH, textDecoration: 'none' }}>
          <div className={classes.icon}>
            <AppIcon name="logo" />
          </div>
          <Typography variant="h6">SMSystem</Typography>
        </AppLink>

        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>

        <div className={classes.buttons}>
          {isAuthenticated && (
            <AppIconButton icon="notifications" color="inherit" title="Notificações" onClick={onNotifications} />
          )}
          {/* <AppIconButton icon={iconMenu} color="inherit" title="Open Menu" onClick={onMenu} /> */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
