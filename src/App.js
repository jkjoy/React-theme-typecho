import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostDetail from './pages/PostDetail';
import PageDetail from './pages/PageDetail';
import CategoryPosts from './pages/CategoryPosts';
import TagPosts from './pages/TagPosts';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import About from './pages/About';
import Archives from './pages/Archives';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { getSettings } from './services/api';
import './App.css';

function App() {
  // State for site settings
  const [siteInfo, setSiteInfo] = useState({
    title: 'Blog',
    description: 'A blog powered by Typecho API',
    keywords: '',
    timezone: '28800'
  });
  const [loading, setLoading] = useState(true);

  // Fetch site settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setSiteInfo(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Set page title based on site settings
  useEffect(() => {
    document.title = siteInfo.title;
    
    // Add meta tags for description and keywords
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = siteInfo.description;
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = siteInfo.keywords;
  }, [siteInfo]);

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header siteInfo={siteInfo} />
          <main className="main-content container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/archives/:cid" element={<PostDetail />} />
              <Route path="/page/:slug" element={<PageDetail />} />
              <Route path="/category/:slug" element={<CategoryPosts />} />
              <Route path="/tag/:slug" element={<TagPosts />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/about" element={<About />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer siteInfo={siteInfo} />
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
