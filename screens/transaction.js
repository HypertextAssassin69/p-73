import React from 'react';
import { Text, View,TouchableOpacity, StyleSheet, TextInput,Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from "../config"
import firebase from "firebase"


export default class TransactionScreen extends React.Component {
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:''
        }
    }
    getCameraPermissions=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false
        });
      }
    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state
      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
    }
   bookIssue=async()=>{
     await db.collection("books").doc(this.state.scannedBookId).update({
     bookAvailabilty:false
     })
     db.collection("students").doc(this.state.scannedStudentId).update({
       numberOfBookIssued : firebase.firestore.FieldValue.increment(1)
     })
     db.collection("transaction").add({
       StudentID:this.state.scannedStudentId,
       BookID:this.state.scannedBookId,
       issueDate:firebase.firestore.TimeStamp.now().toDate(),
       transactionType:"Issued"
     })
     
   }
   bookReturn=async()=>{
    await db.collection("books").doc(this.state.scannedBookId).update({
    bookAvailabilty:true
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
      numberOfBookIssued : firebase.firestore.FieldValue.increment(-1)
    })
    db.collection("transaction").add({
      StudentID:this.state.scannedStudentId,
      BookID:this.state.scannedBookId,
      issueDate:firebase.firestore.TimeStamp.now().toDate(),
      transactionType:"Returned"
    })
  }
    handleTransaction = async( )=>{
      db.collection("books").doc(this.state.scannedBookId).get()
      .then((doc)=>{
        var book = doc.data()
        if (book.bookAvailabilty === true){
          this.bookIssue();
        }else{
          this.bookReturn();
        }
      })
    }
    render() {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
  
        if (buttonState !== "normal" && hasCameraPermissions){
          return (<BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
            );
        
        }
        else if(buttonState==="normal"){
     
          return (
            <View style={styles.container}>
              <View>
                <Image 
                  source={require("../assets/booklogo.jpg")}
                  style={{width:200,height:200}}/>
                  <Text style={{textAlign:'center',fontSize:30}}>Wily</Text>
              </View>
              <View style={styles.inputView}>
                <TextInput 
                style={styles.inputBox}
                placeHolder="Book Id"
                value={this.state.scannedBookId}
                onChangeText={(text) => {
                  this.setState({
                    scannedBookId: text,
                  });
                }}/>
      
              <TouchableOpacity style={styles.scanButton}
              onPress={()=>{this.getCameraPermissions("BookId")}}>
                  <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
              </View>

              <View style={styles.inputView}>
              <TextInput 
                style={styles.inputBox}
                placeHolder="Student Id"
                value={this.state.scannedStudentId}
                onChangeText={(text) => {
                  this.setState({
                    scannedStudentId: text,
                  });
                }}/>
  
              <TouchableOpacity style={styles.scanButton}
              onPress={()=>{this.getCameraPermissions("StudentId")}}>
                  <Text style={styles.buttonText}>Scan </Text>
              </TouchableOpacity>
              
              
              </View>
            <TouchableOpacity onPress={async()=>{await this.handleTransaction()}}><Text>Submit</Text></TouchableOpacity>
            </View>
          );
        }
    }
  }
  const styles=StyleSheet.create({
      container:{
          flex:1,
          justifyContent:'center',
          alignContent:'center'
      },
      displayText:{
          fontSize:15,
          textDecorationLine:'underline'
      },
      scanButton:{
          backgroundColor:"#FE3211",
          padding:10,
          margin:10
      },
      buttonText:{
          fontSize:20,
      },
      inputView:{
        flexDirection: 'row',
        margin: 20
      },
      inputBox:{
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20
      },
      scanButton:{
        backgroundColor: '#66BB6A',
        width: 50,
        borderWidth: 1.5,
        borderLeftWidth: 0
      }
  })