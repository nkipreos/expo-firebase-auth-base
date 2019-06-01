import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import { firebaseConfig } from './config'

firebase.initializeApp(firebaseConfig);

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      accessToken: '',
      refreshToken: ''
    }
    this.retrieveCredential()
    console.log(firebaseConfig);
  }

  retrieveCredential = () => {
    console.log('Will retrieve credentials')
    _retrieveData = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const accessToken = await AsyncStorage.getItem('refreshToken');
        if (accessToken !== null && refreshToken !== null) {
          this.setState({accessToken: accessToken, refreshToken: refreshToken})
        }
      } catch (error) {
        console.log(error);
      }
    }
    _retrieveData();
  }

  signUpUser = (email, password) => {
    try{
      if(this.state.password.length <= 6){
        alert("Password should be at least 6 characters");
        return;
      } else {
        firebase.auth().createUserWithEmailAndPassword(email, password);
      }
    }
    catch(error){
      alert(error.toString());
    }
  }

  loginUser = (email, password) => {
    console.log('Will login user');
    try{
      firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
        _storeData = async () => {
          try{
            await AsyncStorage.setItem('accessToken', response['user']['ra']);
            await AsyncStorage.setItem('refreshToken', response['user']['refreshToken']);
          }
          catch(error){
            console.log(error.toString());
          }
        }
        _storeData();
      });
    }
    catch(error){
      alert(error.toString());
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(email) => this.setState({email: email})}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              autoCorrect={false}
              autoCapitalize='none'
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password: password})}
            />
          </Item>
          <Button
            full
            rounded
            success
            style={styles.button}
            onPress={() => this.loginUser(this.state.email, this.state.password)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Button>
          <Button
            full
            rounded
            primary
            style={styles.button}
            onPress={() => this.signUpUser(this.state.email, this.state.password)}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10
  },
  buttonText: {
    color: 'white'
  }
});
