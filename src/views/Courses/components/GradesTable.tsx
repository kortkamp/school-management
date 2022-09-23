import { Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Control, Controller } from 'react-hook-form';
import { AppIconButton } from '../../../components';
import { FormValues } from '../CourseView';

const useStyles = makeStyles((theme: Theme) => ({
  grades_list: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    // border: '1px solid',
    // borderColor: theme.palette.grey[400],
    // borderRadius: theme.shape.borderRadius,
  },
  class_groups: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  class_group_item: {
    width: 100,
  },
}));

interface Props {
  grades: {
    id: string;
    name: string;
    total_hours: number;
    days: number;
    class_groups?: {
      id: string;
      name: string;
    }[];
  }[];
  control: Control<FormValues, any>;
  editable?: boolean;
  handleAddGrade: () => void;
  handleRemoveGrade: (index: number) => void;
  handleAddClassGroup: (gradeIndex: number) => void;
  handleRemoveClassGroup: (gradeIndex: number, classGroupIndex: number) => void;
  errors?: any;
}

const GradesTable = ({
  grades,
  control,
  editable = false,
  handleAddGrade,
  handleRemoveGrade,
  handleAddClassGroup,
  handleRemoveClassGroup,
  errors,
}: Props) => {
  const classes = useStyles();

  const isValid = (index: number, field: string) => {
    return !(errors && errors[index] && errors[index][field]);
  };

  const getError = (index: number, field: string) => {
    if (!isValid(index, field)) {
      return errors[index][field].message as string;
    }
    return '';
  };

  const ClassGroup = ({ gradeIndex, classGroupIndex }: { gradeIndex: number; classGroupIndex: number }) => (
    <Controller
      name={`grades.${gradeIndex}.class_groups.${classGroupIndex}.name`}
      control={control}
      render={({ field: { value, onChange } }) => (
        <TextField
          value={value}
          onChange={onChange}
          variant="outlined"
          className={classes.class_group_item}
          size="small"
          InputProps={{
            style: { paddingRight: 0 },
            readOnly: !editable,
            // disableUnderline: !editable,
            endAdornment: editable && (
              <AppIconButton
                icon="clear"
                title="Remover Turma"
                onClick={() => handleRemoveClassGroup(gradeIndex, classGroupIndex)}
              />
            ),
          }}
        />
      )}
    />
  );

  return (
    <Table size="small" className={classes.grades_list}>
      <colgroup>
        <col width="20%" />
        <col width="20%" />
        <col width="20%" />
        <col width="10%" />
        <col width="30%" />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Fase</TableCell>
          <TableCell>Carga Horária</TableCell>
          <TableCell>Dias Letivos</TableCell>
          <TableCell>Ações</TableCell>
          <TableCell>Turmas</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {grades.map((grade, index) => (
          <TableRow key={grade.id}>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.name`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Nome da fase"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                    error={!isValid(index, 'name')}
                    helperText={getError(index, 'name') || ''}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.total_hours`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Carga Horária"
                    type="number"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                    error={!isValid(index, 'total_hours')}
                    helperText={getError(index, 'total_hours')}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <Controller
                name={`grades.${index}.days`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    placeholder="Dias letivos"
                    type="number"
                    value={value}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      readOnly: !editable,
                      disableUnderline: !editable,
                    }}
                    error={!isValid(index, 'days')}
                    helperText={getError(index, 'days')}
                  />
                )}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              {editable && <AppIconButton title="Apagar" icon="delete" onClick={() => handleRemoveGrade(index)} />}
            </TableCell>
            <TableCell component="th" scope="row">
              <Box className={classes.class_groups}>
                {grade.class_groups?.map((class_group, classGroupIndex) => (
                  <ClassGroup key={class_group.name} gradeIndex={index} classGroupIndex={classGroupIndex} />
                ))}
                {editable && (
                  <AppIconButton icon="add" title="Adicionar Turma" onClick={() => handleAddClassGroup(index)} />
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
        {editable && (
          <TableRow>
            <TableCell component="th" scope="row">
              <AppIconButton icon="add" title="Adicionar fase ao curso" onClick={handleAddGrade} />
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default GradesTable;
