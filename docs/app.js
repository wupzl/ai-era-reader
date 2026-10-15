const root = document.documentElement;
function save(key,value){try{localStorage.setItem(key,value)}catch{}}
function get(key){try{return localStorage.getItem(key)}catch{return null}}
let size = Number(get('reader-size')) || 18;
function resize(delta){size=Math.min(26,Math.max(16,size+delta));root.style.setProperty('--reading-size',size+'px');save('reader-size',size)}
resize(0);
if(get('reader-theme')==='dark')root.dataset.theme='dark';
document.querySelector('#smaller').onclick=()=>resize(-1);
document.querySelector('#larger').onclick=()=>resize(1);
document.querySelector('#theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('reader-theme',root.dataset.theme)};
document.querySelectorAll('article img').forEach(img=>{const fail=()=>{const note=document.createElement('p');note.className='image-note';note.textContent='原文配图暂时无法加载';img.replaceWith(note)};img.addEventListener('error',fail,{once:true});if(img.complete&&!img.naturalWidth)fail()});
