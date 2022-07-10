import { Box, CircularProgress } from '@mui/material';

export const AppLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100px"
      // style={{ minHeight: '100%', minWidth: '100%' }}
    >
      <CircularProgress />
    </Box>
  );
};
