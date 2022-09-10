import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppForm } from '../../components';
import { AppSaveButton } from '../../components/AppCustomButton';
import AppBackButton from '../../components/AppCustomButton/AppBackButton';
import { employeesService } from '../../services/employees.service';
import { rolesService } from '../../services/roles.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

interface Props {
  user: {
    id: string;
    name: string;
    currentRoleId?: string;
  };
}

const CreateEmployeeRole = ({}: Props) => {
  const { state } = useLocation();

  const { user } = state as Props;

  const [createRole, isCreating] = useRequestApi(employeesService.createRole);

  const [rolesData, , loadingRoles] = useApi(rolesService.getAll, {}, { defaultValue: [] });

  const [roleId, setRoleId] = useState(user.currentRoleId || '');

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const response = await createRole({ employee_id: user.id, role_id: roleId, prev_role_id: user.currentRoleId });

      if (response?.success) {
        history.back();
      }
    },
    [user, roleId]
  );

  const handleChangeRole = useCallback((event: any) => {
    setRoleId(event.target.value);
  }, []);

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Atribuir função" />
        <CardContent>
          <TextField
            label="Nome"
            name="name"
            value={user.name}
            inputProps={{ readOnly: true }}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            select
            label="Função"
            name="role_id"
            value={loadingRoles ? '' : roleId}
            onChange={handleChangeRole}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ width: 20 }}>
                  {loadingRoles && <CircularProgress size={20} />}
                </InputAdornment>
              ),
            }}
          >
            {rolesData?.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <Box marginTop={5} display={'flex'} justifyContent={'space-between'}>
            <AppSaveButton type="submit" disabled={!roleId || isCreating} loading={isCreating} />
            <AppBackButton />
          </Box>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default CreateEmployeeRole;
