import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';

/**
 * Note: You can change these const to control default appearance of the AppAlert component
 */

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

interface Props {
  children: ReactNode;
}

/**
 *
 */
const AppViewActions: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} item md={12} xs={12}>
      {children}
    </Grid>
  );
};

export default AppViewActions;
