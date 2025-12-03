import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/court.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Court Scheduler</Text>
        <Text style={styles.subtitle}>
          Book your court schedule easily and quickly.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)", // dark tint
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 45,
    paddingHorizontal: 10,
  },

  button: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
