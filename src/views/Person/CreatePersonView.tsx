/* eslint-disable @typescript-eslint/no-unused-vars */
import { SyntheticEvent, useCallback, useState } from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

import * as yup from 'yup';

import { SHARED_CONTROL_PROPS } from '../../utils/form';

const createPersonSchema = {
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
  CPF: yup.string().required('O campo é obrigatório'),
  phone: yup.string().required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
};

interface FormStateValues {
  email: string;
  name: string;
  enroll_id?: string; // unique
  CPF?: string; // unique
  phone?: string;
  sex: 'M' | 'F' | '';
  birth: string;
  willLogin: boolean;
  password: string;
  password_confirmation: string;
  segment_id?: string;
  grade_id?: string;
  class_group_id?: string;
}

function CreatePersonView() {
  // const [appState] = useAppStore();

  const values = {};

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
    },
    [values, history]
  );

  return (
    <form style={{ minWidth: '100%' }} onSubmit={handleFormSubmit}>
      <Grid container spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          <TextField label="Nome Completo" name="name" {...SHARED_CONTROL_PROPS} />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <TextField
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Nascimento"
            name="birth"
            {...SHARED_CONTROL_PROPS}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <TextField label="CPF" name="CPF" style={{ minWidth: '100%' }} {...SHARED_CONTROL_PROPS} />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <TextField required label="Telefone" type="phone" name="phone" {...SHARED_CONTROL_PROPS} />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <TextField
            required
            // disabled={}
            select
            label="Sexo"
            name="sex"
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </form>
  );
}

export { CreatePersonView };
