import data from './site_data.json' assert { type: 'json' };

function createSlider(beforeUrl, afterUrl, label) {
  const tpl = document.createElement('div');
  tpl.className = "w-full sm:w-[340px] flex flex-col items-center";
  tpl.innerHTML = `
    <div class="w-full aspect-[73/54] max-w-[340px] rounded-2xl shadow-xl bg-zinc-100/80 relative before-after-slider overflow-hidden mb-3 ring-2 ring-blue-100">
      <img src="${beforeUrl}" class="absolute top-0 left-0 w-full h-full object-cover rounded-2xl" draggable="false" alt="Before" style="z-index:1;">
      <img src="${afterUrl}" class="absolute top-0 left-0 w-full h-full object-cover rounded-2xl mask" draggable="false" alt="After" style="z-index:2;">
      <div class="slider-handle absolute top-0 left-1/2 transition-transform" style="z-index:3;">
        <div class="flex flex-col items-center h-full">
          <div class="w-9 h-9 rounded-full bg-blue-600 shadow-lg border-4 border-white flex items-center justify-center hover:bg-blue-700 transition cursor-ew-resize" style="margin-top:43%;">
            <i data-lucide="chevrons-left-right" class="text-white"></i>
          </div>
          <div class="w-1.5 h-24 rounded-lg bg-blue-300/60 my-1"></div>
        </div>
      </div>
    </div>
    <div class="text-zinc-600 text-lg font-semibold text-center mb-1">${label}</div>
    <div class="flex gap-2 text-sm text-zinc-400">
      <span>Before</span> <span>|</span> <span>After</span>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 20);
  return tpl;
}

function setUpSliders() {
  const area = document.getElementById('before-after-area');
  area.innerHTML = '';
  data.before_after.forEach(d => {
    const card = createSlider(d.before, d.after, d.label);
    area.appendChild(card);
    enableSlider(card);
  });
}

// Adapted vanilla before-after touch+mouse
function enableSlider(wrapper) {
  const mask = wrapper.querySelector('.mask');
  const handle = wrapper.querySelector('.slider-handle');
  const bg = wrapper.querySelector('.before-after-slider');
  let pos = 50, dragging = false, width = 340;

  function setPos(v) {
    pos = Math.max(0, Math.min(100, v));
    mask.style.clipPath = `inset(0 0 0 ${pos}%)`;
    handle.style.left = `calc(${pos}% - 18px)`;
    bg.style.cursor = dragging ? 'ew-resize' : 'default';
    gsap.to(mask, {clipPath: `inset(0 0 0 ${pos}%)`, duration: .18, ease: "power2.out"});
    gsap.to(handle, {left: `calc(${pos}% - 18px)`, duration: .18, ease: "power2.out"});
  }
  function getX(e) {
    if (e.touches) return e.touches[0].clientX;
    return e.clientX;
  }
  function down(e) {
    dragging = true;
    width = bg.offsetWidth;
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, {passive:false});
    window.addEventListener('touchend', up);
    e.preventDefault();
  }
  function move(e) {
    if (!dragging) return;
    const rect = bg.getBoundingClientRect();
    let x = getX(e) - rect.left;
    setPos((x/width)*100);
    e.preventDefault();
  }
  function up() {
    dragging = false;
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', up);
    window.removeEventListener('touchmove', move);
    window.removeEventListener('touchend', up);
  }
  handle.addEventListener('mousedown', down);
  handle.addEventListener('touchstart', down);
  bg.addEventListener('mousedown', down);
  bg.addEventListener('touchstart', down);
  setPos(50);
}

window.addEventListener('DOMContentLoaded', setUpSliders);
