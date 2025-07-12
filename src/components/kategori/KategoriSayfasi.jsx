import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Typography,
  Button
} from '@mui/material';
import { selectUrunlerByKategori } from '../../store/slices/urunlerSlice';
import UrunKarti from '../urun/UrunKarti';

const KategoriSayfasi = ({ kategoriAdi, aciklama }) => {
  const urunler = useSelector((state) => selectUrunlerByKategori(state, kategoriAdi));
  
  const [siralama, setSiralama] = useState('');
  const [fiyatAralik, setFiyatAralik] = useState({ min: '', max: '' });
  const [filtrelenmisUrunler, setFiltrelenmisUrunler] = useState(urunler);

  // Sıralama ve filtreleme işlemleri
  const handleSiralamaChange = (event) => {
    const secilenSiralama = event.target.value;
    setSiralama(secilenSiralama);
    
    let siraliUrunler = [...filtrelenmisUrunler];
    switch (secilenSiralama) {
      case 'fiyatArtan':
        siraliUrunler.sort((a, b) => a.fiyat - b.fiyat);
        break;
      case 'fiyatAzalan':
        siraliUrunler.sort((a, b) => b.fiyat - a.fiyat);
        break;
      case 'isimArtan':
        siraliUrunler.sort((a, b) => a.ad.localeCompare(b.ad));
        break;
      case 'isimAzalan':
        siraliUrunler.sort((a, b) => b.ad.localeCompare(a.ad));
        break;
      default:
        break;
    }
    setFiltrelenmisUrunler(siraliUrunler);
  };

  // Fiyat filtresi
  const handleFiyatFiltreleme = () => {
    let yeniFiltrelenmisUrunler = [...urunler];
    
    if (fiyatAralik.min !== '') {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => urun.fiyat >= Number(fiyatAralik.min)
      );
    }
    
    if (fiyatAralik.max !== '') {
      yeniFiltrelenmisUrunler = yeniFiltrelenmisUrunler.filter(
        (urun) => urun.fiyat <= Number(fiyatAralik.max)
      );
    }
    
    setFiltrelenmisUrunler(yeniFiltrelenmisUrunler);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {kategoriAdi}
      </Typography>
      
      {aciklama && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {aciklama}
        </Typography>
      )}

      {/* Filtreleme ve Sıralama */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sıralama</InputLabel>
          <Select
            value={siralama}
            label="Sıralama"
            onChange={handleSiralamaChange}
          >
            <MenuItem value="fiyatArtan">Fiyat (Düşükten Yükseğe)</MenuItem>
            <MenuItem value="fiyatAzalan">Fiyat (Yüksekten Düşüğe)</MenuItem>
            <MenuItem value="isimArtan">İsim (A-Z)</MenuItem>
            <MenuItem value="isimAzalan">İsim (Z-A)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Min Fiyat"
          type="number"
          value={fiyatAralik.min}
          onChange={(e) => setFiyatAralik({ ...fiyatAralik, min: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">₺</InputAdornment>,
          }}
          sx={{ width: 150 }}
        />

        <TextField
          label="Max Fiyat"
          type="number"
          value={fiyatAralik.max}
          onChange={(e) => setFiyatAralik({ ...fiyatAralik, max: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">₺</InputAdornment>,
          }}
          sx={{ width: 150 }}
        />

        <Button
          variant="contained"
          onClick={handleFiyatFiltreleme}
          sx={{ height: 56 }}
        >
          Filtrele
        </Button>
      </Box>

      {/* Ürün Listesi */}
      <Grid container spacing={4}>
        {filtrelenmisUrunler.map((urun) => (
          <Grid item key={urun.id} xs={12} sm={6} md={4} lg={3}>
            <UrunKarti urun={urun} />
          </Grid>
        ))}
      </Grid>

      {filtrelenmisUrunler.length === 0 && (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          Bu kategoride ürün bulunamadı.
        </Typography>
      )}
    </Container>
  );
};

export default KategoriSayfasi;
