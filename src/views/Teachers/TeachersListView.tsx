/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, Grid, CircularProgress, Button, Box, TextField, MenuItem } from '@mui/material';
import {
  DataGrid,
  GridOverlay,
  gridPageCountSelector,
  gridPageSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useApi } from '../../api/useApi';
import { AppButton } from '../../components';
import { teachersService } from '../../services/teachers.service';
import Pagination from '@mui/material/Pagination';

export function CustomFooterButtonsComponent() {
  return (
    <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <AppButton color="primary">Mudar Turma</AppButton>
      </div>
      <GridPagination />
    </Box>
  );
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
 * Renders "TeachersListView" view
 * url: /professores/
 */
const TeachersListView = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTeachersFilter, setActiveTeachersFilter] = useState<'' | 'active' | 'inactive'>('active');

  const [data, , loading] = useApi(teachersService.getAll, {
    args: { page, per_page: pageSize, filter: activeTeachersFilter },
  });

  const history = useHistory();

  const dataGridTeachersColumns = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.person.name;
      },
    },

    { field: 'enroll_id', headerName: 'Matrícula', width: 150 },

    {
      field: 'action',
      headerName: 'Ações',
      width: 350,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <AppButton onClick={() => history.push(`/professores/disciplinas/${params.row.id}`)}>Matérias</AppButton>
          </>
        );
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title={'Professores'} subheader={'Lista de Professores'} />

          <CardContent>
            <TextField
              required
              label="Filtrar por"
              select
              name="name"
              value={activeTeachersFilter}
              onChange={(e) => setActiveTeachersFilter(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="active">Ativos</MenuItem>
              <MenuItem value="inactive">Inativos</MenuItem>
              <MenuItem value="all">Todos</MenuItem>
            </TextField>
            <Grid container spacing={1}>
              <Grid item md={12} sm={12} xs={12}>
                <DataGrid
                  rows={data?.result || []}
                  columns={loading ? [] : dataGridTeachersColumns}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  onPageChange={(newPage) => setPage(newPage + 1)}
                  pagination
                  pageSize={pageSize}
                  page={page - 1}
                  rowCount={data?.total_filtered || 0}
                  paginationMode="server"
                  rowsPerPageOptions={[10, 20, 50]}
                  checkboxSelection
                  loading={loading}
                  autoHeight
                  initialState={{
                    pagination: {
                      page: 1,
                    },
                  }}
                  // components={{ Footer: CustomFooterButtonsComponent }}
                  components={{
                    Pagination: CustomPagination,
                    NoRowsOverlay: () => (
                      <GridOverlay>
                        <div>Sem professores</div>
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

export default TeachersListView;
