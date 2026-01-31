const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function convertHTMLtoPPT() {
    console.log('🚀 Starting HTML to PowerPoint conversion...\n');

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

        // Get all HTML files in current directory
        const htmlFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.html'))
            .sort((a, b) => {
                // Sort numerically (1.html, 2.html, etc.)
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

        console.log(`📄 Found ${htmlFiles.length} HTML files:\n`);

        // Process each HTML file
        for (let i = 0; i < htmlFiles.length; i++) {
            const htmlFile = htmlFiles[i];
            const filePath = path.join(__dirname, htmlFile);

            console.log(`   [${i + 1}/${htmlFiles.length}] Processing ${htmlFile}...`);

            // Navigate to HTML file
            await page.goto(`file://${filePath}`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // Wait a bit for any animations or fonts to load
            await page.waitForTimeout(1000);

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

            console.log(`   ✅ Slide ${i + 1} added to presentation`);
        }

        console.log('\n💾 Saving PowerPoint file...');

        // Save PowerPoint
        const outputPath = path.join(__dirname, 'CRM-Presentation.pptx');
        await pptx.writeFile({ fileName: outputPath });

        console.log(`\n✨ Success! PowerPoint created: ${outputPath}`);
        console.log(`📊 Total slides: ${htmlFiles.length}\n`);

        // Clean up temporary screenshot files
        console.log('🧹 Cleaning up temporary files...');
        for (let i = 1; i <= htmlFiles.length; i++) {
            const tempFile = path.join(__dirname, `slide-${i}.png`);
            if (fs.existsSync(tempFile)) {
                fs.unlinkSync(tempFile);
            }
        }
        console.log('✅ Cleanup complete!\n');

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
        console.log('🎉 All done! Your PowerPoint presentation is ready.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Conversion failed:', error);
        process.exit(1);
    });
