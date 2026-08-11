import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Loader from './Components/Loader/Loader'
import Home from './Pages/Home/Home'
import ProductCardPage from './Pages/ProductCard/ProductCard'
import ProductViewPage from './Pages/ProductViewPage/ProductViewPage'
import Cart from './Pages/Cart/Cart'
import Checkout from './Pages/Checkout/Checkout'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import AboutUs from './Pages/AboutUs/AboutUs'
import ContactUs from './Pages/ContactUs/ContactUs'
import Blog from './Pages/Blog/Blog'
import OrderHistorypage from './Pages/OrderHistorypage/OrderHistorypage'
import Profile from './Pages/Profile/Profile'
import AdminDashboard from './Pages/Dashboards/Admin-Dashboard/Admin-Dashboard'
import SuperadminDashboard from './Pages/Dashboards/Superadmin-Dashboard/Superadmin-Dashboard'
import CoockiePolicy from './Pages/Coockie-Policy/Coockie-Policy'
import PriavacyPolicy from './Pages/Priavacy-Policy/Priavacy-Policy'
import TermsCondition from './Pages/Terms&Condition/Terms&Condition'
import ForgetPassword from './Pages/Forget-Password/Forget-Password'

function App() {
  return (
    <ErrorBoundary>
      <>
        <Loader />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ProductCardPage />} />
            <Route path="/product/:id" element={<ProductViewPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistorypage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin" element={
              <ProtectedRoute requiredRole="superadmin">
                <SuperadminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/cookie-policy" element={<CoockiePolicy />} />
            <Route path="/privacy-policy" element={<PriavacyPolicy />} />
            <Route path="/terms" element={<TermsCondition />} />
          </Routes>
        </main>
        <Footer />
      </>
    </ErrorBoundary>
  )
}

export default App
