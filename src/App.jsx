import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import store from './store';
import tema from './tema';
import Header from './components/layout/Header';
import Anasayfa from './pages/Anasayfa';
import Giris from './pages/auth/Giris';
import Kayit from './pages/auth/Kayit';
import SifremiUnuttum from './pages/auth/SifremiUnuttum';
import UrunDetay from './pages/urun/UrunDetay';
import Sepetim from './pages/sepet/Sepetim';
import Favorilerim from './pages/favoriler/Favorilerim';
import Hesabim from './pages/hesap/Hesabim';
import YoneticiPaneli from './pages/yonetici/YoneticiPaneli';
import SiparisOzeti from './pages/siparis/SiparisOzeti';
import SiparisDurumu from './pages/siparis/SiparisDurumu';
import Odeme from './pages/odeme/Odeme';
import Iletisim from './pages/iletisim/Iletisim';

// Kategori sayfaları
import AnaSinifKitaplari from './pages/kategoriler/AnaSinifKitaplari';
import IlkOkulKitaplari from './pages/kategoriler/IlkOkulKitaplari';
import OkulOncesiKitaplari from './pages/kategoriler/OkulOncesiKitaplari';
import OrtaOkulKitaplari from './pages/kategoriler/OrtaOkulKitaplari';
import HobiOyunlari from './pages/kategoriler/HobiOyunlari';
import OkumaKitaplari from './pages/kategoriler/OkumaKitaplari';
import DenemeSinavlari from './pages/kategoriler/DenemeSinavlari';
import SozluklerAnsiklopedi from './pages/kategoriler/SozluklerAnsiklopedi';
import AramaSonuclari from './pages/arama/AramaSonuclari';
import CokSatanlar from './pages/cokSatanlar';
import YeniCikanlar from './pages/yeniCikanlar';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={tema}>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Anasayfa />} />
              <Route path="/giris" element={<Giris />} />
              <Route path="/kayit" element={<Kayit />} />
              <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
              <Route path="/urun/:id" element={<UrunDetay />} />
              <Route path="/sepetim" element={<Sepetim />} />
              <Route path="/favorilerim" element={<Favorilerim />} />
              <Route path="/hesabim" element={<Hesabim />} />
              <Route path="/yonetici" element={<YoneticiPaneli />} />
              <Route path="/siparis-ozeti" element={<SiparisOzeti />} />
              <Route path="/siparis-durumu" element={<SiparisDurumu />} />
              <Route path="/odeme" element={<Odeme />} />
              <Route path="/arama" element={<AramaSonuclari />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/cok-satanlar" element={<CokSatanlar />} />
              <Route path="/yeni-cikanlar" element={<YeniCikanlar />} />

              {/* Kategori Route'ları */}
              <Route path="/kategori/ana-sinif" element={<AnaSinifKitaplari />} />
              <Route path="/kategori/ilkokul" element={<IlkOkulKitaplari />} />
              <Route path="/kategori/okul-oncesi" element={<OkulOncesiKitaplari />} />
              <Route path="/kategori/ortaokul" element={<OrtaOkulKitaplari />} />
              <Route path="/kategori/hobi-oyunlari" element={<HobiOyunlari />} />
              <Route path="/kategori/okuma-kitaplari" element={<OkumaKitaplari />} />
              <Route path="/kategori/deneme-sinavlari" element={<DenemeSinavlari />} />
              <Route path="/kategori/sozlukler-ansiklopedi" element={<SozluklerAnsiklopedi />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
