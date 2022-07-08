import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AppButton, AppLink, AppLoading } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { IListTerms, termsService } from '../../services/terms.service';
import Moment from 'moment';
import { CommonDialog } from '../../components/dialogs';
import { useAppMessage } from '../../utils/message';
import { IRoutine, routinesService } from '../../services/routines.service';
import { subjectsService } from '../../services/subjects.service';

interface ISubject {
  id: string;
  name: string;
  segment: {
    id: string;
    name: string;
  };
}

interface IRoutineSubject {
  routine_id: string;
  subject_id: string;
  class_group_id: string;
  week_day: number;
}

/**
 * Renders "ListTermsView" view
 * url: /horarios/*
 */
const RoutinesView = () => {
  const weekDays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [routineSubjects, setRoutineSubjects] = useState<IRoutineSubject[]>([]);
  const [defaultRoutineSubjects, setDefaultRoutineSubjects] = useState<IRoutineSubject[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  const [selectedClassGroup, setSelectedClassGroup] = useState<any>();

  const [loading, setLoading] = useState(false);

  const [dataHasBeenUpdated, setDataHasBeenUpdated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [allocation, setAllocation] = useState<IAllocation>({
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  const [modal, setModal] = useState<ReactNode | null>(null);

  const [AppMessage, setMessage] = useAppMessage();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    const fetchData = async () => {
      const routinesResponse = await routinesService.getAll();

      const subjectsResponse = await subjectsService.getAll();

      if (!mounted.current) {
        return;
      }

      setSubjects(subjectsResponse.data.subjects);
      setRoutines(routinesResponse);
    };

    fetchData();
  }, []);

  const loadSubjects = useCallback(async () => {
    const fetchData = async () => {
      const subjectsResponse = await subjectsService.getAll();

      if (!mounted.current) {
        return;
      }

      setSubjects(subjectsResponse.data.subjects);
    };

    fetchData();
  }, []);

  const loadRoutineSubjects = useCallback(async () => {
    setMessage(undefined);
    setLoading(true);

    const data = await routinesService.getRoutineSubjectsByClassGroup(selectedClassGroup.id);
    setRoutineSubjects([...data]);
    setDefaultRoutineSubjects(data);
    setLoading(false);
  }, [selectedClassGroup]);

  useEffect(() => {
    if (routines.length && subjects.length && selectedClassGroup) {
      loadRoutineSubjects();
    }
  }, [routines, subjects, selectedClassGroup]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const onSelectRoutineSubject = (data: Omit<IRoutineSubject, 'class_group_id'>) => {
    setRoutineSubjects((routineSubjects) => {
      const routineSubjectExists = routineSubjects.find(
        (item) => item.routine_id === data.routine_id && item.week_day === data.week_day
      );
      if (routineSubjectExists?.subject_id !== data.subject_id) {
        setDataHasBeenUpdated(true);
      }
      if (routineSubjectExists) {
        routineSubjectExists.subject_id = data.subject_id;
      } else {
        routineSubjects.push({ ...data, class_group_id: selectedClassGroup.id });
      }

      return routineSubjects;
    });
  };

  const handleSaveRoutineSubjects = async () => {
    setIsSaving(true);
    try {
      await routinesService.saveRoutineSubjects({ routine_subjects: routineSubjects });
      setMessage({ type: 'success', text: 'Horários salvos com sucesso' });
    } catch (err: any) {
      console.log(err);
      setMessage({ type: 'error', text: err.response.data.message });
    }
    setIsSaving(false);
    setDataHasBeenUpdated(false);
  };

  return (
    <>
      {modal}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card style={{ padding: '20px' }}>
            <CardHeader style={{ textAlign: 'center' }} title="Horários" subheader="Lista de horários da semana" />
            <CardContent>
              <Grid container spacing={1}>
                <AppAllocationSelect onChange={setAllocation} getClassGroup={setSelectedClassGroup} />
              </Grid>
              {loading ? (
                <AppLoading />
              ) : (
                selectedClassGroup && (
                  <Grid>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Hora (início)</TableCell>
                            {weekDays.slice(1, 6).map((weekDay) => (
                              <TableCell key={weekDay} align="center">
                                {weekDay}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {routines
                            .filter((routine) => routine.day_time === selectedClassGroup.day_time)
                            .map((row) => (
                              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                  {row.start_at.slice(0, 5)}
                                </TableCell>
                                {weekDays.map((weekDay, index) => {
                                  const routineSubject = defaultRoutineSubjects.find(
                                    (routineSubject) =>
                                      routineSubject.week_day === index && routineSubject.routine_id === row.id
                                  );
                                  const value = routineSubject?.subject_id || '';
                                  if (index > 0 && index < 6)
                                    return (
                                      <TableCell key={weekDay} align="center">
                                        <TextField
                                          select
                                          defaultValue={value}
                                          fullWidth
                                          onChange={(event) =>
                                            onSelectRoutineSubject({
                                              routine_id: row.id,
                                              subject_id: event.target.value,
                                              week_day: index,
                                            })
                                          }
                                          style={{ width: 200 }}
                                          // {...SHARED_CONTROL_PROPS}
                                        >
                                          <MenuItem value={''}>Vaga</MenuItem>
                                          {subjects
                                            .filter((subject) => subject.segment.id === allocation.segmentId)
                                            .map((subject) => (
                                              <MenuItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                              </MenuItem>
                                            ))}
                                        </TextField>
                                      </TableCell>
                                    );
                                })}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Grid item md={12} sm={12} xs={12}>
                      <AppMessage />
                    </Grid>
                    <AppButton
                      loading={isSaving}
                      disabled={!dataHasBeenUpdated}
                      onClick={() => handleSaveRoutineSubjects()}
                    >
                      SALVAR
                    </AppButton>
                  </Grid>
                )
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default RoutinesView;
