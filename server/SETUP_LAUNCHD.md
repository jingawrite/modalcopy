# launchd를 사용한 백엔드 서버 자동 실행 설정

## 설치 방법

1. Python 경로 확인:
```bash
which python3
```

2. plist 파일의 Python 경로를 실제 경로로 수정:
```bash
# 예: /usr/local/bin/python3 또는 /usr/bin/python3
```

3. launchd에 서비스 등록:
```bash
cd /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy/server
launchctl load ~/Library/LaunchAgents/com.modalcopy.spellcheck.plist
```

4. 서비스 시작:
```bash
launchctl start com.modalcopy.spellcheck
```

## 서비스 관리 명령어

### 서비스 시작
```bash
launchctl start com.modalcopy.spellcheck
```

### 서비스 중지
```bash
launchctl stop com.modalcopy.spellcheck
```

### 서비스 상태 확인
```bash
launchctl list | grep com.modalcopy.spellcheck
```

### 서비스 제거
```bash
launchctl unload ~/Library/LaunchAgents/com.modalcopy.spellcheck.plist
```

## 로그 확인

```bash
tail -f /Users/brown/Desktop/업무/99_기타/01_모달카피라이터/modalcopy/server/server.log
```

