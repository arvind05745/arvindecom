/**
 * Main Application Module
 * Coordinates all modules and handles global functionality
 */

class App {
  constructor() {
    this.isInitialized = false;
    this.modules = {};
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupGlobalErrorHandling();
    this.loadExternalContent();
    this.initializeCanonicalLink();
    this.bindGlobalEvents();
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMReady();
      });
    } else {
      this.onDOMReady();
    }
  }

  /**
   * Handle when DOM is ready
   */
  onDOMReady() {
    this.isInitialized = true;
    this.initializeModules();
    this.setupAccessibility();
    console.log('App initialized successfully');
  }

  /**
   * Setup global error handling
   */
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error, 'Global Error');
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, 'Promise Rejection');
    });
  }

  /**
   * Handle errors gracefully
   */
  handleError(error, context = 'Unknown') {
    // Log error for debugging
    console.error(`[${context}]:`, error);

    // Show user-friendly message for critical errors
    if (this.isCriticalError(error)) {
      this.showErrorNotification('Something went wrong. Please refresh the page.');
    }
  }

  /**
   * Check if error is critical
   */
  isCriticalError(error) {
    const criticalPatterns = [
      /network/i,
      /fetch/i,
      /load/i,
      /script/i
    ];

    const errorMessage = error?.message || error?.toString() || '';
    return criticalPatterns.some(pattern => pattern.test(errorMessage));
  }

  /**
   * Show error notification to user
   */
  showErrorNotification(message) {
    // Create a simple toast notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  /**
   * Initialize all modules
   */
  initializeModules() {
    try {
      // Modules are initialized in their own files via DOMContentLoaded
      // This is just a placeholder for any additional coordination needed
      console.log('All modules initialized');
    } catch (error) {
      this.handleError(error, 'Module Initialization');
    }
  }

  /**
   * Load external content (header, footer)
   */
  loadExternalContent() {
    this.loadHeader();
    this.loadFooter();
  }

  /**
   * Load header content
   */
  async loadHeader() {
    try {
      const response = await fetch('/header.html');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      const headerPlaceholder = document.getElementById('header-placeholder');
      
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = html;
      }
    } catch (error) {
      console.warn('Failed to load header:', error);
      // Fail silently for external content
    }
  }

  /**
   * Load footer content
   */
  async loadFooter() {
    try {
      const response = await fetch('/footer.html');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      const footerPlaceholder = document.getElementById('footer-placeholder');
      
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = html;
      }
    } catch (error) {
      console.warn('Failed to load footer:', error);
      // Fail silently for external content
    }
  }

  /**
   * Initialize canonical link
   */
  initializeCanonicalLink() {
    const canonicalLink = document.getElementById('canonical-link');
    if (canonicalLink) {
      canonicalLink.href = window.location.href;
    }
  }

  /**
   * Bind global event listeners
   */
  bindGlobalEvents() {
    // Handle escape key for closing modals/dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });

    // Handle window resize for responsive updates
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleWindowResize();
      }, 250);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Handle escape key press
   */
  handleEscapeKey() {
    // Close any open dropdowns
    const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
    openDropdowns.forEach(element => {
      if (element.hasAttribute('aria-controls')) {
        const controlsId = element.getAttribute('aria-controls');
        const controlled = document.getElementById(controlsId);
        if (controlled) {
          controlled.classList.add('hidden');
          element.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close category dropdown specifically
    const categoryDropdown = document.getElementById('category-dropdown-list');
    if (categoryDropdown && !categoryDropdown.classList.contains('hidden')) {
      categoryDropdown.classList.add('hidden');
      const button = document.getElementById('category-dropdown-btn');
      if (button) {
        button.setAttribute('aria-expanded', 'false');
        button.focus();
      }
    }
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    // Trigger any responsive updates needed
    const event = new CustomEvent('app:resize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle page visibility changes
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - could pause any animations or polling
      console.log('Page hidden');
    } else {
      // Page is visible - could resume activities
      console.log('Page visible');
    }
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link if not present
    this.addSkipLink();
    
    // Ensure proper focus management
    this.setupFocusManagement();
    
    // Add ARIA live regions for dynamic content
    this.addLiveRegions();
  }

  /**
   * Add skip navigation link
   */
  addSkipLink() {
    const existingSkipLink = document.querySelector('.skip-link');
    if (existingSkipLink) return;

    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure buttons have visible focus indicators
    const buttons = document.querySelectorAll('button:not([class*="focus:"])');
    buttons.forEach(button => {
      if (!button.className.includes('focus:')) {
        button.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-400');
      }
    });

    // Trap focus in modals when they're open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  /**
   * Handle tab navigation for focus trapping
   */
  handleTabNavigation(e) {
    // This would be expanded to handle modal focus trapping
    // For now, just ensure basic tab navigation works
  }

  /**
   * Add ARIA live regions for dynamic content
   */
  addLiveRegions() {
    // Add live region for announcements
    if (!document.getElementById('announcements')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message) {
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcements.textContent = '';
      }, 1000);
    }
  }

  /**
   * Get app configuration
   */
  getConfig() {
    return {
      version: '1.0.0',
      initialized: this.isInitialized,
      modules: Object.keys(this.modules)
    };
  }
}

// Initialize the application
const app = new App();

// Expose app globally for debugging
window.app = app;