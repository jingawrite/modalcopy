"""
맞춤법 검사 백엔드 서버
로컬 py-hanspell-master2 폴더의 파일을 직접 사용하여 네이버 맞춤법 검사 API를 호출합니다.
"""
import sys
import os
from pathlib import Path

# py-hanspell-master2 폴더를 Python 경로에 추가
# server 폴더에서 상위 폴더로 이동한 후 py-hanspell-master2 폴더 찾기
current_dir = Path(__file__).parent.absolute()
project_root = current_dir.parent.parent
py_hanspell_path = project_root / 'py-hanspell-master2'

if py_hanspell_path.exists():
    sys.path.insert(0, str(py_hanspell_path))
    print(f"✅ py-hanspell-master2 폴더를 경로에 추가했습니다: {py_hanspell_path}")
else:
    print(f"⚠️  py-hanspell-master2 폴더를 찾을 수 없습니다: {py_hanspell_path}")
    print("   설치된 py-hanspell 패키지를 사용합니다.")

from flask import Flask, request, jsonify
from flask_cors import CORS

# 로컬 py-hanspell-master2 폴더에서 직접 import
# py-hanspell의 올바른 사용법: from hanspell import spell_checker
try:
    from hanspell import spell_checker
    hanspell_check = spell_checker.check
    print("✅ 로컬 py-hanspell-master2 파일을 사용합니다.")
    print(f"   spell_checker 모듈: {spell_checker}")
    print(f"   check 함수: {hanspell_check}")
except ImportError as e:
    # 폴백: 설치된 패키지 사용
    try:
        from hanspell import spell_checker
        hanspell_check = spell_checker.check
        print("⚠️  설치된 py-hanspell 패키지를 사용합니다.")
    except ImportError:
        print(f"❌ py-hanspell을 찾을 수 없습니다: {e}")
        hanspell_check = None

app = Flask(__name__)
CORS(app)  # CORS 허용

# passport key를 메모리에 저장 (실제 운영 환경에서는 Redis 등 사용 권장)
_passport_key_cache = None

@app.route('/passportKey', methods=['GET'])
def get_passport_key():
    """
    네이버 맞춤법 검사기 passport key 발급 엔드포인트
    제공된 코드 방식: 네이버 검색 페이지에서 맞춤법검사기 검색 후 passport key 추출
    """
    global _passport_key_cache
    
    try:
        import requests
        import re
        from urllib.parse import unquote
        
        # 네이버 검색 페이지에서 맞춤법검사기 검색하여 passport key 획득
        # 제공된 코드 방식 사용
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        }
        
        session = requests.Session()
        
        # 네이버 검색 페이지에서 맞춤법검사기 검색
        # 제공된 코드의 URL 형식 사용
        search_url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=맞춤법검사기'
        response = session.get(search_url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            raise Exception(f"네이버 검색 페이지 접근 실패: HTTP {response.status_code}")
        
        # 응답 데이터에서 passport key 추출
        # 제공된 코드의 정규식 패턴 사용: /passportKey=([a-zA-Z0-9]+)/
        response_data = response.text
        match = re.search(r'passportKey=([a-zA-Z0-9]+)', response_data)
        
        passport_key = None
        if match:
            # URI 디코딩하여 passport key 추출
            passport_key = unquote(match.group(1))
            print(f"✅ passport key 발급 성공: {passport_key[:20]}...")
        else:
            print("⚠️  passport key를 찾지 못했습니다.")
            # 다른 패턴도 시도
            alternative_patterns = [
                r'passportKey["\']?\s*[:=]\s*["\']([^"\']+)["\']',
                r'passportKey=([^&\s"\']+)',
            ]
            
            for pattern in alternative_patterns:
                alt_match = re.search(pattern, response_data, re.IGNORECASE)
                if alt_match:
                    passport_key = alt_match.group(1)
                    print(f"✅ passport key 발급 성공 (대체 패턴): {passport_key[:20]}...")
                    break
        
        # passport key를 찾지 못한 경우, 빈 문자열 사용
        if not passport_key:
            passport_key = ''
            print("⚠️  passport key를 찾지 못해 빈 문자열을 반환합니다.")
        
        # 캐시에 저장
        _passport_key_cache = passport_key
        
        return jsonify({
            'passportKey': passport_key
        })
        
    except Exception as e:
        print(f"⚠️  passport key 발급 실패: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/spell-check', methods=['POST'])
def spell_check_api():
    """
    맞춤법 검사 API 엔드포인트
    
    Request Body:
    {
        "text": "검사할 텍스트",
        "engine": "네이버" (선택사항, 기본값: 네이버)
    }
    
    Response:
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
        "checked": "교정된 텍스트",
        "errorCount": 1
    }
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        engine = data.get('engine', '네이버')
        
        if not text:
            return jsonify({
                'success': False,
                'error': '텍스트가 제공되지 않았습니다.'
            }), 400
        
        # 네이버 API를 직접 호출하여 HTML 응답 받기
        # py-hanspell의 words 딕셔너리가 부정확할 수 있으므로 HTML을 직접 파싱
        import requests
        import json
        import time
        import xml.etree.ElementTree as ET
        
        try:
            from hanspell.constants import CheckResult, base_url
        except ImportError:
            class CheckResult:
                PASSED = 0
                WRONG_SPELLING = 1
                WRONG_SPACING = 2
                AMBIGUOUS = 3
                STATISTICAL_CORRECTION = 4
            # 네이버 검색 페이지의 맞춤법 검사기 엔드포인트 사용
            # 네이버 검색 페이지에서 직접 사용하는 맞춤법 검사기 API
            base_url = 'https://search.naver.com/p/csearch/ocontent/util/SpellerProxy'
        
        if len(text) > 500:
            return jsonify({
                'success': False,
                'error': '텍스트는 500자 이하여야 합니다.'
            }), 400
        
        # passport key 가져오기 (캐시에서 또는 새로 발급)
        global _passport_key_cache
        passport_key = _passport_key_cache
        
        if not passport_key:
            # passport key 발급 요청
            try:
                passport_response = requests.get('http://localhost:5001/passportKey', timeout=5)
                if passport_response.status_code == 200:
                    passport_data = passport_response.json()
                    passport_key = passport_data.get('passportKey', '')
                    _passport_key_cache = passport_key
                    print(f"✅ passport key 발급 성공")
                else:
                    print(f"⚠️  passport key 발급 실패: HTTP {passport_response.status_code}")
                    passport_key = ''
            except Exception as e:
                print(f"⚠️  passport key 발급 실패: {e}")
                passport_key = ''
        
        # 네이버 맞춤법 검사기 API 호출 (passport key 포함)
        # 제공된 코드 형식에 맞춰 파라미터 설정
        import time as time_module
        timestamp = int(time_module.time() * 1000)  # 밀리초 타임스탬프
        
        payload = {
            'passportKey': passport_key,
            '_callback': 'mycallback',
            'q': text,
            'where': 'nexearch',
            'color_blindness': '0',
            '_': str(timestamp)
        }
        
        # 네이버 검색 페이지를 시뮬레이션하는 헤더 설정
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'referer': 'https://search.naver.com/',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        }
        
        url = 'https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy'
        start_time = time.time()
        
        # 세션을 사용하여 쿠키 유지
        session = requests.Session()
        
        # 맞춤법 검사 API 호출 (JSONP 형식)
        r = session.get(url, params=payload, headers=headers, timeout=10)
        passed_time = time.time() - start_time
        
        if r.status_code != 200:
            raise Exception(f"네이버 API 호출 실패: HTTP {r.status_code}")
        
        # JSONP 응답 파싱 (mycallback({...}) 형식)
        response_text = r.text
        if response_text.startswith('mycallback(') and response_text.endswith(');'):
            # JSONP 형식 제거
            json_data = response_text.replace('mycallback(', '').replace(');', '')
            data = json.loads(json_data)
        else:
            # 일반 JSON 응답
            data = json.loads(response_text)
        
        # API 오류 응답 확인
        if 'message' in data and 'error' in data.get('message', {}):
            error_msg = data['message']['error']
            print(f"⚠️  네이버 API 오류: {error_msg}")
            
            # "유효한 키가 아닙니다" 오류인 경우, passport key 재발급 후 재시도
            if '유효한 키' in error_msg:
                print("   passport key 재발급 중...")
                # 캐시 초기화
                _passport_key_cache = None
                
                # passport key 재발급
                try:
                    passport_response = requests.get('http://localhost:5001/passportKey', timeout=5)
                    if passport_response.status_code == 200:
                        passport_data = passport_response.json()
                        passport_key = passport_data.get('passportKey', '')
                        _passport_key_cache = passport_key
                        
                        # 새로운 passport key로 재시도
                        payload['passportKey'] = passport_key
                        timestamp = int(time_module.time() * 1000)
                        payload['_'] = str(timestamp)
                        
                        r = session.get(url, params=payload, headers=headers, timeout=10)
                        if r.status_code != 200:
                            raise Exception(f"네이버 API 호출 실패: HTTP {r.status_code}")
                        
                        # JSONP 응답 파싱
                        response_text = r.text
                        if response_text.startswith('mycallback(') and response_text.endswith(');'):
                            json_data = response_text.replace('mycallback(', '').replace(');', '')
                            data = json.loads(json_data)
                        else:
                            data = json.loads(response_text)
                        
                        # 재시도 후에도 오류가 있으면 예외 발생
                        if 'message' in data and 'error' in data.get('message', {}):
                            raise Exception(f"네이버 API 오류: {data['message']['error']}")
                    else:
                        raise Exception(f"passport key 재발급 실패: HTTP {passport_response.status_code}")
                except Exception as e:
                    print(f"⚠️  passport key 재발급 실패: {e}")
                    raise Exception(f"네이버 API 오류: {error_msg}")
            else:
                raise Exception(f"네이버 API 오류: {error_msg}")
        
        if 'message' not in data or 'result' not in data.get('message', {}):
            print(f"⚠️  예상치 못한 API 응답 구조: {json.dumps(data, ensure_ascii=False)}")
            raise Exception(f"예상치 못한 API 응답 구조: {data}")
        
        html = data['message']['result']['html']
        error_count = data['message']['result'].get('errata_count', 0)
        
        # 디버깅: API 응답 로그 출력
        print(f"✅ 네이버 API 호출 성공")
        print(f"   오류 개수: {error_count}")
        print(f"   HTML 길이: {len(html)}")
        
        def _remove_tags(text):
            # <br> 태그를 줄바꿈 문자로 변환
            text = text.replace('<br>', '\n')
            text = f'<content>{text}</content>'
            result = ''.join(ET.fromstring(text).itertext())
            return result
        
        checked = _remove_tags(html)
        
        # HTML을 직접 파싱하여 오류 추출 (더 정확한 방법)
        errors = _extract_errors_from_html(original=text, checked=checked, html=html, error_count=error_count)
        
        return jsonify({
            'success': True,
            'original': text,
            'checked': checked,
            'errors': errors,
            'errorCount': error_count
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def _call_naver_api_directly(text: str):
    """네이버 API를 직접 호출하여 맞춤법 검사"""
    import requests
    import json
    import time
    from collections import OrderedDict
    import xml.etree.ElementTree as ET
    
    try:
        from hanspell.response import Checked
        from hanspell.constants import CheckResult, base_url
    except ImportError:
        # 폴백: 직접 정의
        from collections import namedtuple
        Checked = namedtuple('Checked', ['result', 'original', 'checked', 'errors', 'words', 'time'])
        class CheckResult:
            PASSED = 0
            WRONG_SPELLING = 1
            WRONG_SPACING = 2
            AMBIGUOUS = 3
            STATISTICAL_CORRECTION = 4
        base_url = 'https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy'
    
    if len(text) > 500:
        return Checked(result=False)
    
    payload = {
        'color_blindness': '0',
        'q': text
    }
    
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
        'referer': 'https://search.naver.com/',
    }
    
    start_time = time.time()
    session = requests.Session()
    r = session.get(base_url, params=payload, headers=headers, timeout=10)
    passed_time = time.time() - start_time
    
    if r.status_code != 200:
        raise Exception(f"네이버 API 호출 실패: HTTP {r.status_code}")
    
    data = json.loads(r.text)
    
    # 응답 구조 확인 및 처리
    if 'message' not in data:
        raise Exception(f"예상치 못한 API 응답 구조: {data}")
    
    if 'error' in data.get('message', {}):
        error_msg = data['message']['error']
        raise Exception(f"네이버 API 오류: {error_msg}")
    
    if 'result' not in data.get('message', {}):
        raise Exception(f"API 응답에 result가 없습니다: {data}")
    
    html = data['message']['result']['html']
    
    def _remove_tags(text):
        # <br> 태그를 줄바꿈 문자로 변환
        text = text.replace('<br>', '\n')
        text = f'<content>{text}</content>'
        result = ''.join(ET.fromstring(text).itertext())
        return result
    
    result = {
        'result': True,
        'original': text,
        'checked': _remove_tags(html),
        'errors': data['message']['result'].get('errata_count', 0),
        'time': passed_time,
        'words': OrderedDict(),
    }
    
    # HTML 파싱하여 words 딕셔너리 생성
    html = html.replace('<em class=\'green_text\'>', '<green>') \
               .replace('<em class=\'red_text\'>', '<red>') \
               .replace('<em class=\'violet_text\'>', '<violet>') \
               .replace('<em class=\'blue_text\'>', '<blue>') \
               .replace('</em>', '<end>')
    items = html.split(' ')
    words = []
    tmp = ''
    for word in items:
        if tmp == '' and word[:1] == '<':
            pos = word.find('>') + 1
            tmp = word[:pos]
        elif tmp != '':
            word = f'{tmp}{word}'
        
        if word[-5:] == '<end>':
            word = word.replace('<end>', '')
            tmp = ''
        
        words.append(word)
    
    for word in words:
        check_result = CheckResult.PASSED
        if word[:5] == '<red>':
            check_result = CheckResult.WRONG_SPELLING
            word = word.replace('<red>', '')
        elif word[:7] == '<green>':
            check_result = CheckResult.WRONG_SPACING
            word = word.replace('<green>', '')
        elif word[:8] == '<violet>':
            check_result = CheckResult.AMBIGUOUS
            word = word.replace('<violet>', '')
        elif word[:6] == '<blue>':
            check_result = CheckResult.STATISTICAL_CORRECTION
            word = word.replace('<blue>', '')
        result['words'][word] = check_result
    
    return Checked(**result)

def _create_mock_errors(text: str) -> list:
    """모의 오류 데이터 생성 (py-hanspell 실패 시 사용)"""
    errors = []
    
    # 간단한 패턴 매칭으로 오류 찾기
    if '되요' in text:
        idx = text.find('되요')
        errors.append({
            'start': idx,
            'end': idx + 2,
            'original': '되요',
            'suggestions': ['돼요', '되어요'],
            'errorType': '맞춤법'
        })
    
    if '안되' in text:
        idx = text.find('안되')
        errors.append({
            'start': idx,
            'end': idx + 2,
            'original': '안되',
            'suggestions': ['안 돼', '안 되어'],
            'errorType': '띄어쓰기'
        })
    
    return errors

def _extract_errors_from_words(original: str, words: dict) -> list:
    """words 딕셔너리에서 직접 오류 정보 추출 (네이버 API 오류 시 사용)"""
    errors = []
    try:
        from hanspell.constants import CheckResult
    except ImportError:
        class CheckResult:
            PASSED = 0
            WRONG_SPELLING = 1
            WRONG_SPACING = 2
            AMBIGUOUS = 3
            STATISTICAL_CORRECTION = 4
    
    # 원본 텍스트에서 단어 위치 찾기
    word_positions = {}
    current_pos = 0
    
    # 원본 텍스트를 단어 단위로 분리하여 위치 저장
    import re
    words_list = re.findall(r'\S+', original)
    
    for word in words_list:
        word_start = original.find(word, current_pos)
        if word_start != -1:
            word_positions[word] = (word_start, word_start + len(word))
            current_pos = word_start + len(word)
    
    # words 딕셔너리에서 오류 추출
    for word, check_result in words.items():
        word_clean = word.strip()
        
        if check_result == CheckResult.PASSED:
            continue
        
        # 원본 텍스트에서 해당 단어의 위치 찾기
        if word_clean in word_positions:
            word_start, word_end = word_positions[word_clean]
        else:
            # 부분 문자열로 찾기
            word_start = original.find(word_clean)
            if word_start == -1:
                continue
            word_end = word_start + len(word_clean)
        
        # 오류 유형 매핑
        error_type_map = {
            CheckResult.WRONG_SPELLING: "맞춤법",
            CheckResult.WRONG_SPACING: "띄어쓰기",
            CheckResult.AMBIGUOUS: "표준어",
            CheckResult.STATISTICAL_CORRECTION: "통계적교정"
        }
        
        error_type = error_type_map.get(check_result, "기타")
        
        errors.append({
            'start': word_start,
            'end': word_end,
            'original': word_clean,
            'suggestions': [word_clean],  # 제안은 words에서 직접 추출 불가
            'errorType': error_type
        })
    
    return errors

def _extract_errors_from_html(original: str, checked: str, html: str, error_count: int) -> list:
    """
    HTML 응답을 직접 파싱하여 오류 정보 추출
    줄바꿈이 있는 경우에도 정확하게 오류를 찾을 수 있습니다.
    """
    errors = []
    import re
    import xml.etree.ElementTree as ET
    
    try:
        from hanspell.constants import CheckResult
    except ImportError:
        class CheckResult:
            PASSED = 0
            WRONG_SPELLING = 1
            WRONG_SPACING = 2
            AMBIGUOUS = 3
            STATISTICAL_CORRECTION = 4
    
    error_type_map = {
        'red': "맞춤법",
        'green': "띄어쓰기",
        'violet': "표준어",
        'blue': "통계적교정"
    }
    
    # HTML을 파싱하여 오류 위치와 텍스트 추출
    # <em class='green_text'>텍스트</em> 형식의 태그 찾기
    pattern = r"<em class='(red_text|green_text|violet_text|blue_text)'>(.*?)</em>"
    matches = list(re.finditer(pattern, html))
    
    print(f"   HTML에서 찾은 오류 태그 개수: {len(matches)}")
    
    for match in matches:
        error_class = match.group(1)  # red_text, green_text 등
        corrected_text = match.group(2)  # 교정된 텍스트
        
        # 오류 유형 결정
        if 'red' in error_class:
            error_type = "맞춤법"
        elif 'green' in error_class:
            error_type = "띄어쓰기"
        elif 'violet' in error_class:
            error_type = "표준어"
        elif 'blue' in error_class:
            error_type = "통계적교정"
        else:
            error_type = "기타"
        
        # 교정된 텍스트에서 위치 찾기
        corrected_pos = checked.find(corrected_text)
        if corrected_pos == -1:
            # HTML 태그 제거 후 다시 찾기
            corrected_text_clean = re.sub(r'<[^>]+>', '', corrected_text).strip()
            corrected_pos = checked.find(corrected_text_clean)
            if corrected_pos == -1:
                continue
            corrected_text = corrected_text_clean
        
        # 교정된 텍스트 위치를 원본 위치로 매핑
        orig_idx = 0
        check_idx = 0
        
        while check_idx < corrected_pos and orig_idx < len(original) and check_idx < len(checked):
            checked_char = checked[check_idx] if check_idx < len(checked) else ''
            original_char = original[orig_idx] if orig_idx < len(original) else ''
            
            if checked_char == original_char:
                orig_idx += 1
                check_idx += 1
            elif checked_char.isspace() and not original_char.isspace():
                check_idx += 1
            elif original_char.isspace() and not checked_char.isspace():
                orig_idx += 1
            elif original_char == '\n' or original_char == '\r':
                orig_idx += 1
            else:
                orig_idx += 1
                check_idx += 1
        
        estimated_start = orig_idx
        
        # 원본에서 해당 위치 근처의 단어 찾기
        original_words = []
        for word_match in re.finditer(r'\S+', original):
            word = word_match.group()
            start = word_match.start()
            end = word_match.end()
            original_words.append({
                'word': word,
                'start': start,
                'end': end
            })
        
        found_original = None
        
        # 띄어쓰기 오류: 여러 단어가 합쳐진 경우
        if error_type == "띄어쓰기":
            corrected_no_space = corrected_text.replace(' ', '').replace('?', '').replace('.', '').replace('!', '')
            
            start_idx = 0
            for i, ow in enumerate(original_words):
                if ow['start'] <= estimated_start < ow['end'] or abs(ow['start'] - estimated_start) < 10:
                    start_idx = i
                    break
            
            for i in range(start_idx, len(original_words)):
                combined_start = original_words[i]['start']
                
                for j in range(i + 1, min(i + 6, len(original_words))):
                    actual_text = original[combined_start:original_words[j]['end']]
                    test_no_space = actual_text.replace(' ', '').replace('\n', '').replace('\r', '').replace('?', '').replace('.', '').replace('!', '')
                    
                    if test_no_space == corrected_no_space:
                        found_original = {
                            'word': actual_text.strip(),
                            'start': combined_start,
                            'end': original_words[j]['end']
                        }
                        break
                    elif len(test_no_space) > len(corrected_no_space) + 2:
                        break
                
                if found_original:
                    break
        
        # 맞춤법 오류: 단일 단어 교정
        if not found_original:
            best_match = None
            best_distance = float('inf')
            for ow in original_words:
                distance = abs(ow['start'] - estimated_start)
                if distance < best_distance:
                    best_distance = distance
                    best_match = ow
            
            if best_match and best_distance < 15:
                found_original = {
                    'word': best_match['word'],
                    'start': best_match['start'],
                    'end': best_match['end']
                }
        
        if found_original and found_original['word'] != corrected_text:
            errors.append({
                'start': found_original['start'],
                'end': found_original['end'],
                'original': found_original['word'],
                'suggestions': [corrected_text],
                'errorType': error_type
            })
    
    return errors

def _extract_errors(original: str, checked: str, words: dict) -> list:
    """
    원본 텍스트와 교정된 텍스트를 비교하여 오류 정보 추출
    py-hanspell의 words 딕셔너리를 사용하여 정확한 오류 위치와 제안을 추출합니다.
    네이버 맞춤법 검사기의 결과를 그대로 반영합니다.
    """
    errors = []
    try:
        from hanspell.constants import CheckResult
    except ImportError:
        # 폴백: CheckResult 상수 직접 정의
        class CheckResult:
            PASSED = 0
            WRONG_SPELLING = 1
            WRONG_SPACING = 2
            AMBIGUOUS = 3
            STATISTICAL_CORRECTION = 4
    
    # 오류 유형 매핑
    error_type_map = {
        CheckResult.WRONG_SPELLING: "맞춤법",
        CheckResult.WRONG_SPACING: "띄어쓰기",
        CheckResult.AMBIGUOUS: "표준어",
        CheckResult.STATISTICAL_CORRECTION: "통계적교정"
    }
    
    # 교정된 텍스트의 각 단어를 원본과 순차적으로 매칭
    import re
    
    # 원본 텍스트에서 단어 위치 저장 (줄바꿈 포함)
    original_words_with_pos = []
    for match in re.finditer(r'\S+', original):
        word = match.group()
        start = match.start()
        end = match.end()
        original_words_with_pos.append({
            'word': word,
            'start': start,
            'end': end
        })
    
    # 교정된 텍스트에서 단어 위치 저장
    checked_words_with_pos = []
    for match in re.finditer(r'\S+', checked):
        word = match.group()
        start = match.start()
        end = match.end()
        checked_words_with_pos.append({
            'word': word,
            'start': start,
            'end': end
        })
    
    # words 딕셔너리의 각 오류 단어에 대해 원본 위치 찾기
    for corrected_word, check_result in words.items():
        if check_result == CheckResult.PASSED:
            continue
        
        # HTML 태그 제거 (py-hanspell이 words에 HTML 태그를 포함시킬 수 있음)
        corrected_word_clean = re.sub(r'<[^>]+>', '', corrected_word).strip()
        error_type = error_type_map.get(check_result, "기타")
        
        # 교정된 텍스트에서 해당 단어의 위치 찾기
        # 단어가 다른 단어와 붙어있을 수 있으므로 정확히 찾기
        # HTML 태그가 제거된 교정 텍스트에서 찾기
        corrected_pos = -1
        corrected_end_pos = -1
        
        # 방법 1: 정확히 일치하는 단어 찾기 (HTML 태그 제거 후 비교)
        for cw in checked_words_with_pos:
            cw_clean = re.sub(r'<[^>]+>', '', cw['word']).strip()
            if cw_clean == corrected_word_clean:
                corrected_pos = cw['start']
                corrected_end_pos = cw['end']
                break
        
        # 방법 2: 교정된 단어가 다른 단어에 포함된 경우 찾기
        if corrected_pos == -1:
            for cw in checked_words_with_pos:
                cw_clean = re.sub(r'<[^>]+>', '', cw['word']).strip()
                if corrected_word_clean in cw_clean:
                    # 포함된 위치 찾기
                    inner_pos = cw_clean.find(corrected_word_clean)
                    if inner_pos != -1:
                        corrected_pos = cw['start'] + inner_pos
                        corrected_end_pos = corrected_pos + len(corrected_word_clean)
                        break
        
        # 방법 3: 직접 찾기 시도 (HTML 태그 제거된 텍스트에서)
        if corrected_pos == -1:
            corrected_pos = checked.find(corrected_word_clean)
            if corrected_pos != -1:
                corrected_end_pos = corrected_pos + len(corrected_word_clean)
        
        if corrected_pos == -1:
            continue
        
        # 교정된 단어의 위치를 기준으로 원본에서 대응하는 위치 찾기
        # 원본과 교정된 텍스트를 순차적으로 비교하여 정확한 위치 매핑
        original_idx = 0
        checked_idx = 0
        
        # 교정된 단어의 시작 위치까지 원본과 교정된 텍스트를 순차 비교
        # 줄바꿈 문자도 고려하여 비교
        while checked_idx < corrected_pos and original_idx < len(original) and checked_idx < len(checked):
            checked_char = checked[checked_idx] if checked_idx < len(checked) else ''
            original_char = original[original_idx] if original_idx < len(original) else ''
            
            if checked_char == original_char:
                original_idx += 1
                checked_idx += 1
            elif checked_char.isspace() and not original_char.isspace():
                # 교정된 텍스트에 공백이 추가된 경우
                checked_idx += 1
            elif original_char.isspace() and not checked_char.isspace():
                # 원본에 공백/줄바꿈이 제거된 경우
                original_idx += 1
            elif original_char == '\n' or original_char == '\r':
                # 원본의 줄바꿈은 교정된 텍스트에 없음
                original_idx += 1
            else:
                # 다른 문자 - 위치 조정
                original_idx += 1
                checked_idx += 1
        
        # 이제 original_idx가 교정된 단어에 대응하는 원본 위치
        estimated_original_start = original_idx
        
        found_original = None
        
        # 띄어쓰기 오류: 교정된 단어가 원본의 여러 단어를 합친 것
        if error_type == "띄어쓰기":
            # 줄바꿈과 특수문자 제거하여 비교
            corrected_no_space = corrected_word_clean.replace(' ', '').replace('\n', '').replace('\r', '').replace('?', '').replace('.', '').replace('!', '').replace('，', '').replace('。', '')
            
            # 원본에서 estimated_original_start 위치 근처의 단어부터 시작
            start_idx = 0
            for i, ow in enumerate(original_words_with_pos):
                if ow['start'] <= estimated_original_start < ow['end'] or abs(ow['start'] - estimated_original_start) < 8:
                    start_idx = i
                    break
            
            # 연속된 단어들을 찾아서 합치기 (줄바꿈 포함)
            for i in range(start_idx, len(original_words_with_pos)):
                combined = original_words_with_pos[i]['word']
                combined_start = original_words_with_pos[i]['start']
                combined_end = original_words_with_pos[i]['end']
                
                # 뒤의 단어들도 포함하는지 확인 (최대 5개 단어까지, 줄바꿈 고려)
                for j in range(i + 1, min(i + 6, len(original_words_with_pos))):
                    # 원본 텍스트에서 실제로 어떻게 연결되어 있는지 확인 (줄바꿈 포함)
                    actual_text = original[combined_start:original_words_with_pos[j]['end']]
                    # 공백, 줄바꿈, 특수문자 제거하여 비교
                    test_combined_no_space = actual_text.replace(' ', '').replace('\n', '').replace('\r', '').replace('?', '').replace('.', '').replace('!', '').replace('，', '').replace('。', '')
                    
                    if test_combined_no_space == corrected_no_space:
                        found_original = {
                            'word': actual_text.strip(),
                            'start': combined_start,
                            'end': original_words_with_pos[j]['end']
                        }
                        break
                    elif len(test_combined_no_space) > len(corrected_no_space) + 2:
                        # 너무 길어지면 중단
                        break
                
                if found_original:
                    break
        
        # 맞춤법 오류: 원본에서 유사한 단어 찾기
        if not found_original and error_type == "맞춤법":
            # 교정된 단어의 위치를 기준으로 원본에서 대응하는 위치 찾기
            # 원본과 교정된 텍스트를 순차적으로 비교하여 더 정확한 위치 계산
            # 줄바꿈도 고려하여 비교
            orig_idx = 0
            check_idx = 0
            
            # 교정된 단어 위치까지 순차 비교 (줄바꿈 고려)
            while check_idx < corrected_pos and orig_idx < len(original) and check_idx < len(checked):
                checked_char = checked[check_idx] if check_idx < len(checked) else ''
                original_char = original[orig_idx] if orig_idx < len(original) else ''
                
                if checked_char == original_char:
                    orig_idx += 1
                    check_idx += 1
                elif checked_char.isspace() and not original_char.isspace():
                    # 교정된 텍스트에 공백/줄바꿈이 추가된 경우
                    check_idx += 1
                elif original_char.isspace() and not checked_char.isspace():
                    # 원본에 공백/줄바꿈이 제거된 경우
                    orig_idx += 1
                else:
                    # 다른 문자 - 위치 조정
                    orig_idx += 1
                    check_idx += 1
            
            # 이제 orig_idx가 교정된 단어에 대응하는 원본 위치
            refined_original_start = orig_idx
            
            # 위치가 비슷한 원본 단어 찾기
            for ow in original_words_with_pos:
                # 위치가 가까운 경우 (8자 이내, 줄바꿈 고려)
                if abs(ow['start'] - refined_original_start) < 8:
                    # 길이가 비슷한 경우 (4자 이내 차이)
                    if abs(len(ow['word']) - len(corrected_word_clean)) < 4:
                        found_original = {
                            'word': ow['word'],
                            'start': ow['start'],
                            'end': ow['end']
                        }
                        break
            
            # 여전히 못 찾은 경우, 위치만으로 찾기
            if not found_original:
                best_match = None
                best_distance = float('inf')
                for ow in original_words_with_pos:
                    distance = abs(ow['start'] - refined_original_start)
                    if distance < best_distance:
                        best_distance = distance
                        best_match = ow
                
                if best_match and best_distance < 15:
                    found_original = {
                        'word': best_match['word'],
                        'start': best_match['start'],
                        'end': best_match['end']
                    }
        
        # 방법 3: 위치 기반으로 가장 가까운 단어 찾기 (최후의 수단)
        if not found_original:
            best_match = None
            best_distance = float('inf')
            for ow in original_words_with_pos:
                distance = abs(ow['start'] - estimated_original_start)
                if distance < best_distance:
                    best_distance = distance
                    best_match = ow
            
            if best_match and best_distance < 20:
                found_original = {
                    'word': best_match['word'],
                    'start': best_match['start'],
                    'end': best_match['end']
                }
        
        # 오류 추가
        if found_original and found_original['word'] != corrected_word_clean:
            errors.append({
                'start': found_original['start'],
                'end': found_original['end'],
                'original': found_original['word'],
                'suggestions': [corrected_word_clean],
                'errorType': error_type
            })
    
    return errors

@app.route('/health', methods=['GET'])
def health():
    """헬스 체크 엔드포인트"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # macOS에서는 포트 5000이 AirPlay Receiver에 사용되므로 5001 사용
    app.run(host='0.0.0.0', port=5001, debug=True)

