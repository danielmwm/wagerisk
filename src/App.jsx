import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Personalized from './pages/Personalized';
import Search from './pages/Search';
import Companies from './pages/Companies';
import Compare from './pages/Compare';
import Sources from './pages/Sources';
import NotFound from './pages/NotFound';
import ReviewsPreview from './pages/ReviewsPreview';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF6' }}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/personalized" element={<Personalized />} />
            <Route path="/search" element={<Search />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/reviews-preview" element={<ReviewsPreview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
