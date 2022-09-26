import { Grid } from '@mui/material';

/**
 * Renders "Home" view
 * url: / *
 */
const HomeView = () => {
  // const [state] = useAppStore();

  // const routinesTableType = state.currentSchool?.role as string;

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} sm={12} md={8}>
        <Card>
          <CardHeader title="Minha semana" subheader="Horários da semana" />
          <CardContent>
            <WeekRoutines Cell={cellTable} type={routinesTableType} userId={state.currentUser?.id as string} />
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
};

export default HomeView;
