import { useState, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { CheckCircle2, XCircle, AlertCircle, Info, TrendingUp } from "lucide-react";

export interface SpellError {
  start: number;
  end: number;
  original: string;
  suggestions: string[];
  errorType: "띄어쓰기" | "맞춤법" | "표준어" | "통계적교정" | "외래어";
}

interface SpellCheckerProps {
  initialText?: string;
  maxLength?: number;
  onTextChange?: (text: string) => void;
}

// 백엔드 서버를 통한 맞춤법 검사 (py-hanspell 사용)
async function checkSpelling(text: string): Promise<{ errors: SpellError[]; checked: string }> {
  try {
    // 백엔드 서버 API 호출
    // 개발 환경: http://localhost:5001 (macOS에서는 5000이 AirPlay Receiver에 사용됨)
    // 프로덕션: 환경 변수로 설정
    const apiUrl = import.meta.env.VITE_SPELL_CHECK_API_URL || "http://localhost:5001";
    
    const response = await fetch(`${apiUrl}/api/spell-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        engine: "네이버",
      }),
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "알 수 없는 오류");
    }

    // 디버깅: 백엔드 응답 확인
    console.log("백엔드 응답:", {
      success: data.success,
      errorCount: data.errorCount,
      errors: data.errors,
      original: data.original,
      checked: data.checked
    });

    // 백엔드 응답을 SpellError 형식으로 변환
    const errors = data.errors || [];
    const checked = data.checked || text;
    console.log("추출된 오류:", errors);
    return { errors, checked };
  } catch (error) {
    console.warn("백엔드 맞춤법 검사 API 호출 실패, 모의 데이터 사용:", error);
    return checkSpellingMock(text);
  }
}

// 모의 맞춤법 검사 함수 (fallback)
async function checkSpellingMock(text: string): Promise<{ errors: SpellError[]; checked: string }> {
  if (!text.trim()) return { errors: [], checked: text };

  const errors: SpellError[] = [];

  // 표준어 오류
  if (text.includes("네이보")) {
    const regex = /네이보/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + 3,
        original: "네이보",
        suggestions: ["네이버"],
        errorType: "표준어",
      });
    }
  }

  // 맞춤법 오류
  if (text.includes("되요")) {
    const regex = /되요/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + 2,
        original: "되요",
        suggestions: ["돼요", "되어요"],
        errorType: "맞춤법",
      });
    }
  }

  if (text.includes("안되")) {
    const regex = /안되/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + 2,
        original: "안되",
        suggestions: ["안 돼", "안 되어"],
        errorType: "띄어쓰기",
      });
    }
  }

  if (text.includes("되서")) {
    const regex = /되서/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + 2,
        original: "되서",
        suggestions: ["돼서", "되어서"],
        errorType: "맞춤법",
      });
    }
  }

  if (text.includes("안돼") && !text.includes("안 돼")) {
    const regex = /안돼/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        start: match.index,
        end: match.index + 2,
        original: "안돼",
        suggestions: ["안 돼", "안 되어"],
        errorType: "띄어쓰기",
      });
    }
  }

  // 중복 제거 및 정렬
  const uniqueErrors = errors
    .filter((error, index, self) => {
      return index === self.findIndex(
        (e) => e.start === error.start && e.end === error.end
      );
    })
    .sort((a, b) => a.start - b.start);

  return { errors: uniqueErrors, checked: text };
}


export function SpellChecker({
  initialText = "",
  maxLength,
  onTextChange,
}: SpellCheckerProps) {
  const [text, setText] = useState(initialText);
  const [errors, setErrors] = useState<SpellError[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [hoveredError, setHoveredError] = useState<number | null>(null);
  const [checkedText, setCheckedText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 변경 핸들러
  const handleTextChange = (value: string) => {
    if (maxLength && value.length > maxLength) {
      return; // 글자수 제한
    }
    setText(value);
    onTextChange?.(value);
    // 텍스트가 변경되면 검사 결과 초기화
    if (hasChecked) {
      setErrors([]);
      setHasChecked(false);
      setCheckedText("");
    }
  };

  // 맞춤법 검사 실행
  const handleCheck = async () => {
    if (!text.trim()) {
      setErrors([]);
      setHasChecked(false);
      setCheckedText("");
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkSpelling(text);
      console.log("검사 결과:", result);
      console.log("오류 개수:", result.errors.length);
      setErrors(result.errors);
      setCheckedText(result.checked);
      setHasChecked(true);
    } catch (error) {
      console.error("맞춤법 검사 오류:", error);
      setErrors([]);
      setCheckedText("");
    } finally {
      setIsChecking(false);
    }
  };

  // 오류 수정 적용
  const applySuggestion = (error: SpellError, suggestion: string) => {
    const newText =
      text.slice(0, error.start) +
      suggestion +
      text.slice(error.end);
    handleTextChange(newText);
    setHoveredError(null);
  };

  // 오류 유형별 스타일 매핑
  const getErrorStyle = (errorType: SpellError["errorType"]) => {
    switch (errorType) {
      case "맞춤법":
        return {
          decoration: "decoration-red-500",
          bg: "bg-red-50",
          icon: XCircle,
          iconColor: "text-red-500",
          label: "맞춤법 오류",
        };
      case "띄어쓰기":
        return {
          decoration: "decoration-blue-500",
          bg: "bg-blue-50",
          icon: AlertCircle,
          iconColor: "text-blue-500",
          label: "띄어쓰기 오류",
        };
      case "표준어":
        return {
          decoration: "decoration-yellow-500",
          bg: "bg-yellow-50",
          icon: Info,
          iconColor: "text-yellow-500",
          label: "표준어 의심",
        };
      case "통계적교정":
        return {
          decoration: "decoration-purple-500",
          bg: "bg-purple-50",
          icon: TrendingUp,
          iconColor: "text-purple-500",
          label: "통계적 교정",
        };
      case "외래어":
        return {
          decoration: "decoration-orange-500",
          bg: "bg-orange-50",
          icon: AlertCircle,
          iconColor: "text-orange-500",
          label: "외래어",
        };
      default:
        return {
          decoration: "decoration-gray-500",
          bg: "bg-gray-50",
          icon: AlertCircle,
          iconColor: "text-gray-500",
          label: "기타",
        };
    }
  };

  // 교정 결과 텍스트를 오류가 있는 부분과 없는 부분으로 분리하여 렌더링
  const renderTextWithErrors = () => {
    if (!hasChecked || !checkedText) {
      return null;
    }

    if (errors.length === 0) {
      return <span className="whitespace-pre-wrap">{checkedText}</span>;
    }

    // 교정된 텍스트를 기준으로 오류 위치 매핑
    // 원문의 오류에 해당하는 교정된 텍스트의 단어 찾기
    const parts: Array<{ text: string; isError: boolean; error?: SpellError }> = [];
    let lastIndex = 0;

    // 교정된 텍스트에서 오류 위치 찾기
    errors
      .sort((a, b) => a.start - b.start)
      .forEach((error) => {
        // 교정된 텍스트에서 제안된 단어 찾기
        const suggestion = error.suggestions[0];
        if (!suggestion) {
          return;
        }

        // 교정된 텍스트에서 제안 단어의 위치 찾기
        let checkedStart = checkedText.indexOf(suggestion, lastIndex);
        if (checkedStart === -1) {
          // 정확히 찾지 못하면 원문 위치를 기반으로 추정
          const ratio = checkedText.length / text.length;
          checkedStart = Math.floor(error.start * ratio);
        }
        const checkedEnd = checkedStart + suggestion.length;

        // 오류 앞의 정상 텍스트
        if (checkedStart > lastIndex) {
          parts.push({
            text: checkedText.slice(lastIndex, checkedStart),
            isError: false,
          });
        }
        // 오류 부분 (교정된 단어)
        parts.push({
          text: checkedText.slice(checkedStart, checkedEnd),
          isError: true,
          error,
        });
        lastIndex = checkedEnd;
      });

    // 마지막 부분
    if (lastIndex < checkedText.length) {
      parts.push({
        text: checkedText.slice(lastIndex),
        isError: false,
      });
    }

    return (
      <div className="inline whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part.isError && part.error) {
            const errorIndex = errors.indexOf(part.error);
            const style = getErrorStyle(part.error.errorType);
            const Icon = style.icon;
            
            return (
              <span
                key={index}
                className={cn(
                  "underline decoration-2 cursor-pointer relative",
                  style.decoration,
                  hoveredError === errorIndex && style.bg
                )}
                onMouseEnter={() => setHoveredError(errorIndex)}
                onMouseLeave={() => setHoveredError(null)}
              >
                {part.text}
                {hoveredError === errorIndex && (
                  <div className="absolute bottom-full left-0 mb-2 z-10 bg-popover border border-border rounded-md shadow-lg p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <Icon className={cn("w-4 h-4", style.iconColor)} />
                      <span className="font-medium">{style.label}</span>
                    </div>
                    <div className="space-y-1">
                      {part.error.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(part.error!, suggestion)}
                          className="block w-full text-left px-2 py-1 text-sm hover:bg-accent rounded text-foreground"
                        >
                          → {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </span>
            );
          }
          return <span key={index}>{part.text}</span>;
        })}
      </div>
    );
  };

  const characterCount = text.length;
  const isOverLimit = maxLength && characterCount > maxLength;

  return (
    <div>
      <div className="mb-3">
        <h4 className="text-sm font-medium">문구 입력</h4>
      </div>

      <div className="space-y-4">
        {/* 원문과 교정결과를 좌우로 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 원문 영역 */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">원문</div>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onInput={(e) => handleTextChange((e.target as HTMLTextAreaElement).value)}
              placeholder="최종 문구를 입력하세요"
              className={cn(
                "min-h-[120px]",
                errors.length > 0 && "border-destructive/50",
                isOverLimit && "border-destructive"
              )}
              {...(maxLength && { maxLength })}
            />
            <Button
              onClick={handleCheck}
              disabled={isChecking || !text.trim()}
              className="w-full"
            >
              {isChecking ? "검사 중..." : "검사하기"}
            </Button>
          </div>

          {/* 교정결과 영역 */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">교정결과</div>
            {hasChecked && checkedText ? (
              <div className="p-3 bg-muted/30 rounded-md border border-border min-h-[120px]">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {renderTextWithErrors()}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-muted/30 rounded-md border border-border min-h-[120px] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">검사 결과가 여기에 표시됩니다</span>
              </div>
            )}
          </div>
        </div>

        {/* 글자수 및 검사 결과 표시 */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {hasChecked && errors.length === 0 && text.length > 0 ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="size-3" />
                <span>오류 없음</span>
              </div>
            ) : hasChecked && errors.length > 0 ? (
              <div className="flex items-center gap-1 text-destructive">
                <AlertCircle className="size-3" />
                <span>{errors.length}개 오류 발견</span>
              </div>
            ) : null}
          </div>
          {maxLength && (
            <div
              className={cn(
                "font-medium",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {characterCount}/{maxLength}자
            </div>
          )}
          {!maxLength && (
            <div className="font-medium text-muted-foreground">
              {characterCount}자
            </div>
          )}
        </div>

        {/* 오류 목록 */}
        {hasChecked && errors.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">오류 목록</div>
            {errors.map((error, index) => {
              const style = getErrorStyle(error.errorType);
              const Icon = style.icon;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "text-xs p-2 rounded-md flex items-start gap-2 border",
                    style.bg,
                    "border-border"
                  )}
                >
                  <Icon className={cn("size-4 mt-0.5 shrink-0", style.iconColor)} />
                  <div className="flex-1">
                    <div className="font-medium mb-1 flex items-center gap-2">
                      <span className={style.iconColor}>{error.original}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded", style.bg, style.iconColor)}>
                        {style.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {error.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => applySuggestion(error, suggestion)}
                          className="px-2 py-0.5 bg-background border border-border rounded hover:bg-accent text-xs"
                        >
                          → {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

