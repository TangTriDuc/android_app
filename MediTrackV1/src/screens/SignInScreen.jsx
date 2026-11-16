import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, functions } from '../config/FirebaseConfig';
import Colors from '../constant/Colors';
import { useLanguage } from '../context/LanguageContext';
import { setLocalStorage } from '../services/Storage';
import { httpsCallable } from 'firebase/functions';

export default function SignIn() {
  // show password
  const [showPassword, setShowPassword] = useState(false);

  // Gọi hành động tới signUp.jsx khi click
  const navigation = useNavigation();
  const { t } = useLanguage();

  //Process sign in with firebase
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  // const OnSignInClick = () => {
  //   //Make notice board when not fill full
  //   if (!email || !password) {
  //     Alert.alert(t('pleaseEnterEmailPassword'));
  //     return;
  //   }

  //   signInWithEmailAndPassword(auth, email, password)
  //     //Process before have step service storage
  //     // .then((userCredential) => {

  //     //Process after have step service storage
  //     .then(async userCredential => {
  //       // Signed in
  //       const user = userCredential.user;
  //       //Respond when log success
  //       console.log(user);

  //       //Process of service storage
  //       await setLocalStorage('userDetail', user);

  //       //Process for sign in when click login will go back home screen
  //       navigation.replace('MainTabs');
  //       // ...
  //     })
  //     .catch(error => {
  //       const errorCode = error.code;
  //       // eslint-disable-next-line no-unused-vars
  //       const errorMessage = error.message;

  //       //Respond when log fail

  //       //Process notice when sign in fail
  //       if (errorCode === 'auth/invalid-credential') {
  //         Alert.alert(t('invalidEmailOrPassword'));
  //       }
  //     });
  // };

  //Process show Vui lòng SignUp after Login with delete User
  const OnSignInClick = async () => {
    const enteredEmail = email?.trim();

    if (!enteredEmail || !password) {
      Alert.alert(t('pleaseEnterEmailPassword'));
      return;
    }

    let signedInUser;

    // Xử lý lỗi Firebase đăng nhập trong khối này
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        enteredEmail,
        password,
      );

      signedInUser = userCredential.user;
    } catch (error) {
      const credentialErrors = [
        'auth/invalid-credential',
        'auth/user-not-found',
        'auth/wrong-password',
      ];

      if (credentialErrors.includes(error.code)) {
        try {
          const checkDeletedAccount = httpsCallable(
            functions,
            'checkDeletedAccount',
          );

          const result = await checkDeletedAccount({
            email: enteredEmail,
          });

          if (result.data.deleted) {
            Alert.alert(t('accountDeletedTitle'), t('pleaseCreateAccount'), [
              {
                text: t('ok'),
                onPress: () => navigation.navigate('SignUp'),
              },
            ]);
            return;
          }
        } catch (checkError) {
          console.log('Không thể kiểm tra tài khoản:', checkError);
        }

        Alert.alert(t('invalidEmailOrPassword'));
        return;
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert(t('invalidEmailOrPassword'));
        return;
      }

      Alert.alert(t('tryAgain'));
      return;
    }

    // Sign In success: xóa dấu tài khoản đã xóa.
    try {
      const clearDeletedAccount = httpsCallable(
        functions,
        'clearDeletedAccount',
      );

      await clearDeletedAccount();
    } catch (error) {
      console.log('Không thể xóa dấu tài khoản đã xóa:', error);
    }

    try {
      await setLocalStorage('userDetail', signedInUser);
      navigation.replace('MainTabs');
    } catch (error) {
      console.log('Không thể lưu thông tin đăng nhập:', error);
      Alert.alert(t('tryAgain'));
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.containersignIn}>
        <View style={styles.headerRow}>
          <Text style={styles.textHeader}>{t('signInTitle')}</Text>
        </View>
        <Text style={styles.subText}>{t('welcomeBack')}</Text>
        <Text style={styles.subText}>{t('missedYou')}</Text>

        {/* Email */}
        <View style={styles.container}>
          <Text>{t('email')}</Text>
          {/* Tạo hộp đăng ký email */}
          <TextInput
            placeholder={t('email')}
            style={styles.EmailInput}
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

        {/* Button Login */}
        <TouchableOpacity
          style={styles.buttonLogin}
          //Process sign in with firebase
          onPress={OnSignInClick}
        >
          <Text style={styles.boxLogin}>{t('login')}</Text>
        </TouchableOpacity>

        {/* Button Create Account */}
        <TouchableOpacity
          style={styles.buttonCreateAccount}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.boxCreateAccount}>{t('createAccount')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containersignIn: {
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

  // Email
  EmailInput: {
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

  // Box Login
  buttonLogin: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    marginTop: 35,
  },

  boxLogin: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },

  // Create Account
  buttonCreateAccount: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,

    // Xử lý viền cho box CreateAccount
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },

  boxCreateAccount: {
    fontSize: 17,
    color: Colors.PRIMARY,
    textAlign: 'center',
  },
});
