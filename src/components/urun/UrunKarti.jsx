import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Rating,
} from '@mui/material';
import { ShoppingCart, Favorite } from '@mui/icons-material';
import { addToCart } from '../../store/slices/cartSlice';
import { addFavorite, removeFavorite, selectIsFavorite } from '../../store/slices/favoritesSlice';

const UrunKarti = ({ urun }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isFavorite = useSelector(selectIsFavorite(urun?._id));

  if (!urun || (!urun._id && !urun.id)) {
    return null;
  }

  const urunId = urun._id || urun.id;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...urun, id: urunId }));
  };

  const handleToggleFavorite = () => {
    if (!token) {
      navigate('/auth/giris');
      return;
    }
    if (isFavorite) {
      dispatch(removeFavorite({ productId: urunId, token }));
    } else {
      dispatch(addFavorite({ productId: urunId, token }));
    }
  };

  const handleClick = () => {
    navigate(`/urun/${urunId}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={urun.resimUrl || '/placeholder.png'}
        alt={urun.ad}
        sx={{ objectFit: 'contain', p: 2 }}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          noWrap 
          sx={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          {urun.ad}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {urun.yazar}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={urun.puan} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({urun.puan})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          {typeof urun.fiyat === "number" ? urun.fiyat.toFixed(2) + ' ₺' : 'Fiyat Yok'}
        </Typography>
        <Typography variant="body2" color={urun.stok > 0 ? "success.main" : "error.main"}>
          {urun.stok > 0 ? 'Stokta' : 'Tükendi'}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleClick}
        >
          İncele
        </Button>
        <Box>
          <IconButton 
            size="small"
            onClick={handleAddToCart}
            disabled={urun.stok === 0}
            color="primary"
          >
            <ShoppingCart />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleToggleFavorite}
            color={isFavorite ? "secondary" : "default"}
          >
            <Favorite />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default UrunKarti;
