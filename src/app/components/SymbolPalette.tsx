import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "./ui/utils";

interface Symbol {
  symbol: string;
  name: string;
  description?: string;
  category: string;
}

const symbols: Symbol[] = [
  // 체크/엑스
  {
    symbol: "✓",
    name: "체크",
    description: "완료/확인",
    category: "체크/엑스",
  },
  {
    symbol: "✗",
    name: "엑스",
    description: "취소/거부",
    category: "체크/엑스",
  },
  {
    symbol: "✘",
    name: "엑스 (굵게)",
    description: "취소/거부",
    category: "체크/엑스",
  },
  {
    symbol: "☑",
    name: "체크박스 (체크됨)",
    description: "선택 완료",
    category: "체크/엑스",
  },
  {
    symbol: "☐",
    name: "체크박스 (빈)",
    description: "선택 안됨",
    category: "체크/엑스",
  },

  // 네모
  {
    symbol: "■",
    name: "검은 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "□",
    name: "흰 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▪",
    name: "작은 검은 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▫",
    name: "작은 흰 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▣",
    name: "체크 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▤",
    name: "가로선 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▥",
    name: "세로선 네모",
    description: "글머리 기호",
    category: "네모",
  },
  {
    symbol: "▦",
    name: "격자 네모",
    description: "글머리 기호",
    category: "네모",
  },

  // 원
  {
    symbol: "●",
    name: "검은 원",
    description: "글머리 기호",
    category: "원",
  },
  {
    symbol: "○",
    name: "흰 원",
    description: "글머리 기호",
    category: "원",
  },
  {
    symbol: "◉",
    name: "이중 원",
    description: "글머리 기호",
    category: "원",
  },
  {
    symbol: "◯",
    name: "큰 흰 원",
    description: "글머리 기호",
    category: "원",
  },
  {
    symbol: "◎",
    name: "이중 원 (점)",
    description: "글머리 기호",
    category: "원",
  },

  // 화살표
  {
    symbol: "→",
    name: "오른쪽 화살표",
    description: "방향/프로세스",
    category: "화살표",
  },
  {
    symbol: "←",
    name: "왼쪽 화살표",
    description: "방향/프로세스",
    category: "화살표",
  },
  {
    symbol: "↑",
    name: "위 화살표",
    description: "방향/프로세스",
    category: "화살표",
  },
  {
    symbol: "↓",
    name: "아래 화살표",
    description: "방향/프로세스",
    category: "화살표",
  },
  {
    symbol: "⇒",
    name: "오른쪽 이중 화살표",
    description: "결과/의미",
    category: "화살표",
  },
  {
    symbol: "⇐",
    name: "왼쪽 이중 화살표",
    description: "결과/의미",
    category: "화살표",
  },
  {
    symbol: "⇔",
    name: "양방향 화살표",
    description: "상호작용",
    category: "화살표",
  },
  {
    symbol: "↔",
    name: "양방향 화살표 (단일)",
    description: "상호작용",
    category: "화살표",
  },

  // 별
  {
    symbol: "★",
    name: "검은 별",
    description: "중요/강조",
    category: "별",
  },
  {
    symbol: "☆",
    name: "흰 별",
    description: "중요/강조",
    category: "별",
  },
  {
    symbol: "✦",
    name: "작은 별",
    description: "중요/강조",
    category: "별",
  },
  {
    symbol: "✧",
    name: "작은 흰 별",
    description: "중요/강조",
    category: "별",
  },

  // 주의/참고
  {
    symbol: "※",
    name: "주의",
    description: "주의사항 표시",
    category: "주의/참고",
  },
  {
    symbol: "※※",
    name: "이중 주의",
    description: "중요 주의사항",
    category: "주의/참고",
  },
  {
    symbol: "※※※",
    name: "삼중 주의",
    description: "매우 중요",
    category: "주의/참고",
  },
  {
    symbol: "※",
    name: "참고",
    description: "참고사항",
    category: "주의/참고",
  },

  // 원 숫자
  {
    symbol: "①",
    name: "원 숫자 1",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "②",
    name: "원 숫자 2",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "③",
    name: "원 숫자 3",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "④",
    name: "원 숫자 4",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑤",
    name: "원 숫자 5",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑥",
    name: "원 숫자 6",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑦",
    name: "원 숫자 7",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑧",
    name: "원 숫자 8",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑨",
    name: "원 숫자 9",
    description: "번호 표시",
    category: "원 숫자",
  },
  {
    symbol: "⑩",
    name: "원 숫자 10",
    description: "번호 표시",
    category: "원 숫자",
  },

  // 괄호
  {
    symbol: "【】",
    name: "대괄호",
    description: "강조 표시",
    category: "괄호",
  },
  {
    symbol: "『』",
    name: "이중 대괄호",
    description: "강조 표시",
    category: "괄호",
  },
  {
    symbol: "「」",
    name: "인용 괄호",
    description: "인용/강조",
    category: "괄호",
  },
  {
    symbol: "『』",
    name: "이중 인용 괄호",
    description: "인용/강조",
    category: "괄호",
  },
  {
    symbol: "〔〕",
    name: "모서리 괄호",
    description: "보조 설명",
    category: "괄호",
  },
  {
    symbol: "〈〉",
    name: "작은 꺾쇠 괄호",
    description: "보조 설명",
    category: "괄호",
  },
  {
    symbol: "《》",
    name: "큰 꺾쇠 괄호",
    description: "책/작품명",
    category: "괄호",
  },

  // 문장 부호
  {
    symbol: "·",
    name: "중점",
    description: "나열 구분",
    category: "문장 부호",
  },
  {
    symbol: "―",
    name: "장음표",
    description: "대화/인용",
    category: "문장 부호",
  },
  {
    symbol: "…",
    name: "말줄임표",
    description: "생략",
    category: "문장 부호",
  },
  {
    symbol: "〜",
    name: "물결표",
    description: "범위/대략",
    category: "문장 부호",
  },
  {
    symbol: "〜",
    name: "물결표 (전각)",
    description: "범위/대략",
    category: "문장 부호",
  },

  // 법률/문서
  {
    symbol: "§",
    name: "섹션",
    description: "조항 표시",
    category: "법률/문서",
  },
  {
    symbol: "¶",
    name: "단락",
    description: "단락 표시",
    category: "법률/문서",
  },
  {
    symbol: "№",
    name: "번호",
    description: "번호 표시",
    category: "법률/문서",
  },

  // 상표/저작권
  {
    symbol: "™",
    name: "상표",
    description: "Trade Mark",
    category: "상표/저작권",
  },
  {
    symbol: "®",
    name: "등록상표",
    description: "Registered",
    category: "상표/저작권",
  },
  {
    symbol: "©",
    name: "저작권",
    description: "Copyright",
    category: "상표/저작권",
  },
  {
    symbol: "℠",
    name: "서비스마크",
    description: "Service Mark",
    category: "상표/저작권",
  },

  // 수학/비교
  {
    symbol: "±",
    name: "플러스마이너스",
    description: "양수/음수",
    category: "수학/비교",
  },
  {
    symbol: "×",
    name: "곱하기",
    description: "곱셈",
    category: "수학/비교",
  },
  {
    symbol: "÷",
    name: "나누기",
    description: "나눗셈",
    category: "수학/비교",
  },
  {
    symbol: "≥",
    name: "크거나 같음",
    description: "비교",
    category: "수학/비교",
  },
  {
    symbol: "≤",
    name: "작거나 같음",
    description: "비교",
    category: "수학/비교",
  },
  {
    symbol: "≠",
    name: "같지 않음",
    description: "비교",
    category: "수학/비교",
  },
  {
    symbol: "≈",
    name: "거의 같음",
    description: "비교",
    category: "수학/비교",
  },
  {
    symbol: "∞",
    name: "무한대",
    description: "수학",
    category: "수학/비교",
  },

  // 온도
  {
    symbol: "℃",
    name: "섭씨",
    description: "온도",
    category: "온도",
  },
  {
    symbol: "℉",
    name: "화씨",
    description: "온도",
    category: "온도",
  },

  // 로마 숫자
  {
    symbol: "Ⅰ",
    name: "로마 숫자 1",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅱ",
    name: "로마 숫자 2",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅲ",
    name: "로마 숫자 3",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅳ",
    name: "로마 숫자 4",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅴ",
    name: "로마 숫자 5",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅵ",
    name: "로마 숫자 6",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅶ",
    name: "로마 숫자 7",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅷ",
    name: "로마 숫자 8",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅸ",
    name: "로마 숫자 9",
    description: "로마 숫자",
    category: "로마 숫자",
  },
  {
    symbol: "Ⅹ",
    name: "로마 숫자 10",
    description: "로마 숫자",
    category: "로마 숫자",
  },

  // 삼각형
  {
    symbol: "▲",
    name: "검은 위쪽 삼각형",
    description: "위/증가/상승",
    category: "삼각형",
  },
  {
    symbol: "△",
    name: "흰 위쪽 삼각형",
    description: "위/증가/상승",
    category: "삼각형",
  },
  {
    symbol: "▼",
    name: "검은 아래쪽 삼각형",
    description: "아래/감소/하락",
    category: "삼각형",
  },
  {
    symbol: "▽",
    name: "흰 아래쪽 삼각형",
    description: "아래/감소/하락",
    category: "삼각형",
  },
  {
    symbol: "▶",
    name: "검은 오른쪽 삼각형",
    description: "오른쪽/다음/재생",
    category: "삼각형",
  },
  {
    symbol: "▷",
    name: "흰 오른쪽 삼각형",
    description: "오른쪽/다음/재생",
    category: "삼각형",
  },
  {
    symbol: "◀",
    name: "검은 왼쪽 삼각형",
    description: "왼쪽/이전/되돌리기",
    category: "삼각형",
  },
  {
    symbol: "◁",
    name: "흰 왼쪽 삼각형",
    description: "왼쪽/이전/되돌리기",
    category: "삼각형",
  },
  {
    symbol: "◆",
    name: "검은 다이아몬드",
    description: "중요/강조",
    category: "삼각형",
  },
  {
    symbol: "◇",
    name: "흰 다이아몬드",
    description: "중요/강조",
    category: "삼각형",
  },
  {
    symbol: "◈",
    name: "체크 다이아몬드",
    description: "중요/강조",
    category: "삼각형",
  },
  {
    symbol: "◉",
    name: "이중 원",
    description: "중요/강조",
    category: "삼각형",
  },
];

const categories = [
  "체크/엑스",
  "네모",
  "원",
  "화살표",
  "별",
  "주의/참고",
  "원 숫자",
  "괄호",
  "문장 부호",
  "법률/문서",
  "상표/저작권",
  "수학/비교",
  "온도",
  "로마 숫자",
  "삼각형",
];

interface SymbolPaletteProps {
  onNavigateToTools?: () => void;
}

export function SymbolPalette({ onNavigateToTools }: SymbolPaletteProps) {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const getSymbolsByCategory = (category: string) => {
    return symbols.filter((symbol) => symbol.category === category);
  };

  const handleCopy = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopiedSymbol(symbol);
      setTimeout(() => setCopiedSymbol(null), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
      // 폴백: 텍스트 영역을 사용한 복사
      const textArea = document.createElement("textarea");
      textArea.value = symbol;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedSymbol(symbol);
      setTimeout(() => setCopiedSymbol(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">특수기호 모음</h1>
          <p className="text-muted-foreground">
            기획서와 PRD에 자주 쓰는 특수기호를 클릭하면 바로 복사됩니다
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => {
            const categorySymbols = getSymbolsByCategory(category);
            if (categorySymbols.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  {category}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {categorySymbols.map((item) => {
                    const isCopied = copiedSymbol === item.symbol;
                    return (
                      <Card
                        key={`${item.symbol}-${item.name}`}
                        className={cn(
                          "hover:shadow-md transition-all cursor-pointer group",
                          isCopied && "border-primary shadow-md"
                        )}
                        onClick={() => handleCopy(item.symbol)}
                      >
                        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[100px]">
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                            {item.symbol}
                          </div>
                          <div className="text-xs font-medium text-center mb-1">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground text-center">
                              {item.description}
                            </div>
                          )}
                          {isCopied && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                              <Check className="size-3" />
                              <span>복사됨</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

