import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';

/**
 * Note: You can change these const to control default appearance of the AppAlert component
 */

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

interface Props {
  children: ReactNode;
}

/**
 *
 */
const AppViewParams: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  // const classRoot = clsx(classes.root, className);

  return (
    <Grid container spacing={2} className={classes.root}>
      {children}
    </Grid>
  );
};

export default AppViewParams;
