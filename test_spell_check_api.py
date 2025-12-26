#!/usr/bin/env python3
import requests
import json

def test_spell_check(text):
    url = "http://localhost:5001/api/spell-check"
    payload = {"text": text}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        data = response.json()
        
        print(f"\n원본: {repr(data['original'])}")
        print(f"교정: {repr(data['checked'])}")
        print(f"오류 개수: {data['errorCount']}")
        
        for i, error in enumerate(data['errors'], 1):
            print(f"\n오류 {i}:")
            print(f"  원본: '{error['original']}' ({error['start']}-{error['end']})")
            print(f"  제안: {error['suggestions']}")
            print(f"  유형: {error['errorType']}")
    except Exception as e:
        print(f"오류 발생: {e}")

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
