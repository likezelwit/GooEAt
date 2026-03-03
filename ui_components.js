import data from './site_data.json' assert { type: 'json' };

const qs = sel => document.querySelector(sel);

function navMobile() {
  const btn = qs('#nav-menu-btn');
  const nav = qs('#mobile-nav');
  let open = false;
  const links = [
    { hash: '#services', label: 'Services' },
    { hash: '#difference', label: 'Before & After' },
    { hash: '#why', label: 'Why RINSE' },
    { hash: '#reviews', label: 'Reviews' },
    { hash: '#contact', label: 'Contact' }
  ];
  function closeNav() {
    nav.style.transform = 'translateX(100%)';
    open = false;
    document.body.style.overflowY = '';
  }
  btn.onclick = () => {
    open = !open;
    nav.style.transform = open ? 'translateX(0)' : 'translateX(100%)';
    if (open) {
      nav.innerHTML = `
        <div class="flex flex-col gap-7 mt-4 font-bold text-[1.32rem] text-blue-900">
          ${links.map(l => `<a href="${l.hash}" class="p-2" data-navlink>${l.label}</a>`).join('')}
        </div>
        <a href="tel:+15559997777" class="mt-8 flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold justify-center"><i data-lucide="phone"></i>Call Now</a>
        <button id="mobile-quote" class="mt-5 w-full py-3 rounded-xl bg-blue-50 border border-zinc-200 hover:bg-blue-100 text-blue-700 font-semibold">Get a Free Quote</button>
      `;
      lucide.createIcons();
      nav.querySelectorAll('[data-navlink]').forEach(a =>
        a.onclick = () => closeNav()
      );
      nav.querySelector('#mobile-quote').onclick = () => {
        closeNav();
        window.showQuoteModal();
      };
      document.body.style.overflowY = 'hidden';
    } else {
      closeNav();
    }
  };
  nav.onclick = e => {
    if (e.target === nav) closeNav();
  };
  window.addEventListener('resize', closeNav);
}

function stickyCallBtn() {
  const el = qs('#sticky-call-btn');
  el.innerHTML = `<button aria-label="Call Now"><i data-lucide="phone"></i>Call Now</button>`;
  el.onclick = () => { location.href = 'tel:+15559997777'; };
}

function smoothScrollingLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.onclick = e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = qs(href);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
        }
      }
    };
  });
}

function heroImageBG() {
  const el = qs('#hero-bg');
  el.style.backgroundImage = `url('${data.hero_image}')`;
}

function renderServices() {
  const grid = qs('#service-cards');
  grid.innerHTML = data.services.map((s, i) => `
    <div class="service-card p-7 rounded-3xl shadow-inset flex flex-col gap-4 items-start relative group transition" style="overflow:visible;">
      <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-lg mb-2">
        <i data-lucide="${s.icon}" class="w-7 h-7 text-blue-700"></i>
      </div>
      <div class="font-bold text-xl mb-1 text-zinc-900">${s.name}</div>
      <div class="text-zinc-500 text-[1.03rem] font-medium mb-3">${s.desc}</div>
      <button class="mt-auto ml-0 px-5 py-2 bg-white border border-blue-100 rounded-full text-blue-600 font-semibold shadow hover:bg-blue-50 focus:outline-none transition active:scale-95" data-learn="${i}">Learn More</button>
    </div>
  `).join('');
  lucide.createIcons();
  grid.querySelectorAll('[data-learn]').forEach(btn => {
    btn.onclick = e => {
      window.showServiceModal(data.services[btn.getAttribute('data-learn')]);
    };
  });
}

function renderWhy() {
  const grid = qs('#why-features');
  grid.innerHTML = data.why.map(f => `
    <div class="feature-card flex flex-col gap-2 items-center p-7 text-center transition">
      <div class="mb-3">
        <i data-lucide="${f.icon}" class="w-8 h-8 text-blue-600"></i>
      </div>
      <div class="font-bold text-zinc-800 text-lg">${f.label}</div>
    </div>
  `).join('');
  lucide.createIcons();
}

function renderReviews() {
  const grid = qs('#review-cards');
  grid.innerHTML = data.reviews.map(r => `
    <div class="review-card p-6 flex flex-col gap-3 mx-auto max-w-md">
      <div class="flex gap-1">
        ${Array(r.stars).fill('<i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>').join('')}
      </div>
      <div class="text-zinc-800 font-medium text-[1.13rem] leading-relaxed">"${r.quote}"</div>
      <div class="text-zinc-500">
        <span class="font-bold">${r.name}</span> <span class="text-xs">&bull; ${r.service}</span>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function setFormServices() {
  const sel = qs('#service');
  sel.innerHTML = data.form_services.map(s => `<option value="${s}">${s}</option>`).join('');
}

function scrollAnimations() {
  function animateSection(sel, y = 80) {
    const els = document.querySelectorAll(sel);
    els.forEach(e => {
      gsap.set(e, { opacity: 0, y });
      gsap.to(e, {
        scrollTrigger: {
          trigger: e,
          start: "top 90%",
          once: true
        },
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.05 * Math.random()
      });
    });
  }
  animateSection('.service-card', 60);
  animateSection('.feature-card', 38);
  animateSection('.review-card', 60);
}

function ctaTriggers() {
  ['#open-quote','#hero-quote','#cta-quote'].forEach(x => {
    qs(x).onclick = window.showQuoteModal;
  });
}

function scrollDownArrow() {
  qs('#scroll-down-arrow').onclick = () => {
    window.scrollTo({ top: qs("#services").offsetTop - 50, behavior: 'smooth' });
  };
}

function modalOverlay() {
  const overlay = qs('#modal-overlay');
  overlay.onclick = e => {
    if (e.target === overlay && overlay.style.display !== "none") window.closeModal();
  };
  window.closeModal = (cb) => {
    overlay.innerHTML = '';
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    if (cb) cb();
  };
}

window.showQuoteModal = function() {
  window.renderBookingModal("Get a Free Quote");
};
window.showServiceModal = function(service) {
  const overlay = qs('#modal-overlay');
  overlay.innerHTML = `
    <div class="max-w-xl mx-auto mt-32 bg-white rounded-3xl p-8 shadow-2xl border border-blue-100 relative glass backdrop-blur">
      <button class="absolute top-4 right-4 text-zinc-400 hover:text-blue-600" id="svc-x"><i data-lucide="x"></i></button>
      <div class="flex gap-6 flex-col sm:flex-row items-start">
        <img src="${service.img}" alt="${service.name}" class="w-28 h-28 rounded-xl object-cover shadow-lg mb-2">
        <div>
          <div class="font-bold text-2xl mb-2 text-zinc-900">${service.name}</div>
          <div class="text-zinc-500 text-lg mb-4">${service.desc}</div>
          <button class="px-6 py-2 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 active:scale-95 transition" id="svc-quote">Get a Quote</button>
        </div>
      </div>
    </div>
  `;
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
  overlay.querySelector('#svc-x').onclick = () => window.closeModal();
  overlay.querySelector('#svc-quote').onclick = () => {
    window.closeModal(() => window.renderBookingModal("Get a Free Quote",service.name));
  };
};

window.renderBookingModal = function(headline, serviceOpt) {
  const overlay = qs('#modal-overlay');
  overlay.innerHTML = `
    <div class="max-w-md mx-auto mt-36 mb-20 bg-white/80 rounded-2xl shadow-2xl border border-blue-100 p-8 relative glass backdrop-blur">
      <button class="absolute top-3 right-3 text-zinc-400 hover:text-blue-600" id="bkm-x"><i data-lucide="x"></i></button>
      <div>
        <div class="font-bold text-2xl mb-5 text-zinc-900">${headline}</div>
        <form id="modal-quote-form" class="flex flex-col gap-4 w-full">
          <input name="name" required class="rounded-xl px-4 py-3 bg-zinc-50 border focus:ring-2 focus:ring-blue-500 font-medium shadow-inset border-zinc-200" placeholder="Name">
          <input name="phone" required type="tel" class="rounded-xl px-4 py-3 bg-zinc-50 border focus:ring-2 focus:ring-blue-500 font-medium shadow-inset border-zinc-200" placeholder="Phone">
          <input name="email" required type="email" class="rounded-xl px-4 py-3 bg-zinc-50 border focus:ring-2 focus:ring-blue-500 font-medium shadow-inset border-zinc-200" placeholder="Email">
          <select name="service" required class="rounded-xl px-3 py-3 bg-zinc-50 border focus:ring-2 focus:ring-blue-500 font-medium shadow-inset border-zinc-200">
            ${data.form_services.map(s => `<option${serviceOpt&&serviceOpt===s?' selected':''}>${s}</option>`).join('')}
          </select>
          <textarea name="message" rows="3" class="rounded-xl px-4 py-3 bg-zinc-50 border focus:ring-2 focus:ring-blue-500 font-medium shadow-inset border-zinc-200 resize-none" placeholder="Describe the job (optional)"></textarea>
          <button class="mt-3 w-full px-4 py-3 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg active:scale-95 transition" type="submit">Submit</button>
        </form>
        <div id="modal-status" class="mt-2 text-center"></div>
      </div>
    </div>
  `;
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
  overlay.querySelector('#bkm-x').onclick = () => window.closeModal();
  overlay.querySelector('#modal-quote-form').onsubmit = function(ev) {
    ev.preventDefault();
    let ok = true;
    ['name','phone','email'].forEach(f => {
      if (!this[f].value.trim()) ok = false;
    });
    if (!ok) return;
    overlay.querySelector('button[type="submit"]').disabled = true;
    overlay.querySelector('#modal-status').textContent = 'Thank you! We received your request and we’ll get back to you shortly.';
    setTimeout(() => window.closeModal(),1500);
  };
};

window.onload = () => {
  navMobile();
  stickyCallBtn();
  smoothScrollingLinks();
  heroImageBG();
  renderServices();
  renderWhy();
  renderReviews();
  setFormServices();
  scrollAnimations();
  ctaTriggers();
  scrollDownArrow();
  modalOverlay();
};
