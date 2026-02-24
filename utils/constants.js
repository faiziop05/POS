export const MACHINE_ID = "6999d50e627457ce359566dc";
export const API_URL = "http://192.168.1.198:5000/api";

export const QR_SESSION_TIMEOUT_MS = 2 * 60 * 1000;
export const POLL_INTERVAL_MS = 3000;

export const SIM_MODES = {
    success: {
        token: "success_token",
        label: "Valid",
        icon: "checkmark-circle",
        color: "#10B981",
        bg: "rgba(16,185,129,0.15)",
        next: "fail",
    },
    fail: {
        token: "fail_token",
        label: "Invalid",
        icon: "close-circle",
        color: "#F43F5E",
        bg: "rgba(244,63,94,0.15)",
        next: "success",
    },
};

export const CARD_STEPS = [
    { key: "ready", icon: "card-outline", label: "Ready", subtitle: "Tap, Insert or Swipe Card", color: "#94A3B8" },
    { key: "reading", icon: "scan-outline", label: "Reading Card...", subtitle: "Please hold card still", color: "#3B82F6" },
    { key: "processing", icon: "refresh-circle-outline", label: "Processing...", subtitle: "Do not remove card", color: "#10B981" },
];

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
