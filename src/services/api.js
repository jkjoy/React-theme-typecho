import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://www.imsun.org',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    return { error: error.response.data };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request:', error.request);
    return { error: 'No response received from server' };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
    return { error: error.message };
  }
};

// Process API response
const processResponse = (response) => {
  if (response.data && response.data.status === 'success') {
    const data = response.data.data;
    return {
      posts: data.dataSet || [],
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      totalPages: data.pages || 1,
      totalPosts: data.count || 0
    };
  }
  return { posts: [], page: 1, pageSize: 10, totalPages: 1, totalPosts: 0 };
};

// Get all posts with pagination and filtering options
export const getPosts = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/posts', { params });
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      const data = response.data.data;
      return {
        posts: data.dataSet || [],
        page: data.page || 1,
        pageSize: data.pageSize || 10,
        totalPages: data.pages || 1,
        totalPosts: data.count || 0
      };
    }
    return { posts: [], page: 1, pageSize: 10, totalPages: 1, totalPosts: 0 };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a single post by slug or cid
export const getPostBySlug = async (slugOrCid) => {
  try {
    // Check if slugOrCid is a number (cid) or string (slug)
    const isNumeric = !isNaN(slugOrCid) && !isNaN(parseFloat(slugOrCid));
    const params = isNumeric ? { cid: slugOrCid } : { slug: slugOrCid };
    
    const response = await apiClient.get(`/api/post`, { params });
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      const postData = response.data.data;
      
      // Process the post data to ensure it has the correct structure
      if (postData) {
        // Make sure text field is mapped to content if needed
        if (postData.text && !postData.content) {
          postData.content = postData.text;
        }
        
        // Handle categories field
        if (postData.categories && Array.isArray(postData.categories) && postData.categories.length > 0) {
          // Set the first category as the primary category
          postData.category = postData.categories[0];
        } else if (postData.category && typeof postData.category === 'string') {
          // If category is just a string, create a proper category object
          const categorySlug = postData.directory && postData.directory.length > 0 ? postData.directory[0] : '';
          postData.category = {
            name: postData.category,
            slug: categorySlug
          };
        }
        
        return postData;
      }
    }
    
    return null;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get posts by category
export const getPostsByCategory = async (categorySlug, params = {}) => {
  try {
    const response = await apiClient.get(`/api/posts`, { 
      params: { 
        filterType: 'category',
        filterSlug: categorySlug,
        ...params 
      } 
    });
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get posts by tag
export const getPostsByTag = async (tagSlug, params = {}) => {
  try {
    const response = await apiClient.get(`/api/posts`, { 
      params: { 
        filterType: 'tag',
        filterSlug: tagSlug,
        ...params 
      } 
    });
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Search posts
export const searchPosts = async (keyword, params = {}) => {
  try {
    const response = await apiClient.get(`/api/posts`, { 
      params: { 
        filterType: 'search',
        filterSlug: keyword,
        ...params 
      } 
    });
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get archives
export const getArchives = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/archives', { params });
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      const archiveData = response.data.data;
      
      // If the data is already in the expected format with dataSet organized by year and month
      if (archiveData && archiveData.dataSet && typeof archiveData.dataSet === 'object') {
        return {
          totalPosts: archiveData.count || 0,
          posts: archiveData.dataSet || {}
        };
      }
      
      // If the API returns a flat list of posts, organize them by year and month
      if (archiveData && Array.isArray(archiveData)) {
        const formattedData = {
          totalPosts: archiveData.length,
          posts: {}
        };
        
        archiveData.forEach(post => {
          if (post.year && post.month) {
            // Initialize year if it doesn't exist
            if (!formattedData.posts[post.year]) {
              formattedData.posts[post.year] = {};
            }
            
            // Initialize month if it doesn't exist
            if (!formattedData.posts[post.year][post.month]) {
              formattedData.posts[post.year][post.month] = [];
            }
            
            // Add post to the appropriate year and month
            formattedData.posts[post.year][post.month].push(post);
          }
        });
        
        return formattedData;
      }
      
      // Return the data as is if it's already in the expected format
      return archiveData || { totalPosts: 0, posts: {} };
    }
    
    return { totalPosts: 0, posts: {} };
  } catch (error) {
    console.error('Error fetching archives:', error);
    return { totalPosts: 0, posts: {} };
  }
};

// Get all pages
export const getPages = async () => {
  try {
    const response = await apiClient.get('/api/pages');
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a single page by slug
export const getPageBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/api/page`, { params: { slug } });
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories');
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      // Return the categories array directly
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all tags
export const getTags = async () => {
  try {
    const response = await apiClient.get('/api/tags');
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      // Return the tags array directly
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    return handleApiError(error);
  }
};

// Get comments by post ID
export const getCommentsByPostId = async (postId, params = {}) => {
  try {
    const response = await apiClient.get(`/api/comments`, { 
      params: { 
        cid: postId,
        ...params 
      } 
    });
    
    console.log('Comments API response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      // Return the comments array directly - they already have a nested structure with children
      const comments = response.data.data.dataSet || [];
      console.log('Processed comments data:', comments);
      return comments;
    }
    return [];
  } catch (error) {
    return handleApiError(error);
  }
};

// Get recent comments
export const getRecentComments = async (size = 5) => {
  try {
    const response = await apiClient.get('/api/recentComments', { 
      params: { size } 
    });
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      // Return the comments array directly
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    return handleApiError(error);
  }
};

// Post a new comment
export const postComment = async (commentData) => {
  try {
    const response = await apiClient.post('/api/comment', commentData);
    return processResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Default settings to use when API call fails
const getDefaultSettings = () => {
  return {
    title: 'Blog',
    description: '',
    keywords: '',
    timezone: '28800'
  };
};

// Get blog settings
export const getSettings = async () => {
  try {
    const response = await apiClient.get('/api/settings');
    
    // Check if the response has the expected structure
    if (response.data && response.data.status === 'success') {
      // Return the settings data directly
      return response.data.data || getDefaultSettings();
    }
    
    return getDefaultSettings();
  } catch (error) {
    console.error('Error fetching blog settings:', error);
    return getDefaultSettings();
  }
};

export default {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  searchPosts,
  getArchives,
  getPages,
  getPageBySlug,
  getCategories,
  getTags,
  getCommentsByPostId,
  getRecentComments,
  postComment,
  getSettings
};
