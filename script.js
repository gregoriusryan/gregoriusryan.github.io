const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------------------------------------------------------
   Terminal typing effect
--------------------------------------------------------- */
const terminalLines = [
  { type: 'prompt', text: 'postgres@production:~$ whoami' },
  { type: 'out',    text: 'Gregorius Ryan — Database Administrator' },
  { type: 'prompt', text: 'postgres@production:~$ cat mission.txt' },
  { type: 'out',    text: 'Administer 30+ production &amp; dev databases across' },
  { type: 'out',    text: 'PostgreSQL, Oracle, and MySQL. Migrate multi-terabyte' },
  { type: 'out',    text: 'warehouses on-prem → cloud without losing a row.' },
  { type: 'prompt', text: 'postgres@production:~$ status' },
  { type: 'rem',    text: '# 99.9% uptime · 0 data loss on cutovers' },
];

const terminalBody = document.getElementById('terminalBody');

function renderTerminalInstant(){
  terminalBody.innerHTML = terminalLines.map(l =>
    `<div class="${l.type}">${l.type === 'prompt' ? '' : ''}${l.text}</div>`
  ).join('');
}

async function typeTerminal(){
  if (prefersReduced){ renderTerminalInstant(); return; }

  for (const line of terminalLines){
    const div = document.createElement('div');
    div.className = line.type;
    terminalBody.appendChild(div);

    const chars = line.text.split('');
    for (const ch of chars){
      div.innerHTML += ch;
      await new Promise(r => setTimeout(r, line.type === 'prompt' ? 18 : 8));
    }
    await new Promise(r => setTimeout(r, 120));
  }
}
typeTerminal();

/* ---------------------------------------------------------
   Stat counters (animate on scroll into view)
--------------------------------------------------------- */
const statEls = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    if (prefersReduced){
      el.textContent = target + suffix;
      statObserver.unobserve(el);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });
statEls.forEach(el => statObserver.observe(el));

/* ---------------------------------------------------------
   Diagram 1: Data Warehouse migration pipeline
   On-prem Oracle -> AWS DMS -> AWS PostgreSQL
--------------------------------------------------------- */
const pipelineSvg = `
<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <style>
      .node-box{ fill:#1B2637; stroke:#263349; }
      .node-label{ font-family:'IBM Plex Mono',monospace; font-size:12px; fill:#DCE4F0; }
      .node-sub{ font-family:'IBM Plex Mono',monospace; font-size:9px; fill:#8595AF; }
      .flow-line{ stroke:#5EEAD4; stroke-width:2; fill:none; stroke-dasharray: 6 6; }
      .flow-arrow{ fill:#5EEAD4; }
      .tag{ font-family:'IBM Plex Mono',monospace; font-size:9px; fill:#F2B84B; }
    </style>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 z" class="flow-arrow"/>
    </marker>
  </defs>

  <rect x="12" y="80" width="130" height="70" rx="6" class="node-box"/>
  <text x="30" y="108" class="node-label">Oracle DB</text>
  <text x="30" y="124" class="node-sub">on-premise</text>
  <text x="30" y="138" class="tag">7+ TB</text>

  <rect x="175" y="80" width="130" height="70" rx="6" class="node-box"/>
  <text x="193" y="108" class="node-label">AWS DMS</text>
  <text x="193" y="124" class="node-sub">schema + ETL convert</text>

  <rect x="338" y="80" width="130" height="70" rx="6" class="node-box"/>
  <text x="356" y="108" class="node-label">PostgreSQL</text>
  <text x="356" y="124" class="node-sub">AWS RDS / Redshift</text>
  <text x="356" y="138" class="tag">-40% cost</text>

  <path d="M142,115 L172,115" class="flow-line" marker-end="url(#arrow)"/>
  <path d="M305,115 L335,115" class="flow-line" marker-end="url(#arrow)"/>
</svg>`;

/* ---------------------------------------------------------
   Diagram 2: Oracle EBS Finance multi-entity migration
   One EBS source fanning into 6 corporate entities
--------------------------------------------------------- */
function ebsSvg(){
  const cols = 6;
  const startX = 60, gap = 68, y = 190;
  let boxes = '', lines = '';
  for (let i = 0; i < cols; i++){
    const x = startX + i * gap;
    boxes += `<rect x="${x-24}" y="${y}" width="48" height="34" rx="4" class="node-box"/>
      <text x="${x}" y="${y+21}" text-anchor="middle" class="node-sub" style="fill:#DCE4F0">PT ${i+1}</text>`;
    lines += `<path d="M240,90 L${x},${y-4}" class="flow-line" marker-end="url(#arrow2)"/>`;
  }
  return `
  <svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>
      <style>
        .node-box{ fill:#1B2637; stroke:#263349; }
        .node-label{ font-family:'IBM Plex Mono',monospace; font-size:12px; fill:#DCE4F0; }
        .node-sub{ font-family:'IBM Plex Mono',monospace; font-size:9px; fill:#8595AF; }
        .flow-line{ stroke:#5EEAD4; stroke-width:1.5; fill:none; stroke-dasharray: 4 5; opacity:.75; }
        .flow-arrow{ fill:#5EEAD4; }
      </style>
      <marker id="arrow2" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
        <path d="M0,0 L5,2.5 L0,5 z" class="flow-arrow"/>
      </marker>
    </defs>
    <rect x="180" y="40" width="120" height="50" rx="6" class="node-box"/>
    <text x="240" y="62" text-anchor="middle" class="node-label">Oracle EBS</text>
    <text x="240" y="78" text-anchor="middle" class="node-sub">Financials source</text>
    ${lines}
    ${boxes}
  </svg>`;
}

document.getElementById('pipelineDiagram').innerHTML = pipelineSvg;
document.getElementById('ebsDiagram').innerHTML = ebsSvg();
