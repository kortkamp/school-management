/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useApi, useRequestApi } from '../../api/useApi';
import { AppButton, AppIcon, AppLoading } from '../../components';
import { routinesService } from '../../services/routines.service';
import { schoolsService } from '../../services/schools.service';
import { termsService } from '../../services/terms.service';
import ListRoutinesView from '../Routines/ListRoutinesView';
import CreateSchoolConfigurationsView from '../Schools/CreateSchoolConfigurationsView';
import UpdateSchoolInfoView from '../Schools/UpdateSchoolInfoView';
import SchoolYearView from '../SchoolYears/SchoolYearView';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AppSaveButton } from '../../components/AppCustomButton';
import ListEmployeesView from '../Employees/ListEmployeesView';

/**
 * Renders "RegisterSchool" view
 * url: /registro *
 */
const RegisterSchool = () => {
  const [schoolData, , loadingSchool] = useApi(schoolsService.getById);

  const [routineGroupsData, , loadingRoutines] = useApi(routinesService.getAllRoutineGroups);

  const [finishRegistration, isFinishing] = useRequestApi(schoolsService.finishRegistration);

  const [tabIndex, setTabIndex] = useState(0);

  const [completedStep, setCompletedSteps] = useState([false, false, false, false, false]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFinishRegistration = async () => {
    const response = await finishRegistration({});

    if (response?.success) {
      console.log('sucesso');
      // should change state with new role for the current user
    }
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && children}
      </div>
    );
  }

  const steps = [
    {
      index: 0,
      title: 'Dados',
      view: UpdateSchoolInfoView,
    },
    {
      index: 1,
      title: 'Parâmetros',
      view: CreateSchoolConfigurationsView,
    },
    {
      index: 2,
      title: 'Ano Letivo',
      view: SchoolYearView,
    },
    {
      index: 3,
      title: 'Turnos e Horários',
      view: ListRoutinesView,
    },
    {
      index: 4,
      title: 'Funcionários',
      view: ListEmployeesView,
    },
  ];

  const setCompletion = (index: number) => {
    setCompletedSteps((prev) => {
      const newCompletedSteps = prev;
      newCompletedSteps[index] = true;
      return newCompletedSteps;
    });
  };

  useEffect(() => {
    if (schoolData) {
      const schoolHasBeenUpdated = schoolData.school.name !== '';
      const schoolYearHasBeenCreated = schoolData.school.active_year_id !== null;
      const parameterHasBeenCreated = schoolData.school.parameters !== null;
      const routinesHasBeenCreated = routineGroupsData && routineGroupsData.routineGroups.length > 0;

      let index = 4;

      if (!routinesHasBeenCreated) {
        index = 3;
      } else {
        setCompletion(3);
      }
      if (!schoolYearHasBeenCreated) {
        index = 2;
      } else {
        setCompletion(2);
      }
      if (!parameterHasBeenCreated) {
        index = 1;
      } else {
        setCompletion(1);
      }
      if (!schoolHasBeenUpdated) {
        index = 0;
      } else {
        setCompletion(0);
      }

      setTabIndex(index);
    }
  }, [schoolData, routineGroupsData]);

  if (loadingSchool || loadingRoutines) return <AppLoading />;

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          {steps.map((step) => (
            <Tab key={step.index} label={step.title} />
          ))}
          <Tab label={'Finalizar'} />
        </Tabs>
      </Box>

      {steps.map((step) => (
        <TabPanel key={step.index} value={tabIndex} index={step.index}>
          {
            <step.view
              onSuccess={() => {
                setTabIndex((prev) => prev + 1);
                setCompletion(step.index);
              }}
            />
          }
        </TabPanel>
      ))}
      <TabPanel value={tabIndex} index={steps.length}>
        <Box marginTop={10} display="flex" justifyContent={'center'} alignItems="center" flexDirection="column">
          <List>
            {steps.map((step) => (
              <ListItemButton key={step.index} onClick={() => setTabIndex(step.index)}>
                <ListItemIcon>
                  {completedStep[step.index] ? <DoneIcon color="success" /> : <ErrorOutlineIcon color="error" />}
                </ListItemIcon>
                <ListItemText primary={step.title} secondary="" />
              </ListItemButton>
            ))}
          </List>
          <AppSaveButton
            disabled={!completedStep.every((step) => step) || isFinishing}
            loading={isFinishing}
            label="Finalizar Registro"
            onClick={handleFinishRegistration}
          />
        </Box>
      </TabPanel>
    </Box>
  );
};

export default RegisterSchool;
