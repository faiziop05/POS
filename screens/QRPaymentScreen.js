import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MACHINE_ID, API_URL, QR_SESSION_TIMEOUT_MS, POLL_INTERVAL_MS } from "../utils/constants";

const QRPaymentScreen = ({ route, navigation }) => {
  const { amount, idempotencyKey, paymentToken } = route.params;
  const { width } = useWindowDimensions();
  const QR_SIZE = Math.min(width - 96, 280);

  const [phase, setPhase] = useState("loading");
  const [transactionId, setTransactionId] = useState(null);
  const [qrData, setQrData] = useState(null);

  const pollingTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);

  const isFail = paymentToken === "fail_token";

  const stopSession = () => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
  };

  useEffect(() => {
    createQR();
    return () => stopSession();
  }, []);

  const createQR = async () => {
    setPhase("loading");
    try {
      const response = await fetch(`${API_URL}/payments/createQrPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineId: MACHINE_ID,
          amount: parseFloat(amount),
          currency: "GBP",
          idempotencyKey,
          paymentToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        navigation.replace("Result", {
          success: false,
          message: data.message || "Failed to create QR payment.",
        });
        return;
      }

      setTransactionId(data.transactionId);
      setQrData(data.qrData || String(data.transactionId));
      setPhase("ready");

      sessionTimerRef.current = setTimeout(() => {
        stopSession();
        navigation.replace("Result", {
          success: false,
          message: "QR code expired. The customer did not scan in time.",
        });
      }, QR_SESSION_TIMEOUT_MS);

    } catch {
      navigation.replace("Result", {
        success: false,
        message: "Network Error. Could not generate QR payment.",
      });
    }
  };

  const handleSimulate = async () => {
    if (!transactionId) return;
    setPhase("polling");
    stopSession();

    try {
      const res = await fetch(
        `${API_URL}/payments/QrPayment/simulate/${transactionId}`,
        { method: "POST" },
      );
      const data = await res.json();

      if (data.status === "COMPLETED") {
        navigation.replace("Result", { success: true, amount, transactionId });
      } else {
        navigation.replace("Result", {
          success: false,
          message: data.message || "The QR payment was declined.",
        });
      }
    } catch {
      navigation.replace("Result", {
        success: false,
        message: "Network Error. Could not process QR payment.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { stopSession(); navigation.goBack(); }}
          style={styles.backBtn}
          disabled={phase === "polling"}
        >
          <Ionicons
            name="chevron-back"
            size={26}
            color={phase === "polling" ? "#334155" : "#F1F5F9"}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.currencySymbol}>£</Text>
        <Text style={styles.amountText}>{parseFloat(amount).toFixed(2)}</Text>
      </View>

      <View style={styles.content}>

        {phase === "loading" && (
          <View style={styles.card}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.cardLabel}>Generating QR Code...</Text>
            <Text style={styles.cardSub}>Connecting to payment server</Text>
          </View>
        )}

        {phase === "ready" && qrData && (
          <View style={styles.card}>
            <Text style={styles.scanHint}>Ask the customer to scan</Text>

            <View style={[styles.qrBox]}>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=${QR_SIZE}x${QR_SIZE}&data=${encodeURIComponent(qrData)}&margin=10` }}
                style={{ width: QR_SIZE, height: QR_SIZE }}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {phase === "polling" && (
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(16,185,129,0.12)" }]}>
              <Ionicons name="checkmark-circle-outline" size={52} color="#10B981" />
            </View>
            <Text style={[styles.cardLabel, { color: "#10B981" }]}>Payment Received</Text>
            <Text style={styles.cardSub}>Verifying with bank — please wait</Text>
            <View style={styles.waitRow}>
              <ActivityIndicator size="small" color="#64748B" />
              <Text style={styles.waitText}>Processing...</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {phase === "ready" && (
          <TouchableOpacity style={styles.ctaBtn} onPress={handleSimulate} activeOpacity={0.85}>
            <Ionicons name="phone-portrait-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.ctaBtnText}>Simulate QR Code Payment</Text>
          </TouchableOpacity>
        )}
        {phase === "polling" && (
          <Text style={styles.footerHint}>Do not navigate away</Text>
        )}
        {phase === "loading" && (
          <Text style={styles.footerHint}>Connecting to server...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#F8FAFC" },

  amountRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingTop: 28,
    paddingBottom: 8,
    gap: 4,
  },
  currencySymbol: { fontSize: 34, fontWeight: "300", color: "#3B82F6", paddingBottom: 10 },
  amountText: { fontSize: 68, fontWeight: "800", color: "#F8FAFC", letterSpacing: -2 },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 10
  },

  scanHint: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  qrBox: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  qrBoxFail: {
    borderColor: "#F43F5E",
  },

  simBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(244,63,94,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  simBadgeText: { color: "#F43F5E", fontSize: 13, fontWeight: "700" },

  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  cardLabel: { fontSize: 20, fontWeight: "800", color: "#F8FAFC" },
  cardSub: { fontSize: 14, color: "#64748B", fontWeight: "500", textAlign: "center" },
  waitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  waitText: { fontSize: 13, color: "#64748B", fontWeight: "500" },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    alignItems: "center",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#3B82F6",
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  footerHint: { fontSize: 13, color: "#475569", fontWeight: "500" },
});

export default QRPaymentScreen;
