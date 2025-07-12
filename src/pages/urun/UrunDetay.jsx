import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

  const urun = useSelector((state) => selectUrunById(state, id));

  if (!urun) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Ürün bulunamadı.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aradığınız ürün bulunamadı veya kaldırılmış olabilir.
          </Typography>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UrunDetay;
