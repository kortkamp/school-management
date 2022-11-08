/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { CardHeader, Divider, Theme, Typography } from '@mui/material';
import Moment from 'moment';

import * as yup from 'yup';

import { useApi, useRequestApi } from '../../api/useApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppSaveButton } from '../../components/AppCustomButton';
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
import { personsService } from '../../services/persons.service';
import { AppLoading } from '../../components';
import AppBackButton from '../../components/AppCustomButton/AppBackButton';
import AppError from '../../components/AppError';
import ContactForm, {
  ContactFormValues,
  contactDefaultValues,
  contactSchema,
} from '../../components/HookFormInput/Forms/ContactForm';

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
  contact: yup.object({
    ...contactSchema,
  }),
});

interface FormValues extends PersonFormValues {
  address?: AddressFormValues;
  contact: ContactFormValues;
}

const defaultValues: FormValues = {
  ...personDefaultValues,
  address: {
    ...addressDefaultValues,
  },
  contact: {
    ...contactDefaultValues,
  },
};

/**
 * Renders "Person Data View" view
 * url: /pessoa/:person_id
 */
function PersonDataView() {
  const { id: person_id } = useParams<{ id: string }>();

  const classes = useStyles();

  const history = useHistory();

  const [person, error, loading] = useApi(personsService.getById, { args: { id: person_id } });

  const [updatePerson, saving] = useRequestApi(personsService.update);

  const [isEditing, setIsEditing] = useState(true);

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (person) {
      const { addresses, id, name, cpf, rg, birth, sex, contact } = person;
      const {
        id: address_id,
        CEP,
        city,
        complement,
        district,
        number,
        state,
        street,
      } = addresses[0] || addressDefaultValues;

      const { email, cel_phone, phone } = contact || contactDefaultValues;
      reset({
        id,
        name,
        cpf,
        rg,
        birth: Moment(birth).format('DDMMYYYY'),
        sex,
        address: { id: address_id, CEP, city, complement, district, number, state, street },
        contact: { email, cel_phone, phone },
      });
    }
  }, [person]);

  const onSubmit = async (formData: FormValues) => {
    let response: any;

    const { address, id, birth, ...personData } = formData;

    response = await updatePerson({
      id,
      data: { ...personData, birth: Moment(birth, 'DDMMYYYY').toDate(), addresses: [{ ...address }] },
    });

    if (response?.success) {
      history.goBack();
      toast.success('Dados salvos com sucesso');
    }
  };

  if (loading) {
    return <AppLoading />;
  }

  if (error) {
    return <AppError>{error}</AppError>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <CardHeader style={{ textAlign: 'center', margin: '30px' }} title={'Pessoa'} subheader={'Visualizar dados'} />
      <Typography className={classes.section_title}>Dados Pessoais</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <PersonForm control={control} isEditing={isEditing} errors={errors} />

      <Typography className={classes.section_title}>Endereço</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <AddressForm control={control} isEditing={isEditing} errors={errors.address} setValue={setValue as any} />

      <Typography className={classes.section_title}>Contato</Typography>
      <Divider textAlign="left" className={classes.divider}></Divider>
      <ContactForm control={control} isEditing={isEditing} errors={errors.contact} />

      <AppSaveButton type="submit" loading={saving} disabled={saving} />
      <AppBackButton />
    </form>
  );
}

export { PersonDataView };
