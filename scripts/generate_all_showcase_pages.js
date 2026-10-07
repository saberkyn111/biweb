const fs = require('fs');
const path = require('path');
const http = require('http');

const repoRoot = path.resolve(__dirname, '..');
const showcaseRoot = path.join(repoRoot, 'showcase');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(fetchUrl(res.headers.location));
            }
            let data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data).toString('utf8')));
        }).on('error', reject);
    });
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fixAssets(html, depth = 0) {
    const relPrefix = depth === 0 ? './' : '../'.repeat(depth);
    
    // Replace assets paths
    html = html.replace(/href="\/css\//g, `href="${relPrefix}css/`);
    html = html.replace(/src="\/js\//g, `src="${relPrefix}js/`);
    html = html.replace(/src="\/img\//g, `src="${relPrefix}img/`);
    html = html.replace(/href="\/img\//g, `href="${relPrefix}img/`);
    html = html.replace(/href="\/lib\//g, `href="${relPrefix}lib/`);
    html = html.replace(/src="\/lib\//g, `src="${relPrefix}lib/`);
    html = html.replace(/href="\/style\.css"/g, `href="${relPrefix}style.css"`);
    html = html.replace(/href="\/favicon\.ico"/g, `href="${relPrefix}favicon.ico"`);

    // Replace internal navigation links
    if (depth === 0) {
        html = html.replace(/href="\/Home\/Index#([^"]*)"/g, 'href="#$1"');
        html = html.replace(/href="\/Home\/Index"/g, 'href="./"');
        html = html.replace(/href="\/SanPham\/Products"/g, 'href="./SanPham/Products/"');
        html = html.replace(/href="\/TaiKhoan\/DangNhap"/g, 'href="./TaiKhoan/DangNhap/"');
        html = html.replace(/href="\/TaiKhoan\/DangKi"/g, 'href="./TaiKhoan/DangKi/"');
        html = html.replace(/href="\/GioHang\/Cart"/g, 'href="./GioHang/Cart/"');
        html = html.replace(/href="\/SanPham\/ChiTietSP\?([^"]*)"/g, 'href="./SanPham/ChiTietSP/?$1"');
    } else {
        html = html.replace(/href="\/Home\/Index#([^"]*)"/g, `href="${relPrefix}#$1"`);
        html = html.replace(/href="\/Home\/Index"/g, `href="${relPrefix}"`);
        html = html.replace(/href="\/SanPham\/Products"/g, `href="${relPrefix}SanPham/Products/"`);
        html = html.replace(/href="\/TaiKhoan\/DangNhap"/g, `href="${relPrefix}TaiKhoan/DangNhap/"`);
        html = html.replace(/href="\/TaiKhoan\/DangKi"/g, `href="${relPrefix}TaiKhoan/DangKi/"`);
        html = html.replace(/href="\/GioHang\/Cart"/g, `href="${relPrefix}GioHang/Cart/"`);
        html = html.replace(/href="\/SanPham\/ChiTietSP\?([^"]*)"/g, `href="${relPrefix}SanPham/ChiTietSP/?$1"`);
    }

    // Fix form actions so they do not route to domain root on static hosts
    html = html.replace(/action="\/SanPham\/Products"/g, 'action=""');

    return html;
}

async function main() {
    console.log('Generating all showcase pages from local ASP.NET Core server (http://localhost:5005)...');

    // 1. Home
    try {
        console.log('Fetching Home (/)...');
        let homeHtml = await fetchUrl('http://localhost:5005/');
        homeHtml = fixAssets(homeHtml, 0);
        fs.writeFileSync(path.join(showcaseRoot, 'index.html'), homeHtml, 'utf8');
        console.log('Saved showcase/index.html');
    } catch (e) {
        console.error('Error fetching Home:', e);
    }

    // 2. SanPham / Products
    try {
        console.log('Fetching /SanPham/Products...');
        let prodHtml = await fetchUrl('http://localhost:5005/SanPham/Products');
        ensureDir(path.join(showcaseRoot, 'SanPham', 'Products'));
        
        // Dynamic client-side search & filter script
        const prodClientFilterScript = `
        <script>
        (function() {
            document.addEventListener('DOMContentLoaded', function() {
                var searchInput = document.querySelector('input[name="search"]');
                var sortSelect = document.getElementById('sortOrder');
                var cards = Array.from(document.querySelectorAll('main .grid > div'));

                function filterAndSort() {
                    var term = (searchInput?.value || '').toLowerCase().trim();
                    var selectedLoai = Array.from(document.querySelectorAll('input[name="MaLoaiSP"]:checked')).map(function(el){ return el.value; });
                    var selectedRam = Array.from(document.querySelectorAll('input[name="Ram"]:checked')).map(function(el){ return el.value; });
                    var selectedMem = Array.from(document.querySelectorAll('input[name="Memory"]:checked')).map(function(el){ return el.value; });

                    cards.forEach(function(card) {
                        var text = card.textContent.toLowerCase();
                        var matchSearch = !term || text.includes(term);
                        var match = matchSearch;
                        card.style.display = match ? 'flex' : 'none';
                    });

                    // Sort
                    var sortVal = sortSelect?.value;
                    if (sortVal && cards[0] && cards[0].parentElement) {
                        var parent = cards[0].parentElement;
                        var visibleCards = cards.filter(function(c) { return c.style.display !== 'none'; });
                        visibleCards.sort(function(a, b) {
                            var priceA = parseInt((a.querySelector('.font-black')?.textContent || '0').replace(/[^\\d]/g, ''), 10);
                            var priceB = parseInt((b.querySelector('.font-black')?.textContent || '0').replace(/[^\\d]/g, ''), 10);
                            var nameA = (a.querySelector('h3 a')?.textContent || '').trim().toLowerCase();
                            var nameB = (b.querySelector('h3 a')?.textContent || '').trim().toLowerCase();

                            if (sortVal === 'price_asc') return priceA - priceB;
                            if (sortVal === 'price_desc') return priceB - priceA;
                            if (sortVal === 'name_asc') return nameA.localeCompare(nameB);
                            if (sortVal === 'name_desc') return nameB.localeCompare(nameA);
                            return 0;
                        });
                        visibleCards.forEach(function(c) { parent.appendChild(c); });
                    }
                }

                if (searchInput) {
                    searchInput.addEventListener('input', filterAndSort);
                }
                if (sortSelect) {
                    sortSelect.addEventListener('change', filterAndSort);
                }
                document.querySelectorAll('#filterSidebarForm input[type="checkbox"]').forEach(function(cb) {
                    cb.addEventListener('change', function(e) {
                        e.preventDefault();
                        filterAndSort();
                    });
                });
            });
        })();
        </script>
        `;

        let prodWithRel = fixAssets(prodHtml, 2).replace('</body>', `${prodClientFilterScript}\n</body>`);
        fs.writeFileSync(path.join(showcaseRoot, 'SanPham', 'Products', 'index.html'), prodWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'SanPham', 'Products.html'), fixAssets(prodHtml, 1).replace('</body>', `${prodClientFilterScript}\n</body>`), 'utf8');
        console.log('Saved showcase/SanPham/Products/index.html & showcase/SanPham/Products.html');
    } catch (e) {
        console.error('Error fetching Products:', e);
    }

    // 3. SanPham / ChiTietSP
    try {
        console.log('Fetching /SanPham/ChiTietSP?t=1&l=1...');
        let ctHtml = await fetchUrl('http://localhost:5005/SanPham/ChiTietSP?t=1&l=1');
        ensureDir(path.join(showcaseRoot, 'SanPham', 'ChiTietSP'));
        
        let ctWithRel = fixAssets(ctHtml, 2);
        fs.writeFileSync(path.join(showcaseRoot, 'SanPham', 'ChiTietSP', 'index.html'), ctWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'SanPham', 'ChiTietSP.html'), fixAssets(ctHtml, 1), 'utf8');
        console.log('Saved showcase/SanPham/ChiTietSP/index.html & showcase/SanPham/ChiTietSP.html');
    } catch (e) {
        console.error('Error fetching ChiTietSP:', e);
    }

    // 4. TaiKhoan / DangNhap
    try {
        console.log('Fetching /TaiKhoan/DangNhap...');
        let dnHtml = await fetchUrl('http://localhost:5005/TaiKhoan/DangNhap');
        ensureDir(path.join(showcaseRoot, 'TaiKhoan', 'DangNhap'));
        
        const loginClientScript = `
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var form = document.getElementById('loginForm');
            if (form) {
                form.onsubmit = function(e) {
                    e.preventDefault();
                    var email = document.getElementById('email')?.value || 'partner@biweb.vn';
                    localStorage.setItem('biweb_user', JSON.stringify({ email: email, name: email.split('@')[0] }));
                    if (typeof window.biToast === 'function') {
                        window.biToast('Đăng nhập thành công! Chào mừng trở lại.', 'success');
                    } else {
                        alert('Đăng nhập thành công! Chào mừng ' + email);
                    }
                    setTimeout(function() {
                        window.location.href = '../../';
                    }, 800);
                };
            }
        });
        </script>
        `;

        let dnWithRel = fixAssets(dnHtml, 2).replace('</body>', `${loginClientScript}\n</body>`);
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangNhap', 'index.html'), dnWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangNhap.html'), fixAssets(dnHtml, 1).replace('</body>', `${loginClientScript}\n</body>`), 'utf8');
        console.log('Saved showcase/TaiKhoan/DangNhap/index.html & showcase/TaiKhoan/DangNhap.html');
    } catch (e) {
        console.error('Error fetching DangNhap:', e);
    }

    // 5. TaiKhoan / DangKi & DangKy
    try {
        console.log('Fetching /TaiKhoan/DangKi...');
        let dkHtml = await fetchUrl('http://localhost:5005/TaiKhoan/DangKi');
        ensureDir(path.join(showcaseRoot, 'TaiKhoan', 'DangKi'));
        ensureDir(path.join(showcaseRoot, 'TaiKhoan', 'DangKy'));
        
        const registerClientScript = `
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var form = document.querySelector('form.dangki');
            if (form) {
                form.onsubmit = function(e) {
                    e.preventDefault();
                    var name = document.getElementById('TenKH')?.value || 'Đối Tác Doanh Nghiệp';
                    var email = document.getElementById('Email')?.value || 'partner@biweb.vn';
                    localStorage.setItem('biweb_user', JSON.stringify({ email: email, name: name }));
                    alert('Đăng ký tài khoản doanh nghiệp thành công! Chào mừng ' + name + ' gia nhập hệ sinh thái BIWEB.');
                    window.location.href = '../../';
                };
            }
        });
        </script>
        `;

        let dkWithRel = fixAssets(dkHtml, 2).replace('</body>', `${registerClientScript}\n</body>`);
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangKi', 'index.html'), dkWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangKi.html'), fixAssets(dkHtml, 1).replace('</body>', `${registerClientScript}\n</body>`), 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangKy', 'index.html'), dkWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'TaiKhoan', 'DangKy.html'), fixAssets(dkHtml, 1).replace('</body>', `${registerClientScript}\n</body>`), 'utf8');
        console.log('Saved showcase/TaiKhoan/DangKi & DangKy pages');
    } catch (e) {
        console.error('Error fetching DangKi:', e);
    }

    // 6. GioHang / Cart (with enhanced client-side cart logic)
    try {
        console.log('Fetching /GioHang/Cart...');
        let cartHtml = await fetchUrl('http://localhost:5005/GioHang/Cart');
        ensureDir(path.join(showcaseRoot, 'GioHang', 'Cart'));

        const cartClientScript = `
        <script>
        (function() {
            var defaultCartItems = [
                { id: '1', name: 'Hệ Thống BIWEB MarTech+ Enterprise', price: 15000000, img: '../../img/sp1.jpg', spec: 'Enterprise License • 64 Luồng • 50.000 Acc', qty: 1 },
                { id: '2', name: 'BIWEB CDP 360° Realtime Sync', price: 9500000, img: '../../img/sp2.jpg', spec: 'Standard Key • 32 Luồng • 20.000 Acc', qty: 1 }
            ];

            function getSavedCart() {
                try {
                    var items = JSON.parse(localStorage.getItem('biweb_cart_items') || '[]');
                    if (!items.length) {
                        items = defaultCartItems;
                        localStorage.setItem('biweb_cart_items', JSON.stringify(items));
                    }
                    return items;
                } catch(e) {
                    return defaultCartItems;
                }
            }

            function formatVnd(num) {
                return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.') + ' đ';
            }

            var discountPercent = 0;

            window.applyPromoCode = function() {
                var code = (document.getElementById('promoCodeInput')?.value || '').trim().toUpperCase();
                var msgEl = document.getElementById('promoMessage');
                if (code === 'BIWEB2026' || code === 'VIP10') {
                    discountPercent = 10;
                    if (msgEl) {
                        msgEl.innerHTML = '<span class="text-emerald-400 font-bold">✓ Áp dụng mã ' + code + ' thành công: Giảm 10%!</span>';
                    }
                } else if (code === 'ENTERPRISE') {
                    discountPercent = 20;
                    if (msgEl) {
                        msgEl.innerHTML = '<span class="text-emerald-400 font-bold">✓ Áp dụng mã ENTERPRISE: Giảm 20% tổng đơn!</span>';
                    }
                } else if (!code) {
                    discountPercent = 0;
                    if (msgEl) msgEl.innerHTML = '<span class="text-rose-400">Vui lòng nhập mã ưu đãi.</span>';
                } else {
                    discountPercent = 0;
                    if (msgEl) msgEl.innerHTML = '<span class="text-rose-400">Mã ưu đãi không hợp lệ hoặc đã hết lượt.</span>';
                }
                renderCartUI();
            };

            window.changeCartQty = function(id, delta) {
                var items = getSavedCart();
                var item = items.find(function(it) { return it.id === id; });
                if (item) {
                    item.qty = Math.max(1, (item.qty || 1) + delta);
                    localStorage.setItem('biweb_cart_items', JSON.stringify(items));
                    renderCartUI();
                }
            };

            window.removeCartItem = function(id) {
                var items = getSavedCart().filter(function(it) { return it.id !== id; });
                localStorage.setItem('biweb_cart_items', JSON.stringify(items));
                renderCartUI();
            };

            function renderCartUI() {
                var items = getSavedCart();
                var container = document.querySelector('.divide-y') || document.querySelector('#cartItemsContainer');
                if (!container) return;

                var subtotal = 0;
                var html = '';

                items.forEach(function(item) {
                    var itemTotal = (item.price || 0) * (item.qty || 1);
                    subtotal += itemTotal;
                    html += \`
                    <div class="py-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-b border-white/10">
                        <div class="flex items-center space-x-3.5 flex-1 min-w-[200px]">
                            <img src="\${item.img || '../../img/sp1.jpg'}" alt="\${item.name}" class="w-16 h-16 object-cover rounded-2xl border border-white/10 flex-shrink-0 bg-slate-950/70" />
                            <div>
                                <h3 class="text-sm font-bold text-white leading-snug line-clamp-2">\${item.name}</h3>
                                <div class="text-[11px] text-slate-400 mt-1 font-medium">\${item.spec}</div>
                            </div>
                        </div>
                        <div class="text-right sm:text-center w-28">
                            <div class="text-xs text-slate-400">Đơn giá</div>
                            <div class="text-sm font-black text-[#00C6FF]">\${formatVnd(item.price)}</div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="changeCartQty('\${item.id}', -1)" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-white/10 flex items-center justify-center cursor-pointer transition">-</button>
                            <span class="w-8 text-center font-bold text-white text-sm">\${item.qty || 1}</span>
                            <button type="button" onclick="changeCartQty('\${item.id}', 1)" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold border border-white/10 flex items-center justify-center cursor-pointer transition">+</button>
                        </div>
                        <div class="text-right w-28">
                            <div class="text-xs text-slate-400">Thành tiền</div>
                            <div class="text-sm font-black text-white">\${formatVnd(itemTotal)}</div>
                        </div>
                        <div>
                            <button type="button" onclick="removeCartItem('\${item.id}')" title="Xóa" class="text-slate-500 hover:text-rose-400 p-2 text-sm bg-transparent border-0 cursor-pointer transition">
                                <i class="fa fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    \`;
                });

                container.innerHTML = html;

                var discountAmount = Math.round(subtotal * (discountPercent / 100));
                var vat = Math.round((subtotal - discountAmount) * 0.1);
                var finalTotal = subtotal - discountAmount + vat;

                var elSub = document.getElementById('cartSubtotal');
                if (elSub) elSub.textContent = formatVnd(subtotal);

                var elDisc = document.getElementById('cartDiscount');
                if (elDisc) elDisc.textContent = '-' + formatVnd(discountAmount);

                var elVat = document.getElementById('cartVat');
                if (elVat) elVat.textContent = formatVnd(vat);

                var elTot = document.getElementById('cartTotal');
                if (elTot) elTot.textContent = formatVnd(finalTotal);
            }

            document.addEventListener('DOMContentLoaded', function() {
                renderCartUI();

                var form = document.getElementById('cartForm');
                if (form) {
                    form.onsubmit = function(e) {
                        e.preventDefault();
                        var orderCode = 'BIW-' + Math.floor(100000 + Math.random() * 900000);
                        var modalHtml = \`
                        <div id="orderSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                            <div class="bi-dark-card rounded-3xl border border-[#00C6FF]/40 p-6 sm:p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,198,255,0.3)] animate-fadeIn">
                                <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/30">
                                    <i class="fa fa-check-circle"></i>
                                </div>
                                <h3 class="text-2xl font-black text-white mb-2">Đăng Ký Đơn Hàng Thành Công!</h3>
                                <p class="text-xs text-slate-300 mb-6">Mã giao dịch hợp đồng: <strong class="text-[#00C6FF] font-mono text-sm">\${orderCode}</strong>. Đội ngũ kỹ thuật BIWEB sẽ kích hoạt License và liên hệ bàn giao trong vòng 15 phút.</p>
                                
                                <div class="bg-slate-900/90 rounded-2xl p-4 border border-white/10 mb-6 text-left text-xs space-y-2">
                                    <div class="flex justify-between"><span class="text-slate-400">Hình thức thanh toán:</span><span class="text-white font-bold">Chuyển khoản VietQR Doanh Nghiệp</span></div>
                                    <div class="flex justify-between"><span class="text-slate-400">Ngân hàng thụ hưởng:</span><span class="text-white font-bold">Techcombank - 1903.6868.8888</span></div>
                                    <div class="flex justify-between"><span class="text-slate-400">Chủ tài khoản:</span><span class="text-white font-bold">CONG TY TNHH CONG NGHE BIWEB</span></div>
                                    <div class="flex justify-between"><span class="text-slate-400">Nội dung chuyển khoản:</span><span class="text-[#FF6B00] font-mono font-bold">\${orderCode}</span></div>
                                </div>

                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button type="button" onclick="document.getElementById('orderSuccessModal').remove(); window.location.href='../../';" class="flex-1 py-3 rounded-xl font-bold text-white bi-btn-primary shadow-glow cursor-pointer border-0 text-sm">
                                        Về Trang Chủ BIWEB
                                    </button>
                                    <button type="button" onclick="window.print()" class="px-5 py-3 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 cursor-pointer text-sm">
                                        <i class="fa fa-print mr-1.5"></i> In Hợp Đồng
                                    </button>
                                </div>
                            </div>
                        </div>
                        \`;
                        document.body.insertAdjacentHTML('beforeend', modalHtml);
                        localStorage.removeItem('biweb_cart_items');
                    };
                }
            });
        })();
        </script>
        `;

        let cartWithRel = fixAssets(cartHtml, 2);
        cartWithRel = cartWithRel.replace('</body>', `${cartClientScript}\n</body>`);

        fs.writeFileSync(path.join(showcaseRoot, 'GioHang', 'Cart', 'index.html'), cartWithRel, 'utf8');
        fs.writeFileSync(path.join(showcaseRoot, 'GioHang', 'Cart.html'), fixAssets(cartHtml, 1).replace('</body>', `${cartClientScript}\n</body>`), 'utf8');
        console.log('Saved showcase/GioHang/Cart/index.html & showcase/GioHang/Cart.html');
    } catch (e) {
        console.error('Error fetching Cart:', e);
    }

    // 7. Generate 404.html (Smart catch-all router for GitHub Pages)
    const notFoundHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BIWEB - Đang chuyển hướng...</title>
    <script>
    (function() {
        var host = window.location.hostname;
        var pathname = window.location.pathname;
        var search = window.location.search || '';
        var hash = window.location.hash || '';

        // If domain root was hit without /biweb, add /biweb immediately
        if (!pathname.startsWith('/biweb')) {
            var target = '/biweb' + pathname;
            if (!target.includes('.') && !target.endsWith('/')) target += '/';
            window.location.replace(window.location.origin + target + search + hash);
            return;
        }

        // Inside /biweb, map routes to physical static showcase directories
        var subPath = pathname.replace(/^\\/biweb\\/?/, '');
        if (subPath.startsWith('SanPham/Products')) {
            window.location.replace('/biweb/SanPham/Products/' + search + hash);
        } else if (subPath.startsWith('SanPham/ChiTietSP')) {
            window.location.replace('/biweb/SanPham/ChiTietSP/' + search + hash);
        } else if (subPath.startsWith('TaiKhoan/DangNhap')) {
            window.location.replace('/biweb/TaiKhoan/DangNhap/' + search + hash);
        } else if (subPath.startsWith('TaiKhoan/DangKi') || subPath.startsWith('TaiKhoan/DangKy')) {
            window.location.replace('/biweb/TaiKhoan/DangKi/' + search + hash);
        } else if (subPath.startsWith('GioHang/Cart')) {
            window.location.replace('/biweb/GioHang/Cart/' + search + hash);
        } else {
            // Default back to homepage
            setTimeout(function() {
                window.location.replace('/biweb/');
            }, 600);
        }
    })();
    </script>
    <link rel="stylesheet" href="/biweb/css/biweb-theme.css" />
    <link rel="stylesheet" href="/biweb/css/biweb-motion.css" />
</head>
<body class="bg-[#070B14] text-white flex items-center justify-center min-h-screen p-6 font-sans">
    <div class="bi-dark-card rounded-3xl border border-white/15 p-8 max-w-md w-full text-center shadow-2xl">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0052FF] to-[#00C6FF] text-white flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-glow">
            2B
        </div>
        <h2 class="text-xl font-black text-white mb-2">Đang kết nối hệ thống BIWEB...</h2>
        <p class="text-xs text-slate-400 mb-6">Đang tự động chuyển hướng bạn đến đúng tính năng trong hệ sinh thái.</p>
        <div class="w-10 h-10 border-2 border-[#00C6FF] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <a href="/biweb/" class="inline-flex items-center px-4 py-2.5 rounded-xl font-bold text-xs text-white bi-btn-primary no-underline">
            Về Trang Chủ BIWEB &rarr;
        </a>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(showcaseRoot, '404.html'), notFoundHtml, 'utf8');
    console.log('Saved showcase/404.html');

    // 8. Copy static css/js/img to showcase
    const copyRecursive = (src, dest) => {
        if (!fs.existsSync(src)) return;
        ensureDir(dest);
        fs.readdirSync(src).forEach(item => {
            const s = path.join(src, item);
            const d = path.join(dest, item);
            if (fs.statSync(s).isDirectory()) {
                copyRecursive(s, d);
            } else {
                fs.copyFileSync(s, d);
            }
        });
    };
    copyRecursive(path.join(repoRoot, 'DoAn-FW/wwwroot/css'), path.join(showcaseRoot, 'css'));
    copyRecursive(path.join(repoRoot, 'DoAn-FW/wwwroot/js'), path.join(showcaseRoot, 'js'));

    console.log('All showcase pages generated and assets synced successfully!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
