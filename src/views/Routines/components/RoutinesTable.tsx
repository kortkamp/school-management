import { CircularProgress, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { useState } from 'react';
import { AppIconButton } from '../../../components';
import { IRoutineGroup } from '../../../services/routines.service';

interface Props {
  routineGroup: IRoutineGroup;
  handleChangeRoutineValue: (routineId: string, event: any) => void;
  handleAddRoutine: (routineGroupId: string) => Promise<void>;
  isAddingRoutine?: boolean;
  handleRemoveRoutine: (routineId: string) => Promise<void>;
  isRemovingRoutine?: boolean;
}

const RoutinesTable = ({
  routineGroup,
  handleChangeRoutineValue,
  handleAddRoutine,
  handleRemoveRoutine,
  isAddingRoutine = false,
}: Props) => {
  const [deletingRoutine, setDeletingRoutine] = useState('');

  const handleDeleteIconClick = (routineId: string) => {
    setDeletingRoutine(routineId);
    handleRemoveRoutine(routineId);
  };

  return (
    <>
      <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
        <colgroup>
          <col width="20%" />
          <col width="20%" />
          <col width="20%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Início</TableCell>
            <TableCell>Término</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routineGroup.routines.map((routine) => (
            <TableRow key={routine.id}>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="start_at"
                  type="time"
                  // value={routine.start_at ? Moment(routine.start_at).format('HH-MM-SS') : ''}
                  value={routine.start_at || ''}
                  onChange={(event) => handleChangeRoutineValue(routine.id, event)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="end_at"
                  type="time"
                  // value={routine.end_at ? Moment(routine.end_at).format('HH-MM-SS') : ''}
                  value={routine.end_at || ''}
                  onChange={(event) => handleChangeRoutineValue(routine.id, event)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="type"
                  value={'Aula'}
                  // onChange={(event) => handleChangeRoutineValue(routine.id, event)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                ></TextField>
              </TableCell>
              <TableCell component="th" scope="row">
                <AppIconButton
                  title="Apagar"
                  icon="delete"
                  disabled={routine.id === deletingRoutine}
                  onClick={() => handleDeleteIconClick(routine.id)}
                >
                  {routine.id === deletingRoutine && (
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
                </AppIconButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell component="th" scope="row">
              <TextField
                required
                name="type"
                value="add"
                select
                variant="standard"
                style={{ padding: 2 }}
                InputProps={{ disableUnderline: true }}
                disabled={isAddingRoutine}
              >
                <MenuItem value="add" style={{ display: 'none' }}>
                  Adicionar
                  {isAddingRoutine && (
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
                </MenuItem>
                <MenuItem value="class" onClick={() => handleAddRoutine(routineGroup.id)}>
                  Aula
                </MenuItem>
                <MenuItem value="interval" onClick={() => handleAddRoutine(routineGroup.id)}>
                  Intervalo
                </MenuItem>
              </TextField>
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default RoutinesTable;
