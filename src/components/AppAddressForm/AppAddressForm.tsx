import { Grid, MenuItem, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';
// import * as yup from 'yup';

import { SHARED_CONTROL_PROPS, useAppForm } from '../../utils/form';

interface Props {
  onChange?: () => void;
}

const createTermSchema = {
  // start_at: yup.date().required('O campo é obrigatório'),
  // address: yup.string().required('O campo é obrigatório'),
  // number: yup.string().required('O campo é obrigatório'),
  // complement: yup.string().required('O campo é obrigatório'),
  // district: yup.string().required('O campo é obrigatório'),
  // city: yup.string().required('O campo é obrigatório'),
  // state: yup.string().required('O campo é obrigatório'),
  // CEP: yup.string().required('O campo é obrigatório'),
};

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

interface FormStateValues {
  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
}

const AppAddressForm: React.FC<Props> = ({}) => {
  const [formState, , onFieldChange, fieldGetError, fieldHasError, , setField] = useAppForm({
    validationSchema: createTermSchema,
    initialValues: {
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      CEP: '',
    } as FormStateValues,
  });

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const values = formState.values as FormStateValues;

  const handleSetCEP = (CEP: string) => {
    if (CEP.length !== 8) {
      return;
    }

    fetch(`https://viacep.com.br/ws/${CEP}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.erro && mounted.current) {
          setField('address', data.logradouro);
          setField('complement', data.complemento);
          setField('district', data.bairro);
          setField('city', data.localidade);
          setField('state', data.uf);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          required
          label="CEP"
          name="CEP"
          type="phone"
          value={values.CEP}
          onChange={(event: any) => {
            onFieldChange(event);
            handleSetCEP(event.target.value);
          }}
          error={fieldHasError('CEP')}
          helperText={fieldGetError('CEP') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={10} sm={12} xs={12}>
        <TextField
          required
          type="address"
          label="Endereço"
          name="address"
          value={values.address}
          onChange={onFieldChange}
          error={fieldHasError('address')}
          helperText={fieldGetError('address') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={2} sm={12} xs={12}>
        <TextField
          required
          label="Número"
          name="number"
          value={values.number}
          onChange={onFieldChange}
          error={fieldHasError('number')}
          helperText={fieldGetError('number') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={6} sm={6} xs={6}>
        <TextField
          required
          label="Complemento"
          name="complement"
          value={values.complement}
          onChange={onFieldChange}
          error={fieldHasError('complement')}
          helperText={fieldGetError('complement') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={6} sm={6} xs={6}>
        <TextField
          required
          label="Bairro"
          name="district"
          value={values.district}
          onChange={onFieldChange}
          error={fieldHasError('district')}
          helperText={fieldGetError('district') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={8} sm={8} xs={8}>
        <TextField
          required
          label="Cidade"
          name="city"
          value={values.city}
          onChange={onFieldChange}
          error={fieldHasError('city')}
          helperText={fieldGetError('city') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={4} sm={4} xs={4}>
        <TextField
          required
          select
          label="Estado"
          name="state"
          value={values.state}
          onChange={onFieldChange}
          error={fieldHasError('state')}
          helperText={fieldGetError('state') || ' '}
          {...SHARED_CONTROL_PROPS}
        >
          {UFList.map((uf) => (
            <MenuItem key={uf[1]} value={uf[1]}>
              {uf[0]}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default AppAddressForm;
