import { Grid } from '@mui/material';
import { Control, FieldErrorsImpl } from 'react-hook-form';
import FormNumberFormat from '../../../components/HookFormInput/FormNumberFormat';
import FormStandardInput from '../../../components/HookFormInput/FormStandardInput';

import * as yup from 'yup';

export interface ContactFormValues {
  id?: string;
  email: string;
  phone: string;
  cel_phone: string;
}

interface Props {
  control: Control<any, any>;
  isEditing: boolean;
  errors?: FieldErrorsImpl<ContactFormValues>;
}

export const contactSchema = {
  email: yup.string().email('Email inválido').required('O campo é obrigatório'),
  phone: yup.string().length(10, 'Telefone inválido'),
  cel_phone: yup.string().length(11, 'Celular inválido').required('O campo é obrigatório'),
};

export const contactDefaultValues = {
  email: '',
  phone: '',
  cel_phone: '',
};

const ContactForm = ({ control, isEditing, errors }: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} sm={12} xs={12}>
        <FormStandardInput
          name={'contact.email'}
          label={'Email'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.email?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={3} sm={6} xs={6}>
        <FormNumberFormat
          format="(##) ####-####"
          name={'contact.phone'}
          label={'Telefone fixo'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.phone?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={3} sm={6} xs={6}>
        <FormNumberFormat
          format="(##) #####-####"
          name={'contact.cel_phone'}
          label={'Celular'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.cel_phone?.message}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default ContactForm;
