
package com.reactlibrary;

import android.app.Activity;
import android.content.Intent;
import android.os.Debug;
import android.util.Log;

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
  public void loginUser(ReadableMap parameters, Promise promise) {
    ReadableMapKeySetIterator iterator = parameters.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      ReadableType type = parameters.getType(key);

      Log.d("Key", key);
      Log.d("Type", type.toString());
    }
    tokenPromise = promise;
    Intent intent = new Intent(this.reactContext, OAuthBrowserActivity.class);
    this.reactContext.startActivityForResult(intent, 554, null);
  }

  @Override
  public void onNewIntent(Intent intent) {
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    if (tokenPromise != null) {
      if (resultCode == 554) {
        tokenPromise.resolve(new String("Resolved"));
      } else {
        tokenPromise.reject(String.valueOf(resultCode), "Rejected");
      }
      tokenPromise = null;
    }
    Log.d("requestCode", String.valueOf(requestCode));
    Log.d("resultCode", String.valueOf(resultCode));
    //Log.d("data", data.toString());

  }
}