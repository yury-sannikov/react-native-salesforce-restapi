//
//  OAuthURLHandler.swift
//  Pods
//
//  Created by Yuri Sanikov on 1/11/17.
//
//

import Foundation
import WebKit

public class WKWebViewURLHander : OAuthWebViewController, WKNavigationDelegate {

    var targetURL : URL?
    var webView : WKWebView!
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        let config = WKWebViewConfiguration();
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.load(URLRequest(url: targetURL!))
        view.addSubview(webView)
    }
    
    override public func handle(_ url: URL) {
        targetURL = url
        super.handle(url)
    }
    
    public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        if let url = navigationAction.request.url, url.scheme == "oauth-swift" {
            decisionHandler(WKNavigationActionPolicy.cancel)
            OAuthSwift.handle(url: url)
            self.dismissWebViewController()
        } else {
            decisionHandler(WKNavigationActionPolicy.allow)
        }
        
    }
    
}
