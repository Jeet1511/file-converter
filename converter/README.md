# 🎯 HTML to PowerPoint Converter Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6%2B-red.svg)](https://www.npmjs.com/)

> Transform your HTML slides into professional PowerPoint presentations instantly!

A powerful Node.js tool that converts HTML slides to PowerPoint presentations with two conversion modes: pixel-perfect Picture-Based mode and fully editable Editable Text mode.

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
file-converter/
├── HTML FILES/
│   ├── Project1/            ← Create a folder for each project
│   │   ├── 1.html
│   │   ├── 2.html
│   │   └── ...
│   └── Project2/            ← Another project folder
│       ├── 1.html
│       └── ...
├── HTML_TO_PPT/             ← Output folder (auto-created)
│   ├── Project1/
│   │   ├── Picture-Based/
│   │   └── Editable-Text/
│   └── Project2/
│       ├── Picture-Based/
│       └── Editable-Text/
└── html-to-ppt-converter.js ← Main converter script
```

### 📌 Important: Project Folder Structure

**You MUST create a project folder inside "HTML FILES" directory!**

✅ **Correct:**
```
HTML FILES/
└── MyPresentation/
    ├── 1.html
    ├── 2.html
    └── 3.html
```

❌ **Incorrect:**
```
HTML FILES/
├── 1.html
├── 2.html
└── 3.html
```

---

## 🚀 Quick Start

### 1️⃣ Create Your Project Folder

Create a folder for your project inside the `HTML FILES` directory and place your HTML files there:

```powershell
# Example: Create a project folder
New-Item -ItemType Directory -Path "HTML FILES\MyPresentation"

# Place your HTML files inside
# HTML FILES\MyPresentation\1.html
# HTML FILES\MyPresentation\2.html
# etc.
```

### 2️⃣ Install Dependencies (First Time Only)

```powershell
npm install
```

### 3️⃣ Run the Converter

```powershell
npm start
```

**Or:**

```powershell
node html-to-ppt-converter.js
```

### 4️⃣ Select Your Project

The converter will show you all available projects in the `HTML FILES` folder:

```
📁 Select Your Project:

  [1] 📂 MyPresentation
      5 HTML file(s)

  [2] 📂 AnotherProject
      3 HTML file(s)

  [3] 🚪 Exit

👉 Select project number:
```

### 5️⃣ Choose Your Mode

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

### Clone the Repository

```bash
git clone https://github.com/jeet1511/html-to-ppt-converter.git
cd html-to-ppt-converter
```

### Install Dependencies

```bash
npm install
```

This will install:
- `puppeteer` - For HTML rendering and screenshots
- `pptxgenjs` - For PowerPoint generation
- `jsdom` - For HTML parsing

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

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

---

## ⭐ Show Your Support

If you found this project useful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with others
- Contributing to the project

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🐛 Troubleshooting

**Issue:** "EBUSY: resource busy or locked"
- **Solution:** Close the PowerPoint file before running the converter

**Issue:** "Cannot find module"
- **Solution:** Run `npm install` first

**Issue:** Browser launch fails
- **Solution:** Puppeteer will auto-download Chromium on first install

**Issue:** "No project folders found!"
- **Solution:** Create a folder inside `HTML FILES` directory and place your HTML files there

---

## 💬 Support

Found a bug or have a suggestion? 

- Open an issue on [GitHub Issues](https://github.com/jeet1511/html-to-ppt-converter/issues)
- Contact: [@jeet1511](https://github.com/jeet1511)

---

**Made with ❤️ by [@jeet1511](https://github.com/jeet1511)**
