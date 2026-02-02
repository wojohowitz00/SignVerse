import ExpoModulesCore
import Vision
import CoreML
import AVFoundation

/// On-device ASL fingerspelling recognition using Vision (hand pose) and Core ML.
/// Full implementation in tasks 3.2.x (Vision) and 3.4.x (Core ML).
public class ASLRecognitionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ASLRecognitionModule")

    Function("isModelReady") { () -> Bool in
      // Stub: model loading in 3.4.1
      return false
    }

    AsyncFunction("startRecognition") { (_ config: [String: Any]?) in
      // Stub: camera + Vision pipeline in 3.2.x, 3.4.3
    }

    AsyncFunction("stopRecognition") {
      // Stub: session teardown in 3.4.3
    }

    Events("onSignRecognized", "onHandDetected", "onHandLost", "onTrainingProgress")
  }
}
