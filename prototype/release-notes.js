(function(){'use strict';
  // 仅由发布准备脚本写入Git交付外壳；本地九屏母版不加载此组件。
  if(location.protocol==='file:')return;
  var configNode=document.getElementById('ioc-release-data');if(!configNode)return;
  var release;try{release=JSON.parse(configNode.textContent);}catch(ignore){return;}
  if(!release.id||!Array.isArray(release.items))return;
  var frame=document.getElementById('screen'),loading=document.getElementById('loading');if(!frame)return;
  var key='hhl:ioc:release-read:'+release.id,seen=false,opened=false,lastFocus=null,frameInert=false;
  try{seen=localStorage.getItem(key)==='read';}catch(ignore){try{seen=sessionStorage.getItem(key)==='read';}catch(ignoreAgain){}}
  var style=document.createElement('style');style.textContent=`
  .release-entry{position:fixed;z-index:50;left:12px;bottom:8px;padding:5px 10px;border:1px solid #4b859d66;border-radius:3px;background:#082c3de8;color:#b9d3df;font:12px/1.4 "Microsoft YaHei",sans-serif;cursor:pointer}
  .release-layer{position:fixed;z-index:200;inset:0;display:grid;place-items:center;padding:20px;background:#010c16b8;backdrop-filter:blur(3px);font-family:"Microsoft YaHei",sans-serif;color:#e9f6fc;box-sizing:border-box}
  .release-layer[hidden]{display:none!important}
  .release-dialog{position:relative;display:flex;flex-direction:column;width:min(680px,100%);max-height:min(84vh,820px);border:1px solid #5fb6d67a;border-radius:6px;background:linear-gradient(145deg,#103c50,#062132);box-shadow:0 20px 65px #0009;box-sizing:border-box}
  .release-head{padding:25px 30px 16px;border-bottom:1px solid #83cee323}
  .release-head h2{margin:0 46px 8px 0;font-size:24px;line-height:1.4;color:#f2fbff}
  .release-head time{font-size:13px;color:#8eafbf}
  .release-close{position:absolute;right:14px;top:14px;width:36px;height:36px;border:0;background:transparent;color:#b5d1df;font:26px Arial;cursor:pointer}
  .release-body{padding:16px 30px;overflow:auto;min-height:0;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#317b99 #082638}
  .release-intro,.release-notice{font-size:14px;line-height:1.7;color:#b7d0dc;margin:0 0 16px}
  .release-item{padding:15px 0;border-top:1px solid #82cee51e}
  .release-item h3{margin:0 0 8px;font-size:17px;line-height:1.5;color:#eaf7fd}
  .release-item p{margin:6px 0;font-size:14px;line-height:1.75;overflow-wrap:anywhere}
  .release-where{color:#8fc9e1}
  .release-go{margin-top:4px;padding:4px 0;border:0;background:none;color:#79d5f5;font:14px "Microsoft YaHei";cursor:pointer}
  .release-notice{margin:12px 0 0;font-size:12px;color:#89a8b7}
  .release-foot{padding:15px 30px;border-top:1px solid #83cee323;text-align:right}
  .release-confirm{height:38px;padding:0 26px;border:1px solid #459ec0;border-radius:3px;background:#146485;color:#f1fbff;font:15px "Microsoft YaHei";cursor:pointer}
  .release-layer button:focus-visible,.release-entry:focus-visible{outline:2px solid #91dff7;outline-offset:3px}
  @media(max-width:520px){.release-layer{padding:12px}.release-head{padding:20px 20px 12px}.release-body{padding:14px 20px}.release-dialog{max-height:90vh}.release-head h2{font-size:22px}.release-foot{padding:12px 20px}}
  `;document.head.appendChild(style);
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
  var entry=el('button','release-entry','更新说明');entry.type='button';entry.title='查看本次原型更新';document.body.appendChild(entry);
  var layer=el('div','release-layer');layer.hidden=true;var dialog=el('section','release-dialog');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','release-heading');
  var head=el('header','release-head'),title=el('h2','',release.title||'本次原型更新');title.id='release-heading';head.appendChild(title);head.appendChild(el('time','',release.date));var close=el('button','release-close','×');close.type='button';close.setAttribute('aria-label','关闭更新说明');head.appendChild(close);
  var body=el('div','release-body');if(release.intro)body.appendChild(el('p','release-intro',release.intro));
  release.items.forEach(function(item){var row=el('section','release-item');row.appendChild(el('h3','',item.title));row.appendChild(el('p','',item.change));if(item.where)row.appendChild(el('p','release-where','去哪里看：'+item.where));if(['overview','industry','vertical','lowcarbon','security','emergency','passage','equipment','environment'].includes(item.route)){var go=el('button','release-go','去看看 →');go.type='button';go.addEventListener('click',function(){dismiss();location.hash='#/'+item.route;});row.appendChild(go);}body.appendChild(row);});if(release.notice)body.appendChild(el('p','release-notice',release.notice));
  var foot=el('footer','release-foot'),ok=el('button','release-confirm','知道了');ok.type='button';foot.appendChild(ok);dialog.append(head,body,foot);layer.appendChild(dialog);document.body.appendChild(layer);
  function open(){if(!layer.hidden)return;lastFocus=document.activeElement;frameInert=frame.inert;frame.inert=true;entry.inert=true;layer.hidden=false;opened=true;ok.focus();}
  function dismiss(){if(layer.hidden)return;layer.hidden=true;seen=true;try{localStorage.setItem(key,'read');}catch(ignore){try{sessionStorage.setItem(key,'read');}catch(ignoreAgain){}}frame.inert=frameInert;entry.inert=false;if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});}
  close.addEventListener('click',dismiss);ok.addEventListener('click',dismiss);entry.addEventListener('click',open);
  layer.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();dismiss();}if(e.key==='Tab'){var buttons=Array.from(layer.querySelectorAll('button')),first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  function firstVisit(){if(!seen&&!opened&&(!loading||loading.hidden))open();}
  frame.addEventListener('load',function(){setTimeout(firstVisit,0);});firstVisit();
})();
