// 发布外壳准备：输入已验收完整单HTML，业务母版和原文件不改。
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'prototype'),notes=JSON.parse(fs.readFileSync(path.join(dir,'release-notes.json'),'utf8'));
const input=process.argv[2];if(!input)throw Error('Usage: node scripts/prepare-release.cjs <verified-full-html>');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();const base=fs.readFileSync(input,'utf8');assert(base.includes('var docs=')&&base.includes('id="screen"'),'Not a verified full prototype');assert(!base.includes('ioc-release-data'),'Input must not contain a release overlay');
const old=JSON.parse(fs.readFileSync(path.join(dir,'version.json'),'utf8'));const expected=old.businessSha256||old.sha256;assert.equal(sha(Buffer.from(base)),expected,'Input differs from current verified business artifact; update version manifest only after mother/package QA');
assert(notes.id&&notes.date&&notes.items.length>0);const data=JSON.stringify(notes).replace(/</g,'\\u003c');
if(old.version===notes.id&&old.notesSha256&&old.notesSha256!==sha(Buffer.from(data)))throw Error('Notes changed without a new release id');
const clientSha=sha(fs.readFileSync(path.join(dir,'release-notes.js'))).slice(0,16);
const addition='<!-- release-only:start --><script id="ioc-release-data" type="application/json">'+data+'</script><script defer src="./release-notes.js?v='+clientSha+'"></script><!-- release-only:end -->';
const html=base.replace(/<\/body>\s*<\/html>\s*$/i,addition+'</body></html>');assert.notEqual(html,base);
fs.writeFileSync(path.join(dir,'index.html'),html);
const version={...old,version:notes.id,description:'Git发布版新增首次更新说明及查看指引；九屏业务内容不变',bytes:Buffer.byteLength(html),sha256:sha(Buffer.from(html)),businessVersion:old.businessVersion||old.version,businessSha256:expected,notesSha256:sha(Buffer.from(data)),releaseNotes:'embedded with actual HTML version'};
fs.writeFileSync(path.join(dir,'version.json'),JSON.stringify(version,null,2));console.log(JSON.stringify({version:version.version,bytes:version.bytes,sha256:version.sha256,businessSha256:expected}));
