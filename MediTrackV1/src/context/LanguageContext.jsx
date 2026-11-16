// cspell:disable
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../services/Storage';

const LANGUAGE_KEY = 'appLanguage';

const translations = {
  en: {
    home: 'Home',
    history: 'History',
    profile: 'Profile',
    continue: 'Continue',
    loginHeroTitle: 'Stay on Track, Stay Healthy!',
    loginHeroSubtitle:
      'Track your meds, take control of your health. Stay consistent, stay confident',
    loginNote:
      'Note: By Clicking Continue button, you will agree to our terms and condition',
    signInTitle: "Let's Sign You In",
    welcomeBack: 'Welcome Back',
    missedYou: "You've been missed!",
    email: 'Email',
    password: 'Password',
    login: 'Login',
    createAccount: 'Create Account',
    createNewAccount: 'Create New Account',
    fullName: 'Full Name',
    alreadyAccountSignIn: 'Already account? Sign In',
    addNewMedication: 'Add New Medication',
    myMedication: 'My Medication',
    logout: 'Logout',
    logoutConfirm: 'Are you sure?',
    cancel: 'Cancel',
    logoutFailed: 'Logout failed',
    tryAgain: 'Please try again.',
    noMedication: 'No Medications!',
    medicationSubText: 'You have 0 medication setup, Kindly setup a new one',
    addNewMedicationBtn: '+ Add New Medication',
    medicineName: 'Medicine Name',
    doseExample: 'Dose Ex. 2, 5ml',
    startDate: 'Start Date',
    endDate: 'End Date',
    selectReminderTime: 'Select Reminder Time',
    enterAllFields: 'Enter all fields',
    great: 'Great!',
    medicationAdded: 'New Medication added successfully!',
    ok: 'Confirm',
    noMedicationFound: 'No Medication Found',
    responseSaved: 'Response Saved!',
    itsTimeToTake: "It's time to take",
    missed: 'Missed',
    taken: 'Taken',
    invalidEmailOrPassword: 'Invalid email or password',
    pleaseEnterEmailPassword: 'Please enter email & password',
    pleaseFillAllDetails: 'Please fill all details',
    pleaseEnterEmailAndPassword: 'Please Enter email and Password',
    emailAlreadyExist: 'Email already exist',
    tablet: 'Tablet',
    capsules: 'Capsules',
    drops: 'Drops',
    syrup: 'Syrup',
    injection: 'Injection',
    effervescentTablet: 'Effervescent tablet',
    eyedrop: 'Eye drop',
    other: 'Other',
    whenToTake: 'When To Take',
    beforeEating: 'Before Eating',
    afterEating: 'After Eating',
    morning: 'Morning',
    beforeMorning: 'Before Morning',
    afterMorning: 'After Morning',
    beforeLunch: 'Before Lunch',
    noon: 'Noon',
    afterLunch: 'After Lunch',
    afternoon: 'Afternoon',
    evening: 'Evening',
    beforeDinner: 'Before Dinner',
    afterDinner: 'After Dinner',
    beforeSleeping: 'Before Sleeping',
    editProfile: 'Edit',
    editProfileName: 'Full name',
    editProfileCancel: 'Cancel',
    editProfileSave: 'Save',
    editProfileAlert: 'Please fill in all the details.',
    updateUserAlertTitle: 'Success',
    updateUserAlertMessage: 'Profile updated',
    updateUserAlertErrorTitle: 'Error',
    updateUserAlertErrorMessage: 'Unable to update profile',
    getMedicineInfoByAIAlert1Title: 'Notification',
    getMedicineInfoByAIAlert1Message:
      'Please select an image or enter the medication name first',

    getMedicineInfoByAIAlert2Title: 'Error',
    getMedicineInfoByAIAlert2Message:
      'Unable to retrieve medication information',

    getMedicineInfoByAIAlert3Title: 'Drug Information',

    showimagePickerText: 'Select medication photo',
    showImagePickerOptionsAlertText2: 'Files',
    showImagePickerOptionsAlertText3: 'Cancel',
    showImagePickerOptionsAlertText1: 'Camera',
    showImagePickerOptionsAlertTitle: 'Select photo',
    showImagePickerOptionsAlertMessage:
      'Where do you want to get the photo from?',
    needToTake: 'Need to take',
    needToTakeAfter: 'Need to take after',
    day: 'day(s)',
    upcoming: 'Upcoming',
    doseLabel: 'Dose',
    medicineTypeLabel: 'Medicine type',
    delete: 'Delete',
    deleteMedication: 'Delete medication',
    deleteMedicationConfirm: 'Are you sure you want to delete this medication?',
    reminderTimeUnavailable: 'Reminder time is not available',

    infoUser: 'Account Information',
    accountNoticeTitle: 'Notification',
    accountInfoUnavailable: 'Account information is unavailable.',
    accountNotUpdated: 'Not updated',
    accountClose: 'Close',
    deleteAccount: 'Delete account',

    //confirmDeleteAccount
    deleteAccountConfirm:
      'Are you sure you want to delete your account? This action cannot be undone.',
    deleteAccountConfirm1: 'Yes',
    deleteAccountConfirm2: 'No',

    //handleDeleteAccount
    accountNotSignedIn: 'You are not signed in.',
    accountReLoginTitle: 'Sign in again',
    accountReLoginMessage:
      'Please sign out and sign in again to delete your account.',
    deleteAccountFailedTitle: 'Account deletion failed',
    deleteAccountFailedMessage:
      'Unable to delete your account. Please try again.',

    accountDeletedTitle: 'Account deleted',
    pleaseCreateAccount: 'Please create an account to continue.',
  },
  vn: {
    home: 'Trang chủ',
    history: 'Lịch sử',
    profile: 'Hồ sơ',
    continue: 'Tiếp tục',
    loginHeroTitle: 'Uống thuốc đúng giờ, sống khỏe mỗi ngày!',
    loginHeroSubtitle:
      'Theo dõi thuốc, chủ động chăm sóc sức khỏe. Duy trì đều đặn và tự tin hơn',
    loginNote:
      'Lưu ý: Khi bấm Tiếp tục, bạn đồng ý với điều khoản và điều kiện của chúng tôi',
    signInTitle: 'Đăng nhập tài khoản',
    welcomeBack: 'Chào mừng trở lại',
    missedYou: 'Rất vui được gặp lại bạn!',
    email: 'Thư điện tử',
    password: 'Mật khẩu',
    login: 'Đăng nhập',
    createAccount: 'Tạo tài khoản',
    createNewAccount: 'Tạo tài khoản mới',
    fullName: 'Họ và tên',
    alreadyAccountSignIn: 'Đã có tài khoản? Đăng nhập',
    addNewMedication: 'Thêm thuốc mới',
    myMedication: 'Thuốc của tôi',
    logout: 'Đăng xuất',
    logoutConfirm: 'Bạn có chắc không?',
    cancel: 'Hủy',
    logoutFailed: 'Đăng xuất thất bại',
    tryAgain: 'Vui lòng thử lại.',
    noMedication: 'Chưa có thuốc!',
    medicationSubText: 'Bạn chưa cài đặt thuốc nào, hãy thêm thuốc mới',
    addNewMedicationBtn: '+ Thêm thuốc mới',
    medicineName: 'Tên thuốc',
    doseExample: 'Liều dùng VD: 2 viên, 5ml',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
    selectReminderTime: 'Chọn giờ nhắc',
    enterAllFields: 'Vui lòng nhập đầy đủ thông tin',
    great: 'Tuyệt vời!',
    medicationAdded: 'Đã thêm thuốc mới thành công!',
    ok: 'Xác nhận',
    noMedicationFound: 'Không tìm thấy thuốc',
    responseSaved: 'Đã lưu phản hồi!',
    itsTimeToTake: 'Đã đến giờ uống thuốc',
    missed: 'Đã bỏ lỡ',
    taken: 'Đã uống',
    invalidEmailOrPassword: 'Email hoặc mật khẩu không đúng',
    pleaseEnterEmailPassword: 'Vui lòng nhập email và mật khẩu',
    pleaseFillAllDetails: 'Vui lòng nhập đầy đủ thông tin',
    pleaseEnterEmailAndPassword: 'Vui lòng nhập email và mật khẩu',
    emailAlreadyExist: 'Email đã tồn tại',
    tablet: 'Viên nén',
    capsules: 'Viên nang',
    drops: 'Thuốc nhỏ',
    syrup: 'Siro',
    eyedrop: 'Nhỏ mắt',
    injection: 'Thuốc tiêm',
    effervescentTablet: 'Viên sủi',
    other: 'Khác',
    whenToTake: 'Thời điểm',
    beforeEating: 'Trước khi ăn',
    afterEating: 'Sau khi ăn',
    morning: 'Buổi sáng',
    beforeMorning: 'Trước bữa sáng',
    afterMorning: 'Sau bữa sáng',
    beforeLunch: 'Trước bữa trưa',
    noon: 'Buổi trưa',
    afterLunch: 'Sau bữa trưa',
    afternoon: 'Buổi chiều',
    evening: 'Buổi tối',
    beforeDinner: 'Trước bữa tối',
    afterDinner: 'Sau bữa tối',
    beforeSleeping: 'Trước khi ngủ',
    editProfile: 'Chỉnh sửa',
    editProfileName: 'Họ và tên',
    editProfileCancel: 'Hủy',
    editProfileSave: 'Lưu',
    editProfileAlert: 'Vui lòng nhập họ tên',
    updateUserAlertTitle: 'Thành công',
    updateUserAlertMessage: 'Đã cập nhật hồ sơ',
    updateUserAlertErrorTitle: 'Lỗi',
    updateUserAlertErrorMessage: 'Không thể cập nhật hồ sơ',
    getMedicineInfoByAIAlert1Title: 'Thông báo',
    getMedicineInfoByAIAlert1Message:
      'Vui lòng chọn ảnh hoặc nhập tên thuốc trước',

    getMedicineInfoByAIAlert2Title: 'Lỗi',
    getMedicineInfoByAIAlert2Message: 'Không lấy được thông tin thuốc',
    getMedicineInfoByAIAlert3Title: 'Thông tin thuốc',
    showimagePickerText: 'Chọn ảnh thuốc',
    showImagePickerOptionsAlertText2: 'Tệp ảnh',
    showImagePickerOptionsAlertText3: 'Hủy',
    showImagePickerOptionsAlertTitle: 'Chọn ảnh',
    showImagePickerOptionsAlertMessage: 'Bạn muốn lấy ảnh từ đâu?',
    showImagePickerOptionsAlertText1: 'Máy ảnh',
    showImagePickerOptionsAlert: ('Chọn ảnh', 'Bạn muốn lấy ảnh từ đâu?'),
    needToTake: 'Cần uống',
    needToTakeAfter: 'Cần uống sau',
    day: 'ngày',
    upcoming: 'Sắp tới',
    doseLabel: 'Liều dùng',
    medicineTypeLabel: 'Loại thuốc',
    delete: 'Xóa',
    deleteMedication: 'Xóa thuốc',
    deleteMedicationConfirm: 'Bạn có chắc muốn xóa thuốc này không?',
    reminderTimeUnavailable: 'Chọn giờ nhắc không khả dụng',

    infoUser: 'Thông tin tài khoản',
    accountNoticeTitle: 'Thông báo',
    accountInfoUnavailable: 'Chưa có thông tin tài khoản.',
    accountNotUpdated: 'Chưa cập nhật',
    accountClose: 'Đóng',
    deleteAccount: 'Xóa tài khoản',

    //confirmDeleteAccount
    deleteAccountConfirm:
      'Bạn có chắc muốn xóa tài khoản? Thao tác này không thể hoàn tác.',
    deleteAccountConfirm1: 'Có',
    deleteAccountConfirm2: 'Không',

    // handleDeleteAccount
    accountNotSignedIn: 'Bạn chưa đăng nhập.',
    accountReLoginTitle: 'Cần đăng nhập lại',
    accountReLoginMessage:
      'Hãy đăng xuất rồi đăng nhập lại để thực hiện xóa tài khoản.',
    deleteAccountFailedTitle: 'Xóa tài khoản thất bại',
    deleteAccountFailedMessage: 'Không thể xóa tài khoản. Vui lòng thử lại.',

    accountDeletedTitle: 'Tài khoản đã xóa',
    pleaseCreateAccount: 'Vui lòng tạo tài khoản để tiếp tục.',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('vn');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await getLocalStorage(LANGUAGE_KEY);
      if (savedLanguage === 'vn' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async nextLanguage => {
    setLanguageState(nextLanguage);
    await setLocalStorage(LANGUAGE_KEY, nextLanguage);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: key => translations[language]?.[key] ?? translations.en[key] ?? key,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

//Change VN / EN
export const useLanguage = () => useContext(LanguageContext);
