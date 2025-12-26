# 맞춤법 검사 기능 테스트 가이드

## 1. 백엔드 서버 실행 확인

```bash
# 서버 디렉토리로 이동
cd server

# 서버 실행
python3 app.py
```

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
✅ py-hanspell-master2 폴더를 경로에 추가했습니다
✅ 로컬 py-hanspell-master2 파일을 사용합니다
 * Running on http://127.0.0.1:5001
```

## 2. API 직접 테스트 (curl 사용)

### passport key 발급 테스트
```bash
curl http://localhost:5001/passportKey
```

예상 응답:
```json
{
  "passportKey": "3768c570d8d3c3701b062f041f038870fc2ee49e"
}
```

### 맞춤법 검사 테스트
```bash
curl -X POST http://localhost:5001/api/spell-check \
  -H "Content-Type: application/json" \
  -d '{"text": "그건 안되요"}'
```

예상 응답:
```json
{
  "success": true,
  "original": "그건 안되요",
  "checked": "그건 안돼요",
  "errorCount": 1,
  "errors": [
    {
      "start": 3,
      "end": 6,
      "original": "안되요",
      "suggestions": ["안돼요"],
      "errorType": "맞춤법"
    }
  ]
}
```

### 여러 줄 텍스트 테스트
```bash
curl -X POST http://localhost:5001/api/spell-check \
  -H "Content-Type: application/json" \
  -d '{"text": "그건 안돼요\n그건 안되요"}'
```

## 3. Python 스크립트로 테스트

`test_spell_check_api.py` 파일을 생성하여 테스트:

```python
#!/usr/bin/env python3
import requests
import json

def test_spell_check(text):
    url = "http://localhost:5001/api/spell-check"
    payload = {"text": text}
    
    response = requests.post(url, json=payload)
    data = response.json()
    
    print(f"원본: {data['original']}")
    print(f"교정: {data['checked']}")
    print(f"오류 개수: {data['errorCount']}")
    
    for i, error in enumerate(data['errors'], 1):
        print(f"\n오류 {i}:")
        print(f"  원본: '{error['original']}' ({error['start']}-{error['end']})")
        print(f"  제안: {error['suggestions']}")
        print(f"  유형: {error['errorType']}")

# 테스트 케이스
test_cases = [
    "그건 안되요",
    "그건 안돼요\n그건 안되요",
    "인터넷 연결을 확인해 주세요\n\n네트워크 연결이 불안정 해요. 잠시후 다시 시도해주세요.",
]

for test_text in test_cases:
    print("\n" + "="*60)
    print(f"테스트: {repr(test_text)}")
    print("="*60)
    test_spell_check(test_text)
```

실행:
```bash
python3 test_spell_check_api.py
```

## 4. 프론트엔드에서 테스트

1. **프론트엔드 개발 서버 실행**
```bash
npm run dev
```

2. **브라우저에서 접속**
   - 모달카피 페이지로 이동
   - 문구 생성 후 "맞춤법 검사" 섹션으로 이동

3. **테스트 케이스 입력**
   - 입력창에 다음 텍스트 입력:
     ```
     그건 안돼요
     그건 안되요
     ```
   - "검사하기" 버튼 클릭

4. **결과 확인**
   - 교정결과 영역에 "그건 안돼요\n그건 안돼요" 표시 확인
   - 오류 목록에 "안되요 → 안돼요" 표시 확인
   - 오류 개수가 1개로 표시되는지 확인

## 5. 주요 테스트 케이스

### 케이스 1: 맞춤법 오류
```
입력: "그건 안되요"
예상 결과: "그건 안돼요"
오류: "안되요" → "안돼요" (맞춤법)
```

### 케이스 2: 띄어쓰기 오류
```
입력: "인터넷 연결을 확인해 주세요\n\n네트워크 연결이 불안정 해요. 잠시후 다시 시도해주세요."
예상 결과: "인터넷 연결을 확인해주세요\n\n네트워크 연결이 불안정해요. 잠시 후 다시 시도해 주세요."
오류: 
  - "확인해 주세요" → "확인해주세요" (띄어쓰기)
  - "불안정 해요" → "불안정해요" (띄어쓰기)
  - "잠시후" → "잠시 후" (띄어쓰기)
  - "시도해주세요" → "시도해 주세요" (띄어쓰기)
```

### 케이스 3: 여러 줄 텍스트
```
입력: "그건 안돼요\n그건 안되요"
예상 결과: "그건 안돼요\n그건 안돼요"
오류: "안되요" → "안돼요" (맞춤법)
```

## 6. 문제 해결

### 백엔드 서버가 응답하지 않는 경우
```bash
# 서버 프로세스 확인
ps aux | grep "python3 app.py"

# 포트 사용 확인
lsof -i :5001

# 서버 재시작
pkill -f "python3 app.py"
cd server && python3 app.py
```

### "유효한 키가 아닙니다" 오류 발생 시
- passport key가 만료되었을 수 있습니다
- 서버를 재시작하면 자동으로 새로운 passport key를 발급받습니다

### 프론트엔드에서 연결 오류 발생 시
- 백엔드 서버가 실행 중인지 확인
- `.env` 파일에 `VITE_SPELL_CHECK_API_URL=http://localhost:5001` 설정 확인

