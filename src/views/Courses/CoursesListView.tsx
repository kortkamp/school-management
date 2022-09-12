import { Box, Card, CardContent, CardHeader, Divider, Paper, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { AppAddButton } from '../../components/AppCustomButton';
import CourseView from './CourseView';

const CoursesListView = () => {
  const [routineGroupsTabIndex, setRoutineGroupsTabIndex] = useState<number>(0);

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    setRoutineGroupsTabIndex(index);
  };

  return (
    <Card style={{ padding: '20px' }}>
      <CardHeader style={{ textAlign: 'center' }} title="Cursos" subheader="Lista de cursos da instituição" />
      <CardContent>
        <Box component={Paper} sx={{ minWidth: 350 }}>
          <Box display={'flex'} flexDirection="row" justifyContent="space-between">
            <Tabs value={routineGroupsTabIndex} onChange={handleChangeTab}>
              {[{ id: 1, name: 'teste' }].map((routineGroup) => (
                <Tab key={routineGroup.id} label={routineGroup.name || 'Novo Curso'} />
              ))}
            </Tabs>

            <AppAddButton style={{ marginRight: 6 }} color="info" label="Novo Curso" />
          </Box>
          <Divider />

          <CourseView />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoursesListView;
