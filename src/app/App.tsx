import { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResultCard } from "./components/ResultCard";
import { Footer } from "./components/Footer";
import { SpellChecker } from "./components/SpellChecker";
import { ToolDashboard } from "./components/ToolDashboard";
import { SymbolPalette } from "./components/SymbolPalette";
import { PlanningCompass } from "./components/PlanningCompass";
import { DesignDescriptionGenerator } from "./components/DesignDescriptionGenerator";
import { Button } from "./components/ui/button";
import { cn } from "./components/ui/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Hash, Sparkles, Compass, FileText, Home } from "lucide-react";

type ModalType =
  | "성공"
  | "오류"
  | "확인"
  | "경고"
  | "정보"
  | "기타";
type BrandStyle = "토스 스타일" | "당근 스타일" | "드랍박스 스타일";

interface GeneratedCopy {
  brandStyle: BrandStyle;
  title: string;
  body: string;
  buttonText: string;
}

// Modal type examples for better UX
const modalTypeExamples: Record<ModalType, string> = {
  성공: "예: 회원가입 완료, 결제 성공, 포인트 적립",
  오류: "예: 비밀번호 오류, 네트워크 문제, 결제 실패",
  확인: "예: 게시물 삭제, 계정 탈퇴, 결제 취소",
  경고: "예: 쿠폰 만료 임박, 보안 위험",
  정보: "예: 기능 업데이트, 약관 변경, 권한 설명",
  기타: "직접 입력",
};

// Situation options for each modal type
const situationOptions: Record<ModalType, string[]> = {
  성공: [
    "회원가입 완료",
    "결제 성공",
    "포인트 적립",
    "주문 완료",
    "리뷰 작성 완료",
    "친구 초대 성공",
  ],
  오류: [
    "비밀번호 오류",
    "네트워크 문제",
    "결제 실패",
    "입력 정보 불일치",
    "재고 부족",
    "파일 업로드 실패",
    "아이디 중복",
  ],
  확인: [
    "게시물 삭제",
    "계정 탈퇴",
    "결제 취소",
    "대량 작업",
    "개인정보 동의 철회",
  ],
  경고: [
    "쿠폰 만료 임박",
    "보안 위험",
    "과도한 사용",
    "콘텐츠 제한",
  ],
  정보: [
    "기능 업데이트",
    "약관 변경",
    "권한 설명",
    "버전 업데이트 권유",
  ],
  기타: [],
};

// Copy generation templates
const copyTemplates = {
  성공: {
    회원가입완료: {
      "토스 스타일": {
        title: "환영합니다! 🎉",
        body: "회원가입이 완료되었어요. 이제 모든 기능을 자유롭게 사용하실 수 있어요!",
        buttonText: "시작하기",
      },
      "당근 스타일": {
        title: "가입 완료했어요!",
        body: "이제 동네 이웃들과 함께해요. 편하게 둘러보세요.",
        buttonText: "둘러보기",
      },
      "드랍박스 스타일": {
        title: "회원가입이 완료되었습니다",
        body: "계정이 성공적으로 생성되었습니다. 로그인 후 서비스를 이용하실 수 있습니다.",
        buttonText: "확인",
      },
    },
    결제성공: {
      "토스 스타일": {
        title: "결제가 완료되었어요!",
        body: "주문하신 상품을 빠르게 준비해드릴게요. 조금만 기다려주세요!",
        buttonText: "주문 내역 보기",
      },
      "당근 스타일": {
        title: "결제 완료!",
        body: "곧 배송 준비할게요. 마이페이지에서 확인해보세요.",
        buttonText: "확인하기",
      },
      "드랍박스 스타일": {
        title: "결제가 완료되었습니다",
        body: "결제 내역은 이메일로 전송되었습니다. 주문 번호를 통해 배송 현황을 확인하실 수 있습니다.",
        buttonText: "확인",
      },
    },
    포인트적립: {
      "토스 스타일": {
        title: "포인트가 적립되었어요!",
        body: "포인트가 지갑에 들어왔어요. 확인해보세요.",
        buttonText: "확인하기",
      },
      "당근 스타일": {
        title: "포인트 적립됐어요!",
        body: "포인트가 들어왔어요. 확인해보세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "포인트 적립 완료",
        body: "포인트가 성공적으로 적립되었습니다. 내역을 확인해주세요.",
        buttonText: "확인",
      },
    },
    주문완료: {
      "토스 스타일": {
        title: "주문이 완료되었어요!",
        body: "주문이 정상적으로 접수되었어요. 곧 준비해드릴게요.",
        buttonText: "주문 내역 보기",
      },
      "당근 스타일": {
        title: "주문 완료!",
        body: "주문이 접수됐어요. 곧 준비할게요.",
        buttonText: "확인하기",
      },
      "드랍박스 스타일": {
        title: "주문이 완료되었습니다",
        body: "주문이 성공적으로 접수되었습니다. 주문 내역을 확인해주세요.",
        buttonText: "확인",
      },
    },
    리뷰작성완료: {
      "토스 스타일": {
        title: "리뷰가 등록되었어요!",
        body: "소중한 리뷰 감사해요. 다른 이웃들에게도 도움이 될 거예요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "리뷰 등록됐어요!",
        body: "리뷰 감사해요. 다른 이웃들에게 도움이 될 거예요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "리뷰 작성 완료",
        body: "리뷰가 성공적으로 등록되었습니다. 감사합니다.",
        buttonText: "확인",
      },
    },
    친구초대성공: {
      "토스 스타일": {
        title: "초대가 완료되었어요!",
        body: "친구에게 초대 메시지를 보냈어요. 함께 사용하면 더 즐거워요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "초대 완료!",
        body: "친구에게 초대 메시지 보냈어요. 함께 쓰면 더 좋아요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "초대 완료",
        body: "초대 메시지가 성공적으로 전송되었습니다.",
        buttonText: "확인",
      },
    },
    // Default for other success scenarios
    default: {
      "토스 스타일": {
        title: "성공했어요! 🎉",
        body: "요청하신 작업이 정상적으로 완료되었어요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "완료했어요!",
        body: "요청하신 작업이 완료되었어요. 확인해보세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "작업이 완료되었습니다",
        body: "요청하신 작업이 성공적으로 처리되었습니다.",
        buttonText: "확인",
      },
    },
  },
  오류: {
    비밀번호오류: {
      "토스 스타일": {
        title: "비밀번호가 일치하지 않아요",
        body: "비밀번호를 다시 확인해주세요. 비밀번호를 잊으셨다면 '비밀번호 찾기'를 이용해보세요.",
        buttonText: "다시 시도",
      },
      "당근 스타일": {
        title: "비밀번호가 틀렸어요",
        body: "다시 한 번 입력해보세요. 까먹으셨다면 재설정하시면 돼요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "비밀번호 오류",
        body: "입력하신 비밀번호가 일치하지 않습니다. 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    네트워크문제: {
      "토스 스타일": {
        title: "인터넷 연결을 확인해주세요",
        body: "네트워크 연결이 불안정해요. 잠시 후 다시 시도해주세요.",
        buttonText: "다시 시도",
      },
      "당근 스타일": {
        title: "연결이 끊겼어요",
        body: "Wi-Fi나 데이터 연결 확인하고 다시 해보세요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "네트워크 오류",
        body: "네트워크 연결 상태를 확인하신 후 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    결제실패: {
      "토스 스타일": {
        title: "결제에 실패했어요",
        body: "결제 중 문제가 발생했어요. 카드 정보를 확인하고 다시 시도해주세요.",
        buttonText: "다시 시도",
      },
      "당근 스타일": {
        title: "결제 실패했어요",
        body: "결제가 안 됐어요. 카드 정보 확인하고 다시 해보세요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "결제 실패",
        body: "결제 처리 중 오류가 발생했습니다. 카드 정보를 확인하고 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    입력정보불일치: {
      "토스 스타일": {
        title: "입력하신 정보가 일치하지 않아요",
        body: "입력하신 정보를 다시 확인해주세요. 정확히 입력해주시면 도와드릴게요.",
        buttonText: "다시 입력",
      },
      "당근 스타일": {
        title: "정보가 맞지 않아요",
        body: "입력하신 정보가 일치하지 않아요. 다시 확인해보세요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "입력 정보 불일치",
        body: "입력하신 정보가 일치하지 않습니다. 다시 확인해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    재고부족: {
      "토스 스타일": {
        title: "재고가 부족해요",
        body: "선택하신 상품의 재고가 부족해요. 다른 상품을 선택해주세요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "재고 없어요",
        body: "선택하신 상품 재고가 없어요. 다른 상품 선택해보세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "재고 부족",
        body: "선택하신 상품의 재고가 부족합니다. 다른 상품을 선택해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    파일업로드실패: {
      "토스 스타일": {
        title: "파일 업로드에 실패했어요",
        body: "파일을 업로드하는 중 문제가 발생했어요. 파일 크기나 형식을 확인하고 다시 시도해주세요.",
        buttonText: "다시 시도",
      },
      "당근 스타일": {
        title: "업로드 실패했어요",
        body: "파일 업로드가 안 됐어요. 파일 크기나 형식 확인하고 다시 해보세요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "파일 업로드 실패",
        body: "파일 업로드 중 오류가 발생했습니다. 파일 크기 및 형식을 확인하고 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    아이디중복: {
      "토스 스타일": {
        title: "이미 사용 중인 아이디예요",
        body: "입력하신 아이디는 이미 사용 중이에요. 다른 아이디를 선택해주세요.",
        buttonText: "다시 입력",
      },
      "당근 스타일": {
        title: "아이디가 중복됐어요",
        body: "이미 사용 중인 아이디예요. 다른 아이디 선택해보세요.",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "아이디 중복",
        body: "입력하신 아이디는 이미 사용 중입니다. 다른 아이디를 선택해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    default: {
      "토스 스타일": {
        title: "앗, 문제가 발생했어요",
        body: "요청을 처리하는 중에 오류가 발생했어요. 다시 시도해주세요.",
        buttonText: "다시 시도",
      },
      "당근 스타일": {
        title: "오류가 발생했어요",
        body: "예상치 못한 문제가 생겼네요. 다시 시도해주시겠어요?",
        buttonText: "재시도",
      },
      "드랍박스 스타일": {
        title: "오류가 발생했습니다",
        body: "일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
  },
  확인: {
    게시물삭제: {
      "토스 스타일": {
        title: "정말 삭제하시겠어요?",
        body: "삭제하시면 다시 복구할 수 없어요. 정말 삭제하시겠어요?",
        buttonText: "삭제하기",
      },
      "당근 스타일": {
        title: "삭제할까요?",
        body: "삭제하면 복구 안 돼요. 괜찮죠?",
        buttonText: "삭제",
      },
      "드랍박스 스타일": {
        title: "삭제 확인",
        body: "해당 게시물을 삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다.",
        buttonText: "삭제",
      },
    },
    계정탈퇴: {
      "토스 스타일": {
        title: "정말 떠나시는 건가요?",
        body: "계정을 탈퇴하시면 모든 데이터가 삭제되고 복구할 수 없어요. 그래도 탈퇴하시겠어요?",
        buttonText: "탈퇴하기",
      },
      "당근 스타일": {
        title: "탈퇴하시려고요?",
        body: "모든 데이터 다 사라져요. 진짜 탈퇴할까요?",
        buttonText: "탈퇴",
      },
      "드랍박스 스타일": {
        title: "계정 탈퇴 확인",
        body: "계정 탈퇴 시 모든 개인정보 및 이용 기록이 영구 삭제됩니다. 탈퇴하시겠습니까?",
        buttonText: "탈퇴",
      },
    },
    결제취소: {
      "토스 스타일": {
        title: "결제를 취소하시겠어요?",
        body: "결제를 취소하시면 주문이 취소돼요. 정말 취소하시겠어요?",
        buttonText: "취소하기",
      },
      "당근 스타일": {
        title: "결제 취소할까요?",
        body: "결제 취소하면 주문도 취소돼요. 정말 할까요?",
        buttonText: "취소",
      },
      "드랍박스 스타일": {
        title: "결제 취소 확인",
        body: "결제를 취소하시겠습니까? 취소 시 주문이 함께 취소됩니다.",
        buttonText: "취소",
      },
    },
    대량작업: {
      "토스 스타일": {
        title: "대량 작업을 진행하시겠어요?",
        body: "여러 항목을 한 번에 처리하는 작업이에요. 진행하시겠어요?",
        buttonText: "진행하기",
      },
      "당근 스타일": {
        title: "대량 작업 진행할까요?",
        body: "여러 개를 한 번에 처리하는 거예요. 진행할까요?",
        buttonText: "진행",
      },
      "드랍박스 스타일": {
        title: "대량 작업 확인",
        body: "여러 항목을 한 번에 처리하는 작업입니다. 진행하시겠습니까?",
        buttonText: "확인",
      },
    },
    개인정보동의철회: {
      "토스 스타일": {
        title: "개인정보 동의를 철회하시겠어요?",
        body: "동의를 철회하시면 일부 서비스를 이용하실 수 없어요. 정말 철회하시겠어요?",
        buttonText: "철회하기",
      },
      "당근 스타일": {
        title: "동의 철회할까요?",
        body: "동의 철회하면 일부 기능을 못 써요. 정말 할까요?",
        buttonText: "철회",
      },
      "드랍박스 스타일": {
        title: "개인정보 동의 철회 확인",
        body: "개인정보 동의를 철회하시겠습니까? 일부 서비스 이용이 제한될 수 있습니다.",
        buttonText: "확인",
      },
    },
    default: {
      "토스 스타일": {
        title: "계속 진행할까요?",
        body: "이 작업을 진행하시겠어요?",
        buttonText: "진행하기",
      },
      "당근 스타일": {
        title: "진행할까요?",
        body: "이대로 할까요?",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "확인",
        body: "해당 작업을 진행하시겠습니까?",
        buttonText: "확인",
      },
    },
  },
  경고: {
    쿠폰만료임박: {
      "토스 스타일": {
        title: "쿠폰이 곧 만료돼요",
        body: "사용하신 쿠폰이 곧 만료될 예정이에요. 빠르게 사용해주세요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "쿠폰 곧 만료돼요",
        body: "쿠폰이 곧 만료될 예정이에요. 빨리 사용하세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "쿠폰 만료 임박",
        body: "사용하신 쿠폰이 곧 만료될 예정입니다. 만료 전에 사용해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    보안위험: {
      "토스 스타일": {
        title: "보안 위험이 감지되었어요",
        body: "의심스러운 활동이 감지되었어요. 비밀번호를 변경해주세요.",
        buttonText: "비밀번호 변경",
      },
      "당근 스타일": {
        title: "보안 위험 감지됐어요",
        body: "의심스러운 활동이 있어요. 비밀번호 변경해주세요.",
        buttonText: "비밀번호 변경",
      },
      "드랍박스 스타일": {
        title: "보안 위험 감지",
        body: "의심스러운 활동이 감지되었습니다. 비밀번호를 변경해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    과도한사용: {
      "토스 스타일": {
        title: "사용량이 많아요",
        body: "오늘 사용량이 많아요. 잠시 후 다시 시도해주세요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "사용량이 너무 많아요",
        body: "오늘 사용량이 많아요. 나중에 다시 해보세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "사용량 초과",
        body: "일일 사용량을 초과하였습니다. 잠시 후 다시 시도해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    콘텐츠제한: {
      "토스 스타일": {
        title: "콘텐츠 접근이 제한되었어요",
        body: "이 콘텐츠는 연령 제한으로 인해 접근할 수 없어요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "접근이 제한됐어요",
        body: "이 콘텐츠는 연령 제한 때문에 볼 수 없어요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "콘텐츠 접근 제한",
        body: "이 콘텐츠는 연령 제한으로 인해 접근할 수 없습니다.",
        buttonText: "확인",
      },
    },
    default: {
      "토스 스타일": {
        title: "주의가 필요해요",
        body: "계속 진행하시기 전에 한 번 더 확인해주세요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "잠깐!",
        body: "이거 확인하고 진행하세요.",
        buttonText: "알겠어요",
      },
      "드랍박스 스타일": {
        title: "경고",
        body: "주의가 필요한 상황입니다. 확인 후 진행해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
  },
  정보: {
    기능업데이트: {
      "토스 스타일": {
        title: "새로운 기능이 추가됐어요! ✨",
        body: "더 나은 경험을 위해 새 기능을 추가했어요. 지금 바로 확인해보세요!",
        buttonText: "확인하기",
      },
      "당근 스타일": {
        title: "신기능 나왔어요!",
        body: "새 기능 추가됐어요. 한번 써보세요!",
        buttonText: "보러가기",
      },
      "드랍박스 스타일": {
        title: "기능 업데이트 안내",
        body: "서비스 개선을 위해 새로운 기능이 추가되었습니다. 업데이트 내용을 확인해주세요.",
        buttonText: "확인",
      },
    },
    약관변경: {
      "토스 스타일": {
        title: "약관이 변경될 예정이에요",
        body: "더 나은 서비스를 위해 이용약관이 변경돼요. 변경 내용을 확인해주세요.",
        buttonText: "확인하기",
      },
      "당근 스타일": {
        title: "약관이 바뀔 예정이에요",
        body: "서비스 개선을 위해 약관이 변경될 예정이에요. 한번 확인해보세요.",
        buttonText: "확인하기",
      },
      "드랍박스 스타일": {
        title: "이용약관 변경 안내",
        body: "서비스 개선을 위해 이용약관이 개정될 예정입니다. 변경 사항을 확인해주시기 바랍니다.",
        buttonText: "확인",
      },
    },
    권한설명: {
      "토스 스타일": {
        title: "권한이 필요해요",
        body: "이 기능을 사용하려면 권한이 필요해요. 허용해주시면 더 편하게 이용하실 수 있어요.",
        buttonText: "권한 허용",
      },
      "당근 스타일": {
        title: "권한이 필요해요",
        body: "이 기능 쓰려면 권한이 필요해요. 허용해주시면 더 편하게 쓸 수 있어요.",
        buttonText: "허용하기",
      },
      "드랍박스 스타일": {
        title: "권한 요청",
        body: "이 기능을 사용하기 위해 권한이 필요합니다. 권한을 허용해주시기 바랍니다.",
        buttonText: "허용",
      },
    },
    버전업데이트권유: {
      "토스 스타일": {
        title: "업데이트가 있어요",
        body: "더 나은 경험을 위해 새 버전이 나왔어요. 업데이트하시면 새로운 기능을 사용하실 수 있어요.",
        buttonText: "업데이트하기",
      },
      "당근 스타일": {
        title: "업데이트 나왔어요!",
        body: "새 버전이 나왔어요. 업데이트하시면 더 좋은 기능을 쓸 수 있어요.",
        buttonText: "업데이트",
      },
      "드랍박스 스타일": {
        title: "업데이트 안내",
        body: "새로운 버전이 출시되었습니다. 업데이트하시면 개선된 기능을 이용하실 수 있습니다.",
        buttonText: "업데이트",
      },
    },
    default: {
      "토스 스타일": {
        title: "안내사항이 있어요",
        body: "확인해야 할 내용이 있어요. 잠깐만 시간 내주세요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "알려드려요",
        body: "이거 한번 봐주세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "안내",
        body: "중요한 안내사항이 있습니다. 확인 부탁드립니다.",
        buttonText: "확인",
      },
    },
  },
  기타: {
    default: {
      "토스 스타일": {
        title: "알림",
        body: "확인해야 할 내용이 있어요.",
        buttonText: "확인",
      },
      "당근 스타일": {
        title: "알림",
        body: "체크해보세요.",
        buttonText: "확인",
      },
      "드랍박스 스타일": {
        title: "알림",
        body: "확인이 필요한 사항입니다.",
        buttonText: "확인",
      },
    },
  },
};

function generateCopy(
  modalType: ModalType,
  situation: string,
  customDescription: string,
): GeneratedCopy[] {
  const brandStyles: BrandStyle[] = [
    "토스 스타일",
    "당근 스타일",
    "드랍박스 스타일",
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

  return brandStyles.map((brandStyle) => {
    const template = situationTemplates[brandStyle];

    // If custom description is provided, slightly modify the body
    let body = template.body;
    if (customDescription) {
      body = `${template.body} ${customDescription}`;
    }

    return {
      brandStyle,
      title: template.title,
      body,
      buttonText: template.buttonText || "확인",
    };
  });
}

// URL 경로에서 페이지 타입 추출
function getPageFromPath(): "home" | "tools" | "symbols" | "planning-compass" | "design-description" {
  const path = window.location.pathname;
  const search = window.location.search;
  
  // GitHub Pages 404 리다이렉트 처리: ?/tools 또는 ?/symbols 형태
  if (search.startsWith("?/")) {
    const redirectPath = search.slice(2).split("&")[0].split("~and~")[0];
    if (redirectPath.includes("tools")) return "tools";
    if (redirectPath.includes("symbols")) return "symbols";
    if (redirectPath.includes("planning-compass")) return "planning-compass";
    if (redirectPath.includes("design-description")) return "design-description";
  }
  
  // 일반 경로 처리
  if (path.endsWith("/tools") || path.includes("/tools/")) return "tools";
  if (path.endsWith("/symbols") || path.includes("/symbols/")) return "symbols";
  if (path.endsWith("/planning-compass") || path.includes("/planning-compass/")) return "planning-compass";
  if (path.endsWith("/design-description") || path.includes("/design-description/")) return "design-description";
  return "home";
}

// Google Analytics 페이지뷰 전송
function sendPageView(page: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", "G-201M5WQSCM", {
      page_path: window.location.pathname + window.location.search,
      page_title: page,
    });
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "tools" | "symbols" | "planning-compass" | "design-description">(() => getPageFromPath());
  const [modalType, setModalType] = useState<ModalType>("성공");
  const [situation, setSituation] = useState<string>("");
  const [customModalType, setCustomModalType] =
    useState<string>("");
  const [results, setResults] = useState<
    GeneratedCopy[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputAreaRef = useRef<HTMLDivElement>(null);

  // URL 변경 감지 및 페이지뷰 전송
  useEffect(() => {
    const handlePopState = () => {
      const page = getPageFromPath();
      setCurrentPage(page);
      sendPageView(page);
    };

    window.addEventListener("popstate", handlePopState);
    
    // 초기 페이지뷰 전송 (약간의 지연을 두어 gtag가 로드될 시간 확보)
    setTimeout(() => {
      sendPageView(currentPage);
    }, 100);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentPage]);

  // 페이지 변경 시 URL 업데이트 및 페이지뷰 전송
  const handlePageChange = (page: "home" | "tools" | "symbols" | "planning-compass" | "design-description") => {
    setCurrentPage(page);
    
    // 현재 base path 가져오기 (GitHub Pages: /modalcopy/, 로컬: /)
    const base = import.meta.env.BASE_URL || "/modalcopy/";
    let path = base;
    if (page === "tools") path = `${base}tools`;
    else if (page === "symbols") path = `${base}symbols`;
    else if (page === "planning-compass") path = `${base}planning-compass`;
    else if (page === "design-description") path = `${base}design-description`;
    
    // trailing slash 제거 (홈의 경우만 유지)
    if (path !== base && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    
    window.history.pushState({ page }, "", path);
    sendPageView(page);
  };

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

  // 공통 Sidebar 메뉴 구성
  const menuItems = [
    {
      id: "home",
      label: "3가지 톤으로 작성한 UI카피 보기",
      icon: Home,
      page: "home" as const,
    },
    {
      id: "symbols",
      label: "맥에서 특수기호 입력하기",
      icon: Hash,
      page: "symbols" as const,
    },
    {
      id: "tools",
      label: "기획자가 자주 사용하는 도구 보기",
      icon: Sparkles,
      page: "tools" as const,
    },
    {
      id: "planning-compass",
      label: "기획 프로세스별로 꿀팁 보기",
      icon: Compass,
      page: "planning-compass" as const,
    },
    {
      id: "design-description",
      label: "화면설계서 빠짐없이 작성하기",
      icon: FileText,
      page: "design-description" as const,
    },
  ];

  // 특수기호 페이지 렌더링
  if (currentPage === "symbols") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="font-semibold text-lg">모달카피</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handlePageChange(item.page)}
                            isActive={currentPage === item.page}
                            tooltip={item.label}
                            size="sm"
                            className={cn(
                              "text-xs text-muted-foreground",
                              currentPage === item.page && "text-foreground font-medium"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <Header currentPage={currentPage} onNavigate={handlePageChange} menuItems={menuItems} />
            <SymbolPalette onNavigateToTools={() => handlePageChange("tools")} />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // 기획약국 페이지 렌더링
  if (currentPage === "tools") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="font-semibold text-lg">모달카피</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handlePageChange(item.page)}
                            isActive={currentPage === item.page}
                            tooltip={item.label}
                            size="sm"
                            className={cn(
                              "text-xs text-muted-foreground",
                              currentPage === item.page && "text-foreground font-medium"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <Header currentPage={currentPage} onNavigate={handlePageChange} menuItems={menuItems} />
            <ToolDashboard 
              onNavigateHome={() => handlePageChange("home")}
              onNavigateToSymbols={() => handlePageChange("symbols")}
            />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // 기획나침반 페이지 렌더링
  if (currentPage === "planning-compass") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="font-semibold text-lg">모달카피</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handlePageChange(item.page)}
                            isActive={currentPage === item.page}
                            tooltip={item.label}
                            size="sm"
                            className={cn(
                              "text-xs text-muted-foreground",
                              currentPage === item.page && "text-foreground font-medium"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <Header currentPage={currentPage} onNavigate={handlePageChange} menuItems={menuItems} />
            <PlanningCompass />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // 설계서 작성기 페이지 렌더링
  if (currentPage === "design-description") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar collapsible="none">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-2 py-2">
                <span className="font-semibold text-lg">모달카피</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => handlePageChange(item.page)}
                            isActive={currentPage === item.page}
                            tooltip={item.label}
                            size="sm"
                            className={cn(
                              "text-xs text-muted-foreground",
                              currentPage === item.page && "text-foreground font-medium"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 flex flex-col">
            <Header currentPage={currentPage} onNavigate={handlePageChange} menuItems={menuItems} />
            <DesignDescriptionGenerator />
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <span className="font-semibold text-lg">모달카피</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>메뉴</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => handlePageChange(item.page)}
                          isActive={currentPage === item.page}
                          tooltip={item.label}
                        >
                          <Icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <Header currentPage={currentPage} onNavigate={handlePageChange} menuItems={menuItems} />
      <Hero 
        onStartClick={handleStartClick} 
        onNavigateToTools={() => handlePageChange("tools")}
      />

      {/* Main Input Area */}
      <div
        ref={inputAreaRef}
        className="w-full max-w-[800px] mx-auto px-6 mb-12"
      >
        <div className="bg-white rounded-xl shadow-md p-8 border border-border">
          {/* Brand Tone Description */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-3 text-muted-foreground">브랜드 톤앤매너</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                #토스: 인간적인 금융, 공감, 명료함, 부담 없는 유머, 일관성
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                #당근: 동네, 이웃, 편안함, 솔직함, 따뜻함
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                #드랍박스: 단순함, 신뢰성, 차분함, 프로페셔널, 명료함
              </span>
            </div>
          </div>
          
          {/* Dual List Selection */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {/* Left: Modal Type List */}
            <div>
              <label className="block mb-3 font-medium">모달 유형</label>
              <div className="border border-border rounded-lg overflow-hidden">
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
                  <div
                    key={type}
                    onClick={() => handleModalTypeChange(type)}
                    className={cn(
                      "px-4 py-3 cursor-pointer border-b border-border last:border-b-0 transition-colors",
                      modalType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-white hover:bg-accent"
                    )}
                  >
                    <div className="font-medium">{type}</div>
                    <div className={`text-xs mt-1 ${
                      modalType === type ? "text-white/80" : "text-muted-foreground"
                    }`}>
                      {modalTypeExamples[type]}
                    </div>
                  </div>
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

            {/* Right: Situation List */}
            <div>
              <label className="block mb-3 font-medium">상황 선택</label>
              {modalType !== "기타" ? (
                <div className="border border-border rounded-lg overflow-hidden">
                  {situationOptions[modalType].map((sit) => {
                    const preview = generateCopy(modalType, sit, "")[0]; // 첫 번째 예시만 (토스 스타일)
                    const isSelected = situation === sit;
                    return (
                      <div key={sit}>
                        <div
                          onClick={() => setSituation(sit)}
                          className={cn(
                            "px-4 py-3 cursor-pointer border-b border-border transition-all duration-200",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-white hover:bg-accent"
                          )}
                        >
                          {sit}
                        </div>
                        {/* Preview Example - Only show for selected option with animation */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isSelected
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-4 py-3 bg-gray-50 border-b border-border">
                            <div className={`text-sm font-semibold mb-1 transition-all duration-200 ${
                              isSelected ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                            }`}>
                              {preview.title}
                            </div>
                            <div className={`text-xs text-muted-foreground transition-all duration-300 delay-75 ${
                              isSelected ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                            }`}>
                              {preview.body}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-border rounded-lg p-4 text-center text-muted-foreground">
                  위에서 모달 유형을 입력해주세요
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? "생성 중..." : "문구 생성하기"}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {results && results.length > 0 && (
        <div
          id="results"
          className="w-full max-w-[800px] mx-auto px-6 mb-12"
        >
          <div className="mb-6">
            <h2>생성된 문구</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <ResultCard
                key={index}
                brandStyle={result.brandStyle}
                title={result.title}
                body={result.body}
                buttonText={result.buttonText}
              />
            ))}
          </div>
        </div>
      )}

      {/* Spell Checker Section - 별도 영역 */}
      <section className="max-w-[800px] mx-auto px-6 mb-12" aria-label="맞춤법 검사">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20" aria-label="신규 기능">
                NEW
              </span>
              <h2 className="text-xl font-semibold">맞춤법 검사</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              생성된 문구를 복사하여 아래 입력창에 붙여넣고 맞춤법을 검사하세요. 네이버 맞춤법 검사기를 사용하여 띄어쓰기, 맞춤법, 표준어 오류를 자동으로 찾아드립니다.
            </p>
          </div>
          <SpellChecker
            initialText=""
            maxLength={300}
            onTextChange={(newText) => {
              // 텍스트 변경 시 처리 (필요시)
            }}
          />
        </div>
      </section>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="max-w-[800px] mx-auto px-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
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
      </div>
    </SidebarProvider>
  );
}