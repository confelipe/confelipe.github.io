document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light Mode)
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
    if (theme === 'light') {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  // 2. Mobile Menu Toggle
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

  // 3. Skills Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
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

  // 4. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  const toast = document.getElementById('toast');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailText.innerText.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('E-mail copiado para a área de transferência!');
      }).catch(err => {
        console.error('Falha ao copiar:', err);
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

  // 5. GitHub Public Repositories (Live Fetch with Fallback)
  const reposGrid = document.getElementById('reposGrid');
  const repoSearchInput = document.getElementById('repoSearchInput');
  let allRepos = [];

  // Static Fallback Data in case of GitHub API rate limit (60 req/h)
  const fallbackRepos = [
    {
      name: "kaspersky_wazuh",
      html_url: "https://github.com/confelipe/kaspersky_wazuh",
      description: "Decoders e regras customizadas para integração do Kaspersky Cloud Console com Wazuh SIEM.",
      language: "XML / Wazuh",
      stargazers_count: 1,
      forks_count: 0
    },
    {
      name: "CrowdSec-Hub",
      html_url: "https://github.com/confelipe/CrowdSec-Hub",
      description: "Coleções de bouncers, parsers e cenários de detecção comportamental e defesa de rede.",
      language: "JavaScript / Sec",
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: "mailguard",
      html_url: "https://github.com/confelipe/mailguard",
      description: "Automação e monitoramento de segurança para tráfego de e-mails corporativos e políticas antispam.",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: "desafio-devops",
      html_url: "https://github.com/confelipe/desafio-devops",
      description: "Pipeline CI/CD automatizada, conteinerização e provisionamento em cluster Kubernetes.",
      language: "Go",
      stargazers_count: 0,
      forks_count: 0
    },
    {
      name: "projetohurb",
      html_url: "https://github.com/confelipe/projetohurb",
      description: "API resiliente em Python para conversão de moedas com suporte a cache Redis e alta concorrência.",
      language: "Python",
      stargazers_count: 1,
      forks_count: 0
    },
    {
      name: "challenge-delta",
      html_url: "https://github.com/confelipe/challenge-delta",
      description: "Arquitetura e pipeline DevOps para provisionamento de infraestrutura escalável e observável.",
      language: "DevOps",
      stargazers_count: 0,
      forks_count: 0
    }
  ];

  async function loadGitHubRepos() {
    if (!reposGrid) return;

    try {
      const response = await fetch('https://api.github.com/users/confelipe/repos?sort=updated&per_page=100');
      if (!response.ok) throw new Error('API limit or error');
      const data = await response.json();
      
      // Filter out confelipe.github.io if you want only other projects or keep top
      allRepos = data.filter(r => r.name !== 'confelipe.github.io');
      if (allRepos.length === 0) allRepos = fallbackRepos;
      renderRepos(allRepos);
    } catch (err) {
      console.warn('Using fallback repos:', err);
      allRepos = fallbackRepos;
      renderRepos(allRepos);
    }
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
      'PHP': '#4F5D95'
    };
    return colors[lang] || 'var(--accent-primary)';
  }

  function renderRepos(repos) {
    if (!reposGrid) return;
    if (repos.length === 0) {
      reposGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          Nenhum repositório encontrado com esse termo.
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

  if (repoSearchInput) {
    repoSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = allRepos.filter(r => 
        (r.name && r.name.toLowerCase().includes(query)) ||
        (r.description && r.description.toLowerCase().includes(query)) ||
        (r.language && r.language.toLowerCase().includes(query))
      );
      renderRepos(filtered);
    });
  }

  loadGitHubRepos();

  // 6. Articles Modal Reader
  const articleData = {
    siem: {
      badge: "Cybersecurity & SIEM",
      title: "Implementando SIEM Corporativo com Wazuh, Suricata IDS e CrowdSec",
      meta: "Por Carlos Felipe · Fevereiro 2026 · 7 min de leitura · Frameworks: ISO 27001 & MITRE ATT&CK",
      body: `
        <p>Em ambientes corporativos modernos, a segurança reativa baseada apenas em antivírus de endpoint tradicional é insuficiente. A visibilidade holística exige correlação de eventos em tempo real, telemetria profunda de rede e capacidade de bloqueio automatizado.</p>
        
        <h4>1. A Arquitetura de Defesa Unificada</h4>
        <p>A estratégia adotada conecta três camadas essenciais:</p>
        <ul>
          <li><strong>Wazuh SIEM:</strong> Coleta e análise de logs de agentes (Linux/Windows Server), integridade de arquivos (FIM), auditoria de conformidade (CIS Benchmarks) e detecção de anomalias.</li>
          <li><strong>Suricata IDS/IPS:</strong> Inspeção profunda de pacotes (DPI) em tempo real no tráfego de rede, gerando alertas formatados em JSON compatíveis com decoders customizados.</li>
          <li><strong>CrowdSec:</strong> Camada de proteção colaborativa que identifica IPs maliciosos por comportamento (port scan, brute force, exploit attempts) e orquestra remediação ativa (bouncers no firewall).</li>
        </ul>

        <h4>2. Enriquecimento e Decoders Customizados</h4>
        <p>Para integrar fontes heterogêneas (como consoles de endpoint Kaspersky Cloud e firewalls de borda), desenvolvemos decoders e regras personalizadas no Wazuh:</p>
        <pre>&lt;!-- Exemplo de Regra Customizada para Detecção de Ataque --&gt;
&lt;group name="soc,network_attack,"&gt;
  &lt;rule id="100250" level="12"&gt;
    &lt;if_sid&gt;87000&lt;/if_sid&gt;
    &lt;match&gt;SURICATA ALERT: Exploit Attempt&lt;/match&gt;
    &lt;description&gt;Suricata: Tentativa de exploit detectada na rede interna&lt;/description&gt;
    &lt;mitre&gt;
      &lt;id&gt;T1190&lt;/id&gt;
    &lt;/mitre&gt;
  &lt;/rule&gt;
&lt;/group&gt;</pre>

        <h4>3. Resultados e Compliance</h4>
        <p>A consolidação da esteira no OpenSearch possibilitou dashboards centralizados para o SOC, rastreabilidade completa de incidentes e atendimento direto aos requisitos de auditoria externa da <strong>ISO 27001</strong> e <strong>PCI-DSS</strong>.</p>
      `
    },
    identity: {
      badge: "Automação & Identidade",
      title: "Automação Segura de Identidade no Active Directory com TypeScript e APIs",
      meta: "Por Carlos Felipe · Janeiro 2026 · 5 min de leitura · Stack: Node.js, TypeScript, Microsoft Graph",
      body: `
        <p>A gestão manual de identidades e contas de usuários é uma das maiores causas de gargalos operacionais e vulnerabilidades de segurança (contas órfãs, privilégios excessivos e demoras no onboarding/offboarding).</p>

        <h4>1. O Desafio em Ambientes Multi-Domain Controller</h4>
        <p>Operações de reset de senhas, desbloqueio de credenciais e sincronização híbrida com o <strong>Microsoft Entra ID (Azure AD)</strong> frequentemente geravam inconsistências de replicação e dependência de intervenção humana da equipe de infraestrutura.</p>

        <h4>2. A Solução: Middleware de Identidade Resiliente</h4>
        <p>Desenvolvemos um middleware modular em <strong>Node.js / TypeScript</strong> estruturado em princípios de Zero Trust e privilégio mínimo (Least Privilege):</p>
        <ul>
          <li><strong>Comunicação Criptografada (LDAPS):</strong> Todas as operações com os DCs ocorrem via conexões TLS seguras com validação mútua de certificados.</li>
          <li><strong>Testes Automatizados (~68 testes):</strong> Cobertura extensiva garantindo que nenhuma transação de privilégio falhe silenciosamente.</li>
          <li><strong>Auditoria e Log Estruturado:</strong> Cada requisição registra o autor, IP de origem, timestamp e status diretamente para o pipeline do Graylog.</li>
        </ul>

        <h4>3. Impacto Operacional</h4>
        <p>A automação eliminou cerca de <strong>15 horas semanais</strong> de tarefas manuais de service desk, com tempo de resposta caindo de minutos para poucos milissegundos.</p>
      `
    },
    ha: {
      badge: "Infraestrutura & Resiliência",
      title: "Arquitetura de Alta Disponibilidade (HA) com F5 BIG-IP e Docker Swarm",
      meta: "Por Carlos Felipe · Outubro 2025 · 6 min de leitura · Resiliência, Zero Downtime & DR",
      body: `
        <p>Em operações críticas de comércio eletrônico e aplicações empresariais, cada segundo de indisponibilidade gera perda de faturamento e quebra de SLA. Construir tolerância a falhas precisa ir além de simplesmente duplicar servidores.</p>

        <h4>1. Estratégia de Balanceamento e Failover Inteligente</h4>
        <p>A arquitetura foi implementada utilizando <strong>F5 BIG-IP</strong> em topologia Active/Standby com sincronização contínua de sessões e health checks adaptativos:</p>
        <ul>
          <li><strong>Health Checks Avançados:</strong> Monitoramento não apenas de porta TCP, mas de respostas HTTP sintéticas avaliando a integridade dos bancos de dados subjacentes.</li>
          <li><strong>Sessões Persistentes:</strong> Cookie insertion otimizado garantindo continuidade para transações ativas dos usuários.</li>
        </ul>

        <h4>2. Orquestração com Docker Swarm e Keepalived</h4>
        <p>Na camada de aplicação, clusters conteinerizados com Docker Swarm distribuídos em nós redundantes garantiram recuperação automática em caso de crash de processos:</p>
        <pre># Exemplo de configuração de resiliência e auto-healing
deploy:
  replicas: 4
  update_config:
    parallelism: 1
    delay: 10s
    order: start-first
  restart_policy:
    condition: on-failure
    max_attempts: 3</pre>

        <h4>3. Redução de 90% no MTTR</h4>
        <p>Com failover automático transparente e esteiras de deploy "blue-green", o tempo médio de recuperação (MTTR) foi reduzido em 90%, atingindo disponibilidade contínua sem interrupções perceptíveis para os usuários finais.</p>
      `
    }
  };

  const articleModal = document.getElementById('articleModal');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  document.querySelectorAll('.read-article-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const articleKey = btn.getAttribute('data-article');
      const article = articleData[articleKey];
      if (!article || !articleModal) return;

      modalBadge.textContent = article.badge;
      modalTitle.textContent = article.title;
      modalMeta.textContent = article.meta;
      modalBody.innerHTML = article.body;

      articleModal.classList.add('show');
      articleModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (!articleModal) return;
    articleModal.classList.remove('show');
    articleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (articleModal) {
    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && articleModal.classList.contains('show')) {
        closeModal();
      }
    });
  }

  // 7. Dynamic Footer Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// CSS animations helper
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);
