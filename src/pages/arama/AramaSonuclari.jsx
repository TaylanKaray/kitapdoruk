import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import UrunKarti from '../../components/urun/UrunKarti';
import { selectSearchQuery, selectSearchResults } from '../../store/slices/searchSlice';

const AramaSonuclari = () => {
  const query = useSelector(selectSearchQuery);
  const results = useSelector(selectSearchResults);

  if (!query) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Lütfen bir arama yapın
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        "{query}" için arama sonuçları ({results.length})
      </Typography>

      {results.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Sonuç bulunamadı
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {results.map((urun) => (
            <Grid item key={urun.id} xs={12} sm={6} md={4} lg={3}>
              <UrunKarti urun={urun} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AramaSonuclari;
