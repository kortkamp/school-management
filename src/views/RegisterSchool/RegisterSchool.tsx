/* eslint-disable @typescript-eslint/no-unused-vars */

import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useApi } from '../../api/useApi';
import { AppLoading } from '../../components';
import { schoolsService } from '../../services/schools.service';
import { termsService } from '../../services/terms.service';
import ListRoutinesView from '../Routines/ListRoutinesView';
import CreateSchoolConfigurationsView from '../Schools/CreateSchoolConfigurationsView';
import UpdateSchoolInfoView from '../Schools/UpdateSchoolInfoView';
import ListTermsView from '../Terms/ListTermsView';

/**
 * Renders "RegisterSchool" view
 * url: /registro *
 */
const RegisterSchool = () => {
  const [schoolData, , loadingSchool] = useApi(schoolsService.getById);

  const [termsData, , loadingTerms] = useApi(termsService.getAll);

  const [registrationStep, setRegistrationStep] = useState<ReactNode | null>();

  const openFinish = () => {
    setRegistrationStep(<h1>fim</h1>);
  };

  const openRoutines = () => {
    setRegistrationStep(<ListRoutinesView />);
  };

  const openSchoolTerms = () => {
    setRegistrationStep(<ListTermsView onSuccess={() => openRoutines()} />);
  };
  const openSchoolConfigs = () => {
    setRegistrationStep(<CreateSchoolConfigurationsView onSuccess={() => openSchoolTerms()} />);
  };

  const openSchoolUpdate = () => {
    setRegistrationStep(<UpdateSchoolInfoView onSuccess={() => openSchoolConfigs()} />);
  };

  useEffect(() => {
    if (schoolData) {
      openSchoolUpdate();

      const schoolHasBeenUpdated = schoolData.school.name !== '';
      if (schoolHasBeenUpdated) openSchoolConfigs();

      if (schoolData.school.parameters !== null) openSchoolTerms();

      const termsNumber = termsData?.terms.length || 0;

      openRoutines();
    }
  }, [schoolData]);

  if (loadingSchool || loadingTerms) return <AppLoading />;

  return <Box>{registrationStep}</Box>;
};

export default RegisterSchool;
