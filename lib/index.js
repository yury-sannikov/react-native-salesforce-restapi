'use strict';

var _salesforceApiRequest = require('./salesforceApiRequest');

var ReactNative = require('react-native');

var loginUser = ReactNative.NativeModules.OAuthManager.loginUser;

module.exports = {
	LoginUser: loginUser,
	ApiRequest: new _salesforceApiRequest.SalesforceApiRequest(loginUser)
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SalesforceApiRequest = exports.STORAGE_EXPIRE_SPAN = exports.STORAGE_KEY = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactNative = require('react-native');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTTP_UNAUTHORIZED = 401;

var STORAGE_KEY = exports.STORAGE_KEY = '@SalesforceApiRequest:Credentials';

var STORAGE_EXPIRE_SPAN = exports.STORAGE_EXPIRE_SPAN = 1000 * 60 * 60 * 24;

var OAUTH_REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';
var OAUTH_SALESFORCE_LOGIN_URL = 'https://login.salesforce.com/services/oauth2/token';

var SalesforceApiRequest = exports.SalesforceApiRequest = function () {
    function SalesforceApiRequest(loginUser) {
        _classCallCheck(this, SalesforceApiRequest);

        this.loginUser = loginUser;
    }

    _createClass(SalesforceApiRequest, [{
        key: 'getCredentials',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(parameters) {
                var _credentials, credentials;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.t0 = JSON;
                                _context.next = 4;
                                return _reactNative.AsyncStorage.getItem(STORAGE_KEY);

                            case 4:
                                _context.t1 = _context.sent;
                                _credentials = _context.t0.parse.call(_context.t0, _context.t1);

                                if (!(Date.now() - _credentials.issued_at > STORAGE_EXPIRE_SPAN)) {
                                    _context.next = 8;
                                    break;
                                }

                                throw new Error('Storage key expired');

                            case 8:
                                return _context.abrupt('return', _credentials);

                            case 11:
                                _context.prev = 11;
                                _context.t2 = _context['catch'](0);
                                _context.next = 15;
                                return _reactNative.AsyncStorage.removeItem(STORAGE_KEY);

                            case 15:
                                _context.next = 17;
                                return this.loginUser(parameters);

                            case 17:
                                credentials = _context.sent;
                                _context.next = 20;
                                return this.setCredentials(credentials);

                            case 20:
                                return _context.abrupt('return', credentials);

                            case 21:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 11]]);
            }));

            function getCredentials(_x) {
                return _ref.apply(this, arguments);
            }

            return getCredentials;
        }()
    }, {
        key: 'setCredentials',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(credentials) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _reactNative.AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function setCredentials(_x2) {
                return _ref2.apply(this, arguments);
            }

            return setCredentials;
        }()
    }, {
        key: 'post',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(parameters, url, body) {
                var fetchAction;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                fetchAction = function fetchAction(cred) {
                                    return fetch(cred.instance_url + '/services/apexrest/' + parameters.namespace + url, {
                                        method: 'post',
                                        headers: {
                                            'Authorization': 'Bearer ' + cred.access_token,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify(body)
                                    });
                                };

                                _context3.next = 3;
                                return this.apiCall(fetchAction, parameters, url);

                            case 3:
                                return _context3.abrupt('return', _context3.sent);

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function post(_x3, _x4, _x5) {
                return _ref3.apply(this, arguments);
            }

            return post;
        }()
    }, {
        key: 'apiCall',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(fetchAction, parameters, url) {
                var _this = this;

                var credentials, processResponse, response, newCredentials;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this.getCredentials(parameters);

                            case 2:
                                credentials = _context5.sent;

                                processResponse = function () {
                                    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(response) {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        if (!response.ok) {
                                                            _context4.next = 7;
                                                            break;
                                                        }

                                                        _context4.next = 3;
                                                        return response.json();

                                                    case 3:
                                                        _context4.t0 = _context4.sent;
                                                        _context4.t1 = response.status;
                                                        _context4.t2 = response;
                                                        return _context4.abrupt('return', {
                                                            json: _context4.t0,
                                                            status: _context4.t1,
                                                            response: _context4.t2
                                                        });

                                                    case 7:
                                                        throw response;

                                                    case 8:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this);
                                    }));

                                    return function processResponse(_x9) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }();

                                _context5.next = 6;
                                return fetchAction(credentials);

                            case 6:
                                response = _context5.sent;

                                if (!(response.status === HTTP_UNAUTHORIZED)) {
                                    _context5.next = 14;
                                    break;
                                }

                                _context5.next = 10;
                                return this.refreshToken(parameters, credentials);

                            case 10:
                                newCredentials = _context5.sent;
                                _context5.next = 13;
                                return fetchAction(newCredentials).then(processResponse);

                            case 13:
                                return _context5.abrupt('return', _context5.sent);

                            case 14:
                                return _context5.abrupt('return', processResponse(response));

                            case 15:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function apiCall(_x6, _x7, _x8) {
                return _ref4.apply(this, arguments);
            }

            return apiCall;
        }()
    }, {
        key: 'refreshToken',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(parameters, credentials) {
                var refreshParams, form, response, newCredentials;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return _reactNative.AsyncStorage.removeItem(STORAGE_KEY);

                            case 2:
                                refreshParams = {
                                    grant_type: OAUTH_REFRESH_TOKEN_GRANT_TYPE,
                                    refresh_token: credentials.refresh_token,
                                    client_id: parameters.consumerKey,
                                    client_secret: parameters.consumerSecret
                                };
                                form = Object.keys(refreshParams).map(function (k) {
                                    return k + '=' + encodeURIComponent(refreshParams[k]);
                                }).join('&');
                                _context6.next = 6;
                                return fetch(OAUTH_SALESFORCE_LOGIN_URL, {
                                    credentials: 'include',
                                    method: 'post',
                                    headers: {
                                        'Authorization': 'Bearer ' + credentials.access_token,
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                                    },
                                    body: form
                                });

                            case 6:
                                response = _context6.sent;

                                if (response.ok) {
                                    _context6.next = 9;
                                    break;
                                }

                                throw response;

                            case 9:
                                _context6.next = 11;
                                return response.json();

                            case 11:
                                newCredentials = _context6.sent;


                                credentials.access_token = newCredentials.access_token;

                                _context6.next = 15;
                                return this.setCredentials(credentials);

                            case 15:
                                return _context6.abrupt('return', credentials);

                            case 16:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function refreshToken(_x10, _x11) {
                return _ref6.apply(this, arguments);
            }

            return refreshToken;
        }()
    }]);

    return SalesforceApiRequest;
}();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIiwiLi4vc2FsZXNmb3JjZUFwaVJlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBSUE7O0FBRkEsSUFBSSxjQUFjLFFBQVEsY0FBUixDQUFsQjs7QUFJQSxJQUFNLFlBQVksWUFBWSxhQUFaLENBQTBCLFlBQTFCLENBQXVDLFNBQXpEOztBQUVBLE9BQU8sT0FBUCxHQUFpQjtBQUNoQixZQUFXLFNBREs7QUFFaEIsYUFBWSwrQ0FBeUIsU0FBekI7QUFGSSxDQUFqQjs7Ozs7Ozs7Ozs7QUNFQTs7Ozs7O0FBVkEsSUFBTSxvQkFBb0IsR0FBMUI7O0FBRU8sSUFBTSxvQ0FBYyxtQ0FBcEI7O0FBRUEsSUFBTSxvREFBc0IsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUE3Qzs7QUFFUCxJQUFNLGlDQUFpQyxlQUF2QztBQUNBLElBQU0sNkJBQTZCLG9EQUFuQzs7SUFLYSxvQixXQUFBLG9CO0FBRVosa0NBQVksU0FBWixFQUF1QjtBQUFBOztBQUN0QixhQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQTs7Ozs7a0ZBRXVCLFU7Ozs7Ozs7OzhDQUVPLEk7O3VDQUFpQiwwQkFBYSxPQUFiLENBQXFCLFdBQXJCLEM7Ozs7QUFBL0IsNEMsZUFBbUIsSzs7c0NBRXJCLEtBQUssR0FBTCxLQUFhLGFBQVksU0FBekIsR0FBcUMsbUI7Ozs7O3NDQUMvQixJQUFJLEtBQUosQ0FBVSxxQkFBVixDOzs7aUVBR0gsWTs7Ozs7O3VDQUdELDBCQUFhLFVBQWIsQ0FBd0IsV0FBeEIsQzs7Ozt1Q0FHZ0IsS0FBSyxTQUFMLENBQWUsVUFBZixDOzs7QUFBcEIsMkM7O3VDQUNBLEtBQUssY0FBTCxDQUFvQixXQUFwQixDOzs7aUVBQ0MsVzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFHVSxXOzs7Ozs7dUNBQ1gsMEJBQWEsT0FBYixDQUFxQixXQUFyQixFQUFrQyxLQUFLLFNBQUwsQ0FBZSxXQUFmLENBQWxDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0ZBR0YsVSxFQUFZLEcsRUFBSyxJOzs7Ozs7QUFDZiwyQyxHQUFjLFNBQWQsV0FBYyxDQUFDLElBQUQ7QUFBQSwyQ0FBVSxNQUFTLEtBQUssWUFBZCwyQkFBZ0QsV0FBVyxTQUEzRCxHQUF1RSxHQUF2RSxFQUE4RTtBQUN4RyxnREFBUSxNQURnRztBQUVwRyxpREFBUztBQUNMLHlFQUEyQixLQUFLLFlBRDNCO0FBRUwsNERBQWdCLGtCQUZYO0FBR0wsc0RBQVU7QUFITCx5Q0FGMkY7QUFPcEcsOENBQU0sS0FBSyxTQUFMLENBQWUsSUFBZjtBQVA4RixxQ0FBOUUsQ0FBVjtBQUFBLGlDOzs7dUNBVVAsS0FBSyxPQUFMLENBQWEsV0FBYixFQUEwQixVQUExQixFQUFzQyxHQUF0QyxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29GQUdILFcsRUFBYSxVLEVBQVksRzs7Ozs7Ozs7O3VDQUNmLEtBQUssY0FBTCxDQUFvQixVQUFwQixDOzs7QUFBcEIsMkM7O0FBRU0sK0M7MEZBQWtCLGtCQUFPLFFBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZEQUNoQixTQUFTLEVBRE87QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSwrREFHQSxTQUFTLElBQVQsRUFIQTs7QUFBQTtBQUFBO0FBQUEsdUVBSUosU0FBUyxNQUpMO0FBQUEsdUVBS0YsUUFMRTtBQUFBO0FBR1osZ0VBSFk7QUFJWixrRUFKWTtBQUtaLG9FQUxZO0FBQUE7O0FBQUE7QUFBQSw4REFRZCxRQVJjOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFDOztvREFBbEIsZTs7Ozs7O3VDQVdpQixZQUFZLFdBQVosQzs7O0FBQWpCLHdDOztzQ0FFRixTQUFTLE1BQVQsS0FBb0IsaUI7Ozs7Ozt1Q0FDUyxLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsV0FBOUIsQzs7O0FBQXZCLDhDOzt1Q0FFTyxZQUFZLGNBQVosRUFBNEIsSUFBNUIsQ0FBaUMsZUFBakMsQzs7Ozs7O2tFQUdWLGdCQUFnQixRQUFoQixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O29GQUdRLFUsRUFBWSxXOzs7Ozs7O3VDQUdyQiwwQkFBYSxVQUFiLENBQXdCLFdBQXhCLEM7OztBQUVBLDZDLEdBQWdCO0FBQ2xCLGdEQUFZLDhCQURNO0FBRWxCLG1EQUFlLFlBQVksYUFGVDtBQUdsQiwrQ0FBVyxXQUFXLFdBSEo7QUFJbEIsbURBQWUsV0FBVztBQUpSLGlDO0FBTWhCLG9DLEdBQU8sT0FBTyxJQUFQLENBQVksYUFBWixFQUEyQixHQUEzQixDQUErQixVQUFDLENBQUQ7QUFBQSwyQ0FBUyxDQUFULFNBQWMsbUJBQW1CLGNBQWMsQ0FBZCxDQUFuQixDQUFkO0FBQUEsaUNBQS9CLEVBQXFGLElBQXJGLENBQTBGLEdBQTFGLEM7O3VDQUVVLE1BQU0sMEJBQU4sRUFBa0M7QUFDckQsaURBQWEsU0FEd0M7QUFFckQsNENBQVEsTUFGNkM7QUFHckQsNkNBQVM7QUFDTCxxRUFBMkIsWUFBWSxZQURsQztBQUVMLGtEQUFVLGtCQUZMO0FBR0wsd0RBQWdCO0FBSFgscUNBSDRDO0FBUXJELDBDQUFNO0FBUitDLGlDQUFsQyxDOzs7QUFBakIsd0M7O29DQVdELFNBQVMsRTs7Ozs7c0NBQ0osUTs7Ozt1Q0FHbUIsU0FBUyxJQUFULEU7OztBQUF2Qiw4Qzs7O0FBRU4sNENBQVksWUFBWixHQUEyQixlQUFlLFlBQTFDOzs7dUNBRU0sS0FBSyxjQUFMLENBQW9CLFdBQXBCLEM7OztrRUFFQyxXIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3ROYXRpdmUgPSByZXF1aXJlKCdyZWFjdC1uYXRpdmUnKTtcblxuaW1wb3J0IHsgU2FsZXNmb3JjZUFwaVJlcXVlc3QgfSBmcm9tICcuL3NhbGVzZm9yY2VBcGlSZXF1ZXN0J1xuXG5jb25zdCBsb2dpblVzZXIgPSBSZWFjdE5hdGl2ZS5OYXRpdmVNb2R1bGVzLk9BdXRoTWFuYWdlci5sb2dpblVzZXI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRMb2dpblVzZXI6IGxvZ2luVXNlcixcblx0QXBpUmVxdWVzdDogbmV3IFNhbGVzZm9yY2VBcGlSZXF1ZXN0KGxvZ2luVXNlcilcbn0iLCJjb25zdCBIVFRQX1VOQVVUSE9SSVpFRCA9IDQwMVxuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9LRVkgPSAnQFNhbGVzZm9yY2VBcGlSZXF1ZXN0OkNyZWRlbnRpYWxzJ1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9FWFBJUkVfU1BBTiA9IDEwMDAgKiA2MCAqIDYwICogMjRcblxuY29uc3QgT0FVVEhfUkVGUkVTSF9UT0tFTl9HUkFOVF9UWVBFID0gJ3JlZnJlc2hfdG9rZW4nXG5jb25zdCBPQVVUSF9TQUxFU0ZPUkNFX0xPR0lOX1VSTCA9ICdodHRwczovL2xvZ2luLnNhbGVzZm9yY2UuY29tL3NlcnZpY2VzL29hdXRoMi90b2tlbidcblxuXG5pbXBvcnQgeyBBc3luY1N0b3JhZ2UgfSBmcm9tICdyZWFjdC1uYXRpdmUnXG4gXG5leHBvcnQgY2xhc3MgU2FsZXNmb3JjZUFwaVJlcXVlc3Qge1xuXG5cdGNvbnN0cnVjdG9yKGxvZ2luVXNlcikge1xuXHRcdHRoaXMubG9naW5Vc2VyID0gbG9naW5Vc2VyO1xuXHR9XG5cbiAgICBhc3luYyBnZXRDcmVkZW50aWFscyhwYXJhbWV0ZXJzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjcmVkZW50aWFscyA9IEpTT04ucGFyc2UoYXdhaXQgQXN5bmNTdG9yYWdlLmdldEl0ZW0oU1RPUkFHRV9LRVkpKTtcblxuICAgICAgICAgICAgaWYgKERhdGUubm93KCkgLSBjcmVkZW50aWFscy5pc3N1ZWRfYXQgPiBTVE9SQUdFX0VYUElSRV9TUEFOKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdG9yYWdlIGtleSBleHBpcmVkJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICBhd2FpdCBBc3luY1N0b3JhZ2UucmVtb3ZlSXRlbShTVE9SQUdFX0tFWSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNyZWRlbnRpYWxzID0gYXdhaXQgdGhpcy5sb2dpblVzZXIocGFyYW1ldGVycyk7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q3JlZGVudGlhbHMoY3JlZGVudGlhbHMpO1xuICAgICAgICByZXR1cm4gY3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0Q3JlZGVudGlhbHMoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgYXdhaXQgQXN5bmNTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGNyZWRlbnRpYWxzKSlcbiAgICB9XG5cblx0YXN5bmMgcG9zdChwYXJhbWV0ZXJzLCB1cmwsIGJvZHkpIHtcbiAgICAgICAgY29uc3QgZmV0Y2hBY3Rpb24gPSAoY3JlZCkgPT4gZmV0Y2goYCR7Y3JlZC5pbnN0YW5jZV91cmx9L3NlcnZpY2VzL2FwZXhyZXN0LyR7cGFyYW1ldGVycy5uYW1lc3BhY2V9JHt1cmx9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsIFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7Y3JlZC5hY2Nlc3NfdG9rZW59YCwgXG4gICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBpQ2FsbChmZXRjaEFjdGlvbiwgcGFyYW1ldGVycywgdXJsKVxuICAgIH1cblxuICAgIGFzeW5jIGFwaUNhbGwoZmV0Y2hBY3Rpb24sIHBhcmFtZXRlcnMsIHVybCkge1xuXHRcdGNvbnN0IGNyZWRlbnRpYWxzID0gYXdhaXQgdGhpcy5nZXRDcmVkZW50aWFscyhwYXJhbWV0ZXJzKTtcblxuICAgICAgICBjb25zdCBwcm9jZXNzUmVzcG9uc2UgPSBhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGpzb246IGF3YWl0IHJlc3BvbnNlLmpzb24oKSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hBY3Rpb24oY3JlZGVudGlhbHMpO1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IEhUVFBfVU5BVVRIT1JJWkVEKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdDcmVkZW50aWFscyA9IGF3YWl0IHRoaXMucmVmcmVzaFRva2VuKHBhcmFtZXRlcnMsIGNyZWRlbnRpYWxzKVxuXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZmV0Y2hBY3Rpb24obmV3Q3JlZGVudGlhbHMpLnRoZW4ocHJvY2Vzc1Jlc3BvbnNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9jZXNzUmVzcG9uc2UocmVzcG9uc2UpXG5cdH1cblxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbihwYXJhbWV0ZXJzLCBjcmVkZW50aWFscykge1xuICAgICAgICAvLyBSZW1vdmUgZXhwaXJlZCBjcmVkZW50aWFscy4gSW4gY2FzZSBvZiBzdWNjZXNzIHJlZnJlc2ggbmV3IGNyZWRlbnRpYWxzIHdpbGwgYmUgc3RvcmVkXG4gICAgICAgIC8vIEluIGNhc2Ugb2YgZXJyb3IgbmV4dCBjYWxsIHRvIHRoZSBBUEkgd2lsbCBmb3JjZSBsb2dpbiBzY3JlZW4gdG8gYXBwZWFyXG4gICAgICAgIGF3YWl0IEFzeW5jU3RvcmFnZS5yZW1vdmVJdGVtKFNUT1JBR0VfS0VZKVxuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hQYXJhbXMgPSB7XG4gICAgICAgICAgICBncmFudF90eXBlOiBPQVVUSF9SRUZSRVNIX1RPS0VOX0dSQU5UX1RZUEUsXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiBjcmVkZW50aWFscy5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiBwYXJhbWV0ZXJzLmNvbnN1bWVyS2V5LFxuICAgICAgICAgICAgY2xpZW50X3NlY3JldDogcGFyYW1ldGVycy5jb25zdW1lclNlY3JldFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm0gPSBPYmplY3Qua2V5cyhyZWZyZXNoUGFyYW1zKS5tYXAoKGspPT4gYCR7a309JHtlbmNvZGVVUklDb21wb25lbnQocmVmcmVzaFBhcmFtc1trXSl9YCkuam9pbignJicpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChPQVVUSF9TQUxFU0ZPUkNFX0xPR0lOX1VSTCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2NyZWRlbnRpYWxzLmFjY2Vzc190b2tlbn1gLCBcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IGZvcm1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0NyZWRlbnRpYWxzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICAgICAgY3JlZGVudGlhbHMuYWNjZXNzX3Rva2VuID0gbmV3Q3JlZGVudGlhbHMuYWNjZXNzX3Rva2VuO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q3JlZGVudGlhbHMoY3JlZGVudGlhbHMpO1xuXG4gICAgICAgIHJldHVybiBjcmVkZW50aWFscztcbiAgICB9XG59Il19