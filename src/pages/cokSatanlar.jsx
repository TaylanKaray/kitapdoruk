import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid } from '@mui/material';
import UrunKarti from '../components/urun/UrunKarti';

const CokSatanlar = () => {
  const [urunler, setUrunler] = useState([]);

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/products`);
        setUrunler(res.data.filter(u => u.cokSatan));
      } catch (err) {
        setUrunler([]);
      }
    };
    fetchUrunler();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Çok Satanlar
      </Typography>
      <Grid container spacing={3}>
        {urunler.map((urun) => (
          <Grid item xs={12} sm={6} md={3} key={urun._id || urun.id}>
            <UrunKarti urun={{ ...urun, _id: urun._id || urun.id, id: urun.id || urun._id }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CokSatanlar; 