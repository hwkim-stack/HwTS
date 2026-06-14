export default {
  slug: 'password-generator',
  title: '비밀번호 생성기',
  icon: '🔑',
  order: 3,
  description: '길이와 문자 종류를 골라 안전한 랜덤 비밀번호를 즉시 만드는 무료 비밀번호 생성기. 브라우저에서만 처리.',
  keywords: ['비밀번호 생성기', '랜덤 비밀번호', '안전한 비밀번호', '패스워드 생성기'],
  body: `
  <div class="pw-out">
    <output id="pw-val" class="result big">생성 중…</output>
    <button id="pw-copy" class="btn" type="button">복사</button>
  </div>
  <label class="range-label">길이: <strong id="pw-len-val">16</strong>
    <input id="pw-len" type="range" min="6" max="64" value="16">
  </label>
  <div class="checks">
    <label><input type="checkbox" id="pw-upper" checked> 대문자 A-Z</label>
    <label><input type="checkbox" id="pw-lower" checked> 소문자 a-z</label>
    <label><input type="checkbox" id="pw-num" checked> 숫자 0-9</label>
    <label><input type="checkbox" id="pw-sym"> 기호 !@#$</label>
  </div>
  <button id="pw-go" class="btn btn-primary" type="button">새 비밀번호 생성</button>`,
  content: `<h2>안전 안내</h2>
  <p>비밀번호는 브라우저의 <code>crypto.getRandomValues</code>(암호학적 난수)로 생성되며 서버로 전송되거나 저장되지 않습니다. 16자 이상에 대/소문자·숫자·기호를 섞는 것을 권장합니다.</p>`,
  faq: [
    { q: '생성된 비밀번호가 서버에 저장되나요?', a: '아니요. 모든 생성은 브라우저 안에서만 이루어지며 어디에도 전송·저장되지 않습니다.' },
    { q: '얼마나 길게 만들어야 안전한가요?', a: '일반적으로 16자 이상에 여러 문자 종류를 섞으면 충분히 안전합니다.' },
  ],
  script: `
  var U='ABCDEFGHIJKLMNOPQRSTUVWXYZ',L='abcdefghijklmnopqrstuvwxyz',N='0123456789',S='!@#%^&*()-_=+[]{}';
  var len=document.getElementById('pw-len');
  len.addEventListener('input',function(){document.getElementById('pw-len-val').textContent=len.value;});
  function gen(){
    var pool='';
    if(document.getElementById('pw-upper').checked)pool+=U;
    if(document.getElementById('pw-lower').checked)pool+=L;
    if(document.getElementById('pw-num').checked)pool+=N;
    if(document.getElementById('pw-sym').checked)pool+=S;
    if(!pool){document.getElementById('pw-val').textContent='문자 종류를 1개 이상 선택하세요';return;}
    var n=parseInt(len.value,10),out='',arr=new Uint32Array(n);crypto.getRandomValues(arr);
    for(var i=0;i<n;i++){out+=pool.charAt(arr[i]%pool.length);}
    document.getElementById('pw-val').textContent=out;
  }
  document.getElementById('pw-go').addEventListener('click',gen);
  document.getElementById('pw-copy').addEventListener('click',function(){
    var v=document.getElementById('pw-val').textContent;
    if(navigator.clipboard&&v){navigator.clipboard.writeText(v).then(function(){var b=document.getElementById('pw-copy');b.textContent='복사됨!';setTimeout(function(){b.textContent='복사';},1200);});}
  });
  gen();
  `,
};
