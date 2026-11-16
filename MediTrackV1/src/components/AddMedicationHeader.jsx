import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AddMedicationHeader() {
  //Process for action back
  const navigation = useNavigation();

  return (
    <View>
      <Image
        source={require("../../assets/images/consult.jpg")}
        style={styles.cssImage}
      />

      {/* Process of icon back */}
      <TouchableOpacity
        style={styles.cssbtBack}
        //Process action icon back
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cssImage: {
    // height: 280,
    height: 300,
    width: "100%",
  },

  cssbtBack: {
    position: "absolute",
    padding: 25,
  },
});
