const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Initialize Google Vision client (credentials handled automatically in Cloud Run)
const visionClient = new ImageAnnotatorClient();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
// OCR endpoint
app.post('/api/ocr', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing OCR request...');

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64');

    // IMPORTANT CHANGE: Use documentTextDetection instead of textDetection
    // This provides better structure recognition for forms and labels
    const [result] = await visionClient.documentTextDetection({
      image: { content: imageBuffer },
      imageContext: {
        // Help the OCR understand we're looking for structured text
        languageHints: ['en']
      }
    });

    console.log('OCR processing completed');

    // Extract the full document text
    const fullText = result.fullTextAnnotation?.text || '';
    
    // Log what we found for debugging
    console.log('Extracted text preview:', fullText.substring(0, 200) + '...');
    
    // Extract structured data with bounding boxes
    const pages = result.fullTextAnnotation?.pages || [];
    const blocks = pages[0]?.blocks || [];
    
    // Create a structured response with text and positional data
    const structuredText = blocks.map(block => {
      const blockText = block.paragraphs
        ?.map(p => p.words
          ?.map(w => w.symbols
            ?.map(s => s.text || '').join('')
          ).join(' ')
        ).join('\n') || '';
      
      return {
        text: blockText,
        confidence: block.confidence || 0,
        boundingBox: block.boundingBox
      };
    });

    // Return comprehensive response
    res.json({
      text: fullText,
      textAnnotations: result.textAnnotations || [],
      fullTextAnnotation: result.fullTextAnnotation || null,
      structuredText: structuredText,
      // Include page-level data for spatial analysis
      pages: pages.map(page => ({
        width: page.width,
        height: page.height,
        blocks: page.blocks?.length || 0
      }))
    });

  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({
      error: 'OCR processing failed',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'hazdec-scanner',
    ocrMode: 'documentTextDetection',
    version: '1.0.0'
  });
});

// Serve the main HTML page explicitly with error handling
app.get('/', (req, res) => {
  console.log('Root path requested, serving index.html');
  const indexPath = path.join(__dirname, 'index.html');
  console.log('Looking for index.html at:', indexPath);
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      // Try to list files in directory for debugging
      const fs = require('fs');
      fs.readdir(__dirname, (dirErr, files) => {
        if (!dirErr) {
          console.log('Files in directory:', files);
        }
      });
      res.status(404).send(`
        <h1>Error: index.html not found</h1>
        <p>Path attempted: ${indexPath}</p>
        <p>Error details: ${err.message}</p>
      `);
    }
  });
});

// Also handle /index.html explicitly
app.get('/index.html', (req, res) => {
  console.log('index.html explicitly requested');
  const indexPath = path.join(__dirname, 'index.html');
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).send(`
        <h1>Error: index.html not found</h1>
        <p>Path attempted: ${indexPath}</p>
        <p>Error details: ${err.message}</p>
      `);
    }
  });
});

// Serve static files (JS, CSS, images, etc.) - but not as default
app.get('/hazmat-database.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'hazmat-database.js'));
});

app.get('/*.js', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

app.get('/*.css', (req, res) => {
  res.sendFile(path.join(__dirname, req.path));
});

// 404 handler for unmatched routes
app.use((req, res) => {
  console.log('404 - Unmatched route:', req.path);
  res.status(404).send(`
    <h1>404 - Not Found</h1>
    <p>The requested path "${req.path}" was not found.</p>
    <p><a href="/">Go to home page</a></p>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`HAZDEC Scanner server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Using DOCUMENT_TEXT_DETECTION for better form recognition`);
  console.log(`Working directory: ${__dirname}`);
  
  // List files in directory on startup for debugging
  const fs = require('fs');
  fs.readdir(__dirname, (err, files) => {
    if (!err) {
      console.log('Files in server directory:', files);
    }
  });
});
