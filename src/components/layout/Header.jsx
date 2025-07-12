import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Search,
  AccountCircle,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { selectCartItemCount } from '../../store/slices/cartSlice';
import { selectFavoriteItems } from '../../store/slices/favoritesSlice';
import { setSearchQuery, setSearchResults } from '../../store/slices/searchSlice';
import { selectTumUrunler } from '../../store/slices/urunlerSlice';

const kategoriler = [
  { ad: 'Ana Sınıfı Kitapları', path: '/kategori/ana-sinif' },
  { ad: 'İlk Okul Kitapları', path: '/kategori/ilkokul' },
  { ad: 'Okul Öncesi Kitapları', path: '/kategori/okul-oncesi' },
  { ad: 'Orta Okul Kitapları', path: '/kategori/ortaokul' },
  { ad: 'Hobi Oyunları', path: '/kategori/hobi-oyunlari' },
  { ad: 'Okuma Kitapları', path: '/kategori/okuma-kitaplari' },
  { ad: 'Deneme Sınavları', path: '/kategori/deneme-sinavlari' },
  { ad: 'Sözlükler ve Ansiklopediler', path: '/kategori/sozlukler-ansiklopedi' },
];

const Header = () => {
  const [kategoriMenuAnchor, setKategoriMenuAnchor] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);
  const favoriteItems = useSelector(selectFavoriteItems);
  const urunler = useSelector(selectTumUrunler);

  const handleKategoriMenuOpen = (event) => {
    setKategoriMenuAnchor(event.currentTarget);
  };

  const handleKategoriMenuClose = () => {
    setKategoriMenuAnchor(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    const query = searchValue.toLowerCase().trim();
    const results = urunler.filter(urun =>
      urun.ad.toLowerCase().includes(query) ||
      urun.yazar.toLowerCase().includes(query) ||
      urun.kategori.toLowerCase().includes(query)
    );

    dispatch(setSearchQuery(searchValue));
    dispatch(setSearchResults(results));
    navigate('/arama');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/giris');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            mr: 2,
          }}
        >
          <img
            src="/logo.svg"
            alt="Doruk Kitap"
            style={{ height: '40px', marginRight: '10px', marginTop: '8px' }}
          />
        </Box>

        {/* Kategoriler Menüsü */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Button
            color="inherit"
            onClick={handleKategoriMenuOpen}
            endIcon={<KeyboardArrowDown />}
          >
            Kategoriler
          </Button>
          <Menu
            anchorEl={kategoriMenuAnchor}
            open={Boolean(kategoriMenuAnchor)}
            onClose={handleKategoriMenuClose}
          >
            {kategoriler.map((kategori) => (
              <MenuItem
                key={kategori.path}
                onClick={() => {
                  navigate(kategori.path);
                  handleKategoriMenuClose();
                }}
              >
                {kategori.ad}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Arama Kutusu */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            p: '2px 4px',
            flexGrow: 1,
            mx: 2,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Kitap, yazar veya kategori ara..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
        </Box>



        {/* Sağ Menü */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Favorilerim">
            <IconButton
              color="inherit"
              component={Link}
              to="/favorilerim"
              sx={{ position: 'relative' }}
            >
              <Badge badgeContent={favoriteItems.length} color="secondary">
                <Favorite />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Sepetim">
            <IconButton
              color="inherit"
              component={Link}
              to="/sepetim"
              sx={{ position: 'relative' }}
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Hesabım">
            <IconButton
              color="inherit"
              component={Link}
              to="/hesabim"
              sx={{ position: 'relative' }}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>

          <Button color="inherit" component={Link} to="/iletisim">
            İletişim
          </Button>
          <Button color="inherit" component={Link} to="/giris">
            Giriş Yap
          </Button>
          <Button color="inherit" component={Link} to="/kayit">
            Üye Ol
          </Button>
          <Button color="inherit" onClick={handleLogout} style={{ marginLeft: 16, padding: '6px 12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Çıkış
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
