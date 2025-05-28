const { ImageAnnotatorClient } = require('@google-cloud/vision');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request
    const { image } = JSON.parse(event.body || '{}');
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image provided' })
      };
    }

    // Handle credentials - try both methods
    let client;
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      // Method 1: JSON string
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      client = new ImageAnnotatorClient({ credentials });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Method 2: File path (standard way)
      client = new ImageAnnotatorClient();
    } else {
      throw new Error('No Google Cloud credentials found');
    }

    // Convert base64 to buffer and call Vision API
    const imageBuffer = Buffer.from(image, 'base64');
    const [result] = await client.textDetection({
      image: { content: imageBuffer }
    });

    // Return structured response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        textAnnotations: result.textAnnotations || [],
        fullTextAnnotation: result.fullTextAnnotation || null,
        text: result.textAnnotations?.[0]?.description || ''
      })
    };

  } catch (error) {
    console.error('OCR Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'OCR processing failed',
        details: error.message 
      })
    };
  }
};