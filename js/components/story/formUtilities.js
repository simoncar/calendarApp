import React, { Component } from "react";
import { View, Button, Text, TouchableOpacity, Switch, SafeAreaView, ScrollView, LayoutAnimation, Platform, Alert, ImagePropTypes } from "react-native";
import { Entypo, SimpleLineIcons, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import _ from "lodash";

const IconChat = class IconChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Allow Chat</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            {
              this.props.handler(!this.props.showIconChat);
            }
          }}
          style={{ padding: 8 }}
        >
          <SimpleLineIcons name="bubble" size={32} color={this.props.showIconChat ? "#222" : "#CCC"} />
        </TouchableOpacity>
      </View>
    );
  }
};

const IconShare = class IconShare extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Allow Share</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            {
              this.props.handler(!this.props.showIconShare);
            }
          }}
          style={{ padding: 8 }}
        >
          <Feather name="share" size={32} color={this.props.showIconShare ? "#222" : "#CCC"} />
        </TouchableOpacity>
      </View>
    );
  }
};

class OrderOnPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsLeft}>
        <View>
          <Text>Order on Page</Text>
        </View>
        <View>
          <Input
            onChangeText={(order) => this.props.handler(order)}
            placeholder="0"
            style={styles.eventTitle}
            value={this.props.order}
            keyboardType="number-pad"
            inputContainerStyle={{ borderBottomWidth: 0 }}
            containerStyle={styles.containerStyleOrder}
          />
        </View>
      </View>
    );
  }
}

class ShowOnHomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsItem}>
        {/* {icon} */}
        <View style={styles.settingsLeft}>
          <View>
            <Text>Home Screen</Text>
          </View>

          <View>
            <Switch onValueChange={(value) => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
          </View>
        </View>
      </View>
    );
  }
}

class ShowOnMoreScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.settingsItem}>
        {/* {icon} */}
        <View style={styles.settingsLeft}>
          <View>
            <Text>More Screen</Text>
          </View>

          <View>
            <Switch onValueChange={(value) => this.props.handler(value)} style={styles.switch} value={this.props.visible} />
          </View>
        </View>
      </View>
    );
  }
}

class EventDateTime extends Component {
  constructor(props) {
    super(props);

    console.log("props.dateTimeStart:", props.dateTimeStart, props.dateTimeEnd);
    this.state = {
      dateTimeStart: props.dateTimeStart,
      dateTimeEnd: props.dateTimeEnd,

      date_start: props.date_start,
      time_start_pretty: props.time_start_pretty,
      time_end_pretty: props.time_end_pretty,

      mode: "date",
      show: false,
    };
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date_start;
    //setShow(Platform.OS === "ios");
    console.log("update onChange", selectedDate);
    this.setState({
      date_start: selectedDate,
    });
  };

  showMode = (currentMode, startEnd) => {
    console.log("showMode", currentMode, startEnd);
    this.setState({
      show: true,
      mode: currentMode,
      startEnd: startEnd,
    });

    if (startEnd == "start") {
      this.setState({
        controlDate: this.state.dateTimeStart,
      });
    } else {
      this.setState({
        controlDate: this.state.dateTimeEnd,
      });
    }
  };

  showDatepicker = () => {
    this.showMode("date", "start");
  };

  showStartTimepicker = () => {
    this.showMode("time", "start");
  };
  showEndTimepicker = () => {
    this.showMode("time", "end");
  };

  render() {
    console.log("date:", this.state.date_start, _.isDate(this.state.date_start));

    return (
      <View style={{ flex: 1, paddingTop: 20, paddingLeft: 10, paddingRight: 10 }}>
        <View style={styles.containerStyle}>
          <View style={styles.settingsItem}>
            <Text style={styles.settingsLeft}>Date</Text>
            <TouchableOpacity
              onPress={() => {
                if (!this.state.show == true) {
                  this.showDatepicker();
                } else {
                  this.setState({ show: false });
                }
              }}
            >
              <Text>{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("MMMM Do YYYY") : "Start Date "}</Text>
            </TouchableOpacity>
            <Text> </Text>

            <TouchableOpacity
              onPress={() => {
                if (!this.state.show == true) {
                  this.showStartTimepicker();
                } else {
                  this.setState({ show: false });
                }
              }}
            >
           <Text>{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("h:mm a") : "Time"}</Text>
            </TouchableOpacity>
            <Text> - </Text>
            <TouchableOpacity
              onPress={() => {
                if (!this.state.show == true) {
                  this.showEndTimepicker();
                } else {
                  this.setState({ show: false });
                }
              }}
            >
             <Text>{_.isDate(this.state.dateTimeStart) ? moment(this.state.dateTimeStart).format("h:mm a") : "End"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({ show: false, date_start: "" });
              }}
            >
              <MaterialIcons name="clear" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            {this.state.show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={_.isDate(this.state.controlDate) ? this.state.controlDate : new Date()}
                mode={this.state.mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

export { IconChat, IconShare, OrderOnPage, ShowOnHomeScreen, ShowOnMoreScreen, EventDateTime };
