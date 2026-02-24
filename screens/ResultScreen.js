import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ResultScreen = ({ route, navigation }) => {
  const { success, amount, message, transactionId } = route.params;

  const bgColor = success ? "#022C22" : "#1C0A0E";
  const accentColor = success ? "#10B981" : "#F43F5E";
  const accentBg = success ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)";
  const iconName = success ? "checkmark-circle" : "close-circle";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.inner}>
        <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>
          <Ionicons name={iconName} size={72} color={accentColor} />
        </View>

        <Text style={styles.title}>
          {success ? "Payment Approved" : "Payment Failed"}
        </Text>

        {success && (
          <Text style={[styles.amount, { color: accentColor }]}>£{parseFloat(amount).toFixed(2)}</Text>
        )}
        {!success && (
          <Text style={styles.errorMsg}>
            {message || "The customer's card was declined. Please ask for another payment method."}
          </Text>
        )}
        {success && (
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: accentBg }]}>
                <Text style={[styles.statusBadgeText, { color: accentColor }]}>Approved ✓</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transaction ID</Text>
              <Text style={styles.receiptValue} numberOfLines={1} ellipsizeMode="middle">
                {String(transactionId).slice(0, 18)}…
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Time</Text>
              <Text style={styles.receiptValue}>
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: accentColor }]}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Home" }] })}
          activeOpacity={0.85}
        >
          <Ionicons
            name={success ? "add-circle-outline" : "refresh-outline"}
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.ctaBtnText}>
            {success ? "New Sale" : "Try Again"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 16,
  },

  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F8FAFC",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  amount: {
    fontSize: 64,
    fontWeight: "800",
    letterSpacing: -2,
  },
  errorMsg: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },

  receiptCard: {
    width: "100%",
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  receiptLabel: { fontSize: 14, color: "#64748B", fontWeight: "500" },
  receiptValue: {
    fontSize: 14,
    color: "#CBD5E1",
    fontWeight: "600",
    maxWidth: "55%",
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: { fontSize: 13, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 10,
  },

  footer: { paddingHorizontal: 24, paddingBottom: 28 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
  },
  ctaBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
});

export default ResultScreen;
