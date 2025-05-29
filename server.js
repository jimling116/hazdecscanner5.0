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
    ocrMode: 'documentTextDetection'
  });
});

// Handle 404s
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`HAZDEC Scanner server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Using DOCUMENT_TEXT_DETECTION for better form recognition`);
});
