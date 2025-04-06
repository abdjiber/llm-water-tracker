# LLM Water Tracker

A Chrome extension that helps users track and understand the water consumption impact of their interactions with Large Language Models (LLMs).

![LLM Water Tracker](icons/icon128.png)

## Overview

LLM Water Tracker monitors your interactions with popular AI platforms (ChatGPT, Claude, Gemini) and provides real-time insights into the equivalent water consumption of these interactions. Based on research showing that LLM interactions can consume significant amounts of water through data center cooling, this extension helps users make environmentally conscious decisions.

## Features

- 🌊 **Real-time Water Usage Tracking**
  - Monitors interactions with major LLM platforms
  - Converts interactions to water usage equivalents
  - Country-specific calculations based on data center locations

- 📊 **Detailed Statistics**
  - Weekly, monthly, and yearly usage breakdowns
  - Per-platform interaction counts
  - Progress bars for usage limits

- 🎯 **Usage Limits**
  - Set personal water usage goals
  - Visual progress tracking
  - Customizable weekly, monthly, and yearly limits

- 🌍 **Location-Aware**
  - Uses your location to provide accurate calculations
  - Multiple fallback options for location detection
  - Respects privacy with local data storage

## Installation

1. **Chrome Web Store**
   - Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link to be added)
   - Click "Add to Chrome"
   - Follow the installation prompts

2. **Manual Installation (Developer Mode)**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Open Chrome
   # Go to chrome://extensions/
   # Enable "Developer mode"
   # Click "Load unpacked"
   # Select the llm-water-tracker directory
   ```

## Usage

1. **First-Time Setup**
   - Click the extension icon in your browser
   - Read through the welcome information
   - Optionally grant location permissions for accurate calculations
   - Set your usage limits (can be modified later)

2. **Daily Use**
   - The extension automatically tracks your LLM interactions
   - Click the extension icon to view your statistics
   - Monitor your progress through the visual indicators
   - Adjust limits through the settings button

3. **Supported Platforms**
   - ChatGPT (chatgpt.com)
   - Claude (claude.ai)
   - Gemini (gemini.google.com)

## Privacy

- All data is stored locally in your browser
- No personal information is transmitted
- Location data is used only for calculations
- See our [Privacy Policy](privacy-policy.md) for details

## Technical Details

### Architecture
- Built with vanilla JavaScript
- Uses Chrome Extension Manifest V3
- Implements DOM Mutation Observer for interaction tracking
- Uses Chrome Storage Sync API for data persistence

### Data Sources
- Water usage calculations based on published research
- Location services: Browser Geolocation API, ipapi.co
- Reverse geocoding: BigDataCloud API

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Water usage data based on research from [arXiv:2304.03271](https://arxiv.org/pdf/2304.03271)
- Icons and design elements from Material Symbols
- Community contributions and feedback

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact us through the Chrome Web Store
- Check our FAQ section (coming soon)

## Roadmap

- [ ] Additional LLM platform support
- [ ] Enhanced visualization options
- [ ] Export functionality for usage data
- [ ] Community features for environmental impact awareness
- [ ] Integration with more AI platforms

## Version History

- 1.0.1: Current stable release
  - Added usage limits feature
  - Improved location detection
  - Enhanced UI/UX
  
- 1.0.0: Initial release
  - Basic tracking functionality
  - Support for major LLM platforms
  - Local data storage 