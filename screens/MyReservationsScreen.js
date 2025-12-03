// screens/MyReservationsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  LayoutAnimation,
  ImageBackground,
  Dimensions
} from "react-native";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function MyReservationsScreen() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");

  // Fetch reservations
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "reservations"),
      where("userId", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        data.sort((a, b) => b.dateTime.seconds - a.dateTime.seconds);
        try { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); } catch (e) {}
        setBookings(data);
      },
      (err) => console.warn("Listener error:", err)
    );
    return () => unsub();
  }, []);

  // Cancel booking
  const cancelBooking = (id, status) => {
    if (status === "Reserved") return Alert.alert("Locked", "This reservation is already reserved.");
    Alert.alert("Confirm", "Cancel this booking?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          try { await deleteDoc(doc(db, "reservations", id)); }
          catch (err) { Alert.alert("Error", err.message); }
        }
      }
    ]);
  };

  const filtered = bookings.filter(b => filter === "All" ? true : (b.status || "Pending") === filter);

  const renderItem = ({ item }) => {
    const status = item.status || "Pending";
    const isReserved = status === "Reserved";
    const itemDate = new Date(item.dateTime.seconds * 1000);
    const urgent = itemDate.getTime() - Date.now() <= 24 * 3600 * 1000;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.courtName}>🏟 {item.court}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isReserved ? "#27ae60" : "#f39c12" }]}>
            <Text style={styles.statusText}>{isReserved ? "✅ Reserved" : "⏳ Pending"}</Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.dateText}>📅 {itemDate.toLocaleString()}</Text>
          {urgent && <Text style={styles.urgentText}>⚠️ Urgent (within 24h)</Text>}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={[styles.cancelBtn, isReserved && styles.disabledBtn]} onPress={() => cancelBooking(item.id, status)}>
            <Text style={styles.cancelText}>{isReserved ? "🔒 Locked" : "❌ Cancel"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require("../assets/court.jpg")} resizeMode="cover" style={styles.background} imageStyle={{ opacity: 0.3 }}>
      <View style={styles.container}>
        <View style={styles.glassHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <View style={styles.backIconContainer}>
              <Image source={require("../assets/back.png")} style={styles.backIcon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>My Reservations</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.filtersContainer}>
          {["All", "Pending", "Reserved"].map(f => (
            <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.activeFilter]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📭 No reservations found</Text>
            </View>
          }
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
     width, 
     height, 
     flex: 1 
    },
  container:
   {
     flex: 1
    },

  glassHeader: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3

  },
  backBtn: { 
    width: 40 
  },
  backIconContainer: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)"
  },

  backIcon: 
  { width: 24,
    height: 24 
  },

  title: 
  { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#2d3436", 
    flex: 1, 
    textAlign: "center" 
  },

  placeholder: 
  { 
    width: 40 
  },

  filtersContainer: 
  { 
    flexDirection: "row", 
    justifyContent: "center", 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    gap: 10 
  },

  filterBtn: 
  { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: "rgba(255,255,255,0.3)", 
    borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" 
  },
  activeFilter: 
  { 
    backgroundColor: "#0066cc", 
    borderColor: "#0066cc" 
  },
  
  filterText: { color: "#2d3436", fontWeight: "600", fontSize: 14 },
  activeFilterText: { color: "#fff" },

  listContent: { paddingHorizontal: 15, paddingBottom: 30 },

  card: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)" },
  courtName: { fontSize: 18, fontWeight: "700", color: "#2d3436", flex: 1, backgroundColor: "transparent" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 11, backgroundColor: "transparent" },

  cardInfo: { marginBottom: 12 },
  dateText: { fontSize: 15, color: "#2d3436", marginBottom: 6, backgroundColor: "transparent" },
  urgentText: { color: "#e74c3c", fontWeight: "700", fontSize: 13, backgroundColor: "transparent" },

  cardActions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, backgroundColor: "#e74c3c", paddingVertical: 12, borderRadius: 10, alignItems: "center", elevation: 2 },
  disabledBtn: { backgroundColor: "#95a5a6", opacity: 0.7 },
  cancelText: { color: "#fff", fontWeight: "700", fontSize: 14, backgroundColor: "transparent" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: "#2d3436", fontWeight: "500" }
});
