'use strict';

var ReactNative = require('react-native');

module.exports = {
	loginUser: ReactNative.NativeModules.OAuthManager.loginUser
}