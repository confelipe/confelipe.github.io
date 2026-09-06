document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Toggle (Dark / Light Mode) - Shared across all pages
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // ==========================================================================
  // 3. Skills Filter Tabs (Home page)
  // ==========================================================================
  const skillFilterBtns = document.querySelectorAll('#skills .filter-tabs .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillFilterBtns.length > 0 && skillCards.length > 0) {
    skillFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        skillFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 4. Articles Category Filter (artigos.html)
  // ==========================================================================
  const articleCategoryFilters = document.getElementById('articleCategoryFilters');
  const articleCards = document.querySelectorAll('.articles-grid .article-card');

  if (articleCategoryFilters && articleCards.length > 0) {
    articleCategoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        articleCategoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-article-filter');

        articleCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // 5. Copy Email / Article Link Handlers
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  const copyArticleLinkBtn = document.getElementById('copyArticleLink');
  const toast = document.getElementById('toast');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailText.innerText.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('E-mail copiado para a área de transferência!');
      }).catch(err => {
        console.error('Falha ao copiar e-mail:', err);
      });
    });
  }

  if (copyArticleLinkBtn) {
    copyArticleLinkBtn.addEventListener('click', () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('Link do artigo copiado com sucesso!');
      }).catch(err => {
        console.error('Falha ao copiar link:', err);
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ==========================================================================
  // 6. GitHub Public Repositories (repositorios.html)
  //    STRICT GUARANTEE: Only public repos (private === false)
  // ==========================================================================
  const reposGrid = document.getElementById('reposGrid');
  const repoSearchInput = document.getElementById('repoSearchInput');
  const repoLangFilters = document.getElementById('repoLangFilters');
  const repoCountText = document.getElementById('repoCountText');

  if (reposGrid && repoSearchInput) {
    let allPublicRepos = [];
    let selectedLang = 'all';

    // Static Fallback in case of GitHub rate limit
    const fallbackRepos = [
      {
        name: "kaspersky_wazuh",
        html_url: "https://github.com/confelipe/kaspersky_wazuh",
        description: "Decoders e regras customizadas para integração avançada do Kaspersky Cloud Console com Wazuh SIEM.",
        language: "Wazuh / XML",
        stargazers_count: 1,
        forks_count: 0,
        private: false
      },
      {
        name: "CrowdSec-Hub",
        html_url: "https://github.com/confelipe/CrowdSec-Hub",
        description: "Coleções de bouncers, parsers e cenários de detecção comportamental e mitigação ativa contra tráfego malicioso.",
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "mailguard",
        html_url: "https://github.com/confelipe/mailguard",
        description: "Automação e monitoramento de segurança para tráfego de e-mails corporativos e políticas antispam com Python.",
        language: "Python",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "desafio-devops",
        html_url: "https://github.com/confelipe/desafio-devops",
        description: "Pipeline CI/CD automatizada, conteinerização e provisionamento em cluster Kubernetes.",
        language: "Go",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "projetohurb",
        html_url: "https://github.com/confelipe/projetohurb",
        description: "API resiliente em Python para conversão de moedas com suporte a cache Redis e alta concorrência.",
        language: "Python",
        stargazers_count: 1,
        forks_count: 0,
        private: false
      },
      {
        name: "challenge-delta",
        html_url: "https://github.com/confelipe/challenge-delta",
        description: "Arquitetura e pipeline DevOps para provisionamento de infraestrutura escalável e observável.",
        language: "Shell",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "dockerhub",
        html_url: "https://github.com/confelipe/dockerhub",
        description: "Scripts e Dockerfiles para automação de builds e publicação de imagens de contêineres.",
        language: "Shell",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "sports-broadcast-api",
        html_url: "https://github.com/confelipe/sports-broadcast-api",
        description: "API de eventos e transmissões esportivas com consumo de endpoints e normalização de dados.",
        language: "JavaScript",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      },
      {
        name: "php",
        html_url: "https://github.com/confelipe/php",
        description: "Biblioteca de integração e microsserviços em PHP.",
        language: "PHP",
        stargazers_count: 0,
        forks_count: 0,
        private: false
      }
    ];

    async function loadPublicRepos() {
      try {
        const response = await fetch('https://api.github.com/users/confelipe/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('API limit or error');
        const data = await response.json();
        
        // STRICT PUBLIC FILTER: only public repos (private === false)
        allPublicRepos = data.filter(repo => repo.private === false && repo.name !== 'confelipe.github.io');
        
        if (allPublicRepos.length === 0) {
          allPublicRepos = fallbackRepos;
        }
      } catch (err) {
        console.warn('Utilizando repositórios locais de contingência:', err);
        allPublicRepos = fallbackRepos;
      }
      applyRepoFilters();
    }

    function getLanguageColor(lang) {
      const colors = {
        'Python': '#3572A5',
        'Go': '#00ADD8',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Shell': '#89e051',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'PHP': '#4F5D95',
        'Wazuh / XML': '#f87171'
      };
      return colors[lang] || 'var(--accent-primary)';
    }

    function applyRepoFilters() {
      const query = repoSearchInput.value.toLowerCase().trim();

      const filtered = allPublicRepos.filter(repo => {
        const matchesQuery = !query || 
          (repo.name && repo.name.toLowerCase().includes(query)) ||
          (repo.description && repo.description.toLowerCase().includes(query)) ||
          (repo.language && repo.language.toLowerCase().includes(query));

        const matchesLang = selectedLang === 'all' || 
          (repo.language && repo.language.toLowerCase() === selectedLang.toLowerCase());

        return matchesQuery && matchesLang;
      });

      renderRepoCards(filtered);
    }

    function renderRepoCards(repos) {
      if (repoCountText) {
        repoCountText.innerHTML = `<i class="fa-solid fa-code-branch"></i> Exibindo <strong>${repos.length}</strong> de <strong>${allPublicRepos.length}</strong> repositórios públicos`;
      }

      if (repos.length === 0) {
        reposGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 14px;">
            <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Nenhum repositório público encontrado</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Tente ajustar os termos de busca ou o filtro de tecnologia.</p>
          </div>
        `;
        return;
      }

      reposGrid.innerHTML = repos.map(repo => {
        const lang = repo.language || 'Geral';
        const desc = repo.description || 'Repositório de automação e infraestrutura técnica de Carlos Felipe.';
        const dotColor = getLanguageColor(lang);

        return `
          <div class="repo-card">
            <div class="repo-header">
              <div class="repo-title-wrap">
                <i class="fa-regular fa-folder-closed"></i>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                  ${repo.name}
                </a>
              </div>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted);" title="Ver no GitHub">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <p class="repo-desc">${desc}</p>
            <div class="repo-footer">
              <span class="repo-lang">
                <span class="repo-lang-dot" style="background-color: ${dotColor}"></span>
                ${lang}
              </span>
              <div class="repo-stats">
                <span class="repo-stat-item" title="Estrelas">
                  <i class="fa-regular fa-star"></i> ${repo.stargazers_count || 0}
                </span>
                <span class="repo-stat-item" title="Forks">
                  <i class="fa-solid fa-code-fork"></i> ${repo.forks_count || 0}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    repoSearchInput.addEventListener('input', applyRepoFilters);

    if (repoLangFilters) {
      repoLangFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          repoLangFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedLang = btn.getAttribute('data-lang');
          applyRepoFilters();
        });
      });
    }

    loadPublicRepos();
  }

  // Set Current Year in Footer
  const yearSpans = document.querySelectorAll('#currentYear');
  yearSpans.forEach(span => {
    span.textContent = new Date().getFullYear();
  });
});
