/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from '../../../api/useApi';
import { AppButton } from '../../../components';
import AppContextMenu from '../../../components/AppContextMenu';
import { AppSaveButton } from '../../../components/AppCustomButton';
import { RoutineType } from '../../../services/models/IRoutine';
import { IRoutineGroup, routinesService } from '../../../services/routines.service';
import { schoolsService } from '../../../services/schools.service';
import { generateTempID, isTempID } from '../../../utils/tempID';
import { addTime, minutesToTime, timeToMinutes } from '../../../utils/time';

import NameEditor from './NameEditor';
import RoutinesTable from './RoutinesTable';

interface IFormError {
  name?: string;
}

interface Props {
  routineGroup: IRoutineGroup;
  isRemovingRoutineGroup?: boolean;
  handleRemoveRoutineGroup: (id: string) => void;
  handleServerRemoveRoutineGroup: (id: string) => void;
  onSave: (data: IRoutineGroup) => void;
  finishCreation?: () => void;
}

const RoutineGroupView = ({
  isRemovingRoutineGroup = false,
  handleRemoveRoutineGroup,
  handleServerRemoveRoutineGroup,
  routineGroup,
  onSave,
  finishCreation,
}: Props) => {
  const [, , isCreatingRoutineGroup, createRoutineGroup] = useApi(routinesService.createRoutineGroup, {
    isRequest: true,
  });

  const [, , isUpdatingRoutineGroup, saveRoutineGroup] = useApi(routinesService.updateRoutineGroup, {
    isRequest: true,
  });
  const [selectedRoutineGroup, selectRoutineGroup] = useState<IRoutineGroup>(routineGroup);

  const [classDuration, setClassDuration] = useState(50);
  const [intervalDuration, setIntervalDuration] = useState(20);

  const [routineGroupStartTime, setRoutineGroupStartTime] = useState('07:00:00');

  const [schoolParametersData] = useApi(schoolsService.getSchoolParameters, {});

  const [isDataTouched, setIsDataTouched] = useState(false);

  const [errors, setErrors] = useState<IFormError>({});

  const isNewRoutineGroup = isTempID(selectedRoutineGroup?.id || '');

  useEffect(() => {
    setClassDuration(schoolParametersData?.schoolParameters.class_length || 45);
  }, [schoolParametersData]);

  useEffect(() => {
    if (routineGroup.routines.length) {
      setRoutineGroupStartTime(routineGroup.routines[0].start_at);
    }
  }, [routineGroup]);

  const validateName = (name: string) => {
    if (!name) {
      return 'O Nome do turno não pode ser nulo';
    }
    return '';
  };

  const validate = () => {
    let isValid = true;
    const nameError = validateName(selectedRoutineGroup.name);
    if (nameError) {
      setErrors((prev) => ({ ...prev, name: nameError }));
      isValid = false;
    }

    return isValid;
  };

  const organizedRoutines = (routines: IRoutineGroup['routines']) => {
    let start_at = routineGroupStartTime;
    let duration = '00:00:00';

    const updatedRoutines = routines.map((routine) => {
      start_at = addTime(start_at, duration);
      duration = routine.duration;
      return { ...routine, start_at };
    });

    return updatedRoutines;
  };

  const handleAddRoutine = async (type: RoutineType) => {
    let startAt = routineGroupStartTime;

    const lastRoutine = selectedRoutineGroup.routines[selectedRoutineGroup.routines.length - 1];
    if (lastRoutine) {
      startAt = addTime(lastRoutine.start_at, lastRoutine.duration);
    }

    const duration = type === RoutineType.CLASS ? minutesToTime(classDuration) : minutesToTime(intervalDuration);

    const updatedRoutineGroup = {
      ...selectedRoutineGroup,
      routines: selectedRoutineGroup.routines.concat([{ id: generateTempID(), start_at: startAt, duration, type }]),
    };
    selectRoutineGroup(updatedRoutineGroup);
    setIsDataTouched(true);
  };

  const handleRemoveRoutine = async (routineId: string) => {
    const updatedRoutineGroup = {
      ...selectedRoutineGroup,
      routines: organizedRoutines(selectedRoutineGroup.routines.filter((routine) => routine.id !== routineId)),
    };
    selectRoutineGroup(updatedRoutineGroup);
    setIsDataTouched(true);
  };

  const handleChangeRoutineValue = (routineId: string, event: any) => {
    const updatedRoutineGroups = {
      id: selectedRoutineGroup.id,
      name: selectedRoutineGroup.name,
      routines: selectedRoutineGroup.routines.map((routine) => {
        if (routine.id === routineId) {
          return { ...routine, [event.target.name as 'id']: event.target.value };
        }
        return routine;
      }),
    };
    selectRoutineGroup(updatedRoutineGroups);
  };

  const handleChangeName = (name: string) => {
    selectRoutineGroup((prev) => ({ ...prev, name }));
    setIsDataTouched(true);
  };

  const handleChangeRoutineDuration = (routineId: string, duration: number) => {
    const updatedRoutines = selectedRoutineGroup.routines.map((routine) => {
      if (routine.id === routineId) {
        return { ...routine, duration: minutesToTime(duration) };
      }
      return routine;
    });
    selectRoutineGroup((prev) => ({ ...prev, routines: organizedRoutines(updatedRoutines) }));
  };

  const updateRoutineGroup = async ({ id, name, routines }: IRoutineGroup) => {
    const routinesWithoutTempID = routines.map((routine) => {
      const { id: routineId, duration, start_at, type } = routine;
      if (isTempID(routineId)) {
        return { type, start_at, duration };
      }
      return { id: routineId, duration, start_at, type };
    });

    const response = await saveRoutineGroup({ id, data: { name, routines: routinesWithoutTempID } });
    if (response?.success) {
      toast.success('Turno gravado com sucesso');
    }
    return response;
  };

  const createServerRoutineGroup = async ({ name, routines }: IRoutineGroup) => {
    const routinesWithoutTempID = routines.map((routine) => {
      const { duration, start_at, type } = routine;
      return { type, start_at, duration };
    });
    const response = await createRoutineGroup({ data: { name, routines: routinesWithoutTempID } });
    if (response?.success) {
      toast.success('Turno criado com sucesso');
    }

    return response;
  };

  const handleSaveRoutineGroup = async () => {
    const { id } = selectedRoutineGroup;

    const isCreatingNew = isTempID(id);

    const isValid = validate();

    if (!isValid) {
      return;
    }

    let response: any;

    if (isCreatingNew) {
      response = await createServerRoutineGroup(selectedRoutineGroup);
    } else {
      response = await updateRoutineGroup(selectedRoutineGroup);
    }
    if (response?.success) {
      onSave(response.routineGroup);
      setIsDataTouched(false);
      selectRoutineGroup(response.routineGroup);
    }
  };

  const handleClickServerRemoveRoutineGroup = (id: string) => {
    if (!window.confirm('Deseja excluir o Turno?')) {
      return;
    }
    handleServerRemoveRoutineGroup(id);
  };

  const duration = selectedRoutineGroup?.routines?.reduce((total, routine) => {
    if (routine.type !== RoutineType.CLASS) {
      return total;
    }
    return total + timeToMinutes(routine.duration);
  }, 0);

  return (
    <Box>
      <Grid container style={{ padding: 15 }} spacing={2}>
        <Grid item md={12}>
          <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
            <NameEditor
              value={selectedRoutineGroup.name}
              onSave={(value) => handleChangeName(value)}
              validate={validateName}
              givenError={errors.name}
            />
            <AppContextMenu
              loading={isRemovingRoutineGroup}
              options={[
                {
                  label: 'Excluir o Turno',
                  action: () =>
                    isNewRoutineGroup
                      ? handleRemoveRoutineGroup(selectedRoutineGroup.id)
                      : handleClickServerRemoveRoutineGroup(selectedRoutineGroup.id),
                },
              ]}
            />
          </Box>
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
        handleChangeRoutineDuration={handleChangeRoutineDuration}
      />
      <Box display={'flex'} justifyContent="space-between" alignItems={'center'} style={{ padding: 7 }}>
        <AppSaveButton
          loading={isUpdatingRoutineGroup || isCreatingRoutineGroup}
          disabled={isUpdatingRoutineGroup || !isDataTouched}
          onClick={() => handleSaveRoutineGroup()}
          label={isNewRoutineGroup ? 'Criar Turno' : 'Gravar'}
        />
        {isNewRoutineGroup ? (
          <AppButton color="error" onClick={() => handleRemoveRoutineGroup(selectedRoutineGroup.id)}>
            Cancelar
          </AppButton>
        ) : (
          finishCreation && (
            <AppButton color="info" onClick={() => finishCreation()}>
              Finalizar
            </AppButton>
          )
        )}
      </Box>
    </Box>
  );
};

export default RoutineGroupView;
