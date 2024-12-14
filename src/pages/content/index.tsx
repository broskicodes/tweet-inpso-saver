import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './style.css'
import { Save } from 'lucide-react'
import React from 'react'

function SaveButton() {
  const [showAbove, setShowAbove] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const updatePosition = () => {
      const rect = button.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < 40;
      
      setShowAbove(showAbove);
      setTooltipPosition({
        top: showAbove ? rect.top - 24 : rect.bottom + 4,
        left: rect.left + rect.width / 2
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return (
    <>
      <button 
        ref={buttonRef}
        className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-900 group relative"
        onClick={() => console.log('Saved!')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Save 
          size={18} 
          strokeWidth={2}
          className="group-hover:stroke-[#1d9bf0] text-gray-500" 
        />
      </button>
      {showTooltip && createPortal(
        <span 
          className="tooltip-enter fixed bg-gray-600/90 text-white text-xs rounded-sm px-1 py-0.5 -translate-x-1/2 whitespace-nowrap"
          style={{ 
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          Save to Tweet Maestro
        </span>,
        document.body
      )}
    </>
  );
}

function injectButtonIntoTweet(tweetElement: Element) {
  if (tweetElement.querySelector('.our-injected-button')) return;
  
  const actionBar = tweetElement.querySelector('[role="group"]');
  if (!actionBar) return;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'our-injected-button';
  actionBar.appendChild(buttonContainer);
  
  const root = createRoot(buttonContainer);
  root.render(<SaveButton />);
}

// Initialize observer to watch for new tweets
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        // Look for tweets in the added element and its children
        const tweets = node.querySelectorAll('article[data-testid="tweet"]');
        tweets.forEach(tweet => injectButtonIntoTweet(tweet));
      }
    });
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle existing tweets
document.querySelectorAll('article[data-testid="tweet"]')
  .forEach(tweet => injectButtonIntoTweet(tweet));

console.log('Tweet button injector loaded');
