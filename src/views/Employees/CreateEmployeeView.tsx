/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, CardHeader, MenuItem, InputAdornment, CircularProgress, Divider } from '@mui/material';

import NumberFormat, { NumberFormatValues } from 'react-number-format';
import Moment from 'moment';

import * as yup from 'yup';

import { SHARED_CONTROL_PROPS } from '../../utils/form';

import { useApi, useRequestApi } from '../../api/useApi';
import { usersService } from '../../services/users.service';
import { rolesService } from '../../services/roles.service';
import { employeesService } from '../../services/employees.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppClearButton, AppSaveButton } from '../../components/AppCustomButton';
import { FormOutlinedInput } from '../../components/HookFormInput';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import FormNumberFormat from '../../components/HookFormInput/FormNumberFormat';
import { personsService } from '../../services/persons.service';
import { routePaths } from '../../routes/RoutePaths';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  birth: yup.string().length(8, 'Data inválida').required('O campo é obrigatório'),
  cpf: yup.string().length(11, 'CPF inválido').required('O campo é obrigatório'),
  rg: yup.string().required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
  role_id: yup.string().required('O campo é obrigatório'),
});

const roleSchema = yup.object({
  role_id: yup.string().required('O campo é obrigatório'),
});

interface FormValues {
  // id: string;
  name: string;
  cpf: string;
  rg: string;
  sex: string;
  birth: string;
  role_id: string;
}

const defaultValues: FormValues = {
  // id: '',
  name: '',
  cpf: '',
  rg: '',
  sex: '',
  birth: '',
  role_id: '',
};

/**
 * Renders "Create Employee" view
 * url: /funcionarios/criar
 */
function CreateEmployeeView() {
  const history = useHistory();
  const [rolesData, , loadingRoles] = useApi(rolesService.getAll, { defaultValue: [] });

  const [getPersonByCPF, loadingUser] = useRequestApi(personsService.getByCPF);
  const [createPerson, saving] = useRequestApi(personsService.create);
  const [createPersonRole, isCreatingRole] = useRequestApi(employeesService.createRole);

  const [isEditing, setIsEditing] = useState(true);
  const [personAlreadyExists, setPersonAlreadyExists] = useState(false);
  const [userId, setUserId] = useState('');

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(personAlreadyExists ? roleSchema : schema),
  });

  const onSubmit = async (formData: FormValues) => {
    let response: any;

    if (personAlreadyExists) {
      response = await createPersonRole({ employee_id: userId, role_id: formData.role_id });
    } else {
      response = await createPerson(formData);
    }
    console.log(response);

    if (response?.success) {
      history.push(routePaths.employees.path);
      toast.success('Funcionário cadastrado com sucesso');
    }
  };

  useEffect(() => {
    const fetchPerson = async (cpf: string) => {
      const response = await getPersonByCPF({ cpf });
      if (response?.success && response.person) {
        const { user, name, rg, birth, sex } = response.person;
        reset({ ...defaultValues, name, rg, birth, sex, cpf });
        setIsEditing(false);
        setPersonAlreadyExists(true);
        setUserId(user.id);
      }
    };

    const cpf = watch('cpf');
    if (cpf.length === 11) {
      fetchPerson(cpf);
    }
  }, [watch('cpf')]);

  // const handleChangeUserCPF = useCallback(async ({ value }: NumberFormatValues) => {
  //   onFieldChange({ target: { name: 'CPF', value } });
  //   if (value.length === 11) {
  //     const response = await getPersonByCPF({ CPF: value });
  //     if (response?.success) {
  //       setFormState((prev) => ({ ...prev, values: response.user }));
  //       // setUserAlreadyExists({ id: response.user.id, name: response.user.name });
  //     }
  //   }
  // }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <CardHeader
        style={{ textAlign: 'center', margin: '30px' }}
        title={'Funcionários'}
        subheader={'Cadastro de Funcionários'}
      />
      <Grid container spacing={2}>
        <Grid item md={6} sm={12} xs={12}>
          <FormNumberFormat
            format="###.###.###-##"
            name={'cpf'}
            label={'CPF'}
            control={control}
            editable={isEditing}
            errorMessage={errors.cpf?.message}
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
            errorMessage={errors.name?.message}
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
            errorMessage={errors.rg?.message}
            fullWidth
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <FormNumberFormat
            name={'birth'}
            format="##/##/####"
            label={'Data de Nascimento'}
            control={control}
            editable={isEditing}
            disabled={personAlreadyExists}
            errorMessage={errors.birth?.message}
            fullWidth
          />
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <FormStandardInput
            name={'sex'}
            label={'Sexo'}
            select
            control={control}
            editable={isEditing}
            disabled={personAlreadyExists}
            errorMessage={errors.sex?.message}
            fullWidth
          >
            <MenuItem value={'M'}>Masculino</MenuItem>
            <MenuItem value={'F'}>Feminino</MenuItem>
          </FormStandardInput>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <Divider />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <FormStandardInput
            name={'role_id'}
            label={'Função'}
            select
            control={control}
            editable={isEditing || personAlreadyExists}
            errorMessage={errors.role_id?.message}
            fullWidth
          >
            {rolesData.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </FormStandardInput>
        </Grid>
      </Grid>

      <AppSaveButton
        type="submit"
        loading={saving || isCreatingRole}
        disabled={saving || isCreatingRole}
        // label={isCreatingNewCourse ? 'Criar' : 'Salvar'}
      />
      <AppClearButton
        onClick={() => {
          setPersonAlreadyExists(false);
          setIsEditing(true);
          reset(defaultValues);
        }}
        // loading={saving || updating}
        // disabled={saving || updating || !isDirty}
        // label={isCreatingNewCourse ? 'Criar' : 'Salvar'}
      />
    </form>
  );
}

export { CreateEmployeeView };
