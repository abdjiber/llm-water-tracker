// popup.js - Logic for the extension popup

document.addEventListener('DOMContentLoaded', function() {
  const submissionCountEl = document.getElementById('submissionCount');
  const waterBottleCountEl = document.getElementById('waterBottleCount');
  const waterBottleDisplayEl = document.getElementById('waterBottleDisplay');
  const resetButton = document.getElementById('resetButton');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const countryText = document.getElementById('countryText');
  const weeklyCountEl = document.getElementById('weeklyCount');
  const weeklyWaterEl = document.getElementById('weeklyWater');
  const monthlyCountEl = document.getElementById('monthlyCount');
  const monthlyWaterEl = document.getElementById('monthlyWater');
  const yearlyCountEl = document.getElementById('yearlyCount');
  const yearlyWaterEl = document.getElementById('yearlyWater');

  // New element references
  const onboardingModal = document.getElementById('onboardingModal');
  const welcomeStep = document.getElementById('welcomeStep');
  const countryStep = document.getElementById('countryStep');
  const getStartedBtn = document.getElementById('getStartedBtn');
  const saveLimitsBtn = document.getElementById('saveLimitsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const settingsButton = document.getElementById('settingsButton');
  const closeSettings = document.getElementById('closeSettings');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const mainContent = document.getElementById('mainContent');

  // Input references
  const weeklyLimitInput = document.getElementById('weeklyLimit');
  const monthlyLimitInput = document.getElementById('monthlyLimit');
  const yearlyLimitInput = document.getElementById('yearlyLimit');
  const weeklyLimitSettings = document.getElementById('weeklyLimitSettings');
  const monthlyLimitSettings = document.getElementById('monthlyLimitSettings');
  const yearlyLimitSettings = document.getElementById('yearlyLimitSettings');
  const weeklyError = document.getElementById('weeklyError');
  const monthlyError = document.getElementById('monthlyError');
  const yearlyError = document.getElementById('yearlyError');
  const limitError = document.getElementById('limitError');
  const settingsError = document.getElementById('settingsError');

  // Progress bar references
  const weeklyProgress = document.getElementById('weeklyProgress');
  const monthlyProgress = document.getElementById('monthlyProgress');
  const yearlyProgress = document.getElementById('yearlyProgress');

  const countrySelect = document.getElementById('countrySelect');
  const continueBtn = document.getElementById('continueBtn');
  const countryError = document.getElementById('countryError');

  const countrySettingsSelect = document.getElementById('countrySettingsSelect');

  const pauseTrackingBtn = document.getElementById('pauseTrackingBtn');
  const stopTrackingBtn = document.getElementById('stopTrackingBtn');

  const chatgptCount = document.getElementById('chatgptCount');
  const claudeCount = document.getElementById('claudeCount');
  const geminiCount = document.getElementById('geminiCount');

  // Add this constant at the top of the file
  const allCountries = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AD': 'Andorra', 'AO': 'Angola', 'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia', 'AT': 'Austria', 'AZ': 'Azerbaijan',
    'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados', 'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin', 'BT': 'Bhutan', 'BO': 'Bolivia', 'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana', 'BR': 'Brazil', 'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi',
    'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada', 'CV': 'Cape Verde', 'CF': 'Central African Republic', 'TD': 'Chad', 'CL': 'Chile', 'CN': 'China', 'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CD': 'Congo, Democratic Republic', 'CR': 'Costa Rica', 'HR': 'Croatia', 'CU': 'Cuba', 'CY': 'Cyprus', 'CZ': 'Czechia',
    'DK': 'Denmark', 'DJ': 'Djibouti', 'DM': 'Dominica', 'DO': 'Dominican Republic',
    'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador', 'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia',
    'FJ': 'Fiji', 'FI': 'Finland', 'FR': 'France',
    'GA': 'Gabon', 'GM': 'Gambia', 'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana', 'GR': 'Greece', 'GD': 'Grenada', 'GT': 'Guatemala', 'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana',
    'HT': 'Haiti', 'HN': 'Honduras', 'HU': 'Hungary',
    'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia', 'IR': 'Iran', 'IQ': 'Iraq', 'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy',
    'JM': 'Jamaica', 'JP': 'Japan', 'JO': 'Jordan',
    'KZ': 'Kazakhstan', 'KE': 'Kenya', 'KI': 'Kiribati', 'KP': 'Korea, North', 'KR': 'Korea, South', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan',
    'LA': 'Laos', 'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya', 'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg',
    'MK': 'North Macedonia', 'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta', 'MH': 'Marshall Islands', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MX': 'Mexico', 'FM': 'Micronesia', 'MD': 'Moldova', 'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar',
    'NA': 'Namibia', 'NR': 'Nauru', 'NP': 'Nepal', 'NL': 'Netherlands', 'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria', 'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan', 'PW': 'Palau', 'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru', 'PH': 'Philippines', 'PL': 'Poland', 'PT': 'Portugal',
    'QA': 'Qatar',
    'RO': 'Romania', 'RU': 'Russia', 'RW': 'Rwanda',
    'KN': 'Saint Kitts and Nevis', 'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines', 'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome and Principe', 'SA': 'Saudi Arabia', 'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SG': 'Singapore', 'SK': 'Slovakia', 'SI': 'Slovenia', 'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa', 'SS': 'South Sudan', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan', 'SR': 'Suriname', 'SZ': 'Eswatini', 'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syria',
    'TW': 'Taiwan', 'TJ': 'Tajikistan', 'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TO': 'Tonga', 'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan', 'TV': 'Tuvalu',
    'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan',
    'VU': 'Vanuatu', 'VA': 'Vatican City', 'VE': 'Venezuela', 'VN': 'Vietnam',
    'YE': 'Yemen',
    'ZM': 'Zambia', 'ZW': 'Zimbabwe',
    'PS': 'Palestine'
  };
  
  const sourceLink = '<a href="https://arxiv.org/pdf/2304.03271" target="_blank" style="color: #4A90E2; text-decoration: underline;">source</a>';


  // Update the countryData object to include the average calculation
  const countryData = {
    'US': { value: 59.2, name: 'United States' },    // 29.6 * 2
    'AU': { value: 52.2, name: 'Australia' },        // 26.1 * 2
    'DK': { value: 67.6, name: 'Denmark' },          // 33.8 * 2
    'FI': { value: 49.0, name: 'Finland' },          // 24.5 * 2
    'IN': { value: 50.8, name: 'India' },            // 25.4 * 2
    'ID': { value: 51.0, name: 'Indonesia' },        // 25.5 * 2
    'IE': { value: 140.8, name: 'Ireland' },         // 70.4 * 2
    'MX': { value: 41.8, name: 'Mexico' },           // 20.9 * 2
    'NL': { value: 62.8, name: 'Netherlands' },      // 31.4 * 2
    'SE': { value: 35.4, name: 'Sweden' }            // 17.7 * 2
  };

  // Calculate average of all countries with data
  const averageSubmissions = Object.values(countryData).reduce((a, b) => a + b.value, 0) / Object.keys(countryData).length;
  countryData["AVG"] = { value: averageSubmissions.toFixed(2), name: 'Average' };


  function isSupportedHostname(hostname) {
    return hostname.includes('chatgpt.com') || 
           hostname.includes('claude.ai') || 
           hostname.includes('gemini.google.com')
  }

  // Populate both country dropdowns
  function populateCountryDropdowns() {
    // Sort countries alphabetically
    const sortedCountries = Object.entries(allCountries).sort((a, b) => a[1].localeCompare(b[1]));
    
    // Clear existing options except the first one
    countrySelect.innerHTML = '<option value="">Select a country...</option>';
    countrySettingsSelect.innerHTML = '<option value="">Select a country...</option>';
    
    // Add all countries to both dropdowns
    sortedCountries.forEach(([code, name]) => {
      // For onboarding dropdown
      const option1 = document.createElement('option');
      option1.value = code;
      option1.textContent = name;
      countrySelect.appendChild(option1);

      // For settings dropdown
      const option2 = document.createElement('option');
      option2.value = code;
      option2.textContent = name;
      countrySettingsSelect.appendChild(option2);
    });
  }

  // Call this when the page loads
  populateCountryDropdowns();

  // Modify getSubmissionsPerBottle to handle all countries
  async function getSubmissionsPerBottle() {
    try {
      const data = await chrome.storage.sync.get('userCountry');
      const countryCode = data.userCountry;
      const countryName = allCountries[countryCode];
      
      if (countryData[countryCode]) {
        // Country has specific data
        countryText.innerHTML = `Using ${countryName} equivalence: ${countryData[countryCode].value} chats per 1L bottle (${sourceLink})`;
        return countryData[countryCode].value;
      } else {
        // Country doesn't have specific data, use average
        countryText.innerHTML = `Using average equivalence for ${countryName}: ${countryData["AVG"].value} chats per 1L bottle (${sourceLink})`;
        return countryData["AVG"].value;
      }
    } catch (error) {
      console.error('Error getting submissions per bottle:', error);
      countryText.innerHTML = `Using average equivalence: ${countryData["AVG"].value} chats per 1L bottle (${sourceLink})`;
      return countryData["AVG"].value;
    }
  }

  // Check if current hostname is supported
  function checkHostnameSupport() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        
        if (isSupportedHostname(hostname)) {
          statusIndicator.classList.add('supported');
          statusText.textContent = `Tracking enabled for ${hostname}`;
        } else {
          statusIndicator.classList.add('unsupported');
          statusText.textContent = 'Not on a supported site';
        }
      }
    });
  }

  function getStartOfPeriod(period) {
    const now = new Date();
    switch (period) {
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return startOfWeek;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return now;
    }
  }

  function calculatePeriodStats(submissions, period) {
    const startDate = getStartOfPeriod(period);
    let periodCount = 0;

    for (const [site, counts] of Object.entries(submissions)) {
      if (typeof counts === 'object') {
        // Handle timestamped submissions
        for (const [timestamp, count] of Object.entries(counts)) {
          if (new Date(parseInt(timestamp)) >= startDate) {
            periodCount += count;
          }
        }
      } else {
        // Handle legacy data (total counts without timestamps)
        periodCount += counts;
      }
    }

    return periodCount;
  }

  function updateTimeStats(submissionCounts, submissionsPerBottle) {
    try {
      // Calculate stats for each time period
      const weeklySubmissions = calculatePeriodStats(submissionCounts, 'week');
      const monthlySubmissions = calculatePeriodStats(submissionCounts, 'month');
      const yearlySubmissions = calculatePeriodStats(submissionCounts, 'year');

      // Update the display with proper formatting
      weeklyCountEl.textContent = weeklySubmissions.toString();
      weeklyWaterEl.textContent = `${(weeklySubmissions / submissionsPerBottle).toFixed(2)}L`;

      monthlyCountEl.textContent = monthlySubmissions.toString();
      monthlyWaterEl.textContent = `${(monthlySubmissions / submissionsPerBottle).toFixed(2)}L`;

      yearlyCountEl.textContent = yearlySubmissions.toString();
      yearlyWaterEl.textContent = `${(yearlySubmissions / submissionsPerBottle).toFixed(2)}L`;
    } catch (error) {
      console.error('Error updating time stats:', error);
    }
  }

  // Function to update platform counts
  function updatePlatformCounts(submissionCounts) {
    const counts = {
      'chatgpt.com': 0,
      'claude.ai': 0,
      'gemini.google.com': 0
    };

    // Calculate counts for each platform
    Object.entries(submissionCounts || {}).forEach(([hostname, count]) => {
      if (hostname.includes('chatgpt.com')) {
        counts['chatgpt.com'] = (typeof count === 'object') 
          ? Object.values(count).reduce((a, b) => a + b, 0) 
          : count;
      } else if (hostname.includes('claude.ai')) {
        counts['claude.ai'] = (typeof count === 'object')
          ? Object.values(count).reduce((a, b) => a + b, 0)
          : count;
      } else if (hostname.includes('gemini.google.com')) {
        counts['gemini.google.com'] = (typeof count === 'object')
          ? Object.values(count).reduce((a, b) => a + b, 0)
          : count;
      }
    });

    // Update the display with animation
    updateCountWithAnimation(chatgptCount, counts['chatgpt.com']);
    updateCountWithAnimation(claudeCount, counts['claude.ai']);
    updateCountWithAnimation(geminiCount, counts['gemini.google.com']);
  }

  // Helper function to update count with animation
  function updateCountWithAnimation(element, newValue) {
    const currentValue = parseInt(element.textContent);
    if (currentValue !== newValue) {
      element.textContent = newValue;
      element.classList.remove('updated');
      // Trigger reflow
      void element.offsetWidth;
      element.classList.add('updated');
    }
  }

  // Update the existing updatePopup function to include platform counts
  async function updatePopup() {
    try {
      const data = await chrome.storage.sync.get('submissionCounts');
      const submissionCounts = data.submissionCounts || {};
      
      // Update platform-specific counts
      updatePlatformCounts(submissionCounts);
      
      // Calculate total submissions across all supported sites
      const totalSubmissions = Object.entries(submissionCounts).reduce((sum, [site, counts]) => {
        if (typeof counts === 'object') {
          return sum + Object.values(counts).reduce((a, b) => a + b, 0);
        }
        return sum + (counts || 0);
      }, 0);
      
      const submissionsPerBottle = await getSubmissionsPerBottle();
      const waterBottles = totalSubmissions / submissionsPerBottle;

      // Update main stats
      submissionCountEl.textContent = totalSubmissions.toString();
      waterBottleCountEl.textContent = `${waterBottles.toFixed(2)}L`;

      // Update time-based stats
      updateTimeStats(submissionCounts, submissionsPerBottle);

      // Update water bottle visualization
      waterBottleDisplayEl.innerHTML = ''; // Clear previous bottles
      
      // Calculate full and partial bottles
      const fullBottles = Math.floor(waterBottles);
      const partialBottle = waterBottles % 1;

      // Add full bottles
      for (let i = 0; i < fullBottles; i++) {
        const bottle = document.createElement('div');
        bottle.classList.add('water-bottle', 'full');
        bottle.title = `1L Bottle ${i + 1}`;
        waterBottleDisplayEl.appendChild(bottle);
      }

      // Add partial bottle if needed
      if (partialBottle > 0) {
        const bottle = document.createElement('div');
        bottle.classList.add('water-bottle');
        bottle.style.setProperty('--water-level', `${partialBottle * 100}%`);
        bottle.title = `${(partialBottle).toFixed(2)}L`;
        waterBottleDisplayEl.appendChild(bottle);
      }
    } catch (error) {
      console.error('Error updating popup:', error);
    }
  }

  // Initial checks and updates
  checkHostnameSupport();
  updatePopup();

  // Listen for updates from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updatePopup') {
      updatePopup();
    }
  });

  // Reset button functionality
  resetButton.addEventListener('click', () => {
    chrome.storage.sync.set({ submissionCounts: {} }, () => {
      console.log('Counter reset to 0');
      updatePopup();
    });
  });

  // Get Started button now transitions to country selection
  getStartedBtn.addEventListener('click', function() {
    welcomeStep.classList.add('hidden');
    countryStep.classList.remove('hidden');
  });

  // Continue button handler
  continueBtn.addEventListener('click', function() {
    const selectedCountry = countrySelect.value;
    if (!selectedCountry) {
      countryError.classList.remove('hidden');
      return;
    }
    
    chrome.storage.sync.set({ 
      hasSeenWelcome: true,
      userCountry: selectedCountry 
    }, function() {
      onboardingModal.classList.add('hidden');
      mainContent.classList.remove('hidden');
      updatePopup();
    });
  });

  // Hide error when country is selected
  countrySelect.addEventListener('change', function() {
    if (this.value) {
      countryError.classList.add('hidden');
    }
  });

  // Check if first time user
  chrome.storage.sync.get(['hasSeenWelcome', 'userCountry'], function(data) {
    if (!data.hasSeenWelcome || !data.userCountry) {
      mainContent.classList.add('hidden');
      onboardingModal.classList.remove('hidden');
      welcomeStep.classList.remove('hidden');
      countryStep.classList.add('hidden');
    } else {
      mainContent.classList.remove('hidden');
      onboardingModal.classList.add('hidden');
    }
  });

  // Settings button handlers
  settingsButton.addEventListener('click', function() {
    chrome.storage.sync.get(['limits', 'userCountry', 'trackingState'], function(data) {
      if (data.limits) {
        updateLimitInputs(data.limits);
      }
      if (data.userCountry) {
        countrySettingsSelect.value = data.userCountry;
      }
      
      // Update tracking status in settings
      const trackingStatusText = document.getElementById('trackingStatusText');
      const enableTrackingBtn = document.getElementById('enableTrackingBtn');
      
      if (data.trackingState === 'stopped') {
        trackingStatusText.textContent = 'Stopped';
        enableTrackingBtn.classList.remove('hidden');
      } else if (data.trackingState === 'paused') {
        trackingStatusText.textContent = 'Paused';
        enableTrackingBtn.classList.add('hidden');
      } else {
        trackingStatusText.textContent = 'Active';
        enableTrackingBtn.classList.add('hidden');
      }
      
      settingsModal.classList.remove('hidden');
    });
  });

  closeSettings.addEventListener('click', function() {
    settingsModal.classList.add('hidden');
  });

  function clearErrors() {
    weeklyError.textContent = '';
    monthlyError.textContent = '';
    yearlyError.textContent = '';
    weeklyError.classList.add('hidden');
    monthlyError.classList.add('hidden');
    yearlyError.classList.add('hidden');
  }

  function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
  }

  function validateLimits(weekly, monthly, yearly) {
    clearErrors();
    let isValid = true;

    // Convert to numbers, empty values become NaN
    const w = weekly ? parseFloat(weekly) : null;
    const m = monthly ? parseFloat(monthly) : null;
    const y = yearly ? parseFloat(yearly) : null;

    // Check for negative values only if values are provided
    if (w !== null && w < 0) {
      showError(weeklyError, 'Weekly limit cannot be negative');
      isValid = false;
    }
    if (m !== null && m < 0) {
      showError(monthlyError, 'Monthly limit cannot be negative');
      isValid = false;
    }
    if (y !== null && y < 0) {
      showError(yearlyError, 'Yearly limit cannot be negative');
      isValid = false;
    }

    // Check relationships between periods only if both values in the comparison exist
    if (w !== null && m !== null && w > m) {
      showError(weeklyError, 'Weekly limit cannot be greater than monthly limit');
      isValid = false;
    }
    if (m !== null && y !== null && m > y) {
      showError(monthlyError, 'Monthly limit cannot be greater than yearly limit');
      isValid = false;
    }

    // Check for invalid number formats if values are provided
    if (weekly && isNaN(w)) {
      showError(weeklyError, 'Please enter a valid number');
      isValid = false;
    }
    if (monthly && isNaN(m)) {
      showError(monthlyError, 'Please enter a valid number');
      isValid = false;
    }
    if (yearly && isNaN(y)) {
      showError(yearlyError, 'Please enter a valid number');
      isValid = false;
    }

    return { valid: isValid };
  }

  function saveLimits(weekly, monthly, yearly) {
    const validation = validateLimits(weekly, monthly, yearly);

    if (!validation.valid) {
      return false;
    }

    const limits = {
      weekly: weekly ? parseFloat(weekly) : null,
      monthly: monthly ? parseFloat(monthly) : null,
      yearly: yearly ? parseFloat(yearly) : null
    };

    chrome.storage.sync.set({ limits }, function() {
      settingsModal.classList.add('hidden');
      updateProgressBars();
    });

    return true;
  }

  // Save settings button handler
  saveSettingsBtn.addEventListener('click', function() {
    const selectedCountry = countrySettingsSelect.value;
    if (!selectedCountry) {
      // Show error or handle empty country selection
      return;
    }

    const weekly = weeklyLimitSettings.value;
    const monthly = monthlyLimitSettings.value;
    const yearly = yearlyLimitSettings.value;

    const validation = validateLimits(weekly, monthly, yearly);
    if (!validation.valid) {
      return;
    }

    const limits = {
      weekly: parseFloat(weekly),
      monthly: parseFloat(monthly),
      yearly: parseFloat(yearly)
    };

    // Save both limits and country
    chrome.storage.sync.set({ 
      limits: limits,
      userCountry: selectedCountry 
    }, function() {
      settingsModal.classList.add('hidden');
      updatePopup(); // This will refresh the display with the new country data
      updateProgressBars();
    });
  });

  function updateLimitInputs(limits) {
    weeklyLimitSettings.value = limits.weekly;
    monthlyLimitSettings.value = limits.monthly;
    yearlyLimitSettings.value = limits.yearly;
  }

  function updateProgressBar(element, current, limit) {
    if (limit === null) {
      // If no limit is set, hide or reset the progress bar
      element.style.width = '0%';
      element.classList.remove('low', 'medium', 'high');
      return;
    }

    const percentage = (current / limit) * 100;
    element.style.width = `${Math.min(percentage, 100)}%`;

    // Remove existing classes
    element.classList.remove('low', 'medium', 'high');

    // Add appropriate class based on percentage
    if (percentage <= 60) {
      element.classList.add('low');
    } else if (percentage <= 85) {
      element.classList.add('medium');
    } else {
      element.classList.add('high');
    }
  }

  function updateProgressBars() {
    chrome.storage.sync.get(['limits', 'submissionCounts'], function(data) {
      if (!data.limits) return;

      const weeklyWater = parseFloat(weeklyWaterEl.textContent);
      const monthlyWater = parseFloat(monthlyWaterEl.textContent);
      const yearlyWater = parseFloat(yearlyWaterEl.textContent);

      // Only update progress bars for limits that are set
      if (data.limits.weekly !== null) {
        updateProgressBar(weeklyProgress, weeklyWater, data.limits.weekly);
      } else {
        updateProgressBar(weeklyProgress, 0, null);
      }

      if (data.limits.monthly !== null) {
        updateProgressBar(monthlyProgress, monthlyWater, data.limits.monthly);
      } else {
        updateProgressBar(monthlyProgress, 0, null);
      }

      if (data.limits.yearly !== null) {
        updateProgressBar(yearlyProgress, yearlyWater, data.limits.yearly);
      } else {
        updateProgressBar(yearlyProgress, 0, null);
      }
    });
  }

  // Update the existing updateTimeStats function to include progress bars
  const originalUpdateTimeStats = updateTimeStats;
  updateTimeStats = function(submissionCounts, submissionsPerBottle) {
    originalUpdateTimeStats(submissionCounts, submissionsPerBottle);
    updateProgressBars();
  };

  // Clear errors when inputs change
  weeklyLimitSettings.addEventListener('input', clearErrors);
  monthlyLimitSettings.addEventListener('input', clearErrors);
  yearlyLimitSettings.addEventListener('input', clearErrors);

  // Function to update button states
  function updateTrackingControls(trackingState) {
    const isPaused = trackingState === 'paused';
    const isStopped = trackingState === 'stopped';

    // Update pause button
    if (isPaused) {
      pauseTrackingBtn.classList.add('paused');
      pauseTrackingBtn.querySelector('.material-symbols-rounded').textContent = 'play_arrow';
      pauseTrackingBtn.querySelector('.button-text').textContent = 'Resume Tracking';
    } else {
      pauseTrackingBtn.classList.remove('paused');
      pauseTrackingBtn.querySelector('.material-symbols-rounded').textContent = 'pause';
      pauseTrackingBtn.querySelector('.button-text').textContent = 'Pause Tracking';
    }

    // Disable buttons appropriately
    pauseTrackingBtn.disabled = isStopped;
    stopTrackingBtn.disabled = isStopped;

    // Update status indicator
    if (isStopped) {
      statusIndicator.classList.remove('supported', 'unsupported');
      statusIndicator.classList.add('unsupported');
      statusText.textContent = 'Tracking stopped';
    } else if (isPaused) {
      statusIndicator.classList.remove('supported', 'unsupported');
      statusIndicator.classList.add('unsupported');
      statusText.textContent = 'Tracking paused';
    } else {
      checkHostnameSupport(); // This will update the status based on the current site
    }
  }

  // Load initial tracking state
  chrome.storage.sync.get(['trackingState'], function(data) {
    const trackingState = data.trackingState || 'active';
    updateTrackingControls(trackingState);
  });

  // Pause/Resume button handler
  pauseTrackingBtn.addEventListener('click', function() {
    chrome.storage.sync.get(['trackingState'], function(data) {
      const currentState = data.trackingState || 'active';
      const newState = currentState === 'paused' ? 'active' : 'paused';
      
      chrome.storage.sync.set({ trackingState: newState }, function() {
        updateTrackingControls(newState);
        // Notify background script of state change
        chrome.runtime.sendMessage({ 
          action: 'updateTrackingState', 
          state: newState 
        });
      });
    });
  });

  // Stop button handler
  stopTrackingBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to stop tracking? This will disable all tracking until you re-enable it in the extension settings.')) {
      chrome.storage.sync.set({ trackingState: 'stopped' }, function() {
        updateTrackingControls('stopped');
        // Notify background script of state change
        chrome.runtime.sendMessage({ 
          action: 'updateTrackingState', 
          state: 'stopped' 
        });
      });
    }
  });

  // Add enable tracking button handler
  document.getElementById('enableTrackingBtn').addEventListener('click', function() {
    chrome.storage.sync.set({ trackingState: 'active' }, function() {
      updateTrackingControls('active');
      // Update the status in settings
      document.getElementById('trackingStatusText').textContent = 'Active';
      this.classList.add('hidden');
      // Notify background script
      chrome.runtime.sendMessage({ 
        action: 'updateTrackingState', 
        state: 'active' 
      });
    }.bind(this));
  });
}); 