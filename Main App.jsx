import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  Home, 
  MovieDetail, 
  Search, 
  Login, 
  Register, 
  AdminDashboard, 
  AdminMovies,
  AdminAddMovie 
} from './pages';
import { Navbar, ProtectedRoute } from './components';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-black text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminOnly>
                  <Routes>
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="movies" element={<AdminMovies />} />
                    <Route path="movies/add" element={<AdminAddMovie />} />
                  </Routes>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;