
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { SettingsListItem } from "../components/SettingsListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import I18n from "../lib/i18n";
import { Text } from "../components/sComponent";
import Analytics from "../lib/analytics";
import { connect } from "react-redux";
import { changeLanguage } from "../store/auth";

class selectLanguage extends Component {
	constructor(props) {
		super(props);
		this.onValueChange = this.onValueChange.bind(this);
		this.state = {
			switchValue: false,
			loggedIn: false,
			language: ""
		};
	}

	componentDidMount() {
		this._retrieveLanguage();
		Analytics.track("Language");
	}

	_retrieveLanguage = async () => {
		try {
			const value = this.props.auth.language;
			if (value !== null) {
				// We have data!!
				this.setState({ language: value });
			}
		} catch (error) {
			// Error retrieving data
		}
	};

	_changeLanguage(language) {
		this.setState({ language: language });
		this.props.dispatch(changeLanguage(language));
	}
	_getStyle(language) {
		if (language == this.state.language) {
			return styles.imageStyleCheckOn;
		} else {
			return styles.imageStyleCheckOff;
		}
	}

	render() {
		return <View style={styles.a1e57a860b21511ea8aa31930972200e5}>
			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="English" onPress={() => this._changeLanguage("en")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("en")} />} />
			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="\u4E2D\u6587(\u7B80\u4F53)" onPress={() => this._changeLanguage("zh")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("zh")} />} />
			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="\u65E5\u672C\u8A9E" onPress={() => this._changeLanguage("ja")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("ja")} />} />

			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="Fran\xE7ais" onPress={() => this._changeLanguage("fr")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("fr")} />} />

			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="\uD55C\uAD6D\uC5B4" onPress={() => this._changeLanguage("ko")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("ko")} />} />

			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="Espa\xF1ol" onPress={() => this._changeLanguage("es")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("es")} />} />

			<SettingsListItem hasSwitch={false} switchState={this.state.switchValue} switchOnValueChange={this.onValueChange} hasNavArrow={false} title="bahasa Indonesia" onPress={() => this._changeLanguage("id")} icon={<MaterialCommunityIcons name="check" style={this._getStyle("id")} />} />

			<Text style={styles.titleInfoStyle}>{I18n.t("languageChangeWarning")}</Text>
		</View>;
	}
	toggleAuthView() {
		this.setState({ toggleAuthView: !this.state.toggleAuthView });
	}
	onValueChange(value) {
		this.setState({ switchValue: value });
	}
}

const styles = StyleSheet.create({
	a1e57a860b21511ea8aa31930972200e5: { backgroundColor: "#EFEFF4", flex: 1 },


	imageStyleCheckOff: {
		alignSelf: "center",
		color: "#FFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},
	imageStyleCheckOn: {
		alignSelf: "center",
		color: "#007AFF",
		fontSize: 30,
		height: 30,
		marginLeft: 15,
		width: 30
	},

	titleInfoStyle: {
		alignSelf: "center",
		color: "#8e8e93",
		fontSize: 16,

		marginLeft: 10,
		marginTop: 20
	}
});


const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(selectLanguage);