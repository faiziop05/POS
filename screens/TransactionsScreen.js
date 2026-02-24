import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MACHINE_ID, API_URL } from "../utils/constants";



const TransactionsScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/transections/${MACHINE_ID}`);
      if (!response.ok) throw new Error("Could not load sales");
      const data = await response.json();
      setTransactions(data);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return isToday ? `Today, ${timeStr}` : date.toLocaleDateString([], { month: "short", day: "numeric" }) + `, ${timeStr}`;
  };

  const getStatus = (status) => {
    switch ((status || "").toUpperCase()) {
      case "SUCCESS":
      case "COMPLETED":
        return { label: "Success", color: "#10B981", bg: "rgba(16,185,129,0.12)", dot: "#10B981" };
      case "PENDING":
        return { label: "Pending", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", dot: "#F59E0B" };
      default:
        return { label: "Failed", color: "#F43F5E", bg: "rgba(244,63,94,0.12)", dot: "#F43F5E" };
    }
  };

  const renderItem = ({ item }) => {
    const st = getStatus(item.status);
    return (
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: st.dot }]} />

        <View style={styles.rowLeft}>
          <Text style={styles.rowAmount}>£{parseFloat(item.amount).toFixed(2)}</Text>
          <Text style={styles.rowTime}>{formatTime(item.createdAt)}</Text>
        </View>

        <View style={[styles.badge, { backgroundColor: st.bg }]}>
          <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#F1F5F9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales</Text>
        <TouchableOpacity style={styles.backBtn} onPress={fetchSales}>
          <Ionicons name="refresh-outline" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.centerText}>Loading...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={52} color="#F43F5E" />
          <Text style={styles.centerText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchSales}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && transactions.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={52} color="#334155" />
          <Text style={styles.centerText}>No sales yet today</Text>
        </View>
      )}

      {!loading && !error && transactions.length > 0 && (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#F8FAFC" },

  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowLeft: { flex: 1 },
  rowAmount: { fontSize: 20, fontWeight: "700", color: "#F8FAFC" },
  rowTime: { fontSize: 13, color: "#64748B", marginTop: 3, fontWeight: "500" },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 13, fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 },
  centerText: { fontSize: 16, color: "#64748B", textAlign: "center", fontWeight: "500" },
  retryBtn: {
    backgroundColor: "#1E293B",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  retryText: { color: "#F1F5F9", fontSize: 15, fontWeight: "700" },
});

export default TransactionsScreen;
