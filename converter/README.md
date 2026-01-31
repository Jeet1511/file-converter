# 🎯 HTML to PowerPoint Converter Pro

> Transform your HTML slides into professional PowerPoint presentations instantly!

Created with ❤️ by **[@jeet1511](https://github.com/jeet1511)**

---

## ✨ Features

- 🖼️ **Picture-Based Mode** - Pixel-perfect conversion (looks exactly like HTML)
- ✏️ **Editable Text Mode** - Fully customizable PowerPoint slides
- 🎨 **Professional UI** - Beautiful color-coded terminal interface
- 📁 **Organized Output** - Separate folders for each conversion type
- ⚡ **Fast & Easy** - Interactive menu system

---

## 📁 Folder Structure

```
crm/
├── HTML FILES/              ← Place your HTML files here
├── Picture-Based PPT/       ← Picture-based output (Option 1)
├── Editable-Text PPT/       ← Editable text output (Option 2)
└── html-to-ppt-converter.js ← Main converter script
```

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies (First Time Only)

```powershell
npm install
```

### 2️⃣ Run the Converter

```powershell
npm start
```

**Or:**

```powershell
node html-to-ppt-converter.js
```

### 3️⃣ Choose Your Mode

You'll see a beautiful menu:

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           🎯 HTML to PowerPoint Converter Pro 🎯              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📋 Choose Your Conversion Mode:

  [1] 🖼️  Picture-Based (Pixel-Perfect Match)
      ✓ Looks exactly like HTML
      ✓ Perfect layout & formatting
      ✗ Text not editable

  [2] ✏️  Editable Text (Fully Customizable)
      ✓ All text is editable
      ✓ Native PowerPoint elements
      ✗ Layout may differ slightly

  [3] 🚪 Exit

👉 Enter your choice (1, 2, or 3):
```

---

## 🎯 Conversion Modes

### Option 1: Picture-Based 🖼️

**Perfect for:**
- Final presentations
- When visual accuracy is critical
- Sharing with others

**Output:** `Picture-Based PPT/CRM-Presentation.pptx`

**Pros:**
- ✅ Looks **exactly** like your HTML
- ✅ Perfect layout, colors, and spacing
- ✅ No formatting issues

**Cons:**
- ❌ Text is not editable (it's an image)

---

### Option 2: Editable Text ✏️

**Perfect for:**
- When you need to edit content
- Collaborative presentations
- Template creation

**Output:** `Editable-Text PPT/CRM-Presentation.pptx`

**Pros:**
- ✅ All text is fully editable
- ✅ Native PowerPoint shapes and text
- ✅ Easy to customize

**Cons:**
- ❌ Layout may differ slightly from HTML

---

## 💡 Pro Tips

1. **For Best Results:** Use Picture-Based mode for final presentations
2. **Need to Edit?** Use Editable Text mode, then fine-tune in PowerPoint
3. **Update Content:** Edit HTML files and re-run the converter
4. **Both Modes:** Run both and compare - choose what works best!

---

## 🛠️ Requirements

- Node.js (v14 or higher)
- npm (comes with Node.js)

**Dependencies:**
- `puppeteer` - For HTML rendering
- `pptxgenjs` - For PowerPoint generation
- `jsdom` - For HTML parsing

---

## 📦 Installation

```powershell
# Clone or download this project
cd crm

# Install dependencies
npm install

# Run the converter
npm start
```

---

## 🎨 Output Examples

### Picture-Based Mode
```
✨ Success!
📊 Total slides: 5
📁 Location: Picture-Based PPT\CRM-Presentation.pptx
🎯 Quality: Pixel-perfect match to HTML!
```

### Editable Text Mode
```
✨ Success!
📊 Total slides: 5
📁 Location: Editable-Text PPT\CRM-Presentation.pptx
✏️  Quality: Fully editable text!
```

---

## 🤝 Credits

**Created by:** [@jeet1511](https://github.com/jeet1511)

If you found this useful, give it a ⭐ on GitHub!

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🐛 Troubleshooting

**Issue:** "EBUSY: resource busy or locked"
- **Solution:** Close the PowerPoint file before running the converter

**Issue:** "Cannot find module"
- **Solution:** Run `npm install` first

**Issue:** Browser launch fails
- **Solution:** Puppeteer will auto-download Chromium on first install

---

## 💬 Support

Found a bug or have a suggestion? Open an issue on GitHub!

**GitHub:** [@jeet1511](https://github.com/jeet1511)

---

Made with ❤️ and ☕ by @jeet1511
