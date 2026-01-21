const projects = [
  {
    title: "Media Server Stack",
    category: "media",
    image: "assets/plex.png",
    description:
      "Plex, Radarr, Sonarr, Prowlarr, and Overseerr running in isolated LXC containers on Proxmox with shared ZFS storage.",
    technologies: ["Proxmox VE", "LXC", "ZFS", "Plex", "Radarr", "Sonarr", "Prowlarr", "Overseerr", "qBittorrent"],
    link: "#"
  },
  {
    title: "Cloudflare Tunnel + Nginx Proxy Manager",
    category: "networking",
    image: "assets/cloudflare.png",
    description:
      "Secure remote access using Cloudflare Zero Trust and Nginx Proxy Manager without exposing ports.",
    technologies: ["Cloudflare Tunnel", "Nginx Proxy Manager", "Docker", "Portainer", "DNS", "SSL/TLS"],
    link: "#"
  },
  {
    title: "Automation Scripts",
    category: "automation",
    image: "assets/automation.png",
    description:
      "Custom scripts for backups, monitoring, notifications, and system automation.",
    technologies: ["Bash", "Python", "Linux", "cron", "Docker"],
    link: "#"
  },
  {
    title: "Security Lab Environment",
    category: "security",
    image: "assets/security.png",
    description:
      "Kali Linux, Metasploitable, and isolated VLANs for penetration testing and defensive security practice.",
    technologies: ["Kali Linux", "Metasploitable", "VLANs", "PenTesting", "Security"],
    link: "#"
  }
];

const projectsGrid = document.getElementById("projectsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const body = document.body;

// CREATE MODAL ELEMENT
const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <h3 class="modal-title"></h3>
    <img class="modal-img" src="" alt="" style="width:100px; margin:1rem 0;">
    <p class="modal-description"></p>
    <p class="modal-tech"></p>
    <a class="modal-link btn btn-outline" href="#" target="_blank">View Project</a>
  </div>
`;
body.appendChild(modal);

const modalTitle = modal.querySelector(".modal-title");
const modalImg = modal.querySelector(".modal-img");
const modalDescription = modal.querySelector(".modal-description");
const modalTech = modal.querySelector(".modal-tech");
const modalLink = modal.querySelector(".modal-link");
const closeModal = modal.querySelector(".close");

// OPEN MODAL FUNCTION
function openModal(project) {
  modalTitle.textContent = project.title;
  modalImg.src = project.image;
  modalImg.alt = project.title;
  modalDescription.textContent = project.description;
  modalTech.textContent = "Technologies: " + project.technologies.join(", ");
  modalLink.href = project.link;
  modal.style.display = "block";
}

// CLOSE MODAL
closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if(e.target === modal) modal.style.display = "none";
}

// RENDER PROJECTS
function renderProjects(filter = "all") {
  projectsGrid.innerHTML = "";
  const filteredProjects = filter === "all" ? projects : projects.filter(p => p.category === filter);

  filteredProjects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card fade-up";

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-img">
      <h3>${project.title}</h3>
      <p>${project.description.substring(0, 80)}...</p>
    `;

    // OPEN MODAL ON CLICK
    card.addEventListener("click", () => openModal(project));

    projectsGrid.appendChild(card);
  });

  observeFadeAnimations();
}

// FILTER BUTTONS
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    renderProjects(filter);
  });
});

// FADE-UP OBSERVER
function observeFadeAnimations() {
  const faders = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(fader => observer.observe(fader));
}

// INITIAL LOAD
renderProjects();
