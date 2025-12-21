interface HeroProps {
  onStartClick: () => void;
}

export function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="max-w-[800px] mx-auto px-6 py-20 text-center">
      <h1 className="mb-4">모달 문구, 10초 만에 3가지 스타일 완성</h1>
      <p className="text-lg text-muted-foreground mb-6">
        상황만 말해주세요. 토스·당근·Dropbox 3가지 브랜드 톤앤매너로 바로 생성해드려요.
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
          <span className="text-sm text-muted-foreground text-center">Dropbox 스타일</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-8">
        각 브랜드의 고유한 톤앤매너를 반영한 문구를 한 번에 비교해보세요.
      </p>
      
      <button
        onClick={onStartClick}
        className="px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
      >
        지금 시작하기
      </button>
    </section>
  );
}
