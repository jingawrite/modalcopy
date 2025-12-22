import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
  onNavigateToTools?: () => void;
}

export function Hero({ onStartClick, onNavigateToTools }: HeroProps) {
  return (
    <section className="max-w-[800px] mx-auto px-6 py-20 text-center" aria-label="서비스 소개">
      <h1 className="mb-4">모달 문구, 10초 만에 3가지 스타일 완성</h1>
      <p className="text-lg text-muted-foreground mb-6">
        상황만 말해주세요. 토스·당근·드랍박스 3가지 브랜드 톤앤매너로 바로 생성해드려요.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        맞춤법 검사 기능으로 생성된 문구의 오류를 바로 확인하고 수정할 수 있습니다.
      </p>
      
      {/* 브랜드 로고 영역 */}
      <div className="flex items-start justify-center mb-8">
        <div className="flex flex-col items-center gap-2 w-24">
          <div className="w-16 h-16 bg-[#3182F6] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            토스
          </div>
          <span className="text-sm text-muted-foreground text-center">토스 스타일</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-24">
          <div className="w-16 h-16 bg-[#FF6F0F] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            당근
          </div>
          <span className="text-sm text-muted-foreground text-center">당근 스타일</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-24">
          <div className="w-16 h-16 bg-[#0061FF] rounded-lg flex items-center justify-center text-white font-bold text-xs">
            Dropbox
          </div>
          <span className="text-sm text-muted-foreground text-center">드랍박스 스타일</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-8">
        각 브랜드의 고유한 톤앤매너를 반영한 문구를 한 번에 비교해보세요.
      </p>
      
      <div className="flex gap-4 justify-center">
        <Button
          onClick={onStartClick}
          size="lg"
          className="px-8"
        >
          지금 시작하기
        </Button>
        {onNavigateToTools && (
          <Button
            onClick={onNavigateToTools}
            size="lg"
            variant="outline"
            className="px-8 flex items-center gap-2"
          >
            <Sparkles className="size-4" />
            기획약국
          </Button>
        )}
      </div>
    </section>
  );
}
