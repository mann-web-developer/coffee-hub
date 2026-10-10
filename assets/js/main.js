/**
 * Coffee Hub - Main Scripts
 * Developed by Vikash
 * Contact: +91 94780 15089
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initMenuFilters();
  initMenuSearch();
  initVideoPlayerModal();
  initTakeawayCart();
  initBackToTop();
  
  // Set current year
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

/* ==========================================================================
   1. Theme Management (Locked to Signature Warm Dark Cafe Aesthetic)
   ========================================================================== */
function initThemeToggle() {
  document.documentElement.classList.remove('light');
  try {
    localStorage.removeItem('coffeehub-theme');
  } catch (e) {}
}

/* ==========================================================================
   2. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');

  if (!openBtn || !menu) return;

  openBtn.addEventListener('click', () => {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    });
  }

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

/* ==========================================================================
   3. Interactive Menu Category Filtering
   ========================================================================== */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');

  if (!filterBtns.length || !menuItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-black', 'shadow-lg');
        b.classList.add('bg-stone-900/80', 'text-stone-300');
      });

      btn.classList.add('bg-amber-500', 'text-black', 'shadow-lg');
      btn.classList.remove('bg-stone-900/80', 'text-stone-300');

      const category = btn.getAttribute('data-category');

      menuItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat.includes(category)) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Menu Live Search
   ========================================================================== */
function initMenuSearch() {
  const searchInput = document.getElementById('menu-search');
  const menuItems = document.querySelectorAll('.menu-item-card');

  if (!searchInput || !menuItems.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    menuItems.forEach(item => {
      const name = item.querySelector('.item-name')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('.item-desc')?.textContent.toLowerCase() || '';

      if (name.includes(query) || desc.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Video Player Modal
   ========================================================================== */
function initVideoPlayerModal() {
  const modal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('video-modal-player');
  const closeBtn = document.getElementById('close-video-modal');
  const videoTriggers = document.querySelectorAll('.open-video-btn');

  if (!modal) return;

  videoTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.getAttribute('data-video-src');
      const videoTitle = btn.getAttribute('data-video-title') || 'Coffee Hub Special Video';
      
      const titleEl = document.getElementById('video-modal-title');
      if (titleEl) titleEl.textContent = videoTitle;

      if (videoPlayer && videoSrc) {
        videoPlayer.src = videoSrc;
        videoPlayer.load();
        videoPlayer.play().catch(() => {});
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  function closeVideo() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
      }
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideo();
  });
}

/* ==========================================================================
   6. WhatsApp Takeaway Tray & Quick Bill Generator
   ========================================================================== */
let takeawayCart = [];

function initTakeawayCart() {
  const addBtns = document.querySelectorAll('.add-to-tray-btn');
  const cartDrawer = document.getElementById('takeaway-tray-bar');
  const cartCountEl = document.getElementById('tray-count');
  const cartTotalEl = document.getElementById('tray-total');
  const checkoutBtn = document.getElementById('tray-whatsapp-btn');
  const clearBtn = document.getElementById('tray-clear-btn');

  if (!addBtns.length) return;

  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      takeawayCart.push({ name, price });
      updateTrayUI();

      // Mini button feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
      btn.classList.add('bg-green-600', 'text-white');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-600', 'text-white');
      }, 1000);
    });
  });

  function updateTrayUI() {
    if (!cartDrawer) return;

    if (takeawayCart.length > 0) {
      cartDrawer.classList.remove('translate-y-full');
      const total = takeawayCart.reduce((sum, item) => sum + item.price, 0);
      if (cartCountEl) cartCountEl.textContent = takeawayCart.length;
      if (cartTotalEl) cartTotalEl.textContent = '₹' + total;
    } else {
      cartDrawer.classList.add('translate-y-full');
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      takeawayCart = [];
      updateTrayUI();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (takeawayCart.length === 0) return;

      const total = takeawayCart.reduce((sum, item) => sum + item.price, 0);
      
      // Count duplicates
      const itemCounts = {};
      takeawayCart.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
      });

      let orderList = '';
      for (const [name, qty] of Object.entries(itemCounts)) {
        orderList += `• ${qty}x ${name}%0A`;
      }

      const message = `Hello Coffee Hub! ☕%0AI want to place a TAKEAWAY PRE-ORDER:%0A%0A${orderList}%0A💰 Total Bill: ₹${total}%0A(Notice: Only Dine-In & Takeaway Available)%0A%0APlease confirm when it will be ready!`;
      
      // Opens WhatsApp to cafe's phone number 9478015089
      const whatsappUrl = `https://wa.me/919478015089?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
