export default {
  slug: 'word-counter',
  title: '글자수 세기',
  icon: '🔤',
  order: 2,
  description: '글자수(공백 포함/제외), 단어수, 줄수, 바이트수를 실시간으로 세는 무료 글자수 세기.',
  keywords: ['글자수 세기', '글자수 계산기', '단어수 세기', '자소서 글자수', '바이트 계산'],
  body: `
  <textarea id="wc-text" class="textarea" rows="8" placeholder="여기에 텍스트를 입력하거나 붙여넣으세요"></textarea>
  <div class="stats">
    <div class="stat"><span id="wc-chars">0</span><label>글자수 (공백 포함)</label></div>
    <div class="stat"><span id="wc-nospace">0</span><label>공백 제외</label></div>
    <div class="stat"><span id="wc-words">0</span><label>단어수</label></div>
    <div class="stat"><span id="wc-lines">0</span><label>줄수</label></div>
    <div class="stat"><span id="wc-bytes">0</span><label>바이트 (UTF-8)</label></div>
  </div>`,
  content: `<h2>이럴 때 쓰세요</h2>
  <p>자기소개서, 리포트, 블로그, SNS 게시글의 글자수 제한을 맞출 때 유용합니다. 한글·영문·이모지를 모두 정확히 셉니다(코드 포인트 기준).</p>`,
  faq: [
    { q: '공백을 빼고 셀 수 있나요?', a: '네. "공백 제외" 칸이 스페이스·탭·줄바꿈을 모두 제외한 글자수를 보여줍니다.' },
    { q: '바이트수는 왜 다른가요?', a: '일부 입력란은 바이트로 제한합니다. UTF-8에서 한글은 보통 3바이트라 글자수와 값이 다를 수 있습니다.' },
  ],
  script: `
  var t=document.getElementById('wc-text');
  function up(){
    var s=t.value;
    document.getElementById('wc-chars').textContent=[...s].length.toLocaleString('ko-KR');
    document.getElementById('wc-nospace').textContent=[...s.replace(/\\s/g,'')].length.toLocaleString('ko-KR');
    var w=s.trim()?s.trim().split(/\\s+/).length:0;
    document.getElementById('wc-words').textContent=w.toLocaleString('ko-KR');
    document.getElementById('wc-lines').textContent=(s?s.split(/\\n/).length:0).toLocaleString('ko-KR');
    document.getElementById('wc-bytes').textContent=new Blob([s]).size.toLocaleString('ko-KR');
  }
  t.addEventListener('input',up);up();
  `,
};
