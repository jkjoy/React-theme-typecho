import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaTags, FaComment, FaSearch } from 'react-icons/fa';

function Sidebar({ categories = [], tags = [], recentComments = [], activeCategorySlug, activeTagSlug }) {
  const [searchKeyword, setSearchKeyword] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchKeyword)}`;
    }
  };

  return (
    <div className="sidebar-container">
      {/* Search Widget */}
      <div className="sidebar">
        <h3 className="sidebar-title">搜索</h3>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="输入关键词搜索..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="sidebar">
          <h3 className="sidebar-title">
            <FaFolder style={{ marginRight: '8px' }} />
            分类
          </h3>
          <ul className="sidebar-list">
            {categories
              .filter(category => category.count > 0)
              .map(category => (
                <li 
                  key={category.mid} 
                  className={`sidebar-list-item ${activeCategorySlug === category.slug ? 'active' : ''}`}
                >
                  <Link to={`/category/${category.slug}`}>
                    {category.name} ({category.count || 0})
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Tags Widget */}
      {tags.length > 0 && (
        <div className="sidebar">
          <h3 className="sidebar-title">
            <FaTags style={{ marginRight: '8px' }} />
            标签
          </h3>
          <div className="tag-cloud">
            {tags
              .filter(tag => tag.count > 0)
              .map(tag => (
                <Link 
                  key={tag.mid} 
                  to={`/tag/${tag.slug}`}
                  className={`tag-item ${activeTagSlug === tag.slug ? 'active' : ''}`}
                >
                  {tag.name} ({tag.count || 0})
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Recent Comments Widget */}
      {recentComments.length > 0 && (
        <div className="sidebar">
          <h3 className="sidebar-title">
            <FaComment style={{ marginRight: '8px' }} />
            最新评论
          </h3>
          <ul className="sidebar-list">
            {recentComments.map(comment => (
              <li key={comment.coid} className="sidebar-list-item">
                <div className="recent-comment">
                  <div className="recent-comment-author">{comment.author}</div>
                  <div className="recent-comment-content">
                    <Link to={`/post/${comment.cid}`}>
                      {comment.text.length > 50 ? `${comment.text.substring(0, 50)}...` : comment.text}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
