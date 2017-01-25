
package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Debug;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.ValueCallback;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;

public class RNSalesforceRestapiModule extends ReactContextBaseJavaModule implements ActivityEventListener{

  public static final String ACTIVITY_EXTRA_CALLBACK_URI = "extra_callback_uri";
  public static final int ACTIVITY_RESPONSE_CODE = 101;
  public static final int ACTIVITY_RESPONSE_CODE_CANCEL = 102;

  private static final int ACTIVITY_REQUEST_CODE = 100;

  private final ReactApplicationContext reactContext;
  private Promise tokenPromise = null;

  public RNSalesforceRestapiModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return "OAuthManager";
  }

  @ReactMethod
  public void loginUser(String uri, String callbackUri, Promise promise) {
    tokenPromise = promise;
    Intent intent = new Intent(this.reactContext, OAuthBrowserActivity.class);
    intent.setData(Uri.parse(uri));
    intent.putExtra(ACTIVITY_EXTRA_CALLBACK_URI, callbackUri);
    this.reactContext.startActivityForResult(intent, ACTIVITY_REQUEST_CODE, null);
  }
  @ReactMethod
  public void logout(final Promise promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      CookieManager.getInstance().removeAllCookies(new ValueCallback<Boolean>() {
        @Override
        public void onReceiveValue(Boolean value) {
          if (promise != null) {
            promise.resolve(value);
          }
        }
      });
    } else {
      CookieSyncManager cookieSyncMngr=CookieSyncManager.createInstance(this.reactContext);
      cookieSyncMngr.startSync();
      CookieManager cookieManager=CookieManager.getInstance();
      cookieManager.removeAllCookie();
      cookieManager.removeSessionCookie();
      cookieSyncMngr.stopSync();
      cookieSyncMngr.sync();
      promise.resolve(true);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    if (requestCode != ACTIVITY_REQUEST_CODE) {
      Log.d("OAuth onActivityResult", "Unknown request code " + String.valueOf(requestCode));
      return;
    }
    if (tokenPromise == null) {
      return;
    }

    if (resultCode != ACTIVITY_RESPONSE_CODE) {
      tokenPromise.reject(String.valueOf(resultCode), "Rejected");
    } else {
      tokenPromise.resolve(data.getData().toString());
    }
    tokenPromise = null;
  }
}