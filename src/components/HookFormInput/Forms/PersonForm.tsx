import { Grid, MenuItem } from '@mui/material';
import { Control, FieldErrorsImpl } from 'react-hook-form';
import FormNumberFormat from '../FormNumberFormat';
import FormStandardInput from '../FormStandardInput';

import * as yup from 'yup';

export interface PersonFormValues {
  id?: string;
  name: string;
  cpf: string;
  rg: string;
  sex: string;
  birth: Date | string;
}

interface Props {
  control: Control<any, any>;
  isEditing: boolean;
  personAlreadyExists?: boolean;
  errors?: FieldErrorsImpl<PersonFormValues>;
}

export const personSchema = {
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  birth: yup.string().length(8, 'Data inválida').required('O campo é obrigatório'),
  cpf: yup.string().length(11, 'CPF inválido').required('O campo é obrigatório'),
  rg: yup.string().required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
};

export const personDefaultValues = {
  name: '',
  cpf: '',
  rg: '',
  sex: '',
  birth: '',
};

const PersonForm = ({ control, isEditing, errors, personAlreadyExists = false }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} sm={12} xs={12}>
        <FormNumberFormat
          format="###.###.###-##"
          name={'cpf'}
          label={'CPF'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.cpf?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <FormStandardInput
          name={'name'}
          label={'Nome'}
          control={control}
          disabled={personAlreadyExists}
          editable={isEditing}
          errorMessage={errors?.name?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <FormStandardInput
          name={'rg'}
          label={'RG'}
          disabled={personAlreadyExists}
          control={control}
          editable={isEditing}
          errorMessage={errors?.rg?.message}
          fullWidth
        />
      </Grid>

      <Grid item md={4} sm={6} xs={6}>
        <FormNumberFormat
          name={'birth'}
          format="##/##/####"
          label={'Data de Nascimento'}
          control={control}
          editable={isEditing}
          disabled={personAlreadyExists}
          errorMessage={errors?.birth?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={4} sm={6} xs={6}>
        <FormStandardInput
          name={'sex'}
          label={'Sexo'}
          select
          control={control}
          editable={isEditing}
          disabled={personAlreadyExists}
          errorMessage={errors?.sex?.message}
          fullWidth
        >
          <MenuItem value={'M'}>Masculino</MenuItem>
          <MenuItem value={'F'}>Feminino</MenuItem>
        </FormStandardInput>
      </Grid>
    </Grid>
  );
};

export default PersonForm;
