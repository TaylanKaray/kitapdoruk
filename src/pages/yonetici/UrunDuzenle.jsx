import React, { useState, useEffect } from 'react';
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

const UrunDuzenle = ({ open, onClose, urun, onUrunGuncellendi }) => {
  const [formData, setFormData] = useState({
    name: '',
    kategori: '',
    price: '',
    stock: '',
    description: '',
    yayinevi: '',
    yazar: '',
    sayfaSayisi: '',
    isbn: '',
    resimUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urun) {
      setFormData({
        name: urun.name || urun.ad || '',
        kategori: urun.kategori || '',
        price: urun.price || urun.fiyat || '',
        stock: urun.stock || urun.stok || '',
        description: urun.description || urun.aciklama || '',
        yayinevi: urun.yayinevi || '',
        yazar: urun.yazar || '',
        sayfaSayisi: urun.sayfaSayisi || '',
        isbn: urun.isbn || '',
        resimUrl: urun.resimUrl || ''
      });
    }
  }, [urun]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      const res = await axios.put(`${API_URL}/products/${urun._id}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        kategori: formData.kategori,
        yayinevi: formData.yayinevi,
        yazar: formData.yazar,
        sayfaSayisi: formData.sayfaSayisi,
        isbn: formData.isbn,
        resimUrl: formData.resimUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUrunGuncellendi) onUrunGuncellendi(res.data.product || res.data);
      onClose();
    } catch (err) {
      setError('Ürün güncellenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (!urun) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ürün Düzenle</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Adı"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="kategori"
                  value={formData.kategori}
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
                value={formData.yayinevi}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Yazar"
                name="yazar"
                value={formData.yazar}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
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
                value={formData.price}
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
                value={formData.stock}
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
                value={formData.sayfaSayisi}
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
                value={formData.resimUrl}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
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
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UrunDuzenle;
