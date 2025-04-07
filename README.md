# LLM Water Tracker

A Chrome extension that helps users track and understand the water consumption impact of their interactions with Large Language Models (LLMs).

![LLM Water Tracker](icons/icon128.png)

## Overview

LLM Water Tracker monitors your interactions with popular AI platforms (ChatGPT, Claude, Gemini) and provides real-time insights into the equivalent water consumption of these interactions. Based on research showing that LLM interactions can consume significant amounts of water through data center cooling, this extension helps users make environmentally conscious decisions.

## Demo

Watch our demo video to see the extension in action:

[![LLM Water Tracker Demo](https://img.youtube.com/vi/1GOkmYYVFXI/0.jpg)](https://youtu.be/1GOkmYYVFXI)

[Watch on YouTube](https://youtu.be/1GOkmYYVFXI)

## Features

- 🌊 **Real-time Water Usage Tracking**
  - Monitors interactions with major LLM platforms
  - Converts interactions to water usage equivalents
  - Country-specific calculations based on data center locations
  - Pause, resume, stop, and reset tracking anytime

- 📊 **Detailed Statistics**
  - Weekly, monthly, and yearly usage breakdowns
  - Per-platform interaction counts
  - Progress bars for usage limits

- 🎯 **Usage Limits**
  - Set personal water usage goals
  - Visual progress tracking
  - Customizable weekly, monthly, and yearly limits
  - Flexible settings with optional fields

- 🌍 **Country Selection**
  - Choose your country from a comprehensive global list
  - Country-specific water usage calculations
  - Update your country anytime through settings
  - Fallback to average values for countries without specific data

## Installation

**Manual Installation (Developer Mode)**
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
   - Select your country of residence
   - Set your usage limits in the settings

2. **Daily Use**
   - The extension automatically tracks your LLM interactions
   - Click the extension icon to view your statistics
   - Monitor your progress through the visual indicators
   - Pause or stop tracking using the control buttons
   - Adjust settings through the settings button

3. **Tracking Controls**
   - **Pause Tracking**: Temporarily stop counting interactions
   - **Resume Tracking**: Continue counting from where you left off
   - **Stop Tracking**: Completely disable tracking (can be re-enabled in settings)
   - **Reset**: Reset tracking

4. **Supported Platforms**
   - ChatGPT (chatgpt.com)
   - Claude (claude.ai)
   - Gemini (gemini.google.com)

## Privacy

- All data is stored locally in your browser
- No personal information is transmitted
- See our [Privacy Policy](privacy-policy.md) for details

## Technical Details

### Architecture
- Built with vanilla JavaScript, and Cursor
- Uses Chrome Extension Manifest V3
- Implements DOM Mutation Observer for interaction tracking
- Uses Chrome Storage Sync API for data persistence

### Data Sources
- Water usage calculations based on published [research ](https://arxiv.org/pdf/2304.03271)
- Country-specific calculations for global usage patterns
- User-selected country preference stored locally

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

- 1.1.0: Latest update
  - Added country selection feature (replaced automatic location detection)
  - Added tracking controls (pause, resume, stop)
  - Improved settings with flexible usage limits
  - Enhanced user onboarding experience
  - Added per-platform interaction counts

- 1.0.1: Previous stable release
  - Added usage limits feature
  - Improved location detection
  - Enhanced UI/UX
  
- 1.0.0: Initial release
  - Basic tracking functionality
  - Support for major LLM platforms
  - Local data storage 