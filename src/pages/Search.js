import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaFolder, FaComment, FaUser, FaSearch } from 'react-icons/fa';
import { searchPosts, getCategories, getTags, getRecentComments } from '../services/api';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';

function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get('q') || '';
  
  const [keyword, setKeyword] = useState(initialKeyword);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);
  const pageSize = 10;

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!keyword.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const searchResult = await searchPosts(keyword, {
        page: currentPage,
        pageSize: pageSize,
        showContent: false,
        showDigest: 'excerpt',
        limit: 200
      });
      
      setPosts(searchResult.posts || []);
      setTotalPages(searchResult.totalPages || 1);
    } catch (err) {
      console.error(`Error searching posts with keyword ${keyword}:`, err);
      setError('搜索失败，请稍后再试。');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, currentPage, pageSize]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        
        // Fetch tags for sidebar
        const tagsResponse = await getTags();
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        
        setCategories(categoriesResponse || []);
        setTags(tagsResponse || []);
        setRecentComments(commentsResponse || []);
      } catch (err) {
        console.error('Error fetching sidebar data:', err);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    if (initialKeyword) {
      handleSearch();
    }
  }, [initialKeyword, handleSearch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    handleSearch();
  };

  return (
    <div className="search-page">
      <div className="row">
        <div className="col-md-8">
          <div className="search-header">
            <h1 className="search-title">搜索文章</h1>
            
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="输入关键词搜索..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>
          </div>
          
          {loading ? (
            <div className="loading">正在搜索...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : searched ? (
            <>
              <div className="search-results-header">
                {posts.length > 0 ? (
                  <h2 className="search-results-title">
                    找到 {posts.length} 篇与 "{keyword}" 相关的文章
                  </h2>
                ) : (
                  <h2 className="search-results-title">
                    没有找到与 "{keyword}" 相关的文章
                  </h2>
                )}
              </div>
              
              {posts.length > 0 && (
                <>
                  {posts.map(post => (
                    <article key={post.cid} className="post-card">
                      {post.thumbnail && (
                        <img src={post.thumbnail} alt={post.title} className="post-card-image" />
                      )}
                      <div className="post-card-content">
                        <h2 className="post-title">
                          <Link to={`/post/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <div className="post-meta">
                          <span className="post-meta-item">
                            <FaCalendarAlt className="post-meta-icon" />
                            {new Date(post.created * 1000).toLocaleDateString()}
                          </span>
                          {post.category && (
                            <span className="post-meta-item">
                              <FaFolder className="post-meta-icon" />
                              <Link to={`/category/${post.category.slug}`}>{post.category.name}</Link>
                            </span>
                          )}
                          <span className="post-meta-item">
                            <FaComment className="post-meta-icon" />
                            {post.commentsNum} 评论
                          </span>
                          {post.author && (
                            <span className="post-meta-item">
                              <FaUser className="post-meta-icon" />
                              {post.author.screenName}
                            </span>
                          )}
                        </div>
                        <div className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.digest }} />
                        <Link to={`/post/${post.slug}`} className="read-more">阅读全文</Link>
                      </div>
                    </article>
                  ))}
                  
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </>
              )}
            </>
          ) : null}
        </div>
        
        <div className="col-md-4">
          <Sidebar 
            categories={categories}
            tags={tags}
            recentComments={recentComments}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
