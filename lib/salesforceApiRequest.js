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
        key: 'isLoggedIn',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var credentials;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getStoredCredentials();

                            case 2:
                                credentials = _context.sent;
                                return _context.abrupt('return', credentials != null);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function isLoggedIn() {
                return _ref.apply(this, arguments);
            }

            return isLoggedIn;
        }()
    }, {
        key: 'logOut',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _reactNative.AsyncStorage.removeItem(STORAGE_KEY);

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function logOut() {
                return _ref2.apply(this, arguments);
            }

            return logOut;
        }()
    }, {
        key: 'getCredentials',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(parameters) {
                var credentials;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.getStoredCredentials();

                            case 2:
                                credentials = _context3.sent;

                                if (!credentials) {
                                    _context3.next = 5;
                                    break;
                                }

                                return _context3.abrupt('return', credentials);

                            case 5:
                                _context3.next = 7;
                                return this.loginUser(parameters);

                            case 7:
                                credentials = _context3.sent;
                                _context3.next = 10;
                                return this.setCredentials(credentials);

                            case 10:
                                return _context3.abrupt('return', credentials);

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getCredentials(_x) {
                return _ref3.apply(this, arguments);
            }

            return getCredentials;
        }()
    }, {
        key: 'getStoredCredentials',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(parameters) {
                var credentials;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.t0 = JSON;
                                _context4.next = 4;
                                return _reactNative.AsyncStorage.getItem(STORAGE_KEY);

                            case 4:
                                _context4.t1 = _context4.sent;
                                credentials = _context4.t0.parse.call(_context4.t0, _context4.t1);

                                if (!(Date.now() - credentials.issued_at > STORAGE_EXPIRE_SPAN)) {
                                    _context4.next = 8;
                                    break;
                                }

                                throw new Error('Storage key expired');

                            case 8:
                                return _context4.abrupt('return', credentials);

                            case 11:
                                _context4.prev = 11;
                                _context4.t2 = _context4['catch'](0);
                                _context4.next = 15;
                                return this.logOut();

                            case 15:
                                return _context4.abrupt('return', null);

                            case 16:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 11]]);
            }));

            function getStoredCredentials(_x2) {
                return _ref4.apply(this, arguments);
            }

            return getStoredCredentials;
        }()
    }, {
        key: 'setCredentials',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(credentials) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return _reactNative.AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));

                            case 2:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function setCredentials(_x3) {
                return _ref5.apply(this, arguments);
            }

            return setCredentials;
        }()
    }, {
        key: 'post',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(parameters, url, body) {
                var fetchAction;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
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

                                _context6.next = 3;
                                return this.apiCall(fetchAction, parameters, url);

                            case 3:
                                return _context6.abrupt('return', _context6.sent);

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function post(_x4, _x5, _x6) {
                return _ref6.apply(this, arguments);
            }

            return post;
        }()
    }, {
        key: 'apiCall',
        value: function () {
            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(fetchAction, parameters, url) {
                var _this = this;

                var credentials, processResponse, response, newCredentials;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return this.getCredentials(parameters);

                            case 2:
                                credentials = _context8.sent;

                                processResponse = function () {
                                    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(response) {
                                        return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                            while (1) {
                                                switch (_context7.prev = _context7.next) {
                                                    case 0:
                                                        if (!response.ok) {
                                                            _context7.next = 7;
                                                            break;
                                                        }

                                                        _context7.next = 3;
                                                        return response.json();

                                                    case 3:
                                                        _context7.t0 = _context7.sent;
                                                        _context7.t1 = response.status;
                                                        _context7.t2 = response;
                                                        return _context7.abrupt('return', {
                                                            json: _context7.t0,
                                                            status: _context7.t1,
                                                            response: _context7.t2
                                                        });

                                                    case 7:
                                                        throw response;

                                                    case 8:
                                                    case 'end':
                                                        return _context7.stop();
                                                }
                                            }
                                        }, _callee7, _this);
                                    }));

                                    return function processResponse(_x10) {
                                        return _ref8.apply(this, arguments);
                                    };
                                }();

                                _context8.next = 6;
                                return fetchAction(credentials);

                            case 6:
                                response = _context8.sent;

                                if (!(response.status === HTTP_UNAUTHORIZED)) {
                                    _context8.next = 14;
                                    break;
                                }

                                _context8.next = 10;
                                return this.refreshToken(parameters, credentials);

                            case 10:
                                newCredentials = _context8.sent;
                                _context8.next = 13;
                                return fetchAction(newCredentials).then(processResponse);

                            case 13:
                                return _context8.abrupt('return', _context8.sent);

                            case 14:
                                return _context8.abrupt('return', processResponse(response));

                            case 15:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function apiCall(_x7, _x8, _x9) {
                return _ref7.apply(this, arguments);
            }

            return apiCall;
        }()
    }, {
        key: 'refreshToken',
        value: function () {
            var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(parameters, credentials) {
                var refreshParams, form, response, newCredentials;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.logOut();

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
                                _context9.next = 6;
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
                                response = _context9.sent;

                                if (response.ok) {
                                    _context9.next = 9;
                                    break;
                                }

                                throw response;

                            case 9:
                                _context9.next = 11;
                                return response.json();

                            case 11:
                                newCredentials = _context9.sent;


                                credentials.access_token = newCredentials.access_token;

                                _context9.next = 15;
                                return this.setCredentials(credentials);

                            case 15:
                                return _context9.abrupt('return', credentials);

                            case 16:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function refreshToken(_x11, _x12) {
                return _ref9.apply(this, arguments);
            }

            return refreshToken;
        }()
    }]);

    return SalesforceApiRequest;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NhbGVzZm9yY2VBcGlSZXF1ZXN0LmpzIl0sIm5hbWVzIjpbIkhUVFBfVU5BVVRIT1JJWkVEIiwiU1RPUkFHRV9LRVkiLCJTVE9SQUdFX0VYUElSRV9TUEFOIiwiT0FVVEhfUkVGUkVTSF9UT0tFTl9HUkFOVF9UWVBFIiwiT0FVVEhfU0FMRVNGT1JDRV9MT0dJTl9VUkwiLCJTYWxlc2ZvcmNlQXBpUmVxdWVzdCIsImxvZ2luVXNlciIsImdldFN0b3JlZENyZWRlbnRpYWxzIiwiY3JlZGVudGlhbHMiLCJyZW1vdmVJdGVtIiwicGFyYW1ldGVycyIsInNldENyZWRlbnRpYWxzIiwiSlNPTiIsImdldEl0ZW0iLCJwYXJzZSIsIkRhdGUiLCJub3ciLCJpc3N1ZWRfYXQiLCJFcnJvciIsImxvZ091dCIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ1cmwiLCJib2R5IiwiZmV0Y2hBY3Rpb24iLCJjcmVkIiwiZmV0Y2giLCJpbnN0YW5jZV91cmwiLCJuYW1lc3BhY2UiLCJtZXRob2QiLCJoZWFkZXJzIiwiYWNjZXNzX3Rva2VuIiwiYXBpQ2FsbCIsImdldENyZWRlbnRpYWxzIiwicHJvY2Vzc1Jlc3BvbnNlIiwicmVzcG9uc2UiLCJvayIsImpzb24iLCJzdGF0dXMiLCJyZWZyZXNoVG9rZW4iLCJuZXdDcmVkZW50aWFscyIsInRoZW4iLCJyZWZyZXNoUGFyYW1zIiwiZ3JhbnRfdHlwZSIsInJlZnJlc2hfdG9rZW4iLCJjbGllbnRfaWQiLCJjb25zdW1lcktleSIsImNsaWVudF9zZWNyZXQiLCJjb25zdW1lclNlY3JldCIsImZvcm0iLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiayIsImVuY29kZVVSSUNvbXBvbmVudCIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFWQSxJQUFNQSxvQkFBb0IsR0FBMUI7O0FBRU8sSUFBTUMsb0NBQWMsbUNBQXBCOztBQUVBLElBQU1DLG9EQUFzQixPQUFPLEVBQVAsR0FBWSxFQUFaLEdBQWlCLEVBQTdD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RUF1Qiw2QyxHQUFnQjtBQUNsQkMsZ0RBQVl4Qyw4QkFETTtBQUVsQnlDLG1EQUFlcEMsWUFBWW9DLGFBRlQ7QUFHbEJDLCtDQUFXbkMsV0FBV29DLFdBSEo7QUFJbEJDLG1EQUFlckMsV0FBV3NDO0FBSlIsaUM7QUFNaEJDLG9DLEdBQU9DLE9BQU9DLElBQVAsQ0FBWVQsYUFBWixFQUEyQlUsR0FBM0IsQ0FBK0IsVUFBQ0MsQ0FBRDtBQUFBLDJDQUFTQSxDQUFULFNBQWNDLG1CQUFtQlosY0FBY1csQ0FBZCxDQUFuQixDQUFkO0FBQUEsaUNBQS9CLEVBQXFGRSxJQUFyRixDQUEwRixHQUExRixDOzt1Q0FFVTdCLE1BQU10QiwwQkFBTixFQUFrQztBQUNyREksaURBQWEsU0FEd0M7QUFFckRxQiw0Q0FBUSxNQUY2QztBQUdyREMsNkNBQVM7QUFDTCxxRUFBMkJ0QixZQUFZdUIsWUFEbEM7QUFFTCxrREFBVSxrQkFGTDtBQUdMLHdEQUFnQjtBQUhYLHFDQUg0QztBQVFyRFIsMENBQU0wQjtBQVIrQyxpQ0FBbEMsQzs7O0FBQWpCZCx3Qzs7b0NBV0RBLFNBQVNDLEU7Ozs7O3NDQUNKRCxROzs7O3VDQUdtQkEsU0FBU0UsSUFBVCxFOzs7QUFBdkJHLDhDOzs7QUFFTmhDLDRDQUFZdUIsWUFBWixHQUEyQlMsZUFBZVQsWUFBMUM7Ozt1Q0FFTSxLQUFLcEIsY0FBTCxDQUFvQkgsV0FBcEIsQzs7O2tFQUVDQSxXIiwiZmlsZSI6InNhbGVzZm9yY2VBcGlSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSFRUUF9VTkFVVEhPUklaRUQgPSA0MDFcblxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfS0VZID0gJ0BTYWxlc2ZvcmNlQXBpUmVxdWVzdDpDcmVkZW50aWFscydcblxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfRVhQSVJFX1NQQU4gPSAxMDAwICogNjAgKiA2MCAqIDI0XG5cbmNvbnN0IE9BVVRIX1JFRlJFU0hfVE9LRU5fR1JBTlRfVFlQRSA9ICdyZWZyZXNoX3Rva2VuJ1xuY29uc3QgT0FVVEhfU0FMRVNGT1JDRV9MT0dJTl9VUkwgPSAnaHR0cHM6Ly9sb2dpbi5zYWxlc2ZvcmNlLmNvbS9zZXJ2aWNlcy9vYXV0aDIvdG9rZW4nXG5cblxuaW1wb3J0IHsgQXN5bmNTdG9yYWdlIH0gZnJvbSAncmVhY3QtbmF0aXZlJ1xuIFxuZXhwb3J0IGNsYXNzIFNhbGVzZm9yY2VBcGlSZXF1ZXN0IHtcblxuXHRjb25zdHJ1Y3Rvcihsb2dpblVzZXIpIHtcblx0XHR0aGlzLmxvZ2luVXNlciA9IGxvZ2luVXNlcjtcblx0fVxuXG4gICAgYXN5bmMgaXNMb2dnZWRJbigpIHtcbiAgICAgICAgbGV0IGNyZWRlbnRpYWxzID0gYXdhaXQgdGhpcy5nZXRTdG9yZWRDcmVkZW50aWFscygpO1xuICAgICAgICByZXR1cm4gY3JlZGVudGlhbHMgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBhc3luYyBsb2dPdXQoKSB7XG4gICAgICAgIGF3YWl0IEFzeW5jU3RvcmFnZS5yZW1vdmVJdGVtKFNUT1JBR0VfS0VZKVxuICAgIH1cblxuICAgIGFzeW5jIGdldENyZWRlbnRpYWxzKHBhcmFtZXRlcnMpIHtcbiAgICAgICAgbGV0IGNyZWRlbnRpYWxzID0gYXdhaXQgdGhpcy5nZXRTdG9yZWRDcmVkZW50aWFscygpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbHM7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVkZW50aWFscyA9IGF3YWl0IHRoaXMubG9naW5Vc2VyKHBhcmFtZXRlcnMpO1xuICAgICAgICBhd2FpdCB0aGlzLnNldENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgcmV0dXJuIGNyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIGFzeW5jIGdldFN0b3JlZENyZWRlbnRpYWxzKHBhcmFtZXRlcnMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNyZWRlbnRpYWxzID0gSlNPTi5wYXJzZShhd2FpdCBBc3luY1N0b3JhZ2UuZ2V0SXRlbShTVE9SQUdFX0tFWSkpO1xuXG4gICAgICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIGNyZWRlbnRpYWxzLmlzc3VlZF9hdCA+IFNUT1JBR0VfRVhQSVJFX1NQQU4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JhZ2Uga2V5IGV4cGlyZWQnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMubG9nT3V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHNldENyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGF3YWl0IEFzeW5jU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscykpXG4gICAgfVxuXG5cdGFzeW5jIHBvc3QocGFyYW1ldGVycywgdXJsLCBib2R5KSB7XG4gICAgICAgIGNvbnN0IGZldGNoQWN0aW9uID0gKGNyZWQpID0+IGZldGNoKGAke2NyZWQuaW5zdGFuY2VfdXJsfS9zZXJ2aWNlcy9hcGV4cmVzdC8ke3BhcmFtZXRlcnMubmFtZXNwYWNlfSR7dXJsfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLCBcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2NyZWQuYWNjZXNzX3Rva2VufWAsIFxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmFwaUNhbGwoZmV0Y2hBY3Rpb24sIHBhcmFtZXRlcnMsIHVybClcbiAgICB9XG5cbiAgICBhc3luYyBhcGlDYWxsKGZldGNoQWN0aW9uLCBwYXJhbWV0ZXJzLCB1cmwpIHtcblx0XHRjb25zdCBjcmVkZW50aWFscyA9IGF3YWl0IHRoaXMuZ2V0Q3JlZGVudGlhbHMocGFyYW1ldGVycyk7XG5cbiAgICAgICAgY29uc3QgcHJvY2Vzc1Jlc3BvbnNlID0gYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBqc29uOiBhd2FpdCByZXNwb25zZS5qc29uKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoQWN0aW9uKGNyZWRlbnRpYWxzKTtcblxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSBIVFRQX1VOQVVUSE9SSVpFRCkge1xuICAgICAgICAgICAgY29uc3QgbmV3Q3JlZGVudGlhbHMgPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbihwYXJhbWV0ZXJzLCBjcmVkZW50aWFscylcblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZldGNoQWN0aW9uKG5ld0NyZWRlbnRpYWxzKS50aGVuKHByb2Nlc3NSZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlKVxuXHR9XG5cbiAgICBhc3luYyByZWZyZXNoVG9rZW4ocGFyYW1ldGVycywgY3JlZGVudGlhbHMpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGV4cGlyZWQgY3JlZGVudGlhbHMuIEluIGNhc2Ugb2Ygc3VjY2VzcyByZWZyZXNoIG5ldyBjcmVkZW50aWFscyB3aWxsIGJlIHN0b3JlZFxuICAgICAgICAvLyBJbiBjYXNlIG9mIGVycm9yIG5leHQgY2FsbCB0byB0aGUgQVBJIHdpbGwgZm9yY2UgbG9naW4gc2NyZWVuIHRvIGFwcGVhclxuICAgICAgICBhd2FpdCB0aGlzLmxvZ091dCgpO1xuXG4gICAgICAgIGNvbnN0IHJlZnJlc2hQYXJhbXMgPSB7XG4gICAgICAgICAgICBncmFudF90eXBlOiBPQVVUSF9SRUZSRVNIX1RPS0VOX0dSQU5UX1RZUEUsXG4gICAgICAgICAgICByZWZyZXNoX3Rva2VuOiBjcmVkZW50aWFscy5yZWZyZXNoX3Rva2VuLFxuICAgICAgICAgICAgY2xpZW50X2lkOiBwYXJhbWV0ZXJzLmNvbnN1bWVyS2V5LFxuICAgICAgICAgICAgY2xpZW50X3NlY3JldDogcGFyYW1ldGVycy5jb25zdW1lclNlY3JldFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm0gPSBPYmplY3Qua2V5cyhyZWZyZXNoUGFyYW1zKS5tYXAoKGspPT4gYCR7a309JHtlbmNvZGVVUklDb21wb25lbnQocmVmcmVzaFBhcmFtc1trXSl9YCkuam9pbignJicpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChPQVVUSF9TQUxFU0ZPUkNFX0xPR0lOX1VSTCwge1xuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2NyZWRlbnRpYWxzLmFjY2Vzc190b2tlbn1gLCBcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IGZvcm1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgdGhyb3cgcmVzcG9uc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0NyZWRlbnRpYWxzID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG5cbiAgICAgICAgY3JlZGVudGlhbHMuYWNjZXNzX3Rva2VuID0gbmV3Q3JlZGVudGlhbHMuYWNjZXNzX3Rva2VuO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0Q3JlZGVudGlhbHMoY3JlZGVudGlhbHMpO1xuXG4gICAgICAgIHJldHVybiBjcmVkZW50aWFscztcbiAgICB9XG59Il19