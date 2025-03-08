import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'https://www.imsun.org';
        const response = await axios.get(`${apiUrl}/api/posts`);
        
        // Check if the response has the expected structure based on the API format
        if (response.data && response.data.status === 'success') {
          setPosts(response.data.data.dataSet || []);
        } else {
          setPosts([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog posts. Please try again later.');
        setLoading(false);
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="blog-list">
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="blog-post">
            <h2>{post.title}</h2>
            <div className="blog-post-meta">
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <p>{post.excerpt}</p>
            <Link to={`/post/${post.id}`}>Read more</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
