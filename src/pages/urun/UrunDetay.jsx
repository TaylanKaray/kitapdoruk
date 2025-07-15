import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  Divider,
  IconButton,
  Card,
  CardMedia,
  Chip,
  TextField,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  LocalShipping,
  Store,
  Book,
} from '@mui/icons-material';
import { addToCart } from '../../store/slices/cartSlice';
import { addFavorite, removeFavorite } from '../../store/slices/favoritesSlice';
import { selectUrunById } from '../../store/slices/urunlerSlice';

const UrunDetay = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isFavorite = useSelector((state) => (state.favorites.items || []).some((f) => f._id === id));

  const urunFromRedux = useSelector((state) => selectUrunById(state, id));
  const [urun, setUrun] = useState(urunFromRedux);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const [yorumlar, setYorumlar] = useState([]);
  const [yorumYukleniyor, setYorumYukleniyor] = useState(true);
  const [yorum, setYorum] = useState('');
  const [puan, setPuan] = useState(5);
  const [yorumHata, setYorumHata] = useState('');
  const [yorumBasari, setYorumBasari] = useState('');
  const token = localStorage.getItem('token');

  const [stokBildirimEmail, setStokBildirimEmail] = useState('');
  const [stokBildirimDurum, setStokBildirimDurum] = useState('');
  const [stokBildirimHata, setStokBildirimHata] = useState('');

  useEffect(() => {
    setFetchError(false);
    if (!urunFromRedux) {
      setLoading(true);
      const fetchProduct = async () => {
        try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          const res = await axios.get(`${API_URL}/products/${id}`);
          setUrun(res.data);
        } catch (err) {
          setUrun(null);
          setFetchError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setUrun(urunFromRedux);
    }
  }, [id, urunFromRedux]);

  useEffect(() => {
    const fetchYorumlar = async () => {
      setYorumYukleniyor(true);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/products/${id}/yorumlar`);
        setYorumlar(res.data);
      } catch {
        setYorumlar([]);
      }
      setYorumYukleniyor(false);
    };
    fetchYorumlar();
  }, [id]);

  const handleYorumGonder = async (e) => {
    e.preventDefault();
    setYorumHata('');
    setYorumBasari('');
    if (!yorum.trim()) {
      setYorumHata('Yorum boş olamaz.');
      return;
    }
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/products/${id}/yorum`, { puan, yorum }, { headers: { Authorization: `Bearer ${token}` } });
      setYorum('');
      setPuan(5);
      setYorumBasari('Yorumunuz kaydedildi!');
      // Yorumları tekrar çek
      const res = await axios.get(`${API_URL}/products/${id}/yorumlar`);
      setYorumlar(res.data);
    } catch (err) {
      setYorumHata('Yorum eklenirken hata oluştu.');
    }
  };

  const handleStokBildirim = async (e) => {
    e.preventDefault();
    setStokBildirimDurum('');
    setStokBildirimHata('');
    if (!stokBildirimEmail || !stokBildirimEmail.includes('@')) {
      setStokBildirimHata('Geçerli bir e-posta giriniz.');
      return;
    }
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/products/${id}/stok-bildirim`, { email: stokBildirimEmail });
      setStokBildirimDurum('E-posta kaydedildi. Stok gelince bilgilendirileceksiniz.');
      setStokBildirimEmail('');
    } catch {
      setStokBildirimHata('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Yükleniyor...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (!urun) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3 }}>
          {fetchError && (
            <Typography variant="body1" color="error" gutterBottom>
              Ürün backend'den çekilemedi. Lütfen bağlantınızı ve backend'i kontrol edin.
            </Typography>
          )}
          <Grid container spacing={4}>
            {/* Sol Taraf - Placeholder Ürün Resmi */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  image={'/placeholder.png'}
                  alt={'Örnek Kitap'}
                  sx={{
                    width: '100%',
                    height: 500,
                    objectFit: 'contain',
                    bgcolor: 'background.paper',
                    p: 2
                  }}
                />
              </Card>
            </Grid>
            {/* Sağ Taraf - Placeholder Ürün Bilgileri */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: '100%' }}>
                <Typography variant="h4" gutterBottom>
                  Örnek Kitap Başlığı
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={4.5} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (4.5 puan)
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Yazar: Örnek Yazar
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Yayınevi: Örnek Yayınevi
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    00.00 ₺
                  </Typography>
                  <Chip
                    icon={<Store />}
                    label={'Stok Bilgisi Yok'}
                    color={'default'}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  Bu bir örnek ürün açıklamasıdır. Aradığınız ürün bulunamadı veya kaldırılmış olabilir. Lütfen başka bir ürün seçin ya da anasayfaya dönün.
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<Book />}
                    label={'Kategori Bilgisi Yok'}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    disabled
                    size="large"
                    fullWidth
                  >
                    Sepete Ekle
                  </Button>
                  <IconButton
                    color={'default'}
                    disabled
                    sx={{ border: 1, borderColor: 'divider' }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Ürün Açıklaması
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ürün detayları bulunamadı. Lütfen başka bir ürün seçin.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Stok Durumu: Bilinmiyor
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping color="primary" />
                      <Typography variant="body2">
                        150₺ ve üzeri alışverişlerinizde kargo bedava!
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...urun, id: urun._id }));
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(urun));
    } else {
      dispatch(addFavorite(urun));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Taraf - Ürün Resmi */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardMedia
              component="img"
              image={urun.resimUrl || '/placeholder.png'}
              alt={urun.ad}
              sx={{
                width: '100%',
                height: 500,
                objectFit: 'contain',
                bgcolor: 'background.paper',
                p: 2
              }}
            />
          </Card>
        </Grid>

        {/* Sağ Taraf - Ürün Bilgileri */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%' }}>
            {/* Ürün Başlığı ve Değerlendirme */}
            <Typography variant="h4" gutterBottom>
              {urun.ad}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={urun.puan} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({urun.puan} puan)
              </Typography>
            </Box>

            {/* Yazar ve Yayınevi */}
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Yazar: {urun.yazar}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Yayınevi: {urun.yayinevi}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Fiyat ve Stok Durumu */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {urun.fiyat.toFixed(2)} ₺
              </Typography>
              <Chip
                icon={<Store />}
                label={urun.stok > 0 ? 'Stokta' : 'Tükendi'}
                color={urun.stok > 0 ? 'success' : 'error'}
                variant="outlined"
              />
              {urun.stok === 0 && (
                <Box sx={{ mt: 2 }}>
                  <form onSubmit={handleStokBildirim}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Stok gelince haber ver:</Typography>
                    <TextField
                      size="small"
                      label="E-posta adresiniz"
                      value={stokBildirimEmail}
                      onChange={e => setStokBildirimEmail(e.target.value)}
                      sx={{ mr: 1, width: 220 }}
                    />
                    <Button type="submit" variant="contained">Kaydet</Button>
                  </form>
                  {stokBildirimDurum && <Alert severity="success" sx={{ mt: 1 }}>{stokBildirimDurum}</Alert>}
                  {stokBildirimHata && <Alert severity="error" sx={{ mt: 1 }}>{stokBildirimHata}</Alert>}
                </Box>
              )}
            </Box>

            {/* Açıklama */}
            <Typography variant="body1" paragraph>
              {urun.aciklama}
            </Typography>

            {/* Kategori */}
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<Book />}
                label={urun.kategori}
                variant="outlined"
                color="primary"
              />
            </Box>

            {/* Butonlar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={urun.stok === 0}
                size="large"
                fullWidth
              >
                Sepete Ekle
              </Button>
              <IconButton
                color={isFavorite ? 'secondary' : 'default'}
                onClick={handleToggleFavorite}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Ürün Açıklaması
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {urun.aciklama}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Stok Durumu: {urun.stok} adet
              </Typography>
            </Box>

            {/* Teslimat Bilgisi */}
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="primary" />
                <Typography variant="body2">
                  150₺ ve üzeri alışverişlerinizde kargo bedava!
                </Typography>
              </Box>
            </Paper>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>Yorumlar</Typography>
            {yorumYukleniyor ? (
              <Typography>Yorumlar yükleniyor...</Typography>
            ) : yorumlar.length === 0 ? (
              <Typography>Henüz yorum yok.</Typography>
            ) : (
              yorumlar.map((y, i) => (
                <Paper key={i} sx={{ p: 2, mb: 2 }} variant="outlined">
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={y.puan} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {y.kullanici?.name || y.kullanici?.email || 'Kullanıcı'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      {new Date(y.tarih).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{y.yorum}</Typography>
                </Paper>
              ))
            )}
            {token && (
              <Box component="form" onSubmit={handleYorumGonder} sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Yorumunuzu bırakın</Typography>
                <Rating value={puan} onChange={(_, v) => setPuan(v)} sx={{ mb: 1 }} />
                <TextField
                  label="Yorumunuz"
                  multiline
                  minRows={2}
                  fullWidth
                  value={yorum}
                  onChange={e => setYorum(e.target.value)}
                  sx={{ mb: 1 }}
                />
                {yorumHata && <Alert severity="error" sx={{ mb: 1 }}>{yorumHata}</Alert>}
                {yorumBasari && <Alert severity="success" sx={{ mb: 1 }}>{yorumBasari}</Alert>}
                <Button type="submit" variant="contained">Gönder</Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UrunDetay;
