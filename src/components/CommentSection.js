import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLink, FaReply } from 'react-icons/fa';
import { getCommentsByPostId, postComment, getCsrfToken } from '../services/api';
import md5 from 'md5';

// Get API base URL from environment variables or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://www.imsun.org';
const COMMENT_ENDPOINT = '/api/comment';

function CommentSection({ postId, slug, token }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    url: '',
    text: '',
    parent: 0
  });
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [csrfToken, setCsrfToken] = useState(token || null);

  // Debug token
  useEffect(() => {
    console.log('CommentSection received token:', token);
    if (token) {
      setCsrfToken(token);
    }
  }, [token]);

  // Fetch CSRF token if not provided
  useEffect(() => {
    const fetchCsrfToken = async () => {
      if (!csrfToken && postId) {
        try {
          console.log('Fetching CSRF token for post:', postId);
          const token = await getCsrfToken(postId);
          if (token) {
            console.log('Successfully fetched CSRF token:', token);
            setCsrfToken(token);
          } else {
            console.warn('Failed to fetch CSRF token');
          }
        } catch (err) {
          console.error('Error fetching CSRF token:', err);
        }
      }
    };

    fetchCsrfToken();
  }, [postId, csrfToken]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const commentsData = await getCommentsByPostId(postId);
        console.log('Raw comments data:', commentsData);
        setComments(Array.isArray(commentsData) ? commentsData : []);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching comments for post ${postId}:`, err);
        setError('Failed to load comments. Please try again later.');
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReply = (commentId, authorName) => {
    setReplyTo({ id: commentId, name: authorName });
    setFormData(prev => ({
      ...prev,
      parent: commentId
    }));
    
    // Scroll to comment form
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = () => {
    setReplyTo(null);
    setFormData(prev => ({
      ...prev,
      parent: 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.author.trim() || !formData.email.trim() || !formData.text.trim()) {
      setSubmitError('请填写必填字段（姓名、邮箱和评论内容）');
      return;
    }
    
    // Validate token
    if (!csrfToken) {
      console.error('Missing token for comment submission');
      setSubmitError('评论提交失败：缺少必要的验证信息（token）');
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Prepare comment data - ensure all fields are in the expected format
      const commentData = {
        author: formData.author.trim(),
        mail: formData.email.trim(), // The server might expect 'mail' instead of 'email'
        url: formData.url.trim() || '',
        text: formData.text.trim(),
        parent: formData.parent || 0,
        cid: postId,
        token: csrfToken
      };
      
      console.log('Submitting comment data:', commentData);
      
      // Try using the fetch API with JSON content type
      try {
        const response = await fetch(`${API_BASE_URL}${COMMENT_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(commentData),
          mode: 'no-cors' // This might help with CORS issues
        });
        
        console.log('Comment submission response:', response);
        
        // Reset form after submission
        setFormData({
          author: '',
          email: '',
          url: '',
          text: '',
          parent: 0
        });
        setReplyTo(null);
        setSubmitSuccess(true);
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
        
        // Refresh comments after a delay
        setTimeout(async () => {
          try {
            const commentsData = await getCommentsByPostId(postId);
            setComments(Array.isArray(commentsData) ? commentsData : []);
          } catch (err) {
            console.error('Error refreshing comments:', err);
          }
          setSubmitting(false);
        }, 2000);
        
        return; // Exit early if fetch was successful
      } catch (fetchError) {
        console.error('Error using fetch for comment submission:', fetchError);
        // Fall back to form submission if fetch fails
      }
      
      // Fallback: Direct form submission approach
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${API_BASE_URL}${COMMENT_ENDPOINT}`;
      form.target = '_blank'; // Open in new tab for debugging
      form.enctype = 'application/json'; // Change to JSON content type
      
      // Add a single JSON field
      const jsonInput = document.createElement('input');
      jsonInput.type = 'hidden';
      jsonInput.name = 'json';
      jsonInput.value = JSON.stringify(commentData);
      form.appendChild(jsonInput);
      
      // Log the JSON being sent
      console.log('Sending JSON data:', JSON.stringify(commentData));
      
      // Append form to document and submit
      document.body.appendChild(form);
      form.submit();
      
      // Reset form after submission
      setFormData({
        author: '',
        email: '',
        url: '',
        text: '',
        parent: 0
      });
      setReplyTo(null);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        // Clean up
        document.body.removeChild(form);
      }, 3000);
      
      // Refresh comments after a delay
      setTimeout(async () => {
        try {
          const commentsData = await getCommentsByPostId(postId);
          setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (err) {
          console.error('Error refreshing comments:', err);
        }
        setSubmitting(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error posting comment:', err);
      setSubmitError('评论提交失败，请稍后再试');
      setSubmitting(false);
    }
  };

  // Function to process comments
  const processComments = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0) {
      return [];
    }
    
    console.log('Processing comments:', comments);
    
    // The API already returns comments with a nested structure
    // where each parent comment has a 'children' array
    return comments;
  };

  // Render a single comment
  const renderComment = (comment, isChild = false) => {
    const date = new Date(comment.created * 1000);
    
    // Generate avatar URL from email hash if available
    let avatarUrl = null;
    if (comment.mailHash) {
      avatarUrl = `https://g.imsun.org/avatar/${comment.mailHash}`;
    }
    
    return (
      <div 
        key={comment.coid} 
        className={`comment-item ${isChild ? 'comment-child' : 'comment-parent'}`} 
        id={`comment-${comment.coid}`}
      >
        <div className="comment-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={comment.author} />
          ) : (
            <div className="default-avatar">{comment.author.charAt(0).toUpperCase()}</div>
          )}
        </div>
        
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">
              {comment.url ? (
                <a href={comment.url} target="_blank" rel="noopener noreferrer">{comment.author}</a>
              ) : (
                comment.author
              )}
            </span>
            <button 
              className="comment-reply-button" 
              onClick={() => handleReply(comment.coid, comment.author)}
            >
              <FaReply /> 回复
            </button>
          </div>
          
          <div className="comment-date">{date.toLocaleString()}</div>
          
          <div className="comment-text">
            {comment.parent > 0 && comment.parent_author && (
              <span className="reply-to-username">@{comment.parent_author} </span>
            )}
            <div dangerouslySetInnerHTML={{ __html: comment.text }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3 className="section-title">评论 ({Array.isArray(comments) ? comments.length : 0})</h3>
      
      {loading ? (
        <div className="loading">Loading comments...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : !Array.isArray(comments) || comments.length === 0 ? (
        <div className="no-comments">暂无评论</div>
      ) : (
        <div className="comments-list">
          {processComments(comments).map((comment, index) => (
            <div key={comment.coid || `comment-group-${index}`} className="comment-group">
              <div className="comment-parent-container">
                {renderComment(comment)}
              </div>
              
              {comment.children && comment.children.length > 0 && (
                <div className="comment-children-container">
                  {comment.children.map(child => renderComment(child, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="comment-form-container" id="comment-form">
        <h4 className="form-title">
          {replyTo ? `回复 ${replyTo.name}` : '发表评论'}
          {replyTo && (
            <button className="cancel-reply" onClick={cancelReply}>
              取消回复
            </button>
          )}
        </h4>
        
        {submitSuccess && (
          <div className="submit-success">评论提交成功！</div>
        )}
        
        {submitError && (
          <div className="submit-error">{submitError}</div>
        )}
        
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="author">
                <FaUser /> 昵称 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> 邮箱 <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="url">
                <FaLink /> 网站
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="text">评论内容 <span className="required">*</span></label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows="5"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? '提交中...' : '提交评论'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;
