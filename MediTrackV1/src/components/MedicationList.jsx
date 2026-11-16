import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  collection,
  deleteDoc,
  doc,
  // getDocs,
  getDocsFromServer,
  query,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../config/FirebaseConfig';
import Colors from '../constant/Colors';
import { GetDataRangeToDisplay } from '../services/ConvertDateTime';
import { getLocalStorage } from '../services/Storage';
import { useLanguage } from '../context/LanguageContext';
import EmptyState from './../components/EmptyState';
import MedicationCardItem from './MedicationCardItem';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function MedicationList() {
  const { language, t } = useLanguage();
  const [medList, setMedList] = useState();

  //Process for FlatList to show date & day
  const [dateRange, setDateRange] = useState();

  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM/DD/YYYY'),
  );

  //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
  const [loading, setLoading] = useState(false);

  //After have process save user action status
  const navigation = useNavigation();

  //After have GetDataRangeToDisplay in ConvertDateTime.jsx
  useEffect(() => {
    setDateRange(GetDataRangeToDisplay(language));
  }, [language]);

  // // Process of Get multiple documents from a collection in FlatList
  // useEffect(() => {
  //   GetMedicationList(selectedDate);
  // }, [selectedDate]);

  // //Process for delete cùng lúc khi xóa 1 trong 2 screen have Add New Medication
  // useFocusEffect(
  //   useCallback(() => {
  //     GetMedicationList(selectedDate);
  //   }, [selectedDate]),
  // );

  //Process fix error warning Open... sau khi xóa và vào Profile click  My Medication
  // useEffect(() => {
  //   GetMedicationList(selectedDate);
  // }, [selectedDate, GetMedicationList]);

  useFocusEffect(
    useCallback(() => {
      GetMedicationList(selectedDate);
    }, [selectedDate, GetMedicationList]),
  );

  // Process of Get multiple documents from a collection in FlatList
  // const GetMedicationList = async selectedDate => {
  const GetMedicationList = useCallback(async selectedDate => {
    //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
    setLoading(true);

    const user = await getLocalStorage('userDetail');

    //After have show Reminder in MedicationCardItem.jsx and make refreshing
    setMedList([]);

    try {
      const q = query(
        collection(db, 'medication'),
        where('userEmail', '==', user?.email),

        //Process for show text MedicationCardItem when choose the date have event
        where('dates', 'array-contains', selectedDate),
      );

      // const querySnapShot = await getDocs(q);

      //Fix lỗi xóa thuốc thành công nhưng khi vào add new medication thì nó lại error
      const querySnapShot = await getDocsFromServer(q);
      //Before have show Reminder in MedicationCardItem.jsx
      // setMedList([]);

      const medications = [];

      querySnapShot.forEach(doc => {
        //Avoid hiện lỗi !Open  Warming khi xóa remind drug và sau đó vào Profile chọn Add my Medication
        // console.log('docId:' + doc.id + '==', doc.data());

        // setMedList(prev => [...prev, doc.data()]);

        medications.push({ id: doc.id, ...doc.data() }); //Hạn chế query 2 lần
      });

      setMedList(medications); //Hạn chế query 2 lần

      //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
      setLoading(false);
    } catch (e) {
      console.log(e);
      //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
      setLoading(false);
    }
  }, []);

  //Make swipe delete
  const DeleteMedication = async medicineId => {
    try {
      await deleteDoc(doc(db, 'medication', medicineId));
      // setMedList(prev => prev?.filter(item => item.id !== medicineId));

      //Fix lỗi xóa thuốc thành công nhưng khi vào add new medication thì nó lại error
      await GetMedicationList(selectedDate);
    } catch (e) {
      console.log(e);
    }
  };

  const ConfirmDeleteMedication = medicineId => {
    Alert.alert(t('deleteMedication'), t('deleteMedicationConfirm'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => DeleteMedication(medicineId),
      },
    ]);
  };

  //Button Red to xóa
  const RenderRightActions = medicineId => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => ConfirmDeleteMedication(medicineId)}
    >
      <Text style={styles.deleteActionText}>{t('delete')}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        marginTop: 25,
      }}
    >
      <Image
        source={require('../../assets/images/md1.jpg')}
        style={styles.cssImage}
      />

      {/* Process of FlatList */}
      <FlatList
        data={dateRange}
        horizontal
        keyExtractor={item => item.formattedDate}
        //Hide taskbar of Scroll
        showsHorizontalScrollIndicator={false}
        style={styles.bodyFlatList}
        renderItem={({ item, index }) => (
          //Process to show list day & date
          <TouchableOpacity
            style={[
              styles.dateGroup,
              {
                backgroundColor:
                  item.formattedDate === selectedDate
                    ? Colors.PRIMARY
                    : Colors.LIGHT_GRAY_BORDER,
              },
            ]}
            //Process for choose date & day show in FlatList
            // onPress={() => setSelectedDate(item.formattedDate)}

            //Process for choose date & day show in FlatList after have fun show reminder to choose date
            onPress={() => {
              setSelectedDate(item.formattedDate);
              // GetMedicationList(item.formattedDate);
            }}
          >
            <Text
              style={[
                styles.day,
                {
                  color:
                    item.formattedDate === selectedDate ? 'white' : 'black',
                },
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.date,
                {
                  color:
                    item.formattedDate === selectedDate ? 'white' : 'black',
                },
              ]}
            >
              {item.date}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Step 1 before have func reminder */}
      {/* <FlatList */}

      {/* Step 2 after have func reminder and will show add new medicine if date not event */}
      {medList?.length > 0 ? (
        <FlatList
          data={medList}
          // keyExtractor={item => item.id}
          keyExtractor={(item, index) =>
            item.id ?? item.docId ?? index.toString()
          }
          //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
          onRefresh={() => GetMedicationList(selectedDate)}
          refreshing={loading}
          renderItem={({ item, index }) => (
            //Before have process save user action status
            // <TouchableOpacity>

            // //After have process save user action status and it will lead to the action modal index after click reminder
            // <TouchableOpacity
            //   onPress={() =>
            //     navigation.navigate('ActionModal', {
            //       ...item,
            //       selectedDate: selectedDate,
            //     })
            //   }
            // >
            //   {/* Before have Process for folder action-modal of user save update status with fun show icon check after click btnTaken */}
            //   {/* <MedicationCardItem medicine={item} /> */}

            //   {/* After have Process for folder action-modal of user save update status with fun show icon check after click btnTaken */}
            //   <MedicationCardItem medicine={item} selectedDate={selectedDate} />
            // </TouchableOpacity>

            //Process of render Drug
            // <FlatList
            //   item={item}
            //   selectedDate={selectedDate}
            //   deleteText={t('delete')}
            //   onDeletePress={() => ConfirmDeleteMedication(item.id)}
            //   onPress={() =>
            //     navigation.navigate('ActionModal', {
            //       ...item,
            //       selectedDate: selectedDate,
            //     })
            //   }
            // />

            //Make swipe delete
            <View style={styles.swipeWrapper}>
              <ReanimatedSwipeable
                renderRightActions={() => RenderRightActions(item.id)}
                rightThreshold={40}
                friction={2}
                overshootRight={false}
              >
                <View style={styles.swipeCard}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('ActionModal', {
                        ...item,
                        selectedDate: selectedDate,
                      })
                    }
                  >
                    <MedicationCardItem
                      medicine={item}
                      selectedDate={selectedDate}
                    />
                  </TouchableOpacity>
                </View>
              </ReanimatedSwipeable>
            </View>
          )}
        />
      ) : (
        //Lead to page EmptyState to add new Medicine
        <EmptyState />
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  cssImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },

  //Css of FlatList
  bodyFlatList: {
    marginTop: 15,
  },

  dateGroup: {
    padding: 15,
    backgroundColor: Colors.LIGHT_GRAY_BORDER,
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 10,
  },

  day: {
    fontSize: 20,
  },

  date: {
    fontSize: 26,
    fontWeight: 'bold',
  },

  deleteAction: {
    width: 90,
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 8,
    borderRadius: 15,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteActionText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  swipeCard: {
    backgroundColor: '#f7f7f7',
  },

  swipeWrapper: {
    marginHorizontal: 12,
  },
});
