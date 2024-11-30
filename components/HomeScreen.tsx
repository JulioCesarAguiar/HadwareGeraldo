import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from "react-native";
import { fetchItems, Item } from "../api/api";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeButton, setActiveButton] = useState<"items" | "location" | null>(null);

  const handleFetchItems = async () => {
    setActiveButton("items");
    try {
      const data = await fetchItems();
      setItems(data);
      setLocation(null);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  };

  const handleFetchLocation = async () => {
    setActiveButton("location");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setItems([]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-border"}
          size={18}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const renderProduct = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(4.5)}
          <Text style={styles.ratingText}>4.5 (100 reviews)</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeButton === "location" && location && (
        <View style={styles.locationCard}>
          <Text style={styles.cardHeader}>Localização Atual</Text>
          <Text style={styles.cardText}>Latitude: {location.latitude}</Text>
          <Text style={styles.cardText}>Longitude: {location.longitude}</Text>
        </View>
      )}
      {activeButton === "items" && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === "items" ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handleFetchItems}
        >
          <Text style={styles.buttonText}>Carregar Itens</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            activeButton === "location" ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={handleFetchLocation}
        >
          <Text style={styles.buttonText}>Obter Localização</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f9fa",
    },
    list: {
      padding: 10,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 15,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 5,
      elevation: 4,
    },
    image: {
      width: "100%",
      height: 200,
    },
    infoContainer: {
      padding: 15,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: "#333",
    },
    price: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: "#666",
      marginBottom: 10,
      lineHeight: 20,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 5,
    },
    ratingText: {
      fontSize: 12,
      color: "#444",
      marginLeft: 5,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      borderWidth: 1,
    },
    activeButton: {
      backgroundColor: "#007bff",
      borderColor: "#007bff",
    },
    inactiveButton: {
      backgroundColor: "#e9ecef",
      borderColor: "#ced4da",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    locationCard: {
      position: "absolute",
      top: "40%",
      left: "10%",
      right: "10%",
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      alignItems: "center",
    },
    cardHeader: {
      backgroundColor: "#007bff",
      width: "100%",
      textAlign: "center",
      color: "#fff",
      paddingVertical: 10,
      fontSize: 20,
      fontWeight: "bold",
    },
    cardText: {
      fontSize: 16,
      color: "#495057",
      marginVertical: 2,
    },
  });