/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  CircularProgress,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridOverlay,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppButton, AppIconButton } from '../../components';
import Pagination from '@mui/material/Pagination';
import { employeesService } from '../../services/employees.service';
import { rolesService } from '../../services/roles.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppAddButton } from '../../components/AppCustomButton';

interface Props {
  onSuccess?: () => void;
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

/**
 * Renders "ListEmployeesView" view
 * url: /funcionarios/
 */
const ListEmployeesView = ({ onSuccess }: Props) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rolesData, , loadingRoles] = useApi(rolesService.getAll, {}, { defaultValue: [] });

  const [removeEmployee, isRemoving] = useRequestApi(employeesService.remove);
  const [showRemovingProgress, setShowRemovingProgress] = useState();

  const [roleIdFilter, setRoleIdFilter] = useState('');

  const [data, , loading, , setData] = useApi(employeesService.getAll, {
    page,
    per_page: pageSize,
    filterBy: 'role_id',
    filterType: 'eq',
    filterValue: roleIdFilter,
  });

  const history = useHistory();

  const handleRemoveEmployee = useCallback(
    async (employeeData: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id: user_id, role_id, name, role } = employeeData.row;
      setShowRemovingProgress(employeeData.id);
      if (!window.confirm(`Deseja remove a função ${role} do funcionário ${name}`)) {
        return;
      }

      const response = await removeEmployee({ user_id, role_id });

      if (!response?.success) {
        return;
      }

      if (data?.result) {
        const updatedData = { ...data };

        updatedData.result = updatedData.result.filter(
          (employee) => employee.id !== user_id || employee.role_id !== role_id
        );
        updatedData.total_filtered -= 1;

        setData(updatedData);
      }
    },
    [data]
  );

  const dataGridTeachersColumns = [
    { field: 'name', headerName: 'Nome', width: 250 },
    { field: 'role', headerName: 'Função', width: 150 },

    {
      field: 'action',
      headerName: 'Ações',
      width: 350,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <AppIconButton
              title="Alterar Função"
              icon="edit"
              onClick={(event) => {
                event.stopPropagation();
                const { id, role_id: currentRoleId, name } = params.row;

                history.push('/funcionarios/nova-funcao', {
                  user: { id, name, currentRoleId },
                });
              }}
            />

            <Box position={'relative'}>
              {isRemoving && showRemovingProgress === params.id && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
              <AppIconButton
                title="Apagar"
                icon="delete"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemoveEmployee(params);
                }}
              />
            </Box>
          </>
        );
      },
    },
  ];

  const handleChangeRole = useCallback((event: any) => {
    setRoleIdFilter(event.target.value);
  }, []);

  function CustomFooterButtonsComponent() {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <AppAddButton onClick={() => history.push('/funcionarios/criar')} />
          {onSuccess && (
            <AppButton color="info" onClick={() => onSuccess()}>
              Finalizar
            </AppButton>
          )}
        </Box>
        <CustomPagination />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title={'Funcionários'} />

          <CardContent>
            <Grid container spacing={1}>
              <Grid item md={4} sm={12} xs={12}>
                <TextField
                  required
                  select
                  label="Filtrar por Função"
                  name="role_id"
                  value={roleIdFilter}
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
                  <MenuItem value={''}>Cancelar Filtro</MenuItem>
                </TextField>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <DataGrid
                  rows={(data?.result || []) as any[]}
                  getRowId={(row) => row.id + row.role_id}
                  columns={loading ? [] : dataGridTeachersColumns}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  onPageChange={(newPage) => setPage(newPage + 1)}
                  pagination
                  pageSize={pageSize}
                  page={page - 1}
                  rowCount={data?.total_filtered || 0}
                  paginationMode="server"
                  rowsPerPageOptions={[10, 20, 50]}
                  loading={loading}
                  autoHeight
                  disableSelectionOnClick
                  initialState={{
                    pagination: {
                      page: 1,
                    },
                  }}
                  // components={{ Footer: CustomFooterButtonsComponent }}
                  components={{
                    Footer: CustomFooterButtonsComponent,
                    Pagination: CustomPagination,
                    NoRowsOverlay: () => (
                      <GridOverlay>
                        <div>Nenhum funcionário encontrado</div>
                      </GridOverlay>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListEmployeesView;
