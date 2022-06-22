import { CircularProgress, Grid } from '@mui/material';

export const AppLoading = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', minWidth: '100%' }}
    >
      <Grid item xs={3}>
        <CircularProgress />
        {/* <h1>Carregando...</h1> */}
      </Grid>
    </Grid>
  );
};
