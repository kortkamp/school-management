/* eslint-disable @typescript-eslint/no-shadow */
import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, DEFAULT_FORM_STATE } from '../../utils/form';
import { examsService } from '../../services/exams.service';
import Moment from 'moment';
import { teacherClassGroupsService } from '../../services/teacherClassGroups.service';
import { useAppMessage } from '../../utils/message';
import { IListTerms, termsService } from '../../services/terms.service';
import { examSubType, examType } from '../../services/IExam';
// import * as yup from 'yup';

interface FormStateValues {
  type: string;
  sub_type: string;
  reference_id: string;
  subject_id: string;
  class_id: string;
  term_id: string;
  value: number | '';
  weight: number;
  date: Date | null;
}

interface ITeacherClassGroup {
  subject_id: string;
  subject: {
    id: string;
    name: string;
  };
}

interface ITeacherClassGroupResponse {
  id: string;
  name: string;
  grade: {
    id: string;
    name: string;
  };
  teacherClassGroups: ITeacherClassGroup[];
}

interface Props {
  examId?: string;
  getExamData?: (data: FormStateValues) => void;
}

const createExamSchema = {
  // name: yup.string().required('O campo é obrigatório'),
  // start_at: yup.date().required('O campo é obrigatório'),
  // address: yup.string().required('O campo é obrigatório'),
  // number: yup.string().required('O campo é obrigatório'),
  // complement: yup.string().required('O campo é obrigatório'),
  // district: yup.string().required('O campo é obrigatório'),
  // city: yup.string().required('O campo é obrigatório'),
  // state: yup.string().required('O campo é obrigatório'),
  // CEP: yup.string().required('O campo é obrigatório'),
};

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
const CreateExamView: React.FC<Props> = ({ examId, getExamData }) => {
  const history = useHistory();
  const { id: examIdParam } = useParams<{ id: string }>();

  const [state, dispatch] = useAppStore();

  const [AppMessage, setMessage] = useAppMessage();

  const [formState, setFormState, onFieldChange, , , , setField] = useAppForm({
    validationSchema: createExamSchema, // the state value, so could be changed in time
    initialValues: {
      type: '',
      sub_type: '',
      reference_id: '',
      subject_id: '',
      class_id: '',
      term_id: '',
      value: '',
      weight: 1,
      date: null,
    } as FormStateValues,
  });
  const [classGroups, setClassGroups] = useState<ITeacherClassGroupResponse[]>([]);
  const [subjects, setSubjects] = useState<ITeacherClassGroup[]>([]);
  const [terms, setTerms] = useState<IListTerms['terms']>([]);
  const values = formState.values as FormStateValues;

  const [loading, setLoading] = useState(true);

  const [termError, setTermError] = useState<string | null>(null);

  const editingExamId = examIdParam || examId;

  const loadData = useCallback(() => {
    // Component Mount
    let componentMounted = true;

    async function fetchData() {
      // TODO: Call any Async API here
      try {
        if (state.currentUser?.id) {
          const response = await teacherClassGroupsService.getAllbyTeacher(state.currentUser.id);

          setClassGroups(response.data.teacherClasses);
        }

        const termsResponse = await termsService.getAll({ schoolId: '', token: '', args: {} });

        setTerms(termsResponse.terms);

        if (editingExamId) {
          const examResponse = await examsService.getById(editingExamId);
          setFormState({ ...DEFAULT_FORM_STATE, isValid: true, values: examResponse });
        }
      } catch (err: any) {
        console.log(err);
      }

      if (!componentMounted) return; // Component was unmounted during the API call
      // TODO: Verify API call here

      setLoading(false); // Reset "Loading..." indicator
    }
    fetchData(); // Call API asynchronously

    return () => {
      // Component Un-mount
      componentMounted = false;
    };
  }, [editingExamId]);

  useEffect(() => {
    loadData();
  }, [editingExamId, loadData]);

  useEffect(() => {
    setField('subject_id', '');
    const subjects = classGroups.find((classGroup) => classGroup.id === values.class_id)?.teacherClassGroups;
    if (subjects) {
      setSubjects(subjects);
      if (subjects.length === 1) {
        setField('subject_id', subjects[0].subject_id);
      }
    }
  }, [values.class_id]);

  // autofill term based on chosen date
  useEffect(() => {
    const date = values.date;
    if (date) {
      const examTerm = terms.find((term) => date >= term.start_at && date <= term.end_at);
      if (examTerm) {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            term_id: examTerm?.id,
          },
        }));
        setTermError(null);
      } else {
        setTermError('A data não pertence a nenhum bimestre');
      }
    }
  }, [values.date]);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      try {
        if (editingExamId) {
          await examsService.update(editingExamId, {
            type: values.type,
            sub_type: values.sub_type,
            reference_id: values.reference_id,
            value: values.value,
            weight: values.weight,
            date: values.date,
            term_id: values.term_id,
          });
        } else {
          await examsService.create(values);
        }
        if (getExamData) {
          getExamData(values);
        }
        history.replace('/exames');
      } catch (err: any) {
        console.log(err);
        setMessage({ type: 'error', text: err.response.data.message });
      }
    },
    [dispatch, values, history]
  );

  if (loading) return <LinearProgress />;

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card style={{ marginTop: '50px' }}>
        <CardHeader
          style={{ textAlign: 'center' }}
          title={editingExamId ? 'Editar Prova ou Trabalho' : 'Adicionar Prova ou Trabalho'}
        />
        <CardContent>
          <TextField
            required
            select
            label="Tipo"
            name="type"
            value={values.type}
            onChange={onFieldChange}
            style={{ minWidth: '100%' }}
            {...SHARED_CONTROL_PROPS}
          >
            {Object.values(examType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            select
            label="SubTipo"
            name="sub_type"
            value={values.sub_type}
            onChange={onFieldChange}
            style={{ minWidth: '100%' }}
            {...SHARED_CONTROL_PROPS}
          >
            {Object.values(examSubType).map((subType) => (
              <MenuItem key={subType} value={subType}>
                {subType}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            disabled={editingExamId ? true : false}
            select
            label="Turma"
            name="class_id"
            value={values.class_id}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            {classGroups.map((classGroup) => {
              return (
                <MenuItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name + ' - ' + classGroup.grade.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            required
            select
            label="Matéria"
            disabled={editingExamId ? true : false}
            name="subject_id"
            value={values.subject_id}
            onChange={onFieldChange}
            style={{ minWidth: '100%' }}
            {...SHARED_CONTROL_PROPS}
          >
            {subjects.map((subject) => {
              return (
                <MenuItem key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject.name}.
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            required
            label="Valor"
            name="value"
            type="number"
            value={values.value}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          {/* <TextField
            required
            label="Peso"
            name="weight"
            type="number"
            value={values.weight}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          /> */}
          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Data"
            name="date"
            value={values.date ? Moment(values.date).utcOffset('+0300').format('YYYY-MM-DD') : ''}
            onChange={onFieldChange}
            error={termError !== null}
            helperText={termError}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            // disabled={editingExamId}
            select
            label="Bimestre"
            name="term_id"
            value={values.term_id}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            {terms.map((term) => {
              return (
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              );
            })}
          </TextField>

          <Grid item md={12} sm={12} xs={12}>
            <AppMessage />
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              {editingExamId ? 'SALVAR' : 'ADICIONAR'}
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default CreateExamView;
