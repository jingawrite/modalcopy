import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";
import { cn } from "./ui/utils";

export type PlanningProcess = 
  | "문제 정의"
  | "요구사항 분석"
  | "상위 기획"
  | "상세 기획"
  | "개발 중 커뮤니케이션"
  | "QA 검증"
  | "서비스 오픈";

interface Tip {
  category: string;
  content: string;
  link?: string;
  process: PlanningProcess;
}

const planningTips: Tip[] = [
  // 문제 정의
  {
    category: "사용자 관찰",
    content: "• '사용자가 말하는 문제'와 '실제로 겪는 문제'가 다를 수 있으므로 행동 관찰이 중요\n• 사용자 인터뷰, 현장 관찰, 사용자 여정 맵핑 등을 통해 실제 사용 맥락에서 문제 발견\n• 가정보다는 데이터를 믿고, 정량적 데이터와 정성적 데이터를 함께 고려",
    process: "문제 정의",
  },
  {
    category: "데이터 분석",
    content: "• Google Analytics, Mixpanel, Amplitude 등으로 이탈률이 높은 구간, 사용하지 않는 기능, 에러 발생 빈도 분석\n• 문제의 근본 원인을 파악하기 위해 정량적 데이터와 정성적 데이터를 함께 고려",
    process: "문제 정의",
    link: "https://analytics.google.com",
  },

  // 요구사항 분석
  {
    category: "우선순위 설정",
    content: "• MoSCoW 방법론 활용: Must(반드시), Should(가능하면), Could(여유있으면), Won't(이번엔 안함)\n• 비즈니스 임팩트와 개발 난이도를 함께 고려하여 우선순위 결정",
    process: "요구사항 분석",
  },
  {
    category: "기술적 제약사항 확인",
    content: "• 기존 시스템 아키텍처, 사용 중인 기술 스택, 성능 요구사항, 보안 정책 등을 미리 확인\n• 요구사항이 기술적으로 실현 가능한지 검토하고, 불가능한 경우 대안을 함께 논의",
    process: "요구사항 분석",
  },

  // 상위 기획
  {
    category: "기능 범위 정의",
    content: "• MVP 범위: 핵심 가치를 전달하는 최소한의 기능만 포함\n• '있으면 좋지만 없어도 되는' 기능은 제외하고, 이후 버전에서 추가할 기능은 백로그로 관리",
    process: "상위 기획",
  },
  {
    category: "성공 지표 설정",
    content: "• 정량적 지표(사용자 증가율, 활성 사용자 수, 전환율, 이탈률)와 정성적 지표(사용자 만족도, NPS) 함께 설정\n• 각 지표의 측정 방법과 목표값을 명확히 하고, 대시보드를 구축하여 지속적으로 모니터링",
    process: "상위 기획",
  },

  // 상세 기획
  {
    category: "기획서 구성 요소",
    content: "• 기획서(스토리보드) 구성: 시작하기 → 서비스 개요 → IA → 주요 서비스 프로세스 → 메뉴트리 → 공통 규칙\n• 서비스 개요: 프로젝트 배경, 목적, 목표 사용자, 핵심 기능 등 서비스 전반에 대한 설명\n• 주요 서비스 프로세스: 사용자가 서비스를 이용하는 핵심 플로우를 단계별로 정리\n• 메뉴트리: 서비스의 전체 메뉴 구조와 네비게이션 구조를 트리 형태로 표현\n• 공통 규칙: 서비스 전반에 적용되는 공통 UI/UX 규칙, 에러 처리 규칙 등",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "IA(Information Architecture) 작성",
    content: "• IA는 기획자의 설계 구조를 전반적으로 정리하는 문서로, 상세 기획 전 필수 단계\n• 프로세스에 따라 depth를 설정하고 해당 단계에서 할 수 있는 행위를 정리하는데 초점\n• 겹치지 않으면서 빠짐없이 나누는 방법을 염두에 두고 작성\n• 구성요소: Role(권한/역할), Type(플랫폼), Depth(진입 단계), Component(구성요소), Description(개요), Featured(기능), Data(활용 데이터), Comment(비고)",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "IA 작성 - Role(권한/역할)",
    content: "• 서비스를 이용하는 큰 단위의 역할 작성 (시스템 관리자, 일반 관리자, 사용자 등)\n• B2B 서비스에서는 클라이언트, 영업 담당자, 회계 담당자 등 여러 유형 존재 가능\n• 서비스의 권한이 어떤 형태로 구분되며 각 권한별 역할을 설계할 수 있음",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "IA 작성 - Depth(진입 단계)",
    content: "• 사용자가 서비스에 진입하는 단계를 명확히 정의\n• 예: 비회원 → 회원가입 → 로그인 → 메인 화면 → 상세 기능\n• 각 depth에서 할 수 있는 행위와 다음 단계로 넘어가는 조건을 명시",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "IA 작성 - Data(활용 데이터)",
    content: "• 각 단계에서 생성, 조회, 수정, 삭제되는 데이터를 명시\n• 데이터의 흐름을 선행 검토하여 데이터가 어디에서 생성되고 가공되는지 누락 방지\n• 데이터베이스 설계 시 참고 자료로 활용",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "IA 작성 목표",
    content: "• 기획자: 전체적인 설계 정리, 설계 결과에 대한 흐름 검토, 데이터 흐름 선행 검토, 상세 기획 요소 1차 정리\n• 협업자: 구현해야 하는 기능 선행 검토, 기능 검토에 따른 일정 산출 용이",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/3",
  },
  {
    category: "주요 서비스 프로세스 작성",
    content: "• IA를 기반으로 서비스의 주요 기능 및 제공되는 컨텐츠 등을 도식화하는 단계\n• 사용자의 동선에 따른 큰 단위의 도식화를 초점으로 작성\n• 서비스 전반에 대한 흐름을 디자이너/개발자가 가시적으로 확인할 수 있도록 유도\n• 이 과정을 통해 추후 메뉴 트리 설계에 있어 자연스러운 흐름을 선행하여 기획 가능",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/5",
  },
  {
    category: "프로세스 작성 시 주의사항",
    content: "• 사용자의 동선에 따라 수립\n• 권한에 따른 프로세스 분기는 적용하되 '기능'에 대한 분기는 처리하지 않음 (기능 분기는 상세 기획에서 Flow Chart로 명시)\n• 역할이 명확히 구분될 수 있도록 작성\n• 조건문(IF)에 따른 분기는 상세 기획서 내 Flow Chart에서 처리\n• 보다 깊은(deep) 프로세스 설명이 필요한 경우 별도로 분리\n• 프로세스 내 알림 등 부가적인 사항도 가능한 추가 (시스템 설계가 보다 용이해짐)",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/5",
  },
  {
    category: "프로세스 작성 원칙",
    content: "• 프로세스의 단위는 정해져 있지 않음 - 보는 사람이 이해할 수 있는 단위라면 세분화되거나 통합되어도 무방\n• 궁극적인 목표는 서비스 전반에 대한 흐름을 이해할 수 있도록 하는 것\n• IA는 기능 하나하나에 대한 정의, 프로세스 정의서는 해당 기능들이 동작하는 흐름을 보여줌\n• 이 과정에서 IA가 수정될 수 있음",
    process: "상세 기획",
    link: "https://smkdir.tistory.com/5",
  },
  {
    category: "기획안 히스토리 관리",
    content: "• 버전별로 업데이트 내용을 기록: 'v1.1: 3페이지 로그인 플로우 수정, 5페이지 결제 화면 추가'\n• 특정 버전으로 돌아가야 하는 경우를 대비해 꼼꼼하게 관리",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "작업 담당자 명시",
    content: "• 서비스 출시 후 개선 시 기획자와 개발자를 찾기 쉽도록 각 프로젝트 부서 담당자를 기입\n• 대부분 이직하는 경우가 많기 때문에 문서화가 중요",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "Flow Chart 작성",
    content: "• 단계별 진행이 필요한 기능이나 case별로 보여주는 화면이 달라지는 서비스의 경우 Flow Chart 삽입\n• 처음 작성할 때에는 너무 상세하게 적지 말고, 파일크기/형식 등은 각각의 마름모로 만들어 프로세스를 분리\n• 상세한 내용은 Flow Chart가 아닌 상세 기획안에 작성",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "화면 구성 및 Description",
    content: "• Description에는 개발자가 작업해야 할 사항 작성 (예: 버튼 클릭 시 로그인 페이지로 현재 창 이동)\n• 담당 디자이너가 주니어일 경우 디자인 관련 요청사항도 세부적으로 명시\n• 하나의 화면에서 설명해야 할 내용이 많을 경우, 장표를 복사하여 화면을 동일하게 두고 description을 이어서 작성",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "화면 구성 시 주의사항",
    content: "• 기획안에 디자인을 하지 말고, 이것은 버튼, 이것은 상품 이미지 이런 식으로 개발자와 디자이너가 이해할 수 있을 정도면 충분\n• 모노톤으로 작업하여 디자이너가 색상에 구애받지 않도록 함\n• 모바일 앱 화면처럼 세로로 긴 경우에는 전체 구성을 보여주고 각 section대로 분리하여 설명 (header 설명, banner 설명, footer 설명)",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "문서 도구 선택",
    content: "• 파워포인트나 구글독스를 통해 구글 텍스트 검색이 가능한 경우 개발자들이 선호\n• PDF나 이미지 형식은 검색이 어려워 개발자들이 특정 내용을 찾기 어려움\n• 협업이 필요한 경우 구글독스나 Notion을 활용하면 실시간으로 댓글과 피드백을 주고받을 수 있어 효율적",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },
  {
    category: "에러 케이스 정의",
    content: "• 네트워크 오류, 서버 오류, 입력값 오류, 권한 오류 등 각 에러 상황별로 사용자에게 보여줄 메시지와 다음 액션을 명확히 정의\n• 예: '네트워크 오류 시: 재시도 버튼 표시 및 3초 후 자동 재시도' 형식으로 작성",
    process: "상세 기획",
  },
  {
    category: "벤치마킹 활용",
    content: "• 백지 상태에서 상세 기획안을 작성하기 어려울 경우, 벤치마킹한 타사 사이트의 페이지를 참고\n• 참고한 사이트를 명시: '이마트몰 상품 리뷰 페이지 참고' 형식으로 명시하면 디자이너와 개발자가 참고 가능\n• 단순히 복사하는 것이 아니라 우리 서비스에 맞게 개선점을 함께 제시",
    process: "상세 기획",
    link: "https://chaeaoh.tistory.com/7",
  },

  // 개발 중 커뮤니케이션
  {
    category: "개발 일정 산정 - Task 작성",
    content: "• 기획/디자인을 확인하고 구현해야 하는 Task 작성\n• Task 카테고리 분류: 설계, 검토, 개발(코딩), 테스트, 프로덕션 오픈\n• 카테고리별 세부 Task는 구체적이고 단위적으로 진행 가능한 범위로 잘개 쪼개기\n• 예: '결제 페이지 마크업' (0.25MD), '결제 API 연동' (0.5MD)처럼 구체적으로",
    process: "개발 중 커뮤니케이션",
    link: "https://limheejin.tistory.com/160",
  },
  {
    category: "개발 일정 산정 - 시간 예측",
    content: "• 각 Task별로 아무런 방해가 없다고 가정하고 버퍼 없이 실제 소요 시간 예측\n• 비슷한 작업 경험이 있다면 과거 경험을 바탕으로 근사치 예측\n• 처음 해보는 작업이라면 상상으로 예측하되 보수적으로 산정\n• 모든 Task의 예측 시간을 합산 (예: 총 200시간)",
    process: "개발 중 커뮤니케이션",
    link: "https://limheejin.tistory.com/160",
  },
  {
    category: "개발 일정 산정 - 실제 업무 시간 계산",
    content: "• 한달~몇달간 업무외 소모시간(정기 미팅, 면접, 행사 등)을 모두 합산하여 일수로 나누기\n• 일평균 업무외 소모시간 계산 (예: 1시간 30분)\n• 하루 평균 컨텍스트 스위칭 및 휴식시간 계산 (예: 1시간)\n• 실제 하루 업무 가능 시간 = 8시간 - 업무외 시간 - 컨텍스트 스위칭 시간 (예: 5시간 30분)",
    process: "개발 중 커뮤니케이션",
    link: "https://limheejin.tistory.com/160",
  },
  {
    category: "개발 일정 산정 - 최종 일정 산출",
    content: "• 산정한 총 시간에 버퍼 곱하기 (보통 1.4배, 예: 200시간 × 1.4 = 240시간)\n• 총 필요 시간 ÷ 하루 평균 업무 가능 시간 = 필요 일수 계산 (예: 240 ÷ 5.5 = 43.63일)\n• 평일 기준으로 시작날짜부터 계산하고, 휴일은 제외\n• 단계별 세부 일정 설정: 설계/요구사항 분석 기간, 개발 기간, 테스트 기간, 프로덕션 준비 및 오픈 기간",
    process: "개발 중 커뮤니케이션",
    link: "https://limheejin.tistory.com/160",
  },
  {
    category: "개발 일정 산정 - 진행상황 관리",
    content: "• 시작 날짜부터 계획한 단계별로 Task를 하나씩 완료해 나가기\n• 매주 자신이 진행한 업무의 진행상황을 체크\n• 1주 또는 2주 단위로 진행상황이 현저하게 느려지거나 전체 일정에 변화를 줄만한 이슈가 생기는지 확인\n• 리드(PM)와 팀원들에게 즉시 공유하고 일정 조정 논의",
    process: "개발 중 커뮤니케이션",
    link: "https://limheejin.tistory.com/160",
  },
  {
    category: "변경사항 문서화",
    content: "• 요구사항 변경 시 즉시 문서화하고 모든 이해관계자에게 공유\n• 변경 사유, 변경 내용, 영향 범위, 일정 변경 여부를 명확히 기록\n• 기획안 버전을 업데이트하고 변경 히스토리를 관리",
    process: "개발 중 커뮤니케이션",
  },
  {
    category: "코드 리뷰 참여",
    content: "• 사용자 플로우, 비즈니스 로직, 에러 처리 등이 기획 의도대로 구현되었는지 검토\n• 문제가 발견되면 구체적인 피드백을 제공하고, 개발자와 함께 해결 방안을 논의",
    process: "개발 중 커뮤니케이션",
  },

  // QA 검증
  {
    category: "사용성 테스트",
    content: "• 5-8명의 사용자와 함께 테스트를 진행하고, 사용자가 자연스럽게 사용할 수 있도록 최소한의 가이드만 제공\n• 사용자의 행동, 어려움, 피드백을 기록하고, 개선점을 도출\n• 사용성 테스트는 개발 초기 단계부터 진행하는 것이 효과적",
    process: "QA 검증",
  },
  {
    category: "에러 로그 확인",
    content: "• Sentry, Datadog 등의 도구를 활용하여 에러를 모니터링하고, 에러 발생 빈도와 영향 범위를 분석\n• 심각한 에러는 즉시 개발팀에 전달하고, 우선순위에 따라 해결 일정을 조율",
    process: "QA 검증",
  },

  // 서비스 오픈
  {
    category: "롤아웃 계획",
    content: "• 10% → 50% → 100% 순서로 점진적으로 롤아웃하거나, 특정 지역이나 사용자 그룹부터 시작\n• 각 단계에서 모니터링을 통해 문제가 없는지 확인하고, 문제가 발생하면 즉시 롤백할 수 있도록 준비\n• 롤아웃 일정과 체크리스트를 사전에 공유",
    process: "서비스 오픈",
  },
  {
    category: "모니터링 설정",
    content: "• 사용자 수, 활성 사용자, 전환율, 에러율 등 핵심 지표를 실시간으로 확인할 수 있도록 대시보드 구성\n• 이상 징후가 감지되면 즉시 알림을 받을 수 있도록 설정\n• 오픈 당일에는 실시간으로 모니터링하며 문제가 발생하면 즉시 대응",
    process: "서비스 오픈",
    link: "https://analytics.google.com",
  },
];

const processes: PlanningProcess[] = [
  "문제 정의",
  "요구사항 분석",
  "상위 기획",
  "상세 기획",
  "개발 중 커뮤니케이션",
  "QA 검증",
  "서비스 오픈",
];

export function PlanningCompass() {
  const [selectedProcess, setSelectedProcess] = useState<PlanningProcess | null>(null);

  const filteredTips = selectedProcess
    ? planningTips.filter((tip) => tip.process === selectedProcess)
    : planningTips;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">기획나침반</h1>
          <p className="text-muted-foreground mb-6">
            기획 프로세스별 꿀팁을 확인하고, 각 단계를 클릭하면 해당 단계의 꿀팁만 필터링됩니다.
          </p>

          {/* 프로세스 선택 버튼 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedProcess === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProcess(null)}
            >
              전체 보기
            </Button>
            {processes.map((process) => (
              <Button
                key={process}
                variant={selectedProcess === process ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProcess(process)}
              >
                {process}
              </Button>
            ))}
          </div>

          {/* 선택된 프로세스 표시 */}
          {selectedProcess && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                현재 필터: <span className="font-bold">{selectedProcess}</span>
              </p>
            </div>
          )}
        </div>

        {/* 꿀팁 표 */}
        <Card>
          <CardHeader>
            <CardTitle>기획 프로세스별 꿀팁</CardTitle>
            <CardDescription>
              {selectedProcess
                ? `${selectedProcess} 단계의 꿀팁 ${filteredTips.length}개`
                : `전체 꿀팁 ${filteredTips.length}개`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">구분</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead className="w-[100px]">링크</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      해당 프로세스의 꿀팁이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTips.map((tip, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit">
                            {tip.process}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {tip.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ul className="text-sm leading-relaxed space-y-1.5 list-none pl-0">
                          {tip.content.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span>{line.replace(/^•\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {tip.link ? (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8"
                          >
                            <a
                              href={tip.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              링크
                              <ExternalLink className="size-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

