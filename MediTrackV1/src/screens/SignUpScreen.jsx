import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constant/Colors';
import { useLanguage } from '../context/LanguageContext';
import { setLocalStorage } from '../services/Storage';
import { auth, functions } from '../config/FirebaseConfig';
import { httpsCallable } from 'firebase/functions';

export default function SignUp() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  // show pass
  const [showPassword, setShowPassword] = useState(false);

  //Process for authenticated in (tabs) -> layout.jsx
  const [userName, setUserName] = useState();

  //Add authentication Firebase
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const OnCreateAccount = () => {
    //Make notice board when not fill full
    if (!email || !password || !userName) {
      ToastAndroid.show(t('pleaseFillAllDetails'), ToastAndroid.BOTTOM);
      Alert.alert(t('pleaseEnterEmailAndPassword'));
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        // Signed up
        const user = userCredential.user;

        //Process show Vui lòng SignUp after Login with delete User
        try {
          const clearDeletedAccount = httpsCallable(
            functions,
            'clearDeletedAccount',
          );

          await clearDeletedAccount();
        } catch (error) {
          console.log('Không thể xóa dấu tài khoản đã xóa:', error);
        }

        //Respond when log success
        // console.log(user);
        await updateProfile(user, {
          displayName: userName,
        });

        //Process of service storage
        await setLocalStorage('userDetail', user);

        //Process for sign in
        navigation.replace('MainTabs');

        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        // eslint-disable-next-line no-unused-vars
        const errorMessage = error.message;
        //Respond when log fail
        console.log(errorCode);
        if (errorCode === 'auth/email-already-in-use') {
          //Make notice board of android react
          ToastAndroid.show(t('emailAlreadyExist'), ToastAndroid.BOTTOM);
          //Make board big appear when click
          Alert.alert(t('emailAlreadyExist'));
        }
        // ..
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.containersignUp}>
        <View style={styles.headerRow}>
          <Text style={styles.textHeader}>{t('createNewAccount')}</Text>
        </View>

        {/* Name */}
        <View style={styles.container}>
          <Text>{t('fullName')}</Text>
          {/* Tạo hộp đăng ký email */}
          <TextInput
            placeholder={t('fullName')}
            onChangeText={value => setUserName(value)}
            style={styles.Input}
          />
        </View>

        {/* Email */}
        <View style={styles.container}>
          <Text>{t('email')}</Text>
          {/* Tạo hộp đăng ký email */}
          <TextInput
            placeholder={t('email')}
            style={styles.Input}
            //Process Firebase Authentication
            onChangeText={value => setEmail(value)}
          />
        </View>

        {/* Password */}
        <View style={styles.container}>
          <Text>{t('password')}</Text>

          <View style={styles.passwordBox}>
            <TextInput
              placeholder={t('password')}
              style={styles.passwordInput}
              secureTextEntry={!showPassword}
              //Process Firebase Authentication
              onChangeText={value => setPassword(value)}
            />

            {/* Icon mắt */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Button Create In SignUp */}
        <TouchableOpacity
          style={styles.buttonCreateAccount}
          onPress={OnCreateAccount}
        >
          <Text style={styles.boxCreateAccount}>{t('createAccount')}</Text>
        </TouchableOpacity>

        {/* Button Already Account In SignUp */}
        <TouchableOpacity
          style={styles.buttonAlreadyAccount}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.boxAlreadyAccount}>
            {t('alreadyAccountSignIn')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containersignUp: {
    padding: 25,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  textHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
    // marginTop: 15,
  },
  subText: {
    fontSize: 30,
    fontWeight: 'bold',
    flex: 1,
    marginTop: 10,
    color: Colors.GRAY,
  },

  container: {
    marginTop: 25,
  },

  // Email + FullName Input
  Input: {
    padding: 10,
    borderWidth: 1,
    fontSize: 17,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },

  // Password
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 17,
  },

  // Box Create Account
  buttonCreateAccount: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    marginTop: 35,
  },

  boxCreateAccount: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },

  buttonAlreadyAccount: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,

    // Xử lý viền cho box AlreadyAccount
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },

  boxAlreadyAccount: {
    fontSize: 17,
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
});
