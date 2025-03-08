import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaFolder, FaComment, FaUser } from 'react-icons/fa';
import { getPostsByTag, getCategories, getTags, getRecentComments } from '../services/api';
import Pagination from '../components/Pagination';
import Sidebar from '../components/Sidebar';

function TagPosts() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [tagInfo, setTagInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts by tag with pagination, digest and without full content
        const postsResponse = await getPostsByTag(slug, {
          page: currentPage,
          pageSize,
          showContent: false,
          showDigest: 'excerpt',
          limit: 200
        });
        
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        
        // Fetch tags for sidebar and to get current tag info
        const tagsResponse = await getTags();
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        
        setPosts(postsResponse.posts || []);
        setTotalPages(postsResponse.totalPages || 1);
        setCategories(categoriesResponse || []);
        setTags(tagsResponse || []);
        setRecentComments(commentsResponse || []);
        
        // Find current tag info
        if (tagsResponse) {
          const currentTag = tagsResponse.find(tag => tag.slug === slug);
          setTagInfo(currentTag);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching posts for tag ${slug}:`, err);
        setError('Failed to load tag posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div className="loading">正在加载标签文章...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tag-posts-page">
      <div className="row">
        <div className="col-md-8">
          <div className="tag-header">
            <h1 className="tag-title">
              标签: {tagInfo ? tagInfo.name : slug}
            </h1>
          </div>
          
          {posts.length === 0 ? (
            <div className="no-posts">该标签下暂无文章</div>
          ) : (
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
        </div>
        
        <div className="col-md-4">
          <Sidebar 
            categories={categories}
            tags={tags}
            recentComments={recentComments}
            activeTagSlug={slug}
          />
        </div>
      </div>
    </div>
  );
}

export default TagPosts;
