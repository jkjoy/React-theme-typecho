import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaFolder, FaComment, FaUser, FaTags } from 'react-icons/fa';
import { getPostBySlug, getCategories, getTags, getRecentComments } from '../services/api';
import CommentSection from '../components/CommentSection';
import Sidebar from '../components/Sidebar';

function PostDetail() {
  const { slug, cid } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Determine if we're using slug or cid for fetching the post
        const postIdentifier = cid || slug;
        
        // Fetch post details
        const postResponse = await getPostBySlug(postIdentifier);
        
        // Debug: Log post response to check for token
        console.log('Post response:', postResponse);
        
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        
        // Fetch tags for sidebar
        const tagsResponse = await getTags();
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        
        setPost(postResponse);
        setCategories(categoriesResponse || []);
        setTags(tagsResponse || []);
        setRecentComments(commentsResponse || []);
        
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching post with identifier ${cid || slug}:`, err);
        setError('Failed to load the post. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, cid, location.pathname]);

  if (loading) {
    return <div className="loading">正在加载文章...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="error">文章不存在</div>;
  }

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="post-detail-page">
      <div className="row">
        <div className="col-md-8">
          <article className="post-detail">
            <h1 className="post-detail-title">{post.title}</h1>
            
            <div className="post-detail-meta">
              <span className="post-meta-item">
                <FaCalendarAlt className="post-meta-icon" />
                {formatDate(post.created)}
              </span>
              
              {post.category && (
                <span className="post-meta-item">
                  <FaFolder className="post-meta-icon" />
                  {post.category.slug ? (
                    <Link to={`/category/${post.category.slug}`}>{post.category.name}</Link>
                  ) : (
                    post.category.name || (typeof post.category === 'string' ? post.category : '')
                  )}
                </span>
              )}
              
              {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && !post.category && (
                <span className="post-meta-item">
                  <FaFolder className="post-meta-icon" />
                  <Link to={`/category/${post.categories[0].slug}`}>{post.categories[0].name}</Link>
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
              
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <span className="post-meta-item">
                  <FaTags className="post-meta-icon" />
                  {post.tags.map((tag, index) => (
                    <React.Fragment key={tag.mid || index}>
                      <Link to={`/tag/${tag.slug}`}>{tag.name}</Link>
                      {index < post.tags.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </span>
              )}
            </div>
            
            <div 
              className="post-detail-content"
              dangerouslySetInnerHTML={{ __html: post.content || post.text || '' }}
            />
          </article>
          
          <CommentSection postId={post.cid} slug={post.slug} token={post.csrfToken} />
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

export default PostDetail;
