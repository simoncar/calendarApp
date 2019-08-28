import React, { Component } from "react";
import { StyleProvider, Root } from "native-base";
import { I18nManager, AsyncStorage, View, Text } from "react-native";
import App from "./App";
import I18n from "./lib/i18n";
import variables from "../native-base-theme/variables/commonColor";
import getTheme from "../native-base-theme/components";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import _ from "lodash";
import "@firebase/firestore";
import Firebase from "./lib/firebase";
import DomainSelection from "./DomainSelection";
import * as firebase from "firebase";


export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      selectedDomain: ""
    };
  }

  getDomains = () => new Promise(function (resolve, reject) {
    firebase
      .firestore()
      .collection("domains")
      .get()
      .then(snapshot => {
        console.log("snapshot");
        if (snapshot.empty) {
          console.log("No notifications");
          return;
        }

        const domainsStore = [];
        snapshot.forEach(doc => {
          console.log(doc.data())
          item = doc.data();
          domainsStore.push(item);
        });
        resolve(domainsStore);
      });
  });

  validateSelectedDomain = (selectedDomain, domains) => {
    domainValues = domains.map(item => item.node);
    return domainValues.indexOf(selectedDomain) > -1 ? true : false;
  }
  async componentWillMount() {
    try {
      await Firebase.initialise();
    } catch (e) {
      console.log("firebase error", e.message);
    }

    Font.loadAsync({
      "Material Icons": require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      MaterialIcons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
      Ionicons: require("../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
    });
    // this.domains = await this.getDomains;
    // console.log(this.domains, "dd");



    this.domains = await this.getDomains();

    AsyncStorage.getItem("domain").then(d => {
      this.setSelectedDomain(d);
    });
  }

  setSelectedDomain = (d) => {
    const domain = d || "";
    if (!this.validateSelectedDomain(domain, this.domains)) return;
    AsyncStorage.setItem("domain", domain);
    global.domain = domain;
    this.setState({ selectedDomain: domain, isReady: true });
  }

  render() {
    console.log("this.state.selectedDomain", this.state.selectedDomain, this.state.isReady);
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    if (this.state.selectedDomain == "") {
      return <DomainSelection setSelectedDomain={this.setSelectedDomain} />
    }
    return (
      <SetupEnv />
    );
  }
}





class SetupEnv extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

  async componentWillMount() {
    try {
      await Firebase.SetupUser();
    } catch (e) {
      console.log("firebase error", e.message);
    }

    await AsyncStorage.getItem("language").then(language => {
      if (!_.isString(language)) {
        language = "en";
        AsyncStorage.setItem("language", language);
      }
      if (language === "ar") {
        I18nManager.forceRTL(true);
        if (!I18nManager.isRTL) {
          Updates.reloadFromCache();
        }
      } else {
        I18nManager.forceRTL(false);
        if (I18nManager.isRTL) {
          Updates.reloadFromCache();
        }
      }
      I18n.locale = language;
      global.language = language;
    });

    await AsyncStorage.getItem("email").then(email => {
      global.email = _.isString(email) ? email : "";
    });
    await AsyncStorage.getItem("name").then(name => {
      global.name = _.isString(name) ? name : "";
    });
    await AsyncStorage.getItem("authenticated").then(authenticatedString => {
      var authenticated = authenticatedString == "true";
      global.authenticated = authenticated;
      console.log("authenticated=", authenticated);
    });
    await AsyncStorage.getItem("adminPassword").then(adminPassword => {
      global.adminPassword = adminPassword;
      console.log("adminPassword=", adminPassword);
      if (adminPassword == "cookies") {
        global.administrator = true;
      }
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      console.log("....waiting....");
      return <AppLoading />;
    }
    console.log("....running....");
    return (
      <StyleProvider style={getTheme(variables)}>
        <Root>
          <App />
        </Root>
      </StyleProvider>
    );
  }
}