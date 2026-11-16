import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constant/Colors';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '../services/Storage';

import { signOut, updateProfile, deleteUser } from 'firebase/auth';
import LanguageToggle from '../components/LanguageToggle';
import { auth } from '../config/FirebaseConfig';
import { useLanguage } from '../context/LanguageContext';

export default function Profile() {
  const { t } = useLanguage();

  //Func edit profile
  const [showEditModal, setShowEditModal] = useState(false);
  const [displayName, setDisplayName] = useState('');

  //Show Info User
  const [user, setUser] = useState();

  //Func of Delete Info User with Alert
  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(t('accountNoticeTitle'), t('accountNotSignedIn'));
      return;
    }

    try {
      await deleteUser(currentUser);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(t('accountReLoginTitle'), t('accountReLoginMessage'), [
          { text: t('accountClose') },
        ]);
      } else {
        Alert.alert(
          t('deleteAccountFailedTitle'),
          t('deleteAccountFailedMessage'),
          [{ text: t('accountClose') }],
        );
      }

      return;
    }

    // Account Firebase of User đã được xóa thành công.
    try {
      await removeLocalStorage('userDetail');
    } catch (error) {
      console.log('Không thể xóa dữ liệu đăng nhập cục bộ:', error);
    }

    setUser(null);
    navigation.replace('Onboarding');
  };

  const confirmDeleteAccount = () => {
    Alert.alert(t('deleteAccount'), t('deleteAccountConfirm'), [
      {
        text: t('deleteAccountConfirm2'),
        style: 'cancel',
      },
      {
        text: t('deleteAccountConfirm1'),
        style: 'destructive',
        onPress: handleDeleteAccount,
      },
    ]);
  };

  const handleShowAccountInfo = () => {
    if (!user) {
      // Alert.alert('Thông báo', 'Chưa có thông tin tài khoản.');
      Alert.alert(t('accountNoticeTitle'), t('accountInfoUnavailable'));
      return;
    }

    // Alert.alert(
    //   'Thông tin tài khoản',
    //   `Họ tên: ${user.displayName || 'Chưa cập nhật'}\nEmail: ${
    //     user.email || 'Chưa cập nhật'
    //   }`,
    //   [{ text: 'Đóng' }],
    // );

    //Change  EN/ VN for Show Info User
    Alert.alert(
      t('infoUser'),
      `${t('fullName')}: ${user.displayName || t('accountNotUpdated')}\n${t(
        'email',
      )}: ${user.email || t('accountNotUpdated')}`,

      [
        //Delete User
        {
          text: t('deleteAccount'),
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },

        //Close
        {
          text: t('accountClose'),
          style: 'cancel',
        },
      ],
    );
  };

  //Func Update User
  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      // Alert.alert("Vui lòng nhập họ tên");
      Alert.alert(t('editProfileAlert'));
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });

      const updatedUser = {
        ...user,
        displayName: displayName.trim(),
      };

      await setLocalStorage('userDetail', updatedUser);
      setUser(updatedUser);
      setShowEditModal(false);

      // Alert.alert("Thành công", "Đã cập nhật hồ sơ");
      Alert.alert(t('updateUserAlertTitle'), t('updateUserAlertMessage'));
    } catch (error) {
      console.log('Update profile error:', error);
      Alert.alert(
        t('updateUserAlertErrorTitle'),
        t('updateUserAlertErrorMessage'),
      );
    }
  };

  const Menu = [
    {
      id: 1,
      name: t('addNewMedication'),
      icon: 'add-circle',
      path: 'AddMedication',
    },
    {
      id: 2,
      name: t('myMedication'),
      icon: 'medkit',
      // path: 'MainTabs',
      path: 'Home',
      // screen: 'Home',
    },
    {
      id: 3,
      name: t('history'),
      icon: 'time',
      path: 'History',
      // path: 'MainTabs',
      // screen: 'History',
    },

    {
      id: 4,
      name: t('infoUser'),
      icon: 'person-circle',
      path: 'accountInfo',
    },

    {
      id: 5,
      name: t('logout'),
      icon: 'exit',
      path: 'logout',
    },
  ];

  const navigation = useNavigation();

  //Access in Login right now app logout
  const handleLogout = async () => {
    try {
      // 1. Logout Firebase
      await signOut(auth);

      // 2. Del local storage in simulation device
      await removeLocalStorage('userDetail');

      // 3. Reset back login (not to back again)
      setUser(null);
      navigation.replace('Onboarding');
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert(t('logoutFailed'), t('tryAgain'));
    }
  };

  //Handle CLick
  const onPressMenu = menu => {
    //Process hàm show info user
    if (menu.path === 'accountInfo') {
      handleShowAccountInfo();
      return;
    }

    //Process hàm Logout
    if (menu.path === 'logout') {
      Alert.alert(t('logout'), t('logoutConfirm'), [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: handleLogout,
        },
      ]);
      return;
    }

    if (menu.screen) {
      navigation.navigate(menu.path, {
        screen: menu.screen,
      });
      return;
    }

    // navigate
    navigation.navigate(menu.path);
  };

  useEffect(() => {
    GetUser();
  }, []);

  // const GetUser = async () => {
  //   const userData = await getLocalStorage("userDetail");
  //   setUser(userData);
  // };

  //Func edit profile
  const GetUser = async () => {
    const userData = await getLocalStorage('userDetail');
    setUser(userData);
    setDisplayName(userData?.displayName ?? '');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // padding: 25,
        backgroundColor: 'white',
        // height: "100%",
      }}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 25 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            {t('profile')}
          </Text>
          <LanguageToggle />
        </View>

        {/* USER INFO */}
        <View
          style={{
            // display: "flex",
            alignItems: 'center',
            marginVertical: 25,
          }}
        >
          <Image
            source={require('../../assets/images/smiley.png')}
            style={{ width: 80, height: 80 }}
          />

          <View style={{ alignItems: 'center', marginVertical: 25 }}>
            <Text
              style={{
                // fontFamily: "outfit-bold",
                fontSize: 24,
                marginTop: 6,
                fontWeight: 'bold',
              }}
            >
              {user?.displayName}
            </Text>
            {/* Func edit profile */}
            <TouchableOpacity
              onPress={() => setShowEditModal(true)}
              style={{
                marginTop: 10,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {/* Chỉnh sửa */}
                {t('editProfile')}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                // fontFamily: "outfit",
                fontSize: 16,
                color: Colors.GRAY,
                marginTop: 5,
              }}
            >
              {user?.email}
            </Text>
          </View>
        </View>

        {/* MENU LIST */}
        <FlatList
          data={Menu}
          // Create a unique "key" for each item in the list
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{
            paddingLeft: 10,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onPressMenu(item)}
              key={item.id}
              style={{
                // display: "flex",
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: Colors.WHITE,
                padding: 12,
                borderRadius: 12,
                marginVertical: 8,
                width: '100%',
              }}
            >
              <Ionicons
                name={item?.icon}
                size={30}
                color={Colors.PRIMARY}
                style={{
                  padding: 10,
                  backgroundColor: Colors.LIGHT_PRIMARY,
                  borderRadius: 10,
                }}
              />
              <Text
                style={{
                  // fontFamily: "outfit",
                  fontSize: 20,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Func edit profile */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.45)',
            justifyContent: 'center',
            padding: 25,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 15,
              }}
            >
              {/* Chỉnh sửa hồ sơ */}
              {t('editProfile')}
            </Text>

            {/* <Text>Họ và tên</Text> */}
            <Text>{t('editProfileName')}</Text>

            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              // placeholder="Họ và tên"
              placeholder={t('editProfileName')}
              style={{
                borderWidth: 1,
                borderColor: Colors.LIGHT_GRAY_BORDER,
                borderRadius: 10,
                padding: 12,
                marginTop: 8,
                fontSize: 16,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={{
                  padding: 12,
                }}
              >
                {/* <Text style={{ color: Colors.DARK_GRAY }}>Hủy</Text> */}
                <Text style={{ color: Colors.DARK_GRAY }}>
                  {t('editProfileCancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdateProfile}
                style={{
                  padding: 12,
                  backgroundColor: Colors.PRIMARY,
                  borderRadius: 8,
                }}
              >
                {/* <Text style={{ color: "white", fontWeight: "bold" }}>Lưu</Text> */}
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {t('editProfileSave')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>

    //Func edit profile
  );
}
