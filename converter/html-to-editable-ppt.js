const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

async function extractTextFromHTML(htmlPath) {
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

    // Title
    slide.addText(data.title, {
        x: 0.5, y: 1.5, w: 9, h: 1.5,
        fontSize: 54,
        bold: true,
        color: '1e3a8a',
        align: 'center',
        fontFace: 'Poppins'
    });

    // Subtitle
    if (data.subtitle) {
        slide.addText(data.subtitle, {
            x: 0.5, y: 3.2, w: 9, h: 0.8,
            fontSize: 28,
            color: '3b82f6',
            align: 'center',
            fontFace: 'Poppins'
        });
    }

    // Description box
    const description = data.content.find(c => c.type === 'description');
    if (description) {
        slide.addText(description.text, {
            x: 1, y: 4.3, w: 8, h: 1.5,
            fontSize: 18,
            color: '1e40af',
            align: 'center',
            fontFace: 'Inter',
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid' }
        });
    }

    // Accent bar at bottom
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 6.9, w: 10, h: 0.1,
        fill: { color: '2563eb' }
    });
}

function createSlide2(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header section
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.2,
        fill: { color: 'f8fafc' },
        line: { color: '2563eb', width: 4, type: 'solid', pt: 'b' }
    });

    slide.addText(data.title, {
        x: 0.8, y: 0.3, w: 8.4, h: 0.7,
        fontSize: 40,
        bold: true,
        color: '1e3a8a',
        fontFace: 'Poppins'
    });

    // Definition box (left)
    const definition = data.content.find(c => c.type === 'definition');
    if (definition) {
        slide.addText('📖 ' + definition.label, {
            x: 0.8, y: 1.8, w: 4, h: 0.5,
            fontSize: 20,
            bold: true,
            color: '2563eb',
            fontFace: 'Poppins'
        });

        slide.addText(definition.text, {
            x: 0.8, y: 2.4, w: 4, h: 3.5,
            fontSize: 17,
            color: '1e40af',
            fontFace: 'Inter',
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid', pt: 'l' }
        });
    }

    // Functions (right)
    const functions = data.content.find(c => c.type === 'functions');
    if (functions) {
        slide.addText(functions.label, {
            x: 5.2, y: 1.8, w: 4, h: 0.5,
            fontSize: 20,
            bold: true,
            color: '1e3a8a',
            fontFace: 'Poppins'
        });

        let yPos = 2.5;
        functions.items.forEach((item, index) => {
            slide.addText('• ' + item, {
                x: 5.2, y: yPos, w: 4, h: 0.7,
                fontSize: 17,
                color: '1e40af',
                fontFace: 'Inter',
                fill: { color: 'ffffff' },
                line: { color: 'e0f2fe', width: 2, type: 'solid' }
            });
            yPos += 0.9;
        });
    }
}

function createSlide345(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header section
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.2,
        fill: { color: 'f8fafc' },
        line: { color: '2563eb', width: 4, type: 'solid', pt: 'b' }
    });

    slide.addText(data.title, {
        x: 0.8, y: 0.3, w: 8.4, h: 0.7,
        fontSize: 40,
        bold: true,
        color: '1e3a8a',
        fontFace: 'Poppins'
    });

    // Get blocks
    const blocks = data.content.filter(c => c.type === 'block');
    const colors = [
        { border: '2563eb', bg: 'dbeafe' },
        { border: '10b981', bg: 'd1fae5' },
        { border: '8b5cf6', bg: 'ede9fe' }
    ];

    const columnWidth = 2.8;
    const gap = 0.4;
    const startX = 0.8;

    blocks.forEach((block, index) => {
        const xPos = startX + (index * (columnWidth + gap));
        const color = colors[index] || colors[0];

        // Block title
        slide.addText(block.title, {
            x: xPos, y: 2.0, w: columnWidth, h: 0.5,
            fontSize: 20,
            bold: true,
            color: '1e3a8a',
            align: 'center',
            fontFace: 'Poppins'
        });

        // Block content
        let yPos = 2.7;
        block.items.forEach(item => {
            const text = block.items.length === 1 ? item : '• ' + item;
            const textHeight = block.items.length === 1 ? 1.5 : 0.6;

            slide.addText(text, {
                x: xPos, y: yPos, w: columnWidth, h: textHeight,
                fontSize: block.items.length === 1 ? 15 : 14,
                color: '334155',
                align: block.items.length === 1 ? 'center' : 'left',
                fontFace: 'Inter',
                valign: 'top'
            });
            yPos += textHeight + 0.15;
        });

        // Block border
        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: 1.7, w: columnWidth, h: 4.5,
            fill: { color: 'ffffff', transparency: 100 },
            line: { color: color.border, width: 2, type: 'solid' }
        });

        // Top accent
        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: 1.7, w: columnWidth, h: 0.08,
            fill: { color: color.border }
        });
    });
}

async function convertHTMLtoPPT() {
    console.log('🚀 Starting HTML to Editable PowerPoint conversion...\n');

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'HTML to PPT Converter';
    pptx.title = 'CRM Presentation';

    // Get all HTML files
    const htmlFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.html'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
        });

    console.log(`📄 Found ${htmlFiles.length} HTML files\n`);

    for (let i = 0; i < htmlFiles.length; i++) {
        const htmlFile = htmlFiles[i];
        const filePath = path.join(__dirname, htmlFile);

        console.log(`   [${i + 1}/${htmlFiles.length}] Processing ${htmlFile}...`);

        const data = await extractTextFromHTML(filePath);

        // Create appropriate slide based on structure
        if (i === 0) {
            createSlide1(pptx, data);
        } else if (i === 1) {
            createSlide2(pptx, data);
        } else {
            createSlide345(pptx, data);
        }

        console.log(`   ✅ Slide ${i + 1} created with editable text`);
    }

    console.log('\n💾 Saving PowerPoint file...');

    const outputPath = path.join(__dirname, 'CRM-Presentation-Editable.pptx');
    await pptx.writeFile({ fileName: outputPath });

    console.log(`\n✨ Success! Editable PowerPoint created!`);
    console.log(`📊 Total slides: ${htmlFiles.length}`);
    console.log(`📁 Location: ${outputPath}\n`);
    console.log('🎉 All text is now fully editable in PowerPoint!\n');
}

convertHTMLtoPPT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('💥 Error:', error);
        process.exit(1);
    });
