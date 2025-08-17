// Init AOS
AOS.init({
  duration: 900,
  easing: 'ease-out-cubic',
  once: true
});

// Elements
const hero = document.getElementById('hero');
const dashboard = document.getElementById('dashboard');
const exploreBtn = document.getElementById('exploreBtn');
const backHome = document.getElementById('backHome');

// Transition helper
function goToDashboard(){
  // Smooth fade out hero → in dashboard
  hero.classList.add('fade-out');
  setTimeout(() => {
    hero.classList.add('hidden');
    dashboard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Re-trigger AOS when dashboard loads
    AOS.refreshHard();
  }, 280);
}
function backToHero(){
  dashboard.classList.add('hidden');
  hero.classList.remove('hidden','fade-out');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  AOS.refreshHard();
}

// Clicks
exploreBtn.addEventListener('click', (e)=>{
  // prevent default anchor jump; we handle transition
  e.preventDefault();
  goToDashboard();
});
backHome.addEventListener('click', backToHero);

// Sidebar navigation – show/hide panels with transition
const navLinks = document.querySelectorAll('.navlink');
const panels = document.querySelectorAll('.panel');

function showPanel(id){
  panels.forEach(p=>{
    if(p.id === id){
      p.classList.add('show');
      // focus for accessibility
      p.setAttribute('tabindex','0');
      p.focus({preventScroll:true});
    } else {
      p.classList.remove('show');
    }
  });
  // set active state in sidebar
  navLinks.forEach(b=>{
    b.classList.toggle('active', b.dataset.target === id);
  });
  // refresh AOS for new elements
  AOS.refresh();
}

navLinks.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    showPanel(btn.dataset.target);
  });
});

// Keyboard support: ArrowUp/ArrowDown to move in sidebar
document.addEventListener('keydown', (e)=>{
  const keys = ['ArrowUp','ArrowDown'];
  if(!keys.includes(e.key)) return;
  const arr = Array.from(navLinks);
  const activeIndex = arr.findIndex(el=>el.classList.contains('active'));
  let next = activeIndex;
  if(e.key === 'ArrowDown') next = Math.min(arr.length-1, activeIndex+1);
  if(e.key === 'ArrowUp') next = Math.max(0, activeIndex-1);
  if(next !== activeIndex){
    arr[next].focus();
    arr[next].click();
  }
});

// Optional: if user lands with #dashboard in URL, open dashboard
if(location.hash === '#dashboard'){ goToDashboard(); }

/* Small fade-out animation via CSS class (defined inline here to keep JS minimal).
   If you prefer, move this into styles.css */
const style = document.createElement('style');
style.innerHTML = `
  .fade-out{ animation: fadeOut .28s ease forwards; }
  @keyframes fadeOut{ to { opacity:0; transform: translateY(-6px) } }
`;
document.head.appendChild(style);
