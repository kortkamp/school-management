import { Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import { AppButton, AppLink } from '../../components';
import WeekRoutines from '../../components/WeekRoutines';
import { ITableCell } from '../../components/WeekRoutines/WeekRoutines';
import { useAppStore } from '../../store';

const cellTable: ITableCell = ({ value, data }) => {
  return (
    <Grid>
      <span>{value}</span>
    </Grid>
  );
};

/**
 * Renders "Home" view
 * url: / *
 */
const HomeView = () => {
  const [state] = useAppStore();

  const routinesTableType = state.currentUser?.role as string;

  const routinesTableId = (
    state.currentUser?.role === 'student' ? state.currentUser.class_group_id : state.currentUser?.id
  ) as string;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6}>
        <Card>
          <CardHeader title="Minha semana" subheader="Horários da semana" />
          <CardContent>
            <WeekRoutines Cell={cellTable} type={routinesTableType} id={routinesTableId} />
          </CardContent>
          <CardActions>
            <AppLink to="/">
              <AppButton color="primary">OK</AppButton>
            </AppLink>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeView;
