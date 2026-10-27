(function () {
  'use strict';
  var dlg = document.getElementById('dlg'), body = document.getElementById('dlgBody');
  var store = document.getElementById('dtStore'), title = document.getElementById('dlgTitle');
  var label = document.getElementById('dlgLabel'), current = null, lastFocus = null;
  function setHash(key) {
    var url = new URL(location.href); url.hash = key ? 'detail=' + encodeURIComponent(key) : '';
    history.replaceState(null, '', url);
  }
  function syncTitle() {
    if (!current) return;
    var t = current.querySelector('[data-dt-title]'); title.innerHTML = t ? t.innerHTML : '';
    var section = document.getElementById(current.getAttribute('data-section'));
    var h = section && section.querySelector('h2,h3'); label.textContent = h ? h.textContent : '';
  }
  function closeDetail(updateHash) {
    if (!current) return;
    store.appendChild(current); current = null; dlg.hidden = true; document.body.style.overflow = '';
    document.querySelector('main')?.removeAttribute('inert');
    document.getElementById('hdr')?.removeAttribute('inert');
    if (updateHash !== false) setHash('');
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }
  function openDetail(key, updateHash) {
    var panel = document.getElementById('dt-' + key); if (!panel || !dlg) return;
    if (current === panel) return;
    if (!current) lastFocus = document.activeElement;
    if (current) store.appendChild(current);
    current = panel; body.appendChild(panel); syncTitle(); dlg.hidden = false;
    document.body.style.overflow = 'hidden';
    document.querySelector('main')?.setAttribute('inert', '');
    document.getElementById('hdr')?.setAttribute('inert', '');
    if (updateHash !== false) setHash(key);
    document.getElementById('dlgClose').focus();
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-detail]');
    if (button) { event.preventDefault(); openDetail(button.getAttribute('data-detail')); return; }
    var card = event.target.closest('[data-card-detail]');
    if (card && !event.target.closest('a,button,input,select')) openDetail(card.getAttribute('data-card-detail'));
  });
  ['dlgClose', 'dlgBottomClose'].forEach(function(id) { document.getElementById(id)?.addEventListener('click',closeDetail); });
  dlg?.addEventListener('click', function(e) { if (e.target === dlg) closeDetail(); });
  document.addEventListener('keydown', function(e) {
    if (!current) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDetail(); }
    if (e.key === 'Tab') {
      var nodes = Array.from(dlg.querySelectorAll('button,a[href],[tabindex="0"]')).filter(function(el) { return el.getClientRects().length && !el.disabled; });
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  function hashChanged() {
    var match = location.hash.match(/^#detail=(.+)$/);
    if (match) { try { openDetail(decodeURIComponent(match[1]),false); } catch (_) {} }
    else closeDetail(false);
  }
  window.addEventListener('hashchange', hashChanged);
  document.addEventListener('sura:language',syncTitle);
  var printOpen = false;
  window.addEventListener('beforeprint', function() {
    printOpen = !!current;
    document.querySelectorAll('[data-print-panel]').forEach(function(slot) {
      var panel = document.getElementById(slot.getAttribute('data-print-panel'));
      if (panel) slot.appendChild(panel);
    });
  });
  window.addEventListener('afterprint', function() {
    document.querySelectorAll('[data-print-panel]>.dt').forEach(function(panel) { store.appendChild(panel); });
    if (printOpen && current) body.appendChild(current);
  });
  hashChanged();
})();
