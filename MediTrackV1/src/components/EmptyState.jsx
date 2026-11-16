import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constant/Colors";
import { useLanguage } from "../context/LanguageContext";

export default function EmptyState() {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={styles.contain}>
      <Image
        source={require("../../assets/images/medicine.png")}
        style={styles.cssImage}
      />
      {/* No Medications! */}
      <Text style={styles.cssText}>{t("noMedication")}</Text>
      <Text style={styles.cssText1}>{t("medicationSubText")}</Text>

      {/* Make button box */}
      <TouchableOpacity
        style={styles.cssBtnBox}
        //Process after have folder add-new-medication
        onPress={() => navigation.navigate("AddMedication")}
      >
        <Text style={styles.cssTextBtnBox}>
          {t("addNewMedicationBtn")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    marginTop: 80,
    display: "flex",
    alignItems: "center",
  },

  cssImage: {
    width: 120,
    height: 120,
  },

  cssText: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 30,
  },

  cssText1: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    textAlign: "center",
    marginTop: 20,
  },

  cssBtnBox: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 30,
  },

  cssTextBtnBox: {
    textAlign: "center",
    fontSize: 17,
    color: "white",
  },
});

