import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AppLoading } from '../../components';
import { classGroupsService } from '../../services/classGroups.service';

/**
 * Renders "ClassGroups" view
 * url: /professores/*
 */
const TermView = () => {
  const { id } = useParams<{ id: string }>();

  const [classGroup, setClassGroup] = useState<any>();
  const [loading, setLoading] = useState(true);

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await classGroupsService.getById(id);
    setClassGroup(response.data.classGroup);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
  }, [id]);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  if (loading) return <AppLoading />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Turma" subheader={classGroup.name} />
          <CardContent>Bimestres</CardContent>
          not implemented
        </Card>
      </Grid>
    </Grid>
  );
};

export default TermView;
