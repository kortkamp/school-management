/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

import { FormControlLabel, Grid, MenuItem, Radio } from '@mui/material';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppView, { AppViewActions, AppViewData, AppViewParams } from '../../components/AppView';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import { useApi, useRequestApi } from '../../api/useApi';
import { coursesService } from '../../services/courses.service';
import { AppSaveButton } from '../../components/AppCustomButton';
import FormRadioInput from '../../components/HookFormInput/FormRadioInput';
import { routinesService } from '../../services/routines.service';
import { useEffect, useState } from 'react';
import { classGroupsService } from '../../services/classGroups.service';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('O campo é obrigatório'),
  routine_group_id: yup.string().required('O campo é obrigatório'),
});

interface FormValues {
  name: string;
  course_id: string;
  grade_id: string;
  routine_group_id: string;
}

const defaultValues: FormValues = {
  name: '',
  course_id: '',
  grade_id: '',
  routine_group_id: '',
};

/**
 * Renders "Create ClassGroup" view
 * url: /turmas/criar
 */
function CreateClassView() {
  const history = useHistory();
  const [coursesData, loadingError, loadingCourses] = useApi(coursesService.getAll, { defaultValue: [] });

  const [grades, setGrades] = useState<typeof coursesData[number]['grades']>([]);

  const [routineGroupsData, loadingRoutineError, loadingRoutines] = useApi(routinesService.getAllRoutineGroups, {
    defaultValue: [],
  });

  const [createClassGroup, saving] = useRequestApi(classGroupsService.create);

  const {
    handleSubmit,
    control,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const course_id = watch('course_id');
    const selectedCourse = coursesData.find((course) => course.id === course_id);
    setGrades(selectedCourse?.grades || []);
  }, [watch('course_id')]);

  const onSubmit = async (formData: FormValues) => {
    const response = await createClassGroup(formData);

    if (response.success) {
      toast.success('Turma criada com sucesso');
      history.goBack();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AppView title="Turma" loading={loadingCourses || loadingRoutines} error={loadingError || loadingRoutineError}>
        <AppViewParams>
          <Grid item md={4} sm={12} xs={12}>
            <FormStandardInput
              name={'name'}
              label={'Nome da Turma'}
              control={control}
              editable={true}
              errorMessage={errors.name?.message}
              fullWidth
            ></FormStandardInput>
          </Grid>
        </AppViewParams>
        <AppViewData>
          <Grid container spacing={10}>
            <Grid item md={6} sm={12} xs={12}>
              <FormStandardInput
                name={'course_id'}
                label={'Curso'}
                select
                control={control}
                editable={true}
                errorMessage={errors.course_id?.message}
                fullWidth
              >
                {coursesData?.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </FormStandardInput>

              <FormStandardInput
                name={'grade_id'}
                label={'Fase'}
                select
                control={control}
                editable={true}
                errorMessage={errors.grade_id?.message}
                fullWidth
              >
                {grades?.map((grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
              </FormStandardInput>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <FormRadioInput
                control={control}
                name="routine_group_id"
                label="Turno"
                errorMessage={errors.routine_group_id?.message}
              >
                {routineGroupsData.map((routineGroup) => (
                  <FormControlLabel
                    key={routineGroup.id}
                    value={routineGroup.id}
                    control={<Radio />}
                    label={routineGroup.name}
                  />
                ))}
              </FormRadioInput>
            </Grid>
          </Grid>
        </AppViewData>
        <AppViewActions>
          <AppSaveButton type="submit" loading={saving} disabled={saving} />
        </AppViewActions>
      </AppView>
    </form>
  );
}

export default CreateClassView;
