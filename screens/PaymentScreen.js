import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MACHINE_ID, API_URL, CARD_STEPS, sleep } from "../utils/constants";

const PaymentScreen = ({ route, navigation }) => {
  const { amount, method, idempotencyKey, paymentToken } = route.params;

  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const fadeToNext = (nextIndex) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setStepIndex(nextIndex);
  };

  const handleSimulate = async () => {
    setStarted(true);
    fadeToNext(1);
    await sleep(1200);
    fadeToNext(2);

    try {
      const response = await fetch(`${API_URL}/payments/`, {
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
      const result = await response.json();
      if (response.ok) {
        navigation.replace("Result", { success: true, amount, transactionId: result.transactionId });
      } else {
        navigation.replace("Result", { success: false, message: result.message || "Card was declined." });
      }
    } catch {
      navigation.replace("Result", { success: false, message: "Network Error. Please try again." });
    }
  };

  const step = CARD_STEPS[stepIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          disabled={started}
        >
          <Ionicons name="chevron-back" size={26} color={started ? "#334155" : "#F1F5F9"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.currencySymbol}>£</Text>
        <Text style={styles.amountText}>{parseFloat(amount).toFixed(2)}</Text>
      </View>
      <View style={styles.statusArea}>
        <Animated.View style={[styles.statusCard, { opacity: fadeAnim }]}>
          <View style={[styles.iconCircle, { backgroundColor: step.color + "1A" }]}>
            <Ionicons name={step.icon} size={40} color={step.color} />
          </View>
          <Text style={[styles.statusLabel, { color: step.color }]}>{step.label}</Text>
          <Text style={styles.statusSub}>{step.subtitle}</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        {!started ? (
          <TouchableOpacity style={styles.ctaBtn} onPress={handleSimulate} activeOpacity={0.85}>
            <Ionicons name="card" size={20} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.ctaBtnText}>Simulate Card Tap</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.processingRow}>
            <View style={styles.processingDot} />
            <Text style={styles.processingText}>Processing — do not remove card</Text>
          </View>
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
    paddingTop: 40,
    paddingBottom: 12,
    gap: 4,
  },
  currencySymbol: { fontSize: 36, fontWeight: "300", color: "#3B82F6", paddingBottom: 10 },
  amountText: { fontSize: 72, fontWeight: "800", color: "#F8FAFC", letterSpacing: -2 },

  statusArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  statusCard: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statusLabel: { fontSize: 20, fontWeight: "800" },
  statusSub: { fontSize: 14, color: "#64748B", fontWeight: "500", textAlign: "center" },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: "center",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#10B981",
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaBtnText: { color: "#0F172A", fontSize: 17, fontWeight: "800" },

  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  processingText: { color: "#64748B", fontSize: 14, fontWeight: "500" },
});

export default PaymentScreen;
