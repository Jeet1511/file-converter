# 🚀 Quick Setup Guide

## Step 1: Create Your Project Folder

**IMPORTANT:** You must create a project folder inside the `HTML FILES` directory!

### ✅ Correct Structure:
```
HTML FILES/
└── MyPresentation/          ← Your project folder
    ├── 1.html
    ├── 2.html
    ├── 3.html
    └── ...
```

### ❌ Incorrect Structure:
```
HTML FILES/
├── 1.html                   ← Don't put files directly here!
├── 2.html
└── 3.html
```

---

## Step 2: Create Your Project Folder (PowerShell)

```powershell
# Navigate to the converter directory
cd "C:\Users\Jeet\Documents\GitHub\file-converter\converter"

# Create a new project folder
New-Item -ItemType Directory -Path "HTML FILES\MyPresentation"

# Copy your HTML files into the project folder
# You can do this manually or use:
Copy-Item "path\to\your\*.html" -Destination "HTML FILES\MyPresentation\"
```

---

## Step 3: Install Dependencies (First Time Only)

```powershell
npm install
```

---

## Step 4: Run the Converter

```powershell
npm start
```

Or:

```powershell
node html-to-ppt-converter.js
```

---

## Step 5: Select Your Project

The converter will automatically detect all project folders in `HTML FILES`:

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           🎯 HTML to PowerPoint Converter Pro 🎯              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📁 Select Your Project:

  [1] 📂 MyPresentation
      5 HTML file(s)

  [2] 📂 AnotherProject
      3 HTML file(s)

  [3] 🚪 Exit

👉 Select project number: 
```

---

## Step 6: Choose Conversion Mode

After selecting your project, choose how you want to convert:

```
📋 Choose Your Conversion Mode:

  [1] 🖼️  Picture-Based (Pixel-Perfect Match)
      ✓ Looks exactly like HTML
      ✓ Perfect layout & formatting
      ✗ Text not editable

  [2] ✏️  Editable Text (Fully Customizable)
      ✓ All text is editable
      ✓ Native PowerPoint elements
      ✗ Layout may differ slightly

  [3] 🔙 Back to Projects

  [4] 🚪 Exit
```

---

## 📁 Output Location

Your converted PowerPoint files will be saved in:

```
HTML_TO_PPT/
└── YourProjectName/
    ├── Picture-Based/
    │   └── YourProjectName-Presentation.pptx
    └── Editable-Text/
        └── YourProjectName-Presentation.pptx
```

---

## 💡 Example: Converting CRM Presentation

```powershell
# 1. Create project folder
New-Item -ItemType Directory -Path "HTML FILES\CRM-Project"

# 2. Add your HTML files
# Place 1.html, 2.html, 3.html, etc. in HTML FILES\CRM-Project\

# 3. Run converter
npm start

# 4. Select "CRM-Project" from the menu

# 5. Choose conversion mode (1 or 2)

# 6. Find your PowerPoint in:
# HTML_TO_PPT\CRM-Project\Picture-Based\CRM-Project-Presentation.pptx
# or
# HTML_TO_PPT\CRM-Project\Editable-Text\CRM-Project-Presentation.pptx
```

---

## 🎯 Pro Tips

1. **Multiple Projects**: You can have multiple project folders in `HTML FILES`
2. **Organized Output**: Each project gets its own output folder
3. **Both Modes**: Try both conversion modes and compare results
4. **File Naming**: Name your HTML files with numbers (1.html, 2.html) for proper ordering

---

## ❓ Troubleshooting

### "No project folders found!"
- Make sure you created a **folder** inside `HTML FILES`
- Don't put HTML files directly in `HTML FILES`
- The folder should contain your HTML files

### "Cannot find module"
- Run `npm install` first

### "EBUSY: resource busy or locked"
- Close any open PowerPoint files before running the converter

---

**Created with ❤️ by [@jeet1511](https://github.com/jeet1511)**
