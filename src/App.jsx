import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Islands from './pages/Islands';
import IslandDetail from './pages/IslandDetail';
import IslandGroup from './pages/IslandGroup';
import IslandFeature from './pages/IslandFeature';
import Contact from './pages/Contact';
import PlanTrip from './pages/PlanTrip';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import PublicProfile from './pages/PublicProfile';
import PostDetail from './pages/PostDetail';
import ForgotPassword from './pages/ForgotPassword';
import NewPost from './pages/NewPost';
import About from './pages/About';
import FloatingActions from './components/FloatingActions';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, reason: 'plan-trip' }} />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/islands" element={<Islands />} />
          <Route path="/island/:id" element={<IslandDetail />} />
          <Route path="/group/:groupName" element={<IslandGroup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plan-trip" element={<RequireAuth><PlanTrip /></RequireAuth>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/user/:id" element={<PublicProfile />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/island/:id/:featureType" element={<IslandFeature />} />
        </Routes>
        <Footer />
        <FloatingActions />
      </div>
    </Router>
  );
}
export default App;
