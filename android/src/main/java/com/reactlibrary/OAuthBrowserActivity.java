package com.reactlibrary;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;

public class OAuthBrowserActivity extends AppCompatActivity {

    private WebView webView = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_oauth_browser);

        Intent intent = getIntent();
        Uri loginUri = intent.getData();
        final String callbackUri = intent.getStringExtra(RNSalesforceRestapiModule.ACTIVITY_EXTRA_CALLBACK_URI);

        webView = (WebView) findViewById(R.id.loginWebView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.contains(callbackUri)) {
                    Intent resultIntent = new Intent();
                    resultIntent.setData(Uri.parse(url));
                    setResult(RNSalesforceRestapiModule.ACTIVITY_RESPONSE_CODE, resultIntent);
                    finish();
                    return false;
                }
                return super.shouldOverrideUrlLoading(view, url);
            }
        });
        webView.loadUrl(loginUri.toString());
    }

    @Override
    public void onBackPressed() {
        setResult(RNSalesforceRestapiModule.ACTIVITY_RESPONSE_CODE_CANCEL);
        finish();
    }
}
