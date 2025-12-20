interface HeroProps {
  onStartClick: () => void;
}

export function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="max-w-[800px] mx-auto px-6 py-20 text-center">
      <h1 className="mb-4">모달 문구, 10초 만에 5개 완성</h1>
      <p className="text-lg text-muted-foreground mb-8">
        상황만 말해주세요. 친근한/공식적/캐주얼 등 5가지 톤으로 바로 생성해드려요.
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
