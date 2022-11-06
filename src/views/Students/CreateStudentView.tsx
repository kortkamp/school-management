/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, CardHeader, Divider, Theme, Typography } from '@mui/material';

import Moment from 'moment';

import * as yup from 'yup';

import { useRequestApi } from '../../api/useApi';
import { employeesService } from '../../services/employees.service';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppClearButton, AppSaveButton } from '../../components/AppCustomButton';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import { personsService } from '../../services/persons.service';
import { routePaths } from '../../routes/RoutePaths';
import { toast } from 'react-toastify';
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
import { coursesService } from '../../services/courses.service';
import { studentsService } from '../../services/students.service';
import StudentAllocation, { IStudentAllocation } from './StudentAllocation';

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
  enroll_id: yup.string().required('O campo é obrigatório'),
  course_id: yup.string().required('O campo é obrigatório'),
  grade_id: yup.string().required('O campo é obrigatório'),
  class_group_id: yup.string().required('O campo é obrigatório'),
});

const complementarySchema = yup.object({
  enroll_id: yup.string().required('O campo é obrigatório'),
  course_id: yup.string().required('O campo é obrigatório'),
  grade_id: yup.string().required('O campo é obrigatório'),
  class_group_id: yup.string().required('O campo é obrigatório'),
});

interface FormValues extends PersonFormValues {
  address: AddressFormValues;
  enroll_id: string;
  course_id: string;
  grade_id: string;
  class_group_id: string;
}

const defaultValues: FormValues = {
  // id: '',
  ...personDefaultValues,
  address: {
    ...addressDefaultValues,
  },
  enroll_id: '',
  course_id: '',
  grade_id: '',
  class_group_id: '',
};

/**
 * Renders "Create Student" view
 * url: /alunos/criar
 */
function CreateStudentView() {
  const classes = useStyles();

  const history = useHistory();

  const [getPersonByCPF, loadingUser] = useRequestApi(personsService.getByCPF);
  const [createStudent, saving] = useRequestApi(studentsService.create);
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

    const { address, birth, ...personData } = formData;

    if (personAlreadyExists) {
    } else {
      response = await createStudent({
        ...personData,
        birth: Moment(birth, 'DDMMYYYY').toDate(),
        addresses: [{ ...address }],
      });
    }

    if (response?.success) {
      history.push(routePaths.students.path);
      toast.success('Aluno cadastrado com sucesso');
    }
  };

  const onAllocationChange = (allocation: IStudentAllocation) => {
    setValue('course_id', allocation.course_id);
    setValue('grade_id', allocation.grade_id);
    setValue('class_group_id', allocation.class_group_id);
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
      <CardHeader style={{ textAlign: 'center', margin: '30px' }} title={'Alunos'} subheader={'Cadastro de aluno'} />
      <Typography className={classes.section_title}>Dados Pessoais</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <PersonForm control={control} isEditing={isEditing} personAlreadyExists={personAlreadyExists} errors={errors} />

      <Typography className={classes.section_title}>Endereço</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <AddressForm control={control} isEditing={isEditing} errors={errors.address} setValue={setValue as any} />

      <Typography className={classes.section_title}>Complemento</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <Grid item md={4} sm={12} xs={12}>
        <FormStandardInput
          name={'enroll_id'}
          label={'Matrícula'}
          control={control}
          editable={isEditing || personAlreadyExists}
          errorMessage={errors.enroll_id?.message}
          fullWidth
        ></FormStandardInput>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <StudentAllocation onChange={(data) => onAllocationChange(data)} props={{ variant: 'standard' }} />
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

export { CreateStudentView };
