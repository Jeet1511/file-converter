const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const INPUT_FOLDER = 'HTML FILES';
const OUTPUT_FOLDER = 'HTML_TO_PPT';

function extractTextFromHTML(htmlPath) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const data = {
        title: '',
        subtitle: '',
        content: []
    };

    // Extract main title
    const mainTitle = doc.querySelector('.main-title, .slide-title');
    if (mainTitle) {
        data.title = mainTitle.textContent.trim();
    }

    // Extract subtitle
    const subtitle = doc.querySelector('.subtitle');
    if (subtitle) {
        data.subtitle = subtitle.textContent.trim();
    }

    // Extract description
    const description = doc.querySelector('.description-text, .purpose-description');
    if (description) {
        data.content.push({
            type: 'description',
            text: description.textContent.trim()
        });
    }

    // Extract definition
    const definition = doc.querySelector('.definition-text');
    if (definition) {
        data.content.push({
            type: 'definition',
            label: 'Definition',
            text: definition.textContent.trim()
        });
    }

    // Extract function items (for slide 2)
    const functionItems = doc.querySelectorAll('.function-item .function-text');
    if (functionItems.length > 0) {
        const functions = [];
        functionItems.forEach(item => {
            functions.push(item.textContent.trim());
        });
        data.content.push({
            type: 'functions',
            label: 'Key Functions',
            items: functions
        });
    }

    // Extract block columns (for slides 3, 4, 5)
    const blockColumns = doc.querySelectorAll('.block-column');
    if (blockColumns.length > 0) {
        blockColumns.forEach(block => {
            const blockTitle = block.querySelector('.block-title');
            const contentItems = block.querySelectorAll('.content-text');
            const purposeDesc = block.querySelector('.purpose-description');

            if (blockTitle) {
                const items = [];
                if (purposeDesc) {
                    items.push(purposeDesc.textContent.trim());
                } else {
                    contentItems.forEach(item => {
                        items.push(item.textContent.trim());
                    });
                }

                data.content.push({
                    type: 'block',
                    title: blockTitle.textContent.trim(),
                    items: items
                });
            }
        });
    }

    return data;
}

function createSlide1(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Title - centered
    slide.addText(data.title, {
        x: 0.5, y: 2.0, w: 9, h: 1.2,
        fontSize: 52,
        bold: true,
        color: '1e3a8a',
        align: 'center',
        fontFace: 'Poppins',
        valign: 'middle'
    });

    // Subtitle - centered
    if (data.subtitle) {
        slide.addText(data.subtitle, {
            x: 0.5, y: 3.3, w: 9, h: 0.7,
            fontSize: 26,
            color: '3b82f6',
            align: 'center',
            fontFace: 'Poppins',
            valign: 'middle'
        });
    }

    // Description box with border
    const description = data.content.find(c => c.type === 'description');
    if (description) {
        // Background box
        slide.addShape(pptx.ShapeType.rect, {
            x: 1.2, y: 4.4, w: 7.6, h: 1.8,
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid', pt: 'l' }
        });

        // Text inside box
        slide.addText(description.text, {
            x: 1.5, y: 4.6, w: 7, h: 1.4,
            fontSize: 16,
            color: '1e40af',
            align: 'center',
            fontFace: 'Inter',
            valign: 'middle',
            wrap: true
        });
    }

    // Bottom accent bar
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 6.85, w: 10, h: 0.15,
        fill: { color: '2563eb' },
        line: { type: 'none' }
    });
}

function createSlide2(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header background
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.15,
        fill: { color: 'f8fafc' },
        line: { type: 'none' }
    });

    // Header bottom border
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 1.15, w: 10, h: 0.05,
        fill: { color: '2563eb' },
        line: { type: 'none' }
    });

    // Title
    slide.addText(data.title, {
        x: 0.8, y: 0.35, w: 8.4, h: 0.65,
        fontSize: 38,
        bold: true,
        color: '1e3a8a',
        fontFace: 'Poppins',
        valign: 'middle'
    });

    // Left column - Definition
    const definition = data.content.find(c => c.type === 'definition');
    if (definition) {
        // Definition label
        slide.addText('📖 ' + definition.label, {
            x: 0.8, y: 1.7, w: 4.2, h: 0.4,
            fontSize: 19,
            bold: true,
            color: '2563eb',
            fontFace: 'Poppins'
        });

        // Definition box background
        slide.addShape(pptx.ShapeType.rect, {
            x: 0.8, y: 2.2, w: 4.2, h: 4.0,
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid', pt: 'l' }
        });

        // Definition text
        slide.addText(definition.text, {
            x: 1.0, y: 2.4, w: 3.8, h: 3.6,
            fontSize: 15,
            color: '1e40af',
            fontFace: 'Inter',
            valign: 'top',
            wrap: true
        });
    }

    // Right column - Functions
    const functions = data.content.find(c => c.type === 'functions');
    if (functions) {
        // Functions label
        slide.addText(functions.label, {
            x: 5.2, y: 1.7, w: 4.0, h: 0.4,
            fontSize: 19,
            bold: true,
            color: '1e3a8a',
            fontFace: 'Poppins'
        });

        let yPos = 2.3;
        functions.items.forEach((item, index) => {
            // Function box
            slide.addShape(pptx.ShapeType.rect, {
                x: 5.2, y: yPos, w: 4.0, h: 0.75,
                fill: { color: 'ffffff' },
                line: { color: 'e0f2fe', width: 2, type: 'solid' }
            });

            // Function text
            slide.addText('• ' + item, {
                x: 5.35, y: yPos + 0.1, w: 3.7, h: 0.55,
                fontSize: 15,
                color: '1e40af',
                fontFace: 'Inter',
                valign: 'middle'
            });

            yPos += 0.95;
        });
    }
}

function createSlide345(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header background
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.15,
        fill: { color: 'f8fafc' },
        line: { type: 'none' }
    });

    // Header bottom border
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 1.15, w: 10, h: 0.05,
        fill: { color: '2563eb' },
        line: { type: 'none' }
    });

    // Title
    slide.addText(data.title, {
        x: 0.8, y: 0.35, w: 8.4, h: 0.65,
        fontSize: 38,
        bold: true,
        color: '1e3a8a',
        fontFace: 'Poppins',
        valign: 'middle'
    });

    // Get blocks
    const blocks = data.content.filter(c => c.type === 'block');
    const colors = [
        { border: '2563eb', bg: 'dbeafe', topBar: '2563eb' },
        { border: '10b981', bg: 'd1fae5', topBar: '10b981' },
        { border: '8b5cf6', bg: 'ede9fe', topBar: '8b5cf6' }
    ];

    const columnWidth = 2.9;
    const gap = 0.35;
    const startX = 0.8;
    const startY = 1.8;

    blocks.forEach((block, index) => {
        const xPos = startX + (index * (columnWidth + gap));
        const color = colors[index] || colors[0];

        // Column border
        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: startY, w: columnWidth, h: 4.6,
            fill: { color: 'ffffff' },
            line: { color: color.border, width: 2, type: 'solid' }
        });

        // Top colored bar
        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: startY, w: columnWidth, h: 0.08,
            fill: { color: color.topBar },
            line: { type: 'none' }
        });

        // Block title
        slide.addText(block.title, {
            x: xPos + 0.1, y: startY + 0.25, w: columnWidth - 0.2, h: 0.45,
            fontSize: 20,
            bold: true,
            color: '1e3a8a',
            align: 'center',
            fontFace: 'Poppins',
            valign: 'middle'
        });

        // Block content
        let contentY = startY + 0.85;

        if (block.items.length === 1) {
            // Single paragraph (Purpose description)
            slide.addText(block.items[0], {
                x: xPos + 0.15, y: contentY, w: columnWidth - 0.3, h: 3.4,
                fontSize: 14,
                color: '334155',
                align: 'center',
                fontFace: 'Inter',
                valign: 'top',
                wrap: true
            });
        } else {
            // Multiple bullet points
            block.items.forEach((item, idx) => {
                slide.addText('• ' + item, {
                    x: xPos + 0.15, y: contentY, w: columnWidth - 0.3, h: 0.7,
                    fontSize: 13,
                    color: '334155',
                    fontFace: 'Inter',
                    valign: 'top',
                    wrap: true
                });
                contentY += 0.75;
            });
        }
    });
}

async function convertHTMLtoPPT() {
    console.log('🚀 Starting HTML to Editable PowerPoint conversion...\n');

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'HTML to PPT Converter';
    pptx.title = 'CRM Presentation';

    // Get all HTML files from INPUT_FOLDER
    const inputPath = path.join(__dirname, INPUT_FOLDER);
    const htmlFiles = fs.readdirSync(inputPath)
        .filter(file => file.endsWith('.html'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
        });

    console.log(`📄 Found ${htmlFiles.length} HTML files in "${INPUT_FOLDER}" folder\n`);

    for (let i = 0; i < htmlFiles.length; i++) {
        const htmlFile = htmlFiles[i];
        const filePath = path.join(inputPath, htmlFile);

        console.log(`   [${i + 1}/${htmlFiles.length}] Processing ${htmlFile}...`);

        const data = extractTextFromHTML(filePath);

        // Create appropriate slide based on structure
        if (i === 0) {
            createSlide1(pptx, data);
        } else if (i === 1) {
            createSlide2(pptx, data);
        } else {
            createSlide345(pptx, data);
        }

        console.log(`   ✅ Slide ${i + 1} created with improved layout`);
    }

    console.log('\n💾 Saving PowerPoint file...');

    // Ensure output folder exists
    const outputPath = path.join(__dirname, OUTPUT_FOLDER);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const pptPath = path.join(outputPath, 'CRM-Presentation.pptx');
    await pptx.writeFile({ fileName: pptPath });

    console.log(`\n✨ Success! Improved PowerPoint created!`);
    console.log(`📊 Total slides: ${htmlFiles.length}`);
    console.log(`📁 Location: ${OUTPUT_FOLDER}\\CRM-Presentation.pptx\n`);
    console.log('🎉 Layout now matches HTML design more closely!\n');
}

convertHTMLtoPPT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('💥 Error:', error);
        process.exit(1);
    });
