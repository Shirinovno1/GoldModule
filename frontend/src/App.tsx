import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/admin/LoginPage';
import { SecretBrandingLoginPage } from './pages/admin/SecretBrandingLoginPage';
import { AdminLayout } from './components/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { ProductsListPage } from './pages/admin/ProductsListPage';
import { ProductEditorPage } from './pages/admin/ProductEditorPage';
import { SecretBrandingPage } from './pages/admin/SecretBrandingPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen bg-black text-white">
                <Header />
                <HomePage />
                <Footer />
              </div>
            } />
            <Route path="/products" element={
              <div className="min-h-screen bg-black text-white">
                <Header />
                <ProductsPage />
                <Footer />
              </div>
            } />
            <Route path="/products/:id" element={
              <div className="min-h-screen bg-black text-white">
                <Header />
                <ProductDetailPage />
                <Footer />
              </div>
            } />
            <Route path="/about" element={
              <div className="min-h-screen bg-black text-white">
                <Header />
                <AboutPage />
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen bg-black text-white">
                <Header />
                <ContactPage />
                <Footer />
              </div>
            } />

            {/* Secret Branding Page - Hidden URL */}
            <Route path="/fakhrispage" element={<SecretBrandingLoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="products" element={<ProductsListPage />} />
              <Route path="products/:id" element={<ProductEditorPage />} />
              <Route path="secret-branding" element={<SecretBrandingPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
