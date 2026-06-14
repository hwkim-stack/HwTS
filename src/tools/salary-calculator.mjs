export default {
  slug: 'salary-calculator',
  title: '연봉 실수령액 계산기',
  icon: '💰',
  order: 4,
  description: '연봉을 입력하면 4대보험·소득세를 빼고 매달 통장에 들어오는 월 실수령액을 바로 계산합니다. (2026년 요율 기준)',
  keywords: ['연봉 실수령액', '실수령액 계산기', '세후 월급', '월급 실수령액', '연봉 계산기', '4대보험 계산'],
  body: `
  <div class="grid2">
    <label>연봉 (만원)<input id="sal-annual" type="number" inputmode="numeric" placeholder="예: 4000 (= 4,000만원)"></label>
    <label>부양가족 수 (본인 포함)<input id="sal-family" type="number" inputmode="numeric" value="1" min="1"></label>
    <label>월 비과세액 (식대 등)<input id="sal-taxfree" type="number" inputmode="numeric" value="200000"></label>
  </div>
  <button id="sal-go" class="btn btn-primary" type="button">실수령액 계산</button>
  <div class="pw-out" style="margin-top:16px">
    <output id="sal-net" class="result big">연봉을 입력하세요</output>
  </div>
  <div id="sal-table"></div>
  <p class="muted" id="sal-note" style="margin-top:8px"></p>`,
  content: `<h2>실수령액이란?</h2>
  <p>회사가 주기로 한 <strong>세전 연봉</strong>에서 국민연금·건강보험·장기요양보험·고용보험(4대보험)과 소득세·지방소득세를 뺀, <strong>실제로 통장에 들어오는 금액</strong>입니다. 이 계산기는 연봉을 12로 나눈 월 급여를 기준으로 공제액을 계산합니다.</p>
  <h2>공제 항목 (2026년 기준)</h2>
  <ul>
    <li>국민연금 4.75% · 건강보험 3.595% · 장기요양 = 건강보험료의 12.95% · 고용보험 0.9% (근로자 부담분)</li>
    <li>소득세는 근로소득공제·인적공제·세액공제를 반영한 누진세로 추정하고, 지방소득세는 소득세의 10%입니다.</li>
    <li>월 비과세액(식대 등 최대 20만원)은 4대보험·소득세 계산에서 제외됩니다.</li>
  </ul>`,
  faq: [
    { q: '실제 월급과 금액이 조금 다른 이유는?', a: '회사는 매달 국세청 간이세액표로 소득세를 떼고, 다음 해 연말정산으로 정산합니다. 이 계산기는 연말정산 기준의 추정치라 매월 원천징수액과 다를 수 있습니다. 정확한 금액은 국세청 홈택스에서 확인하세요.' },
    { q: '부양가족 수는 어떻게 넣나요?', a: '본인을 포함해 기본공제 대상 가족 수를 입력합니다(예: 본인+배우자+자녀1 = 3). 인원이 많을수록 소득세가 줄어 실수령액이 늘어납니다.' },
    { q: '비과세액은 무엇인가요?', a: '식대 등 세금·보험료가 붙지 않는 금액입니다. 보통 식대 월 20만원까지 비과세이며, 그만큼 공제가 줄어 실수령액이 늘어납니다.' },
  ],
  script: `
  var RATES = {
    year: 2026,
    npRate: 0.0475,      // 국민연금 (근로자)
    npMaxBase: 6170000,  // 기준소득월액 상한 (매년 7월 갱신, 고소득자만 영향)
    npMinBase: 390000,   // 기준소득월액 하한
    hiRate: 0.03595,     // 건강보험 (근로자)
    ltcRate: 0.1295,     // 장기요양 = 건강보험료 x 12.95%
    eiRate: 0.009        // 고용보험 (근로자)
  };
  function won(n){return Math.round(n).toLocaleString('ko-KR');}
  function eid(g){ // 근로소득공제
    if(g<=5000000) return g*0.7;
    if(g<=15000000) return 3500000+(g-5000000)*0.4;
    if(g<=45000000) return 7500000+(g-15000000)*0.15;
    if(g<=100000000) return 12000000+(g-45000000)*0.05;
    return 14750000+(g-100000000)*0.02;
  }
  function tax(b){ // 종합소득세 기본세율 산출세액
    if(b<=14000000) return b*0.06;
    if(b<=50000000) return 840000+(b-14000000)*0.15;
    if(b<=88000000) return 6240000+(b-50000000)*0.24;
    if(b<=150000000) return 15360000+(b-88000000)*0.35;
    if(b<=300000000) return 37060000+(b-150000000)*0.38;
    if(b<=500000000) return 94060000+(b-300000000)*0.40;
    if(b<=1000000000) return 174060000+(b-500000000)*0.42;
    return 384060000+(b-1000000000)*0.45;
  }
  function taxCredit(t,g){ // 근로소득세액공제
    var c = t<=1300000 ? t*0.55 : 715000+(t-1300000)*0.30;
    var cap;
    if(g<=33000000) cap=740000;
    else if(g<=70000000) cap=Math.max(740000-(g-33000000)*0.008,660000);
    else if(g<=120000000) cap=Math.max(660000-(g-70000000)*0.5,500000);
    else cap=Math.max(500000-(g-120000000)*0.5,200000);
    return Math.min(c,cap);
  }
  function row(label,val,neg){
    var v=(neg?'-':'')+won(Math.abs(val))+'원';
    return '<div class="stat" style="text-align:left"><label style="margin:0">'+label+'</label><span style="font-size:1.05rem">'+v+'</span></div>';
  }
  function calc(){
    var man=parseFloat(document.getElementById('sal-annual').value);
    if(isNaN(man)||man<=0){document.getElementById('sal-net').textContent='연봉을 입력하세요';document.getElementById('sal-table').innerHTML='';document.getElementById('sal-note').textContent='';return;}
    var family=Math.max(1,parseInt(document.getElementById('sal-family').value,10)||1);
    var tf=parseFloat(document.getElementById('sal-taxfree').value)||0;
    var grossA=man*10000, grossM=grossA/12;
    var taxM=Math.max(0,grossM-tf);
    var npBase=Math.min(Math.max(taxM,RATES.npMinBase),RATES.npMaxBase);
    var np=npBase*RATES.npRate, hi=taxM*RATES.hiRate, ltc=hi*RATES.ltcRate, ei=taxM*RATES.eiRate;
    var taxA=taxM*12;
    var earned=taxA-eid(taxA);
    var base=Math.max(0, earned - family*1500000 - np*12 - (hi+ltc+ei)*12);
    var calcTax=tax(base);
    var itA=Math.max(0, calcTax - taxCredit(calcTax,taxA));
    var it=itA/12, local=it*0.1;
    var totalDed=np+hi+ltc+ei+it+local;
    var net=grossM-totalDed;
    document.getElementById('sal-net').textContent='월 실수령액 '+won(net)+'원';
    var html='<div class="stats" style="margin-top:14px">';
    html+=row('월 급여(세전)',grossM,false);
    html+=row('국민연금',np,true);
    html+=row('건강보험',hi,true);
    html+=row('장기요양',ltc,true);
    html+=row('고용보험',ei,true);
    html+=row('소득세',it,true);
    html+=row('지방소득세',local,true);
    html+=row('공제 합계',totalDed,true);
    html+=row('연 실수령액',net*12,false);
    html+='</div>';
    document.getElementById('sal-table').innerHTML=html;
    document.getElementById('sal-note').textContent='※ '+RATES.year+'년 요율 기준 추정치입니다. 매월 실제 원천징수(간이세액표)·연말정산 결과와 차이가 있을 수 있습니다.';
  }
  document.getElementById('sal-go').addEventListener('click',calc);
  ['sal-annual','sal-family','sal-taxfree'].forEach(function(id){document.getElementById(id).addEventListener('input',calc);});
  `,
};
