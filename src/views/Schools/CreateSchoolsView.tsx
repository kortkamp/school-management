import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, DEFAULT_FORM_STATE } from '../../utils/form';

import * as yup from 'yup';
import { termsService } from '../../services/terms.service';
import { useAppMessage } from '../../utils/message';

const createTermSchema = {
  name: yup.string().required('O campo é obrigatório'),
  phone: yup.string().required('O campo é obrigatório'),
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
  name: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
}

/**
 * Renders "Create ClassGroup" view
 * url: /escola/criar
 */
function CreateSchoolsView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();

  const { id } = useParams<{ id: string }>();
  const isEditing = id ? true : false;

  const [isSaving, setIsSaving] = useState(false);

  const [AppMessage, setMessage] = useAppMessage();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError, , setField] = useAppForm({
    validationSchema: createTermSchema,
    initialValues: {
      name: '',
      phone: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      CEP: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setIsSaving(true);

      try {
        if (isEditing) {
          await termsService.update(id, values);
        } else {
          await termsService.create(values);
        }
        history.replace('/bimestres');
      } catch (err: any) {
        setIsSaving(false);
        console.error(err);
        setMessage({ type: 'error', text: err.response.data.message });
      }
    },
    [dispatch, values, history]
  );

  const handleSetCEP = (CEP: string) => {
    if (CEP.length !== 8) {
      return;
    }

    fetch(`https://viacep.com.br/ws/${CEP}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.erro) {
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

  const loadData = useCallback(() => {
    async function fetchData() {
      try {
        const { name, year, start_at, end_at } = await termsService.getById(id);

        if (!mounted.current) return;

        setFormState({ ...DEFAULT_FORM_STATE, isValid: true, values: { name, year, start_at, end_at } });
      } catch (err: any) {
        console.log(err);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader
          style={{ textAlign: 'center' }}
          title="Escola"
          subheader={isEditing ? 'Editar Dados da Escola' : 'Cadastrar uma nova Escola'}
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Nome"
                name="name"
                value={values.name}
                onChange={onFieldChange}
                error={fieldHasError('name')}
                helperText={fieldGetError('name') || ' '}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                type="phone"
                label="Telefone"
                name="phone"
                value={values.phone}
                onChange={onFieldChange}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' '}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                label="CEP"
                name="CEP"
                type="number"
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

            <Grid item md={6} sm={12} xs={12}>
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
            <Grid item md={6} sm={12} xs={12}>
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
            <Grid item md={8} sm={12} xs={12}>
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
            <Grid item md={4} sm={12} xs={12}>
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

            <Grid item md={12} sm={12} xs={12}>
              <AppMessage />
            </Grid>
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid || isSaving} loading={isSaving}>
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateSchoolsView;
