Pod::Spec.new do |s|
  s.name          = "react-native-salesforce-oauth"
  s.version       = "0.1.0"
  s.source_files  = "ios/RNSFOAuth/RNSFOAuth/*.{h,m,swift}", "ios/RNSFOAuth/RNSFOAuth/OAuthSwift/*.{h,m,swift}"
  s.platform      = :ios, "8.0"
  s.authors       = { "Yuriy Sannikov" => "yury.sannikov@gmail.com" }
  s.license       = "MIT"
  s.summary       = "react-native Salesforce OAuth login component."
  s.homepage      = "https://github.com/yury-sannikov/react-native-salesforce-oauth"
  s.source        = { :git => "https://github.com/yury-sannikov/react-native-salesforce-oauth.git" }

  s.dependency 'React'
end
