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

const UrunEkle = ({ open, onClose, onUrunEklendi }) => {
  const [urun, setUrun] = useState({
    ad: '',
    aciklama: '',
    fiyat: '',
    stok: '',
    kategori: '',
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
        ad: urun.ad,
        aciklama: urun.aciklama,
        fiyat: parseFloat(urun.fiyat),
        stok: parseInt(urun.stok),
        kategori: urun.kategori,
        yayinevi: urun.yayinevi,
        yazar: urun.yazar,
        sayfaSayisi: urun.sayfaSayisi,
        isbn: urun.isbn,
        resimUrl: urun.resimUrl,
        cokSatan: urun.cokSatan,
        yeniCikan: urun.yeniCikan
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUrunEklendi) onUrunEklendi(res.data.product);
    onClose();
    setUrun({
      ad: '',
      aciklama: '',
      fiyat: '',
      stok: '',
      kategori: '',
      yayinevi: '',
      yazar: '',
      sayfaSayisi: '',
      isbn: '',
      resimUrl: '',
      cokSatan: false,
      yeniCikan: false
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
                name="ad"
                value={urun.ad}
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
                name="fiyat"
                type="number"
                value={urun.fiyat}
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
                value={urun.stok}
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
                name="aciklama"
                value={urun.aciklama}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={urun.cokSatan} onChange={e => setUrun(prev => ({ ...prev, cokSatan: e.target.checked }))} name="cokSatan" />} label="Çok Satan" />
              <FormControlLabel control={<Checkbox checked={urun.yeniCikan} onChange={e => setUrun(prev => ({ ...prev, yeniCikan: e.target.checked }))} name="yeniCikan" />} label="Yeni Çıkan" />
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
