// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions
} from "react-native";
import { auth } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const user = auth.currentUser;

  return (
    <ImageBackground
      source={require("../assets/court.jpg")}
      resizeMode="cover"
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        {/* Glass Header Card */}
        <View style={styles.glassHeader}>
          <Image
            source={require("../assets/avatar.png")}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {user?.email?.split("@")[0]}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserTabs", { screen: "Profile" })}
            >
              <Text style={styles.link}>View Profile →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Court Scheduler</Text>
          <Text style={styles.subtitle}>Reserve your basketball court</Text>

          {/* Book Now Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Booking")}
          >
            <Text style={styles.primaryButtonText}>🏀 Book Now</Text>
          </TouchableOpacity>

          {/* My Reservations Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("UserTabs", { screen: "Reservations" })}
          >
            <Text style={styles.secondaryButtonText}>📋 My Reservations</Text>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Quick Access</Text>
            <Text style={styles.infoText}>Book courts instantly</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Manage</Text>
            <Text style={styles.infoText}>Track your bookings</Text>
          </View>
        </View>
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

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40
  },

  // Glass Header
  glassHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)"
  },

  userInfo: {
    flex: 1
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 4
  },

  link: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "600"
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#2d3436",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5
  },

  subtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "500"
  },

  // Primary Button (Book Now)
  primaryButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
    maxWidth: 320,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },

  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5
  },

  // Secondary Button (My Reservations)
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    elevation: 2
  },

  secondaryButtonText: {
    color: "#2d3436",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600"
  },

  // Info Cards at Bottom
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    bottom: 20
  },

  infoCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center"
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 4
  },

  infoText: {
    fontSize: 12,
    color: "#636e72",
    textAlign: "center"
  }
});