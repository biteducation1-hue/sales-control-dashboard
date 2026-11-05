// Renders every .bn section in banners.html to ../<name>.png and reports overflow
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2100, height: 1200 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'banners.html'));
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => document.fonts.check('900 40px Heebo') && document.fonts.check('400 40px Heebo'));
  console.log('Heebo loaded:', ok);
  if (!ok) process.exitCode = 1;
  await page.waitForTimeout(300);
  const issues = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.bn').forEach(bn => {
      const r = bn.getBoundingClientRect();
      bn.querySelectorAll('*').forEach(el => {
        const wrap = el.closest('.rp-wrap');
        if (wrap && !wrap.classList.contains('front')) return; // background pages are meant to bleed
        if (el.tagName.toLowerCase() === 'svg' || el.closest('svg')) return;
        const e = el.getBoundingClientRect();
        if (!e.width) return;
        if (e.left < r.left - 1 || e.right > r.right + 1 || e.top < r.top - 1 || e.bottom > r.bottom + 1)
          out.push(`${bn.dataset.name}: outside <${el.className || el.tagName}> "${(el.textContent || '').trim().slice(0, 30)}"`);
        if (el.clientWidth && el.scrollWidth > el.clientWidth + 2 && !el.querySelector('svg') && !el.closest('.price'))
          out.push(`${bn.dataset.name}: text overflows <${el.className}> ${el.scrollWidth}>${el.clientWidth}`);
      });
      const last = bn.lastElementChild.getBoundingClientRect();
      if (last.bottom > r.bottom - 20) out.push(`${bn.dataset.name}: content reaches bottom edge (${Math.round(last.bottom - r.top)}/${r.height})`);
      // overlap check between direct children
      const kids = [...bn.children].map(k => k.getBoundingClientRect());
      for (let i = 1; i < kids.length; i++) if (kids[i].height && kids[i - 1].height && kids[i].top < kids[i - 1].bottom - 2 && bn.classList.contains('hd') === false && bn.classList.contains('mail') === false)
        out.push(`${bn.dataset.name}: children ${i - 1}/${i} overlap`);
    });
    return out;
  });
  issues.forEach(i => console.log('ISSUE', i));
  const els = await page.$$('.bn');
  for (const el of els) {
    const name = await el.getAttribute('data-name');
    if (only.length && !only.includes(name)) continue;
    await el.screenshot({ path: path.join(__dirname, '..', name + '.png') });
  }
  console.log('rendered', els.length);
  await browser.close();
})();
