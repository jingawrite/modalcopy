# LLM 서비스 노출 최적화 가이드

이 문서는 모달 카피라이터 서비스가 LLM(대규모 언어 모델) 서비스에 잘 노출되도록 최적화한 내용을 설명합니다.

## 구현된 최적화 항목

### 1. 구조화된 데이터 (JSON-LD)
- Schema.org WebApplication 스키마 적용
- 서비스 기능, 키워드, 언어 정보 포함
- LLM이 서비스의 목적과 기능을 명확히 이해할 수 있도록 구성

### 2. 메타 태그 개선
- ✅ 기본 메타 태그 (title, description, keywords)
- ✅ Open Graph 태그 (Facebook, LinkedIn 등)
- ✅ Twitter Card 태그
- ✅ 맞춤법 검사 기능 설명 추가
- ✅ 브랜드 스타일 정보 업데이트

### 3. robots.txt
- 모든 크롤러 허용
- 주요 LLM 크롤러 명시적 허용:
  - GPTBot (OpenAI)
  - ChatGPT-User
  - CCBot (Common Crawl)
  - anthropic-ai (Anthropic)
  - Claude-Web
  - Google-Extended (Google AI)
- Sitemap 위치 명시

### 4. sitemap.xml
- 사이트 구조 명시
- 검색 엔진과 LLM 크롤러가 사이트를 효율적으로 탐색할 수 있도록 구성

### 5. 시맨틱 HTML
- `<section>`, `<h1>`, `<h2>` 등 시맨틱 태그 사용
- `aria-label` 속성으로 접근성 향상
- LLM이 콘텐츠 구조를 이해하기 쉬운 마크업

## LLM 크롤러 지원

다음 LLM 서비스의 크롤러가 이 사이트를 크롤링할 수 있습니다:

1. **OpenAI GPTBot** - ChatGPT 웹 검색 기능
2. **Anthropic Claude** - Claude 웹 검색 기능
3. **Google AI** - Google의 AI 서비스
4. **Common Crawl** - 오픈소스 웹 크롤링 프로젝트

## 검증 방법

### 1. 구조화된 데이터 검증
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### 2. 메타 태그 검증
- [Open Graph Debugger](https://www.opengraph.xyz/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 3. robots.txt 검증
- `https://jingawrite.github.io/modalcopy/robots.txt` 접속 확인

### 4. sitemap.xml 검증
- `https://jingawrite.github.io/modalcopy/sitemap.xml` 접속 확인

## 추가 권장 사항

1. **콘텐츠 업데이트**: 서비스 기능이 추가되면 구조화된 데이터와 메타 태그도 함께 업데이트
2. **정기적인 sitemap 업데이트**: 콘텐츠 변경 시 sitemap.xml의 lastmod 날짜 업데이트
3. **모니터링**: Google Search Console 등으로 크롤링 상태 모니터링

## 참고 자료

- [Schema.org WebApplication](https://schema.org/WebApplication)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [robots.txt Specification](https://www.robotstxt.org/)




