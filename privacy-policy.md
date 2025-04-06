# Privacy Policy for LLM Water Tracker

Last Updated: [4/6/2025]

## Overview
LLM Water Tracker is a browser extension that helps users track their environmental impact through water usage equivalence when interacting with Large Language Models (LLMs). We are committed to protecting your privacy and being transparent about our data practices.

## Information We Collect

### 1. Location Data
- **Geolocation**: With your permission, we collect your approximate location using the browser's geolocation API
- **IP-based Location**: As a fallback, we may determine your country using IP-based geolocation
- **Browser Locale**: As a final fallback, we use your browser's locale settings
- **Purpose**: Location data is used solely to provide accurate water usage calculations based on your country's data center locations
- **Storage**: Location preferences are stored locally and are not transmitted to any external servers

### 2. Usage Statistics
- **Interaction Counts**: We track the number of interactions with supported LLM platforms (ChatGPT, Claude, Gemini)
- **Site-specific Data**: We record which supported platforms you use
- **Timestamps**: We store when interactions occur for weekly/monthly/yearly statistics
- **Storage**: All usage data is stored in your browser's local storage using Chrome's storage sync API
- **Purpose**: This information is used to calculate and display your water usage statistics

### 3. Website Monitoring
- **Mutation Observer**: We use a DOM mutation observer to detect LLM responses on supported platforms
- **HTML Elements**: We monitor specific HTML elements that indicate user-model interactions
- **Purpose**: This monitoring is used solely to count interactions for water usage calculations
- **Scope**: Monitoring is limited to supported LLM platforms only

## How We Use Your Data

1. **Water Usage Calculations**
   - Calculate water consumption equivalence based on your location
   - Generate usage statistics for different time periods
   - Display progress towards user-set usage limits

2. **Local Features**
   - Provide country-specific water usage metrics
   - Generate weekly, monthly, and yearly statistics
   - Track progress against personal usage goals

## Data Storage and Sharing

### Storage
- All data is stored locally in your browser using Chrome's storage sync API
- Data may sync across your Chrome instances if you're signed into Chrome
- No data is stored on external servers
- No personal information is transmitted to third parties

### Third-Party Services
- We use the following third-party services:
  - ipapi.co: For IP-based geolocation (fallback only)
  - BigDataCloud: For reverse geocoding of coordinates
  - These services are used only when geolocation permission is denied

## Data Retention and User Control

### Retention
- Usage data persists until you:
  - Reset the counter manually
  - Uninstall the extension
  - Clear browser data

### User Control
- You can:
  - Reset all statistics at any time
  - Deny location permissions (falls back to average values)
  - Set and modify usage limits
  - Control when tracking starts via the welcome screen

## Security
- All data is stored locally and protected by your browser's security mechanisms
- No authentication or personal identifiers are required or stored
- No sensitive data is collected or transmitted

## Changes to Supported Sites
The extension currently monitors:
- chatgpt.com
- claude.ai
- gemini.google.com

Additional sites may be added in future updates. Users will be notified of such changes through extension updates.

## Updates to Privacy Policy
We may update this privacy policy as we add features or change functionality. Users will be notified of significant changes through extension updates.

## Contact
For privacy concerns or questions about data handling, please contact us through our GitHub repository or Chrome Web Store listing.

## Your Rights
You have the right to:
- Access your stored data (viewable in extension storage)
- Delete your data (via reset function)
- Disable location tracking
- Uninstall the extension at any time

## Children's Privacy
This extension is not intended for and does not knowingly collect data from users under 13 years of age. 