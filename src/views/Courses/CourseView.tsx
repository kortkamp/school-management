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
import { useApi } from '../../api/useApi';
import { ISegment, segmentsService } from '../../services/segments.service';
import { makeStyles } from '@mui/styles';
import GradesTable from './components/GradesTable';

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
  grades: { id: string; name: string; total_hours: number; days: number }[];
}

interface Props {
  data?: Partial<FormValues>;
  onSave?: (values: FormValues) => void;
  onRemove?: (values: FormValues) => void;
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
        name: yup.string().required('Name is required'),
      })
    ),
  })
  .required();

const CourseView = ({ data, onSave = () => {}, onRemove = () => {} }: Props) => {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(true);

  const [segments, , loadingSegments] = useApi(segmentsService.getAll, { defaultValue: [] });
  const {
    setValue,
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: Object.assign({}, defaultValues, data),
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'grades',
  });

  const onSubmit = (formData: FormValues) => {
    console.log(formData);
    onSave(formData);

    setIsEditing(false);
  };

  const generateGrades = (phases_number: number, starting_phase: number, phase_name: string, total_hours: number) => {
    remove();
    for (let i = 0; i < phases_number; i++) {
      append({
        id: `${i}`,
        name: `${i + starting_phase}º ${phase_name}`,
        total_hours: total_hours / phases_number,
        days: 200,
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
              loading={false}
              options={[
                {
                  label: 'Editar os dados',
                  action: () => setIsEditing(true),
                },
                {
                  label: 'Gerar as Fases',
                  action: () => handleClickGenerateGrades(),
                },
                {
                  label: 'Excluir o Curso',
                  action: () => onRemove(getValues()),
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
            <GradesTable grades={fields} control={control} editable={isEditing} />
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
          <AppSaveButton type="submit" />
          <AppButton color="warning" onClick={() => reset()}>
            Limpar
          </AppButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default CourseView;
