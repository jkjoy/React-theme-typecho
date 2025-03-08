import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTags } from '../services/api';
import { FaTags } from 'react-icons/fa';

function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const tagsData = await getTags();
        setTags(Array.isArray(tagsData) ? tagsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags. Please try again later.');
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (tags.length === 0) {
    return <div className="no-content">No tags found.</div>;
  }

  // Function to generate a random color from a predefined palette
  const getTagColor = (index) => {
    const colors = [
      '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
      '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b',
      '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#e67e22'
    ];
    return colors[index % colors.length];
  };

  // Sort tags by count (popularity)
  const sortedTags = [...tags].sort((a, b) => (b.count || 0) - (a.count || 0));

  return (
    <div className="tags-page">
      <div className="container">
        <h1 className="page-title">
          <FaTags className="page-icon" /> Tags
        </h1>
        
        <div className="tags-cloud">
          {sortedTags.map((tag, index) => (
            <Link 
              key={tag.mid} 
              to={`/tag/${tag.slug}`} 
              className="tag-link"
              style={{ 
                fontSize: `${Math.max(0.8, Math.min(2, 0.8 + (tag.count || 0) / 10))}rem`,
                backgroundColor: getTagColor(index),
              }}
            >
              {tag.name}
              <span className="tag-count">({tag.count || 0})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tags;
