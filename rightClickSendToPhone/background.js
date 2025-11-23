// Remove any existing context menu items first to prevent duplicates
chrome.contextMenus.removeAll(() => {
  // Create two context menu items - one for text selection, one for page
  chrome.contextMenus.create({
    id: "sendTextToPhone",
    title: "Send Text to Phone",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "sendPageToPhone",
    title: "Send Page to Phone",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "sendTextToPhone" || info.menuItemId === "sendPageToPhone") {
    chrome.storage.sync.get(['service', 'webhook', 'discordWebhook', 'customWebhook'], function(result) {
      const service = result.service;
      let webhookUrl;

      if (service === 'slack') {
        webhookUrl = result.webhook;
      } else if (service === 'discord') {
        webhookUrl = result.discordWebhook;
      } else if (service === 'custom') {
        webhookUrl = result.customWebhook;
      }

      if (!webhookUrl || !service) {
        console.log('No service configured, opening popup for setup');
        // Open the popup to prompt user to configure
        chrome.action.openPopup();
        return;
      }

      let contentToSend;
      
      // Determine what to send based on which menu item was clicked
      if (info.menuItemId === "sendTextToPhone") {
        contentToSend = info.selectionText;
      } else {
        // Send page URL with title
        contentToSend = `${tab.title}\n${tab.url}`;
      }

      const phoneNumberRegex = /^\+?[0-9\s.\-()]{6,}$/;
      let bodyContent;

      if (service === 'slack') {
        // Check if it's a phone number (only for text selection)
        if (info.menuItemId === "sendTextToPhone" && phoneNumberRegex.test(contentToSend)) {
          let phoneNumber = contentToSend.replace(/\D/g, '');
          const markdownLink = `<tel://${phoneNumber}|Click to call ${phoneNumber}>`;
          bodyContent = { text: markdownLink };
        } else {
          bodyContent = { text: contentToSend };
        }
      } else if (service === 'discord') {
        // Check if it's a phone number (only for text selection)
        if (info.menuItemId === "sendTextToPhone" && phoneNumberRegex.test(contentToSend)) {
          let phoneNumber = contentToSend.replace(/\D/g, '');
          const markdownLink = `[Click to call ${phoneNumber}](tel://${phoneNumber})`;
          bodyContent = { content: markdownLink };
        } else {
          bodyContent = { content: contentToSend };
        }
      } else if (service === 'custom') {
        // For custom webhooks, try both 'text' and 'content' fields
        if (info.menuItemId === "sendTextToPhone" && phoneNumberRegex.test(contentToSend)) {
          let phoneNumber = contentToSend.replace(/\D/g, '');
          bodyContent = { text: `tel://${phoneNumber}`, content: `tel://${phoneNumber}` };
        } else {
          bodyContent = { text: contentToSend, content: contentToSend };
        }
      }

      console.log(`Sending to ${service}:`, webhookUrl);
      
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyContent)
      })
      .then(() => {
        console.log(`Successfully sent to ${service}`);
      })
      .catch(err => {
        console.error(`Error sending to ${service}:`, err);
        console.error(`Webhook URL: ${webhookUrl}`);
        console.error(`Body content:`, bodyContent);
      });
    });
  }
});
