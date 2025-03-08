import axios from 'axios';

// Function to submit a comment to the external API
export const submitComment = async (commentData) => {
  try {
    // Make a direct request to the external API
    const response = await axios.post('https://www.imsun.org/api/comment', commentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error submitting comment:', error);
    
    // Return a structured error response
    return {
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    };
  }
};
