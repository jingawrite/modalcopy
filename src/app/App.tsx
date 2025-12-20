import { useState, useRef } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResultCard } from "./components/ResultCard";
import { Footer } from "./components/Footer";

type ModalType =
  | "성공"
  | "오류"
  | "확인"
  | "경고"
  | "정보"
  | "기타";
type Tone =
  | "친근한 (토스 스타일)"
  | "공식적"
  | "캐주얼"
  | "따뜻한"
  | "직설적";

interface GeneratedCopy {
  tone: Tone;
  title: string;
  body: string;
}

// Modal type examples for better UX
const modalTypeExamples: Record<ModalType, string> = {
  성공: "예: 회원가입 완료, 결제 성공",
  오류: "예: 비밀번호 오류, 네트워크 문제",
  확인: "예: 게시물 삭제, 계정 탈퇴",
  경고: "예: 배터리 부족, 권한 거부",
  정보: "예: 기능 업데이트, 약관 변경",
  기타: "직접 입력",
};

// Situation options for each modal type
const situationOptions: Record<ModalType, string[]> = {
  성공: [
    "회원가입 완료",
    "결제 성공",
    "포인트 적립",
    "로그인 성공",
    "주문 완료",
    "리뷰 작성 완료",
    "친구 초대 성공",
    "이벤트 참여 완료",
  ],
  오류: [
    "비밀번호 오류",
    "네트워크 문제",
    "결제 실패",
    "입력 정보 불일치",
    "재고 부족",
    "파일 업로드 실패",
    "아이디 중복",
    "세션 만료",
  ],
  확인: [
    "게시물 삭제",
    "계정 탈퇴",
    "설정 변경",
    "결제 취소",
    "로그아웃",
    "대량 작업",
    "개인정보 동의 철회",
  ],
  경고: [
    "배터리 부족",
    "권한 거부",
    "쿠폰 만료 임박",
    "보안 위험",
    "과도한 사용",
    "콘텐츠 제한",
  ],
  정보: [
    "기능 업데이트",
    "약관 변경",
    "권한 설명",
    "이벤트 규칙",
    "FAQ",
    "버전 업데이트 권유",
  ],
  기타: [],
};

// Copy generation templates
const copyTemplates = {
  성공: {
    회원가입완료: {
      "친근한 (토스 스타일)": {
        title: "환영합니다! 🎉",
        body: "회원가입이 완료되었어요. 이제 모든 기능을 자유롭게 사용하실 수 있어요!",
      },
      공식적: {
        title: "회원가입이 완료되었습니다",
        body: "고객님의 계정이 성공적으로 생성되었습니다. 로그인 후 서비스를 이용하실 수 있습니다.",
      },
      캐주얼: {
        title: "가입 완료!",
        body: "이제 모든 준비가 끝났어요. 바로 시작해볼까요?",
      },
      따뜻한: {
        title: "함께하게 되어 기뻐요",
        body: "회원가입을 완료하셨습니다. 저희 서비스와 함께 좋은 경험 만들어가세요.",
      },
      직설적: {
        title: "가입 완료",
        body: "회원가입이 완료되었습니다. 로그인하세요.",
      },
    },
    결제성공: {
      "친근한 (토스 스타일)": {
        title: "결제가 완료되었어요!",
        body: "주문하신 상품을 빠르게 준비해드릴게요. 조금만 기다려주세요!",
      },
      공식적: {
        title: "결제가 완료되었습니다",
        body: "결제 내역은 이메일로 전송되었습니다. 주문 번호를 통해 배송 현황을 확인하실 수 있습니다.",
      },
      캐주얼: {
        title: "결제 성공! 👍",
        body: "곧 배송 준비할게요. 마이페이지에서 확인해보세요.",
      },
      따뜻한: {
        title: "구매해 주셔서 감사해요",
        body: "결제가 정상적으로 완료되었습니다. 소중한 선택에 최선을 다하겠습니다.",
      },
      직설적: {
        title: "결제 완료",
        body: "결제가 완료되었습니다. 주문 번호: #12345",
      },
    },
    // Default for other success scenarios
    default: {
      "친근한 (토스 스타일)": {
        title: "성공했어요! 🎉",
        body: "요청하신 작업이 정상적으로 완료되었어요.",
      },
      공식적: {
        title: "작업이 완료되었습니다",
        body: "요청하신 작업이 성공적으로 처리되었습니다.",
      },
      캐주얼: {
        title: "완료!",
        body: "다 됐어요. 계속 진행하실 수 있어요.",
      },
      따뜻한: {
        title: "잘 처리되었어요",
        body: "요청하신 작업이 문제없이 완료되었습니다.",
      },
      직설적: {
        title: "완료",
        body: "작업이 완료되었습니다.",
      },
    },
  },
  오류: {
    비밀번호오류: {
      "친근한 (토스 스타일)": {
        title: "비밀번호가 일치하지 않아요",
        body: "비밀번호를 다시 확인해주세요. 비밀번호를 잊으셨다면 '비밀번호 찾기'를 이용해보세요.",
      },
      공식적: {
        title: "비밀번호 오류",
        body: "입력하신 비밀번호가 일치하지 않습니다. 다시 시도해주시기 바랍니다.",
      },
      캐주얼: {
        title: "비밀번호가 틀렸어요",
        body: "다시 한 번 입력해보세요. 까먹으셨다면 재설정하시면 돼요.",
      },
      따뜻한: {
        title: "비밀번호를 다시 확인해주세요",
        body: "혹시 비밀번호를 잊으신 건 아닌가요? 걱정 마세요, 언제든 재설정할 수 있어요.",
      },
      직설적: {
        title: "비밀번호 오류",
        body: "비밀번호가 틀렸습니다. 다시 입력하세요.",
      },
    },
    네트워크문제: {
      "친근한 (토스 스타일)": {
        title: "인터넷 연결을 확인해주세요",
        body: "네트워크 연결이 불안정해요. 잠시 후 다시 시도해주세요.",
      },
      공식적: {
        title: "네트워크 오류",
        body: "네트워크 연결 상태를 확인하신 후 다시 시도해주시기 바랍니다.",
      },
      캐주얼: {
        title: "연결이 끊겼어요",
        body: "Wi-Fi나 데이터 연결 확인하고 다시 해보세요.",
      },
      따뜻한: {
        title: "잠깐, 연결이 불안정해요",
        body: "네트워크 상태를 확인하고 다시 시도해주시겠어요?",
      },
      직설적: {
        title: "네트워크 오류",
        body: "네트워크 연결을 확인하세요.",
      },
    },
    default: {
      "친근한 (토스 스타일)": {
        title: "앗, 문제가 발생했어요",
        body: "요청을 처리하는 중에 오류가 발생했어요. 다시 시도해주세요.",
      },
      공식적: {
        title: "오류가 발생했습니다",
        body: "일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주시기 바랍니다.",
      },
      캐주얼: {
        title: "오류 발생",
        body: "뭔가 잘못됐어요. 다시 한번 해보세요.",
      },
      따뜻한: {
        title: "오류가 발생했어요",
        body: "예상치 못한 문제가 생겼네요. 다시 시도해주시겠어요?",
      },
      직설적: {
        title: "오류",
        body: "오류가 발생했습니다. 다시 시도하세요.",
      },
    },
  },
  확인: {
    게시물삭제: {
      "친근한 (토스 스타일)": {
        title: "정말 삭제하시겠어요?",
        body: "삭제하시면 다시 복구할 수 없어요. 정말 삭제하시겠어요?",
      },
      공식적: {
        title: "삭제 확인",
        body: "해당 게시물을 삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다.",
      },
      캐주얼: {
        title: "삭제할까요?",
        body: "삭제하면 복구 안 돼요. 괜찮죠?",
      },
      따뜻한: {
        title: "삭제하시려고요?",
        body: "지금 삭제하시면 복구할 수 없어요. 신중하게 결정해주세요.",
      },
      직설적: {
        title: "삭제 확인",
        body: "게시물을 삭제하시겠습니까? 복구 불가능합니다.",
      },
    },
    계정탈퇴: {
      "친근한 (토스 스타일)": {
        title: "정말 떠나시는 건가요?",
        body: "계정을 탈퇴하시면 모든 데이터가 삭제되고 복구할 수 없어요. 그래도 탈퇴하시겠어요?",
      },
      공식적: {
        title: "계정 탈퇴 확인",
        body: "계정 탈퇴 시 모든 개인정보 및 이용 기록이 영구 삭제됩니다. 탈퇴하시겠습니까?",
      },
      캐주얼: {
        title: "탈퇴하시려고요?",
        body: "모든 데이터 다 사라져요. 진짜 탈퇴할까요?",
      },
      따뜻한: {
        title: "아쉽지만 탈퇴를 원하시나요?",
        body: "탈퇴하시면 모든 정보가 삭제돼요. 정말 괜찮으신가요?",
      },
      직설적: {
        title: "계정 탈퇴",
        body: "탈퇴 시 모든 데이터 삭제됩니다. 진행하시겠습니까?",
      },
    },
    default: {
      "친근한 (토스 스타일)": {
        title: "계속 진행할까요?",
        body: "이 작업을 진행하시겠어요?",
      },
      공식적: {
        title: "확인",
        body: "해당 작업을 진행하시겠습니까?",
      },
      캐주얼: {
        title: "진행할까요?",
        body: "이대로 할까요?",
      },
      따뜻한: {
        title: "계속하시겠어요?",
        body: "이 작업을 진행하실 건가요?",
      },
      직설적: {
        title: "확인",
        body: "진행하시겠습니까?",
      },
    },
  },
  경고: {
    default: {
      "친근한 (토스 스타일)": {
        title: "주의가 필요해요",
        body: "계속 진행하시기 전에 한 번 더 확인해주세요.",
      },
      공식적: {
        title: "경고",
        body: "주의가 필요한 상황입니다. 확인 후 진행해주시기 바랍니다.",
      },
      캐주얼: {
        title: "잠깐!",
        body: "이거 확인하고 진행하세요.",
      },
      따뜻한: {
        title: "조심해주세요",
        body: "안전을 위해 한 번 더 확인해주시면 좋을 것 같아요.",
      },
      직설적: {
        title: "경고",
        body: "주의하세요.",
      },
    },
  },
  정보: {
    기능업데이트: {
      "친근한 (토스 스타일)": {
        title: "새로운 기능이 추가됐어요! ✨",
        body: "더 나은 경험을 위해 새 기능을 추가했어요. 지금 바로 확인해보세요!",
      },
      공식적: {
        title: "기능 업데이트 안내",
        body: "서비스 개선을 위해 새로운 기능이 추가되었습니다. 업데이트 내용을 확인해주세요.",
      },
      캐주얼: {
        title: "신기능 나왔어요!",
        body: "새 기능 추가됐어요. 한번 써보세요!",
      },
      따뜻한: {
        title: "더 나아진 기능을 만나보세요",
        body: "여러분을 위해 새로운 기능을 준비했어요. 확인해보시겠어요?",
      },
      직설적: {
        title: "기능 업데이트",
        body: "새 기능이 추가되었습니다.",
      },
    },
    default: {
      "친근한 (토스 스타일)": {
        title: "안내사항이 있어요",
        body: "확인해야 할 내용이 있어요. 잠깐만 시간 내주세요.",
      },
      공식적: {
        title: "안내",
        body: "중요한 안내사항이 있습니다. 확인 부탁드립니다.",
      },
      캐주얼: {
        title: "알려드려요",
        body: "이거 한번 봐주세요.",
      },
      따뜻한: {
        title: "잠깐 확인해주세요",
        body: "알려드릴 내용이 있어요.",
      },
      직설적: {
        title: "안내",
        body: "확인하세요.",
      },
    },
  },
  기타: {
    default: {
      "친근한 (토스 스타일)": {
        title: "알림",
        body: "확인해야 할 내용이 있어요.",
      },
      공식적: {
        title: "알림",
        body: "확인이 필요한 사항입니다.",
      },
      캐주얼: {
        title: "알림",
        body: "체크해보세요.",
      },
      따뜻한: {
        title: "알림",
        body: "확인 부탁드려요.",
      },
      직설적: {
        title: "알림",
        body: "확인 필요.",
      },
    },
  },
};

function generateCopy(
  modalType: ModalType,
  situation: string,
  customDescription: string,
): GeneratedCopy[] {
  const tones: Tone[] = [
    "친근한 (토스 스타일)",
    "공식적",
    "캐주얼",
    "따뜻한",
    "직설적",
  ];

  // Normalize situation for lookup (remove spaces)
  const normalizedSituation = situation.replace(/\s+/g, "");

  // Get templates for the modal type
  const typeTemplates =
    copyTemplates[modalType] || copyTemplates.기타;

  // Get specific situation templates or default
  const situationTemplates =
    typeTemplates[
      normalizedSituation as keyof typeof typeTemplates
    ] || typeTemplates.default;

  return tones.map((tone) => {
    const template = situationTemplates[tone];

    // If custom description is provided, slightly modify the body
    let body = template.body;
    if (customDescription) {
      body = `${template.body} ${customDescription}`;
    }

    return {
      tone,
      title: template.title,
      body,
    };
  });
}

export default function App() {
  const [modalType, setModalType] = useState<ModalType>("성공");
  const [situation, setSituation] = useState<string>("");
  const [customModalType, setCustomModalType] =
    useState<string>("");
  const [results, setResults] = useState<
    GeneratedCopy[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputAreaRef = useRef<HTMLDivElement>(null);

  const handleStartClick = () => {
    inputAreaRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleModalTypeChange = (type: ModalType) => {
    setModalType(type);
    setSituation(""); // Reset situation when type changes
  };

  const handleGenerate = async () => {
    // Determine which situation to use
    const finalSituation =
      modalType === "기타" ? customModalType : situation;

    if (!finalSituation && modalType !== "기타") {
      alert("상황을 선택해주세요.");
      return;
    }

    if (modalType === "기타" && !customModalType) {
      alert("모달 유형을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const allResults = generateCopy(
      modalType,
      finalSituation,
      "",
    );

    setResults(allResults);
    setIsLoading(false);

    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById("results");
      resultsSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onStartClick={handleStartClick} />

      {/* Main Input Area */}
      <div
        ref={inputAreaRef}
        className="max-w-[800px] mx-auto px-6 mb-12"
      >
        <div className="bg-white rounded-xl shadow-md p-8 border border-border">
          {/* Step 1: Modal Type */}
          <div className="mb-8">
            <label className="block mb-3">모달 유형 선택</label>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  "성공",
                  "오류",
                  "확인",
                  "경고",
                  "정보",
                  "기타",
                ] as ModalType[]
              ).map((type) => (
                <label
                  key={type}
                  className="flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="modalType"
                      value={type}
                      checked={modalType === type}
                      onChange={() =>
                        handleModalTypeChange(type)
                      }
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                    <span>{type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-6">
                    {modalTypeExamples[type]}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom modal type input when "기타" is selected */}
            {modalType === "기타" && (
              <textarea
                value={customModalType}
                onChange={(e) =>
                  setCustomModalType(e.target.value)
                }
                placeholder="예: 친구 초대, 쿠폰 발급, 파일 다운로드 등"
                className="mt-4 w-full px-4 py-3 border border-border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                rows={2}
              />
            )}
          </div>

          {/* Step 2: Situation Selection */}
          {modalType !== "기타" && (
            <div className="mb-8">
              <label className="block mb-3">상황 선택</label>
              <div className="flex flex-wrap gap-3">
                {situationOptions[modalType].map((sit) => (
                  <label
                    key={sit}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="situation"
                      value={sit}
                      checked={situation === sit}
                      onChange={(e) =>
                        setSituation(e.target.value)
                      }
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                    <span>{sit}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "생성 중..." : "문구 생성하기"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && results.length > 0 && (
        <div
          id="results"
          className="max-w-[800px] mx-auto px-6 mb-12"
        >
          <div className="mb-6">
            <h2>생성된 문구</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result, index) => (
              <ResultCard
                key={index}
                tone={result.tone}
                title={result.title}
                body={result.body}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="max-w-[800px] mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-lg p-6 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}