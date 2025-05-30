// Helper function to detect table structure in HAZDEC forms (fallback for compatibility)
function detectTableStructure(blocks) {
  return detectEnhancedTableStructure(blocks);
}const express = require('express');
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

// Enhanced OCR endpoint with highest quality settings
app.post('/api/ocr', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Processing OCR request with highest quality settings...');

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64');

    // Use DOCUMENT_TEXT_DETECTION with enhanced settings for maximum accuracy
    const [result] = await visionClient.documentTextDetection({
      image: { content: imageBuffer },
      imageContext: {
        // Multiple language hints for better accuracy
        languageHints: ['en', 'en-US'],
        // Crop hints to focus on relevant areas (full image)
        cropHintsParams: {
          aspectRatios: [1.0, 1.5, 2.0]
        },
        // Enable all text detection features
        textDetectionParams: {
          enableTextDetectionConfidenceScore: true,
          advancedOcrOptions: ['LEGACY_LAYOUT']
        }
      }
    });

    console.log('OCR processing completed');

    // Extract the full document text
    const fullText = result.fullTextAnnotation?.text || '';
    
    // Log confidence scores
    const avgConfidence = result.fullTextAnnotation?.pages?.[0]?.confidence || 0;
    console.log('OCR Confidence:', (avgConfidence * 100).toFixed(1) + '%');
    console.log('Extracted text length:', fullText.length);
    
    // Extract structured data with high confidence filtering
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
        boundingBox: block.boundingBox,
        // Include paragraph-level data for better structure understanding
        paragraphs: block.paragraphs?.map(p => ({
          text: p.words?.map(w => w.symbols?.map(s => s.text || '').join('')).join(' ') || '',
          confidence: p.confidence || 0
        }))
      };
    });

    // Enhanced table detection with better row/column alignment
    const tableData = detectEnhancedTableStructure(blocks);

    // Also try to detect form fields specifically
    const formFields = detectFormFields(blocks);

    // Return comprehensive response
    res.json({
      text: fullText,
      textAnnotations: result.textAnnotations || [],
      fullTextAnnotation: result.fullTextAnnotation || null,
      structuredText: structuredText,
      tableData: tableData,
      formFields: formFields,
      confidence: avgConfidence,
      // Include page-level data for spatial analysis
      pages: pages.map(page => ({
        width: page.width,
        height: page.height,
        blocks: page.blocks?.length || 0,
        confidence: page.confidence || 0
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

// Enhanced table structure detection with better alignment
function detectEnhancedTableStructure(blocks) {
  const tableRows = [];
  
  // Create a map of blocks with their positions
  const positionedBlocks = blocks.map(block => {
    if (!block.boundingBox?.vertices) return null;
    
    const vertices = block.boundingBox.vertices;
    const minY = Math.min(...vertices.map(v => v.y || 0));
    const maxY = Math.max(...vertices.map(v => v.y || 0));
    const minX = Math.min(...vertices.map(v => v.x || 0));
    const maxX = Math.max(...vertices.map(v => v.x || 0));
    
    return {
      text: extractBlockText(block),
      confidence: block.confidence || 0,
      minX, maxX, minY, maxY,
      centerY: (minY + maxY) / 2,
      centerX: (minX + maxX) / 2,
      height: maxY - minY
    };
  }).filter(b => b !== null);
  
  // Group blocks into rows based on Y position
  const rows = [];
  const used = new Set();
  
  for (let i = 0; i < positionedBlocks.length; i++) {
    if (used.has(i)) continue;
    
    const block = positionedBlocks[i];
    const row = [block];
    used.add(i);
    
    // Find other blocks on the same row (within height tolerance)
    const tolerance = block.height * 0.5;
    
    for (let j = i + 1; j < positionedBlocks.length; j++) {
      if (used.has(j)) continue;
      
      const otherBlock = positionedBlocks[j];
      if (Math.abs(block.centerY - otherBlock.centerY) <= tolerance) {
        row.push(otherBlock);
        used.add(j);
      }
    }
    
    // Sort row by X position
    row.sort((a, b) => a.centerX - b.centerX);
    rows.push({
      y: block.centerY,
      cells: row.map(b => b.text),
      confidence: Math.min(...row.map(b => b.confidence))
    });
  }
  
  // Sort rows by Y position
  rows.sort((a, b) => a.y - b.y);
  
  // Filter out low confidence rows
  return rows.filter(row => row.confidence > 0.7);
}

// Helper function to detect table structure in HAZDEC forms
function detectTableStructure(blocks) {
  const tableRows = [];
  
  // Group blocks by vertical position (Y coordinate)
  const blocksByRow = {};
  
  blocks.forEach(block => {
    if (block.boundingBox && block.boundingBox.vertices) {
      // Get average Y position
      const avgY = block.boundingBox.vertices.reduce((sum, v) => sum + (v.y || 0), 0) / 4;
      const rowKey = Math.round(avgY / 20) * 20; // Group into 20px rows
      
      if (!blocksByRow[rowKey]) {
        blocksByRow[rowKey] = [];
      }
      blocksByRow[rowKey].push({
        text: extractBlockText(block),
        x: block.boundingBox.vertices[0].x || 0,
        confidence: block.confidence
      });
    }
  });
  
  // Sort blocks within each row by X position
  Object.keys(blocksByRow).forEach(rowKey => {
    blocksByRow[rowKey].sort((a, b) => a.x - b.x);
    tableRows.push({
      y: parseInt(rowKey),
      cells: blocksByRow[rowKey].map(b => b.text)
    });
  });
  
  // Sort rows by Y position
  tableRows.sort((a, b) => a.y - b.y);
  
  return tableRows;
}

// Helper to extract text from a block
function extractBlockText(block) {
  return block.paragraphs
    ?.map(p => p.words
      ?.map(w => w.symbols
        ?.map(s => s.text || '').join('')
      ).join(' ')
    ).join('\n') || '';
}

// Detect form fields for HAZDEC forms
function detectFormFields(blocks) {
  const fields = {};
  
  // Look for specific HAZDEC form fields
  const fieldPatterns = {
    unNumber: /UN\s?(\d{4})/,
    properShippingName: /PROPER\s+SHIPPING\s+NAME/i,
    hazardClass: /CLASS\s+OR\s+DIVISION/i,
    packingGroup: /PACKING\s+GROUP/i,
    additionalInfo: /ADDITIONAL\s+HANDLING/i
  };
  
  for (let i = 0; i < blocks.length; i++) {
    const blockText = extractBlockText(blocks[i]);
    const upperText = blockText.toUpperCase();
    
    // Check for field labels
    for (const [field, pattern] of Object.entries(fieldPatterns)) {
      if (pattern.test(upperText)) {
        // Look at next few blocks for the value
        for (let j = i + 1; j < Math.min(i + 5, blocks.length); j++) {
          const valueText = extractBlockText(blocks[j]).trim();
          if (valueText && !Object.values(fieldPatterns).some(p => p.test(valueText.toUpperCase()))) {
            if (!fields[field]) fields[field] = [];
            fields[field].push({
              label: blockText,
              value: valueText,
              confidence: blocks[j].confidence || 0
            });
            break;
          }
        }
      }
    }
  }
  
  return fields;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'hazdec-scanner',
    ocrMode: 'documentTextDetection',
    features: ['multi-item', 'table-detection', 'enhanced-parsing']
  });
});

// Handle 404s
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`HAZDEC Scanner server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Using DOCUMENT_TEXT_DETECTION with enhanced settings`);
  console.log(`Features: High-quality OCR, Table detection, Form field recognition`);
});

// Helper function to detect table structure in HAZDEC forms (fallback for compatibility)
function detectTableStructure(blocks) {
  return detectEnhancedTableStructure(blocks);
}
