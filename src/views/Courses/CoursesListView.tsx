/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Card, CardContent, CardHeader, Divider, Paper, Tab, Tabs, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { useApi } from '../../api/useApi';
import { AppLoading } from '../../components';
import { AppAddButton } from '../../components/AppCustomButton';
import AppError from '../../components/AppError';
import { coursesService, ICourse } from '../../services/courses.service';
import CourseView, { FormValues } from './CourseView';

const useStyles = makeStyles((theme: Theme) => ({
  root: { padding: '0px' },
}));

interface Props {
  onSuccess?: () => void;
}

const CoursesListView = ({ onSuccess }: Props) => {
  const classes = useStyles();

  const [coursesList, error, loading, , setCoursesList] = useApi(coursesService.getAll, { defaultValue: [] });

  const [courseIndex, setCourseIndex] = useState<number>(0);

  const [isCreatingNewCourse, setIsCreatingNewCourse] = useState(false);

  const selectPreviousIndex = () => {
    setCourseIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    setCourseIndex(index);
  };

  const handleAddNewCourse = () => {
    setIsCreatingNewCourse(true);
    const newCoursesList = coursesList.concat([{} as ICourse]);
    setCoursesList(newCoursesList);
    setCourseIndex(newCoursesList.length - 1);
  };

  const handleUpdateCourse = (courseId: string | undefined, data: FormValues) => {
    const sanitizedData = {
      ...data,
      grades: data.grades.map(({ id, days, name, total_hours, class_groups }) => ({
        id,
        days,
        name,
        total_hours,
        class_groups,
      })),
    };

    const newCoursesList = coursesList.map((course) => {
      if (course.id === courseId) {
        return sanitizedData as ICourse;
      }
      return course;
    });
    setIsCreatingNewCourse(false);
    setCoursesList(newCoursesList);
  };

  const handleRemoveCourse = (id: string | undefined) => {
    const newCoursesList = coursesList.filter((course) => course.id !== id);
    selectPreviousIndex();
    setCoursesList(newCoursesList);
  };

  if (loading) {
    return <AppLoading />;
  }

  if (error) {
    return <AppError>{error}</AppError>;
  }

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

          <AppAddButton
            style={{ marginRight: 6 }}
            color="info"
            label="Novo Curso"
            onClick={handleAddNewCourse}
            disabled={isCreatingNewCourse}
          />
        </Box>
        <Divider />
        {coursesList.length > 0 && (
          <CourseView
            key={courseIndex + ' ' + coursesList.length}
            data={{ ...coursesList[courseIndex] }}
            onSave={handleUpdateCourse}
            onRemove={handleRemoveCourse}
            onSuccess={onSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesListView;
