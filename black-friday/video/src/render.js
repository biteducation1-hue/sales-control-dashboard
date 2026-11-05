// Usage:
//   node render.js stills <bf|ev> t1,t2,...        -> work/still-<v>-<t>.png
//   node render.js seg <bf|ev> <f0> <f1> <out.mp4> -> renders frames [f0,f1) at 30fps
const {chromium}=require('playwright');
const {spawn}=require('child_process');
const path=require('path');
const FPS=30;
const ROOT=path.resolve(__dirname,'..');
(async()=>{
  const [mode,ver,a,b,out]=process.argv.slice(2);
  const browser=await chromium.launch({args:['--allow-file-access-from-files']});
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.goto('file://'+path.join(__dirname,'scene.html')+'?v='+ver);
  await page.evaluate(()=>window.ready);
  if(mode==='stills'){
    for(const t of a.split(',').map(Number)){
      await page.evaluate(t=>render(t),t);
      await page.screenshot({path:path.join(ROOT,'work',`still-${ver}-${t.toFixed(2)}.png`)});
    }
  }else if(mode==='seg'){
    const f0=+a,f1=+b;
    const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',
      '-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-r',String(FPS),
      '-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',out],{stdio:['pipe','inherit','inherit']});
    for(let f=f0;f<f1;f++){
      await page.evaluate(t=>render(t),f/FPS);
      const buf=await page.screenshot({type:'jpeg',quality:95});
      if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
      if(f%150===0) console.log(ver,'frame',f);
    }
    ff.stdin.end();
    await new Promise(r=>ff.on('close',r));
    console.log('done',out);
  }
  await browser.close();
})();
