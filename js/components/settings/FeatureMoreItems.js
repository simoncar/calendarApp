import React, { Component } from 'react'
import { Text, View, FlatList, Alert } from 'react-native'
import firebase from "firebase";
import ListItem from "./ListItem";
import { getLanguageString } from "../global";

export default class FeatureMoreItems extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      featureItems: []
    };
  }

  componentWillMount() {
    this.ref = firebase
      .firestore()
      .collection(global.domain)
      .doc("feature")
      .collection("features")
      .orderBy("order");
  }

  componentDidMount() {
    try {
      // TODO: isOnline.
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    } catch (e) {
      //console.error(e.message);
    }
  }

  onCollectionUpdate = querySnapshot => {
    var trans = {};
    var featureItems = [];


    querySnapshot.forEach(doc => {
      if (doc.data().translated == true) {
        trans = {
          source: "feature",
          summaryMyLanguage: getLanguageString(global.language, doc.data(), "summary"),
          descriptionMyLanguage: getLanguageString(global.language, doc.data(), "description"),
        };
      } else {
        trans = {
          source: "feature",
          summaryMyLanguage: doc.data().summary,
          descriptionMyLanguage: doc.data().description,
        };
      }

      if (doc.data().visibleMore) {
        featureItems.push({ ...{ _key: doc.id }, ...doc.data(), ...trans });
      }
    });

    if (featureItems.length > 0) {
      this.setState({
        featureItems,
      });
    }

    this.setState({
      loading: false,
    });
    this.unsubscribe();
  };

  keyExtractor = item => item._key;

  _renderItem(item) {
    return <ListItem navigation={this.props.navigation} item={item} />;
  }
  _listEmptyComponent = () => {
    return (
      <View>
      </View>
    )
  }
  render() {
    if (this.state.loading || !this.state.featureItems > 0) return <View></View>;
    return (
      <FlatList
        data={this.state.featureItems}
        keyExtractor={this.keyExtractor}
        renderItem={this._renderItem.bind(this)}
        scrollEnabled={false}
        ListEmptyComponent={this._listEmptyComponent}
      />

    )
  }
}