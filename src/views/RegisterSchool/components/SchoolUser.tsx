/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useCallback, useState } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import { useRequestApi } from '../../../api/useApi';
import { AppButton } from '../../../components';
import { usersService } from '../../../services/users.service';

interface Props {
  onSuccess?: () => void;
}

const SchoolUser = ({ onSuccess = () => {} }: Props) => {
  const [getUserByCPF, loadingUser] = useRequestApi(usersService.getByCPF, { silent: true });

  const [userCPF, setUserCPF] = useState('');

  const [user, setUser] = useState<any>();

  const [responsible, setResponsible] = useState('');

  const handleChangeUserCPF = useCallback(async ({ value }: NumberFormatValues) => {
    setUserCPF(value);
    if (value.length === 11) {
      const response = await getUserByCPF({ CPF: value });
      if (response?.success) {
        setUser(response.user);
      }
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponsible(event.target.value);
  };

  return (
    <Card>
      <CardHeader style={{ textAlign: 'center' }} title={'Responsável pela Instituição'} />
      <CardContent>
        <RadioGroup name="radio-buttons-group" onChange={handleChange}>
          <FormControlLabel value="self" control={<Radio />} label="Eu serei o responsável pela instituição" />
          <FormControlLabel value="other" control={<Radio />} label="Desejo cadastrar um responsável" />
        </RadioGroup>
        {responsible === 'other' && (
          <Box display="flex" gap={5} alignItems="center">
            <NumberFormat
              margin="normal"
              label="CPF"
              name="CPF"
              format="###.###.###-##"
              customInput={TextField}
              value={userCPF}
              onValueChange={handleChangeUserCPF}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" style={{ width: 20 }}>
                    {loadingUser && <CircularProgress size={20} />}
                  </InputAdornment>
                ),
              }}
            />
            {user ? (
              <>
                <TextField
                  label="Nome"
                  name="name"
                  value={user.name}
                  inputProps={{ readOnly: true }}
                  variant="standard"
                  margin="normal"
                />
                <TextField
                  label="Função"
                  name="name"
                  value={user.name}
                  inputProps={{ readOnly: true }}
                  variant="standard"
                  margin="normal"
                />
              </>
            ) : (
              <>
                <Typography variant="caption">MUI Typography caption</Typography>
              </>
            )}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <AppButton disabled={!responsible} color="success" onClick={() => onSuccess()}>
          Finalizar
        </AppButton>
      </CardActions>
    </Card>
  );
};

export default SchoolUser;
