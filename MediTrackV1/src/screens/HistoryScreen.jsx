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
import { useState, useCallback } from 'react';
import {
  Alert,
  FlatList,
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
// import { GetPrevDateRangeToDisplay } from '../services/ConvertDateTime';
import { getLocalStorage } from '../services/Storage';
import { useLanguage } from '../context/LanguageContext';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function History() {
  const navigation = useNavigation();
  const { language, t } = useLanguage();
  //Process for FlatList to show date & day
  const [dateRange, setDateRange] = useState();

  const [selectedDate, setSelectedDate] = useState(
    moment().format('MM/DD/YYYY'),
  );

  const [loading, setLoading] = useState(false);

  const [medList, setMedList] = useState();

  //Show VN cho thứ
  const GetDayLabel = useCallback(
    dateValue => {
      const dayIndex = moment(dateValue, 'MM/DD/YYYY').day();

      const vnDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      return language === 'vn' ? vnDays[dayIndex] : enDays[dayIndex];
    },
    [language],
  );

  // *1*
  // useEffect(() => {
  //   GetDateList();
  //   GetMedicationList(selectedDate);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [language]);

  // //Fix lỗi render 2 item cùng key
  // useEffect(() => {
  //   const dates = GetPrevDateRangeToDisplay(language);
  //   setDateRange(dates);
  // }, [language]);

  // //Process for delete cùng lúc khi xóa 1 trong 2 screen have Add New Medication
  // useFocusEffect(
  //   useCallback(() => {
  //     GetMedicationList(selectedDate);
  //   }, [selectedDate]),
  // );

  //Process for date have remind thuốc
  // useEffect(() => {
  //   GetMedicationDateList();
  // }, [GetMedicationDateList]);

  // *1*
  // //Process show date for screen History
  // const GetDateList = () => {
  //   const dates = GetPrevDateRangeToDisplay(language);
  //   setDateRange(dates);
  // };

  // const GetMedicationList = async selectedDate => {
  //   //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
  //   setLoading(true);

  //   const user = await getLocalStorage('userDetail');

  //   //After have show Reminder in MedicationCardItem.jsx and make refreshing
  //   setMedList([]);

  //   try {
  //     const q = query(
  //       collection(db, 'medication'),
  //       where('userEmail', '==', user?.email),

  //       //Process for show text MedicationCardItem when choose the date have event
  //       where('dates', 'array-contains', selectedDate),
  //     );

  //     const querySnapShot = await getDocs(q);
  //     //Before have show Reminder in MedicationCardItem.jsx
  //     // setMedList([]);

  //     // querySnapShot.forEach(doc => {
  //     //   console.log('docId:' + doc.id + '==', doc.data());
  //     //   //Process get drug from Firestore
  //     //   setMedList(prev => [...prev, { id: doc.id, ...doc.data() }]);
  //     // });

  //     const medications = [];

  //     querySnapShot.forEach(docSnap => {
  //       console.log('docId:' + docSnap.id + '==', docSnap.data());
  //       medications.push({ id: docSnap.id, ...docSnap.data() });
  //     });

  //     setMedList(medications);

  //     //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
  //     setLoading(false);
  //   } catch (e) {
  //     console.log(e);
  //     //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
  //     setLoading(false);
  //   }
  // };

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
      const querySnapShot = await getDocsFromServer(q);

      const medications = [];

      querySnapShot.forEach(docSnap => {
        medications.push({ id: docSnap.id, ...docSnap.data() });
      });

      setMedList(medications);
    } catch (e) {
      console.log(e);
    } finally {
      //After have show Reminder in MedicationCardItem.jsx and make icon refreshing
      setLoading(false);
    }
  }, []);

  //Process for date have remind thuốc
  const GetMedicationDateList = useCallback(async () => {
    const user = await getLocalStorage('userDetail');

    try {
      const q = query(
        collection(db, 'medication'),
        where('userEmail', '==', user?.email),
      );

      // const querySnapShot = await getDocs(q);

      //Fix lỗi xóa thuốc thành công nhưng khi vào add new medication thì nó lại error
      const querySnapShot = await getDocsFromServer(q);
      const dateMap = new Map();

      querySnapShot.forEach(docSnap => {
        const medicine = docSnap.data();

        medicine?.dates?.forEach(dateValue => {
          const dateMoment = moment(dateValue, 'MM/DD/YYYY');

          dateMap.set(dateValue, {
            formattedDate: dateValue,
            // day: dateMoment.format('dd').toUpperCase(),

            //Process for date have remind thuốc
            day: GetDayLabel(dateValue),
            date: dateMoment.format('DD'),
          });
        });
      });

      const dates = Array.from(dateMap.values()).sort((a, b) => {
        return (
          moment(b.formattedDate, 'MM/DD/YYYY').valueOf() -
          moment(a.formattedDate, 'MM/DD/YYYY').valueOf()
        );
      });

      setDateRange(dates);

      if (dates.length > 0) {
        setSelectedDate(dates[0].formattedDate);
        GetMedicationList(dates[0].formattedDate);
      } else {
        setSelectedDate('');
        setMedList([]);
      }
    } catch (e) {
      console.log(e);
    }
  }, [GetDayLabel, GetMedicationList]);

  //Process for delete cùng lúc khi xóa 1 trong 2 screen have Add New Medication
  useFocusEffect(
    useCallback(() => {
      GetMedicationDateList();
    }, [GetMedicationDateList]),
  );

  //Funct xóa khi kéo qua
  const DeleteMedication = async medicineId => {
    try {
      await deleteDoc(doc(db, 'medication', medicineId));
      // setMedList(prev => prev?.filter(item => item.id !== medicineId));

      //Fix lỗi xóa thuốc thành công nhưng khi vào add new medication thì nó lại error

      await GetMedicationList();
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
    <FlatList
      data={[]}
      style={{
        height: '100%',
        backgroundColor: 'white',
      }}
      ListHeaderComponent={
        <SafeAreaView>
          <View style={styles?.mainContain}>
            <Image
              source={require('../../assets/images/med-history.jpg')}
              style={styles.imageBanner}
            />

            <View style={styles.headerRow}>
              <Text style={styles.header}>{t('history')}</Text>
            </View>

            {/* FlatList của ngày */}
            <FlatList
              data={dateRange}
              keyExtractor={item => item.formattedDate}
              horizontal
              //Hide taskbar of Scroll
              style={styles.bodyFlatList}
              showsHorizontalScrollIndicator={false}
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
                  //Process for choose date & day show in FlatList after have fun show reminder to choose date
                  onPress={() => {
                    setSelectedDate(item.formattedDate);

                    //Process will show all date have event when click all date
                    GetMedicationList(item.formattedDate);
                  }}
                >
                  <Text
                    style={[
                      styles.day,
                      {
                        color:
                          item.formattedDate === selectedDate
                            ? 'white'
                            : 'black',
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
                          item.formattedDate === selectedDate
                            ? 'white'
                            : 'black',
                      },
                    ]}
                  >
                    {item.date}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* FlatList của thuốc */}
            {medList?.length > 0 ? (
              <FlatList
                data={medList}
                keyExtractor={item => item.id}
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
                  //   <MedicationCardItem
                  //     medicine={item}
                  //     selectedDate={selectedDate}
                  //   />
                  // </TouchableOpacity>

                  //Process make swipe delete
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
                        {/* After have Process for folder action-modal of user save update status with fun show icon check after click btnTaken */}
                        <MedicationCardItem
                          medicine={item}
                          selectedDate={selectedDate}
                        />
                      </TouchableOpacity>
                    </View>
                  </ReanimatedSwipeable>
                )}
              />
            ) : (
              <Text style={styles.cssTextNotice}>{t('noMedicationFound')}</Text>
            )}
          </View>
        </SafeAreaView>
      }
    />
  );
}

export const styles = StyleSheet.create({
  mainContain: {
    padding: 25,
    backgroundColor: 'white',
  },

  imageBanner: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  header: {
    fontSize: 25,
    fontWeight: 'bold',
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

  cssTextNotice: {
    fontSize: 25,
    padding: 30,
    fontWeight: 'bold',
    color: Colors.GRAY,
    textAlign: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  swipeCard: {
    backgroundColor: '#f7f7f7',
  },
});
