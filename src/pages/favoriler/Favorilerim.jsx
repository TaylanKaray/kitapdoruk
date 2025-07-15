import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  selectFavoriteItems,
  fetchFavorites,
  removeFavorite,
  clearFavorites,
} from '../../store/slices/favoritesSlice';
import { addToCart } from '../../store/slices/cartSlice';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Favorilerim = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteItems = useSelector(selectFavoriteItems);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [detailedFavorites, setDetailedFavorites] = React.useState([]);

  // Kullanıcı token'ı localStorage'dan alınıyor
  const token = localStorage.getItem('token');

  // Favori ürünlerin tam bilgisi için ürünleri backend'den çek
  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    // Favori ürünlerin tam bilgisi için ürünleri backend'den çek
    const fetchDetails = async () => {
      if (favoriteItems.length > 0) {
        // Favoriler backend'den sadece _id ile geliyorsa, ürün detaylarını çek
        const ids = favoriteItems.map(item => item._id).join(',');
        try {
          const res = await axios.get(`${API_URL}/products`, {
            params: { ids },
          });
          setDetailedFavorites(res.data.filter(p => favoriteItems.some(f => f._id === p._id)));
        } catch {
          setDetailedFavorites([]);
        }
      } else {
        setDetailedFavorites([]);
      }
    };
    fetchDetails();
  }, [favoriteItems]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete && token) {
      dispatch(removeFavorite({ productId: itemToDelete._id, token }));
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleClearFavorites = () => {
    setClearDialogOpen(true);
  };

  const confirmClearFavorites = () => {
    dispatch(clearFavorites());
    setClearDialogOpen(false);
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart({ ...item, adet: 1 }));
  };

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Favorilerim sayfasını görmek için giriş yapmalısınız.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/auth/giris')}
        >
          Giriş Yap
        </Button>
      </Container>
    );
  }

  if (detailedFavorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Favori Listeniz Boş
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Favori listenizde ürün bulunmamaktadır.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Alışverişe Başla
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Favorilerim
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFavorites}
            startIcon={<DeleteIcon />}
          >
            Listeyi Temizle
          </Button>
        </Grid>

        {detailedFavorites.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || item.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.resimUrl}
                alt={item.ad}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {item.ad}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.yazar}
                </Typography>
                <Typography variant="h6" color="primary">
                  {item.fiyat} TL
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(item)}
                >
                  <DeleteIcon />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(item)}
                >
                  Sepete Ekle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ürün Silme Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Favorilerden Kaldır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.ad} adlı ürünü favorilerden kaldırmak istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Kaldır
          </Button>
        </DialogActions>
      </Dialog>

      {/* Listeyi Temizleme Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
      >
        <DialogTitle>Favori Listesini Temizle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tüm favorilerinizi silmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmClearFavorites} color="error" variant="contained">
            Temizle
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Favorilerim;
