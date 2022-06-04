import React, {useContext, useEffect, useState,useCallback} from 'react';
import colors from '../res/colors';
import images from '../res/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Card,

} from '../../styles/FeedStyles';
import {Image, Dimensions,Text, View, StyleSheet, TouchableWithoutFeedback,RefreshControl} from 'react-native';
import { AuthContext } from './AuthProvider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import firebase  from '@react-native-firebase/app';
import { theme } from '../Chat/ChatTheme';
import Icon from "react-native-vector-icons/SimpleLineIcons";

const MessageCard = ({item}) => {
  const [users,setUsers] = useState(null)
  const {user, logout} = useContext(AuthContext);
  const [friendData, setFriendData] = useState(null);
  const friend = friendData
  const navigation = useNavigation();

  const [ready, setReady] = useState(true)
  const [presentData, setPresent]= useState(null)
  const getUsers = async ()=>{
           const querySanp = await firestore().collection('users').where('uid','!=', user.uid).get()
           const allusers = querySanp.docs.map(docSnap=>docSnap.data())
          //  console.log(allusers)
         
          setUsers(allusers)
  }
 

const getPresent = async (item)=>{
const querySanp = await firestore()
.collection('present')
.doc(item.uid)
.collection('presentDetail')
.get()
const allposts = querySanp.docs.map(docSnap=>docSnap.data())
//  console.log(allusers)
setPresent(allposts)
} 

const fetchFriends = async () => {
try {
  const list = [];

  await firestore()
    .collection('friends')
    .doc(firebase.auth().currentUser.uid)
    .collection('friendsinfo')
    .where('uid','!=', firebase.auth().currentUser.uid)
    .get()
    .then((querySnapshot) => {
      
      querySnapshot.forEach((doc) => {
        const {
          name,
          sname,
          birthday,
          
        } = doc.data();
        list.push({
          name,
          sname,
          birthday,
          
        });
      });
    });

    setFriendData(list);

 


} catch (e) {
  console.log(e);
}
};  
  useEffect(()=>{
    setTimeout(()=>{
      setReady(false)
      },1000)   
      getUsers();
      fetchFriends();
      getPresent(item);
  },[])

  return (
    <Card key={item.uid}>
       <View style={styles.container}>
        <TouchableOpacity style={styles.conversation}
        onPress={() => navigation.navigate('CHAT', {name:item.name,uid:item.uid,img:item.userImg, about:item.about
        
      })}>
          
          <TouchableOpacity 
            onPress={() => setModalVisible(currentValue => !currentValue)}
            style={[styles.imageContainer]}>
            <Image source={{ uri: item.userImg }} style={styles.img} />
          </TouchableOpacity>
          <View style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <Text numerOfLine={1} style={styles.username}>{item.name}</Text>
              <TouchableOpacity>
              <Icon name="present" size={30}></Icon>

              </TouchableOpacity>
             
            </View>
  
           
           

      
    
           
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              
            </View>
          </View>
        </TouchableOpacity>
        </View>
      

 
    </Card>
  );
};

export default MessageCard;
const styles = StyleSheet.create({
  img:{width:60,height:60,borderRadius:30,backgroundColor:"orange"},
  text:{
     fontSize:18,
     marginLeft:15,
  },
  
  mycard:{
     flexDirection:"row",
     margin:3,
     padding:4,
     backgroundColor:"white",
     borderBottomWidth:1,
     borderBottomColor:'grey'
  },
  fab: {
  position: 'absolute',
  margin: 16,
  right: 0,
  bottom: 0,
  backgroundColor:"white"
  },
  container: {
  
  },
  conversation: {
    flexDirection: 'row',
    paddingBottom: 25,
    paddingRight: 20,
    paddingLeft: 10
  },
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center' 
  },
  image: {
    height: 55,
    width: 55
  },
  username: {
    fontSize: theme.fontSize.title,
    color: theme.colors.title,
    width: 210
  },
  message: {
    fontSize: theme.fontSize.message,
    width: 240,
    color: theme.colors.subTitle
  },
  time: {
    fontSize: theme.fontSize.subTitle,
    color: theme.colors.subTitle,
    fontWeight: '300'
  },
  notificationCircle: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    height: 20,
    width: 20,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notification: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 10
  },
  });