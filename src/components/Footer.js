import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaWeibo } from 'react-icons/fa';

function Footer({ siteInfo = {} }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">关于博客</h3>
            <p>{siteInfo.description || '这是一个使用Typecho API构建的动态博客，展示了如何通过API获取内容并呈现给用户。'}</p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">快速链接</h3>
            <ul className="footer-links">
              <li><Link to="/">首页</Link></li>
              <li><Link to="/archives">归档</Link></li>
              <li><Link to="/page/about">关于</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">联系方式</h3>
            <ul className="footer-links">
              <li><a href="https://github.com/jkjoy" target="_blank" rel="noopener noreferrer"><FaGithub /> GitHub</a></li>
              <li><a href="https://weibo.com/sunpw" target="_blank" rel="noopener noreferrer"><FaWeibo /> 微博</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {siteInfo.title || 'Typecho Blog'}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
