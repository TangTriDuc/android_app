import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constant/Colors";
import { getLocalStorage } from "../services/Storage";

export default function Header() {
  const [user, setUser] = useState();
  const navigation = useNavigation();

  // useEffect(() => {
  //   GetUserDetail();
  // }, []);

  //Process change name after edit in screen profile
  useFocusEffect(
    useCallback(() => {
      GetUserDetail();
    }, []),
  );

  const GetUserDetail = async () => {
    const userInfo = await getLocalStorage("userDetail");
    setUser(userInfo);
  };

  return (
    <SafeAreaView>
      <View style={styles.contain}>
        <View style={styles.body}>
          <View style={styles.contain1}>
            <Image
              style={styles.cssimage}
              source={require("../../assets/images/smiley.png")}
            />
            <Text style={styles.cssdisplayname}>{user?.displayName}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddMedication")}
            >
              <Ionicons
                name="medkit-outline"
                size={34}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contain: {
    paddingHorizontal: 15,
  },
  body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  contain1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  cssimage: {
    width: 45,
    height: 45,
  },
  cssdisplayname: {
    fontSize: 25,
    fontWeight: "bold",
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
