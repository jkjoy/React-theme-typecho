import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import { FaFolder } from 'react-icons/fa';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (categories.length === 0) {
    return <div className="no-content">No categories found.</div>;
  }

  return (
    <div className="categories-page">
      <div className="container">
        <h1 className="page-title">
          <FaFolder className="page-icon" /> Categories
        </h1>
        
        <div className="categories-list">
          {categories.map((category) => (
            <div key={category.mid} className="category-item">
              <Link to={`/category/${category.slug}`} className="category-link">
                <FaFolder className="category-icon" />
                <span className="category-name">{category.name}</span>
                <span className="category-count">({category.count || 0})</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
