// hazmat-database.js - Focused Database for Nellis AFB Operations
// Optimized for fighter jet maintenance, AGE equipment, and common military hazmat

const dgDatabase = {
    // ===== AVIATION FUELS & LUBRICANTS =====
    'UN1863': [
        { psn: 'FUEL, AVIATION, TURBINE ENGINE', class: '3', pg: 'III' }  // JP-8, JP-5
    ],
    'UN1203': [
        { psn: 'GASOLINE', class: '3', pg: 'II' },  // MOGAS for support equipment
        { psn: 'PETROL', class: '3', pg: 'II' },
        { psn: 'MOTOR SPIRIT', class: '3', pg: 'II' }
    ],
    'UN1993': [
        { psn: 'FLAMMABLE LIQUID, N.O.S.', class: '3', pg: 'I' },
        { psn: 'FLAMMABLE LIQUID, N.O.S.', class: '3', pg: 'II' },
        { psn: 'FLAMMABLE LIQUID, N.O.S.', class: '3', pg: 'III' }  // Hydraulic fluids, solvents
    ],
    'UN1268': [
        { psn: 'PETROLEUM DISTILLATES, N.O.S.', class: '3', pg: 'I' },
        { psn: 'PETROLEUM DISTILLATES, N.O.S.', class: '3', pg: 'II' },
        { psn: 'PETROLEUM DISTILLATES, N.O.S.', class: '3', pg: 'III' }
    ],
    
    // ===== AIRCRAFT SUPPORT GASES =====
    'UN1072': [
        { psn: 'OXYGEN, COMPRESSED', class: '2.2', pg: null, subsidiary: '5.1' }  // Aircrew oxygen
    ],
    'UN1073': [
        { psn: 'OXYGEN, REFRIGERATED LIQUID', class: '2.2', pg: null, subsidiary: '5.1' }  // LOX
    ],
    'UN1066': [
        { psn: 'NITROGEN, COMPRESSED', class: '2.2', pg: null }  // Tire servicing, purging
    ],
    'UN1977': [
        { psn: 'NITROGEN, REFRIGERATED LIQUID', class: '2.2', pg: null }  // LIN
    ],
    'UN1046': [
        { psn: 'HELIUM, COMPRESSED', class: '2.2', pg: null }  // Leak detection
    ],
    'UN1006': [
        { psn: 'ARGON, COMPRESSED', class: '2.2', pg: null }  // Welding operations
    ],
    
    // ===== AGE EQUIPMENT & ENGINES =====
    'UN3528': [
        { psn: 'ENGINE, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED', class: '3', pg: null },
        { psn: 'ENGINE, FUEL CELL, FLAMMABLE LIQUID POWERED', class: '3', pg: null },
        { psn: 'MACHINERY, INTERNAL COMBUSTION, FLAMMABLE LIQUID POWERED', class: '3', pg: null },
        { psn: 'MACHINERY, FUEL CELL, FLAMMABLE LIQUID POWERED', class: '3', pg: null }
    ],
    'UN3166': [
        { psn: 'VEHICLE, FLAMMABLE GAS POWERED', class: '9', pg: null },
        { psn: 'VEHICLE, FLAMMABLE LIQUID POWERED', class: '9', pg: null }
    ],
    
    // ===== BATTERIES =====
    'UN2794': [
        { psn: 'BATTERIES, WET, FILLED WITH ACID', class: '8', pg: null }  // AGE batteries
    ],
    'UN2800': [
        { psn: 'BATTERIES, WET, NON-SPILLABLE', class: '8', pg: null }  // Aircraft batteries
    ],
    'UN3480': [
        { psn: 'LITHIUM ION BATTERIES', class: '9', pg: null }  // Modern equipment
    ],
    'UN3481': [
        { psn: 'LITHIUM ION BATTERIES CONTAINED IN EQUIPMENT', class: '9', pg: null },
        { psn: 'LITHIUM ION BATTERIES PACKED WITH EQUIPMENT', class: '9', pg: null }
    ],
    'UN3090': [
        { psn: 'LITHIUM METAL BATTERIES', class: '9', pg: null }
    ],
    'UN3091': [
        { psn: 'LITHIUM METAL BATTERIES CONTAINED IN EQUIPMENT', class: '9', pg: null },
        { psn: 'LITHIUM METAL BATTERIES PACKED WITH EQUIPMENT', class: '9', pg: null }
    ],
    
    // ===== AEROSOLS & MAINTENANCE CHEMICALS =====
    'UN1950': [
        { psn: 'AEROSOLS', class: '2.1', pg: null },  // Flammable aerosols
        { psn: 'AEROSOLS', class: '2.2', pg: null }   // Non-flammable aerosols
    ],
    'UN3082': [
        { psn: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.', class: '9', pg: 'III' }
    ],
    'UN1263': [
        { psn: 'PAINT', class: '3', pg: 'I' },
        { psn: 'PAINT', class: '3', pg: 'II' },
        { psn: 'PAINT', class: '3', pg: 'III' },
        { psn: 'PAINT RELATED MATERIAL', class: '3', pg: 'I' },
        { psn: 'PAINT RELATED MATERIAL', class: '3', pg: 'II' },
        { psn: 'PAINT RELATED MATERIAL', class: '3', pg: 'III' }
    ],
    
    // ===== ORDNANCE & EXPLOSIVES =====
    'UN0012': [
        { psn: 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', class: '1.4', pg: null, cgLetter: 'S' }
    ],
    'UN0328': [
        { psn: 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', class: '1.2', pg: null, cgLetter: 'C' }
    ],
    'UN0323': [
        { psn: 'CARTRIDGES, POWER DEVICE', class: '1.4', pg: null, cgLetter: 'S' }  // Ejection seats
    ],
    'UN0093': [
        { psn: 'FLARES, AERIAL', class: '1.3', pg: null, cgLetter: 'G' }
    ],
    
    // ===== CLEANING & DEICING =====
    'UN1760': [
        { psn: 'CORROSIVE LIQUID, N.O.S.', class: '8', pg: 'I' },
        { psn: 'CORROSIVE LIQUID, N.O.S.', class: '8', pg: 'II' },
        { psn: 'CORROSIVE LIQUID, N.O.S.', class: '8', pg: 'III' }
    ],
    'UN1789': [
        { psn: 'HYDROCHLORIC ACID', class: '8', pg: 'II' },
        { psn: 'HYDROCHLORIC ACID', class: '8', pg: 'III' }
    ],
    'UN3264': [
        { psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', class: '8', pg: 'I' },
        { psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', class: '8', pg: 'II' },
        { psn: 'CORROSIVE LIQUID, ACIDIC, INORGANIC, N.O.S.', class: '8', pg: 'III' }
    ],
    
    // ===== FIRE SUPPRESSION =====
    'UN1044': [
        { psn: 'FIRE EXTINGUISHERS', class: '2.2', pg: null }
    ],
    'UN3358': [
        { psn: 'REFRIGERATING MACHINES', class: '2.1', pg: null }  // Contains flammable gas
    ],
    
    // ===== MEDICAL & OXYGEN SYSTEMS =====
    'UN3156': [
        { psn: 'COMPRESSED GAS, OXIDIZING, N.O.S.', class: '2.2', pg: null, subsidiary: '5.1' }
    ],
    'UN2037': [
        { psn: 'RECEPTACLES, SMALL, CONTAINING GAS', class: '2.1', pg: null },
        { psn: 'RECEPTACLES, SMALL, CONTAINING GAS', class: '2.2', pg: null }
    ],
    
    // ===== MISCELLANEOUS MILITARY =====
    'UN3268': [
        { psn: 'SAFETY DEVICES, electrically initiated', class: '9', pg: null }  // Air bag modules
    ],
    'UN2990': [
        { psn: 'LIFE-SAVING APPLIANCES, SELF-INFLATING', class: '9', pg: null }
    ],
    'UN3072': [
        { psn: 'LIFE-SAVING APPLIANCES, NOT SELF-INFLATING', class: '9', pg: null }
    ],
    'UN3363': [
        { psn: 'DANGEROUS GOODS IN MACHINERY', class: '9', pg: null },
        { psn: 'DANGEROUS GOODS IN APPARATUS', class: '9', pg: null }
    ]
};

// Enhanced parsing function with military-specific patterns
function parseHAZDECLabel(text, blocks = []) {
    console.log('Parsing HAZDEC label...');
    
    const result = {
        unNumber: null,
        psn: null,
        hazClass: null,
        packingGroup: null,
        subsidiaryHazard: null,
        errors: [],
        warnings: []
    };
    
    const normalizedText = text.toUpperCase().replace(/\s+/g, ' ');
    
    // Extract UN Number
    const unPatterns = [
        /UN\s?(\d{4})/,
        /\bID\s?(\d{4})/,
        /UN\s+OR\s+ID\s+NO\.?\s*UN\s?(\d{4})/
    ];
    
    for (const pattern of unPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            result.unNumber = `UN${match[1]}`;
            break;
        }
    }
    
    // Extract PSN using blocks with better boundary detection
    if (result.unNumber && blocks.length > 0) {
        // Find where the main form data ends (before Additional Handling Info)
        let additionalHandlingIndex = blocks.findIndex(b => 
            b.text.toUpperCase().includes('ADDITIONAL HANDLING')
        );
        
        // Set search boundary
        const searchEndIndex = additionalHandlingIndex !== -1 ? additionalHandlingIndex : blocks.length;
        
        // Find UN number block
        const unBlockIndex = blocks.findIndex(b => 
            b.text.toUpperCase().includes(result.unNumber.replace('UN', ''))
        );
        
        if (unBlockIndex !== -1) {
            // Look for PSN after UN number but before Additional Handling
            for (let i = unBlockIndex + 1; i < Math.min(unBlockIndex + 10, searchEndIndex); i++) {
                const blockText = blocks[i].text.trim().toUpperCase();
                
                // Skip headers and labels
                const skipPatterns = [
                    'PROPER SHIPPING NAME',
                    'CLASS OR DIVISION',
                    'PACKING GROUP',
                    'SUBSIDIARY RISK',
                    'UN OR ID',
                    'HAZARD',
                    'QUANTITY AND TYPE',
                    'AUTHORIZATION'
                ];
                
                if (skipPatterns.some(pattern => blockText.includes(pattern))) {
                    continue;
                }
                
                // Check if this looks like a PSN
                if (blockText.length > 5 && /[A-Z]{3,}/.test(blockText) && !/^\d+$/.test(blockText)) {
                    // Additional validation - must contain shipping name keywords
                    const psnKeywords = ['ENGINE', 'BATTERY', 'FUEL', 'PAINT', 'AEROSOL', 
                                       'FLAMMABLE', 'LIQUID', 'SOLID', 'GAS', 'COMPRESSED',
                                       'MACHINERY', 'POWERED', 'COMBUSTION', 'CORROSIVE',
                                       'OXIDIZING', 'TOXIC', 'ENVIRONMENTALLY'];
                    
                    if (psnKeywords.some(keyword => blockText.includes(keyword))) {
                        result.psn = blockText;
                        console.log(`Found PSN in block ${i}: ${result.psn}`);
                        break;
                    }
                }
            }
        }
    }
    
    // Extract Hazard Class - HAZDEC specific parsing
    // On HAZDEC forms, the class is a standalone number in its own field
    let classHeaderIndex = -1;
    
    // First, try text patterns for inline class notation
    const classPatterns = [
        /(?:CLASS|DIVISION)[:\s]+(\d+\.?\d*)/,
        /(?:HAZARD\s+CLASS)[:\s]+(\d+\.?\d*)/
    ];
    
    for (const pattern of classPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            result.hazClass = match[1];
            console.log('Found inline hazard class:', result.hazClass);
            break;
        }
    }
    
    // HAZDEC-specific block parsing - Enhanced for better detection
    if (!result.hazClass && blocks.length > 0) {
        // Method 1: Find CLASS/DIVISION header and look for number nearby
        for (let i = 0; i < blocks.length; i++) {
            const blockText = blocks[i].text.trim().toUpperCase();
            
            // Look for CLASS or DIVISION header
            if (blockText.includes('CLASS') || blockText.includes('DIVISION')) {
                classHeaderIndex = i;
                console.log(`Found CLASS/DIVISION header at block ${i}: "${blockText}"`);
                
                // Look for class number in next several blocks
                for (let offset = 1; offset <= 10; offset++) {
                    const targetIndex = classHeaderIndex + offset;
                    if (targetIndex >= blocks.length) break;
                    
                    const candidateBlock = blocks[targetIndex].text.trim();
                    console.log(`Checking block ${targetIndex} (offset +${offset}): "${candidateBlock}"`);
                    
                    // Check for standalone class number
                    if (/^[1-9](?:\.[1-9])?$/.test(candidateBlock)) {
                        // Additional validation
                        const prevBlock = targetIndex > 0 ? blocks[targetIndex - 1].text.toUpperCase() : '';
                        const nextBlock = targetIndex < blocks.length - 1 ? blocks[targetIndex + 1].text.toUpperCase() : '';
                        
                        // Skip if part of UN number or measurements
                        if (prevBlock.includes('UN') || prevBlock.includes('ID') || 
                            nextBlock.includes('ML') || nextBlock.includes('OZ') ||
                            prevBlock.includes('ADDITIONAL')) {
                            continue;
                        }
                        
                        result.hazClass = candidateBlock;
                        console.log(`Found hazard class: ${result.hazClass} at block ${targetIndex}`);
                        break;
                    }
                }
                
                if (result.hazClass) break;
            }
        }
        
        // Method 2: Look for class in table cells near PSN
        if (!result.hazClass && result.psn) {
            const psnBlockIndex = blocks.findIndex(b => 
                b.text.toUpperCase().includes(result.psn.substring(0, 20))
            );
            
            if (psnBlockIndex !== -1) {
                // Check blocks around PSN for class number
                for (let offset = -5; offset <= 5; offset++) {
                    const checkIndex = psnBlockIndex + offset;
                    if (checkIndex >= 0 && checkIndex < blocks.length) {
                        const blockText = blocks[checkIndex].text.trim();
                        
                        // Look for standalone class number
                        if (/^[1-9](?:\.[1-9])?$/.test(blockText)) {
                            // Make sure it's not a packing group
                            const nearbyText = blocks.slice(Math.max(0, checkIndex - 2), Math.min(blocks.length, checkIndex + 3))
                                .map(b => b.text.toUpperCase()).join(' ');
                            
                            if (!nearbyText.includes('PACKING') && !nearbyText.includes('GROUP')) {
                                result.hazClass = blockText;
                                console.log(`Found hazard class near PSN: ${result.hazClass} at block ${checkIndex}`);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        // Method 3: Pattern-based search in middle section
        if (!result.hazClass) {
            const startRange = Math.floor(blocks.length * 0.2);
            const endRange = Math.floor(blocks.length * 0.8);
            
            for (let i = startRange; i < endRange; i++) {
                const blockText = blocks[i].text.trim();
                
                // Check for standalone hazard class number
                if (/^[1-9](?:\.[1-9])?$/.test(blockText)) {
                    let contextScore = 0;
                    
                    // Check context around this number
                    for (let j = Math.max(0, i - 5); j < Math.min(blocks.length, i + 5); j++) {
                        const contextText = blocks[j].text.toUpperCase();
                        if (contextText.includes('CLASS') || contextText.includes('DIVISION')) {
                            contextScore += 3;
                        }
                        if (contextText.includes('SUBSIDIARY') || contextText.includes('RISK')) {
                            contextScore += 2;
                        }
                        if (contextText.includes('PACKING') || contextText.includes('GROUP')) {
                            contextScore -= 5; // Probably not the class
                        }
                        if (contextText.includes('ADDITIONAL')) {
                            contextScore -= 3; // Too far down
                        }
                    }
                    
                    if (contextScore > 0) {
                        result.hazClass = blockText;
                        console.log(`Found hazard class (contextual): ${result.hazClass} at block ${i} with score ${contextScore}`);
                        break;
                    }
                }
            }
        }
    }
    
    console.log('Final hazard class:', result.hazClass || 'not found');
    
    // Extract Packing Group - with better context validation
    const pgPatterns = [
        /(?:PACKING\s+GROUP)[:\s]+(I{1,3}|[123])/,
        /\bPG[:\s]+(I{1,3}|[123])/
    ];
    
    for (const pattern of pgPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            result.packingGroup = match[1];
            if (result.packingGroup === '1') result.packingGroup = 'I';
            if (result.packingGroup === '2') result.packingGroup = 'II';
            if (result.packingGroup === '3') result.packingGroup = 'III';
            console.log('Found packing group with pattern:', result.packingGroup);
            break;
        }
    }
    
    // Block-based packing group detection with validation
    if (!result.packingGroup && blocks.length > 0) {
        for (let i = 0; i < blocks.length; i++) {
            const blockText = blocks[i].text.trim().toUpperCase();
            
            // Look for PACKING GROUP header
            if (blockText.includes('PACKING') && blockText.includes('GROUP')) {
                console.log(`Found PACKING GROUP header at block ${i}`);
                
                // Check next few blocks for PG value
                for (let j = i + 1; j < Math.min(i + 5, blocks.length); j++) {
                    const nextBlock = blocks[j].text.trim();
                    
                    // Only accept standalone Roman numerals or numbers
                    if (/^(I{1,3}|[123])$/.test(nextBlock)) {
                        result.packingGroup = nextBlock;
                        if (result.packingGroup === '1') result.packingGroup = 'I';
                        if (result.packingGroup === '2') result.packingGroup = 'II';
                        if (result.packingGroup === '3') result.packingGroup = 'III';
                        console.log(`Found packing group: ${result.packingGroup} at block ${j}`);
                        break;
                    }
                    
                    // If we hit another header, stop looking
                    if (nextBlock.toUpperCase().includes('AUTHORIZATION') ||
                        nextBlock.toUpperCase().includes('ADDITIONAL') ||
                        nextBlock.toUpperCase().includes('EMERGENCY')) {
                        break;
                    }
                }
                break;
            }
        }
    }
    
    // Extract Subsidiary Risk/Hazard (numbers in parentheses)
    const subsidiaryMatch = normalizedText.match(/\(([1-9](?:\.[1-9])?)\)/);
    if (subsidiaryMatch) {
        result.subsidiaryHazard = subsidiaryMatch[1];
        console.log('Found subsidiary hazard:', result.subsidiaryHazard);
    }
    
    return result;
}

// Validation function
function validateHAZDEC(parsedData) {
    const { unNumber, psn, hazClass, packingGroup } = parsedData;
    const errors = [];
    const warnings = [];
    
    if (!unNumber) {
        errors.push('UN number not detected');
        return { valid: false, errors, warnings };
    }
    
    const validEntries = dgDatabase[unNumber];
    if (!validEntries) {
        errors.push(`${unNumber} not in database`);
        warnings.push('May be valid but not in Nellis common items');
        return { valid: false, errors, warnings };
    }
    
    // Check if this UN number requires a packing group
    const requiresPG = validEntries.some(e => e.pg !== null);
    const noPGAllowed = validEntries.every(e => e.pg === null);
    
    // If no PG is allowed for this UN number, clear any detected PG
    if (noPGAllowed && packingGroup && packingGroup !== '-') {
        console.log(`UN${unNumber} doesn't require PG, but detected: ${packingGroup}. Clearing it.`);
        parsedData.packingGroup = '-';
        warnings.push(`Packing group detected but not required for ${unNumber}`);
    }
    
    let matchFound = false;
    for (const entry of validEntries) {
        const psnMatch = psn && fuzzyMatch(psn, entry.psn);
        const classMatch = hazClass === entry.class;
        
        // Check subsidiary hazard if present
        let subsidiaryMatch = true;
        if (entry.subsidiary && parsedData.subsidiaryHazard) {
            subsidiaryMatch = parsedData.subsidiaryHazard === entry.subsidiary;
        }
        
        let pgMatch = true;
        if (entry.pg === null) {
            // This entry doesn't require a PG
            pgMatch = true; // Always match if no PG required
        } else {
            // This entry requires a specific PG
            pgMatch = packingGroup === entry.pg;
        }
        
        if (psnMatch && classMatch && pgMatch && subsidiaryMatch) {
            matchFound = true;
            break;
        }
    }
    
    if (!matchFound) {
        if (!psn) errors.push('Proper Shipping Name not detected');
        else if (!validEntries.some(e => fuzzyMatch(psn, e.psn))) {
            errors.push(`Invalid PSN for ${unNumber}`);
            const validPSNs = [...new Set(validEntries.map(e => e.psn))];
            if (validPSNs.length <= 4) {
                warnings.push(`Expected: ${validPSNs.join(' or ')}`);
            }
        }
        
        if (!hazClass) errors.push('Hazard class not detected');
        else if (!validEntries.some(e => hazClass === e.class)) {
            errors.push(`Invalid class ${hazClass} for ${unNumber}`);
        }
        
        if (requiresPG && !packingGroup) {
            errors.push('Packing Group required but not detected');
        }
    }
    
    return { valid: matchFound, errors, warnings };
}

// Fuzzy matching function
function fuzzyMatch(str1, str2) {
    if (!str1 || !str2) return false;
    
    const clean1 = str1.replace(/[^A-Z0-9]/g, '').toUpperCase();
    const clean2 = str2.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    if (clean1 === clean2) return true;
    if (clean1.includes(clean2) || clean2.includes(clean1)) return true;
    
    const words1 = str1.toUpperCase().split(/\s+/).filter(w => w.length > 2);
    const words2 = str2.toUpperCase().split(/\s+/).filter(w => w.length > 2);
    
    const matchingWords = words2.filter(word2 => 
        words1.some(word1 => word1.includes(word2) || word2.includes(word1))
    );
    
    return matchingWords.length >= words2.length * 0.8;
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.dgDatabase = dgDatabase;
    window.parseHAZDECLabel = parseHAZDECLabel;
    window.validateHAZDEC = validateHAZDEC;
    window.fuzzyMatch = fuzzyMatch;
}
