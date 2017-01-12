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
    var indicator: UIActivityIndicatorView!
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        let config = WKWebViewConfiguration();
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.load(URLRequest(url: targetURL!))
        
        indicator = UIActivityIndicatorView()
        indicator.hidesWhenStopped = true;
        indicator.center = view.center;
        indicator.activityIndicatorViewStyle = .gray
        
        view.addSubview(webView)
        view.addSubview(indicator)
        
        webView.addObserver(self, forKeyPath:  #keyPath(WKWebView.loading), options: .new, context: nil)
    }
    
    deinit {
        webView.removeObserver(self, forKeyPath: #keyPath(WKWebView.loading))
    }
    
    public override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        guard let keyPath = keyPath else { return }
        guard let change = change else { return }
        switch keyPath {
        case #keyPath(WKWebView.loading):
            let val = self.webView.isLoading
            UIApplication.shared.isNetworkActivityIndicatorVisible = val
            if val {
                indicator.startAnimating()
            } else {
                indicator.stopAnimating()
            }
            break;
            
            default:break
        }
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
