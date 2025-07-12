import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const steps = [
  'Sipariş Alındı',
  'Hazırlanıyor',
  'Kargoda',
  'Teslim Edildi',
];

const statusToStep = {
  'Hazırlanıyor': 1,
  'Kargoda': 2,
  'Teslim Edildi': 3,
  'Sipariş Alındı': 0,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SiparisDurumu = () => {
  const [siparisler, setSiparisler] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSiparisler(res.data);
      } catch {}
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Siparişlerinizi görmek için giriş yapmalısınız.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}><Typography>Yükleniyor...</Typography></Container>;
  }

  if (siparisler.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Henüz hiç siparişiniz yok.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Siparişlerim
      </Typography>
      {siparisler.map((siparis, idx) => (
        <Paper sx={{ p: 3, mb: 4 }} key={siparis._id}>
          <Typography variant="h6" gutterBottom>
            Sipariş Tarihi: {new Date(siparis.createdAt).toLocaleString('tr-TR')}
          </Typography>
          <Stepper activeStep={statusToStep[siparis.status] ?? 0} alternativeLabel sx={{ mt: 3, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Durum:</strong> {siparis.status || 'Hazırlanıyor'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ürünler
                  </Typography>
                  {siparis.products.map((p, i) => (
                    <Typography key={i} variant="body2">
                      {p.product?.name || p.product?.ad} x {p.quantity}
                    </Typography>
                  ))}
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Toplam:</strong> {siparis.total} TL
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

export default SiparisDurumu;
