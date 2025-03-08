import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFolder, FaComment, FaUser } from 'react-icons/fa';
import { getPosts, getCategories, getTags, getRecentComments } from '../services/api';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with pagination, digest and without full content
        const postsResponse = await getPosts({
          page: currentPage,
          pageSize,
          showContent: false,
          showDigest: 'excerpt',
          limit: 200
        });
        
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        
        // Fetch tags for sidebar
        const tagsResponse = await getTags();
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        
        // Set posts and pagination data
        setPosts(postsResponse.posts || []);
        setTotalPages(postsResponse.totalPages || 1);
        setTotalPosts(postsResponse.totalPosts || 0);
        
        setCategories(categoriesResponse || []);
        setTags(tagsResponse || []);
        setRecentComments(commentsResponse || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load blog data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading">正在加载文章...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="row">
        <div className="col-md-8">
          {posts.length === 0 ? (
            <div className="no-posts">暂无文章</div>
          ) : (
            <>
              {/*<div className="posts-header">
                <h1 className="posts-title">最新文章</h1>
                {totalPosts > 0 && (
                  <div className="posts-count">共 {totalPosts} 篇文章</div>
                )}
              </div>*/}
              
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
                        {post.date ? `${post.date.year}-${post.date.month}-${post.date.day}` : new Date(post.created * 1000).toLocaleDateString()}
                      </span>
                      {post.categories && post.categories.length > 0 && (
                        <span className="post-meta-item">
                          <FaFolder className="post-meta-icon" />
                          <Link to={`/category/${post.categories[0].slug}`}>{post.categories[0].name}</Link>
                        </span>
                      )}
                      <span className="post-meta-item">
                        <FaComment className="post-meta-icon" />
                        {post.commentsNum || 0} 评论
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

export default HomePage;
