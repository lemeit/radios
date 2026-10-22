'use strict';
const STATIONS = [
  {
    "name": "Radio 10",
    "freq": "710 AM",
    "streams": [
      "https://radio10.stweb.tv/radio10/live/playlist.m3u8"
    ],
    "accent": "#1a6ec2",
    "logo": "./assets/radio10.png",
    "id": "radio10"
  },
  {
    "name": "El Destape Radio",
    "freq": "1070 AM",
    "streams": [
      "https://live-ar1.cdnrad.com/hls/radio-2123/live.m3u8"
    ],
    "accent": "#e74c3c",
    "logo": "./assets/destape.png",
    "id": "destape"
  },
  {
    "name": "FM La Tribu",
    "freq": "88.7 FM",
    "streams": [
      "https://radio01.ferozo.com/proxy/ra01000659?mp=/stream"
    ],
    "accent": "#e0e0e0",
    "logo": "./assets/station-2.png",
    "id": "tribu"
  },
  {
    "name": "FM Aspen",
    "freq": "102.3 FM",
    "streams": [
      "https://playerservices.streamtheworld.com/api/livestream-redirect/ASPEN.mp3"
    ],
    "accent": "#c0392b",
    "logo": "./assets/station-3.png",
    "id": "aspen"
  }
];
let lastStation=0;
try{const n=Number(localStorage.getItem('miradio-last'));if(Number.isInteger(n)&&n>=0&&n<STATIONS.length)lastStation=n;}catch(_){}
const aud=document.getElementById('aud'),playBtn=document.getElementById('playBtn'),
  prevBtn=document.getElementById('prevBtn'),nextBtn=document.getElementById('nextBtn'),
  volEl=document.getElementById('vol'),dotEl=document.getElementById('dot'),
  pillTxt=document.getElementById('pillTxt'),grid=document.getElementById('grid'),
  offlineBar=document.getElementById('offlineBar'),
  installBanner=document.getElementById('installBanner'),
  installBtn=document.getElementById('installBtn'),
  dismissBtn=document.getElementById('dismissBtn');

const tiles=[],tileWaveBars=[];
STATIONS.forEach((s,i)=>{
  const tile=document.createElement('button');
  tile.type='button';tile.className='tile '+s.id;
  tile.setAttribute('aria-label','Escuchar '+s.name+', '+s.freq);
  tile.setAttribute('aria-pressed','false');
  tile.innerHTML=`<span class="tile-top"><span class="station-number">0${i+1}</span><span class="tile-state">ESCUCHAR <span aria-hidden="true">↗</span></span></span>
    <span class="tile-logo-wrap"><img class="tile-logo" src="${s.logo}" alt="" draggable="false"></span>
    <span class="tile-bottom"><span class="station-name">${s.name}</span><span class="tile-freq">${s.freq}</span></span>`;
  const waveEl=document.createElement('span');waveEl.className='tile-wave';waveEl.setAttribute('aria-hidden','true');
  const bars=Array.from({length:5},()=>{const bar=document.createElement('i');waveEl.appendChild(bar);return bar;});
  tileWaveBars.push(bars);tile.appendChild(waveEl);
  tile.addEventListener('click',()=>sel(i));grid.appendChild(tile);tiles.push(tile);
});

let cur=-1,playing=false,usedStreamIdx=0,vuInt=null;
const wPeaks=[10,14,9,13,11];
function setPlayButton(on){
  playBtn.classList.toggle('playing',on);
  playBtn.setAttribute('aria-label',on?'Detener radio':'Reproducir radio');
  playBtn.setAttribute('aria-pressed',String(on));
  playBtn.innerHTML=on?'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5.5 19 12 9 18.5Z" fill="currentColor"/></svg>';
}
setPlayButton(false);

function sel(i){
  if(cur===i&&playing){stp();return;}
  cur=i;usedStreamIdx=0;
  tiles.forEach((t,j)=>{t.classList.toggle('active',j===i);t.setAttribute('aria-pressed',String(j===i));});
  document.getElementById('stationTitle').textContent=STATIONS[i].name;
  document.getElementById('stationFreq').textContent=STATIONS[i].freq;
  document.getElementById('playerArt').src=STATIONS[i].logo;
  document.getElementById('playerArt').className='player-art '+STATIONS[i].id;
  try{localStorage.setItem('miradio-last',String(i));}catch(_){}
  playStream(STATIONS[i].streams[0]);
}
let hls=null,playAttempt=0,failedAttempt=-1;
function releaseStream(){
  ++playAttempt;
  if(hls){hls.destroy();hls=null;}
  aud.onerror=null;
  aud.pause();aud.removeAttribute('src');aud.load();
}
function playStream(url){
  releaseStream();
  const attempt=playAttempt;
  playing=false;stopW();updateMS(false);
  setPlayButton(false);
  setS('buf','cargando…');
  aud.volume=volEl.value/100;
  const fail=()=>tryNextStream(attempt);
  const play=()=>{
    if(attempt!==playAttempt)return;
    const p=aud.play();
    if(p)p.catch(err=>{
      if(attempt!==playAttempt||err.name==='AbortError')return;
      if(err.name==='NotAllowedError'){setS('off','tocá reproducir');return;}
      fail();
    });
  };
  aud.onerror=fail;
  if(/\.m3u8(?:$|\?)/i.test(url)&&!aud.canPlayType('application/vnd.apple.mpegurl')){
    if(!window.Hls||!Hls.isSupported()){fail();return;}
    hls=new Hls();
    hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)fail();});
    hls.on(Hls.Events.MANIFEST_PARSED,play);
    hls.loadSource(url);hls.attachMedia(aud);
  }else{
    aud.src=url;aud.load();play();
  }
}
function tryNextStream(attempt=playAttempt){
  if(cur<0||attempt!==playAttempt||failedAttempt===attempt)return;
  failedAttempt=attempt;
  const s=STATIONS[cur];usedStreamIdx++;
  if(usedStreamIdx<s.streams.length)playStream(s.streams[usedStreamIdx]);
  else{
    releaseStream();setS('err','error');playing=false;
    setPlayButton(false);stopW();updateMS(false);
  }
}
function stp(){
  releaseStream();
  playing=false;setPlayButton(false);
  setS('off','en espera');stopW();updateMS(false);
}
aud.addEventListener('playing',()=>{
  playing=true;setPlayButton(true);
  setS('on','en vivo');startW();
  if(cur>=0)updateMS(true,STATIONS[cur]);
});
aud.addEventListener('waiting',()=>{setS('buf','cargando…');stopW();});
aud.addEventListener('stalled',()=>setS('buf','reconectando…'));


playBtn.addEventListener('click',()=>{if(cur<0){sel(lastStation);return;}if(playing)stp();else{usedStreamIdx=0;playStream(STATIONS[cur].streams[0]);}});
prevBtn.addEventListener('click',()=>sel(cur<=0?STATIONS.length-1:cur-1));
nextBtn.addEventListener('click',()=>sel((cur+1)%STATIONS.length));
function updateVolume(){
  aud.volume=Number(volEl.value)/100;
  volEl.style.setProperty('--volume',volEl.value+'%');
  document.getElementById('volValue').textContent=volEl.value+'%';
  try{localStorage.setItem('miradio-volume',volEl.value);}catch(_){}
}
try{const saved=localStorage.getItem('miradio-volume');if(saved!==null&&Number.isFinite(Number(saved)))volEl.value=saved;}catch(_){}
volEl.addEventListener('input',updateVolume);updateVolume();

function setS(st,txt){
  dotEl.className='dot';
  if(st==='on')dotEl.classList.add('on');
  else if(st==='buf')dotEl.classList.add('buf');
  else if(st==='err')dotEl.classList.add('err');
  pillTxt.textContent=txt;
  document.body.dataset.playback=st;
  tiles.forEach((t,i)=>{t.querySelector('.tile-state').innerHTML=i===cur?(st==='on'?'AL AIRE':st==='buf'?'CONECTANDO':st==='err'?'REINTENTAR':'ESCUCHAR <span aria-hidden="true">↗</span>'):'ESCUCHAR <span aria-hidden="true">↗</span>';});
}
function startW(){
  stopW();if(cur<0)return;
  const bars=tileWaveBars[cur];
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  vuInt=setInterval(()=>{bars.forEach((b,i)=>{b.style.height=Math.max(2,Math.random()*wPeaks[i])+'px';});},120);
}
function stopW(){clearInterval(vuInt);tileWaveBars.forEach(bars=>bars.forEach(b=>b.style.height='3px'));}

function updateMS(isPlaying,s){
  if(!('mediaSession' in navigator))return;
  if(isPlaying&&s){
    navigator.mediaSession.metadata=new MediaMetadata({
      title:s.name,artist:s.freq,album:'MiRadio',
      artwork:[{src:new URL('./icon-512.png',location.href).href,sizes:'512x512',type:'image/png'}]
    });
    navigator.mediaSession.playbackState='playing';
  } else {
    navigator.mediaSession.playbackState='paused';
  }
}
if('mediaSession' in navigator){
  navigator.mediaSession.setActionHandler('play',()=>{if(cur>=0){usedStreamIdx=0;playStream(STATIONS[cur].streams[0]);}else sel(lastStation);});
  navigator.mediaSession.setActionHandler('pause',()=>stp());
  navigator.mediaSession.setActionHandler('stop',()=>stp());
  navigator.mediaSession.setActionHandler('previoustrack',()=>sel(cur<=0?STATIONS.length-1:cur-1));
  navigator.mediaSession.setActionHandler('nexttrack',()=>sel((cur+1)%STATIONS.length));
  try{navigator.mediaSession.setActionHandler('seekto',null);}catch(e){}
  try{navigator.mediaSession.setActionHandler('seekforward',null);}catch(e){}
  try{navigator.mediaSession.setActionHandler('seekbackward',null);}catch(e){}
}

window.addEventListener('online',()=>offlineBar.classList.remove('show'));
window.addEventListener('offline',()=>offlineBar.classList.add('show'));
if(!navigator.onLine)offlineBar.classList.add('show');

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferredPrompt=e;
  if(!window.matchMedia('(display-mode: standalone)').matches&&!sessionStorage.getItem('installDismissed'))
    installBanner.classList.add('show');
});
installBtn.addEventListener('click',async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt();await deferredPrompt.userChoice;
  deferredPrompt=null;installBanner.classList.remove('show');
});
dismissBtn.addEventListener('click',()=>{installBanner.classList.remove('show');sessionStorage.setItem('installDismissed','1');});
window.addEventListener('appinstalled',()=>{installBanner.classList.remove('show');deferredPrompt=null;});

if('serviceWorker' in navigator)
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'})
    .then(r=>console.log('SW ok',r.scope)).catch(e=>console.warn('SW fail',e));
