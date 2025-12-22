# 맞춤법 검사 기능 설정 가이드

py-hanspell 라이브러리를 사용한 맞춤법 검사 기능을 설정하는 방법입니다.

## 📋 개요

프론트엔드(React)에서 Python 라이브러리인 py-hanspell을 사용하기 위해 Flask 백엔드 서버를 구축했습니다.

## 🚀 빠른 시작

### 1. 백엔드 서버 설정

```bash
# server 디렉토리로 이동
cd server

# Python 가상환경 생성 (선택사항)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 필요한 패키지 설치
pip install -r requirements.txt

# 서버 실행
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

### 2. 프론트엔드 설정

프론트엔드는 자동으로 백엔드 서버를 호출합니다. 기본값은 `http://localhost:5000`입니다.

다른 URL을 사용하려면 `.env` 파일을 생성하세요:

```bash
# 프로젝트 루트에 .env 파일 생성
VITE_SPELL_CHECK_API_URL=http://localhost:5000
```

### 3. 개발 서버 실행

```bash
# 프론트엔드 개발 서버 실행
npm run dev
```

## 📁 프로젝트 구조

```
modalcopy/
├── server/                 # 백엔드 서버
│   ├── app.py             # Flask 애플리케이션
│   ├── requirements.txt   # Python 패키지 목록
│   ├── README.md          # 서버 문서
│   └── start.sh           # 시작 스크립트
├── src/
│   └── app/
│       └── components/
│           └── SpellChecker.tsx  # 맞춤법 검사 컴포넌트
└── .env.example           # 환경 변수 예시
```

## 🔧 API 엔드포인트

### POST /api/spell-check

맞춤법 검사 요청

**Request:**
```json
{
  "text": "안녕 하세요. 저는 한국인 입니다.",
  "engine": "네이버"
}
```

**Response:**
```json
{
  "success": true,
  "errors": [
    {
      "start": 0,
      "end": 3,
      "original": "안녕",
      "suggestions": ["안녕하세요"],
      "errorType": "띄어쓰기"
    }
  ],
  "checked": "안녕하세요. 저는 한국인입니다.",
  "errorCount": 2,
  "original": "안녕 하세요. 저는 한국인 입니다."
}
```

## 🐛 문제 해결

### 백엔드 서버가 시작되지 않는 경우

1. Python 버전 확인 (Python 3.7 이상 필요)
   ```bash
   python3 --version
   ```

2. 패키지 설치 확인
   ```bash
   pip3 list | grep py-hanspell
   ```

3. 포트 충돌 확인
   - 5000번 포트가 사용 중이면 다른 포트로 변경
   ```python
   # app.py 마지막 줄 수정
   app.run(host='0.0.0.0', port=5001, debug=True)
   ```

### CORS 오류가 발생하는 경우

백엔드 서버의 `CORS(app)` 설정이 올바른지 확인하세요.

### API 호출 실패 시

프론트엔드는 자동으로 모의 데이터로 fallback합니다. 콘솔에서 오류 메시지를 확인하세요.

## 📚 참고 자료

- [py-hanspell GitHub](https://github.com/ssut/py-hanspell)
- [Flask 공식 문서](https://flask.palletsprojects.com/)
- [네이버 맞춤법 검사기](https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=맞춤법+검사기)

## 🔒 보안 고려사항

프로덕션 환경에서는:

1. CORS 설정을 특정 도메인으로 제한
2. Rate limiting 추가
3. HTTPS 사용
4. 환경 변수로 민감한 정보 관리

## 📝 라이선스

py-hanspell은 MIT License로 제공됩니다. 네이버 맞춤법 검사기의 저작권은 네이버 주식회사에 있습니다.

