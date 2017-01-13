const HTTP_UNAUTHORIZED = 401
const STORAGE_KEY = '@SalesforceApiRequest:Credentials'
const STORAGE_EXPIRE_SPAN = 1000 * 60 * 30

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
        }

        const credentials = await this.loginUser(parameters);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials))

        return credentials;
    }

	async post(parameters, url, body) {
		const credentials = await this.getCredentials(parameters);

        const doFetch = () => fetch(`${credentials.instance_url}${url}`, {
            method: 'post', 
                headers: {
                    'Authorization': `Bearer ${credentials.access_token}`, 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                body: JSON.stringify(body)
            });

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

        const response = await doFetch();

        if (response.status === HTTP_UNAUTHORIZED) {
            await this.refreshToken(credentials)

            return await doFetch().then(processResponse);
        }

        return processResponse(response)
	}

    async refreshToken(credentials) {
        //TODO:
    }

}