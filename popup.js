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
  const limitsStep = document.getElementById('limitsStep');
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

  // Country-specific water usage data (submissions per 1L)
  // Source: https://arxiv.org/pdf/2304.03271
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

  // Calculate average of all countries
  const averageSubmissions = Object.values(countryData).reduce((a, b) => a + b.value, 0) / Object.keys(countryData).length;
  countryData["AVG"] = { value: averageSubmissions.toFixed(2), name: 'Average' };

  async function getUserCountryCode() {
    try {
        const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) { // If geolocation is not supported, use the browser locale
          return getUserCountryFromUI();
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Use OpenStreetMap's Nominatim for reverse geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      
      const countryCode = data.address.country_code.toUpperCase();
      return countryCode;
    } catch (error) {
      return 'AVG'; // Return average if we can't determine the country
    }
  }
  
  async function getLocationFromIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Failed to get location data');
      }
      
      return {
        country_code: data.country_code,
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      console.error('Error getting location from IP:', error);
      return null;
    }
  }

  async function getUserCountryWithTimeout() {
    try {
      // Create a promise that rejects after 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Geolocation timeout')), 30000);
      });

      // Race between the geolocation and the timeout
      const countryCode = await Promise.race([
        getUserCountryCode(),
        timeoutPromise
      ]);

      return countryCode;
    } catch (error) {
      console.log('Geolocation timed out or failed, falling back to IP-based location');
      try {
        const locationData = await getLocationFromIP();
        if (locationData && locationData.country_code) {
          return locationData.country_code.toUpperCase();
        }
        // If IP location fails, try browser UI locale
        return getUserCountryFromUI();
      } catch (ipError) {
        console.error('IP location fallback failed:', ipError);
        // Final fallback: try browser UI locale
        return getUserCountryFromUI();
      }
    }
  }

  // Get user's country from browser locale
  function getUserCountryFromUI() {
    try {
      const locale = chrome.i18n.getUILanguage();
      return locale.split('-')[1] || locale.split('_')[1] || 'AVG';
    } catch (error) {
      console.error('Error getting country from UI:', error);
      return 'AVG';
    }
  }

  // Get submissions per 1L for user's country
  async function getSubmissionsPerBottle() {
    try {
      const countryCode = await getUserCountryWithTimeout();
      const countryInfo = countryData[countryCode];
      const sourceLink = '<a href="https://arxiv.org/pdf/2304.03271" target="_blank" style="color: #4A90E2; text-decoration: underline;">source</a>';
      
      if (countryInfo) {
        countryText.innerHTML = `Using ${countryInfo.name} equivalence: ${countryInfo.value} chats per 1L bottle (${sourceLink})`;
        return countryInfo.value;
      } else {
        countryText.innerHTML = `Using average equivalence: ${countryData["AVG"].value} chats per 1L bottle (${sourceLink})`;
        return countryData["AVG"].value;
      }
    } catch (error) {
      const sourceLink = '<a href="https://arxiv.org/pdf/2304.03271" target="_blank" style="color: #4A90E2; text-decoration: underline;">source</a>';
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
        
        if (hostname.includes('chatgpt.com') || 
            hostname.includes('claude.ai') || 
            hostname.includes('gemini.google.com')) {
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

  async function updatePopup() {
    try {
      const data = await chrome.storage.sync.get('submissionCounts');
      const submissionCounts = data.submissionCounts || {};
      
      // Calculate total submissions across all supported sites
      const totalSubmissions = Object.entries(submissionCounts).reduce((sum, [site, counts]) => {
        if (typeof counts === 'object') {
          // Handle timestamped submissions
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

  // Check if first time user - using chrome.storage.sync instead of local
  chrome.storage.sync.get(['hasSeenWelcome'], function(data) {
    if (!data.hasSeenWelcome) {
      mainContent.classList.add('hidden');
      onboardingModal.classList.remove('hidden');
    } else {
      mainContent.classList.remove('hidden');
      onboardingModal.classList.add('hidden');
    }
  });

  // Get Started button handler - using chrome.storage.sync instead of local
  getStartedBtn.addEventListener('click', function() {
    chrome.storage.sync.set({ hasSeenWelcome: true }, function() {
      onboardingModal.classList.add('hidden');
      mainContent.classList.remove('hidden');
    });
  });

  // Settings button handlers
  settingsButton.addEventListener('click', function() {
    chrome.storage.sync.get('limits', function(data) {
      if (data.limits) {
        updateLimitInputs(data.limits);
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

    const w = parseFloat(weekly);
    const m = parseFloat(monthly);
    const y = parseFloat(yearly);

    // Check for negative values
    if (w < 0) {
      showError(weeklyError, 'Weekly limit cannot be negative');
      isValid = false;
    }
    if (m < 0) {
      showError(monthlyError, 'Monthly limit cannot be negative');
      isValid = false;
    }
    if (y < 0) {
      showError(yearlyError, 'Yearly limit cannot be negative');
      isValid = false;
    }

    // Check relationships between periods
    if (w > m) {
      showError(weeklyError, 'Weekly limit cannot be greater than monthly limit');
      isValid = false;
    }
    if (m > y) {
      showError(monthlyError, 'Monthly limit cannot be greater than yearly limit');
      isValid = false;
    }

    // Check for empty or invalid values
    if (!weekly || isNaN(w)) {
      showError(weeklyError, 'Please enter a valid weekly limit');
      isValid = false;
    }
    if (!monthly || isNaN(m)) {
      showError(monthlyError, 'Please enter a valid monthly limit');
      isValid = false;
    }
    if (!yearly || isNaN(y)) {
      showError(yearlyError, 'Please enter a valid yearly limit');
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
      weekly: parseFloat(weekly),
      monthly: parseFloat(monthly),
      yearly: parseFloat(yearly)
    };

    chrome.storage.sync.set({ limits }, function() {
      settingsModal.classList.add('hidden');
      updateProgressBars();
    });

    return true;
  }

  // Save settings button handler
  saveSettingsBtn.addEventListener('click', function() {
    saveLimits(
      weeklyLimitSettings.value,
      monthlyLimitSettings.value,
      yearlyLimitSettings.value
    );
  });

  function updateLimitInputs(limits) {
    weeklyLimitSettings.value = limits.weekly;
    monthlyLimitSettings.value = limits.monthly;
    yearlyLimitSettings.value = limits.yearly;
  }

  function updateProgressBar(element, current, limit) {
    if (!limit) return;

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

      updateProgressBar(weeklyProgress, weeklyWater, data.limits.weekly);
      updateProgressBar(monthlyProgress, monthlyWater, data.limits.monthly);
      updateProgressBar(yearlyProgress, yearlyWater, data.limits.yearly);
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
}); 