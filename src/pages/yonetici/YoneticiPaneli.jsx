import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import UrunEkle from './UrunEkle';
import UrunDuzenle from './UrunDuzenle';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const YoneticiPaneli = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUrun, setSelectedUrun] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urunToDelete, setUrunToDelete] = useState(null);
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userActionLoading, setUserActionLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Token'dan admin bilgisini oku
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (!decoded.isAdmin) {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [token, navigate]);

  // Admin kontrolü ve ürünleri çek
  useEffect(() => {
    const fetchUserAndProducts = async () => {
      if (!token) {
        setUserChecked(true);
        setIsAdmin(false);
        return;
      }
      try {
        const userRes = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(userRes.data.isAdmin);
        setUserChecked(true);
        if (userRes.data.isAdmin) {
          const urunRes = await axios.get(`${API_URL}/products`);
          setUrunler(urunRes.data);
        }
      } catch {
        setIsAdmin(false);
        setUserChecked(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProducts();
  }, [token]);

  // Siparişleri çek
  useEffect(() => {
    const fetchOrders = async () => {
      if (isAdmin && token) {
        setOrdersLoading(true);
        try {
          const res = await axios.get(`${API_URL}/orders/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(res.data);
        } catch {}
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [token, isAdmin]);

  useEffect(() => {
    async function fetchUsers() {
      if (isAdmin && token) {
        setUsersLoading(true);
        try {
          const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        } catch (error) {
          setUsers([]);
        }
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, [isAdmin, token]);

  const handleUserDelete = async (id) => {
    setUserActionLoading(true);
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== id));
    } catch {}
    setUserActionLoading(false);
  };
  const handleAdminToggle = async (id, isAdminNow) => {
    setUserActionLoading(true);
    try {
      const res = await axios.put(`${API_URL}/users/${id}/admin`, { isAdmin: !isAdminNow }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => u._id === id ? res.data.user : u));
    } catch {}
    setUserActionLoading(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUrunEkle = () => {
    setDialogOpen(true);
  };

  const handleUrunSil = (urun) => {
    setUrunToDelete(urun);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (urunToDelete && token) {
      try {
        await axios.delete(`${API_URL}/products/${urunToDelete._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrunler(urunler.filter(u => u._id !== urunToDelete._id));
      } catch {}
      setDeleteDialogOpen(false);
      setUrunToDelete(null);
    }
  };

  const handleUrunDuzenle = (urun) => {
    setSelectedUrun(urun);
    setEditDialogOpen(true);
  };

  const handleUrunEklendi = (yeniUrun) => {
    setUrunler([...urunler, yeniUrun]);
    setDialogOpen(false);
  };

  const handleUrunGuncellendi = (guncelUrun) => {
    setUrunler(urunler.map(u => u._id === guncelUrun._id ? guncelUrun : u));
    setEditDialogOpen(false);
  };

  const renderUrunYonetimi = () => (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Ürün Listesi</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleUrunEkle}
        >
          Yeni Ürün Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ürün Adı</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urunler.map((urun) => (
              <TableRow key={urun._id}>
                <TableCell>{urun.name || urun.ad}</TableCell>
                <TableCell>{urun.description || urun.aciklama}</TableCell>
                <TableCell>{urun.price || urun.fiyat} TL</TableCell>
                <TableCell>{urun.stock || urun.stok}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleUrunDuzenle(urun)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleUrunSil(urun)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UrunEkle
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUrunEklendi={handleUrunEklendi}
      />

      <UrunDuzenle
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        urun={selectedUrun}
        onUrunGuncellendi={handleUrunGuncellendi}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Ürün Silme Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{urunToDelete?.name || urunToDelete?.ad}" adlı ürünü silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderKullaniciYonetimi = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Kullanıcılar</Typography>
      {usersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Admin mi?</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.isAdmin ? 'Evet' : 'Hayır'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.isAdmin ? 'warning' : 'success'}
                      disabled={userActionLoading}
                      onClick={() => handleAdminToggle(user._id, user.isAdmin)}
                    >
                      {user.isAdmin ? 'Adminliği Al' : 'Admin Yap'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={userActionLoading}
                      onClick={() => handleUserDelete(user._id)}
                      sx={{ ml: 1 }}
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const siparisDurumlari = ['Hazırlanıyor', 'Kargoda', 'Teslim Edildi'];
  const handleSiparisDurumGuncelle = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {}
  };
  const renderSiparisYonetimi = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Siparişler</Typography>
      {ordersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Ürünler</TableCell>
                <TableCell>Toplam</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.user?.email || '-'}</TableCell>
                  <TableCell>
                    {order.products.map((p, i) => (
                      <div key={i}>
                        {p.product?.name || p.product?.ad} x {p.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{order.total} TL</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString('tr-TR')}</TableCell>
                  <TableCell>
                    <select
                      value={order.status || 'Hazırlanıyor'}
                      onChange={e => handleSiparisDurumGuncelle(order._id, e.target.value)}
                    >
                      {siparisDurumlari.map(durum => (
                        <option key={durum} value={durum}>{durum}</option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  if (loading && !userChecked) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (!isAdmin && userChecked) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')}>Anasayfa</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Yönetici Paneli
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Ürün Yönetimi" />
          <Tab label="Sipariş Yönetimi" />
          <Tab label="Kullanıcı Yönetimi" />
        </Tabs>
      </Box>

      {activeTab === 0 && renderUrunYonetimi()}
      {activeTab === 1 && renderSiparisYonetimi()}
      {activeTab === 2 && renderKullaniciYonetimi()}
    </Container>
  );
};

export default YoneticiPaneli;
