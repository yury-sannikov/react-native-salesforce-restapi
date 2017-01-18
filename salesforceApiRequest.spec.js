
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


})