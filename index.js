'use strict';

var ReactNative = require('react-native');

import { SalesforceApiRequest } from './salesforceApiRequest'

let nativeMethods = {}

if (ReactNative.Platform.OS === 'ios') {
  nativeMethods = {
    loginUser: ReactNative.NativeModules.OAuthManager.loginUser,
    logout: () => new Promise((resolve) => resolve())
  }
} else if (ReactNative.Platform.OS === 'android') {
  const oauth2LoginAdapter = require('./oauth2LoginAdapter');
  nativeMethods = {
    loginUser: oauth2LoginAdapter(ReactNative.NativeModules.OAuthManager.loginUser),
    logout: ReactNative.NativeModules.OAuthManager.logout
  }
}

module.exports = {
	LoginUser: nativeMethods.loginUser,
	ApiRequest: new SalesforceApiRequest(nativeMethods)
}

