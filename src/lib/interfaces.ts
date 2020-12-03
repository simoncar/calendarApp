export interface IImage {
	id: string;
	uri: string;
}

export enum MemeType {
	Gallery = 'gallery',
	Local = 'local',
	Remote = 'remote',
}

export interface MemeEntity extends IImage {
	title?: string;
	content?: string;
	type: MemeType;
}

export interface StoryEntity {
	_key: string,
	photo1: string,
	summary: string,
	summaryMyLanguage: string,
	descriptionMyLanguage: string,
	description: string,
	visible: string,
	visibleMore: string,
	showIconChat: boolean,
	order: string,
	date_start: any,
	time_start_pretty: any,
	time_end_pretty: any,
	source: any,
	dateTimeStart: any,
	dateTimeEnd: any,
	location: any,
	scroll?: boolean,
	newState?: any,
}