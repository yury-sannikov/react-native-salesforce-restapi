# react-native-salesforce-restapi

Simple react-native REST API implementation with Salesforce OAuth2 login/refresh token functionality.

## Getting started

`$ npm install react-native-salesforce-restapi --save`

### Mostly automatic installation

`$ react-native link react-native-salesforce-restapi`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-salesforce-restapi` and add `RNSalesforceRestapi.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNSalesforceRestapi.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### iOS Cocoapods

1. Add `pod 'react-native-salesforce-restapi', path: '../node_modules/react-native-salesforce-restapi'` to your Podfile
2. Do `pod install`

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSalesforceRestapiPackage;` to the imports at the top of the file
  - Add `new RNSalesforceRestapiPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-salesforce-restapi'
  	project(':react-native-salesforce-restapi').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-salesforce-restapi/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-salesforce-restapi')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNSalesforceRestapi.sln` in `node_modules/react-native-salesforce-restapi/windows/RNSalesforceRestapi.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Cl.Json.RNSalesforceRestapi;` to the usings at the top of the file
  - Add `new RNSalesforceRestapiPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage

```javascript
import SalesforceRestApi from 'react-native-salesforce-restapi'

const SALESFORCE_OAUTH_OPTIONS = {
  consumerKey:    'xxxx',
  consumerSecret: 'xxx',
  authorizeUrl:   'https://login.salesforce.com/services/oauth2/authorize',
  accessTokenUrl: 'https://login.salesforce.com/services/oauth2/token',
  responseType:   'code',
  namespace:      'your package namespace'
}

export class DataRequest {
    static submit(data, action) {
        return SalesforceOAuth.ApiRequest.post(SALESFORCE_OAUTH_OPTIONS, '/endpoint', {data})
    }
}

```
