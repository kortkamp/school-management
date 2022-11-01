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
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppButton, AppLoading } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { useAppMessage } from '../../utils/message';
import { IRoutine, routinesService } from '../../services/routines.service';
import { subjectsService } from '../../services/subjects.service';
import SubjectsTimeTable from '../../components/SubjectsTimeTable';
import { useApi } from '../../api/useApi';

interface IRoutineSubject {
  routine_id: string;
  subject_id: string;
  class_group_id: string;
  week_day: number;
}

interface ISubjectsTotalTime {
  id: string;
  name: string;
  time: number;
}

/**
 * Renders "ListTermsView" view
 * url: /horarios/*
 */
const RoutinesView = () => {
  const weekDays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  const [subjects, , loadingSubjects] = useApi(subjectsService.getAll, { defaultValue: [] });

  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [routineSubjects, setRoutineSubjects] = useState<IRoutineSubject[]>([]);
  const [defaultRoutineSubjects, setDefaultRoutineSubjects] = useState<IRoutineSubject[]>([]);
  const [subjectsTime, setSubjectsTime] = useState<ISubjectsTotalTime[]>([]);

  const [allocation, setAllocation] = useState<IAllocation>({
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  const [selectedClassGroup, setSelectedClassGroup] = useState<any>();

  const [loading, setLoading] = useState(false);
  const [dataHasBeenUpdated, setDataHasBeenUpdated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

      if (!mounted.current) {
        return;
      }

      setRoutines(routinesResponse);
    };

    fetchData();
  }, []);

  const loadRoutineSubjects = useCallback(async () => {
    setMessage(undefined);
    setLoading(true);

    const data = await routinesService.getRoutineSubjectsByClassGroup(selectedClassGroup.id);

    setRoutineSubjects([...data]);
    setDefaultRoutineSubjects([...data]);
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

  const generateSubjectsResume = () => {
    const newSubjectsTime = subjects
      .filter((subject) => subject.segment_id === selectedClassGroup?.grade?.segment.id)
      .map((subject) => {
        const subjectTimes = routineSubjects.filter(
          (routineSubject) => routineSubject.subject_id === subject.id
        ).length;

        return { id: subject.id, name: subject.name, time: subjectTimes };
      });
    const total = newSubjectsTime.reduce((totalTime, subjectTime) => totalTime + subjectTime.time, 0);
    newSubjectsTime.push({ id: 'total', name: 'Total', time: total });
    setSubjectsTime(newSubjectsTime);
  };

  // update the subject total time resume
  useEffect(() => {
    generateSubjectsResume();
  }, [subjects, routineSubjects]);

  const onSelectRoutineSubject = (data: Omit<IRoutineSubject, 'class_group_id'>) => {
    setRoutineSubjects((prevRoutineSubjects) => {
      const routineSubjectExists = prevRoutineSubjects.find(
        (item) => item.routine_id === data.routine_id && item.week_day === data.week_day
      );
      if (routineSubjectExists?.subject_id !== data.subject_id) {
        setDataHasBeenUpdated(true);
      }
      if (routineSubjectExists) {
        routineSubjectExists.subject_id = data.subject_id;
      } else {
        prevRoutineSubjects.push({ ...data, class_group_id: selectedClassGroup.id });
      }

      return prevRoutineSubjects;
    });
    generateSubjectsResume();
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

  const isLoading = loadingSubjects;

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <>
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
                                    (item) => item.week_day === index && item.routine_id === row.id
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
                                            .filter((subject) => subject.segment_id === allocation.segmentId)
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
          {selectedClassGroup && (
            <Card style={{ padding: '20px' }}>
              <CardHeader
                style={{ textAlign: 'center' }}
                title="Carga Horária"
                subheader="Carga Horária das disciplinas"
              />
              <CardContent aria-orientation="horizontal">
                <SubjectsTimeTable data={subjectsTime} loading={loading} />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default RoutinesView;
