'use strict';

var ReactNative = require('react-native');

import { SalesforceApiRequest } from './salesforceApiRequest'

const loginUser = ReactNative.NativeModules.OAuthManager.loginUser;

module.exports = {
	LoginUser: loginUser,
	ApiRequest: new SalesforceApiRequest(loginUser)
}