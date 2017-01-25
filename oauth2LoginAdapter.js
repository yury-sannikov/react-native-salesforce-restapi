const urlParse = require('url-parse');

const SALESFORCE_CALLBACK_URL = 'oauth-swift://oauth-callback/salesforce'
const OAUTH_GET_TOKEN_GRANT_TYPE = 'authorization_code'

const PARAMETER_DEFAULTS = {
  callbackUrl: SALESFORCE_CALLBACK_URL,
  scope: 'api refresh_token'
}

function buildOAuth2LoginURL(parameters, state) {
  const urlParameters = {
    client_id: parameters.consumerKey,
    redirect_uri: parameters.callbackUrl,
    response_type: parameters.responseType,
    scope: parameters.scope,
    state
  }

  const urlParametersStr = Object
    .getOwnPropertyNames(urlParameters)
    .map((key) => `${key}=${encodeURIComponent(urlParameters[key])}`)
    .join('&')

  return `${parameters.authorizeUrl}?${urlParametersStr}`
}

function fetchAccessToken(parameters, code) {
    const fetchParams = {
        client_secret: parameters.consumerSecret,
        grant_type: OAUTH_GET_TOKEN_GRANT_TYPE,
        code,
        client_id: parameters.consumerKey,
        redirect_uri: parameters.callbackUrl
    }
    const form = Object.keys(fetchParams).map((k)=> `${k}=${encodeURIComponent(fetchParams[k])}`).join('&');
    
    return fetch(parameters.accessTokenUrl, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: form
    });    

}

module.exports = (loginUser) => {
  return async (parameters) => {

    const parametersWithDefaults = {...parameters, ...PARAMETER_DEFAULTS}

    // Generate random state for OAuth2 login
    const state = '00000000000000000000000000000000'.replace(/0/g, () => (0|Math.random()*16).toString(16))

    // Build login URL
    const webLoginURL = buildOAuth2LoginURL(parametersWithDefaults, state)

    // Call browser, await for log in into salesforce.
    const callbackUrl = await loginUser(webLoginURL, parametersWithDefaults.callbackUrl)

    const parsed = urlParse(callbackUrl, true)

    if (parsed.query.state !== state) {
      throw new Error(`OAuth2 response state does not match. Expected: ${state}, received: ${parsed.query.state}`)
    }

    const oauthCode = parsed.query.code
    
    if (!oauthCode) {
      throw new Error('OAuth2 response has no code');
    }

    const fetchResult =  await fetchAccessToken(parametersWithDefaults, oauthCode);

    if (!fetchResult.ok) {
      throw fetchResult;
    }

    return await fetchResult.json();
  }
};