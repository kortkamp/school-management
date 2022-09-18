/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Card, CardContent, CardHeader, Divider, Paper, Tab, Tabs, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { AppAddButton } from '../../components/AppCustomButton';
import CourseView, { FormValues } from './CourseView';

const useStyles = makeStyles((theme: Theme) => ({
  root: { padding: '0px' },
}));

const CoursesListView = () => {
  const classes = useStyles();

  const [coursesList, setCoursesList] = useState<Partial<FormValues>[]>([]);

  const [courseIndex, setCourseIndex] = useState<number>(0);

  const selectPreviousIndex = () => {
    if (courseIndex > 0) {
      setCourseIndex(courseIndex - 1);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    setCourseIndex(index);
  };

  const handleAddNewCourse = () => {
    const newCoursesList = coursesList.concat([{ id: String(coursesList.length) }]);
    setCoursesList(newCoursesList);
    setCourseIndex(newCoursesList.length - 1);
  };

  const handleUpdateCourse = (data: FormValues) => {
    const newCoursesList = coursesList.map((course) => {
      if (course.id === data.id) {
        return data;
      }
      return course;
    });
    setCoursesList(newCoursesList);
  };

  const handleRemoveCourse = (data: FormValues) => {
    const newCoursesList = coursesList.filter((course) => course.id !== data.id);
    setCoursesList(newCoursesList);
    selectPreviousIndex();
  };

  return (
    <Card className={classes.root}>
      <CardHeader style={{ textAlign: 'center' }} title="Cursos" subheader="Lista de cursos da instituição" />
      <CardContent component={Paper}>
        <Box display={'flex'} flexDirection="row" justifyContent="space-between">
          <Tabs value={courseIndex} onChange={handleChangeTab}>
            {coursesList.map((routineGroup, index) => (
              <Tab key={index} label={routineGroup?.name || 'Novo Curso'} />
            ))}
          </Tabs>

          <AppAddButton style={{ marginRight: 6 }} color="info" label="Novo Curso" onClick={handleAddNewCourse} />
        </Box>
        <Divider />
        {coursesList.length > 0 && (
          <CourseView
            key={courseIndex + ' ' + coursesList.length}
            data={{ ...coursesList[courseIndex] }}
            onSave={handleUpdateCourse}
            onRemove={handleRemoveCourse}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesListView;
