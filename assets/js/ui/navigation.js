/* ==========================================================================

   SALMAN — Navegación, secciones dinámicas, filtros, galería y modal (ui/navigation.js)

   ========================================================================== */

(() => {

  'use strict';



  const S = (window.SALMAN = window.SALMAN || {});

  const { $, $$, esc, money, track, openDialog, closeDialog, projectById } = S;

  const getLang = () => (S.state?.lang === 'en' ? 'en' : 'es');

  const t = (key) => S.t(key);

  const tf = (key, vars) => S.tf(key, vars);



  /* ------------------------------ render de secciones ------------------------------ */

  function renderProjects() {

    const grid = $('#projectsGrid');

    if (!grid) return;

    const lang = getLang();

    const portfolioProjects = PROJECTS.filter((p) => p.id !== 'playa-cangrejo');

    grid.innerHTML = portfolioProjects.map((p) => {

      const badgeClass = p.statusKey === 'building' ? '' : ' project-card__badge--gold';

      const ctaLabel = lang === 'es' ? 'Ver proyecto' : 'View project';

      return `

      <article class="project-card" data-type="${p.type}" data-id="${p.id}">

        <div class="project-card__media">

          <img src="assets/img/${p.img}-900.webp" srcset="assets/img/${p.img}-560.webp 560w, assets/img/${p.img}-900.webp 900w"

               sizes="(max-width:760px) 100vw, 46vw" width="900" height="600" loading="lazy" decoding="async"

               alt="${esc(p.name)} — ${esc(p.location[lang])}">

          <span class="project-card__badge${badgeClass}">${esc(p.status[lang])}</span>

          <span class="project-card__arrow" aria-hidden="true">

            <svg class="icon"><use href="#i-up-right"></use></svg>

          </span>

        </div>

        <div class="project-card__body">

          <span class="project-card__loc">${esc(p.location[lang])}</span>

          <h3 class="project-card__name">${esc(p.name)}</h3>

          <p class="project-card__hook">${esc(p.hook[lang])}</p>

          <div class="project-card__cta">

            <span>${ctaLabel} &rarr;</span>

          </div>

        </div>

        <a class="project-card__link" href="#portafolio" data-project-open="${p.id}"

           aria-label="${esc(t('ui.view'))}: ${esc(p.name)}"></a>

      </article>`;

    }).join('');

    applyFilter(S.state?.filter || 'all', false);

  }



  function renderServices() {

    const wrap = $('#servicesGrid');

    if (!wrap) return;

    const lang = getLang();

    wrap.innerHTML = SERVICES.map((group, gi) => `

      <section class="service-group" aria-labelledby="svc-${gi}">

        <div class="service-group__head">

          <span>0${gi + 1}</span>

          <h3 id="svc-${gi}">${esc(group.group[lang])}</h3>

        </div>

        <p class="service-group__intro">${esc(group.intro[lang])}</p>

        <ul>

          ${group.items.map((item, i) => `

            <li class="service-item">

              <span class="service-item__num">0${i + 1}</span>

              <div>

                <h4>${esc(item.t[lang])}</h4>

                <p>${esc(item.d[lang])}</p>

              </div>

            </li>`).join('')}

        </ul>

      </section>`).join('');

  }



  function renderFAQ() {

    const list = $('#faqList');

    if (!list) return;

    const lang = getLang();

    list.innerHTML = FAQ.map((item, i) => `

      <div class="faq__item">

        <button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a-${i}">

          <span>${esc(item.q[lang])}</span>

          <svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>

        </button>

        <div class="faq__a" id="faq-a-${i}" role="region">

          <div><p>${esc(item.a[lang])}</p></div>

        </div>

      </div>`).join('');

  }



  function applyFilter(filter, doTrack = true) {

    if (S.state) S.state.filter = filter;

    let visible = 0;

    $$('.project-card').forEach((card) => {

      const show = filter === 'all' || card.dataset.type === filter;

      card.classList.toggle('is-hidden', !show);

      if (show) visible += 1;

    });

    $$('.filter').forEach((btn) => {

      const active = btn.dataset.filter === filter;

      btn.classList.toggle('is-active', active);

      btn.setAttribute('aria-pressed', String(active));

    });

    const count = $('#projectsCount');

    if (count) count.textContent = tf('ui.projectsCount', { n: visible });

    if (doTrack) track('filter_projects', { filter });

  }



  /* ------------------------------ galería ------------------------------ */

  const GALLERY_ALTS = {

    1: 'Marina privada de Playa Cangrejo al atardecer',

    2: 'Lobby y área social de Playa Cangrejo',

    3: 'Club de playa de Playa Cangrejo'

  };



  function setGallery(img, index) {

    const main = $('#flagshipImage');

    if (!main) return;

    main.classList.add('is-swapping');

    setTimeout(() => {

      main.src = `assets/img/${img}-900.webp`;

      main.srcset = `assets/img/${img}-560.webp 560w, assets/img/${img}-900.webp 900w`;

      main.alt = GALLERY_ALTS[index] || GALLERY_ALTS[1];

      main.classList.remove('is-swapping');

    }, 180);

    $$('.gallery__thumb').forEach((thumb) => {

      const active = Number(thumb.dataset.index) === index;

      thumb.classList.toggle('is-active', active);

      thumb.setAttribute('aria-selected', String(active));

    });

    const idx = $('#galleryIndex');

    if (idx) idx.textContent = `0${index}`;

  }



  /* ------------------------------ modal de proyecto ------------------------------ */

  function openProject(id) {

    const p = projectById(id);

    if (!p) return;

    const lang = getLang();

    const modal = $('#projectModal');

    const content = $('#projectModalContent');

    if (!content) return;

    content.innerHTML = `

      <div class="modal__media">

        <img src="assets/img/${p.img}-900.webp" width="900" height="670" alt="${esc(p.name)} — ${esc(p.location[lang])}">

      </div>

      <div class="modal__body">

        <p class="kicker">${esc(p.typeLabel[lang])}</p>

        <h2 id="projectModalTitle">${esc(p.name)}</h2>

        <p class="modal__loc">${esc(p.location[lang])} · ${esc(p.status[lang])}</p>

        <p class="modal__desc">${esc(p.desc[lang])}</p>

        <div class="exclusive-badge" style="margin: 16px 0;">

          <strong>Lista Cero · Preventa Privada</strong>

          <span>Cartagena de Indias · Cupos Limitados</span>

        </div>

        <h3 class="modal__h3">${esc(t('ui.modal.amenities'))}</h3>

        <p class="modal__text">${esc(p.amenities[lang].join(' · '))}</p>

        <h3 class="modal__h3">${esc(t('ui.modal.payment'))}</h3>

        <p class="modal__text">${esc(p.payment[lang])}</p>

        <button class="btn btn--dark" type="button" data-lead="brochure" data-project="${p.id}">

          ${esc(t('ui.modal.brochure'))}

          <svg class="icon" aria-hidden="true"><use href="#i-download"></use></svg>

        </button>

        <button class="btn btn--outline" type="button" data-scroll="#agenda">

          ${esc(t('ui.modal.cta'))}

          <svg class="icon" aria-hidden="true"><use href="#i-calendar"></use></svg>

        </button>

        <div class="modal__gallery">

          ${p.gallery.map((img) => `<img src="assets/img/${img}-560.webp" width="560" height="420" alt="${esc(p.name)}" loading="lazy">`).join('')}

        </div>

        <p class="modal__note">${esc(t('ui.modal.note'))}</p>

      </div>`;

    openDialog(modal);

    track('view_project', { project: p.id });

  }



  /* ------------------------------ header y menú móvil ------------------------------ */

  function initHeader() {

    const header = $('#siteHeader');

    const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('load', onScroll);

    window.addEventListener('hashchange', () => window.setTimeout(onScroll, 60));

    window.setTimeout(onScroll, 120);



    const menu = $('#mobileMenu');

    const btn = $('#menuBtn');

    const setMenu = (open) => {

      if (!menu || !btn) return;

      menu.hidden = !open;

      btn.setAttribute('aria-expanded', String(open));

      document.body.classList.toggle('is-locked', open);

      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');

    };

    btn?.addEventListener('click', () => setMenu(menu.hidden));

    $$('a', menu || document.createElement('div')).forEach((a) => a.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {

      if (event.key === 'Escape' && menu && !menu.hidden) setMenu(false);

    });

    window.addEventListener('resize', () => {

      if (window.innerWidth > 1180 && menu && !menu.hidden) setMenu(false);

    });

  }



  /* ------------------------------ delegación de eventos ------------------------------ */

  function initDelegates() {

    document.addEventListener('click', (event) => {

      const target = event.target;



      const waLink = target.closest('a[href*="wa.me"]');

      if (waLink) track('whatsapp_click', { source: 'link' });



      const closeBtn = target.closest('[data-close-dialog]');

      if (closeBtn) { closeDialog(closeBtn.closest('dialog')); return; }



      const projectBtn = target.closest('[data-project-open]');

      if (projectBtn) {

        event.preventDefault();

        openProject(projectBtn.dataset.projectOpen);

        return;

      }



      const leadBtn = target.closest('[data-lead]');

      if (leadBtn) {

        event.preventDefault();

        if ($('#projectModal')?.hasAttribute('open')) closeDialog($('#projectModal'));

        S.openLead?.(leadBtn.dataset.lead, leadBtn.dataset.project);

        return;

      }



      const scrollBtn = target.closest('[data-scroll]');

      if (scrollBtn) {

        const targetEl = $(scrollBtn.dataset.scroll);

        if (targetEl) {

          closeDialog($('#projectModal'));

          setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);

        }

        return;

      }



      const filterBtn = target.closest('[data-filter]');

      if (filterBtn) { applyFilter(filterBtn.dataset.filter); return; }



      const galleryBtn = target.closest('.gallery__thumb');

      if (galleryBtn) { setGallery(galleryBtn.dataset.img, Number(galleryBtn.dataset.index)); return; }



      const faqBtn = target.closest('.faq__q');

      if (faqBtn) {

        const item = faqBtn.closest('.faq__item');

        const open = item.classList.contains('is-open');

        $$('.faq__item').forEach((el) => {

          el.classList.remove('is-open');

          $('.faq__q', el)?.setAttribute('aria-expanded', 'false');

        });

        if (!open) {

          item.classList.add('is-open');

          faqBtn.setAttribute('aria-expanded', 'true');

          track('faq_open', { index: $$('.faq__item').indexOf(item) });

        }

        return;

      }



      const langBtn = target.closest('[data-lang]');

      if (langBtn) { S.applyLanguage(langBtn.dataset.lang); return; }



      const chatTrigger = target.closest('[data-chat-open], [data-chat-prompt]');
        window.SALMAN?.unlockBrowserAudio?.();

      if (chatTrigger) {

        event.preventDefault();

        if (!window.Salma) return;

        const prompt = chatTrigger.dataset.chatPrompt;

        if (prompt) window.Salma.ask(prompt);

        else window.Salma.open();

        return;

      }



      const anchor = target.closest('a[href^="#"]');

      if (anchor && anchor.getAttribute('href') === '#') {

        event.preventDefault();

        return;

      }

      if (anchor && anchor.getAttribute('href') !== '#') {

        const id = anchor.getAttribute('href');

        const el = id ? $(id) : null;

        if (el) {

          event.preventDefault();

          el.scrollIntoView({ behavior: 'smooth', block: 'start' });

          if (window.innerWidth <= 1180 && $('#mobileMenu') && !$('#mobileMenu').hidden) {

            $('#mobileMenu').hidden = true;

            $('#menuBtn')?.setAttribute('aria-expanded', 'false');

            document.body.classList.remove('is-locked');

          }

        }

      }

    });

  }



  Object.assign(S, {

    renderProjects,

    renderServices,

    renderFAQ,

    applyFilter,

    setGallery,

    openProject,

    initHeader,

    initDelegates

  });

})();

