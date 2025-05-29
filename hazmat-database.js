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
    
    // Extract PSN using blocks if available
    if (result.unNumber && blocks.length > 0) {
        const unBlockIndex = blocks.findIndex(b => 
            b.text.toUpperCase().includes(result.unNumber.replace('UN', ''))
        );
        
        if (unBlockIndex !== -1) {
            for (let i = unBlockIndex + 1; i < Math.min(unBlockIndex + 6, blocks.length); i++) {
                const blockText = blocks[i].text.trim().toUpperCase();
                
                const skipPatterns = [
                    'PROPER SHIPPING NAME', 'CLASS', 'DIVISION', 
                    'PACKING GROUP', 'UN OR ID', 'HAZARD'
                ];
                
                if (skipPatterns.some(pattern => blockText.includes(pattern))) continue;
                
                if (blockText.length > 3 && /[A-Z]{3,}/.test(blockText) && !/^\d+$/.test(blockText)) {
                    result.psn = blockText;
                    break;
                }
            }
        }
    }
    
    // Extract Hazard Class
    const classPatterns = [
        /(?:CLASS|DIVISION)[:\s]+(\d+\.?\d*)/,
        /(?:HAZARD\s+CLASS)[:\s]+(\d+\.?\d*)/
    ];
    
    for (const pattern of classPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            result.hazClass = match[1];
            break;
        }
    }
    
    // Extract Packing Group
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
            break;
        }
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
    
    let matchFound = false;
    for (const entry of validEntries) {
        const psnMatch = psn && fuzzyMatch(psn, entry.psn);
        const classMatch = hazClass === entry.class;
        
        let pgMatch = true;
        if (entry.pg === null) {
            if (packingGroup && packingGroup !== '-') {
                warnings.push(`PG ${packingGroup} specified but not required`);
            }
        } else {
            pgMatch = packingGroup === entry.pg;
        }
        
        if (psnMatch && classMatch && pgMatch) {
            matchFound = true;
            break;
        }
    }
    
    if (!matchFound) {
        if (!psn) errors.push('Proper Shipping Name not detected');
        else if (!validEntries.some(e => fuzzyMatch(psn, e.psn))) {
            errors.push(`Invalid PSN for ${unNumber}`);
        }
        
        if (!hazClass) errors.push('Hazard class not detected');
        else if (!validEntries.some(e => hazClass === e.class)) {
            errors.push(`Invalid class ${hazClass} for ${unNumber}`);
        }
        
        const requiresPG = validEntries.some(e => e.pg !== null);
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
