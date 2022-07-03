import { Button, Card, CardContent, CardHeader, Grid, Theme } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridOverlay } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import Moment from 'moment';

import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { examsService, IListExamResults } from '../../services/exams.service';
import makeStyles from '@mui/styles/makeStyles';
import AppSubjectClassSelector from '../../components/AppSubjectClassSelector';
import { IStudentResults, studentsService } from '../../services/students.service';
import { sortByField } from '../../utils/sort';
import { IListTerms, termsService } from '../../services/terms.service';
import { AppButton } from '../../components';

interface IResult {
  value: number;
  student: {
    id: string;
    name: string;
  };
}

interface IDisplayColumnResults {
  id: string;
  title: string;
  date: Date;
  value: number;
  term: { id: string; name: string };
  isResume?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiDataGrid-columnHeaderTitleContainerContent': {
      overflow: 'visible',
      lineHeight: '1rem',
      whiteSpace: 'normal',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  },
}));

/**
 * Renders "ExamResultView" view
 * url: /exames/notas
 */
function ExamResultView() {
  const [subjectId, setSubjectId] = useState('');
  const [classGroupId, setClassGroupId] = useState('');

  const [exams, setExams] = useState<IListExamResults[]>([]);

  const [hiddenColumnsIds, setHiddenColumnsIds] = useState([] as string[]);

  const [dataGridVisibilityModel, setDataGridVisibilityModel] = useState<Record<string, any>>({});

  const [termClasses, setTermClasses] = useState<any>({});

  const [displayColumns, setDisplayColumns] = useState<IDisplayColumnResults[]>([]);
  const [displayRows, setDisplayRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const generateMean = (
    results: { exam_id: string; value: number }[],
    exams: { id: string; type: string; term: { id: string } }[],
    term_id: string
  ) => {
    const termExamsIds = exams.filter((exam) => exam.term.id === term_id).map((exam) => exam.id);
    const mean = results.reduce((sum, result) => {
      if (termExamsIds.includes(result.exam_id)) {
        sum = result.value + (sum || 0);
      }
      return sum;
    }, undefined as number | undefined);
    return mean;
  };

  const generateColumnClasses = (terms: IListTerms[]) => {
    const termColors = ['#00b7ff', '#00ff00', '#fbff00', '#ffa600', '#ff0000'];
    const lighterOpacity = '10';
    const darkerOpacity = '20';

    const columnClasses = terms.reduce((columnClasses, term, index) => {
      return {
        ...columnClasses,
        [`& .term-${term.id}`]: {
          backgroundColor: termColors[index] + lighterOpacity,
          fontWeight: '400',
        },
        [`& .resume-${term.id}`]: {
          backgroundColor: termColors[index] + darkerOpacity,
          fontWeight: '600',
        },
      };
    }, {} as Record<string, any>);
    return columnClasses;
  };

  const toggleShowHideColumns = (columns: string[]) => {
    const updatedHiddenColumnsIds = hiddenColumnsIds;

    columns.forEach((column) => {
      const index = updatedHiddenColumnsIds.findIndex((hiddenColumnId) => hiddenColumnId === column);
      if (index >= 0) {
        updatedHiddenColumnsIds.splice(index, 1);
      } else {
        updatedHiddenColumnsIds.push(column);
      }
    });
    setHiddenColumnsIds(updatedHiddenColumnsIds);

    const visibilityModel = updatedHiddenColumnsIds.reduce(
      (hidden, columnId) => ({
        ...hidden,
        [columnId]: false,
      }),
      {} as Record<string, any>
    );

    setDataGridVisibilityModel(visibilityModel);
  };

  const handleToggleShowTermColumns = (termId: string) => {
    const selectedExamsIds = exams.filter((exam) => exam.term.id === termId).map((exam) => exam.id);
    toggleShowHideColumns(selectedExamsIds);
  };

  const loadExamResultsList = useCallback(() => {
    let componentMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const exams = (
          await examsService.getAll(
            undefined,
            undefined,
            'subject_id,class_id',
            `${subjectId},${classGroupId}`,
            'eq,eq'
          )
        ).result;

        const columns: IDisplayColumnResults[] = exams.map((exam) => ({
          id: exam.id,
          title: exam.type,
          date: exam.date,
          value: exam.value,
          term: exam.term,
          isResume: false,
        }));

        // generate term mean columns
        const termsResponse = await termsService.getAll();

        const termResumeColumns: IDisplayColumnResults[] = termsResponse.map((term) => ({
          id: term.id,
          title: 'média',
          date: term.end_at,
          value: 10,
          term: { id: term.id, name: term.name },
          isResume: true,
        }));

        columns.push(...termResumeColumns);

        const hiddenColumns = columns.filter((column) => column.isResume === false).map((column) => column.id);

        const finalColumn = {
          id: 'final',
          title: 'média',
          date: new Date(),
          value: 10,
          term: { id: 'final', name: 'Final' },
          isResume: true,
        };

        toggleShowHideColumns(hiddenColumns);

        const columnClasses = generateColumnClasses(termsResponse);

        const studentsResults = await studentsService.listResults(classGroupId, subjectId);

        const rows = studentsResults.reduce((total, studentResult) => {
          const newRow = { id: studentResult.id, student: studentResult.name } as Record<string, any>;
          // generate one object property for each exam result
          studentResult.results.forEach((result) => {
            newRow[result.exam_id] = result.value;
          });
          return total.concat(newRow);
        }, [] as Record<string, any>[]);

        studentsResults.forEach((studentResult) => {
          termsResponse.forEach((term) => {
            const studentIndex = rows.findIndex((row: any) => row.id === studentResult.id);
            rows[studentIndex][term.id] = generateMean(studentResult.results, exams, term.id);
          });
        });

        if (!componentMounted) {
          return;
        }
        //set states

        setExams(exams);
        setTermClasses(columnClasses);

        // setTerms(termsResponse);

        setDisplayRows(sortByField(rows, 'student'));

        setDisplayColumns([...sortByField(columns, 'date'), finalColumn]);
      } catch (err: any) {
        console.log(err);
      }
      setLoading(false);
    }

    fetchData();

    return () => {
      componentMounted = false;
    };
  }, [classGroupId, subjectId]);

  useEffect(() => {
    if (classGroupId && subjectId) {
      loadExamResultsList();
    } else {
      setDisplayRows([]);
    }
  }, [loadExamResultsList, classGroupId, subjectId]);

  const columns: GridColDef[] = [
    {
      field: 'student',
      headerName: 'Aluno',
      headerAlign: 'center',
      align: 'center',

      width: 150,
    },
    ...displayColumns.map(
      (displayColumn) =>
        ({
          field: displayColumn.id,
          width: 130,
          height: 100,
          headerAlign: 'center',
          align: 'center',
          editable: !displayColumn.isResume,
          type: 'number',
          hide: !displayColumn.isResume,

          cellClassName: () => {
            if (displayColumn.isResume) {
              return 'resume-' + displayColumn.term.id;
            }
            return 'term-' + displayColumn.term.id;
          },

          renderHeader: (params: GridColumnHeaderParams) => (
            <>
              <span>{displayColumn.term.name}</span>
              <span style={{ textAlign: 'center' }}>
                <b>{displayColumn.title}</b>
              </span>
              {!displayColumn.isResume ? (
                <>
                  <span>{Moment(displayColumn.date).utcOffset('+0300').format('DD-MM-YYYY')}</span>
                  <span>Valor:{displayColumn.value}</span>
                </>
              ) : (
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleShowTermColumns(displayColumn.id);
                  }}
                >
                  Notas
                </Button>
              )}
            </>
          ),
        } as GridColDef)
    ),
  ];

  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Notas" subheader="Lista de notas" />
          <CardContent>
            <Grid container spacing={1}>
              <AppSubjectClassSelector
                onChange={(data) => {
                  setSubjectId(data.subjectId), setClassGroupId(data.classGroupId);
                }}
              />
            </Grid>

            <DataGrid
              columnVisibilityModel={dataGridVisibilityModel}
              experimentalFeatures={{ newEditingApi: true }}
              disableColumnMenu
              sx={termClasses}
              headerHeight={80}
              className={classes.root}
              rows={displayRows}
              columns={!loading ? columns : []}
              loading={loading}
              autoHeight
              hideFooter
              components={{
                NoRowsOverlay: () => (
                  <GridOverlay>
                    {subjectId && classGroupId ? (
                      <div>Nenhuma nota encontrada</div>
                    ) : (
                      <div>Selecione Turma e Matéria</div>
                    )}
                  </GridOverlay>
                ),
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ExamResultView;
