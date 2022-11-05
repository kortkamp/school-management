import { Grid, MenuItem, TextField, TextFieldProps } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../api/useApi';
import { AppLoading } from '../../components';
import { coursesService } from '../../services/courses.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

export interface IStudentAllocation {
  course_id: string;
  grade_id: string;
  class_group_id: string;
}

interface Props {
  values?: IStudentAllocation;
  onChange: (allocation: IStudentAllocation) => void;
  props?: TextFieldProps;
}

const StudentAllocation = ({ values, onChange, props }: Props) => {
  const [coursesData, , loadingCourses] = useApi(coursesService.getAll, { defaultValue: [] });

  const [grades, setGrades] = useState<typeof coursesData[number]['grades']>([]);
  const [classGroups, setClassGroups] = useState<typeof grades[number]['class_groups']>([]);

  const [courseId, setCourseId] = useState(values?.course_id || '');
  const [gradeId, setGradeId] = useState(values?.grade_id || '');
  const [classGroupId, setClassGroupId] = useState(values?.class_group_id || '');

  useEffect(() => {
    const selectedCourse = coursesData.find((course) => course.id === values?.course_id);
    setGrades(selectedCourse?.grades || []);
    const selectedGrade = selectedCourse?.grades.find((grade) => grade.id === values?.grade_id);
    setClassGroups(selectedGrade?.class_groups || []);
  }, [coursesData]);

  const handleChangeCourse = useCallback(
    (event: any) => {
      const id = event.target.value;
      const selectedCourse = coursesData.find((course) => course.id === id);
      setGrades(selectedCourse?.grades || []);
      setClassGroups([]);

      setCourseId(id);
      setGradeId('');
      setClassGroupId('');
      onChange({ course_id: id, grade_id: '', class_group_id: '' });
    },
    [coursesData]
  );

  const handleChangeGrade = useCallback(
    (event: any) => {
      const id = event.target.value;
      const selectedGrade = grades.find((grade) => grade.id === id);

      setClassGroups(selectedGrade?.class_groups || []);
      setGradeId(id);
      setClassGroupId('');
      onChange({ course_id: courseId, grade_id: id, class_group_id: '' });
    },
    [grades, courseId]
  );

  const handleClassGroupCourse = useCallback(
    (event: any) => {
      const id = event.target.value;
      setClassGroupId(id);
      onChange({ course_id: courseId, grade_id: gradeId, class_group_id: id });
    },
    [courseId, gradeId]
  );

  if (loadingCourses) {
    return <AppLoading />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          select
          label="Curso"
          name="course_id"
          value={courseId}
          onChange={handleChangeCourse}
          {...SHARED_CONTROL_PROPS}
          {...props}
        >
          {coursesData?.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          select
          label="Fase"
          name="grade_id"
          value={gradeId}
          onChange={handleChangeGrade}
          {...SHARED_CONTROL_PROPS}
          {...props}
        >
          {grades?.map((grade) => (
            <MenuItem key={grade.id} value={grade.id}>
              {grade.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          select
          label="Turma"
          name="class_group_id"
          value={classGroupId}
          onChange={handleClassGroupCourse}
          {...SHARED_CONTROL_PROPS}
          {...props}
        >
          {classGroups?.map((classGroup) => (
            <MenuItem key={classGroup.id} value={classGroup.id}>
              {classGroup.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default StudentAllocation;
