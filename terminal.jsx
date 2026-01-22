import React, { useState, useEffect, useRef } from 'react';

const TerminalCLI = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => {
        return (
          <div className="text-green-400">
            <div className="mb-2 font-bold">Available Commands:</div>
            {Object.entries(commands).map(([cmd, data]) => (
              <div key={cmd} className="ml-4 mb-1">
                <span className="text-cyan-400">{cmd}</span> - {data.description}
              </div>
            ))}
          </div>
        );
      }
    },
    about: {
      description: 'Display information about Tyler',
      execute: () => (
        <div className="text-blue-300">
          <div className="font-bold mb-2">Tyler George</div>
          <div>IT & Cybersecurity Professional</div>
          <div>Homelab enthusiast | Infrastructure automation</div>
          <div className="mt-2">Email: tgeorge2299@gmail.com</div>
        </div>
      )
    },
    skills: {
      description: 'List technical skills',
      execute: () => (
        <div className="text-yellow-300">
          <div className="font-bold mb-2">Technical Skills:</div>
          <div className="ml-4">
            <div>• Proxmox VE & Virtualization</div>
            <div>• Linux System Administration</div>
            <div>• Docker & Container Orchestration</div>
            <div>• Network Security & Zero Trust</div>
            <div>• Python & Bash Scripting</div>
            <div>• ZFS Storage Management</div>
          </div>
        </div>
      )
    },
    projects: {
      description: 'View recent projects',
      execute: () => (
        <div className="text-purple-300">
          <div className="font-bold mb-2">Recent Projects:</div>
          <div className="ml-4">
            <div className="mb-2">
              <span className="text-cyan-400">[1]</span> Media Server Automation Platform
              <div className="ml-4 text-gray-400 text-sm">Proxmox LXC, ZFS, Plex Stack</div>
            </div>
            <div className="mb-2">
              <span className="text-cyan-400">[2]</span> Cloudflare Zero Trust Setup
              <div className="ml-4 text-gray-400 text-sm">Secure remote access, no open ports</div>
            </div>
            <div className="mb-2">
              <span className="text-cyan-400">[3]</span> Infrastructure Automation
              <div className="ml-4 text-gray-400 text-sm">Python scripts for monitoring & backups</div>
            </div>
          </div>
          <div className="mt-2 text-sm">Type 'project [number]' for details</div>
        </div>
      )
    },
    project: {
      description: 'View specific project details',
      execute: (args) => {
        const projects = {
          '1': {
            name: 'Media Server Automation Platform',
            tech: ['Proxmox VE', 'LXC', 'ZFS', 'Plex', 'Radarr', 'Sonarr'],
            description: 'Modular media platform with isolated services'
          },
          '2': {
            name: 'Cloudflare Zero Trust Setup',
            tech: ['Cloudflare Tunnel', 'Nginx', 'Docker', 'SSL/TLS'],
            description: 'Secure remote access without port forwarding'
          },
          '3': {
            name: 'Infrastructure Automation',
            tech: ['Python', 'Bash', 'Cron', 'Monitoring'],
            description: 'Automated backups and system monitoring'
          }
        };

        const projectNum = args[0];
        const project = projects[projectNum];

        if (!project) {
          return <div className="text-red-400">Project not found. Use 'projects' to list all.</div>;
        }

        return (
          <div className="text-green-300">
            <div className="font-bold mb-2">{project.name}</div>
            <div className="mb-2">{project.description}</div>
            <div className="text-cyan-400 mb-1">Technologies:</div>
            <div className="ml-4 text-gray-300">
              {project.tech.join(', ')}
            </div>
          </div>
        );
      }
    },
    homelab: {
      description: 'Display homelab setup',
      execute: () => (
        <div className="text-green-300">
          <div className="font-bold mb-2">🖥️  Homelab Infrastructure:</div>
          <div className="ml-4 font-mono text-sm">
            <div className="text-yellow-300 mb-2">┌── Proxmox VE (Single Node)</div>
            <div className="ml-4">
              <div className="text-cyan-300">├── Storage:</div>
              <div className="ml-4">
                <div>│   ├── ZFS Pool "tank" (2×1TB HDD)</div>
                <div>│   └── NVMe 512GB (High I/O)</div>
              </div>
              <div className="text-cyan-300 mt-2">├── LXC Containers (7):</div>
              <div className="ml-4">
                <div>│   ├── Plex, Radarr, Sonarr</div>
                <div>│   ├── Prowlarr, Overseerr</div>
                <div>│   └── Cockpit, Homarr</div>
              </div>
              <div className="text-cyan-300 mt-2">└── Virtual Machines (8):</div>
              <div className="ml-4">
                <div>    ├── Docker Host (Debian)</div>
                <div>    ├── Security Lab (Kali/Metasploitable)</div>
                <div>    └── Windows Server, Ubuntu, macOS</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    contact: {
      description: 'Show contact information',
      execute: () => (
        <div className="text-blue-300">
          <div className="font-bold mb-2">Contact Information:</div>
          <div className="ml-4">
            <div>📧 Email: tgeorge2299@gmail.com</div>
            <div>💼 LinkedIn: linkedin.com/in/tyler-george-2299</div>
            <div>💻 GitHub: github.com/Tgeorge2299</div>
          </div>
        </div>
      )
    },
    clear: {
      description: 'Clear terminal screen',
      execute: () => {
        setHistory([]);
        return null;
      }
    },
    whoami: {
      description: 'Display current user',
      execute: () => <div className="text-green-400">guest@tylergeorge.tech</div>
    },
    date: {
      description: 'Show current date and time',
      execute: () => <div className="text-cyan-400">{new Date().toString()}</div>
    },
    echo: {
      description: 'Print text to terminal',
      execute: (args) => <div className="text-white">{args.join(' ')}</div>
    },
    neofetch: {
      description: 'Display system info',
      execute: () => (
        <div className="text-cyan-300 font-mono text-sm">
          <pre>{`
     ___           guest@tylergeorge.tech
    (.. |          -----------------------
    (<> |          OS: Portfolio v2.0
   / __  \\         Host: techbytyler.com
  ( /  \\ /|        Kernel: Modern JavaScript
 _/\\ __)/_)        Uptime: Always Online
 \\/-____\\/         Shell: React Terminal
                   Theme: Dark Mode
                   Skills: Linux, Docker, Proxmox
                   Projects: 15+ homelab setups
          `}</pre>
        </div>
      )
    },
    ls: {
      description: 'List pages',
      execute: () => (
        <div className="text-blue-300 font-mono">
          <div>index.html</div>
          <div>projects.html</div>
          <div>homelab.html</div>
          <div>blog.html</div>
          <div>about.html</div>
          <div>contact.html</div>
        </div>
      )
    },
    goto: {
      description: 'Navigate to page (home, projects, blog, etc.)',
      execute: (args) => {
        const pages = {
          home: 'index.html',
          projects: 'projects.html',
          homelab: 'homelab.html',
          blog: 'blog.html',
          about: 'about.html',
          contact: 'contact.html'
        };
        
        const page = pages[args[0]?.toLowerCase()];
        if (page) {
          window.location.href = page;
          return <div className="text-green-400">Navigating to {args[0]}...</div>;
        }
        return <div className="text-red-400">Page not found. Try: {Object.keys(pages).join(', ')}</div>;
      }
    }
  };

  const processCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newEntry = {
      input: trimmed,
      output: null
    };

    if (commands[command]) {
      newEntry.output = commands[command].execute(args);
    } else {
      newEntry.output = (
        <div className="text-red-400">
          Command not found: {command}. Type 'help' for available commands.
        </div>
      );
    }

    setHistory(prev => [...prev, newEntry]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setHistory([{
      input: null,
      output: (
        <div className="text-green-400 mb-4">
          <div className="text-xl font-bold mb-2">Welcome to Tyler's Interactive Terminal</div>
          <div>Type '<span className="text-cyan-400">help</span>' to see available commands</div>
          <div>Type '<span className="text-cyan-400">about</span>' to learn more about me</div>
          <div className="mt-2 text-sm text-gray-400">
            Pro tip: Use ↑ and ↓ arrows to navigate command history
          </div>
        </div>
      )
    }]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-gray-300 text-sm ml-4 font-mono">
              guest@tylergeorge.tech ~ /portfolio
            </div>
          </div>

          <div 
            ref={terminalRef}
            className="bg-gray-900 p-4 h-[600px] overflow-y-auto font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((entry, index) => (
              <div key={index} className="mb-3">
                {entry.input && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-white">{entry.input}</span>
                  </div>
                )}
                {entry.output && <div className="mt-1 ml-6">{entry.output}</div>}
              </div>
            ))}

            <div className="flex items-center gap-2">
              <span className="text-green-400">➜</span>
              <span className="text-blue-400">~</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-transparent text-white outline-none caret-white"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-gray-400 text-sm">
          <p>Press ESC to close terminal • Click anywhere to focus input</p>
        </div>
      </div>
    </div>
  );
};

export default TerminalCLI;