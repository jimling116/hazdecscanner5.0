// Netlify Function – Google Vision OCR with Base64 credentials
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');

// Decode base64 credentials if needed
if (process.env.GCLOUD_CREDENTIALS_BASE64 && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const credsPath = '/tmp/gcloud-creds.json';
  fs.writeFileSync(credsPath, Buffer.from(process.env.GCLOUD_CREDENTIALS_BASE64, 'base64').toString('utf-8'));
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;
}

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

    // Initialize Vision client (credentials are set via environment above)
    const client = new ImageAnnotatorClient();

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
