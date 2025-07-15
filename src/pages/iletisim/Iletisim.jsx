import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

const Iletisim = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basit doğrulama
    if (!formData.name || !formData.email || !formData.message) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/contact`, {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          İletişim
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Bizimle iletişime geçmek için aşağıdaki formu doldurun. En kısa sürede size dönüş yapacağız.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Adınız Soyadınız"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="E-posta Adresiniz"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Konu"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Mesajınız"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Mesaj Gönder
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            İletişim Bilgileri
          </Typography>
          <Typography variant="body1" paragraph>
            Adres: Örnek Mahallesi, Örnek Caddesi No: 123
            <br />
            34000 İstanbul / Türkiye
          </Typography>
          <Typography variant="body1" paragraph>
            Telefon: +90 (212) 123 45 67
            <br />
            E-posta: info@dorukkitap.com
          </Typography>
          <Typography variant="body1">
            Çalışma Saatleri: Pazartesi - Cumartesi, 09:00 - 18:00
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Iletisim;
