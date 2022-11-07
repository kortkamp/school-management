import { Card, CardHeader, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from 'react-router';
import { useApi } from '../../api/useApi';
import { AppIconButton, AppLoading } from '../../components';
import { classGroupsService } from '../../services/classGroups.service';

/**
 * Renders "ClassGroups" view
 * url: /professores/*
 */
const ClassGroupsView = () => {
  const [classGroups, , loadingClassGroups] = useApi(classGroupsService.getAll, { defaultValue: [] });

  const history = useHistory();

  const columns = [
    { field: 'name', headerName: 'Turma', width: 150 },
    {
      field: 'course',
      headerName: 'Curso',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.grade?.course?.name;
      },
    },
    {
      field: 'grade',
      headerName: 'Fase',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.grade?.name;
      },
    },
    {
      field: 'routineGroup',
      headerName: 'Turno',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.routineGroup?.name;
      },
    },
    { field: 'students_count', headerName: 'Alunos', width: 150 },
    {
      field: 'actions',
      headerName: 'Ações',
      sortable: false,
      width: 80,
      renderCell: (params: any) => (
        <>
          <AppIconButton
            icon="group"
            onClick={(e: any) => {
              e.stopPropagation(); // don't select this row after clicking
              history.push('/turmas/' + params.row.id);
            }}
            title="Mostrar Turma"
          />
        </>
      ),
    },
  ];

  if (loadingClassGroups) return <AppLoading />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader style={{ textAlign: 'center' }} title="Turmas" subheader="Lista de turmas" />

          <DataGrid rows={classGroups} columns={columns} pageSize={15} rowsPerPageOptions={[15]} autoHeight />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClassGroupsView;
