# 모달 카피라이터 (Modal Copywriter)

🚀 **한 줄 요약**  
서비스 기획자가 모달·토스트·얼럿 문구를 0부터 고민할 필요 없이, 상황만 입력하면 AI가 브랜드 톤앤매너에 맞는 5가지 변형 문구를 즉시 생성해주는 웹 서비스입니다.

## 왜 만들었나요? (Problem)
- 매번 성공/오류/확인 모달 문구를 직접 쓰느라 하루 1~2시간 날림
- 디자이너·개발자와 "이 문구 너무 딱딱해요" 피드백 무한 루프
- 브랜드 톤앤매너는 문서화되어 있지만 실제 적용할 때마다 10분씩 고민
- A/B 테스트용 변형 문구 여러 개 필요할 때 매번 새로 작성

## 어떤 문제를 해결하나요? (Solution)
1. **상황 라디오 버튼 선택** → 성공·오류·확인·경고·정보 모달 등 30+ 시나리오 미리 정의
2. **톤앤매너 프리셋** → 친근한 / 공식적 / 캐주얼 / 따뜻한 / 직설적 5가지 기본 제공 (커스텀 추가 가능)
3. **5가지 변형 자동 생성** → 한 번에 제목 + 본문 5세트 출력
4. **복사 최적화** → 제목만 / 본문만 / 전체 복사 버튼으로 피그마·지라·노션에 바로 붙여넣기

## 데모 스크린샷 (여기에 실제 캡처 2~3장 넣으세요)
![메인 화면](screenshots/main.png)
![생성 결과](screenshots/result.png)

## 기술 스택
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Next.js API Routes or Node.js
- AI: OpenAI GPT-4o (or Grok API)
- 배포: Vercel

## 로컬 실행 방법
```bash
git clone https://github.com/your-username/modal-copywriter.git
cd modal-copywriter
npm install
npm run dev 