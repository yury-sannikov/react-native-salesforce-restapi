const HTTP_UNAUTHORIZED = 401

const STORAGE_KEY = '@SalesforceApiRequest:Credentials'

const STORAGE_EXPIRE_SPAN = 1000 * 60 * 60 * 24

const OAUTH_REFRESH_TOKEN_GRANT_TYPE = 'refresh_token'
const OAUTH_SALESFORCE_LOGIN_URL = 'https://login.salesforce.com/services/oauth2/token'


import { AsyncStorage } from 'react-native'
 
export class SalesforceApiRequest {

	constructor(loginUser) {
		this.loginUser = loginUser;
	}

    async getCredentials(parameters) {
        try {
            const credentials = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY));

            if (Date.now() - credentials.issued_at > STORAGE_EXPIRE_SPAN) {
                throw new Error('Storage key expired')
            }

            return credentials;
        }
        catch(error) {
            await AsyncStorage.removeItem(STORAGE_KEY)
        }

        const credentials = await this.loginUser(parameters);
        await this.setCredentials(credentials);
        return credentials;
    }

    async setCredentials(credentials) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))
    }

	async post(parameters, url, body) {
        const fetchAction = (cred) => fetch(`${cred.instance_url}/services/apexrest/${parameters.namespace}${url}`, {
            method: 'post', 
                headers: {
                    'Authorization': `Bearer ${cred.access_token}`, 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                body: JSON.stringify(body)
            });

        return await this.apiCall(fetchAction, parameters, url, body)
    }

    async apiCall(fetchAction, parameters, url, body) {
		const credentials = await this.getCredentials(parameters);

        const processResponse = async (response) => {
            if (response.ok) {
                return {
                    json: await response.json(),
                    status: response.status,
                    response: response
                };
            }
            throw response;
        }

        const response = await fetchAction(credentials);

        if (response.status === HTTP_UNAUTHORIZED) {
            const newCredentials = await this.refreshToken(parameters, credentials)

            return await fetchAction(newCredentials).then(processResponse);
        }

        return processResponse(response)
	}

    async refreshToken(parameters, credentials) {
        // Remove expired credentials. In case of success refresh new credentials will be stored
        // In case of error next call to the API will force login screen to appear
        await AsyncStorage.removeItem(STORAGE_KEY)

        const refreshParams = {
            grant_type: OAUTH_REFRESH_TOKEN_GRANT_TYPE,
            refresh_token: credentials.refresh_token,
            client_id: parameters.consumerKey,
            client_secret: parameters.consumerSecret
        }
        const form = Object.keys(refreshParams).map((k)=> `${k}=${encodeURIComponent(refreshParams[k])}`).join('&');
        
        const response = await fetch(OAUTH_SALESFORCE_LOGIN_URL, {
            credentials: 'include',
            method: 'post',
            headers: {
                'Authorization': `Bearer ${credentials.access_token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: form
        });

        if (!response.ok) {
            throw response
        }

        const newCredentials = await response.json()

        credentials.access_token = newCredentials.access_token;

        await this.setCredentials(credentials);

        return credentials;
    }
}