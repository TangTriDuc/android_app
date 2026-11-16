import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constant/Colors';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={styles?.container}>
      <View style={styles.languageBox}>
        <LanguageToggle />
      </View>
      {/* Ảnh phía trên */}
      <Image
        source={require('../../assets/images/hos1.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Khối dưới (overlay) */}
      {/* <View style={styles.bottomBox}>
        <Text style={styles.title}>{t("loginHeroTitle")}</Text>

        <Text style={styles.desc}>
          Track your meds, take control of your health. Stay consistent, stay
          confident!
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={{ color: "#1976D2", fontWeight: "600" }}>{t("continue")}</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          NOTE: By Continue you agree to our terms and condition
        </Text>
      </View> */}

      {/* Khối dưới (overlay) */}
      <View style={styles?.hopgiua}>
        <Text style={styles?.tieude}>{t('loginHeroTitle')}</Text>

        <Text style={styles?.tieude1}>{t('loginHeroSubtitle')}</Text>

        {/* Làm button click */}
        <TouchableOpacity
          style={styles?.boxbutton}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles?.titleboxbutton}>{t('continue')}</Text>
        </TouchableOpacity>

        <Text style={styles?.titleboxbutton1}>{t('loginNote')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  languageBox: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },

  image: {
    width: '90%',
    alignSelf: 'center', //Căn chỉnh riêng logo hos1.png
    marginTop: 40,
    height: '60%', // 👈 ảnh chiếm phần trên
  },

  hopgiua: {
    padding: 25,
    backgroundColor: Colors.PRIMARY,
    height: '100%',
  },

  tieude: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },

  tieude1: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    marginTop: 20,
  },

  titleboxbutton: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.PRIMARY,
  },

  boxbutton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 99,
    marginTop: 25,
  },

  titleboxbutton1: {
    color: 'white',
    marginTop: 4,
  },

  // bottomBox: {
  //   position: "absolute",
  //   bottom: 0,
  //   width: "100%",
  //   height: "45%",
  //   backgroundColor: "#1E88E5",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   padding: 20,
  //   alignItems: "center",
  // },

  // title: {
  //   color: "#fff",
  //   fontSize: 22,
  //   fontWeight: "bold",
  //   marginBottom: 10,
  // },

  // desc: {
  //   color: "#E3F2FD",
  //   textAlign: "center",
  //   marginBottom: 20,
  // },

  // button: {
  //   backgroundColor: "#fff",
  //   width: "80%",
  //   padding: 15,
  //   borderRadius: 30,
  //   alignItems: "center",
  //   marginBottom: 10,
  // },

  // note: {
  //   fontSize: 12,
  //   color: "#BBDEFB",
  //   textAlign: "center",
  // },
});
