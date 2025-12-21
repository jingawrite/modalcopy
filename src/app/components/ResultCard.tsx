import { useState } from "react";

interface ResultCardProps {
  brandStyle: string;
  title: string;
  body: string;
  buttonText: string;
}

export function ResultCard({ brandStyle, title, body, buttonText }: ResultCardProps) {
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedState(type);
        setTimeout(() => setCopiedState(null), 2000);
      } else {
        // Fallback to older method
        copyTextFallback(text, type);
      }
    } catch (err) {
      // If clipboard API fails, use fallback
      copyTextFallback(text, type);
    }
  };

  const copyTextFallback = (text: string, type: string) => {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedState(type);
      setTimeout(() => setCopiedState(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("복사에 실패했습니다. 브라우저 설정을 확인해주세요.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const getBrandColor = (style: string) => {
    if (style.includes("토스")) return "text-[#3182F6]";
    if (style.includes("당근")) return "text-[#FF6F0F]";
    if (style.includes("드랍박스")) return "text-[#0061FF]";
    return "text-[#2563EB]";
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className={`${getBrandColor(brandStyle)} mb-4 font-semibold`}>{brandStyle}</h3>
      
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">제목</p>
          <p className="text-lg font-medium">{title}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">본문</p>
          <p className="text-foreground">{body}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">버튼 문구</p>
          <p className="text-foreground font-medium">{buttonText}</p>
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleCopy(title, "title")}
          className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent transition-colors"
        >
          {copiedState === "title" ? "복사됨!" : "제목 복사"}
        </button>
        <button
          onClick={() => handleCopy(body, "body")}
          className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent transition-colors"
        >
          {copiedState === "body" ? "복사됨!" : "본문 복사"}
        </button>
        <button
          onClick={() => handleCopy(buttonText, "button")}
          className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent transition-colors"
        >
          {copiedState === "button" ? "복사됨!" : "버튼 복사"}
        </button>
        <button
          onClick={() => handleCopy(`${title}\n\n${body}\n\n[${buttonText}]`, "all")}
          className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent transition-colors"
        >
          {copiedState === "all" ? "복사됨!" : "전체 복사"}
        </button>
      </div>
    </div>
  );
}