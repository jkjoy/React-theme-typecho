import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';

function Header({ siteInfo = {} }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchKeyword)}`;
      setSearchKeyword('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              {siteInfo.logo ? (
                <img src={siteInfo.logo} alt={siteInfo.title || 'Blog Logo'} />
              ) : (
                <h1>{siteInfo.title || 'My Blog'}</h1>
              )}
            </Link>
            {siteInfo.description && (
              <p className="site-description">{siteInfo.description}</p>
            )}
          </div>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>首页</Link>
              </li>
              <li className="nav-item">
                <Link to="/archives" onClick={() => setIsMenuOpen(false)}>归档</Link>
              </li>
              <li className="nav-item search-item">
                <form className="header-search-form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <button type="submit" aria-label="Search">
                    <FaSearch />
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
