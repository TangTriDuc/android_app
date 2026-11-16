import { FlatList, View } from 'react-native';
// import EmptyState from "../components/EmptyState";
import Header from '../components/Header';
import MedicationList from '../components/MedicationList';

export default function HomeScreen() {
  return (
    // //Before have step addNew
    // <View style={{ marginTop: 45 }}>
    //   <Text>HomeScreen</Text>
    //   {/* When done have process sign in / up with firebase */}
    //   {/* <Redirect href={"login"} /> */}
    //   {/* when click login it will go HomeScreen */}

    //   <Button title="Logout" onPress={() => signOut(auth)} />
    // </View>

    //After have step addNew
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View>
          <Header />

          {/* Show screen EmptyState */}

          {/* <EmptyState /> */}

          <MedicationList />
        </View>
      }
    />
  );
}
