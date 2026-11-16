import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddMedicationForm from '../components/AddMedicationForm';
import AddMedicationHeader from '../components/AddMedicationHeader';

export default function AddNewMedication() {
  return (
    <SafeAreaView>
      <ScrollView>
        <AddMedicationHeader />

        <AddMedicationForm />
      </ScrollView>
    </SafeAreaView>
  );
}
