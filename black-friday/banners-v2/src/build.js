// Builds banners.html: 33 Black Friday banners in the visual language of landing-v2.html
const fs = require('fs');
const path = require('path');
const LOGO = fs.readFileSync('/tmp/claude-0/-home-user-sales-control-dashboard/14c85a98-2788-5150-9990-4b12814891c7/scratchpad/logo/logo.b64', 'utf8').trim();

const n = (t) => `<span class="n">${t}</span>`;
const RENEW = `מהחודש השני ${n('450') + '&nbsp;₪'} לחודש, ביטול בכל עת`;
const DISC = 'התוכן לימודי ואינו ייעוץ השקעות. מסחר כרוך בסיכון.';

// ---------- components ----------
const logo = (w) => `<div class="logo" style="width:${w}px" role="img" aria-label="סייקלס טריידינג"></div>`;
// keep each highlighted phrase on one line (non-breaking spaces in its text, not inside tags)
const keepHl = (html) => html.replace(/<span class="hl">([\s\S]*?)<\/span>(?![^<]*<\/span>)/g, (m, inner) => '<span class="hl">' + inner.split(/(<[^>]+>)/).map(t => t.startsWith('<') ? t : t.replace(/ /g, '&nbsp;')).join('') + '</span>');
const head = (html, fs, extra = '') => `<h1 class="hbox" style="font-size:${fs}px;${extra}">${keepHl(html)}</h1>`;
const strike = `<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M4 30 C 30 22, 60 16, 96 8"/></svg>`;
const price = (p, gap) => `<div class="price${p < 80 ? ' compact' : ''}" style="--p:${p}px;${gap ? 'gap:' + gap + 'px' : ''}"><div class="pc reg"><span class="t">מחיר רגיל</span><span class="pp"><span class="n">450</span>&nbsp;₪</span><span class="s">לחודש</span></div><span class="arr" aria-hidden="true">←</span><div class="pc bf"><span class="t">בלאק פריידי · חודש ראשון</span><span class="pp"><span class="n dg">197</span><span class="cur">₪</span></span></div></div>`;
const renew = (fs, extra = '') => `<div class="renew" style="font-size:${Math.round(fs*0.62)}px;${extra}">${RENEW}</div>`;
const cta = (t, fs, extra = '') => `<div class="cta" style="font-size:${fs}px;${extra}">${t} ←</div>`;
const disc = (fs, extra = '') => `<div class="disc" style="font-size:${fs}px;${extra}">${DISC}</div>`;
const tag = (t, fs, extra = '') => `<div class="tag" style="font-size:${fs}px;${extra}">${t}</div>`;
const ziv = (w, h, fs) => `<div class="ziv" style="width:${w}px;height:${h}px;font-size:${fs}px"><span>תמונה של זיו</span></div>`;
const chips = (items, fs, extra = '') => `<div class="chips" style="font-size:${fs}px;${extra}">${items.map(([b, s]) => `<div class="chip"><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
const COMM_CHIPS = [[n('4'), 'לייבים בשבוע'], [n('2,000+'), 'סוחרים'], [n('9'), 'מנטורים']];

const LIVES = [
  ['ראשון', 'זיו', 'לייב הכנה למסחר'],
  ['שלישי', 'מני', 'לייב עומק על הסייקלים'],
  ['רביעי', 'רועי', 'תזמון עסקאות במניות'],
  ['חמישי', 'גולן', 'דיוק בהבנת הגרף'],
];
const lives = (fs) => `<div class="week" style="font-size:${fs}px">${LIVES.map(([w, nm, s]) => `<div class="live"><span class="when">${w}</span><h3>${nm}</h3><b>${s}</b></div>`).join('')}</div>`;
const ROOMS = ['# מומחי מניות', '# חדר לכל נכס', '# רעיונות מסחר', '# קריפטו', '# מט"ח', '# נוסטרו', '# טווח ארוך'];
const rooms = (fs, list = ROOMS) => `<div class="rooms" style="font-size:${fs}px">${list.map(r => `<span class="room">${r}</span>`).join('')}</div>`;
const ASSETS = [n('S&amp;P 500'), 'ביטקוין', 'זהב', 'נפט', 'יורו-דולר'];
const assets = (fs) => `<div class="assets" style="font-size:${fs}px">${ASSETS.map(a => `<span>${a}</span>`).join('')}</div>`;

const pillars = (fs, cols = 3) => `<div class="pillars" style="font-size:${fs}px;grid-template-columns:repeat(${cols},1fr)">
  <div class="pl"><i>${n('1')}</i><h3>${n('4')} לייבים בשבוע</h3><p>זיו, מני, רועי וגולן</p></div>
  <div class="pl"><i>${n('2')}</i><h3>כל חדרי הדיסקורד</h3><p>${n('2,000+')} סוחרים ו-${n('9')} מנטורים</p></div>
  <div class="pl"><i>${n('3')}</i><h3>+ הדוח החודשי</h3><p>תאריכי מפנה ב-${n('5')} נכסים</p></div>
</div>`;

const fit = (fs) => `<div class="fit2" style="font-size:${fs}px">
  <div class="fit yes"><h3>זה בשבילכם אם…</h3><ul>
    <li>אתם כבר סוחרים, או לומדים ברצינות ומכירים את הבסיס: תמיכה, התנגדות וסטופ.</li>
    <li>אתם רוצים סוחרים סביבכם, מנטורים זמינים ולייבים קבועים במקום לסחור לבד.</li>
    <li>חסר לכם מימד הזמן: מתי לצאת, מתי להחזיק ומתי לחכות.</li></ul></div>
  <div class="fit no"><h3>זה לא בשבילכם אם…</h3><ul>
    <li>אתם מתחילים מאפס, בלי שום בסיס בניתוח טכני.</li>
    <li>אתם מחפשים איתותים להעתיק.</li>
    <li>אתם מחפשים הבטחה לרווח. אין כזו.</li></ul></div>
</div>`;

const TERMS = [
  ['היום', `${n('197') + '&nbsp;₪'} על החודש הראשון, במקום ${n('450') + '&nbsp;₪'}.`],
  ['לפני החיוב הבא', 'תזכורת לפני שהמנוי מתחדש.'],
  ['מהחודש השני', `חידוש אוטומטי ב-${n('450') + '&nbsp;₪'} לחודש.`],
  ['ביטול', 'בכל עת, בלחיצה אחת מהאזור האישי.'],
];
const terms = (fs, cols) => `<div class="terms" style="font-size:${fs}px;grid-template-columns:repeat(${cols},1fr)">${TERMS.map(([b, p], i) => `<div class="term"><div class="tn"><i>${n(i + 1)}</i><b>${b}</b></div><p>${p}</p></div>`).join('')}</div>`;

const TIMELINE = [
  [n('13–22/11'), 'רשימת המתנה', 'נרשמים ומחכים לקישור'],
  [n('23/11'), 'גישה מוקדמת', 'רק למי שברשימה, 24 שעות לפני כולם'],
  [n('24/11'), 'פתוח לכולם', 'ההרשמה נפתחת לכל הסוחרים'],
  [n('27/11'), 'בלאק פריידי', 'יום השיא של המבצע'],
  [n('30/11'), 'נסגר', `בשעה ${n('23:59')}`],
];
const timeline = (fs) => `<div class="tl" style="font-size:${fs}px">${TIMELINE.map(([d, t, s], i) => `<div class="tl-row${i === 1 ? ' on' : ''}"><span class="d">${d}</span><div><b>${t}</b><span>${s}</span></div></div>`).join('')}</div>`;

// report page mock: structure only, no numbers
const sk = (w) => `<span class="sk" style="width:${w}%"></span>`;
const dbox = `<span class="db">••.••</span>`;
const reportPage = (cls = '', blurred = false) => `<div class="rp ${cls}">
  <div class="rp-top"><b>הדוח החודשי</b><span>מבנה הדוח</span></div>
  <div class="rp-sec"><b>סיכום תאריכי החודש הקודם</b>${sk(92)}${sk(70)}</div>
  ${['S&amp;P 500', 'ביטקוין', 'זהב', 'נפט', 'יורו-דולר'].map(a => `<div class="rp-sec"><div class="rp-h"><b>${a.includes('S&') ? n(a) : a}</b><span>תאריכי מפנה</span>${dbox}${dbox}${dbox}</div>${sk(88)}${sk(60)}</div>`).join('')}
  ${blurred ? '' : '<div class="rp-foot">בכל נכס: תאריכי המפנה, תרחישים ורמות לבדיקה</div>'}
</div>`;
const reportStack = (scale) => `<div class="rstack" style="transform:scale(${scale})">
  <div class="rp-wrap back2">${reportPage('blur', true)}</div>
  <div class="rp-wrap back1">${reportPage('blur', true)}</div>
  <div class="rp-wrap front">${reportPage()}</div>
  <span class="lock l2">לחברי הקהילה</span><span class="lock l1">לחברי הקהילה</span>
</div>`;

// ---------- banners ----------
const B = [];
const add = (name, w, h, cls, html) => B.push({ name, w, h, cls, html });

/* ===== WAITLIST PHASE ===== */
add('story-01-teaser', 1080, 1920, 'story', `
  ${logo(330)}
  <div class="grow col" style="gap:44px">
    ${tag(`בלאק פריידי ${n('2026')} · קהילת הסוחרים`, 32)}
    <div class="big-white" style="font-size:84px">אתם עוקבים כבר מזמן.</div>
    ${head('השנה <span class="hl">הדלת לקהילה</span> נפתחת', 84, 'max-width:920px')}
    <div class="date-card" style="margin-top:14px"><span class="dc-k">שמרו את התאריך</span><b>${n('23/11')}</b><span class="dc-s">מי שברשימה נכנס ראשון</span></div>
  </div>
  ${chips(COMM_CHIPS, 28, 'margin:30px 0 40px')}
  ${cta('להרשמה לרשימת ההמתנה', 44)}
  ${disc(26, 'margin-top:44px')}
`);

add('story-02-waitlist', 1080, 1920, 'story', `
  ${logo(330)}
  <div class="grow col" style="gap:52px">
    ${tag(`רשימת ההמתנה פתוחה · ${n('13–22/11')}`, 34)}
    ${head('מי שברשימה <span class="hl">נכנס ראשון</span>', 100, 'max-width:900px')}
    <p class="sub" style="font-size:42px;max-width:860px">גישה לקהילה <b class="g">24 שעות לפני כולם</b>, ב-${n('23/11')}.</p>
    <div class="card steps" style="font-size:38px;width:860px">
      <div class="st"><i>${n('1')}</i><span>נרשמים לרשימת ההמתנה</span></div>
      <div class="st"><i>${n('2')}</i><span>ב-${n('23/11')} מקבלים קישור להצטרפות</span></div>
      <div class="st"><i>${n('3')}</i><span>נכנסים לקהילה יום לפני שהיא נפתחת לכולם</span></div>
    </div>
    ${chips(COMM_CHIPS, 30)}
  </div>
  ${cta('אני רוצה להיות ברשימה', 46)}
  ${disc(26, 'margin-top:44px')}
`);

add('sq-w1-inside', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag('בלאק פריידי · רשימת המתנה', 24)}</div>
  ${head('שבוע רגיל <span class="hl">בתוך הקהילה</span>', 66, 'margin-top:36px')}
  <div style="margin-top:36px;width:100%" class="lives-sm">${lives(28)}</div>
  <div class="strip" style="font-size:27px;margin-top:24px">ובין הלייבים: כל חדרי הדיסקורד · ${n('2,000+')} סוחרים · ${n('9')} מנטורים</div>
  <div style="margin-top:18px">${rooms(21)}</div>
  <div class="grow"></div>
  ${disc(22)}
`);

add('sq-w2-report', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag('ובנוסף לקהילה', 24)}</div>
  ${head('<span class="hl">הדוח החודשי</span>', 76, 'margin-top:44px')}
  <p class="sub" style="font-size:34px;margin-top:34px">תאריכי המפנה הצפויים ב-${n('5')} נכסים, בתחילת כל חודש</p>
  <div class="stat" style="margin-top:20px"><b class="n" style="font-size:230px">76.8%</b><span style="font-size:34px">פגיעה ב-${n('12')} החודשים האחרונים</span></div>
  <div style="margin-top:40px">${assets(32)}</div>
  <p class="sub" style="font-size:28px;margin-top:40px">הדוח הוא חלק מהקהילה. עליו בנויים חלק מהלייבים והחדרים.</p>
  <div class="grow"></div>
  <div class="fine" style="font-size:22px;margin-bottom:8px">ממוצע של ${n('60')} תחזיות. ביצועי עבר אינם מעידים על העתיד.</div>
  ${disc(22)}
`);

add('sq-w3-dates', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag(`נובמבר ${n('2026')}`, 24)}</div>
  ${head('<span class="hl">התאריכים</span> של בלאק פריידי', 66, 'margin-top:40px')}
  <div style="margin-top:42px;width:100%">${timeline(30)}</div>
  <div class="grow"></div>
  ${disc(22)}
`);

add('p45-w1-follow', 1080, 1350, 'p45', `
  ${logo(260)}
  ${head('עקבתם מבחוץ.<br><span class="hl">הגיע הזמן להיכנס</span>', 82, 'margin-top:56px')}
  <div class="io" style="font-size:32px;margin-top:64px">
    <div class="io-out"><h3>מבחוץ</h3><ul><li>פוסט פה, סרטון שם</li><li>לנחש לבד מה חשוב</li><li>לסחור לבד</li></ul></div>
    <div class="io-in card"><h3>בפנים</h3><ul><li>${n('4')} לייבים בכל שבוע</li><li>כל חדרי הדיסקורד</li><li>${n('2,000+')} סוחרים ו-${n('9')} מנטורים</li><li>ובנוסף, הדוח החודשי</li></ul></div>
  </div>
  <div class="grow"></div>
  <div class="strip" style="font-size:32px">מי שברשימה נכנס ראשון ב-${n('23/11')}</div>
  ${cta('להרשמה לרשימת ההמתנה', 40, 'margin-top:40px')}
  ${disc(23, 'margin-top:34px')}
`);

add('p45-w2-fit', 1080, 1350, 'p45', `
  ${logo(260)}
  ${head('למי זה מתאים, <span class="hl">ולמי לא</span>', 76, 'margin-top:50px')}
  <div style="margin-top:56px;width:100%">${fit(30)}</div>
  <div class="grow"></div>
  ${cta('מתאים לכם? הצטרפו לרשימה', 38)}
  ${disc(23, 'margin-top:34px')}
`);

add('p45-w3-waiting', 1080, 1350, 'p45', `
  ${logo(260)}
  ${head('מה מחכה <span class="hl">ברשימה</span>', 84, 'margin-top:50px')}
  <div class="vps" style="font-size:34px;margin-top:56px;gap:36px">
    <div class="vp"><i>${n('1')}</i><div><h3>גישה מוקדמת ב-${n('23/11')}</h3><p>נכנסים לקהילה 24 שעות לפני שהיא נפתחת לכולם.</p></div></div>
    <div class="vp"><i>${n('2')}</i><div><h3>קישור הצטרפות אישי</h3><p>ביום הפתיחה, בלי לחפש ובלי לפספס.</p></div></div>
    <div class="vp"><i>${n('3')}</i><div><h3>מחיר בלאק פריידי</h3><p>חודש ראשון בקהילה ב-${n('197') + '&nbsp;₪'} במקום ${n('450') + '&nbsp;₪'}.</p></div></div>
  </div>
  ${renew(36, 'margin-top:56px')}
  <div class="grow"></div>
  ${chips(COMM_CHIPS, 28, 'margin:40px 0 44px')}
  ${cta('להרשמה לרשימת ההמתנה', 40)}
  ${disc(23, 'margin-top:34px')}
`);

add('report-peek-waitlist', 1080, 1350, 'p45', `
  ${logo(240)}
  ${head('הצצה <span class="hl">לדוח החודשי</span>', 74, 'margin-top:40px')}
  <p class="sub" style="font-size:30px;margin-top:26px">ככה בנוי הדוח. התוכן עצמו נשמר לחברי הקהילה.</p>
  <div class="rbox" style="height:760px;margin-top:20px">${reportStack(1.08)}</div>
  <div class="strip" style="font-size:30px">מי שברשימה נכנס ראשון ב-${n('23/11')}</div>
  <div class="grow"></div>
  ${disc(23)}
`);

add('hero-desktop-waitlist', 1920, 700, 'hd', `
  <div class="hd-main">
    ${logo(240)}
    ${tag(`בלאק פריידי · רשימת המתנה ${n('13–22/11')}`, 24, 'margin-top:26px')}
    ${head('מי שברשימה<br><span class="hl">נכנס ראשון</span> לקהילה', 72, 'margin-top:24px')}
    <p class="sub" style="font-size:26px;margin-top:26px;max-width:860px">${n('4')} לייבים בשבוע, כל חדרי הדיסקורד, ${n('2,000+')} סוחרים ו-${n('9')} מנטורים. ובנוסף, הדוח החודשי.</p>
    <div class="hd-act">${cta('להרשמה לרשימת ההמתנה', 30)}${disc(18)}</div>
  </div>
  <div class="hd-side">
    <div class="date-card sm"><span class="dc-k">גישה מוקדמת</span><b>${n('23/11')}</b><span class="dc-s">24 שעות לפני כולם</span></div>
    ${ziv(340, 560, 26)}
  </div>
`);

add('hero-mobile-waitlist', 1080, 1350, 'p45', `
  ${logo(270)}
  ${tag(`בלאק פריידי · רשימת המתנה ${n('13–22/11')}`, 28, 'margin-top:44px')}
  ${head('מי שברשימה <span class="hl">נכנס ראשון</span> לקהילה', 86, 'margin-top:44px')}
  <p class="sub" style="font-size:34px;margin-top:44px;max-width:900px">${n('4')} לייבים בשבוע, כל חדרי הדיסקורד, ${n('2,000+')} סוחרים ו-${n('9')} מנטורים. ובנוסף, הדוח החודשי.</p>
  <div class="date-card" style="margin-top:56px"><span class="dc-k">גישה מוקדמת לרשימה</span><b>${n('23/11')}</b><span class="dc-s">24 שעות לפני כולם</span></div>
  <div class="grow"></div>
  ${cta('להרשמה לרשימת ההמתנה', 40)}
  ${disc(23, 'margin-top:34px')}
`);

const mail = (name, h, sub, fs = 40) => add(name, 600, 200, 'mail', `
  <div class="m-txt">${head(h, fs)}${sub ? `<span class="m-sub">${sub}</span>` : ''}</div>
  ${logo(124)}
`);
mail('mail-w1-list', 'רשימת בלאק פריידי <span class="hl">נפתחה</span>', `נכנסים ראשונים ב-${n('23/11')}`, 30);
mail('mail-w2-report', 'הצצה <span class="hl">לדוח</span>', 'ככה בנוי הדוח החודשי');
mail('mail-w3-tomorrow', 'מחר <span class="hl">נפתח</span>', `${n('23/11')} · גישה מוקדמת לרשימה`);

/* ===== OFFER PHASE ===== */
const storyOffer = (name, tagT, headH, mid, ctaT, foot) => add(name, 1080, 1920, 'story', `
  ${logo(320)}
  <div class="grow col" style="gap:46px">
    ${tag(tagT, 34)}
    ${head(headH, 92, 'max-width:920px')}
    ${mid}
    <p class="per" style="font-size:38px">חודש ראשון בקהילת הסוחרים</p>
    <div class="glow">${price(250)}</div>
    ${renew(40)}
  </div>
  ${cta(ctaT, 46)}
  <div class="fine" style="font-size:30px;margin-top:34px">${foot}</div>
  ${disc(26, 'margin-top:20px')}
`);

storyOffer('story-03-early', `גישה מוקדמת · רק לרשימה · ${n('23/11')}`, 'הדלת <span class="hl">נפתחה</span> בשבילכם',
  chips(COMM_CHIPS, 30), 'להצטרפות לקהילה', `24 שעות לפני כולם · נסגר ב-${n('30/11')} בשעה ${n('23:59')}`);
storyOffer('story-04-open', `בלאק פריידי · מ-${n('24/11')}`, 'הקהילה <span class="hl">פתוחה לכולם</span>',
  chips(COMM_CHIPS, 30), 'אני רוצה להיכנס לקהילה', `המבצע נסגר ב-${n('30/11')} בשעה ${n('23:59')}`);

const clock = (units, fs) => `<div class="clock" style="font-size:${fs}px">${units.map(([b, s]) => `<div class="unit"><b>${b}</b><span>${s}</span></div>`).join('')}</div>`;
storyOffer('story-05-24h', 'בלאק פריידי · היום האחרון מתקרב', 'נשארו <span class="hl">24 שעות</span>',
  clock([[n('24'), 'שעות'], [n('00'), 'דקות'], [n('00'), 'שניות']], 30), 'להצטרפות לפני שנסגר', `המבצע נסגר ב-${n('30/11')} בשעה ${n('23:59')}`);
storyOffer('story-06-tonight', `${n('30/11')} · הזדמנות אחרונה`, 'נסגר <span class="hl">הלילה</span>',
  `<div class="date-card"><span class="dc-k">המבצע נסגר בשעה</span><b>${n('23:59')}</b></div>`, 'להצטרפות עכשיו', 'אחרי הלילה המחיר חוזר ל-' + n('450') + '&nbsp;₪' + ' לחודש');

add('sq-o1-inside', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag('בלאק פריידי', 24)}</div>
  ${head(`מה מקבלים <span class="hl">ב-${n('197') + '&nbsp;₪'}</span>`, 72, 'margin-top:40px')}
  <div class="pillars3" style="font-size:30px;margin-top:44px">
    <div class="pc"><i>${n('1')}</i><div><h3>${n('4')} לייבים בשבוע</h3><p>זיו, מני, רועי וגולן. ניתוחים, תרחישים ושאלות.</p></div></div>
    <div class="pc"><i>${n('2')}</i><div><h3>כל חדרי הדיסקורד</h3><p>מומחי מניות, חדר לכל נכס, רעיונות מסחר, קריפטו, מט"ח, נוסטרו וטווח ארוך.</p></div></div>
    <div class="pc"><i>${n('3')}</i><div><h3>ובנוסף: הדוח החודשי</h3><p>תאריכי מפנה ב-${n('5')} נכסים, בתחילת כל חודש.</p></div></div>
  </div>
  <div class="grow"></div>
  ${renew(32)}
  ${disc(22, 'margin-top:26px')}
`);

add('sq-o2-report', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag('ובנוסף לקהילה', 24)}</div>
  ${head('<span class="hl">הדוח החודשי</span> כלול', 72, 'margin-top:40px')}
  <p class="sub" style="font-size:32px;margin-top:28px">תאריכי המפנה הצפויים ב-${n('5')} נכסים, בתחילת כל חודש</p>
  <div class="stat" style="margin-top:10px"><b class="n" style="font-size:170px">76.8%</b><span style="font-size:30px">פגיעה ב-${n('12')} החודשים האחרונים</span></div>
  <div style="margin-top:24px">${assets(28)}</div>
  <div class="grow"></div>
  <div class="mini-price"><span>חודש ראשון בקהילה, כולל הדוח</span>${price(110, 30)}</div>
  ${renew(30, 'margin-top:18px')}
  <div class="fine" style="font-size:20px;margin-top:16px">ממוצע של ${n('60')} תחזיות. ביצועי עבר אינם מעידים על העתיד.</div>
  ${disc(20, 'margin-top:4px')}
`);

add('sq-o3-noprint', 1080, 1080, 'sq', `
  <div class="row-top">${logo(220)}${tag('בלאק פריידי', 24)}</div>
  ${head('<span class="hl">בלי</span> אותיות קטנות', 76, 'margin-top:40px')}
  <div style="margin-top:54px;width:100%">${terms(35, 2)}</div>
  <div class="grow"></div>
  ${renew(32)}
  ${disc(22, 'margin-top:26px')}
`);

add('p45-o1-hero', 1080, 1350, 'p45', `
  ${logo(250)}
  ${head('חודש שלם בתוך <span class="hl">קהילת הסוחרים</span>', 66, 'margin-top:34px;max-width:900px')}
  <div class="glow" style="margin-top:44px">${price(220)}</div>
  <p class="per" style="font-size:30px;margin-top:14px">לחודש הראשון · בלאק פריידי</p>
  ${renew(32, 'margin-top:18px')}
  <div style="margin-top:44px;width:100%">${pillars(27)}</div>
  <div class="grow" style="min-height:36px"></div>
  ${cta('אני רוצה להיכנס לקהילה', 36)}
  ${disc(23, 'margin-top:30px')}
`);

add('p45-o2-fit', 1080, 1350, 'p45', `
  ${logo(240)}
  ${head('למי זה מתאים, <span class="hl">ולמי לא</span>', 72, 'margin-top:40px')}
  <div style="margin-top:46px;width:100%">${fit(28)}</div>
  <div class="grow"></div>
  <div class="mini-price"><span>מתאים לכם? חודש ראשון ב-</span>${price(100, 26)}</div>
  ${renew(32, 'margin-top:20px')}
  ${disc(23, 'margin-top:28px')}
`);

add('p45-o3-payment', 1080, 1350, 'p45', `
  ${logo(240)}
  ${head('מה קורה עם התשלום, <span class="hl">בלי אותיות קטנות</span>', 68, 'margin-top:40px;max-width:940px')}
  <div style="margin-top:54px;width:100%">${terms(31, 1)}</div>
  <div class="grow"></div>
  ${renew(34)}
  ${cta('להצטרפות ב-' + n('197') + '&nbsp;₪', 38, 'margin-top:36px')}
  ${disc(23, 'margin-top:28px')}
`);

add('report-peek-open', 1080, 1350, 'p45', `
  ${logo(230)}
  ${head('הצצה <span class="hl">לדוח החודשי</span>', 70, 'margin-top:34px')}
  <p class="sub" style="font-size:28px;margin-top:20px">כלול בחודש בקהילה. התוכן עצמו נשמר לחברים.</p>
  <div class="rbox" style="height:680px;margin-top:6px">${reportStack(0.98)}</div>
  <div class="mini-price">${price(100, 26)}<span>חודש ראשון בקהילה, כולל הדוח</span></div>
  ${renew(30, 'margin-top:16px')}
  <div class="grow"></div>
  ${disc(22)}
`);

add('hero-desktop-open', 1920, 700, 'hd', `
  <div class="hd-main">
    ${logo(230)}
    ${tag(`בלאק פריידי · נסגר ב-${n('30/11')} בשעה ${n('23:59')}`, 24, 'margin-top:24px')}
    ${head('חודש שלם בתוך <span class="hl">קהילת הסוחרים</span>', 62, 'margin-top:26px')}
    <p class="sub" style="font-size:25px;margin-top:24px;max-width:900px">${n('4')} לייבים בשבוע, כל חדרי הדיסקורד, ${n('2,000+')} סוחרים ו-${n('9')} מנטורים. ובנוסף, הדוח החודשי.</p>
    <div class="hd-act">${cta('אני רוצה להיכנס לקהילה', 28)}${disc(18)}</div>
  </div>
  <div class="hd-price">
    <p class="per" style="font-size:28px">חודש ראשון</p>
    <div class="glow">${price(200)}</div>
    ${renew(26, 'margin-top:18px')}
  </div>
  <div class="hd-side">${ziv(360, 520, 26)}</div>
`);

add('hero-mobile-open', 1080, 1350, 'p45', `
  ${logo(260)}
  ${tag(`בלאק פריידי · נסגר ב-${n('30/11')} בשעה ${n('23:59')}`, 28, 'margin-top:36px')}
  ${head('חודש שלם בתוך <span class="hl">קהילת הסוחרים</span>', 74, 'margin-top:40px;max-width:920px')}
  <div class="glow" style="margin-top:50px">${price(230)}</div>
  <p class="per" style="font-size:32px;margin-top:22px">לחודש הראשון</p>
  ${renew(34, 'margin-top:22px')}
  ${chips([[n('4'), 'לייבים בשבוע'], [n('2,000+'), 'סוחרים'], [n('9'), 'מנטורים'], ['+', 'הדוח החודשי']], 26, 'margin-top:40px')}
  <div class="grow" style="min-height:40px"></div>
  ${cta('אני רוצה להיכנס לקהילה', 40)}
  ${disc(23, 'margin-top:30px')}
`);

mail('mail-o1-open', 'הקהילה <span class="hl">נפתחה</span>', `בלאק פריידי · עד ${n('30/11')}`);
add('mail-o2-bf', 600, 200, 'mail mail-p', `
  <div class="m-txt">${head('<span class="hl">בלאק פריידי</span>', 34)}<div class="renew" style="font-size:12px;margin-top:10px">${RENEW}</div></div>
  <div class="m-pr">${logo(104)}${price(58, 14)}</div>
`);
mail('mail-o3-tonight', 'נסגר <span class="hl">הלילה</span>', `המבצע נסגר ב-${n('23:59')}`);

const wa = (name, tagT, headH, foot) => add(name, 1080, 1080, 'sq wa', `
  <div class="row-top">${logo(220)}${tag(tagT, 26)}</div>
  ${head(headH, 80, 'margin-top:46px')}
  <p class="per" style="font-size:32px;margin-top:44px">חודש ראשון בקהילת הסוחרים</p>
  <div class="glow" style="margin-top:6px">${price(220)}</div>
  ${renew(34, 'margin-top:30px')}
  <div class="grow"></div>
  <div class="fine" style="font-size:26px;margin-bottom:14px">${foot}</div>
  ${disc(22)}
`);
wa('wa-1-early', `${n('23/11')} · רק לרשימה`, 'הגישה המוקדמת <span class="hl">נפתחה</span>', `${n('4')} לייבים בשבוע · כל חדרי הדיסקורד · ${n('2,000+')} סוחרים · ובנוסף, הדוח החודשי`);
wa('wa-2-bf', `${n('27/11')}`, 'היום <span class="hl">בלאק פריידי</span>', `המבצע נסגר ב-${n('30/11')} בשעה ${n('23:59')}`);
wa('wa-3-tonight', `${n('30/11')} · הזדמנות אחרונה`, 'נסגר <span class="hl">הלילה</span> ב-' + n('23:59'), `${n('4')} לייבים בשבוע · כל חדרי הדיסקורד · ${n('9')} מנטורים · ובנוסף, הדוח החודשי`);

// ---------- css ----------
const CSS = fs.readFileSync(path.join(__dirname, 'banners.css'), 'utf8').replace('__LOGO__', LOGO);
const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>Black Friday banners v2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap">
<style>${CSS}</style></head><body>
${B.map(b => `<section class="bn ${b.cls}" data-name="${b.name}" style="width:${b.w}px;height:${b.h}px">${b.html}</section>`).join('\n')}
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'banners.html'), html);
console.log('banners:', B.length);
