/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { examsService, IExam } from '../../services/exams.service';

import Moment from 'moment';

import { useApi, useRequestApi } from '../../api/useApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppView, { AppViewActions, AppViewData, AppViewParams } from '../../components/AppView';
import { AppAddButton, AppSaveButton } from '../../components/AppCustomButton';
import { toast } from 'react-toastify';
import { Grid, MenuItem } from '@mui/material';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import { useCallback, useEffect, useState } from 'react';
import { examType } from '../../services/IExam';
import FormNumberFormat from '../../components/HookFormInput/FormNumberFormat';
import { schoolYearsService } from '../../services/schoolYears.service';
import { teachersService } from '../../services/teachers.service';
import { removeDuplicateIDs } from '../../utils/array';
import AppBackButton from '../../components/AppCustomButton/AppBackButton';
import { studentsService } from '../../services/students.service';
import ResultsTable from './components/ResultsTable';

export interface FormValues {
  type: string;
  value: string;
  subject_id: string;
  class_group_id: string;
  date: string;
  term_id: string;
  results?: { student_id: string; name: string; achievement: string }[];
}

const defaultValues = {
  type: '',
  subject_id: '',
  class_group_id: '',
  term_id: '',
  value: '',
  date: '',
};

interface Props {
  examId?: string;
}

const schema = yup.object({
  type: yup.string().required('O campo é obrigatório'),
  subject_id: yup.string().required('O campo é obrigatório'),
  class_group_id: yup.string().required('O campo é obrigatório'),
  term_id: yup.string().required('O campo é obrigatório'),
  value: yup
    .number()
    .typeError('Valor inválido')
    .positive('O valor precisa ser positivo')
    .required('Campo obrigatório'),
  date: yup.string().length(8, 'Data inválida').required('O campo é obrigatório'),
  results: yup.array().of(
    yup.object().shape({
      achievement: yup
        .number()
        .typeError('Valor inválido')
        // .positive('O valor precisa ser positivo')
        // .integer('O valor precisa ser inteiro')
        .min(0, 'A nota precisa ser maior que zero')
        .max(1, 'A nota não pode ser maior que o valor da prova')
        .required('Campo obrigatório'),

      // .min(yup.ref('value'), 'A nota não pode ser maior que o valor da avaliação'),
    })
  ),
});

interface LocationProps {
  exam: IExam;
}

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
const CreateExamView: React.FC<Props> = ({}) => {
  const history = useHistory();

  const [teacherClassGroups, setTeacherClassGroups] = useState<{ id: string; name: string }[]>([]);
  const [teacherSubjects, setTeacherSubjects] = useState<{ id: string; name: string }[]>([]);
  const [isEditing, setIsEditing] = useState(true);

  const { state } = useLocation() as { state: LocationProps };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { id, type, subject, class_group, term, value: examValue, date } = state?.exam || defaultValues;
  const isUpdatingExam = !!id;
  const formInitialValues = isUpdatingExam
    ? {
        type,
        subject_id: subject.id,
        class_group_id: class_group.id,
        term_id: term.id,
        value: String(examValue),
        date: Moment(date).format('DDMMYYYY'),
      }
    : defaultValues;

  const [schoolYearData, error, loadingSchoolYear] = useApi(schoolYearsService.getBySchool);
  const [teacherClassSubjects, , loadingTeacherClasses] = useApi(teachersService.getTeacherClassesByTeacher, {
    defaultValue: [],
  });
  const [getExamData, loadingExam] = useRequestApi(examsService.getById);

  const [createExam, creating] = useRequestApi(examsService.create);
  const [updateExam, updating] = useRequestApi(examsService.update);
  const [loadStudents, loadingStudents] = useRequestApi(studentsService.getAll);

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: formInitialValues,
    resolver: yupResolver(schema),
  });

  const fetchStudents = async () => {
    const studentsData = await loadStudents({
      page: 1,
      per_page: 1000,
      class_group_id: class_group.id,
      course_id: '',
      grade_id: '',
    });

    if (studentsData?.success) {
      const studentsResult = studentsData?.result.map((student) => ({
        student_id: student.id,
        name: student.person.name,
        achievement: '',
      }));

      if (!studentsResult.length) {
        toast.warning('Nenhum aluno encontrado na turma');
        return;
      }

      setValue('results', studentsResult);
    }
  };

  useEffect(() => {
    const fetchExamData = async () => {
      const examData = await getExamData({ id });
      if (examData?.success) {
        const studentsResult = examData.exam.results.map((result) => ({
          student_id: result.student.id,
          name: result.student.person.name,
          achievement: String(result.achievement),
        }));
        setValue('results', studentsResult);
      }
    };
    if (isUpdatingExam) {
      fetchExamData();
    }
  }, [isUpdatingExam]);

  useEffect(() => {
    const possibleDuplicatedTeacherClasses = teacherClassSubjects.map((t) => ({
      id: t.classGroup.id,
      name: t.classGroup.name,
    }));
    const teacherClasses = removeDuplicateIDs(possibleDuplicatedTeacherClasses);
    setTeacherClassGroups(teacherClasses);
    if (teacherClasses.length === 1) {
      setValue('class_group_id', teacherClasses[0].id);
    }

    const possibleDuplicatedTeacherSubjects = teacherClassSubjects.map((t) => ({
      id: t.subject.id,
      name: t.subject.name,
    }));

    const subjects = removeDuplicateIDs(possibleDuplicatedTeacherSubjects);
    setTeacherSubjects(subjects);
  }, [teacherClassSubjects]);

  useEffect(() => {
    const possibleDuplicatedTeacherSubjects = teacherClassSubjects
      .filter((t) => t.classGroup.id === watch('class_group_id'))
      .map((t) => ({
        id: t.subject.id,
        name: t.subject.name,
      }));

    const subjects = removeDuplicateIDs(possibleDuplicatedTeacherSubjects);
    setTeacherSubjects(subjects);
    if (subjects.length === 1) {
      setValue('subject_id', subjects[0].id);
    }
  }, [watch('class_group_id')]);

  const handleChangeDate = useCallback(
    (event: any) => {
      const formDate = event.target.value as string;
      const sanitizedDate = formDate.replace(/[ //]/g, '');
      if (sanitizedDate.length !== 8) {
        return;
      }
      const examDate = Moment(formDate, 'DDMMYYYY').toISOString() as any;
      const terms = schoolYearData?.schoolYear.terms;
      const examTerm = terms?.find((termItem) => termItem.start_at <= examDate && termItem.end_at >= examDate);
      setValue('term_id', examTerm?.id || '');
    },
    [schoolYearData]
  );

  const onSubmit = async (formData: FormValues) => {
    let response: any;

    const isoDate = Moment(formData.date, 'DDMMYYYY').toISOString();
    if (isUpdatingExam) {
      response = await updateExam({
        id,
        data: {
          ...formData,
          date: isoDate,
          results: formData.results?.map(({ student_id, achievement }) => ({ student_id, achievement })) || [],
        },
      });
    } else {
      response = await createExam({ ...formData, date: isoDate });
    }

    if (response?.success) {
      toast.success(isUpdatingExam ? 'Avaliação atualizada com sucesso' : 'Avaliação cadastrada com sucesso');
      history.push('/exames');
    }
  };

  const loading = loadingSchoolYear || loadingTeacherClasses || loadingExam;

  const studentsResults = watch('results');

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <AppView title={isUpdatingExam ? 'Avaliação' : 'Nova Avaliação'} loading={loading}>
        <AppViewParams>
          <Grid item md={4} sm={6} xs={6}>
            <FormStandardInput
              name={'type'}
              select
              label={'Tipo de Avaliação'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.type?.message}
              fullWidth
            >
              {Object.values(examType).map((examTypeItem) => (
                <MenuItem key={examTypeItem} value={examTypeItem}>
                  {examTypeItem}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={4} sm={6} xs={6}>
            <FormStandardInput
              name={'value'}
              label={'Valor'}
              type="number"
              control={control}
              editable={isEditing}
              errorMessage={errors?.value?.message}
              fullWidth
            />
          </Grid>
          <Grid item md={4} sm={6} xs={6}>
            <FormNumberFormat
              name={'date'}
              format="##/##/####"
              label={'Data'}
              control={control}
              editable={isEditing}
              onKeyUp={handleChangeDate}
              errorMessage={errors?.date?.message}
              fullWidth
            />
          </Grid>
          <Grid item md={4} sm={6} xs={6}>
            <FormStandardInput
              name={'term_id'}
              select
              label={'Fase do ano letivo'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.term_id?.message}
              fullWidth
            >
              {(schoolYearData?.schoolYear.terms || []).map((termItem: any) => (
                <MenuItem key={termItem.id} value={termItem.id}>
                  {termItem.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>

          <Grid item md={4} sm={6} xs={6}>
            <FormStandardInput
              name={'class_group_id'}
              select
              label={'Turma'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.class_group_id?.message}
              fullWidth
            >
              {teacherClassGroups.map((classGroup: any) => (
                <MenuItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={4} sm={6} xs={6}>
            <FormStandardInput
              name={'subject_id'}
              select
              label={'Disciplina'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.subject_id?.message}
              fullWidth
            >
              {teacherSubjects.map((subjectItem: any) => (
                <MenuItem key={subjectItem.id} value={subjectItem.id}>
                  {subjectItem.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
        </AppViewParams>
        {isUpdatingExam && (
          <AppViewData>
            <ResultsTable
              control={control}
              results={studentsResults || []}
              editable={true}
              errors={errors.results}
              examValue={Number(watch('value'))}
            />
          </AppViewData>
        )}
        <AppViewActions>
          <AppSaveButton type="submit" loading={creating} disabled={creating || !isDirty}></AppSaveButton>
          {isUpdatingExam && !studentsResults?.length && (
            <AppAddButton label="Informar Resultados" onClick={fetchStudents} />
          )}
          <AppBackButton />
        </AppViewActions>
      </AppView>
    </form>
  );
};

export default CreateExamView;
