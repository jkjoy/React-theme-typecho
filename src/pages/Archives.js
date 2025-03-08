import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArchives, getCategories, getTags, getRecentComments } from '../services/api';
import Sidebar from '../components/Sidebar';

function Archives() {
  const [archives, setArchives] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch archives data
        const archivesResponse = await getArchives({
          showContent: false,
          showDigest: false
        });
        
        // Check if there was an error
        if (archivesResponse.error) {
          setError('Failed to load archives. Please try again later.');
          setArchives(null);
        } else {
          setArchives(archivesResponse || null);
        }
        
        // Fetch categories for sidebar
        const categoriesResponse = await getCategories();
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);
        
        // Fetch tags for sidebar
        const tagsResponse = await getTags();
        setTags(Array.isArray(tagsResponse) ? tagsResponse : []);
        
        // Fetch recent comments for sidebar
        const commentsResponse = await getRecentComments(5);
        setRecentComments(Array.isArray(commentsResponse) ? commentsResponse : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching archives:', err);
        setError('Failed to load archives. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return monthNames[parseInt(month) - 1] || month;
  };

  if (loading) {
    return <div className="loading">正在加载归档...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Check if we have valid archives data
  const hasArchives = archives && 
                     archives.posts && 
                     typeof archives.posts === 'object' && 
                     Object.keys(archives.posts).length > 0;

  return (
    <div className="archives-page">
      <div className="row">
        <div className="col-md-8">
          <div className="archives-header">
            <h1 className="archives-title">文章归档</h1>
            {archives && archives.totalPosts && (
              <div className="archives-count">共 {archives.totalPosts} 篇文章</div>
            )}
          </div>
          
          {!hasArchives ? (
            <div className="no-archives">暂无归档</div>
          ) : (
            <div className="archives-content">
              {Object.keys(archives.posts || {})
                .sort((a, b) => b - a) // Sort years in descending order
                .map(year => (
                  <div key={year} className="archive-year-section">
                    <h2 className="archive-year">{year}年</h2>
                    
                    {Object.keys(archives.posts[year])
                      .sort((a, b) => b - a) // Sort months in descending order
                      .map(month => (
                        <div key={`${year}-${month}`} className="archive-month-section">
                          <h3 className="archive-month">{getMonthName(month)}</h3>
                          
                          <ul className="archive-list">
                            {archives.posts[year][month].map(post => (
                              <li key={post.cid} className="archive-item">
                                <span className="archive-date">
                                  {post.date ? 
                                    `${post.date.year}-${post.date.month}-${post.date.day}` : 
                                    (post.created ? 
                                      new Date(post.created * 1000).toLocaleDateString('zh-CN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                      }) : 
                                      `${year}-${month}`
                                    )
                                  }
                                </span>
                                <Link to={post.slug ? `/post/${post.slug}` : `/archives/${post.cid}`}>
                                  {post.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
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

export default Archives;
