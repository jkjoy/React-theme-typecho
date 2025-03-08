import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { marked } from 'marked';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://www.imsun.org';
        const response = await axios.get(`${apiUrl}/api/posts/${id}`);
        
        // Check if the response has the expected structure based on the API format
        if (response.data && response.data.status === 'success') {
          setPost(response.data.data || {});
        } else {
          setPost({});
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog post. Please try again later.');
        setLoading(false);
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading blog post...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="error">Blog post not found.</div>;
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h2>{post.title}</h2>
        <div className="blog-post-meta">
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        />
      </div>
      <Link to="/">← Back to all posts</Link>
    </div>
  );
}

export default BlogPost;
