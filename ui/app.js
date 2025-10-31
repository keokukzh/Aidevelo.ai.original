/**
 * AIDEVELO.AI - Enhanced Frontend Application
 * Modern chat interface with onboarding, guides, and rich interactions
 */

// Configuration
const CONFIG = {
  backendBase: window.location.origin,
  maxMessageLength: 2000,
  typingDelay: 1000,
  pollInterval: 1000,
  animationDuration: 300
};

// State management
const AppState = {
  currentRunId: null,
  isTyping: false,
  sidebarOpen: false,
  onboardingStep: 0,
  messageHistory: [],
  isConnected: true
};

// DOM elements
const elements = {
  // Chat elements
  chatMessages: document.getElementById('chat-messages'),
  promptInput: document.getElementById('prompt-input'),
  sendBtn: document.getElementById('send-btn'),
  typingIndicator: document.getElementById('typing-indicator'),
  
  // Status elements
  status: document.getElementById('status'),
  runId: document.getElementById('runId'),
  queueStatus: document.getElementById('queue-status'),
  modelStatus: document.getElementById('model-status'),
  
  // Sidebar elements
  sidebar: document.getElementById('sidebar'),
  helpBtn: document.getElementById('help-btn'),
  closeSidebar: document.getElementById('close-sidebar'),
  
  // Onboarding elements
  onboardingOverlay: document.getElementById('onboarding-overlay'),
  tutorialStep: document.getElementById('tutorial-step'),
  prevStep: document.getElementById('prev-step'),
  nextStep: document.getElementById('next-step'),
  skipTutorial: document.getElementById('skip-tutorial'),
  
  // Other elements
  fileInput: document.getElementById('file-input'),
  attachFile: document.getElementById('attach-file'),
  toastContainer: document.getElementById('toast-container'),
  quickActionBtns: document.querySelectorAll('.quick-action-btn'),
  guideBtns: document.querySelectorAll('.guide-btn')
};

// Utility functions
const utils = {
  // HTTP requests
  async postJSON(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  },

  async getJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  },

  // DOM utilities
  setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  },

  showElement(element) {
    if (element) {
      element.classList.remove('hidden');
      element.classList.add('fade-in');
    }
  },

  hideElement(element) {
    if (element) {
      element.classList.add('hidden');
      element.classList.remove('fade-in');
    }
  },

  // Animation utilities
  animateElement(element, animationClass, duration = CONFIG.animationDuration) {
    if (!element) return;
    
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  },

  // Message formatting
  formatMessage(content) {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  },

  // Code syntax highlighting (basic)
  highlightCode(code, language = 'javascript') {
    // Simple syntax highlighting for common languages
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'try', 'except'],
      html: ['html', 'head', 'body', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'class', 'id'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'flex', 'grid']
    };

    let highlighted = code;
    if (keywords[language]) {
      keywords[language].forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
      });
    }

    return highlighted;
  },

  // Toast notifications
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, duration);
  },

  // Local storage
  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  },

  loadFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return defaultValue;
    }
  }
};

// Chat functionality
const ChatManager = {
  // Add message to chat
  addMessage(content, type = 'assistant', isStreaming = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (type === 'user') {
      messageContent.innerHTML = utils.formatMessage(content);
    } else {
      messageContent.innerHTML = utils.formatMessage(content);
    }
    
    messageDiv.appendChild(messageContent);
    elements.chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    
    // Add to history
    AppState.messageHistory.push({ content, type, timestamp: Date.now() });
    
    // Animate message
    utils.animateElement(messageDiv, 'fade-in');
    
    return messageDiv;
  },

  // Update last message (for streaming)
  updateLastMessage(content) {
    const messages = elements.chatMessages.querySelectorAll('.message.assistant');
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const contentDiv = lastMessage.querySelector('.message-content');
      if (contentDiv) {
        contentDiv.innerHTML = utils.formatMessage(content);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
      }
    }
  },

  // Clear chat
  clearChat() {
    elements.chatMessages.innerHTML = `
      <div class="welcome-message">
        <div class="message-content">
          <h3>Welcome to AIDEVELO.AI! 🚀</h3>
          <p>I'm your AI development assistant. I can help you build, debug, and deploy applications.</p>
          <div class="quick-actions">
            <button class="quick-action-btn" data-prompt="Create a simple React component">
              React Component
            </button>
            <button class="quick-action-btn" data-prompt="Build a REST API with Node.js">
              REST API
            </button>
            <button class="quick-action-btn" data-prompt="Create a Python web scraper">
              Web Scraper
            </button>
          </div>
        </div>
      </div>
    `;
    AppState.messageHistory = [];
    AppState.currentRunId = null;
    utils.setText('runId', '-');
    utils.setText('status', 'Ready');
  },

  // Show typing indicator
  showTyping() {
    if (!AppState.isTyping) {
      AppState.isTyping = true;
      utils.showElement(elements.typingIndicator);
    }
  },

  // Hide typing indicator
  hideTyping() {
    if (AppState.isTyping) {
      AppState.isTyping = false;
      utils.hideElement(elements.typingIndicator);
    }
  }
};

// Onboarding system
const OnboardingManager = {
  steps: [
    {
      title: "Welcome to AIDEVELO.AI!",
      content: `
        <p>I'm your AI development assistant. I can help you build, debug, and deploy applications.</p>
        <p>Let me show you around the interface in just a few steps.</p>
      `,
      highlight: null
    },
    {
      title: "Chat Interface",
      content: `
        <p>This is where you'll interact with me. Type your requests and I'll help you build amazing projects.</p>
        <p>Try asking me to create a simple web page or build an API!</p>
      `,
      highlight: '.chat-container'
    },
    {
      title: "Quick Actions",
      content: `
        <p>Use these quick action buttons to get started with common tasks.</p>
        <p>Click any button to automatically insert a prompt into the chat.</p>
      `,
      highlight: '.quick-actions'
    },
    {
      title: "Guides & Help",
      content: `
        <p>Click the help button to access guides, examples, and documentation.</p>
        <p>You can also use keyboard shortcuts for faster navigation.</p>
      `,
      highlight: '#help-btn'
    },
    {
      title: "You're All Set!",
      content: `
        <p>You're ready to start building with AIDEVELO.AI!</p>
        <p>Remember: I'm here to help you create amazing applications. Don't hesitate to ask questions!</p>
      `,
      highlight: null
    }
  ],

  init() {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = utils.loadFromStorage('onboarding_completed', false);
    if (!hasCompletedOnboarding) {
      this.show();
    }
  },

  show() {
    utils.showElement(elements.onboardingOverlay);
    this.updateStep();
  },

  hide() {
    utils.hideElement(elements.onboardingOverlay);
    utils.saveToStorage('onboarding_completed', true);
  },

  updateStep() {
    const step = this.steps[AppState.onboardingStep];
    if (!step) return;

    elements.tutorialStep.innerHTML = `
      <h3>${step.title}</h3>
      <div>${step.content}</div>
    `;

    // Update progress dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === AppState.onboardingStep);
    });

    // Update navigation buttons
    elements.prevStep.disabled = AppState.onboardingStep === 0;
    elements.nextStep.textContent = AppState.onboardingStep === this.steps.length - 1 ? 'Finish' : 'Next';
  },

  nextStep() {
    if (AppState.onboardingStep < this.steps.length - 1) {
      AppState.onboardingStep++;
      this.updateStep();
    } else {
      this.hide();
    }
  },

  prevStep() {
    if (AppState.onboardingStep > 0) {
      AppState.onboardingStep--;
      this.updateStep();
    }
  }
};

// Sidebar management
const SidebarManager = {
  toggle() {
    AppState.sidebarOpen = !AppState.sidebarOpen;
    elements.sidebar.classList.toggle('open', AppState.sidebarOpen);
    
    if (AppState.sidebarOpen) {
      utils.animateElement(elements.sidebar, 'slide-in-right');
    }
  },

  close() {
    AppState.sidebarOpen = false;
    elements.sidebar.classList.remove('open');
  },

  init() {
    // Add guide button click handlers
    elements.guideBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = e.target.dataset.example;
        this.insertExample(example);
        this.close();
      });
    });
  },

  insertExample(exampleType) {
    const examples = {
      'hello-world': 'Create a simple "Hello World" web page with HTML, CSS, and JavaScript',
      'web-app': 'Build a modern web application with React, including components, state management, and styling',
      'api': 'Create a REST API with Node.js and Express, including CRUD operations and database integration',
      'clean-code': 'Show me best practices for writing clean, maintainable code with examples',
      'testing': 'Help me set up unit testing and integration testing for my project'
    };

    const prompt = examples[exampleType];
    if (prompt) {
      elements.promptInput.value = prompt;
      elements.promptInput.focus();
      this.updateSendButton();
    }
  }
};

// Main application logic
const App = {
  async init() {
    console.log('Initializing AIDEVELO.AI...');
    
    // Initialize components
    OnboardingManager.init();
    SidebarManager.init();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    
    // Check backend connection
    await this.checkConnection();
    
    // Start periodic status updates
    this.startStatusUpdates();
    
    console.log('AIDEVELO.AI initialized successfully!');
  },

  setupEventListeners() {
    // Send button
    elements.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Input handling
    elements.promptInput.addEventListener('input', () => this.updateSendButton());
    elements.promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // File attachment
    elements.attachFile.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    
    // Sidebar controls
    elements.helpBtn.addEventListener('click', () => SidebarManager.toggle());
    elements.closeSidebar.addEventListener('click', () => SidebarManager.close());
    
    // Onboarding controls
    elements.nextStep.addEventListener('click', () => OnboardingManager.nextStep());
    elements.prevStep.addEventListener('click', () => OnboardingManager.prevStep());
    elements.skipTutorial.addEventListener('click', () => OnboardingManager.hide());
    
    // Quick action buttons
    elements.quickActionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prompt = e.target.dataset.prompt;
        if (prompt) {
          elements.promptInput.value = prompt;
          elements.promptInput.focus();
          this.updateSendButton();
        }
      });
    });
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + / to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        SidebarManager.toggle();
      }
      
      // Ctrl/Cmd + K to clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.clearChat();
      }
    });
  },

  updateSendButton() {
    const hasText = elements.promptInput.value.trim().length > 0;
    elements.sendBtn.disabled = !hasText;
    
    // Update character count
    const charCount = elements.promptInput.value.length;
    const charCountElement = document.querySelector('.char-count');
    if (charCountElement) {
      charCountElement.textContent = `${charCount}/${CONFIG.maxMessageLength}`;
    }
  },

  async sendMessage() {
    const prompt = elements.promptInput.value.trim();
    if (!prompt || AppState.isTyping) return;

    // Add user message
    ChatManager.addMessage(prompt, 'user');
    
    // Clear input
    elements.promptInput.value = '';
    this.updateSendButton();
    
    // Show typing indicator
    ChatManager.showTyping();
    
    try {
      // Send to backend
      const response = await utils.postJSON(`${CONFIG.backendBase}/build`, { prompt });
      AppState.currentRunId = response.run_id;
      
      // Update status
      utils.setText('runId', response.run_id);
      utils.setText('status', 'Processing...');
      
      // Start polling for updates
      this.pollRunStatus(response.run_id);
      
    } catch (error) {
      console.error('Error sending message:', error);
      ChatManager.hideTyping();
      utils.showToast('Failed to send message. Please try again.', 'error');
      utils.setText('status', 'Error');
    }
  },

  async pollRunStatus(runId) {
    try {
      const status = await utils.getJSON(`${CONFIG.backendBase}/runs/${runId}`);
      
      // Update status display
      utils.setText('status', status.status);
      
      // Get logs and diffs
      const diffs = await utils.getJSON(`${CONFIG.backendBase}/runs/${runId}/diffs`);
      
      // Update chat with AI response
      if (status.logs && status.logs.length > 0) {
        const lastLog = status.logs[status.logs.length - 1];
        ChatManager.updateLastMessage(lastLog);
      }
      
      // Continue polling if still processing
      if (status.status === 'queued' || status.status === 'running') {
        setTimeout(() => this.pollRunStatus(runId), CONFIG.pollInterval);
      } else {
        ChatManager.hideTyping();
        utils.setText('status', 'Completed');
        
        if (status.status === 'completed') {
          utils.showToast('Build completed successfully!', 'success');
        } else if (status.status === 'failed') {
          utils.showToast('Build failed. Check the logs for details.', 'error');
        }
      }
      
    } catch (error) {
      console.error('Error polling run status:', error);
      ChatManager.hideTyping();
      utils.showToast('Connection error. Retrying...', 'error');
      setTimeout(() => this.pollRunStatus(runId), CONFIG.pollInterval * 2);
    }
  },

  async checkConnection() {
    try {
      const health = await utils.getJSON(`${CONFIG.backendBase}/health`);
      AppState.isConnected = health.status === 'ok';
      utils.setText('modelStatus', AppState.isConnected ? 'Connected' : 'Disconnected');
    } catch (error) {
      console.error('Backend connection failed:', error);
      AppState.isConnected = false;
      utils.setText('modelStatus', 'Disconnected');
      utils.showToast('Backend connection failed. Some features may not work.', 'error');
    }
  },

  startStatusUpdates() {
    // Update status every 30 seconds
    setInterval(() => {
      this.checkConnection();
    }, 30000);
  },

  clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      ChatManager.clearChat();
      utils.showToast('Chat cleared', 'info');
    }
  },

  handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        utils.showToast(`File ${file.name} is too large (max 10MB)`, 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const message = `File: ${file.name}\n\n${content}`;
        elements.promptInput.value = message;
        this.updateSendButton();
      };
      reader.readAsText(file);
    });
    
    // Reset file input
    event.target.value = '';
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for global access
window.AIDEVELO = {
  App,
  ChatManager,
  OnboardingManager,
  SidebarManager,
  utils
};