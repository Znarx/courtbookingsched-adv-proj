// screens/BookingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function BookingScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [court, setCourt] = useState("Court A");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const minDate = new Date(); // Disable past dates

  const handleBooking = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    const userId = user.uid;

    // Combine Date + Time
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0
    );

    if (combinedDateTime < new Date()) {
      Alert.alert("Invalid Time", "You cannot book in the past.");
      return;
    }

    try {
      const bookingTimestamp = Timestamp.fromDate(combinedDateTime);

      // Check if court is already booked
      const q = query(
        collection(db, "reservations"),
        where("court", "==", court),
        where("dateTime", "==", bookingTimestamp)
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        Alert.alert("Unavailable", "This court is already booked.");
        return;
      }

      // Save booking
      await addDoc(collection(db, "reservations"), {
        court,
        dateTime: bookingTimestamp,
        userId,
        userEmail: user.email,
        status: "Pending",
        createdAt: Timestamp.now(),
      });

      Alert.alert("Success", "Your court booking is confirmed!");
      navigation.goBack();

    } catch (error) {
      console.log("FIRESTORE ERROR:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/court.jpg")}
      resizeMode="cover"
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backIconContainer}>
            <Image source={require("../assets/back.png")} style={styles.backIcon} />
          </View>
        </TouchableOpacity>

        {/* Glass Card Container */}
        <View style={styles.glassCard}>
          <Text style={styles.title}>🏀 Book a Court</Text>
          <Text style={styles.subtitle}>Reserve your basketball court</Text>

          {/* Court Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Court:</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={court} 
                onValueChange={setCourt}
                style={styles.picker}
              >
                <Picker.Item label="Court A" value="Court A" />
                <Picker.Item label="Court B" value="Court B" />
              </Picker>
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Date:</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.selectorIcon}>📅</Text>
              <Text style={styles.selectorText}>{selectedDate.toDateString()}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={selectedDate}
              minimumDate={minDate}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Time:</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.selectorIcon}>⏰</Text>
              <Text style={styles.selectorText}>
                {selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={selectedTime}
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (time) setSelectedTime(time);
              }}
            />
          )}

          {/* Book Button */}
          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <Text style={styles.buttonText}>Confirm Booking</Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ℹ️ Your booking will be confirmed after admin approval
            </Text>
          </View>
        </View>
      </ScrollView>
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
    padding: 20
  },

  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 10
  },

  backIconContainer: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },

  backIcon: {
    width: 24,
    height: 24
  },

  // Glass Card
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 20,
    padding: 24,
    marginTop: 80,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },

  title: {
    fontSize: 28,
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

  section: {
    marginBottom: 20
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#2d3436"
  },

  // Picker Container
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden"
  },

  picker: {
    color: "#2d3436"
  },

  // Date/Time Selector
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)"
  },

  selectorIcon: {
    fontSize: 20,
    marginRight: 12
  },

  selectorText: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500"
  },

  // Button
  button: {
    backgroundColor: "#0066cc",
    padding: 18,
    borderRadius: 12,
    marginTop: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5
  },

  // Info Box
  infoBox: {
    backgroundColor: "rgba(52, 152, 219, 0.15)",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(52, 152, 219, 0.3)"
  },

  infoText: {
    fontSize: 13,
    color: "#2d3436",
    textAlign: "center",
    lineHeight: 18
  }
});