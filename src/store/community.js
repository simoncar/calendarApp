import * as firebase from "firebase";
import { call, put, takeEvery, takeLatest, select } from "redux-saga/effects";
import _ from "lodash";
import { checkAdmin } from "./auth";

export const PROCESS_SELECTED_COMMUNITY = 'PROCESS_SELECTED_COMMUNITY';
export const SET_SELECTED_COMMUNITY = 'SET_SELECTED_COMMUNITY';
export const GET_COMMUNITIES = 'GET_COMMUNITIES';
export const SET_COMMUNITIES = 'SET_COMMUNITIES';
export const GET_COMMUNITY_DETAILS = "GET_COMMUNITY_DETAILS"
export const SET_INVALID_COMMUNITY = "SET_INVALID_COMMUNITY";
export const SET_USER_CHATROOMS = "SET_USER_CHATROOMS";
export const BUILD_CHATROOM_LIST = "BUILD_CHATROOM_LIST";

// ALWAYS USE THIS TO SET THE COMMUNITY
export const processSelectedCommunity = selectedCommunity => ({
	type: PROCESS_SELECTED_COMMUNITY,
	selectedCommunity,
});

export const setSelectedCommunity = (selectedCommunity) => ({
	type: SET_SELECTED_COMMUNITY,
	selectedCommunity
});

export const getCommunities = () => ({
	type: GET_COMMUNITIES
});

export const setCommunities = communities => ({
	type: SET_COMMUNITIES,
	communities
});

export const getCommunityDetails = node => ({
	type: GET_COMMUNITY_DETAILS,
	node
});

export const setInvalidCommunity = invalidCommunity => ({
	type: SET_INVALID_COMMUNITY,
	invalidCommunity
});

export const setUserChatrooms = userChatrooms => ({
	type: SET_USER_CHATROOMS,
	userChatrooms
});

export const buildChatroomList = () => ({
	type: BUILD_CHATROOM_LIST
});



function* WORKER_processSelectedCommunity(action) {

	let community = action.selectedCommunity

	console.log("WORKER_processSelectedCommunity", community)
	community = community || {};

	global.domain = community.node;
	switch (community.node) {
		case "sais_edu_sg":
			global.switch_portalName = "myStamford";
			global.switch_tab_portalName = "myS";
			global.switch_portalURL = "https://mystamford.edu.sg/parent-dashboard";
			global.switch_webportalActions = [
				{ Home: "https://mystamford.edu.sg/parent-dashboard" },
				{ "Cafe Top-Up": "https://mystamford.edu.sg/cafe/cafe-online-ordering" },
				{ Events: "https://mystamford.edu.sg/events-1" },
				{ Forms: "https://mystamford.edu.sg/forms-1" },
				{ PTA: "https://mystamford.edu.sg/pta" },
				{ Logout: "https://mystamford.edu.sg/logout" },
			];
			global.switch_call = "+65 6709 4800";
			break;
		case "ais_edu_sg":
			global.switch_portalURL =
				"https://connect.ais.com.sg/login/login.aspx?prelogin=https%3a%2f%2fconnect.ais.com.sg%2f&kr=iSAMS:ParentPP";
			global.switch_portalName = "AIS Connect";
			global.switch_tab_portalName = "Connect";
			global.switch_webportalActions = [
				{ Home: "" },
				{ "Cafe Top-Up": "" },
				{ Events: "" },
				{ Forms: "" },
				{ PTA: "" },
				{ Logout: "" },
			];
			break;
		case "camp_asia":
			global.switch_portalURL = "https://www.campasia.asia/online-booking/login";
			global.switch_webportalActions = [
				{ Home: "" },
				{ "Cafe Top-Up": "" },
				{ Events: "" },
				{ Forms: "" },
				{ PTA: "" },
				{ Logout: "" },
			];
			global.switch_homeLogoURI =
				"https://firebasestorage.googleapis.com/v0/b/calendar-app-57e88.appspot.com/o/smartcommunity%2Fcommunitylogo%2FCA_ID_Reverse_new.png?alt=media&token=54fbd759-31f5-46bb-a73f-6424db99d5dd";
			break;
		default:
			global.switch_portalURL = "https://www.smartcookies.io/"

	}

	yield put(setSelectedCommunity(community));
	yield put(checkAdmin());
}

function* WORKER_getCommunities() {
	const snapshot = yield call(() => firebase
		.firestore()
		.collection("domains")
		.orderBy("name")
		.get());


	if (snapshot.empty) {
		console.log("No Communities");
		return [];
	}
	const domainsStore = [];
	snapshot.forEach(doc => {
		domainsStore.push(doc.data());
	});

	yield put(setCommunities(domainsStore));
}

function* WORKER_getCommunityDetails(action) {
	const node = action.node;

	const snapshot = yield call(() => firebase
		.firestore()
		.collection("domains")
		.where("node", "==", node)
		.get());
	if (snapshot.empty) {
		console.log("No matching node.");
		//invalid 
		yield put(processSelectedCommunity({}));
		yield put(setInvalidCommunity(true));
	} else {
		let data = null;
		snapshot.forEach(doc => {
			data = doc.data();
		});
		yield put(processSelectedCommunity(data));
		yield put(setInvalidCommunity(false));
	}

}

function* WORKER_buildChatroomList(action) {
	var userChatrooms = [];
	const communityDomain = yield select(state => state.community.selectedCommunity.node);
	const snapshot = yield call(() => firebase
		.firestore()
		.collection(communityDomain)
		.doc("chat")
		.collection("chatrooms")

		.orderBy("title")
		.get());

	if (snapshot.empty) {
		console.log("chatrooms");
		return;
	}
	const userInterestGroupCheck = _.has(global, "userInfo.interestGroups") && Array.isArray(global.userInfo.interestGroups);
	const userInterestGroups = userInterestGroupCheck ? global.userInfo.interestGroups : [];

	snapshot.forEach(doc => {
		const item = doc.data();

		if (item.visible == false) return;
		if (
			(item.type == "private" && item.members.indexOf(global.uid + "") > -1) ||
			(item.type == "interestGroup" && userInterestGroups && userInterestGroups.indexOf(item.title) > -1) ||
			["users", "public"].indexOf(item.type) > -1
		) {
			userChatrooms.push({
				...item,
				chatroom: doc.id
			});
		}
	});
	yield put(setUserChatrooms(userChatrooms));

}
export function* communitySaga() {
	yield takeLatest(GET_COMMUNITIES, WORKER_getCommunities);
	yield takeLatest(PROCESS_SELECTED_COMMUNITY, WORKER_processSelectedCommunity);
	yield takeLatest(BUILD_CHATROOM_LIST, WORKER_buildChatroomList);
	yield takeLatest(GET_COMMUNITY_DETAILS, WORKER_getCommunityDetails);
}

const initialState = {
	selectedCommunity: {},
	communities: [],
	invalidCommunity: false,
	calendarItems: null,
	userChatrooms: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_SELECTED_COMMUNITY:
			return {
				...state,
				selectedCommunity: action.selectedCommunity,
			};
		case SET_COMMUNITIES:
			return {
				...state,
				communities: action.communities
			};
		case SET_INVALID_COMMUNITY:
			return {
				...state,
				invalidCommunity: action.invalidCommunity
			};
		case SET_USER_CHATROOMS:
			return {
				...state,
				userChatrooms: action.userChatrooms
			};
		default:
			return state;
	}
};