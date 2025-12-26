# shadcn UI 통일감 있는 사용 가이드

이 문서는 프로젝트에서 shadcn UI 컴포넌트를 통일감 있게 사용하기 위한 가이드입니다.

## 핵심 원칙

### 1. CSS 변수 기반 색상 시스템 사용

**❌ 하드코딩된 색상 사용 금지**
```tsx
// 나쁜 예
<div className="bg-[#2563EB] text-white">
<button className="bg-[#1d4ed8] hover:bg-[#2563EB]">
```

**✅ CSS 변수 사용**
```tsx
// 좋은 예
<div className="bg-primary text-primary-foreground">
<button className="bg-primary hover:bg-primary/90">
```

### 2. shadcn 컴포넌트 활용

**❌ 커스텀 버튼 스타일링**
```tsx
// 나쁜 예
<button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8]">
  클릭
</button>
```

**✅ shadcn Button 컴포넌트 사용**
```tsx
// 좋은 예
import { Button } from "@/app/components/ui/button";

<Button variant="default" size="default">
  클릭
</Button>
```

### 3. cn() 유틸리티 함수 사용

모든 className은 `cn()` 함수를 통해 병합하세요. 이는 tailwind-merge를 통해 클래스 충돌을 자동으로 해결합니다.

```tsx
import { cn } from "@/app/components/ui/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // props로 받은 className도 병합
)}>
```

## 사용 가능한 색상 토큰

`theme.css`에 정의된 CSS 변수를 사용하세요:

### 주요 색상
- `bg-primary` / `text-primary-foreground` - 주요 액션 버튼
- `bg-secondary` / `text-secondary-foreground` - 보조 액션
- `bg-destructive` / `text-destructive-foreground` - 삭제/위험 액션
- `bg-muted` / `text-muted-foreground` - 비활성/보조 텍스트
- `bg-accent` / `text-accent-foreground` - 강조 영역
- `bg-card` / `text-card-foreground` - 카드 배경
- `bg-background` / `text-foreground` - 페이지 배경/텍스트

### 테두리 및 입력
- `border-border` - 테두리
- `bg-input-background` - 입력 필드 배경
- `border-input` - 입력 필드 테두리

### 상태 색상
- `hover:bg-accent` - 호버 상태
- `focus-visible:ring-ring` - 포커스 상태
- `disabled:opacity-50` - 비활성 상태

## 컴포넌트별 사용 가이드

### Button

```tsx
import { Button } from "@/app/components/ui/button";

// 기본 버튼
<Button>확인</Button>

// Variants
<Button variant="default">기본</Button>
<Button variant="destructive">삭제</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="secondary">보조</Button>
<Button variant="ghost">고스트</Button>
<Button variant="link">링크</Button>

// Sizes
<Button size="sm">작은 버튼</Button>
<Button size="default">기본</Button>
<Button size="lg">큰 버튼</Button>
<Button size="icon">아이콘만</Button>
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
  <CardFooter>
    푸터
  </CardFooter>
</Card>
```

### Input

```tsx
import { Input } from "@/app/components/ui/input";

<Input type="text" placeholder="입력하세요" />
```

### 기타 컴포넌트

`src/app/components/ui/` 폴더에 있는 모든 컴포넌트를 활용하세요:
- `Dialog` - 모달
- `Select` - 선택 드롭다운
- `Tabs` - 탭
- `Badge` - 뱃지
- 등등...

## 마이그레이션 체크리스트

기존 코드를 수정할 때 다음을 확인하세요:

- [ ] 하드코딩된 색상(`#2563EB`, `#1d4ed8` 등)을 CSS 변수로 변경
- [ ] 커스텀 버튼을 shadcn `Button` 컴포넌트로 교체
- [ ] 모든 `className`에 `cn()` 함수 사용
- [ ] 일관된 spacing 사용 (`gap-2`, `gap-4`, `p-4`, `p-6` 등)
- [ ] 일관된 border-radius 사용 (`rounded-md`, `rounded-lg`, `rounded-xl`)

## 예시: Before & After

### Before (하드코딩)
```tsx
<button
  onClick={handleClick}
  className="px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
>
  지금 시작하기
</button>
```

### After (shadcn 스타일)
```tsx
import { Button } from "@/app/components/ui/button";

<Button
  onClick={handleClick}
  size="lg"
  className="px-8"
>
  지금 시작하기
</Button>
```

## 추가 리소스

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Radix UI 문서](https://www.radix-ui.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/)


