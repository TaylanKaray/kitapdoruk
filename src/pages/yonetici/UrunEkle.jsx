import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import axios from 'axios';

const kategoriler = [
  'Ana Sınıfı Kitapları',
  'İlk Okul Kitapları',
  'Okul Öncesi Kitapları',
  'Orta Okul Kitapları',
  'Hobi Oyunları',
  'Okuma Kitapları',
  'Deneme Sınavları',
  'Sözlükler ve Ansiklopediler'
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UrunEkle = ({ open, onClose, onUrunEklendi }) => {
  const [urun, setUrun] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    kategori: '',
    yayinevi: '',
    yazar: '',
    sayfaSayisi: '',
    isbn: '',
    resimUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUrun(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/products`, {
        name: urun.name,
        description: urun.description,
        price: parseFloat(urun.price),
        stock: parseInt(urun.stock),
        kategori: urun.kategori,
        yayinevi: urun.yayinevi,
        yazar: urun.yazar,
        sayfaSayisi: urun.sayfaSayisi,
        isbn: urun.isbn,
        resimUrl: urun.resimUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUrunEklendi) onUrunEklendi(res.data.product);
      onClose();
      setUrun({
        name: '',
        description: '',
        price: '',
        stock: '',
        kategori: '',
        yayinevi: '',
        yazar: '',
        sayfaSayisi: '',
        isbn: '',
        resimUrl: ''
      });
    } catch (err) {
      setError('Ürün eklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Adı"
                name="name"
                value={urun.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="kategori"
                  value={urun.kategori}
                  onChange={handleChange}
                  label="Kategori"
                >
                  {kategoriler.map((kategori) => (
                    <MenuItem key={kategori} value={kategori}>
                      {kategori}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yayınevi"
                name="yayinevi"
                value={urun.yayinevi}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yazar"
                name="yazar"
                value={urun.yazar}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={urun.isbn}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Fiyat (TL)"
                name="price"
                type="number"
                value={urun.price}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stok Adedi"
                name="stock"
                type="number"
                value={urun.stock}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sayfa Sayısı"
                name="sayfaSayisi"
                type="number"
                value={urun.sayfaSayisi}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resim URL"
                name="resimUrl"
                value={urun.resimUrl}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={urun.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <span style={{ color: 'red' }}>{error}</span>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UrunEkle;
