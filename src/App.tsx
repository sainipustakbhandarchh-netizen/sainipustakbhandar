import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { CategoryPage } from './pages/CategoryPage';
import { FreeBooks } from './pages/FreeBooks';
import { ProductPage } from './pages/ProductPage';
import { Admin } from './pages/Admin';
import { Wishlist } from './pages/Wishlist';
import ScrollToTop from './components/layout/ScrollToTop';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { Cart } from './pages/Cart';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="category/:categoryId" element={<CategoryPage />} />
              <Route path="free-books" element={<FreeBooks />} />
              <Route path="product/:productId" element={<ProductPage />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
            </Route>
            
            {/* Admin Route - Outside of normal website Layout */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
