import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import { RESPONSE_DATA, API } from './interfaces/RESPONSE_DATA';

export default function App() {
  const [totalPages, setTotalpages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [posts, setPosts] = useState<RESPONSE_DATA[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const itemsPerPage :number = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);
  
  async function fetchData() {
    setRefreshing(true);
    try {
      const response = await fetch(API);
      const items = await response.json();
      setTotalpages(items.length / itemsPerPage);
      setPosts(items);
      setRefreshing(false);

      
    } catch (error) {
      setRefreshing(false);
      console.log(error);
    }
  }

  const handlePageClick = (p: number) => setCurrentPage(p);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEmpty = () => {
    return <Text> There's no any data =/</Text>;
  };

  const renderPaginationButtons = () => {
    const maxButtonsToShow = 6;
    let startPage = Math.max(0, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
  
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(0, endPage - maxButtonsToShow + 1);
    }
  
    const buttons = [];
  
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[
            styles.pagination_button,
            i === currentPage ? styles.active_button : null,
          ]}>
          <Text style={styles.pagination_number}>{i}</Text>
        </TouchableOpacity>,
      );
    }
  
    return buttons;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({item}) => <View style={styles.flat_item}>
          <Text style={styles.text_id}>{item.id}</Text>
          <Text style={styles.text_title}>{item.title}</Text>
          <Text style={styles.text_body}>{item.body}</Text>

        </View>}
        ListEmptyComponent={handleEmpty}
        windowSize={10}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
       <View style={styles.pagination_container}>
        {renderPaginationButtons()}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    justifyContent:'center',
    alignItems:'center',
  },
  flat_item:{
    flexDirection:'row',
    backgroundColor: 'whitesmoke',
    padding: 10,
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#222222'
  },
  text_id:{
    width: '8%',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222222',
    textAlign:'center',
    padding:4,
    borderWidth:1,
    borderColor:'#999999'
  },
  text_title:{
    width: '32%',
    textAlign:'center',
    padding:4,
    borderWidth:1,
    borderColor:'#999999'

  },
  text_body:{
    width: '60%',
    textAlign:'center',
    padding:4,
    borderWidth:1,
    borderColor:'#999999'
  },
  pagination_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding:8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor:'#222222'
  },
  pagination_button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  active_button: {
    backgroundColor: 'skyblue',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button_text: {
  },
  pagination_number:{
    color: 'whitesmoke',
  }
});
