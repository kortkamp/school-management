import { Box, Grid, Paper, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { ReactNode } from 'react';
import { Control } from 'react-hook-form';
import AppContextMenu from '../AppContextMenu';
import { Props as ContextMenuProps } from '../AppContextMenu/AppContextMenu';
import AppError from '../AppError';
// import AppLink from '../AppLink';
import { AppLoading } from '../AppLoading';
import { FormTitleInput } from '../HookFormInput';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
  navigation: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    padding: theme.spacing(0, 1),
  },
  contextMenu: {
    // paddingTop: theme.spacing(0.7),
    marginRight: theme.spacing(-2),
  },
  dataArea: {
    padding: theme.spacing(1),
  },
}));

interface Props {
  editable?: boolean;
  contextMenuItens?: ContextMenuProps['options'];
  contextMenuLoading?: boolean;
  control?: Control<any, any>;
  titleFieldKey?: string;
  title: string;
  dataFieldsKeys?: string[];
  formErrors?: any;
  loading?: boolean;
  error?: string;
  children?: ReactNode;
}

/**
 * Application default Form
 * must be used with ReactHookForms
 */
const AppView: React.FC<Props> = ({
  contextMenuItens = [],
  contextMenuLoading = false,
  editable = false,
  control,
  formErrors,
  titleFieldKey,
  title,
  loading,
  error,
  children,
}) => {
  const classes = useStyles();
  // const classRoot = clsx(classes.root, className);

  if (loading) {
    return <AppLoading />;
  }

  if (error) {
    return <AppError>{error}</AppError>;
  }

  return (
    <>
      {/* <Box className={classes.navigation}>
        <AppLink color="primary">{'/MUI textPrimary'}</AppLink>
        <AppLink color="primary">{'/MUI textPrimary'}</AppLink>
      </Box> */}
      <Box component={Paper} className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h6" color="textPrimary">
            {title}
          </Typography>

          <AppContextMenu className={classes.contextMenu} loading={contextMenuLoading} options={contextMenuItens} />
        </Box>
        <Grid container spacing={2} className={classes.dataArea}>
          <Grid item md={3} sm={12} xs={12}>
            {titleFieldKey && (
              <FormTitleInput
                name={titleFieldKey}
                placeholder="Nome"
                control={control}
                editable={editable}
                errorMessage={formErrors.name?.message}
              />
            )}
          </Grid>
        </Grid>
        {children}
      </Box>
    </>
  );
};

export default AppView;
