import { Grid, MenuItem } from '@mui/material';
import { useCallback } from 'react';
import { Control, FieldErrorsImpl, UseFormSetValue } from 'react-hook-form';
import FormNumberFormat from '../../../components/HookFormInput/FormNumberFormat';
import FormStandardInput from '../../../components/HookFormInput/FormStandardInput';

import * as yup from 'yup';

const UFList = [
  ['Acre', 'AC'],
  ['Alagoas', 'AL'],
  ['Amapá', 'AP'],
  ['Amazonas', 'AM'],
  ['Bahia', 'BA'],
  ['Ceará', 'CE'],
  ['Distrito Federal', 'DF'],
  ['Espírito Santo', 'ES'],
  ['Goiás', 'GO'],
  ['Maranhão', 'MA'],
  ['Mato Grosso', 'MT'],
  ['Mato Grosso do Sul', 'MS'],
  ['Minas Gerais', 'MG'],
  ['Pará', 'PA'],
  ['Paraíba ', 'PB'],
  ['Paraná', 'PR'],
  ['Pernambuco', 'PE'],
  ['Piauí', 'PI'],
  ['Rio de Janeiro', 'RJ'],
  ['Rio Grande do Norte', 'RN'],
  ['Rio Grande do Sul ', 'RS'],
  ['Rondônia', 'RO'],
  ['Roraima', 'RR'],
  ['Santa Catarina ', 'SC'],
  ['São Paulo ', 'SP'],
  ['Sergipe', 'SE'],
  ['Tocantins', 'TO'],
];

export interface AddressFormValues {
  id?: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
}

interface Props {
  control: Control<any, any>;
  isEditing: boolean;
  errors?: FieldErrorsImpl<AddressFormValues>;
  setValue: UseFormSetValue<{ address: AddressFormValues }>;
}

export const addressSchema = {
  CEP: yup.string().length(8, 'CEP inválido').required('O campo é obrigatório'),
  street: yup.string().required('O campo é obrigatório'),
  number: yup.string().required('O campo é obrigatório'),
  complement: yup.string(),
  district: yup.string().required('O campo é obrigatório'),
  city: yup.string().required('O campo é obrigatório'),
  state: yup.string().required('O campo é obrigatório'),
};

export const addressDefaultValues = {
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  CEP: '',
};

const AddressForm = ({ control, isEditing, errors, setValue }: Props) => {
  const HandleChangeCEP = useCallback((event: any) => {
    const cep = event.target.value as string;

    const sanitizedCEP = cep.replace(/[ .-]/g, '');

    if (sanitizedCEP.length !== 8) {
      return;
    }
    fetch(`https://viacep.com.br/ws/${sanitizedCEP}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setValue('address.street', data.logradouro);
        setValue('address.complement', data.complemento);
        setValue('address.district', data.bairro);
        setValue('address.city', data.localidade);
        setValue('address.state', data.uf);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item md={3} sm={12} xs={12}>
        <FormNumberFormat
          format="##.###-###"
          name={'address.CEP'}
          label={'CEP'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.CEP?.message}
          // onKeyDown={HandleChangeCEP}
          onKeyUp={HandleChangeCEP}
          fullWidth
        />
      </Grid>
      <Grid item md={7} sm={12} xs={12}>
        <FormStandardInput
          name={'address.street'}
          label={'Rua'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.street?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={2} sm={12} xs={12}>
        <FormStandardInput
          name={'address.number'}
          label={'Número'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.number?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <FormStandardInput
          name={'address.complement'}
          label={'Complemento'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.complement?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <FormStandardInput
          name={'address.district'}
          label={'Bairro'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.district?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={6} sm={6} xs={8}>
        <FormStandardInput
          name={'address.city'}
          label={'Cidade'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.city?.message}
          fullWidth
        />
      </Grid>
      <Grid item md={6} sm={6} xs={4}>
        <FormStandardInput
          name={'address.state'}
          select
          label={'Estado'}
          control={control}
          editable={isEditing}
          errorMessage={errors?.state?.message}
          fullWidth
        >
          {UFList.map((uf) => (
            <MenuItem key={uf[1]} value={uf[1]}>
              {uf[0]}
            </MenuItem>
          ))}
        </FormStandardInput>
      </Grid>
    </Grid>
  );
};

export default AddressForm;
