const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function transformFile(filePath, transforms) {
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    transforms.forEach(([from, to]) => {
        if (typeof from === 'string') {
            content = content.split(from).join(to);
        } else {
            content = content.replace(from, to);
        }
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Transformed:', path.basename(filePath));
}

// 1. Products.cshtml
transformFile(path.join(repoRoot, 'DoAn-FW/Views/SanPham/Products.cshtml'), [
    ['class="bg-[#0F172A] text-white py-12 border-b border-slate-800 relative overflow-hidden"', 'class="bg-transparent text-white py-12 border-b border-white/10 relative overflow-hidden"'],
    ['class="py-10 bg-[#F8FAFC] min-h-screen"', 'class="py-10 bg-transparent min-h-screen"'],
    ['bi-card-white rounded-2xl p-4 border border-slate-200/90 shadow-sm mb-8', 'bi-dark-card rounded-2xl p-4 border border-white/10 shadow-sm mb-8'],
    ['bi-card-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-6', 'bi-dark-card rounded-2xl border border-white/10 p-5 shadow-sm space-y-6'],
    ['bi-card-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:border-[#0052FF] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group', 'bi-dark-card rounded-3xl border border-white/10 p-4 sm:p-5 shadow-sm hover:border-[#00C6FF] hover:shadow-[0_15px_35px_rgba(0,198,255,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group'],
    ['relative overflow-hidden rounded-2xl bg-slate-100 h-44 sm:h-48 flex items-center justify-center mb-3', 'relative overflow-hidden rounded-2xl bg-slate-950/70 border border-white/5 h-44 sm:h-48 flex items-center justify-center mb-3'],
    ['w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:border-[#0052FF] text-sm text-[#0F172A]', 'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 focus:outline-none focus:border-[#00C6FF] focus:ring-1 focus:ring-[#00C6FF]/40 text-sm text-white placeholder-slate-500'],
    ['w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-white text-[#0F172A]', 'w-full sm:w-auto py-2.5 px-3 rounded-xl border border-white/15 text-sm focus:outline-none focus:border-[#00C6FF] bg-slate-900 text-white'],
    ['class="inline-flex items-center space-x-1.5 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-sm"', 'class="inline-flex items-center space-x-1.5 bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-sm"'],
    ['class="px-3.5 py-2 rounded-xl text-xs font-bold text-[#4B5563] hover:bg-slate-100 no-underline transition"', 'class="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 no-underline transition"'],
    ['class="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:text-[#0F172A] hover:bg-slate-100 no-underline transition"', 'class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 no-underline transition"'],
    ['class="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-[#4B5563] font-medium"', 'class="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 font-medium border border-white/5"'],
    ['class="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#10B981]/10 text-[#10B981] font-semibold border border-[#10B981]/25 text-[10px]"', 'class="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#10B981] font-semibold border border-[#10B981]/30 text-[10px]"'],
    ['class="inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 transition no-underline"', 'class="inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-[#00C6FF]/40 transition no-underline"'],
    ['text-[#0F172A]', 'text-white'],
    ['text-[#4B5563]', 'text-slate-300'],
    ['border-slate-200/90', 'border-white/10'],
    ['border-slate-200', 'border-white/10'],
    ['border-slate-100', 'border-white/10'],
    ['text-xl font-black text-[#0052FF]', 'text-xl font-black text-[#00C6FF]']
]);

// 2. ChiTietSP.cshtml
transformFile(path.join(repoRoot, 'DoAn-FW/Views/SanPham/ChiTietSP.cshtml'), [
    ['class="bg-[#0F172A] text-white py-6 border-b border-slate-800 relative overflow-hidden"', 'class="bg-transparent text-white py-6 border-b border-white/10 relative overflow-hidden"'],
    ['class="py-12 bg-[#F8FAFC] min-h-screen"', 'class="py-12 bg-transparent min-h-screen"'],
    ['bi-card-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm mb-12', 'bi-dark-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-sm mb-12'],
    ['rounded-2xl border border-slate-200 bg-slate-100 p-4 overflow-hidden relative group', 'rounded-2xl border border-white/10 bg-slate-950/70 p-4 overflow-hidden relative group'],
    ['mt-5 p-4 rounded-2xl bg-[#0052FF]/5 border border-[#0052FF]/20 text-[#0F172A]', 'mt-5 p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-200'],
    ['mt-4 p-3.5 rounded-2xl bg-slate-100 border border-slate-200/90 flex items-center justify-between text-xs', 'mt-4 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs text-slate-300'],
    ['bi-card-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm', 'bi-dark-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-sm'],
    ['px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-[#4B5563] border border-slate-200', 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-white/10'],
    ['text-3xl font-black text-[#0052FF]', 'text-3xl font-black text-[#00C6FF]'],
    ['text-[#0F172A]', 'text-white'],
    ['text-[#4B5563]', 'text-slate-300'],
    ['border-slate-200/90', 'border-white/10'],
    ['border-slate-200', 'border-white/10'],
    ['border-slate-100', 'border-white/10']
]);

// 3. Cart.cshtml
transformFile(path.join(repoRoot, 'DoAn-FW/Views/GioHang/Cart.cshtml'), [
    ['class="bg-[#0F172A] text-white py-10 border-b border-slate-800 relative overflow-hidden"', 'class="bg-transparent text-white py-10 border-b border-white/10 relative overflow-hidden"'],
    ['class="py-12 bg-[#F8FAFC] min-h-screen"', 'class="py-12 bg-transparent min-h-screen"'],
    ['lg:col-span-8 bi-card-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm', 'lg:col-span-8 bi-dark-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-sm'],
    ['bi-card-white rounded-3xl border border-slate-200/90 p-6 shadow-sm sticky top-28', 'bi-dark-card rounded-3xl border border-white/10 p-6 shadow-sm sticky top-28'],
    ['w-16 h-16 object-cover rounded-2xl border border-slate-200 flex-shrink-0', 'w-16 h-16 object-cover rounded-2xl border border-white/10 flex-shrink-0 bg-slate-950/70'],
    ['w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0052FF]', 'w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C6FF] focus:ring-1 focus:ring-[#00C6FF]/40'],
    ['w-full py-2.5 px-3 rounded-xl border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0052FF] bg-white', 'w-full py-2.5 px-3 rounded-xl border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C6FF] bg-slate-900'],
    ['divide-slate-100', 'divide-white/10'],
    ['text-[#0F172A]', 'text-white'],
    ['text-[#4B5563]', 'text-slate-300'],
    ['border-slate-200/90', 'border-white/10'],
    ['border-slate-200', 'border-white/10'],
    ['border-slate-100', 'border-white/10'],
    ['text-2xl font-black text-[#0052FF]', 'text-2xl font-black text-[#00C6FF]']
]);

console.log('All Views modernized successfully!');
