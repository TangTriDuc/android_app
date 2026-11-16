import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from './../constant/Colors';
import { useLanguage } from '../context/LanguageContext';
import moment from 'moment';

const whenLabelKeys = {
  'When To Take': 'whenToTake',
  'Before eating': 'Before eating',
  'After eating': 'After eating',
  Morning: 'morning',
  Noon: 'noon',
  'Before Lunch': 'beforeLunch',
  'After Lunch': 'afterLunch',
  Afternoon: 'afternoon',
  Evening: 'evening',
  'Before Dinner': 'beforeDinner',
  'After Dinner': 'afterDinner',
  'Before Sleeping': 'beforeSleeping',
  'Before Morning': 'beforeMorning',
  'After Morning': 'afterMorning',
};

const typeLabelKeys = {
  Tablet: 'tablet',
  Capsules: 'capsules',
  Drops: 'drops',
  Syrup: 'syrup',
  Injection: 'injection',
  EffervescentTablet: 'effervescentTablet',
  Eyedrop: 'eyedrop',
  Other: 'other',
};

export default function MedicationCardItem({ medicine, selectedDate = '' }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState();

  // Process backUp Image when link Image In TypeList bị lỗi
  const [isIconError, setIsIconError] = useState(false);

  // useEffect(() => {
  //   CheckStatus();
  // }, [medicine]);

  // //Process cho action click
  // const CheckStatus = () => {
  //   const data = medicine?.action?.find(item => item.date === selectedDate);
  //   setStatus(data);
  // };

  //Process cho action click của trạng thái gần nhất
  const CheckStatus = useCallback(() => {
    const actionsOfDate =
      medicine?.action?.filter(item => item.date === selectedDate) || [];

    const latestAction = actionsOfDate[actionsOfDate.length - 1];

    setStatus(latestAction);
  }, [medicine, selectedDate]);

  useEffect(() => {
    CheckStatus();
  }, [CheckStatus]);

  //Reset Image error when change thuốc
  useEffect(() => {
    setIsIconError(false);
  }, [medicine?.type?.icon]);

  // Process backUp Image when link Image In TypeList bị lỗi
  const getBackupIcon = () => {
    switch (medicine?.type?.labelKey) {
      case 'eyedrop':
      case 'drops':
        return require('../../assets/images/eye-dropper.png');

      case 'effervescentTablet':
        return require('../../assets/images/effervescent.png');

      case 'syrup':
        return require('../../assets/images/medicine.png');

      default:
        return require('../../assets/images/drugs.png');
    }
  };

  //Make show event today thì hiện cần uống và event đã qua / sắp tới
  const getScheduleStatus = () => {
    if (status?.status === 'Taken') {
      return {
        text: t('taken'),
        color: Colors.GREEN,
      };
    }

    if (status?.status === 'Missed') {
      return {
        text: t('missed'),
        color: 'red',
      };
    }

    const today = moment().startOf('day');
    const cardDate = moment(selectedDate, 'MM/DD/YYYY').startOf('day');

    if (cardDate.isBefore(today)) {
      return {
        text: t('missed'),
        color: 'red',
      };
    }

    if (cardDate.isSame(today)) {
      return {
        text: t('needToTake'),
        color: Colors.PRIMARY,
      };
    }

    //Process make đếm ngày diễn ra
    const daysLeft = cardDate.diff(today, 'days');

    return {
      // text: t('upcoming'),
      text: `${t('needToTakeAfter')} ${daysLeft} ${t('day')}`,
      color: Colors.Blue1,
    };
  };

  const scheduleStatus = getScheduleStatus();

  const whenText = whenLabelKeys[medicine?.when]
    ? t(whenLabelKeys[medicine?.when])
    : medicine?.when;
  const typeText = medicine?.type?.labelKey
    ? t(medicine.type.labelKey)
    : typeLabelKeys[medicine?.type?.name]
    ? t(typeLabelKeys[medicine?.type?.name])
    : medicine?.type?.name;

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.imageContainer}>
          {/* <Image
            source={{ uri: medicine?.type?.icon }}
            style={styles.cssImage}
          /> */}

          {/* Process backUp Image when link Image In TypeList bị lỗi */}
          <Image
            source={
              isIconError || !medicine?.type?.icon
                ? getBackupIcon()
                : { uri: medicine?.type?.icon }
            }
            style={styles.cssImage}
            onError={() => setIsIconError(true)}
          />
        </View>

        <View style={styles.infoContainer}>
          {/* <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
            {medicine?.name}
          </Text> */}

          <Text style={styles.medicineName} numberOfLines={1}>
            {medicine?.name}
          </Text>

          <Text style={{ fontSize: 17 }}>{whenText}</Text>

          {/* Make show event today thì hiện cần uống và event đã qua / sắp tới */}
          <Text
            style={[styles.scheduleStatusText, { color: scheduleStatus.color }]}
          >
            {scheduleStatus.text}
          </Text>

          {/* <Text
            style={{ color: Colors.Orange, fontSize: 15, fontWeight: 'bold' }}
          >
            {medicine?.does} {typeText}
          </Text> */}

          {/* Làm hiện chữ for từng cái event of dòng chữ màu cam */}
          <Text style={[styles.detailText, styles.doesText1]}>
            {t('doseLabel')}: {medicine?.does}
          </Text>

          <Text style={[styles.detailText, styles.doesText2]}>
            {t('medicineTypeLabel')}: {typeText}
          </Text>
        </View>
      </View>

      <View style={styles.reminderContainer}>
        <Ionicons name="timer-outline" size={24} color="black" />
        {/* <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
          {medicine?.reminder}
        </Text> */}

        <Text style={styles.reminderText} numberOfLines={1}>
          {medicine?.reminder}
        </Text>
      </View>

      {status?.date && (
        <View style={styles.statusContainer}>
          {status?.status === 'Taken' ? (
            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
          ) : (
            status?.status === 'Missed' && (
              <Ionicons name="close-circle" size={24} color="red" />
            )
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // borderWidth: 1,
    borderWidth: 1.5,

    // borderColor: Colors.LIGHT_GRAY_BORDER,

    borderColor: '#B1E5E6',

    marginTop: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },

  // container: {
  //   padding: 10,
  //   // borderWidth: 1,
  //   borderWidth: 1.5,
  //   // borderColor: Colors.LIGHT_GRAY_BORDER,
  //   // borderColor: '#972828',
  //   borderColor: '#B1E5E6',
  //   marginTop: 10,
  //   borderRadius: 15,
  //   flexDirection: 'row',
  //   width: '100%',
  //   alignItems: 'center',
  //   backgroundColor: '#f7f7f7',
  // },

  // subContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },

  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  infoContainer: {
    flex: 1,
    minWidth: 0,
  },

  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cssImage: {
    width: 60,
    height: 60,
  },
  imageContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },

  scheduleStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },

  detailText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  doesText1: { color: Colors.Orange },
  doesText2: { color: Colors.GREEN1 },

  // reminderContainer: {
  //   padding: 12,
  //   borderRadius: 15,
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: Colors.LIGHT_GRAY_BORDER,
  // },

  reminderContainer: {
    width: 78,
    minHeight: 62,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    backgroundColor: '#f7f7f7',
  },

  reminderText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  statusContainer: {
    position: 'absolute',
    top: 5,
    padding: 7,
  },
});
