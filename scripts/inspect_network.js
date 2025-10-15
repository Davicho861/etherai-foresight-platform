import puppeteer from 'puppeteer';

const PLANS = ['starter','growth','panteon'];
const HOST = process.env.FRONTEND_HOST || 'http://localhost:3002';

(async ()=>{
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox','--disable-features=ServiceWorker'] });
  for(const plan of PLANS){
    const url = `${HOST}/demo?plan=${plan}`;
    console.log('\n=== PLAN', plan, '===>', url);
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE_CONSOLE', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE_ERROR', err && err.message));
    page.on('requestfailed', req => console.log('REQUEST_FAILED', req.url(), req.failure && req.failure().errorText));
    page.on('response', async res => {
      try{
        const rurl = res.url();
        if(rurl.includes('/api/') || rurl.includes('/api')){
          let body = '';
          try{
            const ct = (res.headers()['content-type'] || res.headers()['Content-Type'] || '');
            if(ct.includes('application/json')) body = await res.text(); else body = '[non-json]';
          }catch(e){ body = '[body-error]'; }
          console.log('RESPONSE', res.status(), rurl, body ? body.slice(0,1200) : '');
        }
      }catch(e){}
    });

    try{
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    }catch(e){ console.log('GOTO_ERROR', e && e.message); }
    if(page.waitForTimeout) await page.waitForTimeout(2500); else await page.evaluate(()=>new Promise(r=>setTimeout(r,2500)));
    const title = await page.title();
    console.log('PAGE TITLE:', title);
    const snippet = await page.evaluate(()=>{
      const main = document.querySelector('main');
      const text = main ? main.innerText : document.body.innerText;
      return text ? text.slice(0,1200) : '';
    });
    console.log('DOM SNIPPET:\n', snippet.replace(/\n+/g,'\n').slice(0,1200));
    await page.close();
  }
  await browser.close();
})();
