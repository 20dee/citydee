const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
let candles = [];
let side = 'buy';

function seedCandles() {
  let price = 1.0818;
  candles = [];
  for (let i = 0; i < 68; i++) {
    const change = (Math.random() - 0.46) * 0.0011;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 0.0007;
    const low = Math.min(open, close) - Math.random() * 0.0007;
    candles.push({open, high, low, close});
    price = close;
  }
}

function drawChart() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = rect.width, h = rect.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--line');
  ctx.lineWidth = 1;
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--muted');
  ctx.font = '9px IBM Plex Mono';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 6; i++) {
    const y = 18 + i * (h - 38) / 6;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w - 42, y); ctx.stroke();
    const value = (1.0852 - i * 0.00045).toFixed(5);
    ctx.fillText(value, w - 6, y + 3);
  }
  for (let i = 0; i <= 10; i++) {
    const x = i * (w - 42) / 10;
    ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, h - 18); ctx.stroke();
  }

  const max = 1.0858, min = 1.0821;
  const plotW = w - 58, plotH = h - 30;
  const step = plotW / candles.length;
  const yFor = v => 10 + (max - v) / (max - min) * plotH;

  candles.forEach((c, i) => {
    const x = i * step + 8;
    const up = c.close >= c.open;
    ctx.strokeStyle = ctx.fillStyle = up ? '#1ba67a' : '#dc6270';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + step * .35, yFor(c.high)); ctx.lineTo(x + step * .35, yFor(c.low)); ctx.stroke();
    const y1 = yFor(c.open), y2 = yFor(c.close);
    ctx.fillRect(x + 1, Math.min(y1,y2), Math.max(2, step * .7), Math.max(2, Math.abs(y2-y1)));
  });

  const last = candles[candles.length - 1].close;
  const y = yFor(last);
  ctx.setLineDash([3,3]); ctx.strokeStyle = '#1ba67a'; ctx.beginPath(); ctx.moveTo(0,y);ctx.lineTo(w-42,y);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#1ba67a';ctx.fillRect(w-42,y-9,42,18);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='600 9px IBM Plex Mono';ctx.fillText(last.toFixed(5),w-21,y+3);ctx.textAlign='right';
}

seedCandles();
drawChart();
window.addEventListener('resize', drawChart);

setInterval(() => {
  const last = candles[candles.length - 1];
  const delta = (Math.random() - .48) * .00008;
  const close = Math.max(.00001, last.close + delta);
  candles.push({open:last.close,high:Math.max(last.close,close)+.00003,low:Math.min(last.close,close)-.00003,close});
  if (candles.length > 68) candles.shift();
  const price = close + .00020;
  document.getElementById('mainPrice').textContent = price.toFixed(5);
  document.getElementById('ohlcClose').textContent = price.toFixed(5);
  document.getElementById('bid').textContent = (price-.00003).toFixed(5);
  document.getElementById('ask').textContent = (price+.00003).toFixed(5);
  document.getElementById('buyPrice').textContent = (price+.00003).toFixed(5);
  document.getElementById('sellPrice').textContent = (price-.00003).toFixed(5);
  drawChart();
}, 2400);

document.querySelectorAll('.buy-sell button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.buy-sell button').forEach(b => b.classList.remove('active'));
  button.classList.add('active'); side = button.dataset.side;
  const text = document.querySelector('.place-order span');
  text.textContent = `Place ${side} order`;
  document.querySelector('.place-order').style.background = side === 'buy' ? '#16865f' : '#c65b65';
}));

document.querySelectorAll('.order-type button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.order-type button').forEach(b => b.classList.remove('active')); button.classList.add('active');
}));

document.querySelectorAll('.timeframes button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.timeframes button').forEach(b => b.classList.remove('active')); button.classList.add('active');
}));

document.querySelectorAll('.size-options button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active')); button.classList.add('active');
  document.getElementById('size').value = button.dataset.size;
  updateSize();
}));

function updateSize(){
  const size = parseFloat(document.getElementById('size').value)||0;
  document.getElementById('margin').textContent='$'+(size*3614.4).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  document.querySelector('.place-order b').textContent=size.toFixed(2)+' lots';
}
document.getElementById('size').addEventListener('input', updateSize);

document.querySelectorAll('.risk-row input[type=checkbox]').forEach(check => check.addEventListener('change', () => {
  check.closest('.risk-row').querySelector('.risk-input input').disabled=!check.checked;
}));

document.getElementById('placeOrder').addEventListener('click', () => {
  const toast=document.getElementById('toast');
  toast.querySelector('small').textContent=`EUR/USD ${side[0].toUpperCase()+side.slice(1)} · ${document.getElementById('size').value} lots`;
  toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2600);
});

document.querySelectorAll('.close-position').forEach(button=>button.addEventListener('click',()=>button.closest('.position-row').remove()));
document.getElementById('themeButton').addEventListener('click',()=>document.body.classList.toggle('dark'));
