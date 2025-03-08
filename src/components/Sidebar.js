import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaTags, FaComment, FaQuoteLeft } from 'react-icons/fa';
import { getRecentComments } from '../services/api';

function Sidebar({ categories = [], tags = [], activeCategorySlug, activeTagSlug }) {
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentComments = async () => {
      try {
        setLoading(true);
        const comments = await getRecentComments(10);
        setRecentComments(Array.isArray(comments) ? comments : []);
      } catch (error) {
        console.error('Error fetching recent comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentComments();
  }, []);

  // Function to decode HTML entities
  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  // Function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  // Process comment text
  const processCommentText = (text) => {
    if (!text) return '';
    const decodedText = decodeHtmlEntities(text);
    const strippedText = stripHtml(decodedText);
    return strippedText.length > 40 ? `${strippedText.substring(0, 40)}...` : strippedText;
  };

  return (
    <div className="sidebar-container">
      {/* Recent Comments Widget */}
      <div className="sidebar">
        <h3 className="sidebar-title">
          <FaComment className="sidebar-icon" />
          最新评论
        </h3>
        {loading ? (
          <div className="loading-comments">加载评论中...</div>
        ) : recentComments.length > 0 ? (
          <ul className="sidebar-list comment-list">
            {recentComments.map(comment => (
              <li key={comment.coid} className="comment-item">
                <Link to={`/post/${comment.cid}#comment-${comment.coid}`} className="comment-link">
                  <div className="comment-header">
                    <span className="comment-author">
                      {decodeHtmlEntities(comment.author)}
                    </span>
                  </div>
                  <div className="comment-content">
                    <div className="comment-quote">
                      <FaQuoteLeft className="quote-icon" />
                      <span className="comment-text">
                        {processCommentText(comment.text)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-comments">暂无评论</div>
        )}
      </div>
      
      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="sidebar">
          <h3 className="sidebar-title">
            <FaFolder className="sidebar-icon" />
            分类
          </h3>
          <ul className="sidebar-list">
            {categories
              .filter(category => category.count > 0)
              .map(category => (
                <li 
                  key={category.mid} 
                  className={`sidebar-list-item ${activeCategorySlug === category.slug ? 'active' : ''}`}
                >
                  <Link to={`/category/${category.slug}`}>
                    {category.name} ({category.count || 0})
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Tags Widget */}
      {tags.length > 0 && (
        <div className="sidebar">
          <h3 className="sidebar-title">
            <FaTags className="sidebar-icon" />
            标签
          </h3>
          <div className="tag-cloud">
            {tags
              .filter(tag => tag.count > 0)
              .map(tag => (
                <Link 
                  key={tag.mid} 
                  to={`/tag/${tag.slug}`}
                  className={`tag-item ${activeTagSlug === tag.slug ? 'active' : ''}`}
                >
                  {tag.name} ({tag.count || 0})
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
