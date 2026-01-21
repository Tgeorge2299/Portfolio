const projects = [
  {
    title: "Media Server Stack",
    category: "media",
    image: "assets/plex.png",
    description:
      "Plex, Radarr, Sonarr, Prowlarr, and Overseerr running in isolated LXC containers on Proxmox with shared ZFS storage."
  },
  {
    title: "Cloudflare Tunnel + Nginx Proxy Manager",
    category: "networking",
    image: "assets/cloudflare.png",
    description:
      "Secure remote access using Cloudflare Zero Trust and Nginx Proxy Manager without exposing ports."
  },
  {
    title: "Automation Scripts",
    category: "automation",
    image: "assets/automation.png",
    description:
      "Custom scripts for backups, monitoring, notifications, and system automation."
  },
  {
    title: "Security Lab Environment",
    category: "security",
    image: "assets/security.png",
    description:
      "Kali Linux, Metasploitable, and isolated VLANs for penetration testing and defensive security practice."
  }
];

const projectsGrid = document.getElementById("projectsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

/* Render projects */
function renderProjects(filter = "all") {
  projectsGrid.innerHTML = "";

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter(project => project.category === filter);

  filteredProjects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card fade-up";

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-img">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    `;

    projectsGrid.appendChild(card);
  });

  observeFadeAnimations();
}

/* Filter button logic */
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    renderProjects(filter);
  });
});

/* Fade-up observer */
function observeFadeAnimations() {
  const faders = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(fader => observer.observe(fader));
}

/* Initial load */
renderProjects();
