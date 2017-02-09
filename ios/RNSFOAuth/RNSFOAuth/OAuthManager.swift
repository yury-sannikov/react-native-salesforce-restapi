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
    static let OAUTH_LOGIN_CANCELLED : String = "login_canceled"
}

@objc(OAuthManager)
class OAuthManager: NSObject {
    
    var oauthswift:OAuth2Swift?
    
    override init() {
        super.init();
        oauthswift = nil
    }
    
    @objc(loginUser:resolver:rejecter:)
    func loginUser(options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter:@escaping RCTPromiseRejectBlock) -> Void {

        guard oauthswift == nil else {
            NSLog("Another OAuth2Swift session in progress.")
            return;
        }
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
                guard let me = self else { return; }
                guard me.oauthswift != nil else { return; }
                
                resolver(parameters)
                me.oauthswift = nil
        }) {[weak self] (err) in
            guard let me = self else { return; }
            guard me.oauthswift != nil else { return; }
            
            print(err.localizedDescription)
            if (err.errorCode == OAuthSwiftError.cancelled._code) {
                rejecter(Constants.OAUTH_LOGIN_CANCELLED, err.localizedDescription, err)
            } else {
                rejecter(Constants.OAUTH_LOGIN_ERROR, err.localizedDescription, err)
            }
            me.oauthswift = nil
        }
    }
}

