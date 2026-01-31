const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const INPUT_FOLDER = 'HTML FILES';
const OUTPUT_FOLDER = 'HTML_TO_PPT';

async function convertHTMLtoPPT() {
    console.log('🚀 Starting HTML to PowerPoint conversion (High Quality Images)...\n');

    // Initialize PowerPoint
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'HTML to PPT Converter';
    pptx.title = 'CRM Presentation';

    // Launch browser
    console.log('🌐 Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // Set viewport to match slide dimensions (1280x720)
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 2 // Higher quality screenshots
        });

        // Get all HTML files
        const inputPath = path.join(__dirname, INPUT_FOLDER);
        const htmlFiles = fs.readdirSync(inputPath)
            .filter(file => file.endsWith('.html'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

        console.log(`📄 Found ${htmlFiles.length} HTML files\n`);

        // Process each HTML file
        for (let i = 0; i < htmlFiles.length; i++) {
            const htmlFile = htmlFiles[i];
            const filePath = path.join(inputPath, htmlFile);

            console.log(`   [${i + 1}/${htmlFiles.length}] Processing ${htmlFile}...`);

            // Navigate to HTML file
            await page.goto(`file://${filePath}`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Wait for fonts and content to load
            await page.waitForTimeout(1500);

            // Take screenshot
            const screenshotPath = path.join(__dirname, `slide-${i + 1}.png`);
            await page.screenshot({
                path: screenshotPath,
                type: 'png',
                fullPage: false
            });

            // Add slide to PowerPoint
            const slide = pptx.addSlide();
            slide.background = { color: 'FFFFFF' };

            // Add image to slide (full slide dimensions)
            slide.addImage({
                path: screenshotPath,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%'
            });

            console.log(`   ✅ Slide ${i + 1} added (pixel-perfect match)`);
        }

        console.log('\n💾 Saving PowerPoint file...');

        // Ensure output folder exists
        const outputPath = path.join(__dirname, OUTPUT_FOLDER);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const pptPath = path.join(outputPath, 'CRM-Presentation-Perfect.pptx');
        await pptx.writeFile({ fileName: pptPath });

        console.log(`\n✨ Success! Pixel-perfect PowerPoint created!`);
        console.log(`📊 Total slides: ${htmlFiles.length}`);
        console.log(`📁 Location: ${OUTPUT_FOLDER}\\CRM-Presentation-Perfect.pptx\n`);

        // Clean up temporary screenshot files
        console.log('🧹 Cleaning up temporary files...');
        for (let i = 1; i <= htmlFiles.length; i++) {
            const tempFile = path.join(__dirname, `slide-${i}.png`);
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
        console.log('✅ Cleanup complete!\n');
        console.log('📌 Note: Slides are images (not editable text), but look exactly like HTML!\n');

    } catch (error) {
        console.error('❌ Error during conversion:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the conversion
convertHTMLtoPPT()
    .then(() => {
        console.log('🎉 Done! Your presentation looks exactly like the HTML files.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Conversion failed:', error);
        process.exit(1);
    });
