const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('/Users/jl/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'test-results');
fs.mkdirSync(out, { recursive: true });
const fixture = `<!doctype html><html lang="ko" data-theme="claude"><meta charset="utf-8"><style>
body { font-family: Arial, sans-serif; font-size:16px; color:#222; background:white; margin:24px }
body.dark { color:#eee; background:#181818 }
.card { color:#222; background:white; padding:16px }
.danger { color:rgb(190, 20, 30) }
.serif { font-family:Georgia, serif }
.katex .mathnormal { font-family: "Times New Roman", serif; font-style:italic }
.monaco-editor span { font-family:Monaco, monospace }
.icon { font-family: "Test Icons", fantasy }
pre { font-family:Monaco, monospace; white-space:pre; overflow:auto; background:#eee; color:#222 }
.token { color:rgb(140, 30, 130) }
.bold { font-weight:700 }
article { max-width:800px } .controls { display:flex; gap:8px }
button { font-family:Arial; font-size:14px; line-height:20px; background:#1454aa; color:white }
input { font-family:Arial; font-size:14px }
</style><body><h1>한글 · English Typography</h1><article class="prose">
<p id="bodyText">한글 본문과 English text의 가독성. 글자 크기와 줄 간격을 확인합니다.</p>
<p lang="en" id="english">English body text with readable spacing.</p>
<p><strong><span id="bold">중요한 내용 Bold</span></strong> <span class="bold" id="siteBold">Site bold</span></p>
<p class="serif" id="serif">Serif <span id="serifChild">인용 내용</span></p>
<p style="font-family: sans-serif" id="sans">Explicit sans-serif</p>
<p style="font  : italic 20px Georgia" id="shorthand">Explicit font shorthand <span id="shorthandChild">유지</span></p>
<pre id="pre"><code id="code"><span id="token" class="token">const</span> longLine = '${'x'.repeat(240)}';</code></pre>
<p>Inline <code><span id="inlineCode">foo(bar)</span></code></p>
<p>Keyboard <kbd id="kbd">Ctrl</kbd> Output <samp id="samp">OK</samp></p>
<div class="katex"><span id="math" class="mathnormal">x + y = ∑</span></div>
<p>Inline math <span class="katex"><span id="inlineMath" class="mathnormal">x + y</span></span></p>
<div contenteditable="true" style="font: 15px Monaco"><p id="editable">Editable text</p></div>
<math><mi id="mathml">x</mi><mo>+</mo><mn>2</mn></math>
<div class="monaco-editor"><span id="editor">Editor text</span></div>
<span class="icon" id="icon">★</span>
<div class="card"><span id="cardText">흰색 카드 · White card</span><span class="danger" id="danger"> 오류 Error</span></div>
<div class="controls"><button id="button">Action</button><input id="input" value="입력 Input"></div>
<p id="long">${'VeryLongUnbrokenText'.repeat(40)}</p></article></body></html>`;
const ids = ['bodyText','english','bold','siteBold','serif','serifChild','sans','shorthand','shorthandChild','pre','code','token','inlineCode','kbd','samp','math','inlineMath','editable','mathml','editor','icon','cardText','danger','button','input','long'];
async function measure(page) {
  return page.evaluate(ids => {
    const result = {};
    for (const id of ids) { const el=document.getElementById(id), s=getComputedStyle(el), r=el.getBoundingClientRect(); result[id]={font:s.fontFamily,weight:s.fontWeight,variation:s.fontVariationSettings,color:s.color,background:s.backgroundColor,size:s.fontSize,lineHeight:s.lineHeight,wordBreak:s.wordBreak,width:r.width,height:r.height}; }
    result.pageOverflow=document.documentElement.scrollWidth > innerWidth;
    result.cssRules=[...document.styleSheets].map(s=>s.cssRules.length);
    result.support={mozDocument:CSS.supports('at-rule(@-moz-document)'),contrastHigh:matchMedia('(prefers-contrast: high)').matches,contrastMore:matchMedia('(prefers-contrast: more)').matches};
    return result;
  }, ids);
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const report={chrome:browser.version(),generatedAt:new Date().toISOString(),runs:[]};
  try {
    const oldGeneral=fs.readFileSync(path.join(__dirname,'fixtures/original-general.css'),'utf8');
    const oldClaude=fs.readFileSync(path.join(__dirname,'fixtures/original-claude.css'),'utf8');
    const variants={'original-raw':oldGeneral,'original-unwrapped':oldGeneral.replace('@-moz-document regexp(".*") {','').replace(/}\s*$/,''),'original-claude':oldClaude};
    if(fs.existsSync(path.join(root,'typography-chrome.css'))) {
      variants['updated-general']=fs.readFileSync(path.join(root,'typography-chrome.css'),'utf8');
      variants['updated-claude']=fs.readFileSync(path.join(root,'claude-chrome.css'),'utf8');
    }
    for(const viewport of [{width:1440,height:1100},{width:390,height:844}]) for(const theme of ['light','dark']) {
      const page=await browser.newPage({viewport,colorScheme:theme,contrast:'more',reducedMotion:'reduce'});
      await page.setContent(fixture);
      if(theme==='dark') await page.evaluate(()=>document.body.classList.add('dark'));
      const baseline=await measure(page);
      for(const [name,css] of Object.entries(variants)) {
        const style=await page.addStyleTag({content:css});
        const measured=await measure(page);
        if(name==='updated-general' && viewport.width===1440 && theme==='dark') {
          const cdp=await page.context().newCDPSession(page);
          await cdp.send('DOM.enable');
          await cdp.send('CSS.enable');
          const {root:doc}=await cdp.send('DOM.getDocument');
          measured.renderedFonts={};
          for(const id of ['bodyText','bold','token','math']) {
            const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:doc.nodeId,selector:`#${id}`});
            measured.renderedFonts[id]=(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;
          }
          await cdp.detach();
        }
        let checks=[];
        if(name.startsWith('updated')) {
          const equal=(id,prop)=>{assert.equal(measured[id][prop],baseline[id][prop],`${name}/${theme}/${viewport.width}: ${id}.${prop}`);checks.push(`${id}.${prop} preserved`)};
          for(const id of ['math','mathml','editor','icon','sans','serif','serifChild']) equal(id,'font');
          for(const id of ['shorthand','shorthandChild','editable']) for(const prop of ['font','size','lineHeight']) equal(id,prop);
          equal('inlineMath','font');
          for(const id of ['cardText','danger','token','button']) equal(id,'color');
          for(const id of ['bold','siteBold']) {equal(id,'weight');equal(id,'variation')}
          for(const id of ['button','input']) {equal(id,'size');equal(id,'height')}
          for(const id of ['pre','code','token','inlineCode','kbd','samp']) {assert.match(measured[id].font,/D2Coding.*monospace/); checks.push(`${id} monospace stack`)}
          assert.match(measured.bodyText.font,/Pretendard/); checks.push('body font applied');
          assert.equal(measured.bodyText.size,'18px');checks.push('reader body 18px');
          assert.equal(measured.pageOverflow,false);checks.push('no page overflow');
          assert.ok(measured.cssRules.at(-1)>0); checks.push('stylesheet parsed');
        }
        report.runs.push({name,theme,viewport,baseline,measured,checks});
        if(viewport.width===1440 && theme==='dark' && ['original-unwrapped','updated-general'].includes(name)) await page.screenshot({path:path.join(out,`${name}.png`),fullPage:true});
        await style.evaluate(el=>el.remove());
      }
      await page.evaluate(()=>document.documentElement.removeAttribute('data-theme'));
      if(variants['updated-claude']) {
        await page.addStyleTag({content:variants['updated-claude']});
        const measured=await measure(page);
        assert.match(measured.bodyText.font,/Pretendard/);
        assert.match(measured.token.font,/monospace/);
        report.runs.push({name:'updated-claude-without-theme',theme,viewport,measured,checks:['body font without theme attribute','code font without theme attribute']});
      }
      await page.close();
    }
    fs.writeFileSync(path.join(out,'chrome-measurements.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({chrome:report.chrome,runs:report.runs.length,assertions:report.runs.reduce((n,r)=>n+r.checks.length,0),output:path.join(out,'chrome-measurements.json')}));
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
