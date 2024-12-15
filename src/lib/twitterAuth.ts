import { v4 as uuidv4 } from 'uuid';

interface TwitterAuthConfig {
    clientId: string;
    backendUrl: string;
}

export class TwitterAuth {
    private config: TwitterAuthConfig;
  
    constructor(config: TwitterAuthConfig) {
      this.config = config;
    }
  
    /**
     * Initiates the Twitter OAuth flow via backend
     */
    async initiateOAuth() {
      const state = uuidv4(); // CSRF protection
      
      // Store state in extension storage for verification
      await chrome.storage.local.set({ oauth_state: state });

      const authUrl = `${this.config.backendUrl}/auth/twitter/login?state=${state}`;
      
      // Open authorization in a new tab
      chrome.tabs.create({ url: authUrl });
    }  

    async handleCallback(params: URLSearchParams) {
      // Verify state to prevent CSRF
      const storedState = await chrome.storage.local.get('oauth_state');
      const returnedState = params.get('state');

      if (storedState.oauth_state !== returnedState) {
        throw new Error('Invalid state parameter');
      }

      // Clear stored state
      await chrome.storage.local.remove('oauth_state');

      // Get tokens from params
      const userId = params.get('user_id');

      if (!userId) {
        throw new Error('Missing user_id in callback');
      }

      // Store tokens
      await chrome.storage.local.set({
        is_authenticated: true,
        user_id: userId
      });

      return { userId };
    }
}