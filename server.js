const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.')); // Serve files from root directory

// Initialize Google Vision client (credentials handled automatically in Cloud Run)
const visionClient = new ImageAnnotatorClient();

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// OCR endpoint with enhanced document text detection
app.post('/api/ocr', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing OCR request...');

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64');

    // IMPORTANT: Use documentTextDetection for better structure recognition
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
    
    // Log preview for debugging
    console.log('Extracted text preview:', fullText.substring(0, 200) + '...');
    
    // Extract structured data with bounding boxes
    const pages = result.fullTextAnnotation?.pages || [];
    const blocks = pages[0]?.blocks || [];
    
    // Create structured text response with confidence scores
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

    // Extract table data if detected
    const tableData = [];
    
    // Process blocks to detect table-like structures
    if (blocks.length > 0) {
      let currentRow = [];
      let lastY = null;
      const yThreshold = 20; // Pixels threshold for same row
      
      blocks.forEach(block => {
        if (block.boundingBox?.vertices) {
          const avgY = block.boundingBox.vertices.reduce((sum, v) => sum + (v.y || 0), 0) / 4;
          
          // Check if this block is on a new row
          if (lastY !== null && Math.abs(avgY - lastY) > yThreshold) {
            if (currentRow.length > 0) {
              tableData.push({
                cells: currentRow.map(b => b.text),
                confidence: currentRow.reduce((sum, b) => sum + b.confidence, 0) / currentRow.length
              });
            }
            currentRow = [];
          }
          
          const blockText = block.paragraphs
            ?.map(p => p.words
              ?.map(w => w.symbols
                ?.map(s => s.text || '').join('')
              ).join(' ')
            ).join(' ') || '';
          
          currentRow.push({
            text: blockText,
            confidence: block.confidence || 0,
            x: block.boundingBox.vertices[0].x || 0
          });
          
          lastY = avgY;
        }
      });
      
      // Don't forget the last row
      if (currentRow.length > 0) {
        // Sort by x position to maintain column order
        currentRow.sort((a, b) => a.x - b.x);
        tableData.push({
          cells: currentRow.map(b => b.text),
          confidence: currentRow.reduce((sum, b) => sum + b.confidence, 0) / currentRow.length
        });
      }
    }

    // Log structured data stats
    console.log(`Found ${structuredText.length} text blocks`);
    console.log(`Found ${tableData.length} potential table rows`);
    
    // High confidence blocks for debugging
    const highConfBlocks = structuredText.filter(b => b.confidence > 0.9);
    console.log(`High confidence blocks (>90%): ${highConfBlocks.length}`);

    // Return comprehensive response
    res.json({
      text: fullText,
      textAnnotations: result.textAnnotations || [],
      fullTextAnnotation: result.fullTextAnnotation || null,
      structuredText: structuredText,
      tableData: tableData,
      // Include page-level data for spatial analysis
      pages: pages.map(page => ({
        width: page.width,
        height: page.height,
        blocks: page.blocks?.length || 0,
        confidence: page.confidence || 0
      })),
      // Include detected languages
      detectedLanguages: result.fullTextAnnotation?.pages?.[0]?.property?.detectedLanguages || [],
      // Processing metadata
      metadata: {
        totalBlocks: blocks.length,
        avgConfidence: structuredText.length > 0 
          ? structuredText.reduce((sum, b) => sum + b.confidence, 0) / structuredText.length 
          : 0,
        hasTableStructure: tableData.length > 2,
        ocrMode: 'documentTextDetection'
      }
    });

  } catch (error) {
    console.error('OCR Error:', error);
    
    // Detailed error response
    res.status(500).json({
      error: 'OCR processing failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint with detailed status
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'hazdec-scanner',
    version: '2.0',
    ocrMode: 'documentTextDetection',
    environment: process.env.NODE_ENV || 'production'
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    service: 'HAZDEC Scanner API',
    version: '2.0',
    endpoints: {
      'POST /api/ocr': 'Process image for dangerous goods text extraction',
      'GET /health': 'Service health check',
      'GET /api/info': 'API information'
    },
    features: [
      'Document text detection for structured forms',
      'Table structure detection',
      'Confidence scoring',
      'Multi-language support (optimized for English)',
      'High-resolution image processing'
    ]
  });
});

// Handle 404s
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['/api/ocr', '/health', '/api/info']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred processing your request'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 HAZDEC Scanner server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`ℹ️  API info: http://localhost:${port}/api/info`);
  console.log(`🔍 Using DOCUMENT_TEXT_DETECTION for enhanced form recognition`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
});
