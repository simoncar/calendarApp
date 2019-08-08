import React from "react";
import { AsyncStorage } from "react-native";
import * as firebase from "firebase";
import _ from "lodash";

export class AuthParser extends React.Component {
  extractLoginUsername(res) {
    var s = res.indexOf('@fullname":');
    var e = res.indexOf('"', s + 13);
    if (s > -1) {
      var ret = res.substring(s + 12, e);
      global.name = ret;
    } else {
      var ret = "";
    }

    return ret;
  }

  extractLoginEmail(res) {
    var s = res.indexOf('@email":');
    var e = res.indexOf('"', s + 10);
    if (s > -1) {
      var ret = res.substring(s + 9, e);
      global.email = ret;
    } else {
      var ret = "";
    }
    return ret;
  }

  saveDetails(name, email) {
    if (!_.isNil(global.uid) && name.length > 0 && email.length > 0) {
      var userDict = {
        name,
        email,
        authenticated: true,
      };

      console.log("firebase=", userDict);
      firebase
        .firestore()
        .collection("sais_edu_sg")
        .doc("user")
        .collection("usernames")
        .doc(global.uid)
        .set(userDict, { merge: true });

      AsyncStorage.setItem("name", name);
      AsyncStorage.setItem("email", email);
      AsyncStorage.setItem("authenticated", "true");

      global.authenticated = true;

      console.log("Saving details: ", global.uid, name, email);
    }
  }
}

export default new AuthParser();
