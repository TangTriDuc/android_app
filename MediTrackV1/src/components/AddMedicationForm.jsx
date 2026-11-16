import Ionicons from 'react-native-vector-icons/Ionicons';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  AppState,
} from 'react-native';
import { db } from '../config/FirebaseConfig';
import Colors from '../constant/Colors';
import { TypeList, WhenToTake } from '../constant/Options';
import { useLanguage } from '../context/LanguageContext';
import {
  FormatDateForText,
  formatTime,
  getDatesRange,
} from '../services/ConvertDateTime';
import { getLocalStorage } from '../services/Storage';

//Make change VN / EN for date picker
import CustomDatePicker from './CustomDatePicker';

//Make auto fill by camera (save image get Photos)
import { launchCamera } from 'react-native-image-picker';

//Make auto add Pciture by camera (save image get Documents)
import { pick, types } from '@react-native-documents/picker';

//Make auto fill by OCR
// eslint-disable-next-line no-unused-vars
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function AddMedicationForm() {
  //Process of ListData
  const [formData, setFormData] = useState();
  const { language, t } = useLanguage();

  //Process of hide choose pick up Start & End date
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  //Process of choose pick up Remind Time
  const [showTimePicker, setshowTimePicker] = useState(false);

  //Make show ô tbao nhỏ when chọn giờ quá gần hoặc đã qua
  const [reminderError, setReminderError] = useState('');

  //Process close khung chose time khi reload
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active') {
        DateTimePickerAndroid.dismiss('time');
        DateTimePickerAndroid.dismiss('date');
        setshowTimePicker(false);
        setShowStartDate(false);
        setShowEndDate(false);
      }
    });

    return () => {
      subscription.remove();
      setShowStartDate(false);
      setShowEndDate(false);
      setshowTimePicker(false);

      DateTimePickerAndroid.dismiss('time');
      DateTimePickerAndroid.dismiss('date');
      DateTimePickerAndroid.dismiss('time');
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // const onHandleInputChange = (field, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));

  //   //Show process of formData
  //   console.log(formData);
  // };

  //Update log after reload
  const onHandleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);

    // console.log(updatedData);
  };

  //Process of firestore DB
  const SaveMedication = async () => {
    const docId = Date.now().toString();
    const user = await getLocalStorage('userDetail');
    if (
      // !(
      //   formData?.name ||
      //   formData?.type ||
      //   formData?.dose ||
      //   formData?.startDate ||
      //   formData?.endDate ||
      //   formData?.reminder
      // )
      !formData?.name ||
      !formData?.type ||
      !formData?.does ||
      !formData?.startDate ||
      !formData?.endDate ||
      !formData?.reminder
    ) {
      Alert.alert(t('enterAllFields'));
      return;
    }

    //Process of Date Range to show like format MM/DD/YYYY
    const dates = getDatesRange(formData?.startDate, formData.endDate);

    console.log(dates);

    // process of func loading show Date Save
    setLoading(true);

    //add data in firebase
    try {
      // Process backUp Image when link Image In TypeList bị lỗi
      const typeToSave = {
        name: formData?.type?.name,
        labelKey: formData?.type?.labelKey,
        icon: formData?.type?.icon,
      };

      await setDoc(doc(db, 'medication', docId), {
        ...formData,

        // Process backUp Image when link Image In TypeList bị lỗi
        type: typeToSave,

        userEmail: user?.email,
        docId: docId,

        //Process of Date Range to show like format MM/DD/YYYY
        dates: dates,
      });

      console.log('Date Saved!');
      // process of func loading show Date Save
      setLoading(false);
      Alert.alert(t('great'), t('medicationAdded'), [
        {
          text: t('ok'),
          onPress: () => navigation.replace('MainTabs'),
        },
      ]);
    } catch (e) {
      // process of func loading show Date Save
      setLoading(false);
      console.log(e);
    }
  };

  //Make auto fill by camera (save image)
  const [imageUri, setImageUri] = useState(null);

  //Make auto close Alert khi reload app
  const [ocrErrorVisible, setOcrErrorVisible] = useState(false);
  const [ocrErrorMessage, setOcrErrorMessage] = useState('');

  //Make funct show error of OCR
  // eslint-disable-next-line no-unused-vars
  const showOcrError = message => {
    setOcrErrorMessage(message);
    setOcrErrorVisible(true);
  };

  //Make auto fill by camera (save image + choose image)
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;

    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setImageUri(uri);
      onHandleInputChange('image', uri);

      //Process auto fill by OCR
      // eslint-disable-next-line no-undef
      detectMedicineName(uri);
    }
  };

  // //Import Photos
  // const openGallery = async () => {
  //   const result = await launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 0.8,
  //   });

  //   if (result.didCancel) return;

  //   const uri = result.assets?.[0]?.uri;
  //   if (uri) {
  //     setImageUri(uri);
  //     onHandleInputChange('image', uri);
  //   }
  // };

  //Import Documents
  const openGallery = async () => {
    try {
      const [file] = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      if (!file?.type?.startsWith('image/')) {
        Alert.alert(t('error'), t('pleaseChooseImageFile'));
        return;
      }

      if (file?.uri) {
        setImageUri(file.uri);
        onHandleInputChange('image', file.uri);

        //Process auto fill by OCR
        // eslint-disable-next-line no-undef
        detectMedicineName(file.uri);
      }
    } catch (error) {
      console.log('File picker cancelled or failed:', error);
    }
  };

  //User choose Camera or Collection
  const showImagePickerOptions = () => {
    Alert.alert(
      t('showImagePickerOptionsAlertTitle'),
      t('showImagePickerOptionsAlertMessage'),
      [
        {
          text: t('showImagePickerOptionsAlertText1'),
          onPress: openCamera,
        },
        {
          text: t('showImagePickerOptionsAlertText2'),
          onPress: openGallery,
        },
        {
          text: t('showImagePickerOptionsAlertText3'),
          style: 'cancel',
        },
      ],
    );
  };

  //Make Auto Fill by OCR
  // eslint-disable-next-line no-unused-vars
  const [medicineName, setMedicineName] = useState('');

  //Process OCR by AI for choose correct drug name

  //Func of OCR

  //Make show info about medicine
  // eslint-disable-next-line no-unused-vars
  const [infoLoading, setInfoLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [ocrText, setOcrText] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [medicineInfo, setMedicineInfo] = useState('');

  //Funct call API of AI

  return (
    <View style={styles.contain}>
      {/* <Text>AddMedicationForm</Text> */}
      <Text style={styles.header}>{t('addNewMedication')}</Text>

      {/* Make auto fill by camera */}
      <TouchableOpacity
        onPress={showImagePickerOptions}
        style={styles.imagePickerBox}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={32} color={Colors.PRIMARY} />
            {/* <Text style={styles.imagePickerText}>Chọn ảnh thuốc</Text> */}
            <Text style={styles.imagePickerText}>
              {t('showimagePickerText')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Make medical Name */}
      {/* <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="medkit-outline"
          size={24}
          color="black"
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('medicineName')}
          // //Process of TypeList
          // onChangeText={value => onHandleInputChange('name', value)}

          //Process of auto fill by OCR
          value={medicineName}
          onChangeText={value => {
            setMedicineName(value);
            onHandleInputChange('name', value);
          }}
        />
      </View> */}

      {/* Process of auto close thông báo when reload app */}
      <Modal
        visible={ocrErrorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOcrErrorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ocrAlertBox}>
            <Text style={styles.ocrAlertText}>{ocrErrorMessage}</Text>

            <TouchableOpacity
              onPress={() => {
                setOcrErrorVisible(false);
                setImageUri(null);
                setMedicineName('');
                setOcrText('');
                onHandleInputChange('image', null);
                onHandleInputChange('name', '');
              }}
            >
              <Text style={styles.ocrAlertButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.inputGroup}>
        <Ionicons name="medkit-outline" size={22} color={Colors.PRIMARY} />

        <View style={styles.divider} />

        <TextInput
          placeholder={t('medicineName')}
          value={formData?.name}
          onChangeText={value => onHandleInputChange('name', value)}
          style={styles.textInput}
        />

        <TouchableOpacity
          // eslint-disable-next-line no-undef
          onPress={getMedicineInfoByAI}
          style={styles.infoButton}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={Colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* Type List */}
      <FlatList
        data={TypeList}
        horizontal
        style={{ marginTop: 5 }}
        //Fix lỗi render của .map() to key ko bị trùng trong CustomDatePicker
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          // Before have process of touch
          // <View style={[styles.inputGroup, { marginRight: 10 }]}>

          // After have process of touch
          <TouchableOpacity
            style={[
              styles.inputGroup,
              { marginRight: 10 },

              //Process of when click will show color blue
              {
                backgroundColor:
                  item.name === formData?.type?.name ? Colors.PRIMARY : 'white',
              },
            ]}
            onPress={() => onHandleInputChange('type', item)}
          >
            {/* Style phía sau sẽ ghi đè style phía trước (combine nhiều style) */}
            <Text
              style={[
                styles.typeText,
                //Process of when click will show color blue
                {
                  color: item.name === formData?.type?.name ? 'white' : 'black',
                },
              ]}
            >
              {t(item?.labelKey)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Does Input */}
      <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="eyedrop-outline"
          size={24}
          color="black"
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('doseExample')}
          //Process of TypeList
          onChangeText={value => onHandleInputChange('does', value)}
        />
      </View>

      {/* When To Make DropDown */}
      <View style={styles.inputGroup}>
        <Ionicons
          style={styles.icon}
          name="time-outline"
          size={24}
          color="black"
        />

        {/* Process for Make DropDown when use react pick */}
        <Picker
          // Process of choose time
          selectedValue={formData?.when}
          onValueChange={itemValue => onHandleInputChange('when', itemValue)}
          //Css to show list time when click icon clock
          style={{
            width: '90%',
          }}
        >
          {WhenToTake.map((item, index) => (
            <Picker.Item
              key={index}
              label={t(item.labelKey)}
              value={item.name}
            />
          ))}
        </Picker>
      </View>

      {/* Start and End Date */}
      <View style={styles.dateInputGroup}>
        {/* Start Date */}

        {/* Before have Process of hide choose pick up Start & End date */}
        {/* <View style={[styles.inputGroup, { flex: 1 }]}> */}

        {/* After have Process of hide choose pick up Start & End date */}
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          //Process while show calendar to choose pick up date
          onPress={() => setShowStartDate(true)}
        >
          <Ionicons
            style={styles.icon}
            name="calendar-outline"
            size={24}
            color="black"
          />
          {/* Process before have function to save time choose after click ok and show the date choose */}
          {/* <Text style={styles.text}>{formData?.startDate ?? t("startDate")}</Text> */}
          {/* Process after have function to save time choose after click ok and show the date choose */}
          <Text style={styles.text}>
            {FormatDateForText(formData?.startDate, language) ?? t('startDate')}
          </Text>
          {/* Step 1 */}

          {/* Process of date time picker */}
          {/* Before have process of hide choose pick up Start & End date */}
          {/* <RNDateTimePicker */}
          {/* After have process of hide choose pick up Start & End date */}
          {/* {showStartDate && (
            <RNDateTimePicker
              minimumDate={new Date()}
              onChange={(event) => {
                console.log(event.nativeEvent.timestamp);
                //Process of hide choose pick up Start & End date
                setShowStartDate(false);
              }}
              //Process show calendar to choose
              value={formData?.startDate ?? new Date()}
            />
          )} */}
        </TouchableOpacity>

        {/* Step 2 of StartDate */}
        {showStartDate && (
          // <RNDateTimePicker
          //   locale={language === "vn" ? "vi-VN" : "en-US"}
          //   positiveButton={{ label: t("ok") }}
          //   negativeButton={{ label: t("cancel") }}
          //   minimumDate={new Date()}
          //   // Process before have file ConvertDateTime to save time choose after click ok
          //   // onChange={(event) => {
          //   //   console.log(event.nativeEvent.timestamp);

          //   // Process after have file ConvertDateTime to save time choose after click ok
          //   onChange={(event) => {
          //     setShowStartDate(false);
          //     if (event.type === "dismissed" || !event.nativeEvent.timestamp) return;

          //     onHandleInputChange(
          //       "startDate",
          //       FormatDate(event.nativeEvent.timestamp),
          //     );
          //   }}
          //   //Process show calendar to choose
          //   // value={formData?.startDate ?? new Date()}

          //   //Process fix show value not....Date Object
          //   value={formData?.startDate ? new Date(formData.startDate) : new Date()}
          // />
          //Make change VN / EN for date picker
          <CustomDatePicker
            visible={showStartDate}
            value={formData?.startDate}
            onClose={() => setShowStartDate(false)}
            onSelect={date => onHandleInputChange('startDate', date)}
          />
        )}

        {/* End Date */}
        {/* Before have Process of hide choose pick up Start & End date */}
        {/* <View style={[styles.inputGroup, { flex: 1 }]}> */}

        {/* After have Process of hide choose pick up Start & End date */}
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          onPress={() => setShowEndDate(true)}
        >
          <Ionicons
            style={styles.icon}
            name="calendar-outline"
            size={24}
            color="black"
          />

          <Text style={styles.text}>
            {FormatDateForText(formData?.endDate, language) ?? t('endDate')}
          </Text>
        </TouchableOpacity>

        {/* Process of date time picker for EndDate*/}
        {/* Process of hide choose pick up End date */}
        {showEndDate && (
          // <RNDateTimePicker
          //   locale={language === "vn" ? "vi-VN" : "en-US"}
          //   positiveButton={{ label: t("ok") }}
          //   negativeButton={{ label: t("cancel") }}
          //   minimumDate={new Date()}
          //   // Process  have file ConvertDateTime to save time choose after click ok
          //   onChange={(event) => {
          //     setShowEndDate(false);
          //     if (event.type === "dismissed" || !event.nativeEvent.timestamp)
          //       return;

          //     onHandleInputChange(
          //       "endDate",
          //       FormatDate(event.nativeEvent.timestamp),
          //     );
          //   }}
          //   //Process fix show value not....Date Object
          //   value={formData?.endDate ? new Date(formData.endDate) : new Date()}
          // />

          //Make change VN / EN for date picker
          <CustomDatePicker
            visible={showEndDate}
            value={formData?.endDate}
            onClose={() => setShowEndDate(false)}
            onSelect={date => onHandleInputChange('endDate', date)}
          />
        )}
      </View>

      {/* Get Remind Input */}
      <View style={styles.dateInputGroup}>
        <TouchableOpacity
          style={[styles.inputGroup, { flex: 1 }]}
          onPress={() => setshowTimePicker(true)}
        >
          <Ionicons
            style={styles.icon}
            name="timer-outline"
            size={24}
            color="black"
          />

          <Text style={styles.text}>
            {formData?.reminder ?? t('selectReminderTime')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Make ô tbao nhỏ in mục Chọn giờ nhắc */}
      {reminderError ? (
        <View style={styles.reminderErrorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.Red} />
          <Text style={styles.reminderErrorText}>{reminderError}</Text>
        </View>
      ) : null}

      {/* Process for start Select Reminder Time */}
      {showTimePicker && (
        <RNDateTimePicker
          locale={language === 'vn' ? 'vi-VN' : 'en-US'}
          positiveButton={{ label: t('ok') }}
          negativeButton={{ label: t('cancel') }}
          mode="time"
          // onChange={event => {
          //   onHandleInputChange(
          //     'reminder',
          //     formatTime(event.nativeEvent.timestamp),
          //   );

          //   //Process of hide choose pick up Remind Time
          //   setshowTimePicker(false);
          // }}
          // value={new Date(formData?.reminder) ?? new Date()}

          value={new Date()}
          //Process save time after choose
          // onValueChange={(event, date) => {
          //   if (!date) return;

          //   onHandleInputChange('reminder', formatTime(date.getTime()));
          //   setshowTimePicker(false);
          // }}

          //Process check time before save time after choose with hiện ô tbao nhỏ
          // onValueChange={(event, date) => {
          //   // //C1: Hiện ToastAndroid 'Chọn giờ nhắc không khả dụng'
          //   // if (!date) {
          //   //   setshowTimePicker(false);
          //   //   return;
          //   // }

          //   //Make show ô tbao nhỏ when chọn giờ quá gần hoặc đã qua
          //   setshowTimePicker(false);
          //   if (!date) return;

          //   const now = new Date();

          //   const selectedTime = new Date();

          //   selectedTime.setHours(date.getHours());
          //   selectedTime.setMinutes(date.getMinutes());
          //   selectedTime.setSeconds(0);
          //   selectedTime.setMilliseconds(0);

          //   //Remind time must lớn hơn giờ hiện tại ít nhất 1 minitues
          //   const minimumTime = new Date(now.getTime() + 1 * 60 * 1000);

          //   // //C1: Hiện ToastAndroid 'Chọn giờ nhắc không khả dụng'
          //   // if (selectedTime <= minimumTime) {
          //   //   ToastAndroid.show(
          //   //     'Chọn giờ nhắc không khả dụng',
          //   //     ToastAndroid.SHORT,
          //   //   );
          //   //   setshowTimePicker(false);
          //   //   return;
          //   // }

          //   //   onHandleInputChange('reminder', formatTime(selectedTime.getTime()));
          //   //   setshowTimePicker(false);
          //   // }}
          //   // onDismiss={() => {
          //   //   setshowTimePicker(false);
          //   // }}

          //   //Make show ô tbao nhỏ when chọn giờ quá gần hoặc đã qua
          //   if (selectedTime <= minimumTime) {
          //     setReminderError(t('reminderTimeUnavailable'));
          //     onHandleInputChange('reminder', null);
          //     return;
          //   }

          //   setReminderError('');
          //   onHandleInputChange('reminder', formatTime(selectedTime.getTime()));
          // }}

          //Process của choose time base on start date and check time before save time after choose with hiện ô tbao nhỏ
          onValueChange={(event, date) => {
            setshowTimePicker(false);

            if (!date) return;

            if (!formData?.startDate) {
              setReminderError(t('selectStartDateFirst'));
              return;
            }

            const now = new Date();

            // Get start date, không lấy today
            const selectedTime = new Date(formData.startDate);

            // Ghép giờ người dùng chọn vào ngày bắt đầu.
            selectedTime.setHours(date.getHours(), date.getMinutes(), 0, 0);

            //Remind time must lớn hơn giờ hiện tại ít nhất 1 minitues
            const minimumTime = new Date(now.getTime() + 60 * 1000);

            if (
              Number.isNaN(selectedTime.getTime()) ||
              selectedTime <= minimumTime
            ) {
              setReminderError(t('reminderTimeUnavailable'));
              onHandleInputChange('reminder', null);
              return;
            }

            setReminderError('');
            onHandleInputChange('reminder', formatTime(selectedTime.getTime()));
          }}
          onDismiss={() => {
            setshowTimePicker(false);
          }}
        />
      )}

      {/* Button Add New Medication*/}
      <TouchableOpacity style={styles.button} onPress={() => SaveMedication()}>
        {/*process of func loading show Date Save */}
        {loading ? (
          <ActivityIndicator size={'large'} color={'white'} />
        ) : (
          <Text style={styles.buttonText}>{t('addNewMedication')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    padding: 25,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
  },

  imagePickerBox: {
    height: 130,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  imagePickerText: {
    marginTop: 8,
    color: Colors.PRIMARY,
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.Semi_transparent_Black,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  ocrAlertBox: {
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 22,
    minHeight: 130,
  },

  ocrAlertText: {
    fontSize: 18,
    color: Colors.Off_black,
  },

  ocrAlertButton: {
    color: Colors.PRIMARY,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 50,
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    marginTop: 10,

    //Process of when click will show color blue
    backgroundColor: Colors.WHITE,
  },

  // textInput: {
  //   flex: 1,
  //   marginLeft: 10,
  //   fontSize: 16,
  // },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.Off_black,
  },

  infoButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  icon: {
    color: Colors.PRIMARY,
    borderRightWidth: 1,
    paddingRight: 12,
    borderColor: Colors.GRAY,
  },

  typeText: {
    fontSize: 16,
  },

  text: {
    fontSize: 16,
    padding: 5,
    flex: 1,
    marginLeft: 10,
  },

  reminderErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.Blush_White,
    borderWidth: 1,
    borderColor: Colors.Light_Red,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
  },

  reminderErrorText: {
    color: Colors.Red,
    fontSize: 13,
  },

  dateInputGroup: {
    flexDirection: 'row',
    gap: 10,
  },

  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    width: '100%',
    marginTop: 25,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 17,
    color: 'white',
    textAlign: 'center',
  },
});
