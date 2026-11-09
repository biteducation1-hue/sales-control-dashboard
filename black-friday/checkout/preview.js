const {chromium}=require('playwright');const fs=require('fs');
const code=fs.readFileSync(process.argv[2],'utf8');const out=process.argv[3];
(async()=>{const b=await chromium.launch();
for(const [w,n] of [[1440,'d'],[390,'m']]){const p=await b.newPage({viewport:{width:w,height:900}});
await p.route('https://cyclestrading-course.com/black-friday-197/',async r=>{let h=fs.readFileSync(process.argv[4],'utf8');h=h.replace('</head>',code+'</head>');r.fulfill({status:200,body:h,contentType:'text/html; charset=utf-8'});});
await p.goto('https://cyclestrading-course.com/black-friday-197/',{waitUntil:'networkidle',timeout:60000});await p.waitForTimeout(2500);
await p.screenshot({path:out+'-'+n+'.png',fullPage:true});}
await b.close();})();
