# Chrome Web Store Submission Details for "Right Click Send to Phone"

## Extension Overview
- **Name**: Right Click Send to Phone
- **Version**: 1.0
- **Description**: Send text, links, and images from your browser directly to your phone via Slack or Discord.

## Store Listing Information

### Basic Information
- **Name**: Right Click Send to Phone
- **Short Description** (132 characters max):
  Send selected text, links, or page URLs to your phone instantly via Slack, Discord, or custom webhooks. Right-click and go!

- **Full Description**:
  Right Click Send to Phone is a Chrome extension that allows you to seamlessly send text, links, and images from your browser directly to your phone via Slack or Discord.

  **Features:**
  - Context Menu Integration: Simply right-click on any selected text, link, or image to send it.
  - Slack Integration: Connect your Slack workspace and send messages to your own private channel.
  - Discord Integration: Use a Discord Webhook to send content to a specific channel.
  - Phone Number Detection: Automatically detects phone numbers and creates clickable call links.
  - Quick & Easy: No need to open new tabs or copy-paste manually.

  **How it works:**
  1. Install the extension
  2. Configure your preferred service (Slack, Discord, or custom webhook)
  3. Right-click on any content in a webpage
  4. Select "Send Text to Phone" or "Send Page to Phone"
  5. Receive the content on your phone instantly

  **Privacy First:** We don't store your data. Everything is sent directly to your configured webhook.

- **Category**: Productivity
- **Language**: English

### Visual Assets
- **Icon (128x128)**: `docs/icon.png`
- **Small Promotional Tile (440x280)**: `docs/small_promo_tile.png`
- **Marquee Promotional Tile (1400x560)**: `docs/store_hero_notifications.png`
- **Screenshots** (at least 1, up to 5 - 1280x800 or 640x400):
  - Screenshot 1: Extension popup showing service selection
  - Screenshot 2: Right-click context menu
  - Screenshot 3: Slack configuration
  - Screenshot 4: Discord webhook setup
  - Screenshot 5: Phone number detection in action

### Links and Contact
- **Website URL**: https://jatacid.github.io/right-click-send-to-phone/
- **Support URL**: https://jatacid.github.io/right-click-send-to-phone/
- **Privacy Policy URL**: https://jatacid.github.io/right-click-send-to-phone/privacy.html
- **Developer Email**: [Your email address for support contact]

### Additional Information
- **Terms of Service URL**: (Optional) https://jatacid.github.io/right-click-send-to-phone/terms.html (if you create one)
- **Age Rating**: All ages
- **Regions**: All regions

## Extension Package
- **Package File**: `releases/right-click-send-to-phone-v1.0.zip`
- **Package Contents**: The zip contains the `rightClickSendToPhone/` directory with all extension files.

## Permissions Justification
The extension requests the following permissions, which are necessary for its functionality:

- `contextMenus`: Required to add "Send to Phone" options to the browser's right-click context menu.
- `storage`: Used to save user preferences and webhook URLs locally on the device.
- `activeTab`: Allows the extension to access the current tab when sending page information.
- `identity`: Required for OAuth authentication with Slack.
- `host_permissions` (`<all_urls>`): Needed to send data to user-configured webhook URLs, which can be on any domain.

## Pre-Submission Checklist
- [ ] Take screenshots of the extension in action
- [ ] Set up a developer account on the Chrome Web Store
- [ ] Test the extension thoroughly for any issues
- [ ] Ensure the OAuth setup for Slack is working properly
- [ ] Verify all URLs in the listing are accessible

## Upload Instructions

1. **Create a Developer Account**:
   - Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
   - Sign in with your Google account
   - Pay the one-time $5 developer registration fee
   - Accept the developer agreement

2. **Prepare Your Extension**:
   - Ensure your extension package is a ZIP file containing only the extension files (no root directory)
   - Test your extension locally in Chrome to ensure it works
   - Update version number if needed

3. **Upload Your Extension**:
   - Click "Add a new item" in the developer dashboard
   - Upload your ZIP file (`right-click-send-to-phone-v1.0.zip`)
   - Wait for the upload and initial validation to complete

4. **Fill Out Store Listing**:
   - Enter all the information from the "Store Listing Information" section above
   - Upload your icon, promotional images, and screenshots
   - Provide your privacy policy URL
   - Add your developer email for support

5. **Review and Publish**:
   - Review all information for accuracy
   - Submit for review
   - Wait for Google to review your extension (usually 1-2 weeks)
   - Once approved, publish to the store

## Notes
- The extension uses Manifest V3, which is required for new extensions
- Make sure your OAuth redirect URLs are properly configured for Slack integration
- The privacy policy clearly states that no user data is collected by the extension itself
- All third-party integrations (Slack, Discord) are handled directly between the user's browser and those services