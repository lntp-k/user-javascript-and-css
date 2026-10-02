const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('/Users/jl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const targets=[
  {name:'mdn',url:'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family',css:'typography-chrome.css'},
  {name:'katex',url:'https://katex.org/',css:'typography-chrome.css'},
  {name:'claude-public',url:'https://claude.ai/',css:'claude-chrome.css'}
];
const previousReport=fs.existsSync(path.join(root,'test-results/live-measurements.json'))
  ? JSON.parse(fs.readFileSync(path.join(root,'test-results/live-measurements.json'),'utf8')) : null;
async function measure(page) {
  return page.evaluate(()=>{
    const snap=selector=>[...document.querySelectorAll(selector)].slice(0,100).map(el=>{const s=getComputedStyle(el);return {tag:el.tagName,font:s.fontFamily,weight:s.fontWeight,color:s.color,background:s.backgroundColor,size:s.fontSize,line:s.lineHeight,text:(el.textContent||'').trim().slice(0,50)}});
    return {title:document.title,url:location.href,themeAttributes:[...document.querySelectorAll('[data-theme]')].slice(0,5).map(e=>e.getAttribute('data-theme')),body:snap('body'),paragraphs:snap('article p, .prose p, main p'),code:snap('pre code, pre code span'),math:snap('.katex .mathnormal, .katex .mord, mjx-container'),buttons:snap('button'),overflow:document.documentElement.scrollWidth>innerWidth};
  });
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const report={chrome:browser.version(),generatedAt:new Date().toISOString(),pages:[]};
  try {
    for(const target of targets) {
      if(target.name==='claude-public' && process.argv.includes('--skip-claude')) {
        const previous=previousReport?.pages.find(p=>p.name===target.name && p.status===403);
        report.pages.push(previous ? {...previous,notRerun:true,observedAt:previous.observedAt || previousReport.generatedAt}
          : {...target,result:'Not verified; --skip-claude requested',notRerun:true});
        continue;
      }
      const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'light'});
      try {
        const response=await page.goto(target.url,{waitUntil:'domcontentloaded',timeout:25000});
        await page.waitForTimeout(1500);
        const before=await measure(page);
        if(response.status()>=400 || /just a moment|access denied|verify you are human/i.test(before.title)) {
          report.pages.push({...target,status:response.status(),result:'blocked; no bypass attempted',before});
          continue;
        }
        await page.addStyleTag({content:fs.readFileSync(path.join(root,target.css),'utf8')});
        await page.evaluate(()=>document.fonts.ready);
        const after=await measure(page);
        const checks=[];
        assert.match(after.body[0].font,/Pretendard/);checks.push('live body target font applied');
        if(target.name==='mdn') {
          assert.ok(after.paragraphs.some(p=>/Pretendard/.test(p.font)), 'live reading paragraph font applied');
          checks.push('live reading paragraph font applied');
        }
        for(const field of ['body','paragraphs','code','math','buttons']) {
          assert.equal(after[field].length,before[field].length,`${target.name} DOM ${field}`);
          for(let i=0;i<after[field].length;i++) {
            for(const prop of ['color','background','weight']) {
              assert.equal(after[field][i][prop],before[field][i][prop],`${target.name} ${field}[${i}].${prop}`);
              checks.push(`${field}[${i}].${prop}`);
            }
            if(field==='math') {assert.equal(after[field][i].font,before[field][i].font);checks.push(`math[${i}].font`)}
            if(field==='buttons') {assert.equal(after[field][i].size,before[field][i].size);checks.push(`buttons[${i}].size`)}
          }
        }
        assert.equal(after.overflow,before.overflow);checks.push('page overflow preserved');
        await page.screenshot({path:path.join(root,'test-results',`${target.name}-updated.png`)});
        report.pages.push({...target,status:response.status(),result:'passed',before,after,checks});
      } catch(error) {report.pages.push({...target,result:'failed',error:String(error)});process.exitCode=1}
      finally {await page.close()}
    }
    fs.writeFileSync(path.join(root,'test-results/live-measurements.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report.pages.map(p=>({name:p.name,status:p.status,result:p.result,mathNodes:p.after?.math.length,checks:p.checks?.length,error:p.error})),null,2));
  } finally {await browser.close()}
})();
