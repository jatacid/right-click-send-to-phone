// Load saved settings and set up UI
document.addEventListener('DOMContentLoaded', function() {
  const slackToggle = document.getElementById('slackToggle');
  const discordToggle = document.getElementById('discordToggle');
  const customToggle = document.getElementById('customToggle');
  const slackSettings = document.getElementById('slackSettings');
  const discordSettings = document.getElementById('discordSettings');
  const customSettings = document.getElementById('customSettings');
  const saveButton = document.getElementById('save');
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  const clearSettingsMenu = document.getElementById('clearSettingsMenu');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');
  const statusMessage = document.getElementById('status');
  const signinButton = document.getElementById('signin');
  const webhookInput = document.getElementById('webhook');
  const discordWebhookInput = document.getElementById('discordWebhook');
  const customWebhookInput = document.getElementById('customWebhook');

  const slackAuthSection = document.getElementById('slackAuthSection');
  const slackConnected = document.getElementById('slackConnected');

  // Load saved settings
  chrome.storage.sync.get(['service', 'webhook', 'discordWebhook', 'customWebhook'], function(result) {
    // Only set active toggle if service is already configured
    if (result.service === 'slack') {
      showSlack();
    } else if (result.service === 'discord') {
      showDiscord();
    } else if (result.service === 'custom') {
      showCustom();
    }
    // If no service is set, don't activate either toggle

    // Populate saved webhooks
    if (result.webhook) {
      webhookInput.value = result.webhook;
      updateSlackUI(true);
    } else {
      updateSlackUI(false);
    }

    if (result.discordWebhook) {
      discordWebhookInput.value = result.discordWebhook;
    }
    if (result.customWebhook) {
      customWebhookInput.value = result.customWebhook;
    }
  });

  // Helper to toggle Slack UI states
  function updateSlackUI(isConnected) {
    if (isConnected) {
      slackAuthSection.classList.add('hidden');
      slackConnected.classList.remove('hidden');
    } else {
      slackAuthSection.classList.remove('hidden');
      slackConnected.classList.add('hidden');
    }
  }

  // Toggle button handlers
  slackToggle.addEventListener('click', showSlack);
  discordToggle.addEventListener('click', showDiscord);
  customToggle.addEventListener('click', showCustom);

  function showSlack() {
    slackToggle.classList.add('active');
    discordToggle.classList.remove('active');
    customToggle.classList.remove('active');
    slackSettings.classList.remove('hidden');
    discordSettings.classList.add('hidden');
    customSettings.classList.add('hidden');
  }

  function showDiscord() {
    discordToggle.classList.add('active');
    slackToggle.classList.remove('active');
    customToggle.classList.remove('active');
    discordSettings.classList.remove('hidden');
    slackSettings.classList.add('hidden');
    customSettings.classList.add('hidden');
  }

  function showCustom() {
    customToggle.classList.add('active');
    slackToggle.classList.remove('active');
    discordToggle.classList.remove('active');
    customSettings.classList.remove('hidden');
    slackSettings.classList.add('hidden');
    discordSettings.classList.add('hidden');
  }

  // Slack OAuth sign-in
  signinButton.addEventListener('click', function() {
    // UI Loading State
    const originalText = signinButton.innerHTML;
    signinButton.disabled = true;
    signinButton.textContent = 'Connecting...';
    showStatus('Opening Slack login window...', 'info');

    const redirectUrl = chrome.identity.getRedirectURL();
    console.log('Redirect URL:', redirectUrl); // Log for debugging/setup
    
    // Extract extension ID from redirect URL for the worker
    const extensionId = chrome.runtime.id;
    const authUrl = `https://right-click-send-to-phone.jatacid.workers.dev/install?extension_id=${extensionId}`;

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, function(redirect_url) {
      // Reset UI State
      signinButton.disabled = false;
      signinButton.innerHTML = originalText;

      if (chrome.runtime.lastError) {
        showStatus('Login failed: ' + chrome.runtime.lastError.message, 'error');
        return;
      }

      // Extract webhook from the redirect URL
      // Expected format: https://<app-id>.chromiumapp.org/provider_cb?webhook=...
      const url = new URL(redirect_url);
      const webhook = url.searchParams.get('webhook');

      if (webhook) {
        webhookInput.value = webhook;
        showSlack(); // Make sure Slack is selected
        updateSlackUI(true); // Show connected state
        chrome.storage.sync.set({
          service: 'slack',
          webhook: webhook
        }, function() {
          showStatus('Slack connected successfully!', 'success');
        });
      } else {
        showStatus('Failed to get webhook URL', 'error');
      }
    });
  });

  // Save settings
  saveButton.addEventListener('click', function() {
    const isSlack = slackToggle.classList.contains('active');
    const isDiscord = discordToggle.classList.contains('active');
    const isCustom = customToggle.classList.contains('active');
    
    let service;
    if (isSlack) service = 'slack';
    else if (isDiscord) service = 'discord';
    else if (isCustom) service = 'custom';
    
    const webhook = webhookInput.value.trim();
    const discordWebhook = discordWebhookInput.value.trim();
    const customWebhook = customWebhookInput.value.trim();

    // Validate that appropriate webhook is provided
    if (isSlack && !webhook) {
      showStatus('Please sign in with Slack', 'error');
      return;
    }
    if (isDiscord && !discordWebhook) {
      showStatus('Please provide a Discord webhook URL', 'error');
      return;
    }
    if (isCustom && !customWebhook) {
      showStatus('Please provide a custom webhook URL', 'error');
      return;
    }

    // Save to storage
    chrome.storage.sync.set({
      service: service,
      webhook: webhook,
      discordWebhook: discordWebhook,
      customWebhook: customWebhook
    }, function() {
      showStatus('Settings saved!', 'success');
    });
  });

  // Menu dropdown toggle
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    menuDropdown.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!menuDropdown.contains(e.target) && e.target !== menuBtn) {
      menuDropdown.classList.remove('show');
    }
  });

  // Clear all settings from menu
  clearSettingsMenu.addEventListener('click', function() {
    menuDropdown.classList.remove('show');
    confirmDialog.classList.remove('hidden');
  });

  // Confirm dialog - Yes button
  confirmYes.addEventListener('click', function() {
    confirmDialog.classList.add('hidden');
    
    // Clear all stored data
    chrome.storage.sync.clear(function() {
      // Reset UI
      webhookInput.value = '';
      discordWebhookInput.value = '';
      customWebhookInput.value = '';
      updateSlackUI(false); // Reset Slack UI to sign-in button
      slackToggle.classList.remove('active');
      discordToggle.classList.remove('active');
      customToggle.classList.remove('active');
      slackSettings.classList.add('hidden');
      discordSettings.classList.add('hidden');
      customSettings.classList.add('hidden');
      
      // Also clear localStorage (in case there's any OAuth data)
      localStorage.removeItem('slack_webhook_url');
      localStorage.removeItem('slack_auth_timestamp');
      
      showStatus('All settings cleared!', 'success');
    });
  });

  // Confirm dialog - No button
  confirmNo.addEventListener('click', function() {
    confirmDialog.classList.add('hidden');
  });

  // Helper function to show status messages
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message show';
    if (type === 'error') {
      statusMessage.style.background = '#f8d7da';
      statusMessage.style.color = '#721c24';
    } else {
      statusMessage.style.background = '#d4edda';
      statusMessage.style.color = '#155724';
    }
    setTimeout(() => {
      statusMessage.classList.remove('show');
    }, 3000);
  }

  // Listen for OAuth callback
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'slackAuthComplete' && request.webhook) {
      webhookInput.value = request.webhook;
      updateSlackUI(true);
      chrome.storage.sync.set({
        service: 'slack',
        webhook: request.webhook
      }, function() {
        showStatus('Slack connected successfully!', 'success');
      });
    }
  });
});
