const header = document.querySelector('.site-header');
const mobileMenu = document.querySelector('.mobile-menu');
const menuTriggers = [...document.querySelectorAll('.menu-btn, .menu-icon')];
const menuClose = document.querySelector('.menu-close');

function scrollHeader(){
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 28);
}
window.addEventListener('scroll', scrollHeader, {passive:true});
scrollHeader();

function setMenu(open){
  if (!mobileMenu) return;
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuTriggers.forEach(btn => {
    btn.setAttribute('aria-expanded', String(open));
    if (btn.classList.contains('menu-btn')) btn.textContent = open ? 'Close' : 'Menu';
  });
}
menuTriggers.forEach(btn => btn.addEventListener('click', () => setMenu(!mobileMenu?.classList.contains('open'))));
menuClose?.addEventListener('click', () => setMenu(false));
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
}, {threshold:.10, rootMargin:'0px 0px -30px'}) : null;

document.querySelectorAll('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('show'));

document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.archive-item[data-cat]').forEach(item => {
    item.classList.toggle('hidden', filter !== 'all' && item.dataset.cat !== filter);
  });
}));

// Project archive lightbox with full gallery navigation.
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Κλείσιμο">×</button><button class="lightbox-prev" aria-label="Προηγούμενη">←</button><img alt=""><button class="lightbox-next" aria-label="Επόμενη">→</button><div class="lightbox-caption"></div><div class="lightbox-count"></div>';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxCount = lightbox.querySelector('.lightbox-count');
let lbImages=[], lbIndex=0;
function renderLightbox(){
  if(!lbImages.length) return;
  lightboxImg.src=lbImages[lbIndex];
  lightboxCount.textContent=`${String(lbIndex+1).padStart(2,'0')} / ${String(lbImages.length).padStart(2,'0')}`;
  const many=lbImages.length>1;
  lightbox.querySelector('.lightbox-prev').style.display=many?'block':'none';
  lightbox.querySelector('.lightbox-next').style.display=many?'block':'none';
}
function closeLightbox(){ lightbox.classList.remove('open'); document.body.classList.remove('menu-open'); }
document.querySelectorAll('[data-lightbox]').forEach(card => card.addEventListener('click', e => {
  e.preventDefault();
  try{ lbImages=JSON.parse(card.dataset.gallery||'[]'); }catch(_){ lbImages=[]; }
  const img=card.querySelector('img');
  if(!lbImages.length && img) lbImages=[img.currentSrc||img.src];
  if(!lbImages.length) return;
  lbIndex=0;
  lightboxImg.alt=img?.alt||'';
  lightboxCaption.textContent=card.dataset.caption||card.querySelector('h3,.project-title')?.textContent||'';
  renderLightbox(); lightbox.classList.add('open'); document.body.classList.add('menu-open');
}));
lightbox.querySelector('.lightbox-prev').addEventListener('click',e=>{e.stopPropagation();lbIndex=(lbIndex-1+lbImages.length)%lbImages.length;renderLightbox()});
lightbox.querySelector('.lightbox-next').addEventListener('click',e=>{e.stopPropagation();lbIndex=(lbIndex+1)%lbImages.length;renderLightbox()});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowLeft'){lbIndex=(lbIndex-1+lbImages.length)%lbImages.length;renderLightbox()}
  if(e.key==='ArrowRight'){lbIndex=(lbIndex+1)%lbImages.length;renderLightbox()}
});

// Contact form fallback: opens a pre-filled email.
const contactForm = document.querySelector('#contact-form');
if (contactForm){
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const phone = data.get('phone') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent('Αίτημα επικοινωνίας από ' + name);
    const body = encodeURIComponent(`Όνομα: ${name}\nΤηλέφωνο: ${phone}\nEmail: ${data.get('email') || ''}\n\n${message}`);
    const status = contactForm.querySelector('.form-status');
    if (status) status.textContent = 'Ανοίγουμε το email σας για να σταλεί το αίτημα.';
    window.location.href = `mailto:info@tsobanoudi.gr?subject=${subject}&body=${body}`;
  });
}


// Selected project galleries on the homepage.
document.querySelectorAll('.project-gallery[data-gallery]').forEach(card => {
  let images=[]; try{images=JSON.parse(card.dataset.gallery||'[]')}catch(e){}
  if(!images.length)return;
  const img=card.querySelector(':scope > img'), count=card.querySelector('.gallery-count'); let index=0;
  images.slice(1).forEach(src=>{const p=new Image();p.src=src});
  const render=()=>{card.classList.add('is-changing');setTimeout(()=>{img.src=images[index];count.textContent=`${String(index+1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;requestAnimationFrame(()=>card.classList.remove('is-changing'))},120)};
  card.querySelector('.gallery-prev')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();index=(index-1+images.length)%images.length;render()});
  card.querySelector('.gallery-next')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();index=(index+1)%images.length;render()});
});

// Touch navigation for galleries.
function addHorizontalSwipe(el, onLeft, onRight){
  if(!el) return;
  let startX=0,startY=0,tracking=false;
  el.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0]; startX=t.clientX; startY=t.clientY; tracking=true;
  },{passive:true});
  el.addEventListener('touchend',e=>{
    if(!tracking) return; tracking=false;
    const t=e.changedTouches[0], dx=t.clientX-startX, dy=t.clientY-startY;
    if(Math.abs(dx)<48 || Math.abs(dx)<Math.abs(dy)*1.15) return;
    dx<0 ? onLeft() : onRight();
  },{passive:true});
}

document.querySelectorAll('.project-gallery[data-gallery]').forEach(card=>{
  const next=card.querySelector('.gallery-next');
  const prev=card.querySelector('.gallery-prev');
  addHorizontalSwipe(card,()=>next?.click(),()=>prev?.click());
});
addHorizontalSwipe(lightbox,
  ()=>{if(lightbox.classList.contains('open')&&lbImages.length>1){lbIndex=(lbIndex+1)%lbImages.length;renderLightbox()}},
  ()=>{if(lightbox.classList.contains('open')&&lbImages.length>1){lbIndex=(lbIndex-1+lbImages.length)%lbImages.length;renderLightbox()}}
);
