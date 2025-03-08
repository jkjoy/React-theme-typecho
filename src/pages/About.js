import React, { useState, useEffect } from 'react';
import { getPostBySlug } from '../services/api';
import CommentSection from '../components/CommentSection';
import { FaInfoCircle } from 'react-icons/fa';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        setLoading(true);
        const data = await getPostBySlug('about');
        setAboutData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching about page:', err);
        setError('Failed to load about page. Please try again later.');
        setLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (loading) {
    return <div className="loading">Loading about page...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!aboutData) {
    return <div className="no-content">About page not found.</div>;
  }

  return (
    <div className="about-page">
      <div className="container">
        <article className="about-content">
          <header className="about-header">
            <h1 className="page-title">
              <FaInfoCircle className="page-icon" /> {aboutData.title}
            </h1>
          </header>
          
          <div 
            className="about-body"
            dangerouslySetInnerHTML={{ __html: aboutData.content }}
          />
          
          {aboutData.allowComment && (
            <div className="about-comments">
              <CommentSection 
                postId={aboutData.cid} 
                slug={aboutData.slug}
                csrfToken={aboutData.csrfToken}
              />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default About;
