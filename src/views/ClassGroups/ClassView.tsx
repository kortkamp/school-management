import { useParams } from 'react-router';
import { useApi, useRequestApi } from '../../api/useApi';
import { useForm } from 'react-hook-form';

import AppView, { AppViewActions, AppViewData, AppViewParams } from '../../components/AppView';
import { classGroupsService } from '../../services/classGroups.service';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppSaveButton } from '../../components/AppCustomButton';
import { useCallback, useEffect, useState } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { FormOutlinedInput } from '../../components/HookFormInput';
import { coursesService, ICourse } from '../../services/courses.service';
import { routinesService } from '../../services/routines.service';
import StudentsTable from './components/StudentsTable';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { routePaths } from '../../routes/RoutePaths';

const schema = yup
  .object({
    name: yup.string().required('Campo obrigatório'),
    courseId: yup.string().required('Campo obrigatório'),
    gradeId: yup.string().required('Campo obrigatório'),
    routineGroupId: yup.string().required('Campo obrigatório'),
  })
  .required();

interface FormValues {
  id: string;
  name: string;
  courseId: string;
  gradeId: string;
  routineGroupId: string;
  students: any[];
  teachers: any[];
}

const defaultValues: FormValues = {
  id: '',
  name: '',
  courseId: '',
  gradeId: '',
  routineGroupId: '',
  students: [],
  teachers: [],
};

/**
 * Renders "ClassGroups" view
 * url: /turmas/*
 */
const ClassView = () => {
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const [isEditing, setIsEditing] = useState(false);

  const [classGroup, classGroupError, loadingClassGroup] = useApi(classGroupsService.getById, { args: { id } });

  const [courses, coursesError, loadingCourses] = useApi(coursesService.getAll, { defaultValue: [] });

  const [routineGroups, routineGroupsError, loadingRoutineGroups] = useApi(routinesService.getAllRoutineGroups, {
    defaultValue: [],
  });

  const [updateClassGroup, updatingClassGroup] = useRequestApi(classGroupsService.update);

  const [grades, setGrades] = useState<ICourse['grades']>([]);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    // getValues,

    formState: { errors, isDirty },
  } = useForm({
    defaultValues: Object.assign({}, defaultValues),
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (classGroup) {
      const values: FormValues = {
        id: classGroup.id,
        name: classGroup.name,
        gradeId: classGroup.grade?.id || '',
        courseId: classGroup.grade?.course.id || '',
        routineGroupId: classGroup.routineGroup?.id || '',
        students: classGroup.students,
        teachers: classGroup.teachers,
      };
      reset(values);
    }
  }, [classGroup]);

  useEffect(() => {
    if (classGroup || courses.length > 0) {
      const course = courses.find((c) => c.id === classGroup?.grade?.course.id);

      if (!course) return;

      setGrades(course.grades);
    }
  }, [classGroup, courses]);

  const onSubmit = async (formData: FormValues) => {
    const { name, courseId, gradeId } = formData;

    const updateResponse = await updateClassGroup({
      id,
      data: { name, course_id: courseId, grade_id: gradeId },
    });

    if (updateResponse?.success) {
      toast.success('Dados da turma salvos com sucesso');
      history.push(routePaths.classGroups.path);
    }
  };

  const handleSelectCourse = useCallback((event: any) => {
    const course = courses.find((c) => c.id === event.target.value);

    setValue('gradeId', '');

    if (!course) return;

    setGrades(course.grades);
  }, []);

  const isLoading = loadingClassGroup || loadingCourses || loadingRoutineGroups;

  const error = classGroupError || coursesError || routineGroupsError;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppView
        dataFieldsKeys={[]}
        titleFieldKey="name"
        title="Turma"
        loading={isLoading}
        error={error}
        formErrors={errors}
        control={control}
        editable={isEditing}
        contextMenuItens={[
          {
            label: isEditing ? 'Encerrar Edição' : 'Editar os dados',
            action: () => setIsEditing((prev) => !prev),
          },
        ]}
      >
        <AppViewParams>
          <Grid item md={4} sm={12} xs={12}>
            <FormOutlinedInput
              name={'courseId'}
              label={'Curso'}
              select
              control={control}
              editable={isEditing}
              errorMessage={errors.courseId?.message}
              fullWidth
              customOnChange={handleSelectCourse}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </FormOutlinedInput>
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <FormOutlinedInput
              name={'gradeId'}
              label={'Fase'}
              select
              control={control}
              editable={isEditing}
              errorMessage={errors.courseId?.message}
              fullWidth
            >
              {grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              ))}
            </FormOutlinedInput>
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
            <FormOutlinedInput
              name={'routineGroupId'}
              label={'Turno'}
              select
              control={control}
              editable={isEditing}
              errorMessage={errors.courseId?.message}
              fullWidth
            >
              {routineGroups.map((routineGroup) => (
                <MenuItem key={routineGroup.id} value={routineGroup.id}>
                  {routineGroup.name}
                </MenuItem>
              ))}
            </FormOutlinedInput>
          </Grid>
        </AppViewParams>

        <AppViewData title="Alunos:">
          <StudentsTable students={watch('students')} />
        </AppViewData>

        <AppViewActions>
          <AppSaveButton type="submit" loading={updatingClassGroup} disabled={!isDirty || updatingClassGroup} />
        </AppViewActions>
      </AppView>
    </form>
  );
};

export default ClassView;
