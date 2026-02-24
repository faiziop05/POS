import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SIM_MODES } from "../utils/constants";



const HomeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("0");
  const [simMode, setSimMode] = useState("success");

  const handlePress = (val) => {
    setAmount((prev) => {
      if (val === "⌫") return prev.length > 1 ? prev.slice(0, -1) : "0";
      if (val === ".") return prev.includes(".") ? prev : prev + ".";
      if (prev === "0") return val === "." ? "0." : val;
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev;
      return prev + val;
    });
  };

  const handleCheckout = (method) => {
    if (amount === "0" || amount === "0.") return;
    const newIdempotencyKey = `pos_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const paymentToken = SIM_MODES[simMode].token;
    if (method === "CARD") {
      navigation.navigate("PaymentScreen", { amount, method, idempotencyKey: newIdempotencyKey, paymentToken });
    } else {
      navigation.navigate("QRPaymentScreen", { amount, method, idempotencyKey: newIdempotencyKey, paymentToken });
    }
  };

  const isZero = amount === "0" || amount === "0.";
  const sim = SIM_MODES[simMode];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.pill, { backgroundColor: sim.bg }]}
          onPress={() => setSimMode(sim.next)}
          activeOpacity={0.7}
        >
          <Ionicons name={sim.icon} size={15} color={sim.color} />
          <Text style={[styles.pillText, { color: sim.color }]}>{sim.label}</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => navigation.navigate("TransactionsScreen")}
          >
            <Ionicons name="receipt-outline" size={15} color="#94A3B8" />
            <Text style={styles.pillText}>Sales</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.displayArea}>
        <Text style={styles.currencySymbol}>£</Text>
        <Text style={styles.amountText} numberOfLines={1} adjustsFontSizeToFit>
          {amount.endsWith(".") ? amount + "00" : parseFloat(amount).toFixed(2)}
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"].map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handlePress(key)}
            activeOpacity={0.6}
          >
            <Text style={[styles.keyText, key === "⌫" && styles.backspaceText]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          disabled={isZero}
          style={[styles.actionBtn, styles.qrBtn, isZero && styles.disabledBtn]}
          onPress={() => handleCheckout("QR")}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code-outline" size={20} color={isZero ? "#475569" : "#3B82F6"} />
          <Text style={[styles.actionBtnText, { color: isZero ? "#475569" : "#3B82F6" }]}>QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isZero}
          style={[styles.actionBtn, styles.cardBtn, isZero && styles.disabledBtn]}
          onPress={() => handleCheckout("CARD")}
          activeOpacity={0.8}
        >
          <Ionicons name="card-outline" size={20} color={isZero ? "#475569" : "#FFFFFF"} />
          <Text style={[styles.actionBtnText, { color: isZero ? "#475569" : "#FFFFFF" }]}>Charge Card</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  pillText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 18,
  },

  displayArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  currencySymbol: {
    fontSize: 42,
    fontWeight: "300",
    color: "#3B82F6",
    marginBottom: 10,
    marginRight: 4,
  },
  amountText: {
    fontSize: 88,
    fontWeight: "800",
    color: "#F8FAFC",
    letterSpacing: -3,
  },

  keypadContainer: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignContent: "center",
  },
  key: {
    width: "31%",
    aspectRatio: 1.4,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  keyText: { fontSize: 28, fontWeight: "500", color: "#F1F5F9" },
  backspaceText: { color: "#F43F5E" },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  qrBtn: { backgroundColor: "#1E3A5F", borderWidth: 1.5, borderColor: "#3B82F6" },
  cardBtn: { backgroundColor: "#10B981" },
  disabledBtn: { backgroundColor: "#1E293B", borderColor: "#334155" },
  actionBtnText: { fontSize: 16, fontWeight: "700" },
});

export default HomeScreen;
