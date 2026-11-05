const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1});
await p.goto('file:///home/user/sales-control-dashboard/black-friday/landing-v2.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
await p.screenshot({path:process.argv[2]+'/ref1.png'});
await p.evaluate(()=>window.scrollTo(0,900));await p.screenshot({path:process.argv[2]+'/ref2.png'});
await p.evaluate(()=>window.scrollTo(0,1800));await p.screenshot({path:process.argv[2]+'/ref3.png'});
await b.close();})();
