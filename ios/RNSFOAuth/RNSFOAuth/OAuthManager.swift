import Foundation
import React

struct KeyConstants {
    static let consumerKey = "consumerKey"
    static let consumerSecret = "consumerSecret"
    static let authorizeUrl = "authorizeUrl"
    static let accessTokenUrl = "accessTokenUrl"
    static let responseType = "responseType"
}

struct Constants {
    static let OAUTH_CALLBACK_URL = "oauth-swift://oauth-callback/salesforce"
    static let OAUTH_SCOPES : String = "api refresh_token"
    static let OAUTH_LOGIN_ERROR : String = "login_error"
}

@objc(OAuthManager)
class OAuthManager: NSObject {
    
    var oauthswift:OAuth2Swift?
    
    override init() {
        super.init();
    }
    
    @objc(loginUser:options:resolver:rejecter:)
    func loginUser(name: String, options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter:@escaping RCTPromiseRejectBlock) -> Void {

        oauthswift = OAuth2Swift(
            consumerKey:    options.value(forKey: KeyConstants.consumerKey) as! String,
            consumerSecret: options.value(forKey: KeyConstants.consumerSecret) as! String,
            authorizeUrl:   options.value(forKey: KeyConstants.authorizeUrl) as! String,
            accessTokenUrl: options.value(forKey: KeyConstants.accessTokenUrl) as! String,
            responseType:   options.value(forKey: KeyConstants.responseType) as! String
        )

        oauthswift!.authorizeURLHandler = WKWebViewURLHander()

        oauthswift!.authorize(
            withCallbackURL: Constants.OAUTH_CALLBACK_URL,
            scope: Constants.OAUTH_SCOPES,
            state: generateState(withLength: 20),
            success: {[weak self] (credential, response, parameters) in
                resolver(parameters)
                self?.oauthswift = nil
        }) {[weak self] (err) in
            print(err.localizedDescription)
            rejecter(Constants.OAUTH_LOGIN_ERROR, err.localizedDescription, err)
            self?.oauthswift = nil
        }
    }
}

