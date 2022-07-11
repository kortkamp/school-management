import { Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import { AppButton, AppLink } from '../../components';
import OpenExams from '../../components/OpenExams';
import WeekRoutines from '../../components/WeekRoutines';
import { ITableCell } from '../../components/WeekRoutines/WeekRoutines';
import { useAppStore } from '../../store';

const cellTable: ITableCell = ({ subject, classGroup, data }) => {
  return (
    <Grid container direction={'column'}>
      <span>{classGroup}</span>
      <span>{subject}</span>
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={8}>
        <Card>
          <CardHeader title="Minha semana" subheader="Horários da semana" />
          <CardContent>
            <WeekRoutines Cell={cellTable} type={routinesTableType} userId={state.currentUser?.id as string} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Card>
          <CardHeader title="Avaliações" subheader="Próximas avaliações" />
          <CardContent>
            <OpenExams />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeView;
