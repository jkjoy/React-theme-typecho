import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { getPageBySlug, getCategories, getTags, getRecentComments } from '../services/api';
import Sidebar from '../components/Sidebar';

function PageDetail() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch page details
        const pageResponse = await getPageBySlug(slug);
        
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        
        // Fetch tags for sidebar
        const tagsResponse = await getTags();
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        
        setPage(pageResponse);
        setCategories(categoriesResponse || []);
        setTags(tagsResponse || []);
        setRecentComments(commentsResponse || []);
        
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching page with slug ${slug}:`, err);
        setError('Failed to load the page. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="loading">正在加载页面...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!page) {
    return <div className="error">页面不存在</div>;
  }

  return (
    <div className="page-detail-page">
      <div className="row">
        <div className="col-md-8">
          <article className="post-detail">
            <h1 className="post-detail-title">{page.title}</h1>
            
            <div className="post-detail-meta">
              <span className="post-meta-item">
                <FaCalendarAlt className="post-meta-icon" />
                {new Date(page.created * 1000).toLocaleDateString()}
              </span>
              {page.author && (
                <span className="post-meta-item">
                  <FaUser className="post-meta-icon" />
                  {page.author.screenName}
                </span>
              )}
            </div>
            
            <div 
              className="post-detail-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
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

export default PageDetail;
