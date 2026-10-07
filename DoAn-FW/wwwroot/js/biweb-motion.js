/**
 * BIWEB MOTION ENGINE
 * Hiệu ứng chuyển động cho giao diện BIWEB — lấy cảm hứng từ https://www.biweb.vn/
 * Không phụ thuộc thư viện ngoài (vanilla JS, ~ES5 để tương thích rộng).
 *
 *  1. Preloader             6. Card spotlight theo chuột
 *  2. Thanh tiến trình cuộn  7. Ripple khi click nút
 *  3. Scroll reveal + stagger 8. Tilt 3D mockup hero
 *  4. Tách chữ tiêu đề       9. Marquee đối tác
 *  5. Đếm số tự động        10. Speed-dial FAB, back-to-top ring, scrollspy
 */
(function () {
    'use strict';

    var doc = document;
    var root = doc.documentElement;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    root.classList.add('bi-js');

    function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
    function onReady(fn) {
        if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn);
    }

    /* ------------------------------------------------------------
       1. PRELOADER
       ------------------------------------------------------------ */
    var readyCallbacks = [];
    var isReady = false;
    function whenPageReady(fn) { if (isReady) fn(); else readyCallbacks.push(fn); }
    function markReady() {
        if (isReady) return;
        isReady = true;
        var pre = doc.getElementById('biPreloader');
        if (pre) {
            pre.classList.add('is-done');
            setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 700);
        }
        readyCallbacks.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
        readyCallbacks = [];
    }
    if (doc.readyState === 'complete') setTimeout(markReady, 150);
    else window.addEventListener('load', function () { setTimeout(markReady, 250); });
    setTimeout(markReady, 2500); // chốt an toàn nếu có tài nguyên tải chậm

    /* ------------------------------------------------------------
       2. SCROLL PROGRESS + BACK-TO-TOP RING
       ------------------------------------------------------------ */
    function initScrollProgress() {
        var bar = doc.createElement('div');
        bar.id = 'biScrollProgress';
        doc.body.appendChild(bar);

        var btn = doc.getElementById('btnBackToTop');
        var circle = null, C = 2 * Math.PI * 20;
        if (btn) {
            btn.insertAdjacentHTML('beforeend',
                '<svg class="bi-ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20" ' +
                'stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"></circle></svg>');
            circle = btn.querySelector('circle');
        }

        var ticking = false;
        function update() {
            var max = (doc.documentElement.scrollHeight - window.innerHeight) || 1;
            var p = Math.min(1, Math.max(0, window.pageYOffset / max));
            bar.style.transform = 'scaleX(' + p + ')';
            if (circle) circle.style.strokeDashoffset = String(C * (1 - p));
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ------------------------------------------------------------
       3 + 4. SCROLL REVEAL & WORD SPLIT
       ------------------------------------------------------------ */
    function splitWords(el) {
        if (!el || el.getAttribute('data-split') === '1') return;
        el.setAttribute('data-split', '1');
        var i = 0;
        Array.prototype.slice.call(el.childNodes).forEach(function (node) {
            if (node.nodeType === 3) {
                var parts = node.textContent.split(/(\s+)/);
                var frag = doc.createDocumentFragment();
                parts.forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
                    var s = doc.createElement('span');
                    s.className = 'bi-word';
                    s.style.setProperty('--i', i++);
                    s.textContent = part;
                    frag.appendChild(s);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === 1 && node.tagName !== 'BR') {
                // Giữ nguyên phần tử con (vd. chữ gradient) như một khối
                var w = doc.createElement('span');
                w.className = 'bi-word';
                w.style.setProperty('--i', i++);
                node.parentNode.insertBefore(w, node);
                w.appendChild(node);
            }
        });
        el.classList.add('bi-split');
    }

    function mark(el, type, delay) {
        if (!el || el.hasAttribute('data-reveal') || el.closest('[data-reveal]')) return false;
        var pos = window.getComputedStyle(el).position;
        if (pos === 'fixed') return false;
        el.setAttribute('data-reveal', type || 'up');
        if (delay) el.style.setProperty('--bi-delay', delay + 's');
        return true;
    }

    function prepareReveal() {
        var main = doc.querySelector('main') || doc.body;

        /* --- Hero --- */
        var hero = doc.getElementById('hero');
        if (hero) {
            var cols = hero.querySelectorAll('.container > .grid > div');
            if (cols[0]) {
                var d = 0.05;
                Array.prototype.slice.call(cols[0].children).forEach(function (child) {
                    if (child.tagName === 'H1') { splitWords(child); child.style.setProperty('--bi-delay', d + 's'); child.setAttribute('data-split-reveal', '1'); }
                    else mark(child, 'up', d);
                    d += 0.12;
                });
            }
            if (cols[1]) mark(cols[1], 'zoom', 0.35);
            var partners = doc.getElementById('partners');
            if (partners) {
                mark(partners.firstElementChild, 'up');
                var pg = partners.querySelector('.grid');
                if (pg) $all(':scope > *', pg).forEach(function (c, i) { mark(c, 'flip', i * 0.08); });
            }
        }

        /* --- Tiêu đề section --- */
        $all('section .bi-title, section h2', main).forEach(function (h) {
            if (h.closest('#hero')) return;
            if (!h.closest('[data-reveal]')) { mark(h, 'up', 0.05); }
            var head = h.parentElement;
            if (!head) return;
            var k = 0;
            Array.prototype.slice.call(head.children).forEach(function (sib) {
                if (sib === h) return;
                mark(sib, sib.classList.contains('bi-tag') ? 'down' : 'up', 0.1 + (k++) * 0.1);
            });
        });

        /* --- Lưới card / cột --- */
        $all('section .grid', main).forEach(function (grid) {
            if (grid.closest('#hero') && !grid.closest('#partners')) return;
            if (grid.closest('[data-reveal]')) return;
            var kids = Array.prototype.slice.call(grid.children).filter(function (c) {
                return c.offsetParent !== null || window.getComputedStyle(c).display !== 'none';
            });
            if (!kids.length) return;
            var twoCol = kids.length === 2 && /lg:grid-cols-(2|12)|md:grid-cols-2/.test(grid.className);
            kids.forEach(function (c, i) {
                var type = twoCol ? (i === 0 ? 'left' : 'right') : (kids.length >= 4 && i % 2 ? 'zoom' : 'up');
                if (c.querySelector('[data-reveal],[data-split-reveal]')) {
                    // Cột đã có tiêu đề animate → animate các khối con còn lại
                    var j = 0;
                    Array.prototype.slice.call(c.children).forEach(function (cc) {
                        if (cc.hasAttribute('data-reveal') || cc.hasAttribute('data-split-reveal') || cc.querySelector('[data-reveal],[data-split-reveal]')) return;
                        mark(cc, 'up', 0.15 + (j++) * 0.08);
                    });
                    return;
                }
                mark(c, type, Math.min(i, 6) * 0.09);
            });
        });

        /* --- Khối lẻ còn lại trong section --- */
        $all('section .container > *', main).forEach(function (el) {
            if (el.closest('#hero') && !el.closest('#partners')) return;
            if (el.querySelector('[data-reveal],[data-split-reveal]')) return;
            mark(el, 'blur');
        });

        /* --- Footer --- */
        var footer = doc.querySelector('footer .grid');
        if (footer) Array.prototype.slice.call(footer.children).forEach(function (c, i) { mark(c, 'up', i * 0.08); });
    }

    function startReveal() {
        var targets = $all('[data-reveal], [data-split-reveal]');
        function reveal(el) {
            el.classList.add('is-in');
            if (el.hasAttribute('data-reveal')) {
                var delay = parseFloat(el.style.getPropertyValue('--bi-delay')) || 0;
                // Dọn thuộc tính sau khi xong để hover/transition gốc hoạt động lại
                setTimeout(function () {
                    el.removeAttribute('data-reveal');
                    el.classList.remove('is-in');
                    el.style.removeProperty('--bi-delay');
                }, 900 + delay * 1000);
            }
        }
        if (reduceMotion || !('IntersectionObserver' in window)) { targets.forEach(reveal); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        targets.forEach(function (t) { io.observe(t); });
    }

    /* ------------------------------------------------------------
       5. COUNTERS
       ------------------------------------------------------------ */
    function initCounters() {
        var re = /^([+\-−]?)(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?)([%+xXkKmMbB\s]?[^\d]{0,14})$/;
        var els = $all('main .font-black, main .font-extrabold, main [class*="text-3xl"], main [class*="text-4xl"]').filter(function (el) {
            if (el.children.length) return false;
            var t = el.textContent.trim();
            if (/^0\d/.test(t)) return false;
            return re.test(t);
        });
        if (!els.length) return;

        function run(el) {
            var m = el.textContent.trim().match(re);
            if (!m) return;
            var raw = m[2];
            var isDecimal = raw.indexOf(',') > -1 || (raw.indexOf('.') > -1 && raw.split('.').length === 2 && raw.split('.')[1].length <= 2);
            var decimals = 0;
            var thousands = !isDecimal && raw.indexOf('.') > -1;
            if (isDecimal) {
                var sep = raw.indexOf(',') > -1 ? ',' : '.';
                decimals = raw.split(sep)[1].length;
            }
            var target = parseFloat(raw.replace(/\./g, isDecimal && raw.indexOf('.') > -1 ? '.' : '').replace(',', '.'));
            if (!isFinite(target) || target === 0) return;
            var start = null, dur = Math.min(2200, 900 + String(Math.round(target)).length * 180);
            function fmt(v) {
                if (decimals) return v.toFixed(decimals);
                var s = String(Math.round(v));
                return thousands ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s;
            }
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min(1, (ts - start) / dur);
                var eased = 1 - Math.pow(2, -10 * p);
                el.textContent = m[1] + fmt(target * (p === 1 ? 1 : eased)) + m[3];
                if (p < 1) window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }

        if (reduceMotion || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
            });
        }, { threshold: 0.5 });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ------------------------------------------------------------
       6. CARD SPOTLIGHT
       ------------------------------------------------------------ */
    function initSpotlight() {
        var cards = $all('section .grid > *, .bi-card, .bi-spot').filter(function (c) {
            var cls = c.className || '';
            if (typeof cls !== 'string') return false;
            var pos = window.getComputedStyle(c).position;
            return pos !== 'absolute' && pos !== 'fixed';
        });
        cards.forEach(function (c) {
            c.classList.add('bi-spot');
            var sec = c.closest('section');
            if (sec && (/text-white|from-\[#0F172A\]|bg-\[#0F172A\]/.test(sec.className) || sec.id === 'contact')) {
                c.classList.add('bi-spot-dark');
            } else if (/bg-\[#0F172A\]|bg-slate-9|bi-card-dark/.test(c.className)) {
                c.classList.add('bi-spot-dark');
            }
        });
        if (!finePointer) return;
        doc.addEventListener('pointermove', function (e) {
            var card = e.target.closest && e.target.closest('.bi-spot');
            if (!card) return;
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }

    /* ------------------------------------------------------------
       6B. AMBIENT GLOW ORBS & FLOATING MICRO-WIDGETS
       ------------------------------------------------------------ */
    function initAmbientGlow() {
        var targets = ['#hero', '#ecosystem', '#core-tech', '#contact'];
        targets.forEach(function (sel) {
            var sec = doc.querySelector(sel);
            if (!sec || sec.querySelector('.bi-ambient-orb')) return;
            var pos = window.getComputedStyle(sec).position;
            if (pos === 'static') sec.style.position = 'relative';

            var orbBlue = doc.createElement('div');
            orbBlue.className = 'bi-ambient-orb bi-orb-blue';
            var orbCyan = doc.createElement('div');
            orbCyan.className = 'bi-ambient-orb bi-orb-cyan';

            sec.insertBefore(orbCyan, sec.firstChild);
            sec.insertBefore(orbBlue, sec.firstChild);
        });
    }

    function initFloatingWidgets() {
        var badges = $all('#hero .rounded-2xl, #hero .rounded-xl, #hero .shadow-lg, section [class*="bg-emerald"], section [class*="bg-blue-"]').filter(function (el) {
            var txt = el.textContent.trim();
            return /([+\-]\d+%|\d+\.?\d*x|Realtime|USA|Delaware|Uptime)/i.test(txt) && el.children.length <= 3;
        });
        badges.forEach(function (b, idx) {
            b.classList.add(idx % 2 === 0 ? 'bi-float-slow' : 'bi-float-delayed');
        });

        $all('.fa-circle.text-emerald-400, .fa-circle.text-green-400, .fa-circle.text-emerald-500').forEach(function (dot) {
            dot.classList.add('bi-dot-pulse');
        });
    }

    /* ------------------------------------------------------------
       7. RIPPLE
       ------------------------------------------------------------ */
    function initRipple() {
        doc.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('.bi-btn-primary, .bi-btn-outline, .bi-btn-highlight');
            if (!btn) return;
            var r = btn.getBoundingClientRect();
            var size = Math.max(r.width, r.height);
            var s = doc.createElement('span');
            s.className = 'bi-ripple';
            s.style.width = s.style.height = size + 'px';
            s.style.left = (e.clientX - r.left - size / 2) + 'px';
            s.style.top = (e.clientY - r.top - size / 2) + 'px';
            btn.appendChild(s);
            setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
        });
    }

    /* ------------------------------------------------------------
       8. HERO: tilt 3D + sheen + CTA pulse
       ------------------------------------------------------------ */
    function initHero() {
        var hero = doc.getElementById('hero');
        if (!hero) return;
        var cta = hero.querySelector('.bi-btn-primary');
        if (cta) cta.classList.add('bi-cta-pulse');

        var mock = hero.querySelector('[class*="rounded-[32px]"]');
        if (!mock) return;
        mock.classList.add('bi-sheen');
        if (!finePointer || reduceMotion) return;
        mock.classList.add('bi-tilt');
        var area = mock.parentElement;
        area.addEventListener('pointermove', function (e) {
            if (window.innerWidth < 1024) return;
            var r = area.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            mock.classList.add('is-tilting');
            mock.style.setProperty('transform', 'perspective(1200px) rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg) translateZ(0)', 'important');
        });
        area.addEventListener('pointerleave', function () {
            mock.classList.remove('is-tilting');
            mock.style.setProperty('transform', 'perspective(1200px) rotateY(0) rotateX(0)', 'important');
        });
    }

    /* ------------------------------------------------------------
       9. MARQUEE ĐỐI TÁC
       ------------------------------------------------------------ */
    function initMarquee() {
        var partners = doc.getElementById('partners');
        if (!partners || partners.querySelector('.bi-marquee')) return;
        var names = $all('.grid .space-y-1\\.5 > div', partners).map(function (d) { return d.textContent.trim(); }).filter(Boolean);
        if (names.length < 4) return;
        var html = names.map(function (n) {
            return '<span class="bi-marquee-item"><i class="fa fa-check-circle"></i>' + n.replace(/</g, '&lt;') + '</span>';
        }).join('');
        var wrap = doc.createElement('div');
        wrap.className = 'bi-marquee';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.innerHTML = '<div class="bi-marquee-track">' + html + html + '</div>';
        partners.appendChild(wrap);
    }

    /* ------------------------------------------------------------
       10. FAB speed-dial, scrollspy, mobile menu
       ------------------------------------------------------------ */
    function initFab() {
        var top = doc.getElementById('btnBackToTop');
        if (!top || !top.parentElement) return;
        var fab = top.parentElement;
        fab.classList.add('bi-fab');
        var links = $all(':scope > a', fab);
        if (links.length < 2) return;
        var hotline = links[links.length - 1];
        links.slice(0, -1).forEach(function (a) { a.classList.add('bi-fab-item'); });

        var toggle = doc.createElement('button');
        toggle.type = 'button';
        toggle.className = 'bi-fab-toggle';
        toggle.setAttribute('aria-label', 'Mở liên hệ nhanh');
        toggle.innerHTML = '<i class="fa fa-plus"></i>';
        fab.insertBefore(toggle, hotline);
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            fab.classList.toggle('is-open');
        });
        doc.addEventListener('click', function (e) {
            if (!fab.contains(e.target)) fab.classList.remove('is-open');
        });
    }

    function initScrollSpy() {
        var navLinks = $all('#siteHeader nav a.bi-nav-link[href*="#"]');
        if (!navLinks.length || !('IntersectionObserver' in window)) return;
        var map = {};
        navLinks.forEach(function (a) {
            var id = a.getAttribute('href').split('#')[1];
            var sec = id && doc.getElementById(id);
            if (sec) (map[id] = map[id] || []).push(a);
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                navLinks.forEach(function (a) { a.classList.remove('active'); });
                (map[en.target.id] || []).forEach(function (a) { a.classList.add('active'); });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        Object.keys(map).forEach(function (id) { io.observe(doc.getElementById(id)); });
    }

    function initMobileMenu() {
        var menu = doc.getElementById('mobileMenu');
        if (!menu) return;
        menu.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href*="#"]');
            if (a && typeof window.toggleMobileMenu === 'function' && !menu.classList.contains('hidden')) window.toggleMobileMenu();
        });
    }

    /* ------------------------------------------------------------
       11. SMART ROUTING & GITHUB PAGES PATH RESOLVER
       ------------------------------------------------------------ */
    function initLinkRouting() {
        var host = window.location.hostname;
        var path = window.location.pathname;
        var isGH = host.endsWith('github.io') || path.startsWith('/biweb');

        if (isGH) {
            var prefix = '/biweb';
            // Rewrite all root-relative links to include repo prefix
            $all('a[href^="/"]').forEach(function (a) {
                var href = a.getAttribute('href');
                if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/biweb')) {
                    var newHref = prefix + href;
                    // Standardize folder index
                    if (newHref === '/biweb/Home/Index' || newHref === '/biweb/') newHref = '/biweb/';
                    else if (!newHref.includes('.') && !newHref.endsWith('/') && !newHref.includes('?')) newHref += '/';
                    a.setAttribute('href', newHref);
                }
            });

            // Intercept clicks to prevent browser jumping out of repo root
            doc.addEventListener('click', function (e) {
                var a = e.target.closest && e.target.closest('a');
                if (!a) return;
                var href = a.getAttribute('href');
                if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/biweb')) {
                    e.preventDefault();
                    var targetUrl = prefix + href;
                    if (!targetUrl.includes('.') && !targetUrl.endsWith('/') && !targetUrl.includes('?')) targetUrl += '/';
                    window.location.href = targetUrl;
                }
            }, true);
        }
    }

    /* ------------------------------------------------------------
       12. CLIENT-SIDE SHOPPING CART INTERACTION & BADGE
       ------------------------------------------------------------ */
    function initClientCart() {
        var cartBadge = doc.querySelector('#siteHeader a[href*="Cart"] span, #siteHeader .fa-shopping-cart + span');
        function getCart() {
            try { return JSON.parse(localStorage.getItem('biweb_cart_items') || '[]'); } catch (e) { return []; }
        }
        function saveCart(items) {
            localStorage.setItem('biweb_cart_items', JSON.stringify(items));
            updateBadge();
        }
        function updateBadge() {
            var items = getCart();
            var total = items.reduce(function (sum, it) { return sum + (it.qty || 1); }, 0);
            $all('header a[href*="Cart"] span, nav a[href*="Cart"] span, .bi-cart-badge').forEach(function (badge) {
                badge.textContent = total;
                badge.style.display = total > 0 ? 'inline-flex' : 'none';
            });
        }
        updateBadge();

        // Global addToCart helper
        window.biwebAddToCart = function (product) {
            var items = getCart();
            var existing = items.find(function (it) { return it.id === product.id; });
            if (existing) {
                existing.qty = (existing.qty || 1) + (product.qty || 1);
            } else {
                items.push({
                    id: product.id || String(Date.now()),
                    name: product.name || 'Giải Pháp BIWEB',
                    price: product.price || 0,
                    img: product.img || '/img/sp1.jpg',
                    spec: product.spec || 'Standard License',
                    qty: product.qty || 1
                });
            }
            saveCart(items);
            if (typeof window.biToast === 'function') {
                window.biToast('Đã thêm giải pháp vào giỏ hàng thành công! 🛒', 'success');
            } else {
                alert('Đã thêm ' + product.name + ' vào giỏ hàng thành công!');
            }
        };

        // Intercept cart add buttons
        doc.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('a[href*="InsertCart"], button[data-add-cart]');
            if (!btn) return;
            var card = btn.closest('.product-home-card, [data-product-id]') || doc;
            var nameEl = card.querySelector('h3 a, h1, [data-product-name]');
            var priceEl = card.querySelector('.font-black[class*="text-"], [data-product-price]');
            var imgEl = card.querySelector('img');
            
            var name = nameEl ? nameEl.textContent.trim() : 'Giải Pháp BIWEB License';
            var priceText = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '2500000';
            var price = parseInt(priceText, 10) || 2500000;
            var img = imgEl ? imgEl.src : '/img/sp1.jpg';
            var id = (btn.getAttribute('href') || '').split('id=')[1] || String(Date.now());

            window.biwebAddToCart({ id: id, name: name, price: price, img: img, spec: 'BIWEB Enterprise License', qty: 1 });
            
            // If on static showcase or demo mode, prevent default server roundtrip
            if (window.location.hostname.endsWith('github.io') || window.location.pathname.startsWith('/biweb')) {
                e.preventDefault();
            }
        });
    }

    /* ------------------------------------------------------------
       BOOT
       ------------------------------------------------------------ */
    onReady(function () {
        var steps = [initScrollProgress, initAmbientGlow, initFloatingWidgets, initMarquee, initSpotlight, initRipple, initHero, initFab, initScrollSpy, initMobileMenu, initCounters, initLinkRouting, initClientCart];
        steps.forEach(function (fn) { try { fn(); } catch (e) { console.error('[biweb-motion]', e); } });
        if (!reduceMotion) {
            try { prepareReveal(); } catch (e) { console.error('[biweb-motion]', e); }
        }
        whenPageReady(startReveal);
    });
})();
