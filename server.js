const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const fs = require('fs');
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

// CRITICAL: Serve index.html explicitly for root path
app.get('/', (req, res) => {
  console.log('Root path requested');
  const indexPath = path.join(__dirname, 'index.html');
  
  // Check if file exists
  if (fs.existsSync(indexPath)) {
    console.log('Serving index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    res.type('html').send(htmlContent);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(404).send(`
      <h1>Error: index.html not found</h1>
      <p>Expected location: ${indexPath}</p>
      <p>Files in directory: ${fs.readdirSync(__dirname).join(', ')}</p>
    `);
  }
});

// Serve hazmat-database.js explicitly
app.get('/hazmat-database.js', (req, res) => {
  const filePath = path.join(__dirname, 'hazmat-database.js');
  if (fs.existsSync(filePath)) {
    res.type('application/javascript').sendFile(filePath);
  } else {
    res.status(404).send('hazmat-database.js not found');
  }
});

// Serve any other JavaScript files
app.get('/*.js', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath) && req.path !== '/server.js') { // Don't serve server.js
    res.type('application/javascript').sendFile(filePath);
  } else {
    res.status(404).send('JavaScript file not found');
  }
});

// Serve CSS files if any
app.get('/*.css', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  if (fs.existsSync(filePath)) {
    res.type('text/css').sendFile(filePath);
  } else {
    res.status(404).send('CSS file not found');
  }
});

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

    // Use documentTextDetection for better form recognition
    const [result] = await visionClient.documentTextDetection({
      image: { content: imageBuffer },
      imageContext: {
        languageHints: ['en']
      }
    });

    console.log('OCR processing completed');

    // Extract the full document text
    const fullText = result.fullTextAnnotation?.text || '';
    
    // Log preview for debugging
    console.log('Extracted text preview:', fullText.substring(0, 200) + '...');
    
    // Extract structured data with bounding boxes
    const pages = result.fullTextAnnotation?.pages || [];
    const blocks = pages[0]?.blocks || [];
    
    // Create structured response
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
    version: '2.0.0'
  });
});

// Debug endpoint to see what files are in the container
app.get('/debug', (req, res) => {
  const files = fs.readdirSync(__dirname);
  const indexExists = fs.existsSync(path.join(__dirname, 'index.html'));
  const packageExists = fs.existsSync(path.join(__dirname, 'package.json'));
  
  res.json({
    workingDirectory: __dirname,
    files: files,
    indexHtmlExists: indexExists,
    packageJsonExists: packageExists,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'not set'
  });
});

// 404 handler - MUST be last
app.use((req, res) => {
  console.log(`404 - Path not found: ${req.path}`);
  res.status(404).send(`
    <h1>404 - Not Found</h1>
    <p>The requested path "${req.path}" was not found on this server.</p>
    <p><a href="/">Go to HAZDEC Scanner</a></p>
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

// Start server
app.listen(port, () => {
  console.log(`HAZDEC Scanner server running on port ${port}`);
  console.log(`Working directory: ${__dirname}`);
  
  // List files on startup
  const files = fs.readdirSync(__dirname);
  console.log('Files in directory:', files);
  
  // Check for critical files
  const criticalFiles = ['index.html', 'hazmat-database.js', 'package.json'];
  criticalFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      console.log(`✓ ${file} found`);
    } else {
      console.error(`✗ ${file} NOT FOUND - This will cause issues!`);
    }
  });
});
