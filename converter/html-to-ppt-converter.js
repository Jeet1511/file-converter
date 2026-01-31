const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { JSDOM } = require('jsdom');

const INPUT_FOLDER = 'HTML FILES';

// Color codes for terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    red: '\x1b[31m'
};

function printBanner() {
    console.clear();
    console.log(colors.cyan + colors.bright);
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║           🎯 HTML to PowerPoint Converter Pro 🎯              ║');
    console.log('║                                                                ║');
    console.log('║              Transform Your HTML Slides Instantly              ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    console.log();
}

function printMenu() {
    console.log(colors.yellow + '📋 Choose Your Conversion Mode:' + colors.reset);
    console.log();
    console.log(colors.blue + '  [1]' + colors.reset + ' 🖼️  ' + colors.bright + 'Picture-Based' + colors.reset + ' (Pixel-Perfect Match)');
    console.log('      ✓ Looks exactly like HTML');
    console.log('      ✓ Perfect layout & formatting');
    console.log('      ✗ Text not editable');
    console.log();
    console.log(colors.blue + '  [2]' + colors.reset + ' ✏️  ' + colors.bright + 'Editable Text' + colors.reset + ' (Fully Customizable)');
    console.log('      ✓ All text is editable');
    console.log('      ✓ Native PowerPoint elements');
    console.log('      ✗ Layout may differ slightly');
    console.log();
    console.log(colors.blue + '  [3]' + colors.reset + ' 🚪 ' + colors.bright + 'Exit' + colors.reset);
    console.log();
}

async function getUserChoice() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(colors.green + '👉 Enter your choice (1, 2, or 3): ' + colors.reset, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Picture-based conversion
async function convertToPictureBased() {
    const OUTPUT_FOLDER = path.join('HTML_TO_PPT', 'Picture-Based');

    console.log('\n' + colors.cyan + '🚀 Starting Picture-Based Conversion...' + colors.reset + '\n');

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Created by @jeet1511';
    pptx.title = 'CRM Presentation (Picture-Based)';

    console.log(colors.yellow + '🌐 Launching browser...' + colors.reset);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 2
        });

        const inputPath = path.join(__dirname, INPUT_FOLDER);
        const htmlFiles = fs.readdirSync(inputPath)
            .filter(file => file.endsWith('.html'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

        console.log(colors.green + `\n📄 Found ${htmlFiles.length} HTML files\n` + colors.reset);

        for (let i = 0; i < htmlFiles.length; i++) {
            const htmlFile = htmlFiles[i];
            const filePath = path.join(inputPath, htmlFile);

            process.stdout.write(colors.blue + `   [${i + 1}/${htmlFiles.length}] ` + colors.reset + `Processing ${htmlFile}... `);

            await page.goto(`file://${filePath}`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            await page.waitForTimeout(1500);

            const screenshotPath = path.join(__dirname, `slide-${i + 1}.png`);
            await page.screenshot({
                path: screenshotPath,
                type: 'png',
                fullPage: false
            });

            const slide = pptx.addSlide();
            slide.background = { color: 'FFFFFF' };
            slide.addImage({
                path: screenshotPath,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%'
            });

            console.log(colors.green + '✓' + colors.reset);
        }

        console.log(colors.yellow + '\n💾 Saving PowerPoint file...' + colors.reset);

        const outputPath = path.join(__dirname, OUTPUT_FOLDER);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const pptPath = path.join(outputPath, 'CRM-Presentation.pptx');
        await pptx.writeFile({ fileName: pptPath });

        // Cleanup
        for (let i = 1; i <= htmlFiles.length; i++) {
            const tempFile = path.join(__dirname, `slide-${i}.png`);
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }

        console.log(colors.green + colors.bright + '\n✨ Success!' + colors.reset);
        console.log(colors.cyan + `📊 Total slides: ${htmlFiles.length}` + colors.reset);
        console.log(colors.magenta + `📁 Location: ${OUTPUT_FOLDER}\\CRM-Presentation.pptx` + colors.reset);
        console.log(colors.yellow + '🎯 Quality: Pixel-perfect match to HTML!' + colors.reset);

    } finally {
        await browser.close();
    }
}

// Editable text conversion
function extractTextFromHTML(htmlPath) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const data = { title: '', subtitle: '', content: [] };

    const mainTitle = doc.querySelector('.main-title, .slide-title');
    if (mainTitle) data.title = mainTitle.textContent.trim();

    const subtitle = doc.querySelector('.subtitle');
    if (subtitle) data.subtitle = subtitle.textContent.trim();

    const description = doc.querySelector('.description-text, .purpose-description');
    if (description) {
        data.content.push({ type: 'description', text: description.textContent.trim() });
    }

    const definition = doc.querySelector('.definition-text');
    if (definition) {
        data.content.push({ type: 'definition', label: 'Definition', text: definition.textContent.trim() });
    }

    const functionItems = doc.querySelectorAll('.function-item .function-text');
    if (functionItems.length > 0) {
        const functions = [];
        functionItems.forEach(item => functions.push(item.textContent.trim()));
        data.content.push({ type: 'functions', label: 'Key Functions', items: functions });
    }

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
                    contentItems.forEach(item => items.push(item.textContent.trim()));
                }
                data.content.push({ type: 'block', title: blockTitle.textContent.trim(), items: items });
            }
        });
    }

    return data;
}

function createSlide1(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    slide.addText(data.title, {
        x: 0.5, y: 2.0, w: 9, h: 1.2,
        fontSize: 52, bold: true, color: '1e3a8a',
        align: 'center', fontFace: 'Poppins', valign: 'middle'
    });

    if (data.subtitle) {
        slide.addText(data.subtitle, {
            x: 0.5, y: 3.3, w: 9, h: 0.7,
            fontSize: 26, color: '3b82f6',
            align: 'center', fontFace: 'Poppins', valign: 'middle'
        });
    }

    const description = data.content.find(c => c.type === 'description');
    if (description) {
        slide.addShape(pptx.ShapeType.rect, {
            x: 1.2, y: 4.4, w: 7.6, h: 1.8,
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid', pt: 'l' }
        });

        slide.addText(description.text, {
            x: 1.5, y: 4.6, w: 7, h: 1.4,
            fontSize: 16, color: '1e40af',
            align: 'center', fontFace: 'Inter',
            valign: 'middle', wrap: true
        });
    }

    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 6.85, w: 10, h: 0.15,
        fill: { color: '2563eb' }, line: { type: 'none' }
    });
}

function createSlide2(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.15,
        fill: { color: 'f8fafc' }, line: { type: 'none' }
    });

    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 1.15, w: 10, h: 0.05,
        fill: { color: '2563eb' }, line: { type: 'none' }
    });

    slide.addText(data.title, {
        x: 0.8, y: 0.35, w: 8.4, h: 0.65,
        fontSize: 38, bold: true, color: '1e3a8a',
        fontFace: 'Poppins', valign: 'middle'
    });

    const definition = data.content.find(c => c.type === 'definition');
    if (definition) {
        slide.addText('📖 ' + definition.label, {
            x: 0.8, y: 1.7, w: 4.2, h: 0.4,
            fontSize: 19, bold: true, color: '2563eb', fontFace: 'Poppins'
        });

        slide.addShape(pptx.ShapeType.rect, {
            x: 0.8, y: 2.2, w: 4.2, h: 4.0,
            fill: { color: 'f0f9ff' },
            line: { color: '2563eb', width: 3, type: 'solid', pt: 'l' }
        });

        slide.addText(definition.text, {
            x: 1.0, y: 2.4, w: 3.8, h: 3.6,
            fontSize: 15, color: '1e40af', fontFace: 'Inter',
            valign: 'top', wrap: true
        });
    }

    const functions = data.content.find(c => c.type === 'functions');
    if (functions) {
        slide.addText(functions.label, {
            x: 5.2, y: 1.7, w: 4.0, h: 0.4,
            fontSize: 19, bold: true, color: '1e3a8a', fontFace: 'Poppins'
        });

        let yPos = 2.3;
        functions.items.forEach((item) => {
            slide.addShape(pptx.ShapeType.rect, {
                x: 5.2, y: yPos, w: 4.0, h: 0.75,
                fill: { color: 'ffffff' },
                line: { color: 'e0f2fe', width: 2, type: 'solid' }
            });

            slide.addText('• ' + item, {
                x: 5.35, y: yPos + 0.1, w: 3.7, h: 0.55,
                fontSize: 15, color: '1e40af', fontFace: 'Inter', valign: 'middle'
            });

            yPos += 0.95;
        });
    }
}

function createSlide345(pptx, data) {
    const slide = pptx.addSlide();
    slide.background = { color: 'FFFFFF' };

    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 1.15,
        fill: { color: 'f8fafc' }, line: { type: 'none' }
    });

    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 1.15, w: 10, h: 0.05,
        fill: { color: '2563eb' }, line: { type: 'none' }
    });

    slide.addText(data.title, {
        x: 0.8, y: 0.35, w: 8.4, h: 0.65,
        fontSize: 38, bold: true, color: '1e3a8a',
        fontFace: 'Poppins', valign: 'middle'
    });

    const blocks = data.content.filter(c => c.type === 'block');
    const colors = [
        { border: '2563eb', topBar: '2563eb' },
        { border: '10b981', topBar: '10b981' },
        { border: '8b5cf6', topBar: '8b5cf6' }
    ];

    const columnWidth = 2.9;
    const gap = 0.35;
    const startX = 0.8;
    const startY = 1.8;

    blocks.forEach((block, index) => {
        const xPos = startX + (index * (columnWidth + gap));
        const color = colors[index] || colors[0];

        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: startY, w: columnWidth, h: 4.6,
            fill: { color: 'ffffff' },
            line: { color: color.border, width: 2, type: 'solid' }
        });

        slide.addShape(pptx.ShapeType.rect, {
            x: xPos, y: startY, w: columnWidth, h: 0.08,
            fill: { color: color.topBar }, line: { type: 'none' }
        });

        slide.addText(block.title, {
            x: xPos + 0.1, y: startY + 0.25, w: columnWidth - 0.2, h: 0.45,
            fontSize: 20, bold: true, color: '1e3a8a',
            align: 'center', fontFace: 'Poppins', valign: 'middle'
        });

        let contentY = startY + 0.85;

        if (block.items.length === 1) {
            slide.addText(block.items[0], {
                x: xPos + 0.15, y: contentY, w: columnWidth - 0.3, h: 3.4,
                fontSize: 14, color: '334155',
                align: 'center', fontFace: 'Inter',
                valign: 'top', wrap: true
            });
        } else {
            block.items.forEach((item) => {
                slide.addText('• ' + item, {
                    x: xPos + 0.15, y: contentY, w: columnWidth - 0.3, h: 0.7,
                    fontSize: 13, color: '334155',
                    fontFace: 'Inter', valign: 'top', wrap: true
                });
                contentY += 0.75;
            });
        }
    });
}

async function convertToEditable() {
    const OUTPUT_FOLDER = path.join('HTML_TO_PPT', 'Editable-Text');

    console.log('\n' + colors.cyan + '🚀 Starting Editable Text Conversion...' + colors.reset + '\n');

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Created by @jeet1511';
    pptx.title = 'CRM Presentation (Editable)';

    const inputPath = path.join(__dirname, INPUT_FOLDER);
    const htmlFiles = fs.readdirSync(inputPath)
        .filter(file => file.endsWith('.html'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
        });

    console.log(colors.green + `📄 Found ${htmlFiles.length} HTML files\n` + colors.reset);

    for (let i = 0; i < htmlFiles.length; i++) {
        const htmlFile = htmlFiles[i];
        const filePath = path.join(inputPath, htmlFile);

        process.stdout.write(colors.blue + `   [${i + 1}/${htmlFiles.length}] ` + colors.reset + `Processing ${htmlFile}... `);

        const data = extractTextFromHTML(filePath);

        if (i === 0) {
            createSlide1(pptx, data);
        } else if (i === 1) {
            createSlide2(pptx, data);
        } else {
            createSlide345(pptx, data);
        }

        console.log(colors.green + '✓' + colors.reset);
    }

    console.log(colors.yellow + '\n💾 Saving PowerPoint file...' + colors.reset);

    const outputPath = path.join(__dirname, OUTPUT_FOLDER);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const pptPath = path.join(outputPath, 'CRM-Presentation.pptx');
    await pptx.writeFile({ fileName: pptPath });

    console.log(colors.green + colors.bright + '\n✨ Success!' + colors.reset);
    console.log(colors.cyan + `📊 Total slides: ${htmlFiles.length}` + colors.reset);
    console.log(colors.magenta + `📁 Location: ${OUTPUT_FOLDER}\\CRM-Presentation.pptx` + colors.reset);
    console.log(colors.yellow + '✏️  Quality: Fully editable text!' + colors.reset);
}

function printCredits() {
    console.log();
    console.log(colors.cyan + '═'.repeat(64) + colors.reset);
    console.log(colors.magenta + colors.bright + '                    Created with ❤️  by' + colors.reset);
    console.log(colors.green + colors.bright + '                   GitHub: @jeet1511' + colors.reset);
    console.log(colors.cyan + '═'.repeat(64) + colors.reset);
    console.log();
}

async function main() {
    printBanner();
    printMenu();

    const choice = await getUserChoice();

    console.log();

    if (choice === '1') {
        await convertToPictureBased();
        printCredits();
    } else if (choice === '2') {
        await convertToEditable();
        printCredits();
    } else if (choice === '3') {
        console.log(colors.yellow + '👋 Thanks for using HTML to PPT Converter!' + colors.reset);
        printCredits();
        process.exit(0);
    } else {
        console.log(colors.red + '❌ Invalid choice! Please run again and select 1, 2, or 3.' + colors.reset);
        process.exit(1);
    }
}

main().catch(error => {
    console.error(colors.red + '\n💥 Error: ' + error.message + colors.reset);
    process.exit(1);
});
