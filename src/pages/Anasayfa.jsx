import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Paper,
  Divider,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { addToCart } from '../store/slices/cartSlice';
import { addFavorite, removeFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';

const kategoriler = [
  {
    id: 'ana-sinif',
    isim: 'Ana Sınıfı Kitapları',
    resim: '/kategoriler/ana-sinifi-kitaplari.svg',
    aciklama: 'Ana sınıfı öğrencileri için özel hazırlanmış eğitici kitaplar',
  },
  {
    id: 'ilkokul',
    isim: 'İlk Okul Kitapları',
    resim: '/kategoriler/ilk-okul-kitaplari.svg',
    aciklama: 'İlkokul müfredatına uygun ders ve yardımcı kitaplar',
  },
  {
    id: 'okul-oncesi',
    isim: 'Okul Öncesi Kitapları',
    resim: '/kategoriler/okul-oncesi-kitaplari.svg',
    aciklama: 'Okul öncesi çocukların gelişimini destekleyen kitaplar',
  },
  {
    id: 'ortaokul',
    isim: 'Orta Okul Kitapları',
    resim: '/kategoriler/orta-okul-kitaplari.svg',
    aciklama: 'Ortaokul öğrencileri için ders ve test kitapları',
  },
  {
    id: 'hobi-oyunlari',
    isim: 'Hobi Oyunları',
    resim: '/kategoriler/hobi-oyunlari.svg',
    aciklama: 'Eğlenceli ve eğitici hobi oyunları',
  },
  {
    id: 'okuma-kitaplari',
    isim: 'Okuma Kitapları',
    resim: '/kategoriler/okuma-kitaplari.svg',
    aciklama: 'Her yaş grubu için okuma kitapları',
  },
  {
    id: 'deneme-sinavlari',
    isim: 'Deneme Sınavları',
    resim: '/kategoriler/deneme-sinavlari.svg',
    aciklama: 'Tüm sınav türleri için deneme sınavları',
  },
  {
    id: 'sozlukler-ansiklopedi',
    isim: 'Sözlükler ve Ansiklopediler',
    resim: '/kategoriler/sozlukler-ansiklopediler.svg',
    aciklama: 'Kapsamlı sözlükler ve ansiklopediler',
  },
];

const UrunKarti = ({ urun }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isFavorite = useSelector(selectIsFavorite(urun._id));

  const handleAddToCart = () => {
    dispatch(addToCart({ ...urun, adet: 1 }));
  };

  const handleToggleFavorite = () => {
    if (!token) {
      navigate('/auth/giris');
      return;
    }
    if (isFavorite) {
      dispatch(removeFavorite({ productId: urun._id, token }));
    } else {
      dispatch(addFavorite({ productId: urun._id, token }));
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={urun.resimUrl}
        alt={urun.ad}
        sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
        onClick={() => navigate(`/urun/${urun.id}`)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {urun.ad}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {urun.yazar}
        </Typography>
        <Typography variant="h6" color="primary">
          {urun.fiyat.toFixed(2)} TL
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <IconButton
          color={isFavorite ? 'secondary' : 'default'}
          onClick={handleToggleFavorite}
        >
          <FavoriteIcon />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={urun.stok === 0}
        >
          Sepete Ekle
        </Button>
      </Box>
    </Card>
  );
};

const KategoriKarti = ({ kategori }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={kategori.resim}
        alt={kategori.isim}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {kategori.isim}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {kategori.aciklama}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate(`/kategori/${kategori.id}`)}
        >
          İncele
        </Button>
      </Box>
    </Card>
  );
};

const Anasayfa = () => {
  const [urunler, setUrunler] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [fiyatAralik, setFiyatAralik] = useState([0, 1000]);
  const [filtreCokSatan, setFiltreCokSatan] = useState(false);
  const [filtreYeniCikan, setFiltreYeniCikan] = useState(false);

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/products`);
        setUrunler(res.data);
      } catch (err) {
        setUrunler([]);
      }
    };
    fetchUrunler();
  }, []);

  const minFiyat = Math.min(...urunler.map(u => u.fiyat));
  const maxFiyat = Math.max(...urunler.map(u => u.fiyat));

  const handleFiyatAralik = (e, newValue) => setFiyatAralik(newValue);

  const filtreliUrunler = urunler.filter(u =>
    (selectedKategori ? u.kategori === selectedKategori : true) &&
    u.fiyat >= fiyatAralik[0] && u.fiyat <= fiyatAralik[1] &&
    (!filtreCokSatan || u.cokSatan) &&
    (!filtreYeniCikan || u.yeniCikan)
  ).map(u => ({...u, _id: u._id || u.id, id: u.id || u._id }));

  // Çok Satanlar ve Yeni Çıkanlar filtreleri
  const cokSatanlar = urunler.filter(u => u.cokSatan).map(u => ({...u, _id: u._id || u.id, id: u.id || u._id }));
  const yeniCikanlar = urunler.filter(u => u.yeniCikan).map(u => ({...u, _id: u._id || u.id, id: u.id || u._id }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{ p: 4, mb: 4, background: 'linear-gradient(90deg, #e3ffe6 0%, #f7f7ff 100%)' }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Hoşgeldiniz!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          En popüler ve yeni çıkan kitapları keşfedin.
        </Typography>
      </Paper>

      {/* Kategoriler */}
      <Typography variant="h4" gutterBottom>
        Kategoriler
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {kategoriler.map((kategori) => (
          <Grid item xs={12} sm={6} md={3} key={kategori.id}>
            <KategoriKarti kategori={kategori} />
          </Grid>
        ))}
      </Grid>

      {/* Filtre Paneli */}
      <Box sx={{ mb: 4, p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={selectedKategori}
                label="Kategori"
                onChange={e => setSelectedKategori(e.target.value)}
              >
                <MenuItem value="">Tümü</MenuItem>
                {kategoriler.map(k => (
                  <MenuItem key={k.isim} value={k.isim}>{k.isim}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography id="fiyat-slider" gutterBottom>Fiyat Aralığı</Typography>
            <Slider
              value={fiyatAralik}
              onChange={handleFiyatAralik}
              valueLabelDisplay="auto"
              min={minFiyat}
              max={maxFiyat}
              step={1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">{fiyatAralik[0]} TL</Typography>
              <Typography variant="body2">{fiyatAralik[1]} TL</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={<Checkbox checked={filtreCokSatan} onChange={e => setFiltreCokSatan(e.target.checked)} />}
              label="Çok Satanlar"
            />
            <FormControlLabel
              control={<Checkbox checked={filtreYeniCikan} onChange={e => setFiltreYeniCikan(e.target.checked)} />}
              label="Yeni Çıkanlar"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => {
              setSelectedKategori('');
              setFiyatAralik([minFiyat, maxFiyat]);
              setFiltreCokSatan(false);
              setFiltreYeniCikan(false);
            }}>Filtreleri Sıfırla</Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tüm Kitaplar */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Tüm Kitaplar
        </Typography>
        <Grid container spacing={3}>
          {filtreliUrunler.map((urun) => (
            <Grid item xs={12} sm={6} md={4} key={urun._id || urun.id}>
              <UrunKarti urun={{ ...urun, _id: urun._id || urun.id, id: urun.id || urun._id }} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Çok Satanlar */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Çok Satanlar
        </Typography>
        <Grid container spacing={3}>
          {cokSatanlar.length > 0 ? (
            cokSatanlar.map((urun) => (
              <Grid item xs={12} sm={6} md={3} key={urun._id || urun.id}>
                <UrunKarti urun={{ ...urun, _id: urun._id || urun.id, id: urun.id || urun._id }} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}><Typography color="text.secondary">Çok satan kitap yok.</Typography></Grid>
          )}
        </Grid>
      </Box>

      {/* Yeni Çıkanlar */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Çıkanlar
        </Typography>
        <Grid container spacing={3}>
          {yeniCikanlar.length > 0 ? (
            yeniCikanlar.map((urun) => (
              <Grid item xs={12} sm={6} md={3} key={urun._id || urun.id}>
                <UrunKarti urun={{ ...urun, _id: urun._id || urun.id, id: urun.id || urun._id }} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}><Typography color="text.secondary">Yeni çıkan kitap yok.</Typography></Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Anasayfa;
