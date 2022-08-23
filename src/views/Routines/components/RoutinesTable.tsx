import {
  Box,
  CircularProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import { AppIconButton } from '../../../components';
import { RoutineType } from '../../../services/models/IRoutine';
import { IRoutineGroup } from '../../../services/routines.service';
import { timeToMinutes } from '../../../utils/time';

interface Props {
  routineGroup: IRoutineGroup;
  handleChangeRoutineValue: (routineId: string, event: any) => void;
  handleChangeRoutineDuration: (routineId: string, duration: string) => void;
  handleAddRoutine: (routineGroupId: string, type: RoutineType) => Promise<void>;
  isAddingRoutine?: boolean;
  handleRemoveRoutine: (routineId: string) => Promise<void>;
  isRemovingRoutine?: boolean;
}

const RoutinesTable = ({
  routineGroup,
  // handleChangeRoutineValue,
  handleAddRoutine,
  handleChangeRoutineDuration,
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
          <col width="10%" />
          <col width="20%" />
          <col width="20%" />
          <col width="10%" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell>Início</TableCell>
            <TableCell>Tempo(min)</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routineGroup.routines.map((routine) => (
            <TableRow key={routine.id}>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="type"
                  value={routine.type.toLocaleUpperCase()}
                  // onChange={(event) => handleChangeRoutineValue(routine.id, event)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                ></TextField>
              </TableCell>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="start_at"
                  type="time"
                  // value={routine.start_at ? Moment(routine.start_at).format('HH-MM-SS') : ''}
                  value={routine.start_at || ''}
                  variant="standard"
                  InputProps={{ disableUnderline: true, readOnly: true }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <TextField
                  required
                  name="duration"
                  type="number"
                  // value={routine.end_at ? Moment(routine.end_at).format('HH-MM-SS') : ''}
                  value={timeToMinutes(routine.duration) || ''}
                  onChange={(event) => handleChangeRoutineDuration(routine.id, event.target.value)}
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                />
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
                size="small"
                select
                variant="outlined"
                style={{ alignItems: 'center' }}
                // InputProps={{ disableUnderline: true }}
                disabled={isAddingRoutine}
                SelectProps={{ IconComponent: () => null }}
              >
                <MenuItem value="add" style={{ display: 'none' }}>
                  <Box display="flex" alignItems={'center'} justifyContent="space-between">
                    <AddCircleIcon style={{ marginRight: 10 }} />
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
                  </Box>
                </MenuItem>
                <MenuItem value="class" onClick={() => handleAddRoutine(routineGroup.id, RoutineType.CLASS)}>
                  Aula
                </MenuItem>
                <MenuItem value="interval" onClick={() => handleAddRoutine(routineGroup.id, RoutineType.INTERVAL)}>
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
