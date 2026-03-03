import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Islands from './pages/Islands';
import IslandDetail from './pages/IslandDetail';
import Contact from './pages/Contact';
import PlanTrip from './pages/PlanTrip';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/islands" element={<Islands />} />
          <Route path="/island/:id" element={<IslandDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Future routes for feature pages */}
          <Route path="/island/:id/hotels" element={<ComingSoon feature="Hotels" />} />
          <Route path="/island/:id/restaurants" element={<ComingSoon feature="Restaurants" />} />
          <Route path="/island/:id/temples" element={<ComingSoon feature="Temples" />} />
          <Route path="/island/:id/activities" element={<ComingSoon feature="Things to Do" />} />
          <Route path="/island/:id/beaches" element={<ComingSoon feature="Beaches" />} />
          <Route path="/island/:id/cuisines" element={<ComingSoon feature="Cuisines" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Coming Soon Component for feature pages
const ComingSoon = ({ feature }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {feature}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          This feature is coming soon! We're working hard to bring you detailed information about {feature.toLowerCase()}.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default App;
