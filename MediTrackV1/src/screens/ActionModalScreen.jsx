import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MedicationCardItem from '../components/MedicationCardItem';
import { db } from '../config/FirebaseConfig';
import Colors from '../constant/Colors';
import { useLanguage } from '../context/LanguageContext';

export default function MedicationActionModal({ route }) {
  const { t } = useLanguage();
  const medicine = route?.params ?? {};
  // console.log(medicine);

  //Process to fun back of close-circle
  const navigation = useNavigation();

  //Process function of btn Taken & Missed
  const UpdateActionStatus = async status => {
    try {
      const docRef = doc(db, 'medication', medicine?.docId);
      await updateDoc(docRef, {
        action: arrayUnion({
          status: status,
          time: moment().format('LT'),
          date: medicine?.selectedDate,
        }),
      });

      //Process show alert after click btnTaken / btnMissed will back to Main Screen and save in the firestore
      Alert.alert(
        status === 'Taken' ? t('taken') : t('missed'),
        t('responseSaved'),
        [
          {
            text: t('ok'),
            onPress: () => navigation.replace('MainTabs'),
          },
        ],
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/notification.gif')}
          style={styles.cssImage}
        />

        <Text style={{ fontSize: 18 }}>
          {/* {moment(medicine?.selectedDate, 'MM/DD/YYY').format('DD/MM/YYY')} */}
          {moment(medicine?.selectedDate, 'MM/DD/YYYY').format('DD/MM/YYYY')}
        </Text>

        <Text
          style={{ fontSize: 38, fontWeight: 'bold', color: Colors.PRIMARY }}
        >
          {medicine?.reminder}
        </Text>

        <Text style={{ fontSize: 18 }}>{t('itsTimeToTake')}</Text>

        {/* Process to make show only reminder of event after click  */}
        <MedicationCardItem medicine={medicine} />

        {/* Process to show 2 btn missed & taken  */}
        <View style={styles.btnContainer}>
          {/* Missed */}
          <TouchableOpacity
            style={styles.closeBtn}
            //Process func of btnMissed
            onPress={() => UpdateActionStatus('Missed')}
          >
            <Ionicons name="close-outline" size={24} color="red" />
            <Text style={{ fontSize: 20, color: 'red' }}>{t('missed')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successBtn}
            //Process func of btnTaken
            onPress={() => UpdateActionStatus('Taken')}
          >
            <Ionicons name="checkmark-outline" size={24} color="white" />
            <Text style={{ fontSize: 20, color: 'white' }}>{t('taken')}</Text>
          </TouchableOpacity>
        </View>

        {/* close-circle */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cssBtnClose}
        >
          <Ionicons name="close-circle" size={44} color={Colors.GRAY} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '100%',
  },

  cssImage: {
    width: 120,
    height: 120,
  },

  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
  },

  closeBtn: {
    padding: '10',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: 'red',
    borderRadius: 10,
  },

  successBtn: {
    padding: '10',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.GREEN,
    alignItems: 'center',
    borderRadius: 10,
  },

  cssBtnClose: {
    position: 'absolute',
    bottom: 25,
  },
});
