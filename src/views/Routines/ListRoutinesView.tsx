/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Tab,
  TableContainer,
  Tabs,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { AppLoading } from '../../components';

import { useApi } from '../../api/useApi';

import { AppAddButton } from '../../components/AppCustomButton';

import { IRoutineGroup, routinesService } from '../../services/routines.service';
import { Box } from '@mui/system';

import { generateTempID } from '../../utils/tempID';

import RoutineGroupView from './components/RoutineGroup';

interface Props {
  onSuccess?: () => void;
}

/**
 * Renders "ListRoutinesView" view
 * url: /horarios/
 */
const ListRoutinesView = ({ onSuccess }: Props) => {
  const [routineGroupsData, , loading] = useApi(routinesService.getAllRoutineGroups);

  const [, , isRemovingRoutineGroup, removeRoutineGroup] = useApi(
    routinesService.removeRoutineGroup,
    {},
    { isRequest: true }
  );

  const [routineGroupsTabIndex, setRoutineGroupsTabIndex] = useState<number>(0);

  const [routineGroups, setRoutineGroups] = useState<IRoutineGroup[]>([]);

  const [selectedRoutineGroup, selectRoutineGroup] = useState<IRoutineGroup>({ id: '23', name: 'teste', routines: [] });

  useEffect(() => {
    if (routineGroupsData?.routineGroups) {
      setRoutineGroups(routineGroupsData.routineGroups);
      selectRoutineGroup(routineGroupsData.routineGroups[0]);
    }
  }, [routineGroupsData]);

  // useEffect(() => {
  //   if (routineGroups.length > 0) {
  //     setRoutineGroupsTabIndex(0);
  //     selectRoutineGroup(routineGroups[0]);
  //   }
  // }, [routineGroups]);

  const handleAddRoutineGroup = async () => {
    const data = {
      id: generateTempID(),
      name: '',
      routines: [],
    };
    setRoutineGroups((previous) => previous.concat([data]));
    selectRoutineGroup(data);
    setRoutineGroupsTabIndex(routineGroups?.length);
  };

  const handleRemoveRoutineGroup = (routineGroupId: string) => {
    const newRoutineGroups = routineGroups.filter((routineGroup) => routineGroup.id !== routineGroupId);
    if (routineGroupsTabIndex > 0) {
      setRoutineGroupsTabIndex(routineGroupsTabIndex - 1);
      selectRoutineGroup(newRoutineGroups[routineGroupsTabIndex - 1]);
    } else {
      selectRoutineGroup(newRoutineGroups[0]);
    }
    setRoutineGroups(newRoutineGroups);
  };

  const handleServerRemoveRoutineGroup = async (routineGroupId: string) => {
    const response = await removeRoutineGroup({ id: routineGroupId });

    if (response?.success) {
      handleRemoveRoutineGroup(routineGroupId);
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, index: number) => {
    setRoutineGroupsTabIndex(index);
    selectRoutineGroup(routineGroups[index]);
  };

  const onSaveRoutineGroup = (data: IRoutineGroup) => {
    const updatedRoutineGroups = routineGroups.map((routineGroup, index) => {
      if (index === routineGroupsTabIndex) {
        return data;
      }
      return routineGroup;
    });

    setRoutineGroups(updatedRoutineGroups);
  };

  const Routines = routineGroups.map((routine) => (
    <RoutineGroupView
      key={routine.id}
      isRemovingRoutineGroup={isRemovingRoutineGroup}
      onSave={onSaveRoutineGroup}
      routineGroup={routine}
      handleRemoveRoutineGroup={handleRemoveRoutineGroup}
      handleServerRemoveRoutineGroup={handleServerRemoveRoutineGroup}
      finishCreation={onSuccess}
    />
  ));

  if (loading) {
    return <AppLoading />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader style={{ textAlign: 'center' }} title="Turnos" subheader="Lista de horários dos Turnos" />
          <CardContent>
            <TableContainer component={Paper} sx={{ minWidth: 350 }}>
              <Box display={'flex'} flexDirection="row" justifyContent="space-between">
                <Tabs value={routineGroupsTabIndex} onChange={handleChangeTab}>
                  {routineGroups.map((routineGroup) => (
                    <Tab key={routineGroup.id} label={routineGroup.name || 'Novo Turno'} />
                  ))}
                </Tabs>

                <AppAddButton
                  style={{ marginRight: 6 }}
                  color="info"
                  onClick={handleAddRoutineGroup}
                  label="Novo Turno"
                />
              </Box>
              <Divider />
              {Routines[routineGroupsTabIndex]}
              {/* {routineGroups.map((routineGroup, index) => {
                if (index === routineGroupsTabIndex) {
                  return;
                }
              })} */}
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListRoutinesView;
