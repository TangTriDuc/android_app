import moment from 'moment';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constant/Colors';
import { useLanguage } from '../context/LanguageContext';

//Process hiện tháng ko giới hạn
import { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const dayLabels = {
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  vn: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

const monthLabels = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  vn: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
};

export default function CustomDatePicker({
  visible,
  value,
  onClose,
  onSelect,
}) {
  const { language, t } = useLanguage();

  // //Process vừa chose date vừa render month sẽ giới hạn next month và tháng sâu hơn
  // const selectedDate = value ? moment(value) : moment();
  // const monthStart = selectedDate.clone().startOf('month');
  // const daysInMonth = selectedDate.daysInMonth();

  //Process hiện tháng ko giới hạn đang xem
  const [displayDate, setDisplayDate] = useState(
    value ? moment(value) : moment(),
  );

  useEffect(() => {
    if (visible) {
      setDisplayDate(value ? moment(value) : moment());
    }
  }, [value, visible]);

  const selectedDate = value ? moment(value) : null;
  const monthStart = displayDate.clone().startOf('month');
  const daysInMonth = displayDate.daysInMonth();

  const firstDay = monthStart.day();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    // days.push(selectedDate.clone().date(day));

    //Render date theo displayDate
    days.push(displayDate.clone().date(day));
  }

  //Funct of chuyển date tiếp theo
  const goToPreviousMonth = () => {
    setDisplayDate(currentDate => currentDate.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setDisplayDate(currentDate => currentDate.clone().add(1, 'month'));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* <Text style={styles.year}>{selectedDate.year()}</Text>
            <Text style={styles.header}>
            {monthLabels[language][selectedDate.month()]} {selectedDate.year()}
          </Text> */}

          {/* Make button header bằng trái phải */}
          <Text style={styles.year}>{displayDate.year()}</Text>

          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={goToPreviousMonth}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            <Text style={styles.header}>
              {monthLabels[language][displayDate.month()]} {displayDate.year()}
            </Text>

            <TouchableOpacity
              onPress={goToNextMonth}
              style={styles.monthButton}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {dayLabels[language].map((day, index) => (
              // <Text key={day} style={styles.weekText}>

              //Fix lỗi render của .map() to key ko bị trùng
              <Text key={`${day}-${index}`} style={styles.weekText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {days.map((item, index) => {
              // //Process ktra date đang chọn
              // const isSelected =
              //   item && value && item.isSame(moment(value), 'day');

              //Process hiện tháng ko giới hạn với ktra date dag chọn
              const isSelected =
                item && selectedDate && item.isSame(selectedDate, 'day');

              //Hiện ngày tháng of today
              const isToday = item && item.isSame(moment(), 'day');

              return (
                <TouchableOpacity
                  key={index}
                  disabled={!item}
                  style={[
                    styles.dayBox,
                    isSelected && styles.selectedDayBox,
                    isToday && styles.todayDayBox,
                  ]}
                  onPress={() => {
                    onSelect(item.toDate());
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isToday && styles.todayDayText,
                    ]}
                  >
                    {item ? item.date() : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.actionText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '82%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  year: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  // header: {
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   marginTop: 5,
  //   marginBottom: 20,
  // },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  monthButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekText: {
    width: 36,
    textAlign: 'center',
    color: Colors.DARK_GRAY,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayBox: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },

  todayDayBox: {
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 99,
  },

  todayDayText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },

  selectedDayBox: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionRow: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  actionText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
});
