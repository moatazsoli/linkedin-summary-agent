# LinkedIn Post Summarizer

<p align="center">
  <img src="icon128.png" alt="LinkedIn Post Summarizer Logo" width="128" height="128">
</p>

A Chrome extension that automatically generates concise TL;DR summaries for LinkedIn posts using Google's Gemini AI. Perfect for professionals who want to quickly grasp the key points while browsing their feed.

## Features

### 🚀 Smart Summarization
- Automatically generates one-sentence summaries of LinkedIn posts
- Powered by Google's Gemini 1.5 Pro AI model
- Intelligent fallback to local processing when needed
- Customizable summary tone

### 💡 Intelligent Processing
- Real-time post detection and summarization
- Smart content extraction
- Minimal length threshold (50 characters)
- Race condition prevention

### 🎨 Clean UI
- Non-intrusive design that matches LinkedIn's interface
- Clear TL;DR section with attribution
- Easy-to-use settings popup
- Enable/disable toggle for quick control

### 🔒 Privacy First
- Uses your own Gemini API key
- All processing happens through secure API calls
- No data collection or storage
- Local fallback options available

## Installation

1. Install from the Chrome Web Store: [\[Link to store\]](https://chromewebstore.google.com/detail/linkedin-post-summarizer/mgphlkibcapebohgfoohlmkeigjobddd)
   
   OR

2. Manual Installation:
   - Clone this repository
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

## Setup

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the extension icon in Chrome
3. Enter your API key
4. (Optional) Customize the summary tone
5. Start browsing LinkedIn!

## How It Works

The extension uses a three-tier summarization approach:

1. **Gemini AI** (Primary)
   - Uses Google's advanced AI model
   - Generates contextual, intelligent summaries
   - Requires API key

2. **compromise.js** (First Fallback)
   - Local natural language processing
   - Extracts key sentences based on grammar
   - No API required

3. **Simple Extraction** (Second Fallback)
   - Basic first-sentence extraction
   - Minimal processing
   - Always available

## Technical Details

### Technologies Used
- JavaScript
- Chrome Extension APIs
- Google Gemini 1.5 Pro API
- compromise.js for NLP
- Chrome Storage API

### Files
- `manifest.json`: Extension configuration
- `content.js`: Main processing logic
- `popup.html/js`: Settings interface
- `compromise.min.js`: Local NLP library

### Permissions
- `storage`: For saving API key and preferences
- Host permissions for LinkedIn and Gemini API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Privacy Policy

This extension:
- Does not collect or store any user data
- Uses local storage only for API key and preferences
- Makes API calls only to Google's Gemini service
- Does not track user behavior or analytics

## Credits

- Google Gemini AI for summarization
- [compromise.js](https://github.com/spencermountain/compromise) for local NLP


## Support

For issues, feature requests, or questions:
- Open an issue on GitHub