const API_BASE = 'https://api.alquran.cloud/v1';
const BOOKMARK_KEY = 'quran_ttm_bookmark';

const $ = id => document.getElementById(id);
const $$ = (sel, ctx) => (ctx || document).querySelectorAll(sel);

const state = {
  surahs: [],
  currentSurah: null,
  currentAyah: null,
  verses: [],
  translations: {},
  maqasidMap: {},
  surahMeta: {},
  textMode: 'tajweed',        // 'tajweed' | 'uthmani' | 'quran.com'
  arabicFontSize: 1.6         // rem
};

// Iframe communication
let leftReady = false, rightReady = false;
const leftQ = [], rightQ = [];
let leftPanelIsQuranCom = false;

function sendToLeft(data) {
  const f = $('leftFrame');
  if (leftReady && f && f.contentWindow) f.contentWindow.postMessage(data, '*');
  else leftQ.push(data);
}
function sendToRight(data) {
  const f = $('rightFrame');
  if (rightReady && f && f.contentWindow) f.contentWindow.postMessage(data, '*');
  else rightQ.push(data);
}

function restoreLeftPanel() {
  leftReady = false;
  leftQ.length = 0;
  leftPanelIsQuranCom = false;
  $('leftFrame').src = URL.createObjectURL(new Blob([getLeftPanelHTML()], { type: 'text/html' }));
}

// ── Iframe HTML generators ──

function getLeftPanelHTML() {
  return '<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Thai:wght@300;400;500&display=swap\" rel=\"stylesheet\"><style>' +
    '*{margin:0;padding:0;box-sizing:border-box}' +
    'body{font-family:\"Noto Sans Thai\",sans-serif;background:#fff;color:#1a1a1a;height:100vh;overflow:hidden}' +
    '#C{height:100%;overflow-y:auto;padding:16px 20px}' +
    '.P,.L,.E{display:none;flex-direction:column;align-items:center;justify-content:center;min-height:300px;color:#888;text-align:center;gap:12px}' +
    '.P.on,.L.on,.E.on{display:flex}' +
    '.E{color:#c0392b}' +
    '.eD{font-size:.85rem;color:#888;word-break:break-all}' +
    '.sp{width:32px;height:32px;border:3px solid #ddd;border-top-color:#2d6a4f;border-radius:50%;animation:x .7s linear infinite}' +
    '@keyframes x{to{transform:rotate(360deg)}}' +
    '.VL{display:flex;flex-direction:column;gap:8px}' +
    '.AB{display:flex;align-items:center;gap:8px;padding:8px 14px;margin-bottom:8px;background:linear-gradient(135deg,#d4e4c8,#e8f0e0);border-radius:8px;border:1px solid #b8d0a8;flex-wrap:wrap;font-size:.85rem}' +
    '.a1{font-weight:700;color:#1b4332}' +
    '.a2{font-size:.78rem;color:#2d6a4f;background:rgba(45,106,79,.12);padding:1px 8px;border-radius:8px}' +
    '.a3{color:#333;flex:1;min-width:0}' +
    '.V{padding:12px 16px;border-radius:10px;background:#fff;border:1px solid #e8e5e0}' +
    '.V:hover{border-color:#b8b0a0}' +
    '.VH{display:flex;align-items:flex-start;gap:12px}' +
    '.AN{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:28px;border-radius:50%;background:#2d6a4f;color:#fff;font-size:.75rem;font-weight:700;flex-shrink:0;margin-top:4px}' +
    '.VB{flex:1;min-width:0}' +
    ':root{--fs:1.6rem}' +
    '.AT{font-family:\"Amiri\",\"Traditional Arabic\",serif;font-size:var(--fs);line-height:2;direction:rtl;text-align:right}' +
    '.TT{font-size:.88rem;color:#000;line-height:1.6;margin-top:6px;padding-top:6px;border-top:1px dashed #e0ddd8}' +
    '.TT.x{display:none}' +
    '.h{color:#AAA}.s{color:#AAA}.l{color:#AAA}' +
    '.m{color:#537FFF}.a{color:#537FFF}' +
    '.j{color:#4050FF}.u{color:#4050FF}' +
    '.w{color:#000EBC}' +
    '.o{color:#2144C1}.f{color:#2144C1}' +
    '.q{color:#D00}' +
    '.i{color:#D500B7}' +
    '.x{color:#9400A8}' +
    '.d{color:#58B800}' +
    '.b{color:#26BFFD}' +
    '.g{color:#169777}' +
    '.n{color:#169200}' +
    '.t{color:#A1A1A1}.r{color:#A1A1A1}' +
    '.p{color:#FF7E1E}' +
    'body.Y .h,body.Y .s,body.Y .l,body.Y .m,body.Y .a,body.Y .j,body.Y .u,body.Y .w,body.Y .o,body.Y .f,body.Y .q,body.Y .i,body.Y .x,body.Y .d,body.Y .b,body.Y .g,body.Y .n,body.Y .t,body.Y .r,body.Y .p{color:inherit!important}' +
    '#C::-webkit-scrollbar{width:6px}#C::-webkit-scrollbar-track{background:transparent}#C::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}' +
    '.retry-btn{margin-top:12px;padding:8px 18px;background:#2d6a4f;color:#fff;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-size:0.85rem;transition:background 0.15s}' +
    '.retry-btn:hover{background:#1b4332}' +
  '</style></head><body>' +
  '<div id=\"C\">' +
    '<div class=\"P on\" id=\"P\"><p>เลือกซูเราะห์เพื่อเริ่มอ่าน</p></div>' +
    '<div class=\"L\" id=\"L\"><div class=\"sp\"></div><p>กำลังโหลด...</p></div>' +
    '<div class=\"E\" id=\"E\"><p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p><p class=\"eD\" id=\"eD\"></p><button onclick=\"window.parent.postMessage({type:\\\"retry\\\"},\\\"*\\\")\" class=\"retry-btn\">ลองใหม่</button></div>' +
    '<div class=\"VL\" id=\"VL\"></div>' +
  '</div>' +
  '<script>' +
  'function pT(t){return t.replace(/\\[([a-z]+)(?::(\\d+))?\\[([^\\]]*)\\]/g,function(a,b,c,d){return"<span class=\\\""+b+"\\\">"+d+"</span>"})}' +
  'function getThematicBanners(a,m){if(!m||!m.thematic_ayat)return"";var matches=m.thematic_ayat.filter(function(t){var r=t.ayat_range.split("-").map(Number);return r[0]===a;});if(!matches.length)return"";return matches.map(function(t){return"<div class=\\\"AB\\\"><span class=\\\"a1\\\">หัวข้ออายะห์ "+t.ayat_range+"</span><span class=\\\"a3\\\">"+t.theme+"</span></div>";}).join("");}' +
  'function rd(v,s,m,fs){var e=document.getElementById("VL");if(fs)document.documentElement.style.setProperty("--fs",fs+"rem");e.innerHTML=v.map(function(a){var h=pT(a.text);var banners=getThematicBanners(a.numberInSurah,m);return banners+"<div class=\\\"V\\\" id=\\\"v"+a.numberInSurah+"\\\"><div class=\\\"VH\\\"><span class=\\\"AN\\\">"+a.numberInSurah+"</span><div class=\\\"VB\\\"><div class=\\\"AT\\\">"+h+"</div>"+(a.translation?"<div class=\\\"TT\\\""+(s?"":" x")+"\\\">"+a.translation+"</div>":"")+"</div></div></div>"}).join("")}' +
  'function sc(n){var t=document.getElementById("v"+n);if(t)t.scrollIntoView({block:"start",behavior:"smooth"})}' +
  'function sw(i){document.querySelectorAll("#C>.on").forEach(function(e){e.classList.remove("on")});var e=document.getElementById(i);if(e)e.classList.add("on")}' +
  'window.addEventListener("message",function(e){var d=e.data;if(d.type==="render"){sw("VL");rd(d.verses,d.showTranslation,d.maqasid,d.arabicFontSize);if(d.targetAyah)setTimeout(function(){sc(d.targetAyah)},80)}else if(d.type==="setFontSize"){document.documentElement.style.setProperty("--fs",d.size+"rem")}else if(d.type==="toggleTranslation"){document.querySelectorAll(".TT").forEach(function(e){e.classList.toggle("x",!d.show)})}else if(d.type==="toggleTajweed"){document.body.classList.toggle("Y",!d.enabled)}else if(d.type==="showLoading"){sw("L")}else if(d.type==="showPlaceholder"){sw("P")}else if(d.type==="showError"){document.getElementById("eD").textContent=d.msg;sw("E")}});' +
  'window.parent.postMessage({type:"leftReady"},"*")' +
  '</script></body></html>';
}

function getRightPanelHTML() {
  return '<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Thai:wght@300;400;500&display=swap\" rel=\"stylesheet\"><style>' +
    '*{margin:0;padding:0;box-sizing:border-box}' +
    'body{font-family:\"Noto Sans Thai\",sans-serif;background:#fafaf8;color:#1a1a1a;height:100vh;overflow:hidden}' +
    '#content{height:100%;overflow-y:auto;padding:20px}' +
    '.mq-select-row{margin-bottom:16px}' +
    '.mq-select-row select{width:100%;padding:8px 12px;border:1px solid #d0ccc6;border-radius:8px;font-size:.85rem;font-family:\"Noto Sans Thai\",sans-serif;color:#1a1a1a;background:#fff;cursor:pointer;outline:none;transition:border-color 0.15s}' +
    '.mq-select-row select:focus{border-color:#2d6a4f;box-shadow:0 0 0 2px rgba(45,106,79,0.12)}' +
    '.mq-placeholder{display:flex;align-items:center;justify-content:center;min-height:200px;color:#aaa;text-align:center;font-size:.95rem}' +
    '.mq-header{margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #e0ddd8}' +
    '.mq-name-en{font-size:1.25rem;font-weight:600;color:#1a1a1a;margin-bottom:6px}' +
    '.mq-meta{display:flex;gap:12px;flex-wrap:wrap;font-size:.85rem;color:#666}' +
    '.mq-meta span{padding:2px 10px;background:#e8e5e0;border-radius:12px}' +
    '.mq-content-detail{margin-bottom:20px}' +
    '.mq-content-detail h3,.mq-thematic h3{font-size:.85rem;color:#2d6a4f;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}' +
    '.mq-content-detail p{font-size:.9rem;line-height:1.7;color:#444}' +
    '.thematic-list{display:flex;flex-direction:column;gap:6px}' +
    '.thematic-item{display:flex;align-items:flex-start;gap:10px;padding:8px 12px;background:#f0ebe4;border-radius:8px;font-size:.88rem;line-height:1.4}' +
    '.thematic-range{flex-shrink:0;padding:1px 8px;background:#2d6a4f;color:#fff;border-radius:10px;font-size:.75rem;font-weight:600}' +
    '.thematic-theme{color:#444}' +
    '#content::-webkit-scrollbar{width:6px}' +
    '#content::-webkit-scrollbar-track{background:transparent}' +
    '#content::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}' +
    '#content::-webkit-scrollbar-thumb:hover{background:#aaa}' +
  '</style></head><body>' +
  '<div id=\"content\">' +
    '<div class=\"mq-select-row\"><select id=\"rightSurahSelect\"><option value=\"\">— เลือกซูเราะห์ —</option></select></div>' +
    '<div id=\"rightContent\"><div class=\"mq-placeholder\"><p>เลือกซูเราะห์เพื่อดูข้อมูล</p></div></div>' +
  '</div>' +
  '<script>' +
  'var sel=document.getElementById(\"rightSurahSelect\");' +
  'sel.addEventListener(\"change\",function(){' +
    'var v=+this.value;' +
    'if(!v){document.getElementById(\"rightContent\").innerHTML=\"<div class=\\\"mq-placeholder\\\"><p>เลือกซูเราะห์เพื่อดูข้อมูล</p></div>\";return}' +
    'document.getElementById(\"rightContent\").innerHTML=\"<div class=\\\"mq-placeholder\\\"><p>กำลังโหลด...</p></div>\";' +
    'window.parent.postMessage({type:\"requestMaqasid\",surahId:v},\"*\");' +
  '});' +
  'function initSurahs(data){sel.innerHTML=\"<option value=\\\"\\\">— เลือกซูเราะห์ —</option>\"+data.map(function(s){return\"<option value=\\\"\"+s.number+\"\\\">\"+s.number+\". \"+s.englishName+\"</option>\"}).join(\"\");}' +
  'function renderM(m,s){if(!m){document.getElementById(\"rightContent\").innerHTML=\"<div class=\\\"mq-placeholder\\\"><p>ไม่มีข้อมูล Maqasid สำหรับซูเราะห์นี้</p></div>\";return}' +
  'var th=\"\";if(m.thematic_ayat&&m.thematic_ayat.length){th=\"<div class=\\\"mq-thematic\\\"><h3>หัวข้อตามกลุ่มอายะห์</h3><div class=\\\"thematic-list\\\">\"+m.thematic_ayat.map(function(t){return\"<div class=\\\"thematic-item\\\"><span class=\\\"thematic-range\\\">\"+t.ayat_range+\"</span><span class=\\\"thematic-theme\\\">\"+t.theme+\"</span></div>\"}).join(\"\")+\"</div></div>\"}' +
  'var dt=m.content_detail?\"<div class=\\\"mq-content-detail\\\"><h3>เนื้อหาโดยรวม</h3><p>\"+m.content_detail+\"</p></div>\":\"\";' +
  'var h=\"<div class=\\\"mq-header\\\"><div class=\\\"mq-name-en\\\">\"+(s&&s.englishName?s.englishName:m.name)+\" (ซูเราะห์ที่ \"+(s&&s.number?s.number:m.surah_id)+\")</div><div class=\\\"mq-meta\\\"><span>\"+m.reveal+\"</span><span>\"+m.max_ayat+\" อายะห์</span></div></div>\";' +
  'document.getElementById(\"rightContent\").innerHTML=h+th+dt;}' +
  'window.addEventListener(\"message\",function(e){var d=e.data;if(d.type===\"render\"){renderM(d.maqasid,d.surah);if(d.surah)sel.value=d.surah.number}else if(d.type===\"initSurahs\"){initSurahs(d.surahs)}});' +
  'window.parent.postMessage({type:\"rightReady\"},\"*\")' +
  '<\/script></body></html>';
}

// ── Init iframes ──

function initFrames() {
  const lf = $('leftFrame'), rf = $('rightFrame');
  lf.src = URL.createObjectURL(new Blob([getLeftPanelHTML()], { type: 'text/html' }));
  rf.src = URL.createObjectURL(new Blob([getRightPanelHTML()], { type: 'text/html' }));

  window.addEventListener('message', function(e) {
    if (e.data.type === 'leftReady') {
      leftReady = true;
      while (leftQ.length) sendToLeft(leftQ.shift());
    } else if (e.data.type === 'rightReady') {
      rightReady = true;
      while (rightQ.length) sendToRight(rightQ.shift());
    } else if (e.data.type === 'retry') {
      retryLoad();
    } else if (e.data.type === 'requestMaqasid') {
      const surahId = e.data.surahId;
      const maqasid = getMaqasid(String(surahId));
      const surah = state.surahs.find(s => s.number === surahId);
      if (surah) {
        sendToRight({ type: 'render', maqasid: maqasid || null, surah: { name: surah.name, englishName: surah.englishName, number: surah.number } });
      }
    }
  });
}

// ── Data loading ──

async function init() {
  initFrames();
  // restore textMode and fontSize from bookmark before loading
  const savedBm = loadBookmark();
  if (savedBm && savedBm.textMode) state.textMode = savedBm.textMode;
  if (savedBm && savedBm.arabicFontSize) state.arabicFontSize = savedBm.arabicFontSize;
  try {
    const [translationData] = await Promise.all([
      loadTranslation(),
      loadSurahs()
    ]);
    state.translations = translationData || {};
    processMaqasidData();
    renderSurahList();
    sendToRight({ type: 'initSurahs', surahs: state.surahs });
    restoreBookmark();
  } catch (e) {
    console.error('Init error:', e);
    sendToLeft({ type: 'showError', msg: 'ไม่สามารถโหลดข้อมูลเริ่มต้นได้: ' + e.message });
  }
}

function processMaqasidData() {
  const data = window.QURAN_MAP_DATA || [];
  for (const item of data) {
    state.maqasidMap[item.surah_id] = item;
  }
}

async function loadSurahs() {
  const resp = await fetch(`${API_BASE}/surah`);
  const json = await resp.json();
  if (json.code !== 200) throw new Error('API error: ' + json.status);
  state.surahs = json.data;
}

async function loadTranslation() {
  return window.QURAN_TRANSLATION_DATA || {};
}

let currentRetrySurah = null;
function retryLoad() {
  if (currentRetrySurah) selectSurah(currentRetrySurah, true);
}

function getTranslation(surah, ayah) {
  let key = `${surah}:${ayah}`;
  let entry = state.translations[key];
  const visited = new Set();
  while (typeof entry === 'string') {
    if (visited.has(entry)) break;
    visited.add(entry);
    key = entry;
    entry = state.translations[key];
  }
  return entry ? entry.text : null;
}

function getMaqasid(surahId) {
  return state.maqasidMap[surahId] || null;
}

// ── Bookmark ──

let _skipBookmarkSave = false;

function saveBookmark(surah, ayah, textMode, fontSize) {
  const s = state.surahs.find(x => x.number === surah);
  if (!s) return;
  const timestamp = new Date().toISOString(); // auto timestamp
  const mode = textMode || state.textMode || 'tajweed';
  const fs = fontSize != null ? fontSize : (state.arabicFontSize || 1.6);
  const bm = { surah, ayah, surahName: s.englishName, surahArabic: s.name, timestamp, textMode: mode, arabicFontSize: fs };
  try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bm)); } catch {}
  updateBookmarkDisplay(bm);
}

function loadBookmark() {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function updateBookmarkDisplay(bm) {
  const el = $('bmHeader');
  if (!bm) { el.innerHTML = ''; return; }
  const d = new Date(bm.timestamp);
  const timeStr = d.toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  el.innerHTML = `
  <span class="bm-icon">📖</span>
  <span class="bm-text">${bm.surahName} (${bm.surah}) : ${bm.ayah}</span>
  <span class="bm-time">${timeStr}</span>
  `;
}

function clearBookmark(e) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  try { localStorage.removeItem(BOOKMARK_KEY); } catch {}
  updateBookmarkDisplay(null);
}

function restoreBookmark() {
  const bm = loadBookmark();
  if (bm) {
    updateBookmarkDisplay(bm);
    if (bm.surah && state.surahs.find(s => s.number === bm.surah)) {
      selectSurah(bm.surah);
    }
  } else {
    selectSurah(1);
  }
}

// ── Bookmark Form ──

function openBookmarkForm() {
  const modal = $('bookmarkModal');
  const surahSel = $('bmSurah');
  const ayahInput = $('bmAyah');

  if (state.surahs.length) {
    surahSel.innerHTML = '<option value="">— เลือกซูเราะห์ —</option>' +
      state.surahs.map(s => `<option value="${s.number}">${s.number}. ${s.englishName}</option>`).join('');
  }

  const bm = loadBookmark();
  if (bm) {
    surahSel.value = bm.surah;
    ayahInput.value = bm.ayah;
    onBmSurahChange();
    // restore text mode radio
    const savedMode = bm.textMode || state.textMode || 'tajweed';
    const radio = document.querySelector(`input[name="bmTextMode"][value="${savedMode}"]`);
    if (radio) radio.checked = true;
    // restore font size
    const savedFs = bm.arabicFontSize || state.arabicFontSize || 1.6;
    setFontSize(savedFs, false);
  } else {
    if (state.surahs.length) surahSel.value = state.surahs[0].number;
    onBmSurahChange();
    ayahInput.value = 1;
    // default to current state mode
    const radio = document.querySelector(`input[name="bmTextMode"][value="${state.textMode}"]`);
    if (radio) radio.checked = true;
    setFontSize(state.arabicFontSize || 1.6, false);
  }

  modal.style.display = 'flex';
}

function closeBookmarkForm(e) {
  if (e && e.target !== $('bookmarkModal') && e.target.closest('.modal-box')) return;
  $('bookmarkModal').style.display = 'none';
}

function onBmSurahChange() {
  const surahSel = $('bmSurah');
  const ayahInput = $('bmAyah');
  const s = state.surahs.find(x => x.number === +surahSel.value);
  if (s) { ayahInput.max = s.numberOfAyahs; if (+ayahInput.value > s.numberOfAyahs) ayahInput.value = s.numberOfAyahs; }
  else ayahInput.max = 1;
}

function submitBookmarkForm() {
  const surahSel = $('bmSurah');
  const ayahInput = $('bmAyah');
  const surah = +surahSel.value;
  const ayah = +ayahInput.value;
  if (!surah || !ayah) { alert('กรุณาเลือกซูเราะห์และอายะห์'); return; }
  const selectedRadio = document.querySelector('input[name="bmTextMode"]:checked');
  const textMode = selectedRadio ? selectedRadio.value : 'tajweed';
  const fontSize = parseFloat($('bmFontSize').value) || 1.6;
  state.textMode = textMode;
  state.arabicFontSize = fontSize;
  saveBookmark(surah, ayah, textMode, fontSize);
  // push font size to left panel immediately
  sendToLeft({ type: 'setFontSize', size: fontSize });
  _skipBookmarkSave = true;
  $('bookmarkModal').style.display = 'none';
  selectSurah(surah);
}

// font size helpers (called from HTML)
function onFontSizeInput(val) {
  const v = parseFloat(val);
  const display = $('fsValueDisplay');
  const preview = $('fsPreview');
  if (display) display.textContent = v.toFixed(1) + 'rem';
  if (preview) preview.style.fontSize = v + 'rem';
}

function setFontSize(val, updateSlider = true) {
  const v = parseFloat(val);
  if (updateSlider) {
    const slider = $('bmFontSize');
    if (slider) slider.value = v;
  }
  onFontSizeInput(v);
}

function toDatetimeLocal(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Header UI ──

function renderSurahList() {
  const dropdown = $('surahDropdown');
  const selected = state.currentSurah;
  dropdown.innerHTML = '<option value="">— เลือกซูเราะห์ —</option>' +
    state.surahs.map(s => `
    <option value="${s.number}"${selected === s.number ? ' selected' : ''}>
    ${s.number}. ${s.englishName}
    </option>
    `).join('');
}

function updateSurahStickyBar(surah) {
  const el = $('headerSurahInfo');
  if (!surah) { el.innerHTML = ''; return; }
  const maqasid = getMaqasid(String(surah.number));
  const reveal = maqasid ? maqasid.reveal : (surah.revelationType === 'Meccan' ? 'มักกิยยะฮฺ' : 'มะดะนิยยะฮฺ');
  el.innerHTML = `
    <span class="hsi-info">${surah.englishName} · ${surah.numberOfAyahs} อายะห์ · ${reveal}</span>
  `;
}

// ── Select Surah ──

function loadVersesTajweed(surahNumber) {
  return fetch(`${API_BASE}/surah/${surahNumber}/quran-tajweed`)
    .then(resp => {
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return resp.json();
    })
    .then(json => {
      if (json.code !== 200) throw new Error('API error: ' + json.status);
      return json.data.ayahs;
    });
}

function loadVersesUthmani(surahNumber) {
  const ayahs = (window.QURAN_UTHMANI_DATA || {})[String(surahNumber)];
  if (!ayahs) return Promise.reject(new Error('ไม่พบข้อมูล Uthmani สำหรับซูเราะห์ ' + surahNumber));
  return Promise.resolve(ayahs);
}

function selectSurah(surahNumber, retry) {
  currentRetrySurah = surahNumber;
  if (!surahNumber) return;
  const surah = state.surahs.find(s => s.number === surahNumber);
  if (!surah) return;

  state.currentSurah = surahNumber;
  renderSurahList();
  updateSurahStickyBar(surah);

  // Update right panel (maqasid)
  const maqasid = getMaqasid(String(surahNumber));
  const surahData = { name: surah.name, englishName: surah.englishName, number: surah.number };
  sendToRight({ type: 'render', maqasid: maqasid || null, surah: surahData });

  const mode = state.textMode || 'tajweed';
  const bm = loadBookmark();
  const targetAyah = (bm && bm.surah === surahNumber) ? bm.ayah : 1;
  state.currentAyah = targetAyah;

  // quran.com mode – load URL directly in iframe
  if (mode === 'quran.com') {
    if (!leftPanelIsQuranCom) leftPanelIsQuranCom = true;
    $('leftFrame').src = `https://quran.com/${surahNumber}?startingVerse=${targetAyah}`;
    if (_skipBookmarkSave) {
      _skipBookmarkSave = false;
      updateBookmarkDisplay(loadBookmark());
    } else {
      saveBookmark(surahNumber, targetAyah);
    }
    return;
  }

  // Restore left panel if it was showing quran.com
  if (leftPanelIsQuranCom) restoreLeftPanel();

  sendToLeft({ type: 'showLoading' });

  const loader = mode === 'uthmani'
    ? loadVersesUthmani(surahNumber)
    : loadVersesTajweed(surahNumber);

  loader
    .then(ayahs => {
      state.verses = ayahs;

      const versesWithTrans = ayahs.map(v => ({
        numberInSurah: v.numberInSurah,
        text: v.text,
        translation: getTranslation(surahNumber, v.numberInSurah)
      }));

      sendToLeft({
        type: 'render',
        verses: versesWithTrans,
        showTranslation: $('toggleTranslation').checked,
        targetAyah,
        maqasid: getMaqasid(String(surahNumber)),
        arabicFontSize: state.arabicFontSize || 1.6
      });

      if (_skipBookmarkSave) {
        _skipBookmarkSave = false;
        updateBookmarkDisplay(loadBookmark());
      } else {
        saveBookmark(surahNumber, targetAyah);
      }
    })
    .catch(e => {
      sendToLeft({ type: 'showError', msg: e.message });
    });
}

// ── Toggle handlers ──

$('toggleTranslation').addEventListener('change', function() {
  sendToLeft({ type: 'toggleTranslation', show: this.checked });
});

$('toggleTajweed').addEventListener('change', function() {
  sendToLeft({ type: 'toggleTajweed', enabled: this.checked });
});

$('toggleRightPanel').addEventListener('change', function() {
  document.querySelector('.app-main').classList.toggle('right-hidden', !this.checked);
});

// ── Start ──
document.addEventListener('DOMContentLoaded', init);
