import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Divider, Grid, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Hesabim = () => {
  const [user, setUser] = useState({ name: '', surname: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', surname: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editEmailMode, setEditEmailMode] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [nameForm, setNameForm] = useState({ name: '', surname: '' });
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUser({
            name: res.data.name || '',
            surname: res.data.surname || '',
            email: res.data.email || '',
          });
          setForm({
            name: res.data.name || '',
            surname: res.data.surname || '',
            email: res.data.email || '',
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.');
          setLoading(false);
        });
    } else {
      setError('Giriş yapmalısınız.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if ((!user.name || !user.surname) && !loading && !error) {
      setShowNameForm(true);
      setNameForm({ name: user.name || '', surname: user.surname || '' });
    } else {
      setShowNameForm(false);
    }
  }, [user, loading, error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(form);
    setEditMode(false);
    // Burada backend'e güncelleme isteği gönderilebilir
  };

  const handleNameFormChange = (e) => {
    setNameForm({ ...nameForm, [e.target.name]: e.target.value });
  };

  const handleNameFormSave = async (e) => {
    e.preventDefault();
    setSavingName(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put((process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/users/me',
        { name: nameForm.name, surname: nameForm.surname },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, name: nameForm.name, surname: nameForm.surname });
      setShowNameForm(false);
    } catch {
      setError('Ad ve soyad güncellenemedi.');
    } finally {
      setSavingName(false);
    }
  };

  if (loading) {
    return <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}><Typography>Yükleniyor...</Typography></Container>;
  }
  if (error) {
    return <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}><Typography color="error">{error}</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Hesabım</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Kullanıcı Bilgileri</Typography>
        <Box>
          {showNameForm ? (
            <Box component="form" onSubmit={handleNameFormSave} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="Ad"
                name="name"
                value={nameForm.name}
                onChange={handleNameFormChange}
                required
              />
              <TextField
                label="Soyad"
                name="surname"
                value={nameForm.surname}
                onChange={handleNameFormChange}
                required
              />
              <Button type="submit" variant="contained" disabled={savingName}>Kaydet</Button>
            </Box>
          ) : (
            <>
              <Typography>Ad: {user.name}</Typography>
              <Typography>Soyad: {user.surname}</Typography>
            </>
          )}
          {!editEmailMode ? (
            <>
              <Typography>E-posta: {user.email}</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditEmailMode(true)}>
                E-posta Düzenle
              </Button>
            </>
          ) : (
            <Box component="form" onSubmit={handleSave} sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="E-posta"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <Button type="submit" variant="contained">Kaydet</Button>
              <Button variant="outlined" onClick={() => { setEditEmailMode(false); setForm({ ...form, email: user.email }); }}>İptal</Button>
            </Box>
          )}
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Favori Ürünler</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        (Burada favori ürünleriniz listelenecek.)
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>Sipariş Geçmişi</Typography>
      <Typography color="text.secondary">
        (Burada sipariş geçmişiniz listelenecek.)
      </Typography>
    </Container>
  );
};

export default Hesabim;
