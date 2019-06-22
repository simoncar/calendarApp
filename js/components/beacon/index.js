import React, { Component } from "react";
import { FlatList, Container, Content, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as ActionCreators from "../../actions";
import firebase from "firebase";
import { Grid, Col, Row } from "react-native-easy-grid";

import Constants from "expo-constants";
import { SimpleLineIcons } from "@expo/vector-icons";
import { withMappedNavigationProps } from "react-navigation-props-mapper";

import styles from "./styles";

const BeaconItem = require("./beaconItem");

const tabBarIcon = name => ({ tintColor }) => (
  <SimpleLineIcons
    style={{ backgroundColor: "transparent" }}
    name={name}
    color={tintColor}
    size={24}
  />
);

@withMappedNavigationProps()
class beacons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      userBeacons: []
    };

    this.ref = firebase
      .firestore()
      .collection("sais_edu_sg")
      .doc("beacon")
      .collection("beacons");
  }
  //.equalTo("Active");

  static navigationOptions = {
    title: "Campus Attendance",
    tabBarColor: "yellow",
    tabBarIcon: tabBarIcon("bubble")
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  keyExtractor = item => item._key;

  onCollectionUpdate = beacons => {
    const userBeacons = [];
    this.countEntered = 0;
    var beaconIcon = "";

    beacons.forEach(doc => {
      beaconIcon = "G";
      console.log(doc.data().campus);
      if (
        doc.data().name != "GATEWAY" &&
        doc.data().name != "" &&
        (doc.data().state == "Perimeter" ||
          doc.data().state == "On Campus" ||
          doc.data().state == "Off Campus")
      ) {
        ++this.countEntered;

        userBeacons.push({
          beaconCampus: doc.data().campus,
          beaconGrade: doc.data().beaconGrade,
          beaconIcon: beaconIcon,
          beaconName: doc.data().name,
          beaconType: doc.data().beaconType,
          beaconPictureURL: doc.data().beaconPictureURL,
          timestamp: doc.data().timestamp,
          lastSeen: doc.data().lastSeen,
          state: doc.data().state,
          _key: doc.id
        });
      }
    });

    beacons.forEach(doc => {
      beaconIcon = "G";

      if (doc.data().name == "GATEWAY") {
        userBeacons.push({
          beaconCampus: doc.data().campus,
          beaconGrade: doc.data().beaconGrade,
          beaconIcon: beaconIcon,
          beaconName: doc.data().name,
          beaconType: doc.data().beaconType,
          beaconPictureURL: doc.data().beaconPictureURL,
          timestamp: doc.data().timestamp,
          lastSeen: doc.data().lastSeen,
          state: doc.data().state,
          _key: doc.id
        });
      }
    });

    this.setState({
      userBeacons
    });
  };

  _renderItem2(item) {
    return (
      <BeaconItem
        navigation={this.props.navigation}
        beaconCampus={item.item.beaconCampus}
        beaconName={item.item.beaconName}
        beaconIcon={item.item.beaconIcon}
        beaconType={item.item.beaconType}
        beaconGrade={item.item.beaconGrade}
        beaconPictureURL={item.item.beaconPictureURL}
        lastSeen={item.item.lastSeen}
        timestamp={item.item.timestamp}
        item={item}
        state={item.item.state}
        _key={item.item._key}
      />
    );
  }

  renderCount(item, count) {
    return (
      <View
        style={{
          borderRadius: 30,
          backgroundColor: "#1DAEF2",
          width: 45,
          height: 45,
          marginLeft: 10,
          marginTop: 10,
          alignItems: "center",
          paddingLeft: 0,
          paddingRight: 0,
          justifyContent: "center"
        }}
      >
        <View>
          <Text>{count}</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View>
        <View style={{ height: 100 }}>
          <Grid style={{ height: 50 }}>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Total", 3028)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Total</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Entered", this.countEntered)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Entered</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("Exited", 0)}</Row>
              <Row>
                <Text style={styles.chatTitle}>Exited</Text>
              </Row>
            </Col>
            <Col style={{ alignItems: "center" }}>
              <Row>{this.renderCount("No Show", 3028 - this.countEntered)}</Row>
              <Row>
                <Text style={styles.chatTitle}>No Show</Text>
              </Row>
            </Col>
          </Grid>
        </View>

        <FlatList
          data={this.state.userBeacons}
          renderItem={this._renderItem2.bind(this)}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActionCreators, dispatch);
};

const mapStateToProps = state => ({
  //navigation: state.cardNavigation,
  username: state.username,
  userX: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(beacons);
