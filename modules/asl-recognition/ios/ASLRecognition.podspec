Pod::Spec.new do |s|
  s.name           = 'ASLRecognition'
  s.version        = '0.1.0'
  s.summary        = 'On-device ASL fingerspelling recognition (Vision + Core ML)'
  s.description    = 'Expo module for iOS: hand pose via Vision, classification via Core ML.'
  s.author         = 'SignSpeak'
  s.homepage       = 'https://github.com/signspeak/asl-learning-app'
  s.platforms      = { :ios => '14.0' }
  s.source         = { git: 'https://github.com/signspeak/asl-learning-app.git' }
  s.static_framework = true
  s.dependency       'ExpoModulesCore'
  s.frameworks      = 'Vision', 'CoreML', 'AVFoundation'
  s.source_files    = '**/*.{h,m,mm,swift}'
end
