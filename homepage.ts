/**
 * HTML/CSS/JS template for the Brutalist Geek Terminal homepage.
 */

export function renderHomepage(
  allowedDomains: Set<string>,
  _allowedDomainsEnv: string,
): string {
  // Process allowed domains to render as clean list
  const hasAllowedDomains = allowedDomains.size > 0;
  const domainsList = hasAllowedDomains
    ? Array.from(allowedDomains).map((d) =>
      `        <span class="domain-badge"><span class="success-text">[✓]</span> ${d}</span>`
    ).join("\n")
    : `        <div class="wildcard-banner">
          <div class="warning-text">[!] WILDCARD MODE</div>
          <div class="comment-text">// No ALLOWED_DOMAINS configured in environment. The proxy allows forwarding requests to any target host.</div>
        </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deno API Forward Proxy - Terminal Console</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

    :root {
      --bg-color: #030406;
      --term-bg: #06090e;
      --border-color: #1a2333;
      --text-color: #a9b2c3;
      
      --terminal-green: #00ff66;
      --terminal-green-dim: rgba(0, 255, 102, 0.15);
      --terminal-green-glow: rgba(0, 255, 102, 0.4);
      
      --cyber-blue: #00ccff;
      --cyber-blue-dim: rgba(0, 204, 255, 0.15);
      
      --amber: #ffaa00;
      --amber-dim: rgba(255, 170, 0, 0.15);
      
      --danger-red: #ff3366;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: 'Space Mono', monospace;
      padding: 20px;
      line-height: 1.5;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Subtle CRT Scanlines Effect */
    body::before {
      content: " ";
      display: block;
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
      background-size: 100% 4px;
      z-index: 9999;
      pointer-events: none;
      opacity: 0.3;
    }

    .main-wrapper {
      width: 100%;
      max-width: 1100px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ASCII Header styling */
    .ascii-banner {
      color: var(--terminal-green);
      font-size: 5px;
      line-height: 1.1;
      white-space: pre;
      text-shadow: 0 0 5px var(--terminal-green-glow);
      text-align: center;
      margin: 15px 0;
      user-select: none;
      overflow: hidden;
    }

    @media (min-width: 480px) {
      .ascii-banner {
        font-size: 8px;
      }
    }

    @media (min-width: 768px) {
      .ascii-banner {
        font-size: 11px;
      }
    }

    /* Terminal Window Frame */
    .terminal-window {
      background-color: var(--term-bg);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 102, 0.02);
      overflow: hidden;
      position: relative;
    }

    .terminal-window.active-green {
      border-color: var(--terminal-green-dim);
    }

    /* Title Bar */
    .title-bar {
      background-color: #0c1017;
      border-bottom: 2px solid var(--border-color);
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .window-controls {
      display: flex;
      gap: 8px;
    }

    .control-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .control-dot.red { background-color: #ff5f56; }
    .control-dot.yellow { background-color: #ffbd2e; }
    .control-dot.green { background-color: #27c93f; }

    .window-title {
      font-size: 12px;
      color: #8b949e;
    }

    .system-status {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: var(--terminal-green);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--terminal-green);
      animation: blink 2s infinite ease-in-out;
    }

    @keyframes blink {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    /* Terminal Body Content */
    .terminal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .section-title {
      color: var(--cyber-blue);
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px dashed var(--border-color);
      padding-bottom: 5px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .command-line {
      display: flex;
      gap: 10px;
      color: var(--terminal-green);
      margin-bottom: 10px;
    }

    .prompt {
      user-select: none;
    }

    .command-text {
      color: #fff;
    }

    /* Grid Layouts */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    /* Config panel info */
    .config-panel {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .domain-badge {
      background-color: rgba(6, 9, 14, 0.6);
      border: 1px solid var(--border-color);
      color: #fff;
      font-size: 13px;
      padding: 4px 10px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .wildcard-banner {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .wildcard-banner .warning-text {
      color: var(--amber);
      font-weight: bold;
      font-size: 13px;
    }

    .wildcard-banner .comment-text {
      color: #57606a;
      font-size: 12px;
      line-height: 1.4;
    }

    /* Interactive Builder CSS */
    .builder-panel {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .preset-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .btn {
      background-color: #0b0f17;
      border: 1px solid var(--border-color);
      color: var(--text-color);
      padding: 6px 12px;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn:hover {
      border-color: var(--cyber-blue);
      color: #fff;
      box-shadow: 0 0 8px rgba(0, 204, 255, 0.2);
    }

    .btn.active-preset {
      background-color: var(--cyber-blue-dim);
      border-color: var(--cyber-blue);
      color: #fff;
      font-weight: bold;
    }

    .btn.btn-primary {
      background-color: var(--terminal-green-dim);
      border-color: var(--terminal-green);
      color: #fff;
    }

    .btn.btn-primary:hover {
      background-color: var(--terminal-green);
      color: #000;
      box-shadow: 0 0 12px var(--terminal-green-glow);
    }

    .btn.btn-copied {
      background-color: var(--terminal-green-dim) !important;
      border-color: var(--terminal-green) !important;
      color: var(--terminal-green) !important;
      font-weight: bold;
    }

    .btn.btn-copied:hover {
      background-color: var(--terminal-green) !important;
      color: #000 !important;
      box-shadow: 0 0 12px var(--terminal-green-glow) !important;
    }

    .btn.btn-amber {
      background-color: var(--amber-dim);
      border-color: var(--amber);
      color: #fff;
    }

    .btn.btn-amber:hover {
      background-color: var(--amber);
      color: #000;
      box-shadow: 0 0 12px rgba(255, 170, 0, 0.4);
    }

    /* Combined Input Field and Method selector */
    .url-input-group {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      width: 100%;
    }

    .method-select {
      background-color: #020305;
      border: 1px solid var(--border-color);
      color: var(--terminal-green);
      padding: 8px 12px;
      font-family: inherit;
      font-size: 13px;
      border-radius: 4px;
      outline: none;
      font-weight: bold;
      cursor: pointer;
      min-width: 90px;
      text-align: center;
      transition: all 0.2s ease;
    }

    .method-select:focus {
      border-color: var(--terminal-green);
    }

    .input-field {
      flex: 1 1 200px;
      background-color: #020305;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 13px;
      border-radius: 4px;
      outline: none;
      transition: all 0.2s ease;
    }

    .input-field:focus {
      border-color: var(--terminal-green);
      box-shadow: 0 0 8px rgba(0, 255, 102, 0.1);
    }

    #request-body {
      min-height: 160px;
      height: 160px;
      flex-shrink: 0;
      resize: none; /* completely disable any resizing/dragging! */
    }

    /* Headers dynamic editing */
    .headers-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .header-edit-row {
      display: flex;
      gap: 6px;
    }

    .header-input {
      background-color: #020305;
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 6px 10px;
      font-family: inherit;
      font-size: 12px;
      border-radius: 4px;
      outline: none;
      flex: 1;
    }

    .header-input:focus {
      border-color: var(--cyber-blue);
    }

    .btn-icon-danger {
      background-color: rgba(255, 51, 102, 0.1);
      border: 1px solid var(--danger-red);
      color: var(--danger-red);
      cursor: pointer;
      border-radius: 4px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
    }

    .btn-icon-danger:hover {
      background-color: var(--danger-red);
      color: #000;
    }

    /* Output Console CSS */
    .output-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .code-box-container {
      position: relative;
    }

    .code-box {
      background-color: #010204;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 15px;
      font-size: 13px;
      color: #f1f1f1;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 250px;
    }

    .code-box.terminal-green-text {
      color: var(--terminal-green);
    }

    .code-box.curl-view {
      color: #e5e7eb;
      border-color: #38bdf840;
    }

    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      opacity: 0.8;
    }

    .copy-btn:hover {
      opacity: 1;
    }

    /* Live playground output style */
    .playground-output-wrapper {
      background-color: #020305;
      border: 2px solid var(--border-color);
      border-radius: 6px;
      font-size: 12px;
    }

    .playground-output-header {
      background-color: #0c1017;
      padding: 6px 12px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      color: #8b949e;
    }

    .playground-output-body {
      padding: 15px;
      max-height: 380px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .output-log-item {
      margin-bottom: 5px;
    }

    /* Typography modifiers */
    .success-text { color: var(--terminal-green); }
    .info-text { color: var(--cyber-blue); }
    .warning-text { color: var(--amber); }
    .danger-text { color: var(--danger-red); }
    .comment-text { color: #57606a; }

    /* Footer */
    footer {
      text-align: center;
      padding: 25px 0;
      font-size: 12px;
      color: #57606a;
      border-top: 1px dashed var(--border-color);
      margin-top: 20px;
    }

    footer a {
      color: var(--terminal-green);
      text-decoration: none;
    }

    footer a:hover {
      text-decoration: underline;
    }

    /* Interactive components classes */
    .method-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .method-get { background-color: rgba(0, 204, 255, 0.15); color: var(--cyber-blue); border: 1px solid var(--cyber-blue); }
    .method-post { background-color: rgba(0, 255, 102, 0.15); color: var(--terminal-green); border: 1px solid var(--terminal-green); }

    /* Custom scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #020305;
    }
    ::-webkit-scrollbar-thumb {
      background: #1a2333;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--terminal-green-dim);
    }

    /* Hero Section and Typewriter effect */
    .hero-section {
      text-align: center;
      margin: 10px 0 20px 0;
    }

    .hero-typewriter {
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      color: var(--terminal-green);
      margin: 15px auto 5px auto;
      background: rgba(6, 9, 14, 0.6);
      border: 1px solid var(--border-color);
      padding: 10px 18px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: fit-content;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      min-height: 44px; /* lock height to prevent page jumps when text is deleted */
      box-sizing: border-box;
    }
    
    .hero-typewriter #typewriter-text {
      font-weight: normal;
      color: #fff;
    }
    
    .hero-typewriter .cursor {
      display: inline-block;
      width: 8px;
      height: 15px;
      background-color: var(--terminal-green);
      animation: blink-cursor 0.8s infinite;
      vertical-align: middle;
    }
    
    @keyframes blink-cursor {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }

    /* Scheme A: URL Converter Container */
    .converter-container {
      margin: 15px auto 0 auto;
      max-width: 680px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
      box-sizing: border-box;
      padding: 0 10px;
    }

    .converter-label {
      font-size: 12px;
      color: #57606a; /* subtle terminal code comment grey */
      font-family: 'Space Mono', monospace;
      padding-left: 4px;
      letter-spacing: 0.5px;
    }

    .converter-input-group {
      display: flex;
      gap: 6px;
      width: 100%;
    }

    .converter-input {
      flex: 1;
      background-color: rgba(2, 3, 5, 0.6);
      border: 1px solid var(--border-color);
      color: #fff;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 13px;
      border-radius: 6px;
      outline: none;
      transition: all 0.2s ease;
    }

    .converter-input:focus {
      border-color: var(--cyber-blue);
      box-shadow: 0 0 8px rgba(0, 204, 255, 0.15);
    }
  </style>
</head>
<body>

<div class="main-wrapper">
  <!-- Hero Section -->
  <header class="hero-section">
    <!-- Interactive Ascii Banner -->
    <div class="ascii-banner">
 ____  _____ _   _  ___        _    ____ ___   _____ ___  ______        ___    ____  ____  
|  _ \\| ____| \\ | |/ _ \\      / \\  |  _ \\_ _| |  ___/ _ \\|  _ \\ \\      / / \\  |  _ \\|  _ \\ 
| | | |  _| |  \\| | | | |    / _ \\ | |_) | |  | |_ | | | | |_) \\ \\ /\\ / / _ \\ | |_) | | | |
| |_| | |___| |\\  | |_| |   / ___ \\|  __/| |  |  _|| |_| |  _ < \\ V  V / ___ \\|  _ <| |_| |
|____/|_____|_| \\_|\\___/   /_/   \\_\\_|  |___| |_|   \\___/|_| \\_\\ \\_/\\_/_/   \\_\\_| \\_\\____/ 
    </div>

    <!-- Typewriter Effect -->
    <div class="hero-typewriter">
      <span id="typewriter-text"></span><span class="cursor"></span>
    </div>

    <!-- Scheme A: URL Converter -->
    <div class="converter-container">
      <span class="converter-label">// PROXY ENDPOINT COMPILER</span>
      <div class="converter-input-group">
        <input type="text" id="raw-convert-url" class="converter-input" placeholder="e.g. https://api.openai.com/v1/chat/completions">
        <button class="btn btn-primary" id="convert-btn" onclick="convertAndCopyLink()">[ COPY PROXY ]</button>
      </div>
    </div>
  </header>

  <!-- Main Console Window -->
  <div class="terminal-window active-green">
    <!-- Title Bar -->
    <div class="title-bar">
      <div class="window-controls">
        <div class="control-dot red"></div>
        <div class="control-dot yellow"></div>
        <div class="control-dot green"></div>
      </div>
      <div class="window-title">guest@deno-api-forward: ~ [ <span id="client-time">---</span> ]</div>
      <div class="system-status">
        <span class="status-dot"></span>
        <span style="color: var(--terminal-green);">STATUS</span>
      </div>
    </div>

    <!-- Terminal Body -->
    <div class="terminal-body">
      
      <!-- Top Section: Allowed Domains / Whitelists -->
      <div class="config-panel">
        <div class="section-title">Security & White-lists</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
${domainsList}
        </div>
      </div>

      <!-- Bottom Dashboard Grid: API Playground -->
      <div class="dashboard-grid">
          <!-- Left Part: Interactive URL Builder -->
          <div class="builder-panel">
            <div class="section-title">Playground</div>
            
            <!-- Presets Row -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px; color: #8b949e;">Select Preset:</span>
              <div class="preset-selector">
                <button class="btn active-preset" onclick="selectPreset('custom')">Custom (Interactive)</button>
                <button class="btn" onclick="selectPreset('openai')">OpenAI</button>
                <button class="btn" onclick="selectPreset('anthropic')">Anthropic</button>
                <button class="btn" onclick="selectPreset('gemini')">Gemini</button>
              </div>
            </div>

            <!-- Parameters Inputs -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px; color: #8b949e;">Target URL & Method:</span>
              <div class="url-input-group">
                <select id="request-method" class="method-select" onchange="setMethod(this.value)">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input type="text" id="target-url" class="input-field" placeholder="e.g. https://api.openai.com/v1/models" oninput="updateBuilder()">
                <button class="btn btn-primary" onclick="executeTest()">[ RUN ]</button>
                <button class="btn btn-amber" onclick="resetBuilder()">[ RESET ]</button>
              </div>
            </div>

            <!-- Custom Headers editing -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #8b949e;">Custom Headers:</span>
                <button class="btn" style="padding: 3px 8px; font-size: 11px;" onclick="addHeaderRow()">+ Add Header</button>
              </div>
              <div id="headers-list" class="headers-container">
                <!-- Javascript will inject header rows here -->
              </div>
            </div>

            <!-- Request Body Input -->
            <div id="body-input-container" style="display: none; flex-direction: column; gap: 8px;">
              <span style="font-size: 12px; color: #8b949e;">Request Body (JSON):</span>
              <textarea id="request-body" class="header-input" style="font-family: inherit; font-size: 12px;" oninput="updateBuilder()"></textarea>
            </div>
          </div>

          <!-- Right Part: Command & Execution Output -->
          <div class="output-section">
            <div>
              <!-- Playground Console output -->
              <div class="playground-output-wrapper">
                <div class="playground-output-header">
                  <span>Console Log</span>
                  <span id="response-time">0 ms</span>
                </div>
                <div class="playground-output-body" id="console-output">
                  <div class="output-log-item comment-text">// Select a preset or enter your custom target URL above.</div>
                  <div class="output-log-item comment-text">// Click "[ RUN ]" to send the secure proxied API request.</div>
                </div>
              </div>
            </div>
          </div>

      </div>

    </div>
  </div>

  <footer>
    Deno Deploy Forwarder © 2026 | Built with <a href="https://deno.land" target="_blank">Deno Runtime</a> | Secure API Forwarding Engine
  </footer>
</div>

<script>
  // Presets definition
  const PRESETS = {
    custom: {
      url: '',
      method: 'GET',
      headers: [],
      body: ''
    },
    openai: {
      url: 'https://api.openai.com/v1/models',
      method: 'GET',
      headers: [
        { key: 'Authorization', value: 'Bearer YOUR_OPENAI_API_KEY' }
      ],
      body: ''
    },
    anthropic: {
      url: 'https://api.anthropic.com/v1/messages',
      method: 'POST',
      headers: [
        { key: 'x-api-key', value: 'YOUR_ANTHROPIC_API_KEY' },
        { key: 'anthropic-version', value: '2023-06-01' },
        { key: 'Content-Type', value: 'application/json' }
      ],
      body: '{\\n  "model": "claude-3-5-sonnet-20241022",\\n  "max_tokens": 1024,\\n  "messages": [\\n    { "role": "user", "content": "Hello!" }\\n  ]\\n}'
    },
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/models',
      method: 'GET',
      headers: [
        { key: 'x-goog-api-key', value: 'YOUR_GEMINI_API_KEY' }
      ],
      body: ''
    }
  };

  let currentMethod = 'GET';
  let activePresetKey = 'custom';

  // Typewriter effect configuration and function
  let typewriterWords = [];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function initTypewriter() {
    const domain = window.location.host;
    typewriterWords = [
      'curl https://' + domain + '/api.openai.com/v1/chat/completions',
      'curl https://' + domain + '/generativelanguage.googleapis.com/v1beta/models',
      'curl https://' + domain + '/api.anthropic.com/v1/messages',
      'git clone https://' + domain + '/github.com/JoJoJotarou/deno-api-forward'
    ];
  }

  function typeEffect() {
    if (typewriterWords.length === 0) return;
    const currentWord = typewriterWords[wordIndex];
    const textElement = document.getElementById("typewriter-text");
    if (!textElement) return;

    if (isDeleting) {
      textElement.innerHTML = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.innerHTML = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typewriterWords.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Load from LocalStorage if available or load preset
  function init() {
    // Dynamic client side clock
    setInterval(() => {
      const now = new Date();
      document.getElementById('client-time').innerText = now.toLocaleString();
    }, 1000);
    document.getElementById('client-time').innerText = new Date().toLocaleString();

    // Set initial values from custom preset
    loadPreset('custom');

    // Initialize typewriter sentences with current domain
    initTypewriter();

    // Start typewriter effect
    typeEffect();
  }

  function loadPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;

    currentMethod = preset.method;
    document.getElementById('target-url').value = preset.url;
    document.getElementById('request-method').value = preset.method;

    // Build headers fields
    const list = document.getElementById('headers-list');
    list.innerHTML = '';
    preset.headers.forEach(h => {
      addHeaderRow(h.key, h.value);
    });

    // Body
    const bodyBox = document.getElementById('request-body');
    bodyBox.value = preset.body;
    toggleBodyInput();
  }

  function selectPreset(key) {
    activePresetKey = key;
    // Highlight button
    const buttons = document.querySelectorAll('.preset-selector button');
    buttons.forEach(btn => {
      if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'" + key + "'")) {
        btn.classList.add('active-preset');
      } else {
        btn.classList.remove('active-preset');
      }
    });

    loadPreset(key);
  }

  function setMethod(method) {
    currentMethod = method;
    document.getElementById('request-method').value = method;
    toggleBodyInput();
  }

  function toggleBodyInput() {
    const container = document.getElementById('body-input-container');
    if (currentMethod === 'POST' || currentMethod === 'PUT' || currentMethod === 'PATCH') {
      container.style.display = 'flex';
    } else {
      container.style.display = 'none';
    }
  }

  function addHeaderRow(key = '', value = '') {
    const list = document.getElementById('headers-list');
    const row = document.createElement('div');
    row.className = 'header-edit-row';
    row.innerHTML = \`
      <input type="text" class="header-input header-key" placeholder="Key" value="\${key}">
      <input type="text" class="header-input header-value" placeholder="Value" value="\${value}">
      <button class="btn-icon-danger" onclick="this.parentElement.remove();">×</button>
    \`;
    list.appendChild(row);
  }

  function getHeaders() {
    const headers = [];
    const rows = document.querySelectorAll('.header-edit-row');
    rows.forEach(row => {
      const key = row.querySelector('.header-key').value.trim();
      const val = row.querySelector('.header-value').value.trim();
      if (key) {
        headers.push({ key, value: val });
      }
    });
    return headers;
  }

  function parseTargetUrl(rawUrl) {
    let clean = rawUrl.trim();
    // Strip http:// or https:// if present
    if (clean.startsWith('http://')) {
      clean = clean.substring(7);
    } else if (clean.startsWith('https://')) {
      clean = clean.substring(8);
    }
    
    const slashIdx = clean.indexOf('/');
    const host = slashIdx === -1 ? clean : clean.substring(0, slashIdx);
    let path = slashIdx === -1 ? '' : clean.substring(slashIdx + 1);
    
    return { host, path };
  }

  // Construct URL dynamically
  function buildParams() {
    const rawUrl = document.getElementById('target-url').value.trim();
    const { host, path } = parseTargetUrl(rawUrl);
    
    const headers = getHeaders();
    const body = document.getElementById('request-body').value.trim();
    
    // Base URL is the origin
    const origin = window.location.origin;
    const proxyUrl = host ? (origin + '/' + host + '/' + path) : '';
    
    return { host, path, headers, body, proxyUrl };
  }

  function updateBuilder() {
    // Kept as helper to trigger target method checking on key stroke
  }

  function resetBuilder() {
    document.getElementById('target-url').value = '';
    document.getElementById('headers-list').innerHTML = '';
    document.getElementById('request-body').value = '';
    setMethod('GET');
  }

  // Scheme A URL Converter & Copy Action
  function convertAndCopyLink() {
    const rawUrlInput = document.getElementById('raw-convert-url');
    const convertBtn = document.getElementById('convert-btn');
    if (!rawUrlInput || !convertBtn) return;
    
    let rawUrl = rawUrlInput.value.trim();
    if (!rawUrl) return;

    // 1. Recursively strip protocol, currentOrigin, cleanOriginHost, and leading/trailing slashes
    const currentOrigin = window.location.origin;
    const cleanOriginHost = currentOrigin.replace('https://', '').replace('http://', '');
    
    let targetPart = rawUrl;
    let cleanedSomething = true;
    
    while (cleanedSomething) {
      cleanedSomething = false;
      targetPart = targetPart.trim();
      
      // Strip leading slashes
      while (targetPart.startsWith('/')) {
        targetPart = targetPart.substring(1);
        cleanedSomething = true;
      }
      
      // Strip current origin (e.g. http://0.0.0.0:8000)
      if (targetPart.startsWith(currentOrigin)) {
        targetPart = targetPart.substring(currentOrigin.length);
        cleanedSomething = true;
      }
      // Strip clean origin host (e.g. 0.0.0.0:8000)
      else if (targetPart.startsWith(cleanOriginHost)) {
        targetPart = targetPart.substring(cleanOriginHost.length);
        cleanedSomething = true;
      }
      // Strip target protocols (e.g. https:// or http://)
      else if (targetPart.startsWith('https://')) {
        targetPart = targetPart.substring(8);
        cleanedSomething = true;
      } else if (targetPart.startsWith('http://')) {
        targetPart = targetPart.substring(7);
        cleanedSomething = true;
      }
    }

    // 2. Build secure proxied URL
    const proxiedUrl = currentOrigin + '/' + targetPart;

    // 3. Success handler
    const successCallback = () => {
      convertBtn.innerText = '[ COPIED! ]';
      convertBtn.classList.add('btn-copied');
      
      setTimeout(() => {
        convertBtn.innerText = '[ COPY PROXY ]';
        convertBtn.classList.remove('btn-copied');
        rawUrlInput.value = '';
      }, 1500);
    };

    // 4. Fallback manual copy
    const fallbackCopy = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          successCallback();
        } else {
          prompt('Copy blocked. Please manually copy the generated link:', text);
        }
      } catch (err) {
        prompt('Copy blocked. Please manually copy the generated link:', text);
      }
      document.body.removeChild(textArea);
    };

    // 5. Try navigator.clipboard, with fallbackCopy on failure
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(proxiedUrl).then(successCallback).catch(() => {
        fallbackCopy(proxiedUrl);
      });
    } else {
      fallbackCopy(proxiedUrl);
    }
  }

  // Live test request trigger
  async function executeTest() {
    const { host, path, headers, body, proxyUrl } = buildParams();
    const outputConsole = document.getElementById('console-output');
    const responseTimeBadge = document.getElementById('response-time');
    
    if (!host) {
      outputConsole.innerHTML = \`<div class="output-log-item danger-text">[ERROR] Target URL is required!</div>\`;
      return;
    }

    outputConsole.innerHTML = \`
      <div class="output-log-item success-text">$ initiating proxy request...</div>
      <div class="output-log-item">Target URL: https://\${host}/\${path}</div>
      <div class="output-log-item">Via proxy: \${proxyUrl}</div>
      <div class="output-log-item info-text">// Sending HTTP \${currentMethod}...</div>
    \`;
    
    responseTimeBadge.innerText = 'calculating...';
    
    const requestHeaders = new Headers();
    headers.forEach(h => {
      requestHeaders.set(h.key, h.value);
    });

    const options = {
      method: currentMethod,
      headers: requestHeaders
    };

    if (currentMethod === 'POST' || currentMethod === 'PUT' || currentMethod === 'PATCH') {
      options.body = body;
    }

    const start = performance.now();
    try {
      const res = await fetch(proxyUrl, options);
      const end = performance.now();
      const latency = Math.round(end - start);
      
      responseTimeBadge.innerText = \`\${latency} ms\`;

      let statusColor = 'success-text';
      if (res.status >= 400) statusColor = 'danger-text';
      else if (res.status >= 300) statusColor = 'warning-text';

      let outputHTML = \`
        <div class="output-log-item success-text">$ request completed!</div>
        <div class="output-log-item">HTTP/1.1 <span class="\${statusColor}">\${res.status} \${res.statusText}</span></div>
        <div class="output-log-item comment-text">--- Headers ---</div>
      \`;

      // Print headers
      for (let [key, val] of res.headers.entries()) {
        outputHTML += \`<div class="output-log-item comment-text">\${key}: \${val}</div>\`;
      }

      outputHTML += \`<div class="output-log-item comment-text">--- Body ---</div>\`;

      // Read body
      const text = await res.text();
      let formattedBody = text;
      try {
        // Try to pretty print JSON
        const parsed = JSON.parse(text);
        formattedBody = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Not JSON
      }

      outputHTML += \`<pre class="output-log-item" style="white-space: pre-wrap; word-break: break-all; color: #fff;">\${escapeHtml(formattedBody)}</pre>\`;
      
      outputConsole.innerHTML = outputHTML;
      // Scroll output to top
      outputConsole.parentElement.scrollTop = 0;
      
    } catch (err) {
      const end = performance.now();
      responseTimeBadge.innerText = \`\${Math.round(end - start)} ms\`;
      
      outputConsole.innerHTML += \`
        <div class="output-log-item danger-text">[FETCH ERROR] Request failed.</div>
        <div class="output-log-item danger-text">Message: \${err.message}</div>
        <div class="output-log-item comment-text">// Make sure the Deno API Forward proxy is running, target host is allowed, and target API doesn't block cors requests.</div>
      \`;
    }
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Run on start
  window.onload = init;
</script>

</body>
</html>
`;
}
