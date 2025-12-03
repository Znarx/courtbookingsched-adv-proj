// screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  ScrollView
} from "react-native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const { width, height } = Dimensions.get("window");

export default function AdminScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user || user.email !== "admin@gmail.com") {
      Alert.alert("Access Denied", "Admins only");
      navigation.replace("Login");
      return;
    }

    const unsub = onSnapshot(collection(db, "reservations"), (snap) => {
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        status: d.data().status || "Pending"
      }));

      // Sort by dateTime
      list.sort((a, b) => {
        const ta = a.dateTime?.toDate ? a.dateTime.toDate().getTime() : 0;
        const tb = b.dateTime?.toDate ? b.dateTime.toDate().getTime() : 0;
        return tb - ta;
      });

      setReservations(list);
    }, err => {
      console.warn("Firestore listener error:", err);
      Alert.alert("Firestore Error", err.message || "Check console");
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (e) {
      Alert.alert("Logout Failed", e.message || "Try again");
    }
  };

  const markReserved = async (id) => {
    try {
      await updateDoc(doc(db, "reservations", id), {
        status: "Reserved"
      });
    } catch (e) {
      Alert.alert("Update Failed", e.message || "Could not mark reserved");
    }
  };

  const remove = (id) => {
    Alert.alert("Confirm Delete", "Delete this reservation?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "reservations", id));
          } catch (e) {
            Alert.alert("Delete Failed", e.message || "Could not delete");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const dateText = item.dateTime?.toDate
      ? item.dateTime.toDate().toLocaleString()
      : "No date";

    const isReserved = item.status === "Reserved";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.court}>{item.court}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isReserved ? "#27ae60" : "#f39c12" }
            ]}
          >
            <Text style={styles.badgeText}>
              {isReserved ? "RESERVED" : "PENDING"}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.meta}>{dateText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.meta}>{item.userEmail || "Unknown User"}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {!isReserved && (
            <TouchableOpacity 
              style={styles.approveBtn} 
              onPress={() => markReserved(item.id)}
            >
              <Text style={styles.actionText}>Approve</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.deleteBtn, !isReserved && styles.deleteMargin]} 
            onPress={() => remove(item.id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/court.jpg")}
      resizeMode="cover"
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      {/* Glass Header */}
      <View style={styles.glassHeader}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {reservations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No reservations yet.</Text>
        </View>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width,
    height,
    flex: 1
  },

  // Glass Header
  glassHeader: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
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

  title: {
    color: "#2d3436",
    top: 10,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5
  },

  logout: {
    color: "#d63031",
    top: 10,
    fontWeight: "700",
    fontSize: 14
  },

  listContent: {
    paddingBottom: 20,
    paddingTop: 15
  },

  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyText: {
    color: "#2d3436",
    fontSize: 16,
    fontStyle: "italic"
  },

  // Glass Card with transparency
  card: {
    marginHorizontal: 15,
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 160
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)"
  },

  court: {
    color: "#2d3436",
    fontSize: 18,
    fontWeight: "700",
    flex: 1
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5
  },

  infoSection: {
    marginBottom: 15
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },

  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 20
  },

  meta: {
    color: "#2d3436",
    fontSize: 14,
    flex: 1
  },

  actions: {
    flexDirection: "row",
    gap: 10
  },

  approveBtn: {
    flex: 1,
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2
  },

  deleteMargin: {
    marginLeft: 10
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14
  }
});