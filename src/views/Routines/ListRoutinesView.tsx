/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  TableContainer,
  Tabs,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { AppButton, AppLoading } from '../../components';

import { useApi } from '../../api/useApi';

import { AppAddButton, AppDeleteButton, AppSaveButton } from '../../components/AppCustomButton';

import { IRoutineGroup, routinesService } from '../../services/routines.service';
import { Box } from '@mui/system';

import RoutinesTable from './components/RoutinesTable';
import NameEditor from './components/NameEditor';
import { toast } from 'react-toastify';
import { schoolsService } from '../../services/schools.service';
import { addTime, getDuration, minutesToTime, timeToMinutes } from '../../utils/time';
import { RoutineType } from '../../services/models/IRoutine';

interface Props {
  onSuccess?: () => void;
}

const newRoutineDefaultValues = { id: '0', name: 'teste', routines: [] };

type IError = Record<string, Record<string, string[]>>;

/**
 * Renders "ListRoutinesView" view
 * url: /horarios/
 */
const ListRoutinesView = ({ onSuccess = () => {} }: Props) => {
  const [routineGroupsData, , loading] = useApi(routinesService.getAllRoutineGroups);

  const [classDuration, setClassDuration] = useState(50);
  const [intervalDuration, setIntervalDuration] = useState(20);

  const [selectedRoutineGroup, selectRoutineGroup] = useState<IRoutineGroup>({ ...newRoutineDefaultValues });

  const [routineGroupStartTime, setRoutineGroupStartTime] = useState('07:00:00');

  const [schoolParametersData] = useApi(schoolsService.getSchoolParameters);

  const [, , isCreatingRoutineGroup, createRoutineGroup] = useApi(
    routinesService.createRoutineGroup,
    {},
    { isRequest: true }
  );

  const [, , isRemovingRoutineGroup, removeRoutineGroup] = useApi(
    routinesService.removeRoutineGroup,
    {},
    { isRequest: true }
  );

  const [, , isUpdatingRoutineGroup, updateRoutineGroup] = useApi(
    routinesService.updateRoutineGroup,
    {},
    { isRequest: true }
  );

  const [, , isCreatingRoutine, createRoutine] = useApi(routinesService.createRoutine, {}, { isRequest: true });
  const [, , , removeRoutine] = useApi(routinesService.removeRoutine, {}, { isRequest: true });

  const [routineGroupsTabIndex, setRoutineGroupsTabIndex] = useState<number>(0);

  const [routineGroups, setRoutineGroups] = useState<IRoutineGroup[]>([]);

  const [errors, setErrors] = useState<IError | undefined>();

  useEffect(() => {
    if (routineGroupsData?.routineGroups) {
      setRoutineGroups(routineGroupsData.routineGroups);
    }
  }, [routineGroupsData]);

  useEffect(() => {
    if (routineGroups.length > 0) {
      setRoutineGroupsTabIndex(0);
      selectRoutineGroup(routineGroups[0]);
    }
  }, [routineGroups]);

  useEffect(() => {
    setClassDuration(schoolParametersData?.schoolParameters.class_length || 45);
  }, [schoolParametersData]);

  const calculateRoutinesStartTime = () => {
    let start_at = routineGroupStartTime;
    let duration = '00:00:00';

    const calculated = routineGroups.map((routineGroup) => ({
      ...routineGroup,
      routines: routineGroup.routines.map((routine) => {
        start_at = addTime(start_at, duration);
        duration = routine.duration;
        console.log(start_at, duration);
        return { ...routine, start_at };
      }),
    }));

    return calculated;
  };

  const handleChangeRoutineValue = (routineId: string, event: any) => {
    const updatedRoutineGroups = routineGroups.map((routineGroup) => ({
      id: routineGroup.id,
      name: routineGroup.name,
      routines: routineGroup.routines.map((routine) => {
        if (routine.id === routineId) {
          return { ...routine, [event.target.name as 'id']: event.target.value };
        }
        return routine;
      }),
    }));
    setRoutineGroups(updatedRoutineGroups);
  };

  const handleRemoveRoutine = async (routineId: string) => {
    const response = await removeRoutine({ id: routineId });

    if (response?.success) {
      const updatedRoutineGroup = {
        ...selectedRoutineGroup,
        routines: selectedRoutineGroup.routines.filter((routine) => routine.id !== routineId),
      };
      selectRoutineGroup(updatedRoutineGroup);
    }
  };

  const handleRemoveRoutineGroup = async (routineGroupId: string) => {
    const response = await removeRoutineGroup({ id: routineGroupId });

    if (response?.success) {
      const newRoutineGroup = routineGroups.filter((routineGroup) => routineGroup.id !== routineGroupId);
      setRoutineGroupsTabIndex(0);
      setRoutineGroups(newRoutineGroup);
    }
  };

  const handleAddRoutine = async (routineGroupId: string, type: RoutineType) => {
    const routineGroupExists = routineGroups.find((routineGroup) => routineGroup.id === routineGroupId);

    let start_at = routineGroupStartTime;

    if (routineGroupExists && routineGroupExists?.routines.length > 0) {
      const lastRoutine = routineGroupExists.routines[routineGroupExists.routines.length - 1];
      start_at = addTime(lastRoutine.start_at, lastRoutine.duration);
    }
    const duration = type === RoutineType.CLASS ? minutesToTime(classDuration) : minutesToTime(intervalDuration);

    const response = await createRoutine({ data: { routine_group_id: routineGroupId, start_at, duration, type } });

    if (response?.success) {
      const { id } = response.routine;

      const updatedRoutineGroup = {
        ...selectedRoutineGroup,
        routines: selectedRoutineGroup.routines.concat([{ id, start_at, duration, type }]),
      };
      selectRoutineGroup(updatedRoutineGroup);
    }
  };

  const handleChangeName = (routineGroupId: string, value: string) => {
    const updatedRoutineGroups = routineGroups.map((routineGroup) => {
      if (routineGroup.id === routineGroupId) {
        return {
          ...routineGroup,
          name: value,
        };
      }
      return routineGroup;
    });
    setRoutineGroups(updatedRoutineGroups);
  };

  const handleAddRoutineGroup = async () => {
    const response = await createRoutineGroup({ data: { name: '', routines: [] } });

    if (response?.success) {
      setRoutineGroups((previous) =>
        previous.concat([
          {
            id: response.routineGroup.id,
            name: response.routineGroup.name,
            routines: response.routineGroup.routines,
          },
        ])
      );
      setRoutineGroupsTabIndex(routineGroups?.length);
    }
  };

  const handleSaveRoutineGroup = async () => {
    const { id, name, routines } = selectedRoutineGroup;
    const response = await updateRoutineGroup({ id, data: { name, routines } });
    if (response?.success) {
      toast.success('Período salvo com sucesso');
    }
  };

  const handleChangeRoutineDuration = (routineId: string, duration: string) => {
    calculateRoutinesStartTime();
  };

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    setRoutineGroupsTabIndex(index);
    selectRoutineGroup(routineGroups[index]);
  };

  useEffect(() => {
    calculateRoutinesStartTime();
  }, [routineGroupStartTime]);

  if (loading) {
    return <AppLoading />;
  }

  const duration = selectedRoutineGroup.routines.reduce((total, routine) => {
    if (routine.type !== RoutineType.CLASS) {
      return total;
    }
    return total + timeToMinutes(routine.duration);
  }, 0);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader style={{ textAlign: 'center' }} title="Períodos" subheader="Lista de horários dos períodos" />
          <CardContent>
            <TableContainer component={Paper} sx={{ minWidth: 350 }}>
              <Box display={'flex'} flexDirection="row" justifyContent="space-between">
                <Tabs value={routineGroupsTabIndex} onChange={handleChangeTab}>
                  {routineGroups.map((routineGroup) => (
                    <Tab key={routineGroup.id} label={routineGroup.name || 'Novo Período'} />
                  ))}
                </Tabs>

                <AppAddButton
                  style={{ marginRight: 6 }}
                  color="info"
                  onClick={handleAddRoutineGroup}
                  loading={isCreatingRoutineGroup}
                  disabled={isCreatingRoutineGroup}
                  label="Novo Período"
                />
              </Box>
              <Divider />

              {routineGroups.length > 0 && (
                <>
                  <Grid container style={{ padding: 15 }} spacing={2}>
                    <Grid item md={6}>
                      <NameEditor
                        value={selectedRoutineGroup.name}
                        onSave={(value) => handleChangeName(selectedRoutineGroup.id, value)}
                      />
                    </Grid>
                    <Grid item md={8} display={'flex'} justifyContent={'space-between'} gap={2}></Grid>
                    <Grid item md={12} display={'flex'} justifyContent={'space-between'} gap={2}>
                      <TextField
                        name="routinesGroupStart"
                        label="Hora de Início"
                        type="time"
                        size="small"
                        fullWidth
                        // value={routine.end_at ? Moment(routine.end_at).format('HH-MM-SS') : ''}
                        value={routineGroupStartTime}
                        onChange={(event) => setRoutineGroupStartTime(event.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        name="class_duration"
                        label="Duração de aula"
                        type="number"
                        fullWidth
                        size="small"
                        // value={routine.end_at ? Moment(routine.end_at).format('HH-MM-SS') : ''}
                        value={classDuration}
                        onChange={(event) => setClassDuration(Number(event.target.value))}
                        variant="outlined"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">min</InputAdornment>,
                        }}
                        // InputProps={{ disableUnderline: true }}
                      />
                      <TextField
                        name="interval_duration"
                        label="Duração do Intervalo"
                        type="number"
                        fullWidth
                        size="small"
                        // value={routine.end_at ? Moment(routine.end_at).format('HH-MM-SS') : ''}
                        value={intervalDuration}
                        onChange={(event) => setIntervalDuration(Number(event.target.value))}
                        variant="outlined"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">min</InputAdornment>,
                        }}
                        // InputProps={{ disableUnderline: true }}
                      />
                      <TextField
                        name="classes_duration"
                        label="Tempo Total de Aula"
                        size="small"
                        value={duration}
                        fullWidth
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: <InputAdornment position="end">min</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <RoutinesTable
                    routineGroup={selectedRoutineGroup}
                    handleAddRoutine={handleAddRoutine}
                    handleRemoveRoutine={handleRemoveRoutine}
                    handleChangeRoutineValue={handleChangeRoutineValue}
                    isAddingRoutine={isCreatingRoutine}
                    handleChangeRoutineDuration={handleChangeRoutineDuration}
                  />
                  <Box display={'flex'} justifyContent="space-between" alignItems={'center'} style={{ padding: 7 }}>
                    <AppSaveButton
                      loading={isUpdatingRoutineGroup}
                      disabled={isUpdatingRoutineGroup}
                      onClick={() => handleSaveRoutineGroup()}
                    />
                    <AppButton onClick={() => console.table(routineGroups)}>log</AppButton>
                    <AppDeleteButton
                      onClick={() => handleRemoveRoutineGroup(selectedRoutineGroup.id)}
                      loading={isRemovingRoutineGroup}
                      disabled={isRemovingRoutineGroup}
                    />
                  </Box>
                </>
              )}
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListRoutinesView;
