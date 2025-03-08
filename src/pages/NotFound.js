import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">页面不存在</p>
      <Link to="/" className="not-found-link">返回首页</Link>
    </div>
  );
}

export default NotFound;
