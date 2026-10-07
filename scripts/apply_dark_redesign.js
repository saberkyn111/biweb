const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, 'build_redesign_index.js');
let code = fs.readFileSync(srcPath, 'utf8');

console.log('Original code length:', code.length);

// 1. Transform Section Wrappers
code = code.replace(
    'class="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-white pt-12 pb-16 lg:pt-16 lg:pb-24"',
    'class="relative overflow-hidden bg-transparent pt-12 pb-16 lg:pt-16 lg:pb-24"'
);

// All sections with bg-white or bg-[#F8FAFC]
code = code.replace(/class="bi-section bg-white relative overflow-hidden"/g, 'class="bi-section bg-transparent relative overflow-hidden border-t border-white/5"');
code = code.replace(/class="bi-section bg-\[#F8FAFC\] relative overflow-hidden"/g, 'class="bi-section bg-transparent relative overflow-hidden border-t border-white/5"');
code = code.replace(/class="bi-section bg-\[#F8FAFC\] border-t border-slate-200"/g, 'class="bi-section bg-transparent border-t border-white/5"');
code = code.replace(/class="bi-section bg-white border-t border-slate-200"/g, 'class="bi-section bg-transparent border-t border-white/5"');
code = code.replace(/class="bi-section bg-white"/g, 'class="bi-section bg-transparent border-t border-white/5"');
code = code.replace(/class="bi-section bg-\[#F8FAFC\]"/g, 'class="bi-section bg-transparent border-t border-white/5"');
code = code.replace(
    'class="bi-section bg-gradient-to-r from-[#0F172A] via-[#111C35] to-[#0F172A] text-white relative overflow-hidden"',
    'class="bi-section bg-gradient-to-r from-[#070B14] via-[#0F172A] to-[#070B14] text-white relative overflow-hidden border-t border-white/10"'
);

// 2. Hero Section Typography & Mockup Elements
code = code.replace(/text-\[34px\] sm:text-5xl xl:text-\[56px\] font-black leading-\[1\.12\] tracking-tight text-\[#0F172A\] mb-5/g, 'text-[34px] sm:text-5xl xl:text-[56px] font-black leading-[1.12] tracking-tight text-white mb-5');
code = code.replace(/text-base sm:text-lg text-\[#0F172A\] font-bold leading-snug max-w-xl mx-auto lg:mx-0 mb-3/g, 'text-base sm:text-lg text-white font-bold leading-snug max-w-xl mx-auto lg:mx-0 mb-3');
code = code.replace(/text-sm sm:text-base text-\[#4B5563\] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8/g, 'text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8');
code = code.replace(/<strong class="text-\[#0F172A\]">WebApp · CRM · ERP · AI Agent · Zalo Mini App<\/strong>/g, '<strong class="text-white">WebApp · CRM · ERP · AI Agent · Zalo Mini App</strong>');
code = code.replace(/class="bi-btn-outline px-8 py-4 text-sm sm:text-\[15px\] font-bold no-underline hover:no-underline"/g, 'class="bi-btn-outline px-8 py-4 text-sm sm:text-[15px] font-bold no-underline hover:no-underline text-white hover:text-[#00C6FF] border-white/20 bg-white/5"');
code = code.replace(/border-t border-slate-200\/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-\[#4B5563\]/g, 'border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400');

// Hero Mockup
code = code.replace(/class="bi-tilt bi-sheen relative bg-white rounded-\[32px\] border border-slate-200\/90 shadow-\[0_40px_80px_-25px_rgba\(0,82,255,0\.28\)\] p-6 sm:p-8"/g, 'class="bi-tilt bi-sheen bi-dark-card relative rounded-[32px] border border-white/15 shadow-[0_30px_90px_-20px_rgba(0,82,255,0.4),0_0_35px_rgba(0,198,255,0.2)] p-6 sm:p-8"');
code = code.replace(/border-b border-slate-100/g, 'border-b border-white/10');
code = code.replace(/text-sm font-black text-\[#0F172A\]/g, 'text-sm font-black text-white');
code = code.replace(/text-\[11px\] text-\[#4B5563\]/g, 'text-[11px] text-slate-400');
code = code.replace(/rounded-xl bg-\[#F8FAFC\] border border-slate-100 p-3 text-center transition-all duration-300 hover:border-\[#0052FF\]\/30/g, 'rounded-xl bi-dark-card p-3 text-center transition-all duration-300 border border-white/10 hover:border-[#00C6FF]');
code = code.replace(/text-lg font-black text-\[#0F172A\] mt-0\.5/g, 'text-lg font-black text-white mt-0.5');
code = code.replace(/flex items-center justify-between rounded-xl bg-\[#F8FAFC\] border border-slate-100 px-3\.5 py-2\.5/g, 'flex items-center justify-between rounded-xl bg-slate-900/80 border border-white/10 px-3.5 py-2.5');
code = code.replace(/flex items-center gap-2\.5 font-semibold text-\[#0F172A\]/g, 'flex items-center gap-2.5 font-semibold text-white');

// Floating badges
code = code.replace(/hidden sm:flex absolute -left-6 top-16 bi-float-slow bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 items-center gap-3 z-20/g, 'hidden sm:flex absolute -left-6 top-16 bi-floating-pill bi-dark-card rounded-2xl shadow-2xl border border-white/15 px-4 py-3 items-center gap-3 z-20');
code = code.replace(/hidden sm:flex absolute -right-4 -bottom-6 bi-float-delayed bg-\[#0F172A\] rounded-2xl shadow-2xl px-4 py-3 items-center gap-3 text-white z-20/g, 'hidden sm:flex absolute -right-4 -bottom-6 bi-floating-pill-delay bi-dark-card rounded-2xl shadow-2xl border border-white/15 px-4 py-3 items-center gap-3 text-white z-20');

// Partners Section
code = code.replace(/id="partners" class="mt-20 pt-10 border-t border-slate-200"/g, 'id="partners" class="mt-20 pt-10 border-t border-white/10"');
code = code.replace(/text-base sm:text-lg text-\[#0F172A\] font-extrabold m-0/g, 'text-base sm:text-lg text-white font-extrabold m-0');

// 3. Convert all cards to bi-dark-card
code = code.replace(/rounded-3xl border border-slate-200 bg-white/g, 'bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/rounded-\[32px\] bg-white border border-slate-200/g, 'bi-dark-card rounded-[32px] border border-white/10');
code = code.replace(/rounded-\[28px\] bg-white border border-slate-200/g, 'bi-dark-card rounded-[28px] border border-white/10');
code = code.replace(/rounded-3xl bg-white border border-slate-200/g, 'bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/rounded-2xl bg-white border border-slate-200/g, 'bi-dark-card rounded-2xl border border-white/10');
code = code.replace(/p-6 rounded-3xl bg-white border border-slate-200 shadow-sm/g, 'bi-dark-card p-6 rounded-3xl border border-white/10 shadow-sm');
code = code.replace(/bi-spot bg-white rounded-2xl border border-slate-200\/90/g, 'bi-spot bi-dark-card rounded-2xl border border-white/10');
code = code.replace(/bi-spot rounded-3xl bg-white border border-slate-200\/90/g, 'bi-spot bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/bi-spot rounded-3xl bg-\[#F8FAFC\] border border-slate-200\/90/g, 'bi-spot bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/bi-spot bg-\[#F8FAFC\] rounded-2xl border border-slate-200\/90/g, 'bi-spot bi-dark-card rounded-2xl border border-white/10');
code = code.replace(/bi-spot bi-hover-lift rounded-3xl bg-\[#F8FAFC\] border border-slate-200\/90/g, 'bi-spot bi-hover-lift bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/bi-spot bi-hover-lift rounded-3xl bg-white border border-slate-200\/90/g, 'bi-spot bi-hover-lift bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/bi-spot bi-hover-lift rounded-\[32px\] bg-white border border-slate-200/g, 'bi-spot bi-hover-lift bi-dark-card rounded-[32px] border border-white/10');
code = code.replace(/bi-spot bi-hover-lift rounded-\[28px\] bg-white border border-slate-200/g, 'bi-spot bi-hover-lift bi-dark-card rounded-[28px] border border-white/10');
code = code.replace(/bi-spot bi-hover-lift bg-white rounded-\[28px\] border border-slate-200/g, 'bi-spot bi-hover-lift bi-dark-card rounded-[28px] border border-white/10');
code = code.replace(/bg-white rounded-3xl border border-slate-200\/90/g, 'bi-dark-card rounded-3xl border border-white/10');
code = code.replace(/bg-\[#F8FAFC\] rounded-3xl border border-slate-200\/90/g, 'bi-dark-card rounded-3xl border border-white/10');

// Section 5 items: Martech items
code = code.replace(
    /bi-spot flex items-start gap-3\.5 bg-white p-4 rounded-2xl border border-white\/10 shadow-sm/g,
    'bi-spot bi-dark-card flex items-start gap-3.5 p-4 rounded-2xl border border-white/10 shadow-sm'
);

// All remaining bg-[#F8FAFC] and light boxes
code = code.replace(
    /bg-\[#F8FAFC\] rounded-2xl p-4 border border-white\/10 text-xs text-white font-semibold space-y-2/g,
    'bg-slate-900/80 rounded-2xl p-4 border border-white/10 text-xs text-white font-semibold space-y-2'
);
code = code.replace(
    /bi-spot p-4 rounded-2xl bg-\[#F8FAFC\] border border-white\/10/g,
    'bi-spot bi-dark-card p-4 rounded-2xl border border-white/10'
);
code = code.replace(
    /p-3\.5 rounded-xl bg-\[#F8FAFC\] border border-white\/10 font-semibold text-slate-200/g,
    'p-3.5 rounded-xl bg-slate-900/80 border border-white/10 font-semibold text-slate-200'
);
code = code.replace(
    /p-3 bg-\[#F8FAFC\] rounded-xl text-center/g,
    'p-3 bg-slate-900/80 rounded-xl text-center border border-white/10'
);

// FAQ Accordions
code = code.replace(
    /details class="group bg-\[#F8FAFC\] border border-white\/10 rounded-2xl p-6 open:border-\[#0052FF\] transition"/g,
    'details class="group bi-dark-card border border-white/10 rounded-2xl p-6 open:border-[#00C6FF] transition"'
);

// Consultation Form Inputs and Checkboxes
code = code.replace(
    /class="w-full bg-\[#F8FAFC\] border border-white\/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-\[#0052FF\]"/g,
    'class="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#00C6FF] focus:ring-1 focus:ring-[#00C6FF]/30"'
);
code = code.replace(
    /label class="flex items-center gap-2 p-2\.5 bg-\[#F8FAFC\] border border-white\/10 rounded-xl cursor-pointer m-0"/g,
    'label class="flex items-center gap-2 p-2.5 bg-slate-900/80 border border-white/10 rounded-xl cursor-pointer m-0 hover:border-[#00C6FF]/50 text-slate-200"'
);

// 4. Products / Solution Catalog
code = code.replace(
    /product-home-card bi-spot bi-hover-lift bg-white rounded-3xl border border-slate-200\/90/g,
    'product-home-card bi-spot bi-hover-lift bi-dark-card rounded-3xl border border-white/10 bg-[#0F172A]/85'
);
code = code.replace(
    /home-cat-btn px-4 py-2\.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-\[#4B5563\] border border-slate-200/g,
    'home-cat-btn px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-white/10 hover:border-[#00C6FF]'
);
code = code.replace(
    /inline-flex items-center justify-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-\[#0F172A\] text-xs font-bold no-underline hover:no-underline transition/g,
    'inline-flex items-center justify-center px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold no-underline hover:no-underline transition'
);
code = code.replace(
    /bg-slate-100 flex items-center justify-center overflow-hidden/g,
    'bg-slate-950/80 flex items-center justify-center overflow-hidden'
);

// 5. Consultation Form (Section 14)
code = code.replace(
    '<form id="consultForm" class="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"',
    '<form id="consultForm" class="bi-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15"'
);
code = code.replace(
    /class="w-full bg-\[#F8FAFC\] border border-slate-200 rounded-xl px-3\.5 py-2\.5 text-xs text-\[#0F172A\] placeholder-slate-400 focus:outline-none focus:border-\[#0052FF\] focus:bg-white transition"/g,
    'class="w-full bg-slate-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C6FF] focus:bg-slate-900 focus:ring-1 focus:ring-[#00C6FF]/30 transition"'
);
code = code.replace(
    /rounded-xl bg-\[#F8FAFC\] border border-slate-200 p-2\.5 text-xs text-\[#0F172A\]/g,
    'rounded-xl bg-slate-900/80 border border-white/10 p-2.5 text-xs text-slate-300 hover:border-[#00C6FF]/50'
);

// 6. Generic Text replacements for headings, subheadings, and borders
code = code.replace(/text-\[#0F172A\]/g, 'text-white');
code = code.replace(/text-\[#4B5563\]/g, 'text-slate-300');
code = code.replace(/border-slate-200/g, 'border-white/10');
code = code.replace(/border-slate-100/g, 'border-white/10');

// Save updated build script
fs.writeFileSync(srcPath, code, 'utf8');
console.log('Updated build_redesign_index.js! Length:', code.length);

// Run the script to generate Index.cshtml
require('./build_redesign_index.js');
console.log('Generated DoAn-FW/Views/Home/Index.cshtml successfully!');
