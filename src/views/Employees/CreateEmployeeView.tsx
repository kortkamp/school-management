/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, CardHeader, MenuItem, Divider, Theme, Typography } from '@mui/material';

import * as yup from 'yup';

import { useApi, useRequestApi } from '../../api/useApi';
import { rolesService } from '../../services/roles.service';
import { employeesService } from '../../services/employees.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppClearButton, AppSaveButton } from '../../components/AppCustomButton';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import { personsService } from '../../services/persons.service';
import { routePaths } from '../../routes/RoutePaths';
import { toast } from 'react-toastify';
import { RoleTypes } from '../../services/models/IRole';
import AddressForm, {
  addressDefaultValues,
  AddressFormValues,
  addressSchema,
} from '../../components/HookFormInput/Forms/AddressForm';
import { makeStyles } from '@mui/styles';
import PersonForm, {
  personDefaultValues,
  PersonFormValues,
  personSchema,
} from '../../components/HookFormInput/Forms/PersonForm';

const useStyles = makeStyles((theme: Theme) => ({
  divider: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  section_title: {
    marginTop: theme.spacing(2),
    fontSize: 20,
    fontWeight: 'medium',
  },
}));

const schema = yup.object({
  ...personSchema,
  address: yup.object({
    ...addressSchema,
  }),
  role_id: yup.string().required('O campo é obrigatório'),
});

const complementarySchema = yup.object({
  role_id: yup.string().required('O campo é obrigatório'),
});

interface FormValues extends PersonFormValues {
  address: AddressFormValues;
}

const defaultValues: FormValues = {
  // id: '',
  ...personDefaultValues,
  address: {
    ...addressDefaultValues,
  },
};

const employeeRoles = [RoleTypes.SECRETARY, RoleTypes.PRINCIPAL, RoleTypes.TEACHER];

/**
 * Renders "Create Employee" view
 * url: /funcionarios/criar
 */
function CreateEmployeeView() {
  const classes = useStyles();

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
    resolver: yupResolver(personAlreadyExists ? complementarySchema : schema),
  });

  const onSubmit = async (formData: FormValues) => {
    let response: any;

    const { address, ...personData } = formData;

    if (personAlreadyExists) {
      response = await createPersonRole({ employee_id: userId, role_id: formData.role_id });
    } else {
      response = await createPerson({ ...personData, addresses: [{ ...address }] });
    }

    if (response?.success) {
      history.push(routePaths.employees.path);
      toast.success('Funcionário cadastrado com sucesso');
    }
  };

  useEffect(() => {
    const fetchPerson = async (cpf: string) => {
      const response = await getPersonByCPF({ cpf });

      if (response?.success && response.person) {
        const { user, name, rg, birth, sex, addresses } = response.person;
        reset({ ...defaultValues, name, rg, birth, sex, cpf, address: addresses[0] });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <CardHeader
        style={{ textAlign: 'center', margin: '30px' }}
        title={'Funcionários'}
        subheader={'Cadastro de Funcionários'}
      />
      <Typography className={classes.section_title}>Dados Pessoais</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <PersonForm control={control} isEditing={isEditing} personAlreadyExists={personAlreadyExists} errors={errors} />

      <Typography className={classes.section_title}>Endereço</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <AddressForm
        control={control}
        isEditing={isEditing}
        errors={errors.address}
        setValue={setValue as any}
        watch={watch as any}
      />

      <Typography className={classes.section_title}>Complemento</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <Grid container spacing={2}>
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
            {rolesData
              .filter((role) => employeeRoles.includes(role.type as RoleTypes))
              .map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
          </FormStandardInput>
        </Grid>
      </Grid>

      <AppSaveButton type="submit" loading={saving || isCreatingRole} disabled={saving || isCreatingRole} />
      <AppClearButton
        onClick={() => {
          setPersonAlreadyExists(false);
          setIsEditing(true);
          reset(defaultValues);
        }}
      />
    </form>
  );
}

export { CreateEmployeeView };
