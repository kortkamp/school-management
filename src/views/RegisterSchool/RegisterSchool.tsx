/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useApi } from '../../api/useApi';
import { AppLoading } from '../../components';
import { schoolsService } from '../../services/schools.service';
import { termsService } from '../../services/terms.service';
import { useAppStore } from '../../store';
import CreateSchoolConfigurationsView from '../Schools/CreateSchoolConfigurationsView';
import CreateSchoolsView from '../Schools/CreateSchoolsView';
import ListTermsView from '../Terms/ListTermsView';

/**
 * Renders "RegisterSchool" view
 * url: /registro *
 */
const RegisterSchool = () => {
  const [registrationExists, setRegistrationExists] = useState(false);
  const [configurationExists, setConfigurationExists] = useState(false);
  const [termsExists, setTermsExists] = useState(false);

  const [schoolData, , loadingSchool] = useApi(schoolsService.getById);

  const [termsData, , loadingTerms] = useApi(termsService.getAll);

  const [registrationStep, setRegistrationStep] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (schoolData) {
      const nameHasBeenDefined = schoolData.school.name !== '';
      setRegistrationExists(!nameHasBeenDefined);

      const parametersExists = schoolData.school.parameters !== null;
      setConfigurationExists(parametersExists);

      const termsNumber = termsData?.terms.length || 0;
      setTermsExists(termsNumber > 0);
    }
  }, [schoolData]);

  useEffect(() => {
    if (!termsExists) setRegistrationStep(<ListTermsView />);
    if (!configurationExists)
      setRegistrationStep(<CreateSchoolConfigurationsView onSuccess={() => setConfigurationExists(true)} />);
    if (!registrationExists) setRegistrationStep(<CreateSchoolsView onSuccess={() => setRegistrationExists(true)} />);
  }, [registrationExists, configurationExists, termsExists]);

  if (loadingSchool || loadingTerms) return <AppLoading />;

  return <Box>{registrationStep}</Box>;
};

export default RegisterSchool;
