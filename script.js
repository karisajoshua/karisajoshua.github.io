const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const boot=document.getElementById('boot'),bootLog=document.getElementById('boot-log');
if(boot&&!reduce){const lines=['PORTFOLIO_OS 2.6.10 booting...','[ OK ] mounting /engineering','[ OK ] loading secure-systems.service','[ OK ] loading cloud-delivery.service','[ OK ] loading ai-automation.service','[ OK ] connecting github://karisajoshua','[ OK ] integrity check passed','Welcome, visitor.'];let i=0;const tick=()=>{if(i<lines.length){const d=document.createElement('div');d.textContent=lines[i++];bootLog.appendChild(d);setTimeout(tick,i===1?180:90)}else setTimeout(()=>boot.classList.add('done'),300)};tick()}else if(boot)boot.classList.add('done');

const items=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('in-view');if(entry.target.querySelector?.('.ascii-name'))entry.target.querySelector('.ascii-name').classList.add('glitching');observer.unobserve(entry.target)}),{threshold:.18,rootMargin:'0px 0px -8% 0px'});
items.forEach((item,index)=>{item.style.transitionDelay=`${Math.min(index%5*55,220)}ms`;observer.observe(item)});

const navLinks=[...document.querySelectorAll('.terminal-bar nav a')],sections=[...document.querySelectorAll('main section[id]')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(link=>link.style.color=link.getAttribute('href')===`#${entry.target.id}`?'var(--green)':'');const s=document.getElementById('sys-state');if(s)s.textContent=entry.target.id.toUpperCase()}),{threshold:.35});
sections.forEach(section=>sectionObserver.observe(section));

const progress=document.getElementById('scroll-progress'),cpu=document.getElementById('cpu'),mem=document.getElementById('mem');
const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight,p=max?scrollY/max:0;if(progress)progress.style.height=`${p*100}%`;document.documentElement.style.setProperty('--page-progress',`${p*100}%`);if(cpu)cpu.textContent=`${Math.round(12+p*47)}%`;if(mem)mem.textContent=`${Math.round(38+p*23)}%`};
addEventListener('scroll',onScroll,{passive:true});onScroll();

const hero=document.querySelector('.hero-terminal');
if(hero&&!reduce){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.transform=`perspective(1200px) rotateX(${-y*2.5}deg) rotateY(${x*3.5}deg)`});hero.addEventListener('pointerleave',()=>hero.style.transform='')}

const canvas=document.getElementById('matrix');
if(canvas&&!reduce){const ctx=canvas.getContext('2d'),chars='01{}[]<>/\\$#@*+=-_';let cols=[],w,h;const resize=()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;cols=Array(Math.ceil(w/20)).fill(1).map(()=>Math.random()*-60)};resize();addEventListener('resize',resize);const draw=()=>{ctx.fillStyle='rgba(5,8,6,.12)';ctx.fillRect(0,0,w,h);ctx.fillStyle='#4cff82';ctx.font='11px IBM Plex Mono, monospace';cols.forEach((y,i)=>{ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*20,y*20);cols[i]=y*20>h&&Math.random()>.985?0:y+.35});requestAnimationFrame(draw)};draw()}


async function loadGitHubTelemetry(){
  const sync=document.getElementById('gh-sync');
  if(!sync)return;
  try{
    const headers={Accept:'application/vnd.github+json'};
    const [profileRes,reposRes]=await Promise.all([
      fetch('https://api.github.com/users/karisajoshua',{headers}),
      fetch('https://api.github.com/users/karisajoshua/repos?per_page=100&sort=updated',{headers})
    ]);
    if(!profileRes.ok||!reposRes.ok)throw new Error('GitHub API unavailable');
    const profile=await profileRes.json(),repos=await reposRes.json();
    document.getElementById('gh-repos').textContent=profile.public_repos??'--';
    document.getElementById('gh-followers').textContent=profile.followers??'--';
    document.getElementById('gh-following').textContent=profile.following??'--';
    document.getElementById('gh-stars').textContent=repos.reduce((n,r)=>n+(r.stargazers_count||0),0);
    sync.textContent='synced '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const languageCounts={};
    repos.forEach(r=>{if(r.language)languageCounts[r.language]=(languageCounts[r.language]||0)+1});
    const langs=Object.entries(languageCounts).sort((a,b)=>b[1]-a[1]).slice(0,7),max=langs[0]?.[1]||1;
    const langBox=document.getElementById('gh-languages');
    langBox.innerHTML=langs.length?langs.map(([name,count])=>`<div class="language-row"><span>${name}</span><div class="language-track"><i style="width:${count/max*100}%"></i></div><b>${count} repo${count===1?'':'s'}</b></div>`).join(''):'<p class="telemetry-loading">No language metadata returned.</p>';
    const recent=document.getElementById('gh-recent');
    recent.innerHTML=repos.slice(0,7).map(r=>`<div class="repo-process"><a href="${r.html_url}" target="_blank" rel="noopener noreferrer">${r.name}</a><small>${r.language||'mixed'} · updated ${new Date(r.updated_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</small><span>★ ${r.stargazers_count} · ⑂ ${r.forks_count}</span></div>`).join('');
  }catch(error){
    sync.textContent='offline / rate limited';
    ['gh-languages','gh-recent'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<p class="github-error">Telemetry unavailable. GitHub may be rate-limiting anonymous requests; portfolio content remains available.</p>'});
  }
}
loadGitHubTelemetry();
