// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Dimensions
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Fill in all fields");
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email === "admin@gmail.com") {
        navigation.replace("AdminScreen");
      } else {
        navigation.replace("UserTabs");
      }
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
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
        {/* Glass Card */}
        <View style={styles.glassCard}>
          <Text style={styles.title}>Court Scheduler</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7f8c8d"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Field */}
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#7f8c8d"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={styles.eye}>{showPass ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>No account yet? Create one</Text>
          </TouchableOpacity>
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
    justifyContent: "center",
    paddingHorizontal: 24
  },

  // Glass Card
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#2d3436",
    letterSpacing: 0.5
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: "#636e72",
    fontWeight: "500"
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    marginBottom: 12,
    fontSize: 15,
    color: "#2d3436"
  },

  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    marginBottom: 16
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#2d3436"
  },

  eye: {
    fontSize: 20,
    marginLeft: 8
  },

  button: {
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5
  },

  link: {
    color: "#0066cc",
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14
  }
});