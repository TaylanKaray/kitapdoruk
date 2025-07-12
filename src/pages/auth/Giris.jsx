import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Link,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';

const Giris = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    sifre: ''
  });
  const [hata, setHata] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    try {
      await dispatch(login(formData)).unwrap();
      // Token'ı al ve decode et
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.isAdmin) {
          navigate('/yonetici');
          return;
        }
      }
      navigate('/');
    } catch (error) {
      // Backend'den gelen hata mesajını göster
      if (error && error.message) {
        setHata(error.message);
      } else if (typeof error === 'string') {
        setHata(error);
      } else {
        setHata('Giriş yapılırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Giriş Yap
          </Typography>

          {hata && <Alert severity="error" sx={{ mb: 2 }}>{hata}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre"
              label="Şifre"
              type="password"
              id="sifre"
              autoComplete="current-password"
              value={formData.sifre}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component="button"
                variant="body2"
                onClick={() => navigate('/sifremi-unuttum')}
                sx={{ mb: 1 }}
              >
                Şifremi Unuttum
              </Link>
              <Typography variant="body2">
                Hesabınız yok mu?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/kayit')}
                >
                  Üye Ol
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Giris;
