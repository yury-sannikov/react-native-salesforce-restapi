
jest.mock('react-native', () => {
	return {
		AsyncStorage: {
			getItem: jest.fn(),
			removeItem: jest.fn(),
			setItem: jest.fn()
		}
	}
});

import { SalesforceApiRequest, STORAGE_KEY, STORAGE_EXPIRE_SPAN } from './salesforceApiRequest'
import { AsyncStorage } from 'react-native'

global.fetch = jest.fn();

describe('Salesforce API', () => {
	beforeEach(() => {
		AsyncStorage.getItem.mockReset();
		AsyncStorage.removeItem.mockReset();
		AsyncStorage.setItem.mockReset();
		global.fetch.mockReset();
	})
	it('should store loginUser', () => {
		const loginUserInstance = {}
		const instance = new SalesforceApiRequest(loginUserInstance);
		expect(instance.loginUser).toBe(loginUserInstance);
	})
	describe('isLoggedIn call', () => {

		it('should return true if logged in', async () => {
			const getItemResult = { issued_at: Date.now()};
			const instance = new SalesforceApiRequest(null);

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));
			const loggedIn = await instance.isLoggedIn();
			expect(loggedIn).toBeTruthy();
		});
		it('should return false if not logged in', async () => {
			const instance = new SalesforceApiRequest(null);
			AsyncStorage.getItem.mockReturnValueOnce(null);
			const loggedIn = await instance.isLoggedIn();
			expect(loggedIn).toBeFalsy();
		});
	});

	describe('getCredentials call', () => {

		it('should remove local storage key in case of invalid data/no data', async () => {
			const loginUserInstance = jest.fn();
			const loginUserResult = { result: 1}
			loginUserInstance.mockReturnValueOnce(loginUserResult);

			const instance = new SalesforceApiRequest(loginUserInstance);
			const params = { test: 1}

			AsyncStorage.getItem.mockReturnValueOnce(null);

			const credentials = await instance.getCredentials(params);

			expect(AsyncStorage.removeItem).toHaveBeenCalled();
			expect(loginUserInstance).toHaveBeenCalledWith(params);
			expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(loginUserResult));

		})
		it('should return credentials if not expired', async () => {
			
			const loginUserInstance = jest.fn();
			const getItemResult = { issued_at: Date.now()};

			const instance = new SalesforceApiRequest(loginUserInstance);

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));

			const credentials = await instance.getCredentials({});

			expect(loginUserInstance).not.toHaveBeenCalled();
			expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
			expect(credentials).toEqual(getItemResult);
		})

		it('should discard credentials if time span expired', async () => {
			
			const loginUserInstance = jest.fn();
			const getItemResult = { issued_at: Date.now() - STORAGE_EXPIRE_SPAN - 1};

			const instance = new SalesforceApiRequest(loginUserInstance);

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));

			const credentials = await instance.getCredentials({});

			expect(AsyncStorage.removeItem).toHaveBeenCalled();
		})
	})
	describe('post call', () => {
		it('should invoke apiCall with proper parameters', async () => {
			
			const instance = new SalesforceApiRequest();
			instance.apiCall = jest.fn();
			const postResult = {success: true}
			instance.apiCall.mockReturnValueOnce(new Promise((resolve) => {resolve(postResult)}));

			const body = {apiCallBody: 1}
			const result = await instance.post({namespace: 'Framework'}, 'testUrl', body);

			expect(instance.apiCall).toHaveBeenCalled();
			expect(instance.apiCall.mock.calls[0][1]).toEqual({namespace: 'Framework'});
			expect(instance.apiCall.mock.calls[0][2]).toEqual('testUrl');
		});
		it('should invoke apiCall with proper fetchAction', async () => {
			
			const instance = new SalesforceApiRequest();
			instance.apiCall = jest.fn();
			const postResult = {success: true}
			instance.apiCall.mockReturnValueOnce(new Promise((resolve) => {resolve(postResult)}));

			const body = {apiCallBody: 1}
			const result = await instance.post({namespace: 'Framework'}, '/testUrl', body);

			expect(instance.apiCall).toHaveBeenCalled();
			const fetchAction = instance.apiCall.mock.calls[0][0]

			expect(fetchAction).toBeDefined();

			fetchAction({
				instance_url: 'sfinstance',
				access_token: 'accesstoken'
			})

			expect(global.fetch).toHaveBeenCalled();

			expect(global.fetch.mock.calls[0][0]).toBe('sfinstance/services/apexrest/Framework/testUrl');
			expect(global.fetch.mock.calls[0][1]).toEqual({
 				method: 'post',
		        headers: {
			        	Authorization: 'Bearer accesstoken',
			        	'Content-Type': 'application/json',
						Accept: 'application/json'
				},
				body: JSON.stringify(body)
			});
		});
	});
	
	describe('apiCall call', () => {
		it('should process normal response', async () => {

			const getItemResult = {
				issued_at: Date.now(),
				instance_url: 'sfinstance',
				access_token: 'accesstoken'
			};

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));

			const instance = new SalesforceApiRequest();

			const parameters = {namespace: 'Framework'}
			const url = '/eventapi';

			const fetchResponse = {
            	json: () => new Promise( (resolve) => {resolve({response: 'success'})}),
                status: 200,
                response: '',
                ok: true				
			};

			const fetchAction = jest.fn();
			fetchAction.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchResponse)}));

			const result = await instance.apiCall(fetchAction, parameters, url);

			expect(AsyncStorage.getItem).toHaveBeenCalled();
			expect(fetchAction).toHaveBeenCalled();
			expect(result).toEqual({
				json: { response: 'success' },
				status: 200,
				response: fetchResponse
			});

			expect(fetchAction).toHaveBeenCalledWith(getItemResult);
		});
		it('should process error response', async () => {

			const getItemResult = {
				issued_at: Date.now(),
				instance_url: 'sfinstance',
				access_token: 'accesstoken'
			};

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));

			const instance = new SalesforceApiRequest();

			const parameters = {namespace: 'Framework'}
			const url = '/eventapi';

			const fetchResponse = {
            	json: () => new Promise( (resolve) => {resolve({response: 'failure'})}),
                status: 500,
                response: '',
                ok: false			
			};

			const fetchAction = jest.fn();
			fetchAction.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchResponse)}));

			try {
				await instance.apiCall(fetchAction, parameters, url);
				expect('should throw').toBe('did not throw');
			} catch(e) {
				expect(e).toEqual(fetchResponse);
			}
		});
		it('should failover from unauthorized response', async () => {

			const getItemResult = {
				issued_at: Date.now(),
				instance_url: 'sfinstance',
				access_token: 'accesstoken'
			};

			AsyncStorage.getItem.mockReturnValueOnce(JSON.stringify(getItemResult));

			const instance = new SalesforceApiRequest();

			instance.refreshToken = jest.fn();
			instance.refreshToken.mockReturnValueOnce(getItemResult);

			const parameters = {namespace: 'Framework'}
			const url = '/eventapi';

			const fetchResponse = {
            	json: () => new Promise( (resolve) => {resolve({response: 'failure'})}),
                status: 401,
                response: 'unauthorized',
                ok: false			
			};
			const fetchRefreshResponse = {
            	json: () => new Promise( (resolve) => {resolve({response: 'success'})}),
                status: 200,
                response: 'ok',
                ok: true			
			};


			const fetchAction = jest.fn();
			fetchAction.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchResponse)}))
				.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchRefreshResponse)}));


			const result = await instance.apiCall(fetchAction, parameters, url);

			expect(result).toEqual({
				json: { response: 'success' },
				status: 200,
				response: fetchRefreshResponse
			});
			expect(fetchAction).toHaveBeenCalledTimes(2);
		});
	});
	describe('refreshToken call', () => {
		it('should return credentials with new access_token', async () => {
			
			const instance = new SalesforceApiRequest();

			const parameters = {
				consumerKey: 'consumerKey',
				consumerSecret: 'consumerSecret'
			}

			const credentials = {
				refresh_token: 'refresh_token',
				access_token: 'access_token'
			}

			const fetchResponse = {
            	json: () => new Promise( (resolve) => {resolve({access_token: 'new_token'})}),
                status: 200,
                response: 'ok',
                ok: true			
			}
			global.fetch.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchResponse)}));

			const result = await instance.refreshToken(parameters, credentials);

			expect(result).toEqual({ refresh_token: 'refresh_token', access_token: 'new_token' });

			expect(global.fetch.mock.calls[0][0]).toBe('https://login.salesforce.com/services/oauth2/token');
			expect(global.fetch.mock.calls[0][1]).toEqual({
				credentials: 'include',
				method: 'post',
				headers: {
					Authorization: 'Bearer access_token',
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
				},
				body: 'grant_type=refresh_token&refresh_token=refresh_token&client_id=consumerKey&client_secret=consumerSecret'
			});
		})
		it('should throw if response is not ok', async () => {
			
			const instance = new SalesforceApiRequest();

			const parameters = {
				consumerKey: 'consumerKey',
				consumerSecret: 'consumerSecret'
			}

			const credentials = {
				refresh_token: 'refresh_token',
				access_token: 'access_token'
			}

			const fetchResponse = {
            	json: () => new Promise( (resolve) => {resolve({access_token: 'new_token'})}),
                status: 200,
                response: 'ok',
                ok: false			
			}
			global.fetch.mockReturnValueOnce(new Promise( (resolve) => {resolve(fetchResponse)}));

			try {
				await instance.refreshToken(parameters, credentials);
				expect('should throw').toBe('did not throw');
			} catch(e) {
				expect(e).toEqual(fetchResponse);
			}
		});		

	});
})