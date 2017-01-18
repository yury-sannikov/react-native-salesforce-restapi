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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NhbGVzZm9yY2VBcGlSZXF1ZXN0LmpzIl0sIm5hbWVzIjpbIkhUVFBfVU5BVVRIT1JJWkVEIiwiU1RPUkFHRV9LRVkiLCJTVE9SQUdFX0VYUElSRV9TUEFOIiwiT0FVVEhfUkVGUkVTSF9UT0tFTl9HUkFOVF9UWVBFIiwiT0FVVEhfU0FMRVNGT1JDRV9MT0dJTl9VUkwiLCJTYWxlc2ZvcmNlQXBpUmVxdWVzdCIsImxvZ2luVXNlciIsInBhcmFtZXRlcnMiLCJKU09OIiwiZ2V0SXRlbSIsImNyZWRlbnRpYWxzIiwicGFyc2UiLCJEYXRlIiwibm93IiwiaXNzdWVkX2F0IiwiRXJyb3IiLCJyZW1vdmVJdGVtIiwic2V0Q3JlZGVudGlhbHMiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXJsIiwiYm9keSIsImZldGNoQWN0aW9uIiwiY3JlZCIsImZldGNoIiwiaW5zdGFuY2VfdXJsIiwibmFtZXNwYWNlIiwibWV0aG9kIiwiaGVhZGVycyIsImFjY2Vzc190b2tlbiIsImFwaUNhbGwiLCJnZXRDcmVkZW50aWFscyIsInByb2Nlc3NSZXNwb25zZSIsInJlc3BvbnNlIiwib2siLCJqc29uIiwic3RhdHVzIiwicmVmcmVzaFRva2VuIiwibmV3Q3JlZGVudGlhbHMiLCJ0aGVuIiwicmVmcmVzaFBhcmFtcyIsImdyYW50X3R5cGUiLCJyZWZyZXNoX3Rva2VuIiwiY2xpZW50X2lkIiwiY29uc3VtZXJLZXkiLCJjbGllbnRfc2VjcmV0IiwiY29uc3VtZXJTZWNyZXQiLCJmb3JtIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsImsiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFVQTs7Ozs7O0FBVkEsSUFBTUEsb0JBQW9CLEdBQTFCOztBQUVPLElBQU1DLG9DQUFjLG1DQUFwQjs7QUFFQSxJQUFNQyxvREFBc0IsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUE3Qzs7QUFFUCxJQUFNQyxpQ0FBaUMsZUFBdkM7QUFDQSxJQUFNQyw2QkFBNkIsb0RBQW5DOztJQUthQyxvQixXQUFBQSxvQjtBQUVaLGtDQUFZQyxTQUFaLEVBQXVCO0FBQUE7O0FBQ3RCLGFBQUtBLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0E7Ozs7O2tGQUV1QkMsVTs7Ozs7Ozs7OENBRU9DLEk7O3VDQUFpQiwwQkFBYUMsT0FBYixDQUFxQlIsV0FBckIsQzs7OztBQUEvQlMsNEMsZUFBbUJDLEs7O3NDQUVyQkMsS0FBS0MsR0FBTCxLQUFhSCxhQUFZSSxTQUF6QixHQUFxQ1osbUI7Ozs7O3NDQUMvQixJQUFJYSxLQUFKLENBQVUscUJBQVYsQzs7O2lFQUdITCxZOzs7Ozs7dUNBR0QsMEJBQWFNLFVBQWIsQ0FBd0JmLFdBQXhCLEM7Ozs7dUNBR2dCLEtBQUtLLFNBQUwsQ0FBZUMsVUFBZixDOzs7QUFBcEJHLDJDOzt1Q0FDQSxLQUFLTyxjQUFMLENBQW9CUCxXQUFwQixDOzs7aUVBQ0NBLFc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0ZBR1VBLFc7Ozs7Ozt1Q0FDWCwwQkFBYVEsT0FBYixDQUFxQmpCLFdBQXJCLEVBQWtDTyxLQUFLVyxTQUFMLENBQWVULFdBQWYsQ0FBbEMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFHRkgsVSxFQUFZYSxHLEVBQUtDLEk7Ozs7OztBQUNmQywyQyxHQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsSUFBRDtBQUFBLDJDQUFVQyxNQUFTRCxLQUFLRSxZQUFkLDJCQUFnRGxCLFdBQVdtQixTQUEzRCxHQUF1RU4sR0FBdkUsRUFBOEU7QUFDeEdPLGdEQUFRLE1BRGdHO0FBRXBHQyxpREFBUztBQUNMLHlFQUEyQkwsS0FBS00sWUFEM0I7QUFFTCw0REFBZ0Isa0JBRlg7QUFHTCxzREFBVTtBQUhMLHlDQUYyRjtBQU9wR1IsOENBQU1iLEtBQUtXLFNBQUwsQ0FBZUUsSUFBZjtBQVA4RixxQ0FBOUUsQ0FBVjtBQUFBLGlDOzs7dUNBVVAsS0FBS1MsT0FBTCxDQUFhUixXQUFiLEVBQTBCZixVQUExQixFQUFzQ2EsR0FBdEMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFHSEUsVyxFQUFhZixVLEVBQVlhLEc7Ozs7Ozs7Ozt1Q0FDZixLQUFLVyxjQUFMLENBQW9CeEIsVUFBcEIsQzs7O0FBQXBCRywyQzs7QUFFTXNCLCtDOzBGQUFrQixrQkFBT0MsUUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsNkRBQ2hCQSxTQUFTQyxFQURPO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsK0RBR0FELFNBQVNFLElBQVQsRUFIQTs7QUFBQTtBQUFBO0FBQUEsdUVBSUpGLFNBQVNHLE1BSkw7QUFBQSx1RUFLRkgsUUFMRTtBQUFBO0FBR1pFLGdFQUhZO0FBSVpDLGtFQUpZO0FBS1pILG9FQUxZO0FBQUE7O0FBQUE7QUFBQSw4REFRZEEsUUFSYzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQzs7b0RBQWxCRCxlOzs7Ozs7dUNBV2lCVixZQUFZWixXQUFaLEM7OztBQUFqQnVCLHdDOztzQ0FFRkEsU0FBU0csTUFBVCxLQUFvQnBDLGlCOzs7Ozs7dUNBQ1MsS0FBS3FDLFlBQUwsQ0FBa0I5QixVQUFsQixFQUE4QkcsV0FBOUIsQzs7O0FBQXZCNEIsOEM7O3VDQUVPaEIsWUFBWWdCLGNBQVosRUFBNEJDLElBQTVCLENBQWlDUCxlQUFqQyxDOzs7Ozs7a0VBR1ZBLGdCQUFnQkMsUUFBaEIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvRkFHUTFCLFUsRUFBWUcsVzs7Ozs7Ozt1Q0FHckIsMEJBQWFNLFVBQWIsQ0FBd0JmLFdBQXhCLEM7OztBQUVBdUMsNkMsR0FBZ0I7QUFDbEJDLGdEQUFZdEMsOEJBRE07QUFFbEJ1QyxtREFBZWhDLFlBQVlnQyxhQUZUO0FBR2xCQywrQ0FBV3BDLFdBQVdxQyxXQUhKO0FBSWxCQyxtREFBZXRDLFdBQVd1QztBQUpSLGlDO0FBTWhCQyxvQyxHQUFPQyxPQUFPQyxJQUFQLENBQVlULGFBQVosRUFBMkJVLEdBQTNCLENBQStCLFVBQUNDLENBQUQ7QUFBQSwyQ0FBU0EsQ0FBVCxTQUFjQyxtQkFBbUJaLGNBQWNXLENBQWQsQ0FBbkIsQ0FBZDtBQUFBLGlDQUEvQixFQUFxRkUsSUFBckYsQ0FBMEYsR0FBMUYsQzs7dUNBRVU3QixNQUFNcEIsMEJBQU4sRUFBa0M7QUFDckRNLGlEQUFhLFNBRHdDO0FBRXJEaUIsNENBQVEsTUFGNkM7QUFHckRDLDZDQUFTO0FBQ0wscUVBQTJCbEIsWUFBWW1CLFlBRGxDO0FBRUwsa0RBQVUsa0JBRkw7QUFHTCx3REFBZ0I7QUFIWCxxQ0FINEM7QUFRckRSLDBDQUFNMEI7QUFSK0MsaUNBQWxDLEM7OztBQUFqQmQsd0M7O29DQVdEQSxTQUFTQyxFOzs7OztzQ0FDSkQsUTs7Ozt1Q0FHbUJBLFNBQVNFLElBQVQsRTs7O0FBQXZCRyw4Qzs7O0FBRU41Qiw0Q0FBWW1CLFlBQVosR0FBMkJTLGVBQWVULFlBQTFDOzs7dUNBRU0sS0FBS1osY0FBTCxDQUFvQlAsV0FBcEIsQzs7O2tFQUVDQSxXIiwiZmlsZSI6InNhbGVzZm9yY2VBcGlSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSFRUUF9VTkFVVEhPUklaRUQgPSA0MDFcblxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfS0VZID0gJ0BTYWxlc2ZvcmNlQXBpUmVxdWVzdDpDcmVkZW50aWFscydcblxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfRVhQSVJFX1NQQU4gPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbmNvbnN0IE9BVVRIX1JFRlJFU0hfVE9LRU5fR1JBTlRfVFlQRSA9ICdyZWZyZXNoX3Rva2VuJ1xuY29uc3QgT0FVVEhfU0FMRVNGT1JDRV9MT0dJTl9VUkwgPSAnaHR0cHM6Ly9sb2dpbi5zYWxlc2ZvcmNlLmNvbS9zZXJ2aWNlcy9vYXV0aDIvdG9rZW4nXG5cblxuaW1wb3J0IHsgQXN5bmNTdG9yYWdlIH0gZnJvbSAncmVhY3QtbmF0aXZlJ1xuIFxuZXhwb3J0IGNsYXNzIFNhbGVzZm9yY2VBcGlSZXF1ZXN0IHtcblxuXHRjb25zdHJ1Y3Rvcihsb2dpblVzZXIpIHtcblx0XHR0aGlzLmxvZ2luVXNlciA9IGxvZ2luVXNlcjtcblx0fVxuXG4gICAgYXN5bmMgZ2V0Q3JlZGVudGlhbHMocGFyYW1ldGVycykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY3JlZGVudGlhbHMgPSBKU09OLnBhcnNlKGF3YWl0IEFzeW5jU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZKSk7XG5cbiAgICAgICAgICAgIGlmIChEYXRlLm5vdygpIC0gY3JlZGVudGlhbHMuaXNzdWVkX2F0ID4gU1RPUkFHRV9FWFBJUkVfU1BBTikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RvcmFnZSBrZXkgZXhwaXJlZCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjcmVkZW50aWFscztcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgYXdhaXQgQXN5bmNTdG9yYWdlLnJlbW92ZUl0ZW0oU1RPUkFHRV9LRVkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjcmVkZW50aWFscyA9IGF3YWl0IHRoaXMubG9naW5Vc2VyKHBhcmFtZXRlcnMpO1xuICAgICAgICBhd2FpdCB0aGlzLnNldENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIGFzeW5jIHNldENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGF3YWl0IEFzeW5jU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscykpXG4gICAgfVxuXG5cdGFzeW5jIHBvc3QocGFyYW1ldGVycywgdXJsLCBib2R5KSB7XG4gICAgICAgIGNvbnN0IGZldGNoQWN0aW9uID0gKGNyZWQpID0+IGZldGNoKGAke2NyZWQuaW5zdGFuY2VfdXJsfS9zZXJ2aWNlcy9hcGV4cmVzdC8ke3BhcmFtZXRlcnMubmFtZXNwYWNlfSR7dXJsfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLCBcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2NyZWQuYWNjZXNzX3Rva2VufWAsIFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFwaUNhbGwoZmV0Y2hBY3Rpb24sIHBhcmFtZXRlcnMsIHVybClcbiAgICB9XG5cbiAgICBhc3luYyBhcGlDYWxsKGZldGNoQWN0aW9uLCBwYXJhbWV0ZXJzLCB1cmwpIHtcblx0XHRjb25zdCBjcmVkZW50aWFscyA9IGF3YWl0IHRoaXMuZ2V0Q3JlZGVudGlhbHMocGFyYW1ldGVycyk7XG5cbiAgICAgICAgY29uc3QgcHJvY2Vzc1Jlc3BvbnNlID0gYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBqc29uOiBhd2FpdCByZXNwb25zZS5qc29uKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoQWN0aW9uKGNyZWRlbnRpYWxzKTtcblxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBIVFRQX1VOQVVUSE9SSVpFRCkge1xuICAgICAgICAgICAgY29uc3QgbmV3Q3JlZGVudGlhbHMgPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbihwYXJhbWV0ZXJzLCBjcmVkZW50aWFscylcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoQWN0aW9uKG5ld0NyZWRlbnRpYWxzKS50aGVuKHByb2Nlc3NSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlKVxuXHR9XG5cbiAgICBhc3luYyByZWZyZXNoVG9rZW4ocGFyYW1ldGVycywgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGV4cGlyZWQgY3JlZGVudGlhbHMuIEluIGNhc2Ugb2Ygc3VjY2VzcyByZWZyZXNoIG5ldyBjcmVkZW50aWFscyB3aWxsIGJlIHN0b3JlZFxuICAgICAgICAvLyBJbiBjYXNlIG9mIGVycm9yIG5leHQgY2FsbCB0byB0aGUgQVBJIHdpbGwgZm9yY2UgbG9naW4gc2NyZWVuIHRvIGFwcGVhclxuICAgICAgICBhd2FpdCBBc3luY1N0b3JhZ2UucmVtb3ZlSXRlbShTVE9SQUdFX0tFWSlcblxuICAgICAgICBjb25zdCByZWZyZXNoUGFyYW1zID0ge1xuICAgICAgICAgICAgZ3JhbnRfdHlwZTogT0FVVEhfUkVGUkVTSF9UT0tFTl9HUkFOVF9UWVBFLFxuICAgICAgICAgICAgcmVmcmVzaF90b2tlbjogY3JlZGVudGlhbHMucmVmcmVzaF90b2tlbixcbiAgICAgICAgICAgIGNsaWVudF9pZDogcGFyYW1ldGVycy5jb25zdW1lcktleSxcbiAgICAgICAgICAgIGNsaWVudF9zZWNyZXQ6IHBhcmFtZXRlcnMuY29uc3VtZXJTZWNyZXRcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmb3JtID0gT2JqZWN0LmtleXMocmVmcmVzaFBhcmFtcykubWFwKChrKT0+IGAke2t9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZnJlc2hQYXJhbXNba10pfWApLmpvaW4oJyYnKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goT0FVVEhfU0FMRVNGT1JDRV9MT0dJTl9VUkwsIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgJHtjcmVkZW50aWFscy5hY2Nlc3NfdG9rZW59YCwgXG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBmb3JtXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHRocm93IHJlc3BvbnNlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdDcmVkZW50aWFscyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuXG4gICAgICAgIGNyZWRlbnRpYWxzLmFjY2Vzc190b2tlbiA9IG5ld0NyZWRlbnRpYWxzLmFjY2Vzc190b2tlbjtcblxuICAgICAgICBhd2FpdCB0aGlzLnNldENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcblxuICAgICAgICByZXR1cm4gY3JlZGVudGlhbHM7XG4gICAgfVxufSJdfQ==