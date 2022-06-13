import { useState, useCallback, useEffect, useReducer } from 'react';
import { Box, Grid, MenuItem, TextField } from '@mui/material';

import { SHARED_CONTROL_PROPS } from '../../utils/form';
import { segmentsService } from '../../services/segments.service';
import { gradesService } from '../../services/grades.service';
import { classGroupsService } from '../../services/classGroups.service';

export interface IAllocation {
  segmentId: string;
  gradeId: string;
  classGroupId: string;
}

interface Props {
  onChange?: (allocation: IAllocation) => void;
}

enum AllocationActionKind {
  SET = 'SET',
}

// An interface for our actions
interface AllocationAction {
  type: AllocationActionKind;
  payload: Partial<IAllocation>;
}

const AppAllocationSelect: React.FC<Props> = ({ onChange }) => {
  function allocationReducer(state: IAllocation, action: AllocationAction) {
    const { type, payload } = action;

    return { ...state, ...payload };
  }
  const [{ classGroupId, gradeId, segmentId }, allocationDispatch] = useReducer(allocationReducer, {
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  useEffect(() => {
    onChange && onChange({ classGroupId, gradeId, segmentId });
  }, [classGroupId, gradeId, segmentId]);

  const [segments, setSegments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [classGroups, setClassGroups] = useState<any[]>([]);

  const loadFilterData = useCallback(async () => {
    try {
      const segmentResponse = await segmentsService.getAll();
      const gradeResponse = await gradesService.getAll();
      const classGroupResponse = await classGroupsService.getAll();
      setSegments(segmentResponse.data.segments.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      setGrades(gradeResponse.data.grades);
      setClassGroups(classGroupResponse.data.classGroups);
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  const handleSelectSegmentId = (id: string) => {
    allocationDispatch({ type: AllocationActionKind.SET, payload: { gradeId: '', classGroupId: '', segmentId: id } });
  };

  const handleSelectGradeId = (id: string) => {
    allocationDispatch({ type: AllocationActionKind.SET, payload: { gradeId: id, classGroupId: '' } });
  };

  const handleSelectClassGroupId = (id: string) => {
    allocationDispatch({ type: AllocationActionKind.SET, payload: { classGroupId: id } });
  };

  return (
    <>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          select
          label="Segmento"
          name="segment_id"
          value={segmentId}
          onChange={(e) => handleSelectSegmentId(e.target.value)}
          {...SHARED_CONTROL_PROPS}
        >
          <MenuItem key={'all'} value={''}>
            Limpar
          </MenuItem>
          {segments.map((segment) => {
            return (
              <MenuItem key={segment.id} value={segment.id}>
                {segment.name}
              </MenuItem>
            );
          })}
          <MenuItem key={'null'} value={'null'}>
            Sem Segmento
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          disabled={segmentId ? false : true}
          select
          label="Ano"
          name="grade_id"
          value={gradeId}
          onChange={(e) => handleSelectGradeId(e.target.value)}
          {...SHARED_CONTROL_PROPS}
        >
          <MenuItem key={'all'} value={''}>
            Limpar
          </MenuItem>
          {grades
            .filter((grade) => grade.segment_id === segmentId)
            .map((grade) => {
              return (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              );
            })}
          <MenuItem key={'null'} value={'null'}>
            Sem Ano
          </MenuItem>
        </TextField>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          disabled={gradeId ? false : true}
          select
          label="Turma"
          name="class_id"
          value={classGroupId}
          onChange={(e) => handleSelectClassGroupId(e.target.value)}
          {...SHARED_CONTROL_PROPS}
        >
          <MenuItem key={'all'} value={''}>
            Limpar
          </MenuItem>
          {classGroups
            .filter((classGroup) => classGroup.grade_id === gradeId)
            .map((classGroup) => {
              return (
                <MenuItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name}
                </MenuItem>
              );
            })}
          <MenuItem key={'null'} value={'null'}>
            Sem Turma
          </MenuItem>
        </TextField>
      </Grid>
    </>
  );
};

export default AppAllocationSelect;
