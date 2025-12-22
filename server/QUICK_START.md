# 빠른 시작 가이드

## ✅ 올바른 명령어

macOS에서는 `python3`와 `pip3`를 사용해야 합니다.

### 1. 올바른 디렉토리로 이동

```bash
cd /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy/server
```

### 2. 패키지 설치

```bash
pip3 install -r requirements.txt
```

또는 개별 설치:

```bash
pip3 install flask flask-cors requests
pip3 install git+https://github.com/ssut/py-hanspell.git
```

### 3. 서버 실행

```bash
python3 app.py
```

서버가 `http://localhost:5000`에서 실행됩니다.

## 🔍 문제 해결

### "command not found: pip" 또는 "command not found: python"

macOS에서는 `pip3`와 `python3`를 사용하세요:
- ❌ `pip install` → ✅ `pip3 install`
- ❌ `python app.py` → ✅ `python3 app.py`

### "cd: no such file or directory: server"

현재 디렉토리를 확인하세요:
```bash
pwd
```

올바른 경로로 이동:
```bash
cd /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy/server
```

## 📝 전체 실행 순서

```bash
# 1. 프로젝트 디렉토리로 이동
cd /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy

# 2. 백엔드 서버 디렉토리로 이동
cd server

# 3. 패키지 설치 (처음 한 번만)
pip3 install -r requirements.txt

# 4. 서버 실행
python3 app.py
```

서버가 실행되면 터미널에 다음과 같은 메시지가 표시됩니다:
```
 * Running on http://0.0.0.0:5000
```

## 🎯 다음 단계

서버가 실행되면 다른 터미널에서 프론트엔드를 실행하세요:

```bash
cd /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy
npm run dev
```

