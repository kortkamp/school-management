import { Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  titleContainer: {
    padding: theme.spacing(1),
  },
}));

interface Props {
  children: ReactNode;
  title?: string;
}

/**
 *
 */
const AppViewData: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant="h5">{title}</Typography>
      </div>
      {children}
    </Box>
  );
};

export default AppViewData;
