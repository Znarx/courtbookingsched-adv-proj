// screens/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const { width, height } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/court.jpg")}
      resizeMode="cover"
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>

        {/* Glass Header */}
        <View style={styles.glassHeader}>
          <Image
            source={require("../assets/avatar.png")}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {user?.email?.split("@")[0]}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* Profile Content */}
        <View style={styles.content}>
          <Text style={styles.title}>My Profile</Text>
          

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Account</Text>
            <Text style={styles.infoText}>Active user</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Email</Text>
            <Text style={styles.infoText}>
              {user?.email?.split("@")[1]}
            </Text>
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
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
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
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },

  userInfo: {
    flex: 1,
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
  },

  email: {
    fontSize: 14,
    color: "#636e72",
    marginTop: 2,
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 40,
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "crimson",
    paddingVertical: 18,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  logoutButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  // Info Cards Bottom
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    bottom: 20,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2d3436",
  },

  infoText: {
    fontSize: 12,
    color: "#636e72",
    marginTop: 4,
    textAlign: "center",
  },
});
