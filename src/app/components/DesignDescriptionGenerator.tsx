import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { cn } from "./ui/utils";

type ScreenType = 
  | "대시보드"
  | "캠페인 관리"
  | "광고 그룹 관리"
  | "광고 소재 관리"
  | "키워드 관리"
  | "리포트/분석"
  | "예산 관리"
  | "권한 관리"
  | "계정 관리"
  | "설정"
  | "기타";

interface DescriptionTemplate {
  정의: string;
  제약사항: string[];
  데이터: string[];
  상태: string[];
  예외처리: string[];
}

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  description: string;
  tip?: string;
  requiresQuestion?: boolean; // 질문이 필요한 항목인지 여부
  question?: string; // 질문 텍스트
}

const commonChecklist: ChecklistItem[] = [
  {
    id: "data-exists",
    category: "데이터",
    label: "① 데이터가 있는 경우의 화면 구성",
    description: "정상적으로 데이터가 로드되었을 때의 화면 레이아웃과 표시 방법",
    tip: "일반적으로 가장 먼저 작성하는 항목입니다."
  },
  {
    id: "data-length",
    category: "데이터",
    label: "①-1 개별 데이터의 길이 정의",
    description: "텍스트 데이터의 최소/최대 글자수, 이미지/동영상의 최소/최대 사이즈",
    tip: "예: 제목 최대 50자, 본문 최대 500자, 이미지 최소 300x300px, 최대 1920x1080px"
  },
  {
    id: "data-type",
    category: "데이터",
    label: "①-2 개별 데이터의 유형 정의",
    description: "사진, 동영상, 글자, 코드 등 데이터 타입 및 허용 확장자",
    tip: "예: 이미지(JPG, PNG, GIF), 동영상(MP4, MOV), 문서(PDF, DOCX), 확장자별 제한 명시"
  },
  {
    id: "data-size",
    category: "데이터",
    label: "①-3 개별 데이터의 용량 정의",
    description: "파일 크기 제한 (KB, MB 단위)",
    tip: "예: 이미지 최대 5MB, 동영상 최대 50MB, 문서 최대 10MB"
  },
  {
    id: "data-image-empty",
    category: "데이터",
    label: "①-4 이미지가 없을 때의 노출 방법",
    description: "이미지 데이터가 없거나 로드 실패 시 표시할 대체 이미지 또는 UI",
    tip: "플레이스홀더 이미지, 기본 아이콘, 색상 배경 등을 정의해주세요. 특히 중요합니다!",
    requiresQuestion: true,
    question: "이 페이지에 이미지가 사용되나요?"
  },
  {
    id: "data-empty",
    category: "데이터",
    label: "② 데이터가 없는 경우의 화면 구성",
    description: "데이터가 없을 때 표시할 빈 상태(Empty State) 화면",
    tip: "빼먹기 쉬운 항목입니다. 공통으로 정의하거나 먼저 작성하는 것을 권장합니다."
  },
  {
    id: "data-many",
    category: "데이터",
    label: "③ 데이터가 너무 많을 때의 화면 구성",
    description: "페이지네이션, 무한 스크롤, 로딩 처리 등",
    tip: "페이지네이션, 무한 스크롤, 로딩 이미지 등을 고려해주세요."
  },
  {
    id: "state-loading",
    category: "상태",
    label: "로딩 상태 정의",
    description: "데이터를 불러오는 중일 때의 UI 상태",
    tip: "스켈레톤 UI, 로딩 인디케이터 등을 정의해주세요."
  },
  {
    id: "state-error",
    category: "상태",
    label: "에러 상태 정의",
    description: "에러가 발생했을 때의 UI 상태 및 사용자 액션",
    tip: "에러 메시지 표시 및 재시도 버튼 등을 정의해주세요."
  },
  {
    id: "constraint-input",
    category: "제약사항",
    label: "입력 필드 제약사항",
    description: "글자 수, 형식, 허용 문자 등 입력 제한",
    tip: "최소/최대 글자수, 허용 문자, 특수문자 제한 등을 명시해주세요."
  },
  {
    id: "constraint-permission",
    category: "제약사항",
    label: "권한 제약사항",
    description: "사용자 권한에 따른 기능 제한",
    tip: "조회, 생성, 수정, 삭제 권한별로 접근 가능한 기능을 정의해주세요."
  },
  {
    id: "exception-network",
    category: "예외처리",
    label: "네트워크 오류 처리",
    description: "네트워크 연결 실패 시 처리 방법",
    tip: "에러 메시지 표시 및 재시도 버튼을 제공해주세요."
  },
  {
    id: "exception-server",
    category: "예외처리",
    label: "서버 오류 처리",
    description: "서버 오류 발생 시 처리 방법",
    tip: "일시적인 오류임을 안내하고 재시도 방법을 제공해주세요."
  },
  {
    id: "exception-validation",
    category: "예외처리",
    label: "유효성 검사 실패 처리",
    description: "입력값 검증 실패 시 처리 방법",
    tip: "어떤 항목이 문제인지 명확히 표시하고 수정 방법을 안내해주세요."
  }
];

const screenTemplates: Record<ScreenType, DescriptionTemplate> = {
  대시보드: {
    정의: "광고 플랫폼의 전체 현황을 한눈에 확인할 수 있는 메인 페이지입니다. 캠페인 성과, 예산 사용률, 주요 지표를 시각화하여 표시합니다.",
    제약사항: [
      "데이터 새로고침: 자동 새로고침 간격 5분, 수동 새로고침 버튼 제공",
      "기간 선택: 최근 7일, 30일, 90일, 사용자 정의 기간 선택 가능",
      "차트 표시: 최대 12개월 데이터 표시",
      "데이터 내보내기: CSV, Excel 형식 지원, 최대 10,000건"
    ],
    데이터: [
      "집계 데이터: 총 노출수, 클릭수, 전환수, 예산 사용률, ROAS",
      "캠페인 데이터: 활성 캠페인 수, 일시정지 캠페인 수, 종료 캠페인 수",
      "실시간 데이터: 현재 진행 중인 캠페인 성과, 오늘 예산 사용률"
    ],
    상태: [
      "로딩 중: 스켈레톤 UI 표시",
      "데이터 있음: 차트 및 지표 카드 표시",
      "데이터 없음: '데이터가 없습니다' 메시지 표시",
      "필터 적용 중: 필터 적용 중 인디케이터 표시"
    ],
    예외처리: [
      "데이터 없음: '선택한 기간에 데이터가 없습니다' 메시지 표시",
      "네트워크 오류: '데이터를 불러올 수 없습니다' 메시지 표시 및 새로고침 버튼",
      "권한 없음: '대시보드 조회 권한이 없습니다' 메시지 표시"
    ]
  },
  "캠페인 관리": {
    정의: "광고 캠페인을 생성, 수정, 관리할 수 있는 페이지입니다. 캠페인 목록 조회, 필터링, 일괄 작업이 가능합니다.",
    제약사항: [
      "캠페인명: 최대 100자, 중복 가능",
      "예산: 최소 1,000원, 최대 100,000,000원",
      "기간: 시작일은 오늘 이후, 종료일은 시작일 이후",
      "일괄 작업: 최대 100개 캠페인 동시 선택 가능",
      "상태 변경: 활성 → 일시정지, 일시정지 → 활성만 가능"
    ],
    데이터: [
      "캠페인 데이터: 캠페인명, 상태, 예산, 기간, 성과 지표",
      "필터 데이터: 상태, 광고주, 생성일, 예산 범위",
      "정렬 데이터: 생성일순, 예산순, 성과순"
    ],
    상태: [
      "로딩 중: 스켈레톤 UI 표시",
      "목록 있음: 캠페인 목록 표시, 체크박스로 선택 가능",
      "목록 없음: '캠페인이 없습니다' 메시지 표시",
      "일괄 작업 모드: 선택된 캠페인 수 표시, 일괄 작업 버튼 활성화"
    ],
    예외처리: [
      "캠페인 없음: '등록된 캠페인이 없습니다' 메시지 표시",
      "예산 초과: '예산 한도를 초과했습니다' 메시지 표시",
      "권한 없음: '캠페인 수정 권한이 없습니다' 메시지 표시",
      "네트워크 오류: '캠페인 정보를 불러올 수 없습니다' 메시지 표시 및 새로고침 버튼"
    ]
  },
  "광고 그룹 관리": {
    정의: "캠페인 내 광고 그룹을 생성하고 관리하는 페이지입니다. 키워드, 입찰가, 광고 소재를 그룹 단위로 관리합니다.",
    제약사항: [
      "그룹명: 최대 50자",
      "입찰가: 최소 10원, 최대 10,000원",
      "키워드 수: 그룹당 최대 1,000개",
      "광고 소재 수: 그룹당 최소 1개, 최대 10개",
      "상태: 상위 캠페인 상태에 따라 자동 변경"
    ],
    데이터: [
      "그룹 데이터: 그룹명, 상태, 입찰가, 키워드 수, 광고 소재 수, 성과",
      "키워드 데이터: 키워드 목록, 매칭 유형, 입찰가",
      "광고 소재 데이터: 소재명, 상태, 승인 상태"
    ],
    상태: [
      "로딩 중: 로딩 인디케이터 표시",
      "그룹 있음: 그룹 목록 표시",
      "그룹 없음: '광고 그룹이 없습니다' 메시지 표시",
      "수정 모드: 입력 필드 활성화, 저장 버튼 표시"
    ],
    예외처리: [
      "그룹 없음: '등록된 광고 그룹이 없습니다' 메시지 표시",
      "입찰가 범위 초과: '입찰가는 10원 이상 10,000원 이하여야 합니다' 메시지 표시",
      "키워드 수 초과: '키워드는 그룹당 최대 1,000개까지 등록 가능합니다' 메시지 표시",
      "권한 없음: '광고 그룹 수정 권한이 없습니다' 메시지 표시"
    ]
  },
  "광고 소재 관리": {
    정의: "광고에 사용되는 소재(이미지, 동영상, 텍스트)를 업로드하고 관리하는 페이지입니다.",
    제약사항: [
      "이미지: 최대 5MB, JPG/PNG 형식, 최소 300x300px",
      "동영상: 최대 50MB, MP4 형식, 최대 30초",
      "텍스트: 제목 최대 30자, 본문 최대 90자",
      "파일 개수: 한 번에 최대 10개 업로드 가능",
      "승인 상태: 업로드 → 검토중 → 승인/반려"
    ],
    데이터: [
      "소재 데이터: 소재명, 타입, 파일 크기, 승인 상태, 사용 중인 그룹",
      "업로드 데이터: 파일, 미리보기, 메타데이터",
      "승인 데이터: 승인 일시, 승인자, 반려 사유"
    ],
    상태: [
      "업로드 중: 진행률 표시, 취소 버튼 활성화",
      "업로드 완료: 미리보기 표시, 승인 대기",
      "승인됨: 승인 배지 표시, 사용 가능",
      "반려됨: 반려 사유 표시, 재업로드 가능"
    ],
    예외처리: [
      "파일 크기 초과: '파일 크기는 이미지 5MB, 동영상 50MB 이하여야 합니다' 메시지 표시",
      "형식 오류: '지원하지 않는 파일 형식입니다' 메시지 표시",
      "해상도 부족: '이미지 해상도는 최소 300x300px 이상이어야 합니다' 메시지 표시",
      "업로드 실패: '파일 업로드에 실패했습니다. 다시 시도해주세요' 메시지 표시"
    ]
  },
  "키워드 관리": {
    정의: "광고 그룹에 사용되는 키워드를 추가, 수정, 삭제하는 페이지입니다. 키워드 제안, 중복 확인 기능을 제공합니다.",
    제약사항: [
      "키워드: 최대 20자, 특수문자 제한",
      "입찰가: 최소 10원, 최대 10,000원",
      "매칭 유형: 정확일치, 구문일치, 광고일치",
      "키워드 수: 그룹당 최대 1,000개",
      "일괄 등록: CSV 파일 업로드 지원, 최대 1,000개"
    ],
    데이터: [
      "키워드 데이터: 키워드명, 매칭 유형, 입찰가, 상태, 성과",
      "제안 데이터: 관련 키워드 목록, 예상 노출수, 경쟁도",
      "중복 데이터: 중복 키워드 목록, 사용 중인 그룹"
    ],
    상태: [
      "조회 중: 로딩 인디케이터 표시",
      "키워드 있음: 키워드 목록 표시, 체크박스로 선택 가능",
      "키워드 없음: '등록된 키워드가 없습니다' 메시지 표시",
      "제안 모드: 키워드 제안 목록 표시, 일괄 추가 가능"
    ],
    예외처리: [
      "키워드 중복: '이미 등록된 키워드입니다' 메시지 표시",
      "키워드 수 초과: '키워드는 그룹당 최대 1,000개까지 등록 가능합니다' 메시지 표시",
      "입찰가 범위 초과: '입찰가는 10원 이상 10,000원 이하여야 합니다' 메시지 표시",
      "CSV 형식 오류: 'CSV 파일 형식이 올바르지 않습니다' 메시지 표시"
    ]
  },
  "리포트/분석": {
    정의: "캠페인, 광고 그룹, 키워드별 성과 데이터를 조회하고 분석할 수 있는 페이지입니다.",
    제약사항: [
      "기간 선택: 최대 1년, 시작일은 종료일 이전",
      "데이터 내보내기: CSV, Excel 형식, 최대 50,000건",
      "차트 표시: 최대 12개월 데이터",
      "필터: 캠페인, 광고 그룹, 키워드, 디바이스, 지역"
    ],
    데이터: [
      "성과 데이터: 노출수, 클릭수, 전환수, 비용, ROAS, CTR",
      "시간대 데이터: 시간대별 성과 분포",
      "디바이스 데이터: PC, 모바일, 태블릿별 성과",
      "지역 데이터: 지역별 성과 분포"
    ],
    상태: [
      "로딩 중: 스켈레톤 UI 표시",
      "데이터 있음: 차트 및 테이블 표시",
      "데이터 없음: '선택한 조건에 데이터가 없습니다' 메시지 표시",
      "내보내기 중: 진행률 표시"
    ],
    예외처리: [
      "데이터 없음: '선택한 기간에 데이터가 없습니다' 메시지 표시",
      "기간 초과: '조회 기간은 최대 1년입니다' 메시지 표시",
      "내보내기 실패: '데이터 내보내기에 실패했습니다' 메시지 표시",
      "권한 없음: '리포트 조회 권한이 없습니다' 메시지 표시"
    ]
  },
  "예산 관리": {
    정의: "캠페인 및 계정 단위의 예산을 설정하고 관리하는 페이지입니다. 예산 사용률 모니터링 및 알림 설정이 가능합니다.",
    제약사항: [
      "일 예산: 최소 1,000원, 최대 100,000,000원",
      "월 예산: 최소 10,000원, 최대 1,000,000,000원",
      "예산 사용률 알림: 50%, 80%, 100% 시점에 알림",
      "예산 조정: 일 예산은 당일부터 적용, 월 예산은 다음 달부터 적용"
    ],
    데이터: [
      "예산 데이터: 설정 예산, 사용 예산, 잔여 예산, 사용률",
      "알림 데이터: 알림 설정 여부, 알림 수신 이메일",
      "이력 데이터: 예산 변경 이력, 변경 사유"
    ],
    상태: [
      "조회 중: 로딩 인디케이터 표시",
      "예산 설정됨: 예산 정보 및 사용률 표시",
      "예산 미설정: '예산이 설정되지 않았습니다' 메시지 표시",
      "수정 모드: 입력 필드 활성화, 저장 버튼 표시"
    ],
    예외처리: [
      "예산 초과: '예산 한도를 초과했습니다' 메시지 표시",
      "예산 부족: '예산이 부족합니다. 예산을 추가해주세요' 메시지 표시",
      "권한 없음: '예산 수정 권한이 없습니다' 메시지 표시",
      "저장 실패: '예산 저장에 실패했습니다. 다시 시도해주세요' 메시지 표시"
    ]
  },
  "권한 관리": {
    정의: "사용자별 권한을 설정하고 관리하는 페이지입니다. 역할 기반 접근 제어(RBAC)를 통해 기능별 권한을 부여합니다.",
    제약사항: [
      "역할: 관리자, 운영자, 광고주, 뷰어 중 선택",
      "권한 범위: 전체, 특정 광고주, 특정 캠페인",
      "권한 항목: 조회, 생성, 수정, 삭제, 승인",
      "사용자 수: 계정당 최대 100명",
      "권한 변경: 즉시 적용, 재로그인 불필요"
    ],
    데이터: [
      "사용자 데이터: 이름, 이메일, 역할, 권한 범위, 상태",
      "권한 데이터: 기능별 권한 목록, 권한 부여 일시",
      "이력 데이터: 권한 변경 이력, 변경자, 변경 사유"
    ],
    상태: [
      "조회 중: 로딩 인디케이터 표시",
      "사용자 있음: 사용자 목록 표시, 권한 정보 표시",
      "사용자 없음: '등록된 사용자가 없습니다' 메시지 표시",
      "수정 모드: 권한 체크박스 활성화, 저장 버튼 표시"
    ],
    예외처리: [
      "권한 없음: '권한 관리 권한이 없습니다' 메시지 표시",
      "자기 자신 권한 변경: '자신의 권한은 변경할 수 없습니다' 메시지 표시",
      "최소 권한 위반: '최소 1명의 관리자가 필요합니다' 메시지 표시",
      "저장 실패: '권한 저장에 실패했습니다. 다시 시도해주세요' 메시지 표시"
    ]
  },
  "계정 관리": {
    정의: "광고주 계정 정보를 생성하고 관리하는 페이지입니다. 계정 정보, 결제 정보, 계약 정보를 관리합니다.",
    제약사항: [
      "계정명: 최대 100자, 중복 불가",
      "사업자등록번호: 10자리 숫자, 형식 검증",
      "대표자명: 최대 20자",
      "연락처: 010-XXXX-XXXX 형식",
      "이메일: 이메일 형식 검증 필수"
    ],
    데이터: [
      "계정 데이터: 계정명, 사업자등록번호, 대표자명, 연락처, 이메일",
      "결제 데이터: 결제 수단, 청구 주소, 세금계산서 정보",
      "계약 데이터: 계약 시작일, 종료일, 계약 금액, 할인율"
    ],
    상태: [
      "조회 중: 로딩 인디케이터 표시",
      "계정 있음: 계정 목록 표시",
      "계정 없음: '등록된 계정이 없습니다' 메시지 표시",
      "수정 모드: 입력 필드 활성화, 저장 버튼 표시"
    ],
    예외처리: [
      "계정명 중복: '이미 사용 중인 계정명입니다' 메시지 표시",
      "사업자등록번호 중복: '이미 등록된 사업자등록번호입니다' 메시지 표시",
      "형식 오류: '입력 형식이 올바르지 않습니다' 메시지 표시",
      "권한 없음: '계정 수정 권한이 없습니다' 메시지 표시"
    ]
  },
  설정: {
    정의: "시스템 전반의 설정을 관리하는 페이지입니다. 알림 설정, 통합 설정, API 설정 등을 관리합니다.",
    제약사항: [
      "알림 설정: 이메일, SMS, 푸시 알림 중 선택",
      "API 키: 최대 5개까지 발급 가능",
      "데이터 보관 기간: 최소 1개월, 최대 24개월",
      "자동 새로고침: 1분, 5분, 10분, 30분 중 선택"
    ],
    데이터: [
      "알림 설정 데이터: 알림 유형, 수신 여부, 수신 이메일/전화번호",
      "API 설정 데이터: API 키 목록, 발급 일시, 만료 일시",
      "시스템 설정 데이터: 데이터 보관 기간, 자동 새로고침 간격"
    ],
    상태: [
      "조회 중: 로딩 인디케이터 표시",
      "설정 있음: 설정 정보 표시",
      "수정 모드: 설정 옵션 활성화, 저장 버튼 표시",
      "저장 중: 저장 버튼 비활성화, 로딩 인디케이터 표시"
    ],
    예외처리: [
      "API 키 초과: 'API 키는 최대 5개까지 발급 가능합니다' 메시지 표시",
      "이메일 형식 오류: '올바른 이메일 형식을 입력해주세요' 메시지 표시",
      "저장 실패: '설정 저장에 실패했습니다. 다시 시도해주세요' 메시지 표시",
      "권한 없음: '설정 변경 권한이 없습니다' 메시지 표시"
    ]
  },
  기타: {
    정의: "사용자 정의 화면입니다. 아래 항목들을 참고하여 작성해주세요.",
    제약사항: [
      "입력 필드: 최소/최대 글자수, 허용 문자 정의",
      "버튼: 활성/비활성 조건 정의",
      "이미지: 파일 크기, 형식, 최대 개수 정의"
    ],
    데이터: [
      "입력 데이터: 사용자가 입력하는 데이터 정의",
      "조회 데이터: 서버에서 가져오는 데이터 정의",
      "저장 데이터: 저장되는 데이터 정의"
    ],
    상태: [
      "초기 상태: 페이지 진입 시 상태",
      "로딩 상태: 데이터 로딩 중 상태",
      "성공 상태: 작업 완료 후 상태",
      "에러 상태: 에러 발생 시 상태"
    ],
    예외처리: [
      "네트워크 오류: 네트워크 연결 실패 시 처리 방법",
      "서버 오류: 서버 오류 발생 시 처리 방법",
      "유효성 검사 실패: 입력값 검증 실패 시 처리 방법"
    ]
  }
};

export function DesignDescriptionGenerator() {
  const [selectedScreenType, setSelectedScreenType] = useState<ScreenType>("대시보드");
  const [customDefinition, setCustomDefinition] = useState("");
  const [itemRelevance, setItemRelevance] = useState<Map<string, "yes" | "no" | null>>(new Map());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRelevanceChange = (id: string, value: "yes" | "no") => {
    const newRelevance = new Map(itemRelevance);
    newRelevance.set(id, value);
    setItemRelevance(newRelevance);

    // "아니오" 선택 시 체크박스 해제
    if (value === "no") {
      const newChecked = new Set(checkedItems);
      newChecked.delete(id);
      setCheckedItems(newChecked);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    // 해당 항목이 "예"로 선택되어 있을 때만 체크 가능
    if (itemRelevance.get(id) !== "yes") {
      return;
    }

    const newChecked = new Set(checkedItems);
    if (checked) {
      newChecked.add(id);
    } else {
      newChecked.delete(id);
    }
    setCheckedItems(newChecked);
  };

  const getCheckedCount = () => {
    return checkedItems.size;
  };

  const getTotalCount = () => {
    // 질문이 필요한 항목은 "예"로 선택된 것만, 질문이 필요 없는 항목은 모두 카운트
    let count = 0;
    commonChecklist.forEach(item => {
      if (item.requiresQuestion) {
        if (itemRelevance.get(item.id) === "yes") {
          count++;
        }
      } else {
        count++;
      }
    });
    return count;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    
    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const template = screenTemplates[selectedScreenType];
    const definition = selectedScreenType === "기타" && customDefinition 
      ? customDefinition 
      : template.정의;

    let description = `## 정의\n${definition}\n\n`;
    
    description += `## 제약사항\n`;
    template.제약사항.forEach((item, idx) => {
      description += `${idx + 1}. ${item}\n`;
    });
    description += `\n`;

    description += `## 데이터\n`;
    template.데이터.forEach((item, idx) => {
      description += `${idx + 1}. ${item}\n`;
    });
    description += `\n`;

    description += `## 상태\n`;
    template.상태.forEach((item, idx) => {
      description += `${idx + 1}. ${item}\n`;
    });
    description += `\n`;

    description += `## 예외처리\n`;
    template.예외처리.forEach((item, idx) => {
      description += `${idx + 1}. ${item}\n`;
    });

    setResult(description);
    setIsLoading(false);

    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert("디스크립션이 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">설계서 작성기</h1>
          <p className="text-muted-foreground mb-6">
            화면 타입을 선택하면 설계서 디스크립션 샘플을 자동으로 생성합니다.
          </p>
        </div>

        {/* 체크리스트 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>작성 체크리스트</CardTitle>
                <CardDescription>
                  디스크립션 작성 시 확인해야 할 항목들을 체크하세요 ({getCheckedCount()}/{getTotalCount()})
                </CardDescription>
              </div>
              <div className={cn(
                "text-sm font-medium",
                getCheckedCount() === getTotalCount() ? "text-green-600" : "text-muted-foreground"
              )}>
                {getCheckedCount() === getTotalCount() ? "✓ 완료" : `${getTotalCount() - getCheckedCount()}개 남음`}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["데이터", "상태", "제약사항", "예외처리"].map((category) => {
                const categoryItems = commonChecklist.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-sm text-foreground">{category}</h3>
                    <div className="space-y-3">
                      {categoryItems.map((item) => {
                        const relevance = itemRelevance.get(item.id);
                        const isRelevant = relevance === "yes";
                        const isNotRelevant = relevance === "no";
                        const requiresQuestion = item.requiresQuestion || false;
                        
                        // 질문이 필요 없는 항목은 바로 체크박스 표시
                        if (!requiresQuestion) {
                          return (
                            <div key={item.id} className="flex items-start gap-3 border rounded-lg p-3">
                              <Checkbox
                                id={item.id}
                                checked={checkedItems.has(item.id)}
                                onCheckedChange={(checked) => {
                                  const newChecked = new Set(checkedItems);
                                  if (checked) {
                                    newChecked.add(item.id);
                                  } else {
                                    newChecked.delete(item.id);
                                  }
                                  setCheckedItems(newChecked);
                                }}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={item.id}
                                  className="text-sm font-medium cursor-pointer leading-tight block"
                                >
                                  {item.label}
                                </label>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                                {item.tip && (
                                  <p className="text-xs text-blue-600 mt-1 font-medium">
                                    💡 {item.tip}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        
                        // 질문이 필요한 항목은 질문 후 체크박스 표시
                        return (
                          <div key={item.id} className="border rounded-lg p-4 bg-muted/30">
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">
                                {item.question || `이 페이지에 ${item.label}이(가) 필요한가요?`}
                              </p>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`relevance-${item.id}`}
                                    checked={relevance === "yes"}
                                    onChange={() => handleRelevanceChange(item.id, "yes")}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">예</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`relevance-${item.id}`}
                                    checked={relevance === "no"}
                                    onChange={() => handleRelevanceChange(item.id, "no")}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm">아니오</span>
                                </label>
                              </div>
                            </div>

                            {isRelevant && (
                              <div className="flex items-start gap-3 pt-3 border-t">
                                <Checkbox
                                  id={item.id}
                                  checked={checkedItems.has(item.id)}
                                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                                  className="mt-0.5"
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor={item.id}
                                    className="text-sm font-medium cursor-pointer leading-tight block"
                                  >
                                    {item.label} 작성 완료 체크
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                  {item.tip && (
                                    <p className="text-xs text-blue-600 mt-1 font-medium">
                                      💡 {item.tip}
                                  </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {isNotRelevant && (
                              <div className="pt-3 border-t">
                                <p className="text-xs text-muted-foreground italic">
                                  이 항목은 이 페이지에 해당하지 않으므로 작성하지 않아도 됩니다.
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 화면 타입 선택 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>화면 타입 선택</CardTitle>
            <CardDescription>
              생성할 설계서의 화면 타입을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              {([
                "대시보드",
                "캠페인 관리",
                "광고 그룹 관리",
                "광고 소재 관리",
                "키워드 관리",
                "리포트/분석",
                "예산 관리",
                "권한 관리",
                "계정 관리",
                "설정",
                "기타",
              ] as ScreenType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedScreenType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedScreenType(type)}
                  className="text-xs"
                >
                  {type}
                </Button>
              ))}
            </div>

            {selectedScreenType === "기타" && (
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">화면 정의 (선택사항)</label>
                <Textarea
                  value={customDefinition}
                  onChange={(e) => setCustomDefinition(e.target.value)}
                  placeholder="예: 상품 리뷰 작성 페이지, 공지사항 상세 페이지 등"
                  className="min-h-[100px]"
                />
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              size="lg"
              className="w-full mt-4"
            >
              {isLoading ? "생성 중..." : "디스크립션 생성하기"}
            </Button>
          </CardContent>
        </Card>

        {/* 결과 표시 */}
        {result && (
          <Card ref={resultRef} id="result">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>생성된 디스크립션</CardTitle>
                  <CardDescription>
                    아래 내용을 복사하여 설계서에 사용하세요
                  </CardDescription>
                </div>
                <Button onClick={handleCopy} variant="outline" size="sm">
                  전체 복사
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                  {result}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

