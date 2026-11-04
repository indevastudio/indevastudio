/* Location landing pages (.lp): nav, mobile drawer, reveal-on-scroll and the enquiry form.
   The form saves to the Supabase "lead submissions" table (same as the other site forms)
   and, as a backup, emails the studio through EmailJS. */
(function () {
  'use strict';

  var SUPABASE_URL = 'https://rolarfaotykmprzvcmgh.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbGFyZmFvdHlrbXByenZjbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTI1OTgsImV4cCI6MjEwMjQ2ODU5OH0.B7mIRJLh9Q7rzQvrGguqjlhzIMgmoJmiq29Kl6lRkPI';
  var EMAILJS = { service: 'service_3dpadmb', template: 'template_jg3vvys', key: 'HGr3wuPNyLvmq1S14' };

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Solid nav after scrolling.
    var nav = document.getElementById('navbar');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 40); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Mobile drawer.
    var burger = document.getElementById('hamburger');
    var drawer = document.getElementById('mobileDrawer');
    if (burger && drawer) {
      var setOpen = function (open) {
        drawer.classList.toggle('open', open);
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!drawer.classList.contains('open')); });
      drawer.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
      document.addEventListener('click', function (e) { if (drawer.classList.contains('open') && !drawer.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    }

    // Reveal on scroll.
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    // Tap tracking for phone / WhatsApp / email links.
    document.querySelectorAll('[data-track]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { window.gtag && gtag('event', 'contact_click', { method: a.getAttribute('data-track'), page: location.pathname }); } catch (e) {}
      });
    });

    document.querySelectorAll('form.lp-form').forEach(setupForm);
  });

  function val(form, name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  function saveLead(row) {
    return fetch(SUPABASE_URL + '/rest/v1/lead%20submissions', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (res) {
      if (!res.ok) throw new Error('lead insert failed: ' + res.status);
    });
  }

  function emailStudio(row, message) {
    var text = 'Name: ' + row.name + '\nPhone: ' + (row.phone || '—') + '\nEmail: ' + (row.email || '—') +
      '\nLocation: ' + (row.city || '—') + '\nType: ' + (row.project_type || '—') + '\nArea: ' + (row.area || '—') +
      '\nStart: ' + (row.timeline || '—') + '\nBudget: ' + (row.budget || '—') + '\nPage: ' + row.source +
      (message ? '\n\n' + message : '');
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS.service, template_id: EMAILJS.template, user_id: EMAILJS.key,
        template_params: {
          to_name: 'Indéva studio', to_email: 'ceo@indevastudio.com',
          from_name: row.name, from_email: row.email || '', reply_to: row.email || '',
          phone: row.phone || '—', project_type: row.project_type || '—', area: row.area || '—',
          budget: row.budget || '—', timeline: row.timeline || '—',
          subject: 'new enquiry from ' + row.name + ' (' + row.source + ')', message: text
        }
      })
    }).then(function (res) { if (!res.ok) throw new Error('email failed: ' + res.status); });
  }

  function setupForm(form) {
    var status = form.querySelector('.lp-status');
    var button = form.querySelector('button[type="submit"]');
    var label = button ? button.textContent : '';

    function say(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'lp-status' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      Array.prototype.forEach.call(form.querySelectorAll('.err'), function (el) { el.classList.remove('err'); });

      var name = val(form, 'name'), phone = val(form, 'phone'), email = val(form, 'email');
      if (!name) { form.elements.name.classList.add('err'); form.elements.name.focus(); return say('Please add your name.', 'bad'); }
      var phoneOk = phone.replace(/[^0-9]/g, '').length >= 7;
      var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (!phoneOk && !emailOk) {
        (form.elements.phone || form.elements.email).classList.add('err');
        return say('Please add a phone number or an email so we can reply.', 'bad');
      }
      if (email && !emailOk) { form.elements.email.classList.add('err'); return say('That email address looks incomplete.', 'bad'); }

      var page = form.getAttribute('data-page') || location.pathname;
      var row = {
        name: name, phone: phone || null, email: email || null,
        city: val(form, 'location') || null, project_type: val(form, 'type') || null,
        area: val(form, 'area') || null, timeline: val(form, 'start') || null,
        budget: val(form, 'budget') || null, source: 'form:' + page
      };
      var message = val(form, 'message');

      if (button) { button.disabled = true; button.textContent = 'sending…'; }
      say('');

      saveLead(row)
        .then(function () { emailStudio(row, message).catch(function () {}); })
        .catch(function () { return emailStudio(row, message); })
        .then(function () {
          try { window.gtag && gtag('event', 'lead_form_submit', { event_category: 'lead', event_label: page, project_type: row.project_type || '—' }); } catch (err) {}
          form.reset();
          say('Thank you — we have your details and will reply within one working day.', 'ok');
        })
        .catch(function () {
          say('Sorry, that did not send. Please call or WhatsApp +91 97178 81083.', 'bad');
        })
        .then(function () { if (button) { button.disabled = false; button.textContent = label; } });
    });
  }
})();
