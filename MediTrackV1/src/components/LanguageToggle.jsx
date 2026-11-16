import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constant/Colors";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      {["vn", "en"].map((item) => {
        const isActive = language === item;
        return (
          <TouchableOpacity
            key={item}
            activeOpacity={0.8}
            onPress={() => setLanguage(item)}
            style={[styles.option, isActive && styles.activeOption]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF0FA",
    borderRadius: 6,
    padding: 3,
  },
  option: {
    minWidth: 33,
    height: 28,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOption: {
    backgroundColor: Colors.PRIMARY,
  },
  text: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
  },
  activeText: {
    color: "white",
  },
});
