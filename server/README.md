# 맞춤법 검사 백엔드 서버

py-hanspell 라이브러리를 사용하는 Flask 백엔드 서버입니다.

## 설치 방법

```bash
cd server
pip install -r requirements.txt
```

## 실행 방법

```bash
python app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### POST /api/spell-check

맞춤법 검사 요청

**Request Body:**
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

## 환경 변수

- `PORT`: 서버 포트 (기본값: 5000)
- `FLASK_ENV`: Flask 환경 (development/production)

