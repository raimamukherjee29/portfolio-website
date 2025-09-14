const filter_btns = document.querySelectorAll(".filter-btn");
const skills_wrap = document.querySelector(".skills");
const skills_bars = document.querySelectorAll(".skill-progress");
const records_wrap = document.querySelector(".records");
const records_numbers = document.querySelectorAll(".number");
const footer_input = document.querySelector(".footer-input");
const hamburger_menu = document.querySelector(".hamburger-menu");
const navbar = document.querySelector("header nav");
const links = document.querySelectorAll(".links a");

footer_input.addEventListener("focus", () => {
  footer_input.classList.add("focus");
});

footer_input.addEventListener("blur", () => {
  if (footer_input.value != "") return;
  footer_input.classList.remove("focus");
});

function closeMenu() {
  navbar.classList.remove("open");
  document.body.classList.remove("stop-scrolling");
}

hamburger_menu.addEventListener("click", () => {
  if (!navbar.classList.contains("open")) {
    navbar.classList.add("open");
    document.body.classList.add("stop-scrolling");
  } else {
    closeMenu();
  }
});

links.forEach((link) => link.addEventListener("click", () => closeMenu()));

filter_btns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filter_btns.forEach((button) => button.classList.remove("active"));
    btn.classList.add("active");

    let filterValue = btn.dataset.filter;

    $(".grid").isotope({ filter: filterValue });
  })
);

$(".grid").isotope({
  itemSelector: ".grid-item",
  layoutMode: "fitRows",
  transitionDuration: "0.6s",
});

window.addEventListener("scroll", () => {
  skillsEffect();
  countUp();
});

function checkScroll(el) {
  let rect = el.getBoundingClientRect();
  if (window.innerHeight >= rect.top + el.offsetHeight) return true;
  return false;
}

function skillsEffect() {
  if (!checkScroll(skills_wrap)) return;
  skills_bars.forEach((skill) => (skill.style.width = skill.dataset.progress));
}

function countUp() {
  if (!checkScroll(records_wrap)) return;
  records_numbers.forEach((numb) => {
    const updateCount = () => {
      let currentNum = +numb.innerText;
      let maxNum = +numb.dataset.num;
      let speed = 100;
      const increment = Math.ceil(maxNum / speed);

      if (currentNum < maxNum) {
        numb.innerText = currentNum + increment;
        setTimeout(updateCount, 1);
      } else {
        numb.innerText = maxNum;
      }
    };

    setTimeout(updateCount, 400);
  });
}

var mySwiper = new Swiper(".swiper-container", {
  speed: 1100,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 5000,
  },
  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

// Timeline Animation on Scroll
function animateTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineLine = document.getElementById('timeline-line');
  
  console.log('Timeline elements found:', timelineItems.length, timelineLine);
  
  if (!timelineItems.length || !timelineLine) {
    console.log('Timeline elements not found');
    return;
  }

  // Set initial height to make line visible
  timelineLine.style.height = '0px';
  console.log('Initial timeline line height set');

  let lastScrollTop = 0;

  // Hide all timeline items initially
  timelineItems.forEach(item => {
    item.classList.remove('animate');
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
  });

  // Animate timeline line on scroll with dot-based visibility
  function updateTimelineLine() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) {
      console.log('Timeline container not found');
      return;
    }

    const containerRect = timelineContainer.getBoundingClientRect();
    const containerTop = containerRect.top + window.pageYOffset;
    const containerHeight = containerRect.height;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress
    const containerBottom = containerTop + containerHeight;
    const viewportBottom = scrollTop + windowHeight;
    
    let scrollProgress = 0;

    if (viewportBottom > containerTop) {
      const scrolledDistance = viewportBottom - containerTop;
      const totalDistance = containerHeight + windowHeight * 0.7;
      scrollProgress = Math.min(1, Math.max(0, scrolledDistance / totalDistance));
    }

    // Update timeline line height
    const currentHeight = scrollProgress * containerHeight;
    timelineLine.style.height = `${currentHeight}px`;
    
    // Check each timeline item and show only if line has reached its dot
    timelineItems.forEach((item, index) => {
      const dot = item.querySelector('.timeline-dot');
      if (!dot) return;

      // Get dot position relative to timeline container
      const itemRect = item.getBoundingClientRect();
      const itemTop = itemRect.top + window.pageYOffset;
      const dotOffset = itemTop - containerTop + 32; // 32px is approximate dot position from item top

      // Show item only if timeline line has reached or passed the dot
      if (currentHeight >= dotOffset) {
        item.classList.add('animate');
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        
        // Add glow effect to dot when reached
        dot.style.transform = 'translateX(-50%) scale(1.2)';
        dot.style.boxShadow = '0 0 30px rgba(120, 76, 251, 0.5)';
      } else {
        // Hide item if line hasn't reached it yet or scrolled back up
        item.classList.remove('animate');
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        // Reset dot appearance
        dot.style.transform = 'translateX(-50%) scale(1)';
        dot.style.boxShadow = '0 0 20px rgba(120, 76, 251, 0.3)';
      }
    });
    
    console.log('Scroll progress:', scrollProgress, 'Height:', currentHeight);
    
    // Add animate class when visible
    if (scrollProgress > 0) {
      timelineLine.classList.add('animate');
    } else {
      timelineLine.classList.remove('animate');
    }

    lastScrollTop = scrollTop;
  }

  window.addEventListener('scroll', updateTimelineLine);
  updateTimelineLine(); // Initial call
}

// Initialize timeline animation when DOM is loaded
document.addEventListener('DOMContentLoaded', animateTimeline);

// Chatbot Functionality
class PortfolioChatbot {
  constructor() {
    this.chatbotContainer = document.querySelector('.chatbot-container');
    this.chatbotIcon = document.getElementById('chatbot-icon');
    this.chatbotWindow = document.getElementById('chatbot-window');
    this.chatbotClose = document.getElementById('chatbot-close');
    this.chatbotBody = document.getElementById('chatbot-body');
    
    this.isOpen = false;
    this.currentDirectory = 'home'; // 'home' or 'portfolio'
    this.currentInput = '';
    this.inputLine = null;
    this.cursorPosition = 0;
    this.commandHistory = [];
    this.historyIndex = -1;
    
    this.homeCommands = {
      'cd Portfolio': {
        output: `Navigating to Portfolio directory...`,
        type: 'success',
        action: 'changeDirectory'
      },
      'cd ..': {
        output: `You are already in the home directory.`,
        type: 'error'
      },
      'ls': {
        output: `Portfolio/`,
        type: 'success'
      },
      'ls -la': {
        output: `Portfolio/

💡 Next step: <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> to explore my portfolio`,
        type: 'success'
      },
      'whoami': {
        output: `raima
👋 Hi! I'm Raima Mukherjee. You're currently in my home directory.`,
        type: 'success'
      },
      'help': {
        output: `🤖 AVAILABLE COMMANDS - HOME DIRECTORY
════════════════════════════════════════

📁 NAVIGATION COMMANDS:
• <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>   - Enter portfolio directory
• <span class="copyable-command" data-command="ls">ls <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>           - List directories
• <span class="copyable-command" data-command="ls -la">ls -la <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>       - Detailed directory listing

🔧 SYSTEM COMMANDS:
• <span class="copyable-command" data-command="whoami">whoami <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>       - About Raima Mukherjee
• <span class="copyable-command" data-command="clear">clear <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>        - Clear the terminal
• <span class="copyable-command" data-command="close">close <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>        - Close the terminal
• <span class="copyable-command" data-command="help">help <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>         - Show this help menu

💡 TIP: Navigate to Portfolio directory to access resume, skills, and projects!
🚀 Use arrow keys ↑↓ to browse command history.`,
        type: 'info'
      },
      'clear': {
        output: 'clear',
        type: 'success'
      },
      'close': {
        output: 'Closing terminal...',
        type: 'success',
        action: 'closeTerminal'
      }
    };

    this.portfolioCommands = {
      'cat Resume': {
        output: `📄 RESUME - Raima Mukherjee
════════════════════════════════════════

<div class="pdf-container">
  <div class="pdf-header">
    <span class="pdf-title">📄 Resume.pdf</span>
    <div class="pdf-actions">
      <a href="https://drive.google.com/file/d/1FUXRlOlw49INZCmv-nRB13CKRI5H7jra/view?usp=sharing" target="_blank" class="pdf-btn view-btn">
        <i class="fas fa-eye"></i> View PDF
      </a>
      <a href="https://drive.google.com/uc?export=download&id=1FUXRlOlw49INZCmv-nRB13CKRI5H7jra" class="pdf-btn download-btn">
        <i class="fas fa-download"></i> Download
      </a>
    </div>
  </div>
  <div class="pdf-preview">
    <iframe src="https://drive.google.com/file/d/1FUXRlOlw49INZCmv-nRB13CKRI5H7jra/preview" 
            width="100%" 
            height="400" 
            frameborder="0"
            allow="autoplay">
    </iframe>
  </div>
</div>

💡 You can view the full PDF above or download it directly!`,
        type: 'success'
      },
      'cat Skills': {
        output: `⚡ TECHNICAL SKILLS
════════════════════════════════════════

🌐 FRONTEND DEVELOPMENT
• HTML5, CSS3, JavaScript (ES6+)
• React.js, Redux, Bootstrap
• Responsive Web Design
• UI/UX Implementation

⚙️ BACKEND DEVELOPMENT  
• Node.js, Express.js
• MongoDB, Database Design
• RESTful API Development
• Flask (Python)

💻 PROGRAMMING LANGUAGES
• JavaScript (Advanced)
• Python (Advanced) 
• Java (Advanced)
• C++ (Intermediate)

🛠️ TOOLS & TECHNOLOGIES
• Git, GitHub
• VS Code, Chrome DevTools
• Postman, MongoDB Compass
• Linux Terminal Commands`,
        type: 'success'
      },
      'cat Projects': {
        output: `🚀 FEATURED PROJECTS
════════════════════════════════════════

📺 InfoTube - YouTube Clone
• Built with React.js and modern web technologies
• Features video streaming and interactive UI
• GitHub: github.com/raimamukherjee29/InfoTube

🌐 Portfolio Website  
• Responsive design with HTML, CSS, Bootstrap
• Interactive animations and smooth scrolling
• Modern UI/UX with terminal-style chatbot

🔧 Chrome Extension
• Developed using Flask backend
• Browser automation and productivity features
• GitHub: github.com/raimamukherjee29/Chrome-Extension-using-Flask

💡 More projects available on GitHub
• Visit: github.com/raimamukherjee29`,
        type: 'success'
      },
      'cat Contact': {
        output: `📞 CONTACT INFORMATION
════════════════════════════════════════

📧 Email: raimamukherjee2910@gmail.com
📱 Phone: +91 8144614710
🔗 LinkedIn: linkedin.com/in/raima-mukherjee-416089239
💻 GitHub: github.com/raimamukherjee29

🌍 Location: Available for remote work
⏰ Availability: Open to new opportunities

💼 Looking for: Software Development roles
🎯 Specialization: React.js, Full-Stack Development`,
        type: 'info'
      },
      'help': {
        output: `🤖 AVAILABLE COMMANDS
════════════════════════════════════════

📋 INFORMATION COMMANDS:
• <span class="copyable-command" data-command="cat Resume">cat Resume <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>     - View my complete resume
• <span class="copyable-command" data-command="cat Skills">cat Skills <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>     - See my technical skills  
• <span class="copyable-command" data-command="cat Projects">cat Projects <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>   - Browse my project portfolio
• <span class="copyable-command" data-command="cat Contact">cat Contact <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>    - Get my contact details

🔧 SYSTEM COMMANDS:
• <span class="copyable-command" data-command="ls -la">ls -la <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>         - List available files
• <span class="copyable-command" data-command="whoami">whoami <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>         - About this terminal
• <span class="copyable-command" data-command="clear">clear <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>          - Clear the terminal
• <span class="copyable-command" data-command="close">close <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>          - Close the terminal
• <span class="copyable-command" data-command="help">help <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>           - Show this help menu

💡 TIP: Click the copy icon next to any command!
🚀 Ready to explore my portfolio?`,
        type: 'info'
      },
      'ls': {
        output: `Resume  Skills  Projects  Contact`,
        type: 'success'
      },
      'ls -la': {
        output: `Resume    Skills    Projects    Contact

💡 Next steps: Use 'cat' command to view any file:
• <span class="copyable-command" data-command="cat Resume">cat Resume <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>     - View my complete resume
• <span class="copyable-command" data-command="cat Skills">cat Skills <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>     - See my technical skills
• <span class="copyable-command" data-command="cat Projects">cat Projects <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>   - Browse my projects
• <span class="copyable-command" data-command="cat Contact">cat Contact <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>    - Get contact info

Or type <span class="copyable-command" data-command="help">help <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> for more commands.`,
        type: 'success'
      },
      'whoami': {
        output: `raima
👋 Hi! I'm Raima Mukherjee, a passionate Software Developer specializing in React.js and full-stack web development. Welcome to my portfolio directory!`,
        type: 'success'
      },
      'cd ..': {
        output: `Navigating back to home directory...`,
        type: 'success',
        action: 'goHome'
      },
      'clear': {
        output: 'clear',
        type: 'success'
      },
      'close': {
        output: 'Closing terminal...',
        type: 'success',
        action: 'closeTerminal'
      }
    };
    
    this.init();
  }
  
  init() {
    this.chatbotIcon.addEventListener('click', () => this.toggleChatbot());
    this.chatbotClose.addEventListener('click', () => this.closeChatbot());
    
    // Make terminal body focusable and handle keyboard input
    this.chatbotBody.setAttribute('tabindex', '0');
    this.chatbotBody.addEventListener('click', () => this.focusTerminal());
    this.chatbotBody.addEventListener('keydown', (e) => this.handleKeyInput(e));
    
    // Show initial greeting when opened for the first time
    this.hasShownGreeting = false;
  }
  
  focusTerminal() {
    this.chatbotBody.focus();
    if (!this.inputLine) {
      this.createInputLine();
    }
  }
  
  createInputLine() {
    const currentPrompt = this.currentDirectory === 'home' ? 'raima:~$' : 'raima@portfolio:~$';
    
    // Reset cursor position when creating new line
    this.cursorPosition = this.currentInput.length;
    
    this.inputLine = document.createElement('div');
    this.inputLine.className = 'terminal-input-line';
    this.updateInputDisplay();
    
    this.chatbotBody.appendChild(this.inputLine);
    this.scrollToBottom();
  }
  
  updateInputDisplay() {
    if (!this.inputLine) return;
    
    const currentPrompt = this.currentDirectory === 'home' ? 'raima:~$' : 'raima@portfolio:~$';
    const beforeCursor = this.currentInput.substring(0, this.cursorPosition);
    const afterCursor = this.currentInput.substring(this.cursorPosition);
    
    // Create the complete text with cursor embedded
    let displayText = beforeCursor + '<span class="terminal-cursor">|</span>' + afterCursor;
    
    this.inputLine.innerHTML = `
      <span class="terminal-input-prompt">${currentPrompt}</span>
      <span class="terminal-input-text">${displayText}</span>
    `;
  }
  
  updateInputLine() {
    this.updateInputDisplay();
  }
  
  handleKeyInput(e) {
    if (e.key === 'Enter') {
      this.executeCommand();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.cursorPosition > 0) {
        this.currentInput = this.currentInput.slice(0, this.cursorPosition - 1) + 
                           this.currentInput.slice(this.cursorPosition);
        this.cursorPosition--;
        this.updateInputLine();
      }
    } else if (e.key === 'Delete') {
      e.preventDefault();
      if (this.cursorPosition < this.currentInput.length) {
        this.currentInput = this.currentInput.slice(0, this.cursorPosition) + 
                           this.currentInput.slice(this.cursorPosition + 1);
        this.updateInputLine();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (this.cursorPosition > 0) {
        this.cursorPosition--;
        this.updateInputLine();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (this.cursorPosition < this.currentInput.length) {
        this.cursorPosition++;
        this.updateInputLine();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.cursorPosition = 0;
      this.updateInputLine();
    } else if (e.key === 'End') {
      e.preventDefault();
      this.cursorPosition = this.currentInput.length;
      this.updateInputLine();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory('down');
    } else if (e.key === ' ') {
      // Handle spacebar specifically to prevent page scrolling
      e.preventDefault();
      this.currentInput = this.currentInput.slice(0, this.cursorPosition) + 
                         ' ' + 
                         this.currentInput.slice(this.cursorPosition);
      this.cursorPosition++;
      this.updateInputLine();
    } else if (e.key.length === 1) {
      // Only add printable characters
      this.currentInput = this.currentInput.slice(0, this.cursorPosition) + 
                         e.key + 
                         this.currentInput.slice(this.cursorPosition);
      this.cursorPosition++;
      this.updateInputLine();
    }
  }
  
  executeCommand() {
    const command = this.currentInput.trim();
    
    // Add command to history if it's not empty and not the same as the last command
    if (command && (this.commandHistory.length === 0 || this.commandHistory[this.commandHistory.length - 1] !== command)) {
      this.commandHistory.push(command);
      // Keep history to a reasonable size (last 50 commands)
      if (this.commandHistory.length > 50) {
        this.commandHistory.shift();
      }
    }
    
    // Reset history index
    this.historyIndex = -1;
    
    // Convert input line to regular command line
    if (this.inputLine) {
      const currentPrompt = this.currentDirectory === 'home' ? 'raima:~$' : 'raima@portfolio:~$';
      this.inputLine.innerHTML = `
        <span class="prompt">${currentPrompt}</span>
        <span class="command">${command}</span>
      `;
      this.inputLine.className = 'terminal-line';
    }
    
    // Clear current input and input line
    this.currentInput = '';
    this.cursorPosition = 0;
    this.inputLine = null;
    
    // Process the command
    if (command) {
      this.processCommand(command);
    }
    
    // Create new input line after a short delay
    setTimeout(() => {
      this.createInputLine();
    }, 300);
  }
  
  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    if (direction === 'up') {
      // Move up in history (older commands)
      if (this.historyIndex === -1) {
        // First time pressing up - go to most recent command
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else if (direction === 'down') {
      // Move down in history (newer commands)
      if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      } else {
        // At the newest command, clear input
        this.historyIndex = -1;
        this.currentInput = '';
        this.cursorPosition = 0;
        this.updateInputLine();
        return;
      }
    }
    
    // Update input with historical command
    if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
      this.currentInput = this.commandHistory[this.historyIndex];
      this.cursorPosition = this.currentInput.length;
      this.updateInputLine();
    }
  }
  
  toggleChatbot() {
    if (this.isOpen) {
      this.closeChatbot();
    } else {
      this.openChatbot();
    }
  }
  
  openChatbot() {
    this.chatbotContainer.classList.add('active');
    this.chatbotWindow.classList.add('active');
    this.isOpen = true;
    
    // Show greeting only on first open
    if (!this.hasShownGreeting) {
      this.showGreeting();
    }
    
    // Focus terminal and create input line
    setTimeout(() => {
      this.focusTerminal();
    }, 100);
  }
  
  closeChatbot() {
    this.chatbotContainer.classList.remove('active');
    this.chatbotWindow.classList.remove('active');
    this.isOpen = false;
  }
  
  showGreeting() {
    // Only show greeting once when chatbot first opens
    if (!this.hasShownGreeting) {
      this.addMessage('', `Welcome to Raima's Interactive Portfolio Terminal!

You're currently in the home directory. To explore my portfolio, please enter: <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>`, 'info');
      this.hasShownGreeting = true;
    }
  }
  
  showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.textContent = 'Raima is typing...';
    typingDiv.id = 'typing-indicator';
    this.chatbotBody.appendChild(typingDiv);
    this.scrollToBottom();
    this.isTyping = true;
  }
  
  hideTyping() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isTyping = false;
  }
  

  
  processCommand(command) {
    const lowerCommand = command.toLowerCase();
    const currentCommands = this.currentDirectory === 'home' ? this.homeCommands : this.portfolioCommands;
    
    setTimeout(() => {
      if (currentCommands[command]) {
        const response = currentCommands[command];
        
        if (response.output === 'clear') {
          this.clearTerminal();
        } else {
          this.addMessage('', response.output, response.type);
          
          // Handle special actions
          if (response.action === 'changeDirectory') {
            setTimeout(() => {
              this.currentDirectory = 'portfolio';
              this.addMessage('', `Now in Portfolio directory. Try: <span class="copyable-command" data-command="ls -la">ls -la <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>`, 'info');
              this.updatePrompt();
              // Force another update after a brief delay
              setTimeout(() => this.updatePrompt(), 100);
            }, 500);
          } else if (response.action === 'goHome') {
            setTimeout(() => {
              this.currentDirectory = 'home';
              this.addMessage('', `Back in home directory. Use: <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> to return to portfolio.`, 'info');
              this.updatePrompt();
              // Force another update after a brief delay
              setTimeout(() => this.updatePrompt(), 100);
            }, 500);
          } else if (response.action === 'closeTerminal') {
            setTimeout(() => {
              this.closeChatbot();
            }, 1000);
          }
        }
      } else if (lowerCommand.startsWith('cd ')) {
        // Handle invalid cd commands
        const targetDir = command.substring(3).trim();
        if (targetDir && targetDir !== 'Portfolio' && targetDir !== '..') {
          this.addMessage('', `No such directory: ${targetDir}

And no, you can't mkdir :)

💡 Available directories:
${this.currentDirectory === 'home' ? 
  '• <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Enter portfolio directory' : 
  '• <span class="copyable-command" data-command="cd ..">cd .. <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Go back to home'}`, 'error');
        } else {
          // Generic cd error for malformed commands
          this.addMessage('', `Invalid cd command: ${command}

💡 Available directories:
${this.currentDirectory === 'home' ? 
  '• <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Enter portfolio directory' : 
  '• <span class="copyable-command" data-command="cd ..">cd .. <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Go back to home'}`, 'error');
        }
      } else if (lowerCommand.includes('cat') || lowerCommand.includes('ls') || lowerCommand.includes('help')) {
        // Suggest appropriate commands based on current directory
        if (this.currentDirectory === 'home') {
          this.addMessage('', `Command not found: ${command}

💡 Available commands in home directory:
• <span class="copyable-command" data-command="cd Portfolio">cd Portfolio <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Enter portfolio directory
• <span class="copyable-command" data-command="ls">ls <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - List directories
• <span class="copyable-command" data-command="whoami">whoami <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - About me`, 'error');
        } else {
          this.addMessage('', `Command not found: ${command}

💡 Available commands in Portfolio directory:
• <span class="copyable-command" data-command="cat Resume">cat Resume <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>, <span class="copyable-command" data-command="cat Skills">cat Skills <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>, <span class="copyable-command" data-command="cat Projects">cat Projects <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>, <span class="copyable-command" data-command="cat Contact">cat Contact <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span>
• <span class="copyable-command" data-command="ls -la">ls -la <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - List files
• <span class="copyable-command" data-command="cd ..">cd .. <i class="fas fa-copy copy-icon" title="Copy to clipboard"></i></span> - Go back to home`, 'error');
        }
      } else {
        this.addMessage('', `bash: ${command}: command not found

💡 Try available commands for your current directory!`, 'error');
      }
    }, 300);
  }
  
  updatePrompt() {
    // Update the current input line if it exists
    if (this.inputLine) {
      this.updateInputLine();
    }
  }
  
  addMessage(command, output, type) {
    // Only add command line if there's actually a command
    if (command && command.trim()) {
      const currentPrompt = this.currentDirectory === 'home' ? 'raima:~$' : 'raima@portfolio:~$';
      const commandDiv = document.createElement('div');
      commandDiv.className = 'terminal-line';
      commandDiv.innerHTML = `
        <span class="prompt">${currentPrompt}</span>
        <span class="command">${command}</span>
      `;
      this.chatbotBody.appendChild(commandDiv);
    }
    
    if (output) {
      const outputDiv = document.createElement('div');
      outputDiv.className = `terminal-output ${type}-output`;
      outputDiv.innerHTML = output.replace(/\n/g, '<br>');
      this.chatbotBody.appendChild(outputDiv);
      
      // Add copy functionality to copyable commands
      this.addCopyListeners();
    }
    
    this.scrollToBottom();
  }
  
  addCopyListeners() {
    const copyableCommands = this.chatbotBody.querySelectorAll('.copyable-command');
    copyableCommands.forEach(element => {
      if (!element.hasAttribute('data-listener-added')) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          const command = element.getAttribute('data-command');
          this.copyToClipboard(command);
          this.currentInput = command;
          this.cursorPosition = command.length;
          this.updateInputLine();
          this.focusTerminal();
        });
        element.setAttribute('data-listener-added', 'true');
      }
    });
  }
  
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Copy successful - no notification needed
    }).catch(err => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  }
  
  clearTerminal() {
    const currentPrompt = this.currentDirectory === 'home' ? 'raima:~$' : 'raima@portfolio:~$';
    this.chatbotBody.innerHTML = `
      <div class="terminal-line">
        <span class="prompt">${currentPrompt}</span>
        <span class="command">clear</span>
      </div>
      <div class="terminal-output success-output">Terminal cleared! 🧹</div>
    `;
  }
  
  scrollToBottom() {
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS with config
  if (window.EMAIL_CONFIG) {
    emailjs.init(window.EMAIL_CONFIG.EMAILJS_PUBLIC_KEY);
  }
  
  new PortfolioChatbot();
  initializeInteractiveImage();
  initializeContactForm();
});

// Interactive Image Functionality
function initializeInteractiveImage() {
  const profileImage = document.querySelector('.raima2');
  
  if (!profileImage) return;
  
  let currentRotationY = 0;
  let isAutoRotating = false;
  let isPaused = false;
  let rotationSpeed = 3; // degrees per frame
  let speedDirection = 1; // 1 for speeding up, -1 for slowing down
  let currentImage = 'original'; // 'original' or 'ghibli'
  let lastCompleteRotation = 0;
  let isDragging = false;
  let startX = 0;
  let autoRotateTimeout = null;
  let lastSwapRotation = 0;
  
  // Auto rotation function
  function autoRotate() {
    if (!isAutoRotating) return;
    
    if (isPaused) {
      requestAnimationFrame(autoRotate);
      return;
    }
    
    // Variable speed: oscillate between 3.5 and 8 degrees per frame
    rotationSpeed += speedDirection * 0.09;
    if (rotationSpeed >= 8) speedDirection = -1;
    if (rotationSpeed <= 3.5) speedDirection = 1;
    
    currentRotationY += rotationSpeed;
    
    // Check for half rotation (180 degrees)
    const currentHalfRotations = Math.floor(currentRotationY / 180);
    if (currentHalfRotations > lastCompleteRotation) {
      lastCompleteRotation = currentHalfRotations;
      // Pause for 1 second after half rotation
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
      }, 1000);
    }
    
    // Smooth image swapping based on rotation angle
    const rotationCycle = currentRotationY % 360;
    const swapProgress = Math.abs(Math.sin((rotationCycle * Math.PI) / 180));
    
    // Determine which image should be more visible
    const shouldShowGhibli = rotationCycle > 90 && rotationCycle < 270;
    const newImage = shouldShowGhibli ? 'ghibli' : 'original';
    
    if (newImage !== currentImage) {
      currentImage = newImage;
      // Smooth transition using opacity
      profileImage.style.opacity = '0';
      setTimeout(() => {
        if (currentImage === 'ghibli') {
          profileImage.src = './img/raima-2-ghibli.png';
        } else {
          profileImage.src = './img/raima-2.png';
        }
        profileImage.style.opacity = '1';
      }, 150);
    }
    
    // Apply rotation
    profileImage.style.transform = `perspective(1000px) rotateY(${currentRotationY}deg)`;
    
    requestAnimationFrame(autoRotate);
  }
  
  // Function to start auto rotation with delay
  function startAutoRotation() {
    if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
    autoRotateTimeout = setTimeout(() => {
      isAutoRotating = true;
      autoRotate();
    }, 500);
  }
  
  // Function to stop auto rotation
  function stopAutoRotation() {
    isAutoRotating = false;
    isPaused = false;
    if (autoRotateTimeout) {
      clearTimeout(autoRotateTimeout);
      autoRotateTimeout = null;
    }
  }
  
  // Manual drag rotation
  profileImage.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    lastSwapRotation = currentRotationY; // Reset swap tracking for manual control
    profileImage.style.cursor = 'grabbing';
    stopAutoRotation();
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    currentRotationY += deltaX * 0.5; // Sensitivity
    startX = e.clientX;
    
    // Smooth swapping for manual drag
    const rotationCycle = currentRotationY % 360;
    const shouldShowGhibli = rotationCycle > 90 && rotationCycle < 270;
    const newImage = shouldShowGhibli ? 'ghibli' : 'original';
    
    if (newImage !== currentImage) {
      currentImage = newImage;
      // Smooth transition using opacity
      profileImage.style.opacity = '0.7';
      setTimeout(() => {
        if (currentImage === 'ghibli') {
          profileImage.src = './img/raima-2-ghibli.png';
        } else {
          profileImage.src = './img/raima-2.png';
        }
        profileImage.style.opacity = '1';
      }, 100);
    }
    
    profileImage.style.transform = `perspective(1000px) rotateY(${currentRotationY}deg)`;
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      profileImage.style.cursor = 'pointer';
      startAutoRotation(); // Restart auto rotation after 3 seconds
    }
  });
  
  document.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      profileImage.style.cursor = 'pointer';
      startAutoRotation(); // Restart auto rotation after 3 seconds
    }
  });
  
  // Start initial auto rotation
  startAutoRotation();
}

// Contact Form Functionality
function initializeContactForm() {
  const contactForm = document.getElementById('contact-form');
  const phoneInput = document.getElementById('contact');
  const submitBtn = document.querySelector('.submit-btn');
  
  if (!contactForm) return;
  
  // Restrict phone input to numbers only
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // Remove any non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, '');
    });
    
    phoneInput.addEventListener('keypress', function(e) {
      // Allow only numbers, backspace, delete, tab, escape, enter
      if (!/[0-9]/.test(e.key) && 
          !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(contactForm);
    // Debug form data
    const countryCode = formData.get('country-code') || '+91';
    const phoneNumber = formData.get('contact') || '';
    
    console.log('Form data debug:', {
      name: formData.get('name'),
      email: formData.get('email'),
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      message: formData.get('message')
    });
    
    const templateParams = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: phoneNumber ? `${countryCode} ${phoneNumber}` : 'Not provided',
      message: formData.get('message'),
      to_email: 'raimamukherjee2910@gmail.com'
    };
    
    // Send email using EmailJS
    emailjs.send(
      window.EMAIL_CONFIG.EMAILJS_SERVICE_ID, 
      window.EMAIL_CONFIG.EMAILJS_TEMPLATE_ID, 
      templateParams
    )
      .then(function(response) {
        console.log('Email sent successfully!', response.status, response.text);
        showFormMessage('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      })
      .catch(function(error) {
        console.error('Failed to send email:', error);
        showFormMessage('❌ Failed to send message. Please try again or contact me directly.', 'error');
      })
      .finally(function() {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });
}

function showFormMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  // Insert after form
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}
