/**
 * @flow
 */

import { Amplitude, Constants } from 'expo';
import Environment from './environment';
import { normalizeTrackingOptions } from './analyticsUtil';

const events = {
  
  APP_STARTED: 'APP_STARTED',
  PORTAL_LOGIN: 'PORTAL_LOGIN',

  PAGE_CONTACT: 'PAGE_CONTACT',
  PAGE_CALENDAR: 'PAGE_CALENDAR',
  PAGE_ATHLETICS: 'PAGE_ATHLETICS',
  PAGE_PTA: 'PAGE_PTA',
  PAGE_MAP: 'PAGE_MAP',

  HOME_EVENT_STORY: 'HOM_EVENT_STORY',
  CALENDAR_EVENT_STORY: 'CALENDAR_EVENT_STORY',
  ADD_TO_CALENDAR: 'USER_UPDATED_PRIVACY',
  ADD_TO_CALENDAR_FAILED: 'USER_REMOVED_PROJECT',
  SHARE_STORY:  'SHARE_STORY',
};

let isInitialized = false;
const { manifest } = Constants;
const apiKey = manifest.extra && manifest.extra.amplitudeApiKey;
const initialize = () => {
  if (!apiKey) {
    return;
  }

  Amplitude.initialize(apiKey);
  isInitialized = true;
  console.log('amplitude initialised')
};

const maybeInitialize = () => {
  if (apiKey && !isInitialized) {
    initialize();
  }
};

const identify = (id: ?string, options?: ?Object = null) => {
  maybeInitialize();
  options = normalizeTrackingOptions(options);
  console.log('amplitude identify')
  if (id) {
    Amplitude.setUserId(id);
    if (options) {
      Amplitude.setUserProperties(options);
    }
  } else {
    Amplitude.clearUserProperties();
  }
};

const track = (event: string, options: any = null) => {
  maybeInitialize();
  options = normalizeTrackingOptions(options);
  console.log('amplitude track')
  if (options) {
    Amplitude.logEventWithProperties(event, options);
  } else {
    Amplitude.logEvent(event);
  }
  console.log('amplitude logEvent')
};

export default {
  events,
  track,
  identify,
};