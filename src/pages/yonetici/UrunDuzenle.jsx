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
  Grid,
  Checkbox,
  FormControlLabel
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
    ad: '',
    kategori: '',
    fiyat: '',
    stok: '',
    aciklama: '',
    yayinevi: '',
    yazar: '',
    sayfaSayisi: '',
    isbn: '',
    resimUrl: '',
    cokSatan: false,
    yeniCikan: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urun) {
      setFormData({
        ad: urun.ad || urun.name || '',
        kategori: urun.kategori || '',
        fiyat: urun.fiyat || urun.price || '',
        stok: urun.stok || urun.stock || '',
        aciklama: urun.aciklama || urun.description || '',
        yayinevi: urun.yayinevi || '',
        yazar: urun.yazar || '',
        sayfaSayisi: urun.sayfaSayisi || '',
        isbn: urun.isbn || '',
        resimUrl: urun.resimUrl || '',
        cokSatan: urun.cokSatan || false,
        yeniCikan: urun.yeniCikan || false
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
        ad: formData.ad,
        aciklama: formData.aciklama,
        fiyat: parseFloat(formData.fiyat),
        stok: parseInt(formData.stok),
        kategori: formData.kategori,
        yayinevi: formData.yayinevi,
        yazar: formData.yazar,
        sayfaSayisi: formData.sayfaSayisi,
        isbn: formData.isbn,
        resimUrl: formData.resimUrl,
        cokSatan: formData.cokSatan,
        yeniCikan: formData.yeniCikan
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
                name="ad"
                value={formData.ad}
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
                name="fiyat"
                type="number"
                value={formData.fiyat}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stok Adedi"
                name="stok"
                type="number"
                value={formData.stok}
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
                name="aciklama"
                value={formData.aciklama}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={formData.cokSatan} onChange={e => setFormData(prev => ({ ...prev, cokSatan: e.target.checked }))} name="cokSatan" />} label="Çok Satan" />
              <FormControlLabel control={<Checkbox checked={formData.yeniCikan} onChange={e => setFormData(prev => ({ ...prev, yeniCikan: e.target.checked }))} name="yeniCikan" />} label="Yeni Çıkan" />
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
