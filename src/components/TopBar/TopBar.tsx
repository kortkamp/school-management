import clsx from 'clsx';
import { Theme, AppBar, Toolbar, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AppIconButton from '../AppIconButton';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // boxShadow: 'none', // Uncomment to hide shadow
    minWidth: '20rem',
    // backgroundColor: theme.palette.primary.main, // Uncomment if you also need colored background in dark mode
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: theme.spacing(4),
  },
  title: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    // flexGrow: 1,
    // textAlign: 'center',
    // whiteSpace: 'nowrap',
  },
  buttons: { position: 'relative' },
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
      <Toolbar className={classes.toolbar} disableGutters>
        <div className={classes.logo} style={{ marginRight: isMenuOpen ? '240px' : '0' }}>
          <AppIconButton
            icon="logo"
            // color="primary"
            onClick={onMenu}
          />
        </div>

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
