/**
 * FAQ Manager Module
 * Handles FAQ functionality including rendering, interaction, and accessibility
 */

class FAQManager {
  constructor() {
    this.openFAQ = null;
    this.init();
  }

  /**
   * Initialize the FAQ manager
   */
  init() {
    this.renderFAQs();
    this.bindEvents();
  }

  /**
   * Render FAQ items from data
   */
  renderFAQs() {
    const container = document.getElementById('faq-container');
    if (!container || !faqData) return;

    container.innerHTML = '';

    faqData.forEach((faq, index) => {
      const faqItem = this.createFAQItem(faq, index);
      container.appendChild(faqItem);
    });

    // Set first FAQ as open by default
    if (faqData.length > 0) {
      const firstFAQ = container.querySelector('.faq-item');
      this.openFAQItem(firstFAQ);
    }
  }

  /**
   * Create a single FAQ item element
   */
  createFAQItem(faq, index) {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item mb-3 border border-transparent rounded-lg';
    faqItem.setAttribute('data-faq-index', index);

    const questionId = `faq-question-${index}`;
    const answerId = `faq-answer-${index}`;

    faqItem.innerHTML = `
      <button
        class="faq-question w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg transition-all"
        id="${questionId}"
        aria-expanded="${faq.isOpen}"
        aria-controls="${answerId}"
        type="button"
      >
        <span class="text-[#204085] text-sm md:text-base font-medium pr-4">
          ${faq.question}
        </span>
        <span class="faq-icon text-[#204085] text-xl flex-shrink-0" aria-hidden="true">
          ${faq.isOpen ? '×' : '+'}
        </span>
      </button>
      <div 
        class="faq-answer px-4 pb-4 ${faq.isOpen ? '' : 'hidden'}" 
        id="${answerId}"
        aria-labelledby="${questionId}"
        role="region"
      >
        <div class="text-sm md:text-base text-gray-600 leading-relaxed">
          ${faq.answer}
        </div>
      </div>
    `;

    // Set initial state
    if (faq.isOpen) {
      faqItem.classList.add('border-gray-200', 'shadow-md');
    }

    return faqItem;
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    // Use event delegation for better performance
    container.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const faqItem = question.closest('.faq-item');
      this.toggleFAQ(faqItem);
    });

    // Keyboard support
    container.addEventListener('keydown', (e) => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const faqItem = question.closest('.faq-item');
        this.toggleFAQ(faqItem);
      }
    });
  }

  /**
   * Toggle FAQ item open/closed
   */
  toggleFAQ(faqItem) {
    if (!faqItem) return;

    const isCurrentlyOpen = this.openFAQ === faqItem;
    
    // Close any open FAQ
    if (this.openFAQ && this.openFAQ !== faqItem) {
      this.closeFAQItem(this.openFAQ);
    }

    // Toggle current FAQ
    if (isCurrentlyOpen) {
      this.closeFAQItem(faqItem);
      this.openFAQ = null;
    } else {
      this.openFAQItem(faqItem);
      this.openFAQ = faqItem;
    }
  }

  /**
   * Open a specific FAQ item
   */
  openFAQItem(faqItem) {
    if (!faqItem) return;

    const question = faqItem.querySelector('.faq-question');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');

    if (!question || !answer || !icon) return;

    // Update visual state
    answer.classList.remove('hidden');
    faqItem.classList.add('border-gray-200', 'shadow-md');
    icon.textContent = '×';
    
    // Update accessibility attributes
    question.setAttribute('aria-expanded', 'true');

    // Smooth scroll to FAQ if it's not in view
    this.scrollToFAQIfNeeded(faqItem);
  }

  /**
   * Close a specific FAQ item
   */
  closeFAQItem(faqItem) {
    if (!faqItem) return;

    const question = faqItem.querySelector('.faq-question');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');

    if (!question || !answer || !icon) return;

    // Update visual state
    answer.classList.add('hidden');
    faqItem.classList.remove('border-gray-200', 'shadow-md');
    icon.textContent = '+';
    
    // Update accessibility attributes
    question.setAttribute('aria-expanded', 'false');
  }

  /**
   * Scroll to FAQ if it's not in view
   */
  scrollToFAQIfNeeded(faqItem) {
    const rect = faqItem.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isInView) {
      faqItem.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }

  /**
   * Open FAQ by index
   */
  openFAQByIndex(index) {
    const container = document.getElementById('faq-container');
    if (!container) return;

    const faqItem = container.querySelector(`[data-faq-index="${index}"]`);
    if (faqItem) {
      this.toggleFAQ(faqItem);
    }
  }

  /**
   * Close all FAQs
   */
  closeAllFAQs() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    const faqItems = container.querySelectorAll('.faq-item');
    faqItems.forEach(item => this.closeFAQItem(item));
    this.openFAQ = null;
  }

  /**
   * Get currently open FAQ index
   */
  getCurrentlyOpenIndex() {
    if (!this.openFAQ) return -1;
    return parseInt(this.openFAQ.getAttribute('data-faq-index')) || -1;
  }
}

// Initialize FAQ manager when DOM is loaded
let faqManager;
document.addEventListener('DOMContentLoaded', () => {
  faqManager = new FAQManager();
});