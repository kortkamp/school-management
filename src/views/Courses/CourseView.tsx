/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, MenuItem } from '@mui/material';
import AppContextMenu from '../../components/AppContextMenu';
import { useForm } from 'react-hook-form';
import { AppSaveButton } from '../../components/AppCustomButton';
import { AppButton } from '../../components';
import { FormOutlinedInput, FormTitleInput } from '../../components/HookFormInput';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApi } from '../../api/useApi';
import { segmentsService } from '../../services/segments.service';

const schema = yup
  .object({
    name: yup.string().required('Campo obrigatório'),
    type: yup.string().required('Campo obrigatório'),
    total_hours: yup.number().positive().integer().required(),
    phases: yup.number().positive().integer().required(),
  })
  .required();

const CourseView = () => {
  const [isEditing, setIsEditing] = useState(true);

  const [segments] = useApi(segmentsService.getAll, {}, { defaultValue: [] });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      total_hours: '',
      phases: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container style={{}}>
        <Grid item md={12}>
          <Box display={'flex'} justifyContent="space-between" alignItems={'center'} padding={2}>
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
                  label: 'Excluir o Curso',
                  action: () => console.log('excluir'),
                },
                {
                  label: 'Editar os dados',
                  action: () => setIsEditing(true),
                },
              ]}
            />
          </Box>
          <Box display={'flex'} justifyContent="space-between" alignItems={'center'} padding={2}>
            <FormOutlinedInput
              name={'total_hours'}
              label={'Carga Horária'}
              type="number"
              control={control}
              editable={isEditing}
              errorMessage={errors.total_hours?.message}
              suffix={'horas'}
            />
            <FormOutlinedInput
              name={'phases'}
              label={'Número de Etapas'}
              type="number"
              control={control}
              editable={isEditing}
              errorMessage={errors.phases?.message}
            />
            <FormOutlinedInput
              name={'type'}
              label={'Segmento'}
              select
              control={control}
              editable={isEditing}
              errorMessage={errors.type?.message}
            >
              {/* {segments.map((segment) => (
                <MenuItem key={segment} value={segment}>
                  {segment}
                </MenuItem>
              ))} */}
            </FormOutlinedInput>
          </Box>
        </Grid>
        <Grid item md={12} display={'flex'} justifyContent="space-between" alignItems={'center'} style={{ padding: 7 }}>
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
