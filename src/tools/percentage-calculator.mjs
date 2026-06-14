export default {
  slug: 'percentage-calculator',
  title: '퍼센트 계산기',
  icon: '％',
  order: 1,
  description: '전체의 몇 %, 부분의 비율, 증감률을 한 번에 계산하는 무료 퍼센트 계산기.',
  keywords: ['퍼센트 계산', '퍼센트 계산기', '비율 계산', '증감률 계산', '% 계산'],
  body: `
  <div class="grid2">
    <div class="panel">
      <h3>전체의 몇 %?</h3>
      <label>전체 값<input id="a-total" type="number" inputmode="decimal" placeholder="200"></label>
      <label>퍼센트 (%)<input id="a-rate" type="number" inputmode="decimal" placeholder="15"></label>
      <output id="a-out" class="result">—</output>
    </div>
    <div class="panel">
      <h3>A는 B의 몇 %?</h3>
      <label>부분 값 A<input id="b-part" type="number" inputmode="decimal" placeholder="30"></label>
      <label>전체 값 B<input id="b-whole" type="number" inputmode="decimal" placeholder="200"></label>
      <output id="b-out" class="result">—</output>
    </div>
    <div class="panel">
      <h3>증감률 (%)</h3>
      <label>이전 값<input id="c-from" type="number" inputmode="decimal" placeholder="200"></label>
      <label>이후 값<input id="c-to" type="number" inputmode="decimal" placeholder="250"></label>
      <output id="c-out" class="result">—</output>
    </div>
  </div>`,
  content: `<h2>사용 방법</h2>
  <p><strong>전체의 몇 %</strong>는 "200의 15%"처럼 전체 값에 비율을 곱한 결과를 구합니다.
  <strong>A는 B의 몇 %</strong>는 부분이 전체에서 차지하는 비율을, <strong>증감률</strong>은 이전 값 대비 변화량의 비율을 구합니다.
  세 계산 모두 입력하는 즉시 결과가 갱신됩니다.</p>`,
  faq: [
    { q: '200의 15%는 얼마인가요?', a: '200 × 15 ÷ 100 = 30 입니다. "전체의 몇 %?" 칸에 전체 200, 퍼센트 15를 넣으면 자동 계산됩니다.' },
    { q: '증가율은 어떻게 계산하나요?', a: '(이후 값 − 이전 값) ÷ 이전 값 × 100 입니다. 예: 200에서 250으로 늘면 25% 증가입니다.' },
  ],
  script: `
  function num(id){var v=parseFloat(document.getElementById(id).value);return isNaN(v)?null:v;}
  function fmt(n){return (Math.round(n*100)/100).toLocaleString('ko-KR');}
  function calc(){
    var at=num('a-total'),ar=num('a-rate');
    document.getElementById('a-out').textContent=(at!=null&&ar!=null)?(fmt(at)+'의 '+fmt(ar)+'% = '+fmt(at*ar/100)):'—';
    var bp=num('b-part'),bw=num('b-whole');
    document.getElementById('b-out').textContent=(bp!=null&&bw!=null&&bw!==0)?(fmt(bp)+'는 '+fmt(bw)+'의 '+fmt(bp/bw*100)+'%'):'—';
    var cf=num('c-from'),ct=num('c-to');
    document.getElementById('c-out').textContent=(cf!=null&&ct!=null&&cf!==0)?((ct-cf>=0?'+':'')+fmt((ct-cf)/cf*100)+'%'):'—';
  }
  document.querySelectorAll('#a-total,#a-rate,#b-part,#b-whole,#c-from,#c-to').forEach(function(el){el.addEventListener('input',calc);});
  `,
};
