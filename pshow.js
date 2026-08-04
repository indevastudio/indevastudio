// ============================================================
// FEATURED PROJECTS SHOWCASE — carousels + lightbox
// Requires Swiper (loaded via CDN before this script)
// ============================================================
(function(){

  // ---- Project data: mirrors the DOM above, used by the lightbox ----
  var pshowData = [
    {
      title: 'Mini Farmhouse',
      location: 'New Delhi',
      images: [
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/desktop%20version%20banner.webp',
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/living%20room%20lobby.webp',
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/bar%20area.webp'
      ]
    },
    {
      title: 'Shanti Villa',
      location: 'New Delhi',
      images: [
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/Master%20bedroom%20design.webp',
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/living%20area.webp',
        'https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/Studio%20Workspace.webp'
      ]
    }
  ];

  var swipers = [];       // Swiper instances, indexed by project index
  var lb = document.getElementById('pshowLightbox');
  var lbImg = lb.querySelector('[data-lb-img]');
  var lbTitle = lb.querySelector('[data-lb-title]');
  var lbLoc = lb.querySelector('[data-lb-loc]');
  var lbCounter = lb.querySelector('[data-lb-counter]');
  var lbThumbs = lb.querySelector('[data-lb-thumbs]');
  var lbPrev = lb.querySelector('.pshow-lb-prev');
  var lbNext = lb.querySelector('.pshow-lb-next');
  var lbClose = lb.querySelectorAll('[data-lb-close]');
  var currentProject = 0, currentImage = 0, lastFocused = null;

  function track(name, label){
    try { gtag('event', name, { event_category: 'ProjectGallery', event_label: label }); } catch(e){}
  }

  // ---------------- Swiper init ----------------
  document.querySelectorAll('.pshow-swiper').forEach(function(el){
    var idx = parseInt(el.getAttribute('data-project'), 10);
    var sw = new Swiper(el, {
      loop: true,
      speed: 650,
      grabCursor: true,
      keyboard: { enabled: true, onlyInView: true },
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: el.querySelector('.pshow-dots'), clickable: true },
      navigation: { nextEl: el.querySelector('.pshow-next'), prevEl: el.querySelector('.pshow-prev') },
      a11y: { enabled: true, prevSlideMessage: 'Previous image', nextSlideMessage: 'Next image' },
      on: {
        slideChange: function(s){
          var real = s.realIndex;
          var counter = el.querySelector('[data-counter]');
          if (counter) counter.textContent = (real + 1) + ' / ' + pshowData[idx].images.length;
          el.setAttribute('aria-label', pshowData[idx].title + ' image gallery, image ' + (real + 1) + ' of ' + pshowData[idx].images.length);
          var thumbWrap = document.querySelector('[data-thumbs="' + idx + '"]');
          if (thumbWrap){
            thumbWrap.querySelectorAll('.pshow-thumb').forEach(function(t, i){
              t.classList.toggle('active', i === real);
            });
          }
        }
      }
    });
    swipers[idx] = sw;

    // Click main image -> open lightbox (but not when clicking nav arrows)
    el.addEventListener('click', function(e){
      if (e.target.closest('.pshow-arrow') || e.target.closest('.pshow-dots')) return;
      openLightbox(idx, sw.realIndex);
      track('open_lightbox', pshowData[idx].title);
    });
  });

  // Thumbnail strip -> jump slide
  document.querySelectorAll('.pshow-thumbs').forEach(function(wrap){
    var idx = parseInt(wrap.getAttribute('data-thumbs'), 10);
    wrap.querySelectorAll('.pshow-thumb').forEach(function(btn){
      btn.addEventListener('click', function(){
        var slide = parseInt(btn.getAttribute('data-slide'), 10);
        swipers[idx].slideToLoop(slide);
      });
    });
  });

  // ---------------- Lightbox ----------------
  function renderLightbox(){
    var proj = pshowData[currentProject];
    lbImg.classList.remove('zoomed');
    lbImg.src = proj.images[currentImage];
    lbImg.alt = proj.title + ' — image ' + (currentImage + 1) + ' of ' + proj.images.length;
    lbTitle.textContent = proj.title;
    lbLoc.textContent = proj.location;
    lbCounter.textContent = (currentImage + 1) + ' / ' + proj.images.length;
    lbThumbs.innerHTML = '';
    proj.images.forEach(function(src, i){
      var b = document.createElement('button');
      b.className = 'pshow-thumb' + (i === currentImage ? ' active' : '');
      b.setAttribute('aria-label', 'Go to image ' + (i + 1));
      var im = document.createElement('img');
      im.src = src; im.alt = ''; im.loading = 'lazy';
      b.appendChild(im);
      b.addEventListener('click', function(){ currentImage = i; renderLightbox(); });
      lbThumbs.appendChild(b);
    });
  }

  function openLightbox(projectIdx, imageIdx){
    currentProject = projectIdx;
    currentImage = imageIdx || 0;
    lastFocused = document.activeElement;
    renderLightbox();
    lb.hidden = false;
    requestAnimationFrame(function(){ lb.classList.add('open'); });
    document.body.classList.add('pshow-lock');
    if (swipers[projectIdx] && swipers[projectIdx].autoplay) swipers[projectIdx].autoplay.stop();
    lbClose[0].focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox(){
    lb.classList.remove('open');
    document.body.classList.remove('pshow-lock');
    document.removeEventListener('keydown', onKeydown);
    // sync the underlying carousel to whatever image the lightbox ended on,
    // so the gallery "returns to the same position"
    var sw = swipers[currentProject];
    if (sw){
      sw.slideToLoop(currentImage);
      if (sw.autoplay) sw.autoplay.start();
    }
    setTimeout(function(){ lb.hidden = true; }, 350);
    if (lastFocused) lastFocused.focus();
  }

  function nextImage(){
    var proj = pshowData[currentProject];
    currentImage = (currentImage + 1) % proj.images.length;
    renderLightbox();
  }
  function prevImage(){
    var proj = pshowData[currentProject];
    currentImage = (currentImage - 1 + proj.images.length) % proj.images.length;
    renderLightbox();
  }

  lbNext.addEventListener('click', nextImage);
  lbPrev.addEventListener('click', prevImage);
  lbClose.forEach(function(b){ b.addEventListener('click', closeLightbox); });
  lb.addEventListener('click', function(e){
    if (e.target === lb) closeLightbox();
  });
  lbImg.addEventListener('click', function(){
    lbImg.classList.toggle('zoomed');
  });

  function onKeydown(e){
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
    else if (e.key === 'Tab'){
      // simple focus trap within the lightbox
      var focusables = lb.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  // ---------------- Scroll-reveal for each project block ----------------
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.pshow-project[data-reveal]').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.pshow-project[data-reveal]').forEach(function(el){ el.classList.add('in-view'); });
  }

  // WhatsApp / CTA click tracking within the showcase
  document.querySelectorAll('.pshow-project .btn-wa, .pshow-project .btn-gold, .pshow-project .btn-outline').forEach(function(a){
    a.addEventListener('click', function(){
      track('project_cta_click', a.textContent.trim());
    });
  });

})();
