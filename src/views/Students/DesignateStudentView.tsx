import { Box, Card, CardContent, CardHeader, TextField } from '@mui/material';
import { SyntheticEvent, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRequestApi } from '../../api/useApi';
import { AppForm } from '../../components';
import { AppSaveButton } from '../../components/AppCustomButton';
import AppBackButton from '../../components/AppCustomButton/AppBackButton';
import { studentsService } from '../../services/students.service';
import { SHARED_CONTROL_PROPS } from '../../utils/form';
import StudentAllocation, { IStudentAllocation } from './StudentAllocation';

interface Props {
  student: {
    id: string;
    name: string;
    course_id: string;
    grade_id: string;
    class_group_id: string;
  };
}

const DesignateStudentView = () => {
  const { state } = useLocation();

  const { student } = state as Props;

  const [updateStudent, isSaving] = useRequestApi(studentsService.update);

  const [allocation, setAllocation] = useState<IStudentAllocation>({
    course_id: student.course_id,
    grade_id: student.grade_id,
    class_group_id: student.class_group_id,
  });

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const response = await updateStudent({
        id: student.id,
        data: allocation,
      });

      if (response?.success) {
        history.back();
      }
    },
    [student, allocation]
  );

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Associar aluno" />
        <CardContent>
          <TextField
            label="Aluno"
            name="name"
            value={student.name}
            inputProps={{ readOnly: true }}
            {...SHARED_CONTROL_PROPS}
          />
          <StudentAllocation
            onChange={(data) => setAllocation(data)}
            values={allocation}
            props={{ variant: 'outlined' }}
          />
          <Box marginTop={5} display={'flex'} justifyContent={'space-between'}>
            <AppSaveButton type="submit" disabled={isSaving} loading={isSaving} />
            <AppBackButton />
          </Box>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default DesignateStudentView;
