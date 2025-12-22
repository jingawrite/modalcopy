import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Hash } from "lucide-react";
import { cn } from "./ui/utils";

interface Tool {
  name: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
  favorite?: boolean; // 자주 쓰는 도구 표시
}

const tools: Tool[] = [
  // 프로젝트 관리
  {
    name: "Notion",
    description: "올인원 워크스페이스 및 문서 관리",
    url: "https://notion.so",
    category: "프로젝트 관리",
    favorite: true,
  },
  {
    name: "Jira",
    description: "애자일 프로젝트 관리 및 이슈 추적",
    url: "https://www.atlassian.com/software/jira",
    category: "프로젝트 관리",
    favorite: true,
  },
  {
    name: "Trello",
    description: "칸반 보드 방식의 프로젝트 관리 도구",
    url: "https://trello.com",
    category: "프로젝트 관리",
  },
  {
    name: "Asana",
    description: "팀 협업 및 작업 관리 플랫폼",
    url: "https://asana.com",
    category: "프로젝트 관리",
  },
  
  // 디자인 & 프로토타이핑
  {
    name: "Figma",
    description: "협업 UI/UX 디자인 도구",
    url: "https://figma.com",
    category: "디자인 & 프로토타이핑",
    favorite: true,
  },
  {
    name: "Framer",
    description: "인터랙티브 프로토타이핑 도구",
    url: "https://framer.com",
    category: "디자인 & 프로토타이핑",
  },
  {
    name: "Adobe XD",
    description: "UX 디자인 및 프로토타이핑",
    url: "https://www.adobe.com/products/xd.html",
    category: "디자인 & 프로토타이핑",
  },
  {
    name: "Sketch",
    description: "벡터 기반 디자인 도구",
    url: "https://www.sketch.com",
    category: "디자인 & 프로토타이핑",
  },
  {
    name: "shadcn/ui",
    description: "재사용 가능한 컴포넌트 라이브러리",
    url: "https://ui.shadcn.com/docs/components",
    category: "디자인 & 프로토타이핑",
  },
  
  // 문서 & 협업
  {
    name: "Google Docs",
    description: "온라인 문서 편집 및 협업",
    url: "https://docs.google.com",
    category: "문서 & 협업",
  },
  {
    name: "Confluence",
    description: "팀 지식 관리 및 문서화",
    url: "https://www.atlassian.com/software/confluence",
    category: "문서 & 협업",
  },
  {
    name: "Miro",
    description: "온라인 화이트보드 및 브레인스토밍",
    url: "https://miro.com",
    category: "문서 & 협업",
  },
  {
    name: "Mural",
    description: "디지털 워크스페이스 및 협업",
    url: "https://www.mural.co",
    category: "문서 & 협업",
  },
  
  // 사용자 리서치
  {
    name: "UserTesting",
    description: "사용자 테스팅 및 피드백 수집",
    url: "https://www.usertesting.com",
    category: "사용자 리서치",
  },
  {
    name: "Hotjar",
    description: "사용자 행동 분석 및 히트맵",
    url: "https://www.hotjar.com",
    category: "사용자 리서치",
  },
  {
    name: "Typeform",
    description: "인터랙티브 설문 및 폼 작성",
    url: "https://www.typeform.com",
    category: "사용자 리서치",
  },
  {
    name: "SurveyMonkey",
    description: "온라인 설문조사 플랫폼",
    url: "https://www.surveymonkey.com",
    category: "사용자 리서치",
  },
  
  // 분석 & 데이터
  {
    name: "Google Analytics",
    description: "웹사이트 트래픽 분석",
    url: "https://analytics.google.com",
    category: "분석 & 데이터",
    favorite: true,
  },
  {
    name: "Google Search Console",
    description: "웹사이트 검색 성능 모니터링 및 관리",
    url: "https://search.google.com/search-console",
    category: "분석 & 데이터",
    favorite: true,
  },
  {
    name: "Mixpanel",
    description: "제품 분석 및 이벤트 추적",
    url: "https://mixpanel.com",
    category: "분석 & 데이터",
  },
  {
    name: "Amplitude",
    description: "제품 분석 및 사용자 여정 분석",
    url: "https://amplitude.com",
    category: "분석 & 데이터",
  },
  
  // 개발 협업
  {
    name: "GitHub",
    description: "코드 저장소 및 버전 관리",
    url: "https://github.com",
    category: "개발 협업",
    favorite: true,
  },
  {
    name: "GitLab",
    description: "DevOps 플랫폼 및 코드 저장소",
    url: "https://about.gitlab.com",
    category: "개발 협업",
  },
  {
    name: "Linear",
    description: "이슈 추적 및 프로젝트 관리",
    url: "https://linear.app",
    category: "개발 협업",
  },
];

const categories = [
  "프로젝트 관리",
  "디자인 & 프로토타이핑",
  "문서 & 협업",
  "사용자 리서치",
  "분석 & 데이터",
  "개발 협업",
];

// 기획약국 페이지에서 홈으로 돌아가기 버튼 추가
interface ToolDashboardProps {
  onNavigateHome?: () => void;
  onNavigateToSymbols?: () => void;
}

export function ToolDashboard({ onNavigateHome, onNavigateToSymbols }: ToolDashboardProps) {
  const getToolsByCategory = (category: string) => {
    const categoryTools = tools.filter((tool) => tool.category === category);
    // 자주 쓰는 도구를 상단으로 정렬
    return categoryTools.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">기획약국</h1>
          <p className="text-muted-foreground mb-4">
            기획자들이 자주 사용하는 도구들을 한눈에 찾아보세요
          </p>
          {onNavigateToSymbols && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToSymbols}
              className="flex items-center gap-2"
            >
              <Hash className="size-4" />
              특수기호 모음 바로가기
            </Button>
          )}
        </div>

        {/* Trello 스타일 보드 레이아웃 - 가로 스크롤 */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category);
            if (categoryTools.length === 0) return null;

            return (
              <div
                key={category}
                className="flex-shrink-0 w-80 flex flex-col"
              >
                {/* 컬럼 헤더 */}
                <div className="mb-4 bg-muted/50 rounded-lg p-3 sticky top-0 z-10 backdrop-blur-sm">
                  <h2 className="text-base font-semibold text-foreground mb-1">
                    {category}
                  </h2>
                  <div className="text-xs text-muted-foreground">
                    {categoryTools.length}개 도구
                  </div>
                </div>

                {/* 카드 리스트 */}
                <div className="space-y-3 flex-1 min-h-[200px]">
                  {categoryTools.map((tool) => (
                    <Card
                      key={tool.name}
                      className={cn(
                        "hover:shadow-md transition-all hover:border-primary/50 cursor-pointer",
                        tool.favorite 
                          ? "bg-muted/30 border-primary/20 shadow-sm" 
                          : "bg-white"
                      )}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base leading-tight">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(tool.url, "_blank");
                            }}
                          >
                            바로가기
                            <ExternalLink className="size-3" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

