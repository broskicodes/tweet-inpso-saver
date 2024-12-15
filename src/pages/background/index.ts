import { TwitterAuth } from '../../lib/twitterAuth';

const twitterAuth = new TwitterAuth({
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
  backendUrl: import.meta.env.VITE_API_URL
});

// Listen for OAuth callback
chrome.runtime.onMessageExternal.addListener(
  async (message, sender) => {
    if (message.type === 'oauth_callback') {
      try {
        const result = await twitterAuth.handleCallback(
          new URLSearchParams(message.payload)
        );
        console.log('OAuth callback result:', result);
        
        // Close the current tab
        if (sender.tab?.id) {
          chrome.tabs.remove(sender.tab.id);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
      }
    }
  }
);