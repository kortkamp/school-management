/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import { examsService } from '../../services/exams.service';

import { useRequestApi } from '../../api/useApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppView, { AppViewActions, AppViewParams } from '../../components/AppView';
import { AppSaveButton } from '../../components/AppCustomButton';
import { toast } from 'react-toastify';
import { Grid, MenuItem } from '@mui/material';
import FormStandardInput from '../../components/HookFormInput/FormStandardInput';
import { useState } from 'react';
import { examType } from '../../services/IExam';
import FormNumberFormat from '../../components/HookFormInput/FormNumberFormat';

interface FormValues {
  type: string;
  value: string;
  subject_id: string;
  class_group_id: string;
  date: string;
  term_id: string;
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
  getExamData?: (data: FormValues) => void;
}

const schema = yup.object({});

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
const CreateExamView: React.FC<Props> = ({ examId, getExamData }) => {
  const history = useHistory();
  const { id: examIdParam } = useParams<{ id: string }>();

  const [isEditing, setIsEditing] = useState(true);

  const [createExam, creating] = useRequestApi(examsService.create);

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // autofill term based on chosen date
  // useEffect(() => {
  //   const date = values.date;
  //   if (date) {
  //     const examTerm = terms.find((term) => date >= term.start_at && date <= term.end_at);
  //     if (examTerm) {
  //       setFormState((formState) => ({
  //         ...formState,
  //         values: {
  //           ...formState.values,
  //           term_id: examTerm?.id,
  //         },
  //       }));
  //       setTermError(null);
  //     } else {
  //       setTermError('A data não pertence a nenhum bimestre');
  //     }
  //   }
  // }, [values.date]);

  const onSubmit = async (formData: FormValues) => {
    let response: any;

    console.log(formData);
    toast.success('Aluno cadastrado com sucesso');
  };

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>
      <AppView title="Nova Avaliação">
        <AppViewParams>
          <Grid item md={6} sm={6} xs={4}>
            <FormStandardInput
              name={'type'}
              select
              label={'Type de Avaliação'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.type?.message}
              fullWidth
            >
              {Object.values(examType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={6} sm={6} xs={4}>
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
              errorMessage={errors?.date?.message}
              fullWidth
            />
          </Grid>
          <Grid item md={6} sm={6} xs={4}>
            <FormStandardInput
              name={'term_id'}
              select
              label={'Fase do ano letivo'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.term_id?.message}
              fullWidth
            >
              {([] as any).map((term: any) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={6} sm={6} xs={4}>
            <FormStandardInput
              name={'subject_id'}
              select
              label={'Disciplina'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.subject_id?.message}
              fullWidth
            >
              {([] as any).map((term: any) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
          <Grid item md={6} sm={6} xs={4}>
            <FormStandardInput
              name={'class_group_id'}
              select
              label={'Turma'}
              control={control}
              editable={isEditing}
              errorMessage={errors?.class_group_id?.message}
              fullWidth
            >
              {([] as any).map((classGroup: any) => (
                <MenuItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name}
                </MenuItem>
              ))}
            </FormStandardInput>
          </Grid>
        </AppViewParams>
        <AppViewActions>
          <AppSaveButton type="submit" loading={creating} disabled={creating}></AppSaveButton>
        </AppViewActions>
      </AppView>
    </form>
  );
};

export default CreateExamView;
