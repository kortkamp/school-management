/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, MenuItem, Theme } from '@mui/material';
import AppContextMenu from '../../components/AppContextMenu';
import { useForm, useFieldArray } from 'react-hook-form';
import { AppSaveButton } from '../../components/AppCustomButton';
import { AppButton } from '../../components';
import { FormOutlinedInput, FormTitleInput } from '../../components/HookFormInput';
import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApi, useRequestApi } from '../../api/useApi';
import { ISegment, segmentsService } from '../../services/segments.service';
import { makeStyles } from '@mui/styles';
import GradesTable from './components/GradesTable';
import { coursesService } from '../../services/courses.service';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  course_params: {
    padding: theme.spacing(1),
  },
}));

export interface FormValues {
  id?: string;
  name: string;
  segment_id: string;
  total_hours: number | '';
  phase_name: string;
  phases_number: number | '';
  grades: {
    id: string;
    name: string;
    total_hours: number;
    days: number;
    class_groups?: {
      id: string;
      name: string;
    }[];
  }[];
}

// interface PropsData extends Partial<FormValues> {
//   id?: string;
// }

interface Props {
  data: FormValues;
  onSave?: (id: string | undefined, values: FormValues) => void;
  onRemove?: (id: string | undefined) => void;
  onSuccess?: () => void;
}

const defaultValues: FormValues = {
  name: '',
  segment_id: '',
  total_hours: '',
  phase_name: '',
  phases_number: '' as number | '',
  grades: [],
};

const schema = yup
  .object({
    name: yup.string().required('Campo obrigatório'),
    segment_id: yup.string().required('Campo obrigatório'),
    total_hours: yup
      .number()
      .typeError('Valor inválido')
      .positive('O valor precisa ser positivo')
      .integer('O valor precisa ser inteiro')
      .required('Campo obrigatório'),
    phase_name: yup.string().required('Campo obrigatório'),
    phases_number: yup
      .number()
      .typeError('Valor inválido')
      .positive('O valor precisa ser positivo')
      .integer('O valor precisa ser inteiro')
      .required('Campo obrigatório'),
    grades: yup.array().of(
      yup.object().shape({
        name: yup.string().required('É necessário um nome para a fase'),
        days: yup
          .number()
          .typeError('Valor inválido')
          .positive('O valor precisa ser positivo')
          .integer('O valor precisa ser inteiro')
          .required('Campo obrigatório'),
        total_hours: yup
          .number()
          .typeError('Valor inválido')
          .positive('O valor precisa ser positivo')
          .integer('O valor precisa ser inteiro')
          .required('Campo obrigatório'),
      })
    ),
  })
  .required();

const CourseView = ({ data: { id, ...courseData }, onSave = () => {}, onRemove = () => {}, onSuccess }: Props) => {
  const isCreatingNewCourse = !id;

  const classes = useStyles();

  const [createCourse, saving] = useRequestApi(coursesService.create);
  const [updateCourse, updating] = useRequestApi(coursesService.update);
  const [removeCourse, removing] = useRequestApi(coursesService.remove);
  const [segments, , loadingSegments] = useApi(segmentsService.getAll, { defaultValue: [] });

  const [isEditing, setIsEditing] = useState(isCreatingNewCourse);

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    getValues,

    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: Object.assign({}, defaultValues, courseData),
    resolver: yupResolver(schema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'grades',
  });

  const onSubmit = async (formData: FormValues) => {
    let response: any;
    if (isCreatingNewCourse) {
      // const createGradesData = formData.grades.map(({ name, days, total_hours }) => ({ name, days, total_hours }));
      response = await createCourse(formData);
    } else {
      response = await updateCourse({ data: formData, id });
    }
    if (response?.success) {
      onSave(id, response.course);
      setIsEditing(false);
      toast.success('Curso salvo com sucesso');
    }
  };

  const handleRemoveCourse = useCallback(async () => {
    if (!window.confirm('Deseja excluir o Curso ?')) {
      return;
    }
    if (!id) {
      // is removing a not saved course
      onRemove(id);
      return;
    }
    const response = await removeCourse({ id });
    if (response?.success) {
      onRemove(id);
    }
  }, [id]);

  const generateGrades = (phases_number: number, starting_phase: number, phase_name: string, total_hours: number) => {
    remove();
    for (let i = 0; i < phases_number; i++) {
      append({
        id: uuid(),
        name: `${i + starting_phase}º ${phase_name}`,
        total_hours: Math.floor(total_hours / phases_number),
        days: 200,
        class_groups: [],
      });
    }
  };

  const handleClickGenerateGrades = useCallback(() => {
    const values = getValues();
    const segment = segments.find((s) => s.id === values.segment_id);
    if (segment) {
      generateGrades(
        values.phases_number || 0,
        segment.starting_phase || 1,
        values.phase_name,
        values.total_hours || 0
      );
    }
  }, [segments, getValues]);

  const handleSelectSegment = useCallback(
    (segment_id: string) => {
      const segment = segments.find((s) => s.id === segment_id);
      if (segment) {
        const values = getValues();
        const segmentsNames = segments.map((s) => s.name);
        if (segmentsNames.includes(values.name) || values.name === '') {
          setValue('name', segment.name || '');
        }
        setValue('phases_number', segment.phases_number || '');
        setValue('phase_name', segment.phase_name || '');
        setValue('total_hours', segment.phases_number * 1000 || '');
        generateGrades(segment.phases_number, segment.starting_phase, segment.phase_name, 1000 * segment.phases_number);
      }
    },
    [segments]
  );

  const handleAddGrade = () => {
    const course = getValues();
    const newGradesNumber = course.grades.length + 1;
    const gradeHours = Math.floor((course.total_hours || 0) / (course.phases_number || 1));
    const newTotalGradesHours = Number(course.total_hours || 0) + gradeHours;
    append({
      id: uuid(),
      name: `${newGradesNumber}º ${course.phase_name}`,
      total_hours: gradeHours,
      days: 200,
      class_groups: [],
    });
    setValue('phases_number', newGradesNumber);
    setValue('total_hours', newTotalGradesHours);
  };

  const handleRemoveGrade = (index: number) => {
    const course = getValues();
    const newGradesNumber = course.grades.length - 1;
    const newTotalGradesHours =
      course.grades.reduce((total, grade) => total + grade.total_hours, 0) - course.grades[index].total_hours;

    remove(index);
    setValue('phases_number', newGradesNumber);
    setValue('total_hours', newTotalGradesHours);
  };

  const handleAddClassGroup = (gradeIndex: number) => {
    const classNamePrefix = (segment: ISegment | undefined, index: number) => {
      switch (segment?.name) {
        case 'Médio':
          return (segment?.starting_phase + gradeIndex) * 1000;
        case 'Outro':
          return ((segment?.starting_phase || 1) + gradeIndex) * 10;
        default:
          return ((segment?.starting_phase || 1) + gradeIndex) * 100;
      }
    };
    const course = getValues();
    const segment = segments.find((s) => s.id === course.segment_id);
    const namePrefix = classNamePrefix(segment, gradeIndex);

    const classIndex = (course.grades[gradeIndex].class_groups?.length || 0) + 1;

    const classGroupName = `${namePrefix + classIndex}`;

    const updatedClassGroups = course.grades[gradeIndex].class_groups
      ? course.grades[gradeIndex].class_groups?.concat([{ id: uuid(), name: classGroupName }])
      : [{ id: uuid(), name: classGroupName }];
    update(gradeIndex, { ...course.grades[gradeIndex], class_groups: updatedClassGroups });
  };

  const handleRemoveClassGroup = (gradeIndex: number, classGroupIndex: number) => {
    const { grades } = getValues();

    const updatedClassGroups = grades[gradeIndex].class_groups?.filter((_, index) => index !== classGroupIndex);
    update(gradeIndex, { ...grades[gradeIndex], class_groups: updatedClassGroups });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item md={12}>
          <Box className={classes.header}>
            <FormTitleInput
              name={'name'}
              placeholder="Nome do Curso"
              control={control}
              editable={isEditing}
              errorMessage={errors.name?.message}
            />
            <AppContextMenu
              loading={removing}
              options={[
                {
                  label: isEditing ? 'Encerrar Edição' : 'Editar os dados',
                  action: () => setIsEditing((prev) => !prev),
                },
                {
                  label: 'Gerar as Fases',
                  action: () => handleClickGenerateGrades(),
                },
                {
                  label: 'Excluir o Curso',
                  action: () => handleRemoveCourse(),
                },
              ]}
            />
          </Box>
          <Grid container spacing={2} className={classes.course_params}>
            <Grid item md={3} sm={12} xs={12}>
              <FormOutlinedInput
                name={'segment_id'}
                label={'Etapa'}
                select
                control={control}
                editable={isEditing}
                errorMessage={errors.segment_id?.message}
                fullWidth
                loading={loadingSegments}
                customOnChange={(e) => handleSelectSegment(e.target.value)}
              >
                {segments.map((segment) => (
                  <MenuItem key={segment.id} value={loadingSegments ? '' : segment.id}>
                    {segment.name}
                  </MenuItem>
                ))}
              </FormOutlinedInput>
            </Grid>

            <Grid item md={3} sm={12} xs={12}>
              <FormOutlinedInput
                name={'total_hours'}
                label={'Carga Horária Total'}
                type="number"
                control={control}
                editable={isEditing}
                errorMessage={errors.total_hours?.message}
                suffix={'horas'}
                fullWidth
              />
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormOutlinedInput
                name={'phase_name'}
                label={'Nome das fases'}
                control={control}
                editable={isEditing}
                errorMessage={errors.phase_name?.message}
                toolTipMessage="Ex: ano, semestre, período"
                fullWidth
              />
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormOutlinedInput
                name={'phases_number'}
                label={'Quantidade de fases'}
                type="number"
                control={control}
                editable={isEditing}
                errorMessage={errors.phases_number?.message}
                toolTipMessage="Quantidade de divisões do curso. Ex: 3 anos"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid>
            <GradesTable
              grades={fields}
              control={control}
              editable={isEditing}
              handleAddGrade={handleAddGrade}
              handleRemoveGrade={handleRemoveGrade}
              handleAddClassGroup={handleAddClassGroup}
              handleRemoveClassGroup={handleRemoveClassGroup}
              errors={errors.grades}
            />
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
          display={'flex'}
          justifyContent="space-between"
          alignItems={'center'}
          style={{ padding: 7 }}
        >
          <AppSaveButton
            type="submit"
            loading={saving || updating}
            disabled={saving || updating || !isDirty}
            label={isCreatingNewCourse ? 'Criar' : 'Salvar'}
          />
          {isCreatingNewCourse && (
            <AppButton color="warning" onClick={() => reset()}>
              Limpar
            </AppButton>
          )}
          {onSuccess && (
            <AppButton color="info" onClick={() => onSuccess()}>
              Finalizar
            </AppButton>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default CourseView;
