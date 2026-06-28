const themeToggle = document.getElementById('theme-toggle');
const moduleContent = document.getElementById('module-content');
const navLinks = document.querySelectorAll('.nav-links a');
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.getElementById('nav-search');
const searchResults = document.getElementById('search-results');
const editor = document.getElementById('code-editor');
const output = document.getElementById('code-output');

const STORAGE_KEY = 'devnexus-skills';
const SEARCH_MODULES = [
  { label: 'Home', module: 'home' },
  { label: 'Skills', module: 'skills' },
  { label: 'Vault', module: 'vault' },
  { label: 'Sandbox', module: 'sandbox' }
];

function setActiveNav(selectedLink) {
  navLinks.forEach(link => link.classList.toggle('active', link === selectedLink));
}

function loadModule(module) {
  let content = '';

  if (module === 'home') {
    content = `
      <div class="module-card">
        <h2>Welcome back to Dev-Nexus</h2>
        <p>Use the modules to manage your skill list, save snippets in the vault, or experiment in the sandbox.</p>
      </div>
    `;
  }

  if (module === 'skills') {
    const skills = getSkills();
    content = `
      <div class="module-card">
        <h2>Skills Registry</h2>
        <p>Add skills you are learning and keep track of progress.</p>
        <div class="skill-form">
          <input type="text" id="skillInput" placeholder="Add a skill...">
          <button onclick="addSkill()" class="secondary-btn">Add Skill</button>
        </div>
        <ul id="skillList" class="skill-list">
          ${skills.map((skill, index) => `
            <li>
              <span>${skill}</span>
              <button class="delete-skill" onclick="deleteSkill(${index})">Delete</button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  if (module === 'vault') {
    content = `
      <div class="module-card">
        <h2>Code Vault</h2>
        <p>Save useful snippets and copy them into the editor when you need them.</p>
        <div class="vault-list">
          <button onclick="loadSample('hello')" class="secondary-btn">Hello World</button>
          <button onclick="loadSample('fizzbuzz')" class="secondary-btn">FizzBuzz</button>
          <button onclick="loadSample('arrow')" class="secondary-btn">Arrow Function</button>
        </div>
      </div>
    `;
  }

  if (module === 'sandbox') {
    content = `
      <div class="module-card">
        <h2>Sandbox</h2>
        <p>Write JavaScript in the editor and press Run to see the results below.</p>
        <p>Try <code>console.log('Hello world')</code> or any small snippet.</p>
      </div>
    `;
  }

  moduleContent.innerHTML = content;
  if (module === 'skills') {
    attachSkillInputEnter();
    renderSkills();
  }
}

function getSkills() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveSkills(skills) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

function renderSkills() {
  const list = document.getElementById('skillList');
  if (!list) return;

  const skills = getSkills();
  list.innerHTML = skills.map((skill, index) => `
    <li>
      <span>${skill}</span>
      <button class="delete-skill" onclick="deleteSkill(${index})">Delete</button>
    </li>
  `).join('');
}

function attachSkillInputEnter() {
  const input = document.getElementById('skillInput');
  if (!input) return;

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  });
}

function addSkill() {
  const input = document.getElementById('skillInput');
  const value = input ? input.value.trim() : '';

  if (!value) {
    window.alert('Enter a skill before adding.');
    return;
  }

  const skills = getSkills();
  skills.push(value);
  saveSkills(skills);
  renderSkills();
  input.value = '';
}

function deleteSkill(index) {
  const skills = getSkills();
  skills.splice(index, 1);
  saveSkills(skills);
  renderSkills();
}

function runCode() {
  const code = editor.value;
  if (!code.trim()) {
    output.textContent = 'Add code to the editor before running it.';
    return;
  }

  let logLines = [];
  const captureConsole = {
    log: (...args) => logLines.push(args.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(' ')),
    info: (...args) => logLines.push(args.join(' ')),
    warn: (...args) => logLines.push('[warn] ' + args.join(' ')),
    error: (...args) => logLines.push('[error] ' + args.join(' '))
  };

  try {
    const runner = new Function('console', code);
    const result = runner(captureConsole);
    if (result !== undefined) {
      logLines.push(result);
    }
    output.textContent = logLines.length ? logLines.join('\n') : 'Code executed successfully.';
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  }
}

function toggleCommentInEditor() {
  const value = editor.value;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end) === -1 ? value.length : value.indexOf('\n', end);
  const selectedText = value.slice(lineStart, lineEnd);
  const lines = selectedText.split('\n');
  const allCommented = lines.every(line => line.trim().startsWith('//'));
  const transformed = lines.map(line => {
    if (allCommented) {
      return line.replace(/^(\s*)\/\/?\s?/, '$1');
    }
    return line.replace(/^(\s*)/, '$1// ');
  });

  editor.value = value.slice(0, lineStart) + transformed.join('\n') + value.slice(lineEnd);
  editor.selectionStart = lineStart;
  editor.selectionEnd = lineStart + transformed.join('\n').length;
}

function loadSample(sample) {
  const samples = {
    hello: `console.log('Hello Dev-Nexus!');`,
    fizzbuzz: `for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}`,
    arrow: `const greet = name => ` + '`Hello, ${name}!`' + `;
console.log(greet('Developer'));`
  };

  editor.value = samples[sample] || samples.hello;
  output.textContent = 'Sample loaded. Press Run to execute.';
}

function clearCode() {
  editor.value = '';
  output.textContent = 'Editor cleared.';
}

function filterSearch(query) {
  const normalized = query.trim().toLowerCase();
  const matches = SEARCH_MODULES.filter(item => item.label.toLowerCase().includes(normalized));

  if (matches.length === 0) {
    searchResults.innerHTML = '<li class="empty">No results found</li>';
    return;
  }

  searchResults.innerHTML = matches.map(item =>
    `<li onclick="selectSearch('${item.module}', this)">${item.label}</li>`
  ).join('');
}

function selectSearch(module, element) {
  if (!module) return;

  const selectedLink = Array.from(navLinks).find(link => link.dataset.module === module);
  if (selectedLink) setActiveNav(selectedLink);
  loadModule(module);
  closeSearch();
  searchInput.value = '';
}

function openSearch() {
  searchPanel.classList.add('open');
  searchInput.focus();
  filterSearch('');
}

function closeSearch() {
  searchPanel.classList.remove('open');
}

function init() {
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const module = event.currentTarget.dataset.module;
      setActiveNav(event.currentTarget);
      loadModule(module);
    });
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
  });

  window.toggleTheme = function() {
    document.body.classList.toggle('light-theme');
  };

  window.toggleEditorTheme = function() {
    editor.classList.toggle('editor-light-theme');
  };

  if (searchToggle) {
    searchToggle.addEventListener('click', event => {
      event.stopPropagation();
      if (searchPanel.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', event => {
      filterSearch(event.target.value);
    });
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const first = searchResults.querySelector('li:not(.empty)');
        if (first) first.click();
      }
    });
  }

  if (editor) {
    editor.addEventListener('keydown', event => {
      const isCtrlSlash = (event.ctrlKey || event.metaKey) && event.key === '/';
      if (isCtrlSlash) {
        event.preventDefault();
        toggleCommentInEditor();
      }
      if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        runCode();
      }
    });
  }

  document.addEventListener('click', event => {
    if (!searchPanel.contains(event.target) && event.target !== searchToggle) {
      closeSearch();
    }
  });

  loadModule('home');
  loadSample('hello');
}

init();
