import Foundation
import Combine

/// Manages user consent state for biometric authentication, tracking, and analytics.
/// Persists consent state to UserDefaults and provides SwiftUI integration via ObservableObject.
final class ConsentManager: ObservableObject {
    // MARK: - Singleton
    static let shared = ConsentManager()

    // MARK: - Published Properties
    @Published var understoodBiometric: Bool {
        didSet {
            saveToUserDefaults()
        }
    }

    @Published var trackingConsent: Bool {
        didSet {
            saveToUserDefaults()
        }
    }

    @Published var analyticsConsent: Bool {
        didSet {
            saveToUserDefaults()
        }
    }

    @Published var consentDate: Date? {
        didSet {
            saveToUserDefaults()
        }
    }

    @Published var consentVersion: String {
        didSet {
            saveToUserDefaults()
        }
    }

    // MARK: - UserDefaults Keys
    private enum UserDefaultsKey {
        static let understoodBiometric = "signverse.consent.understoodBiometric"
        static let trackingConsent = "signverse.consent.trackingConsent"
        static let analyticsConsent = "signverse.consent.analyticsConsent"
        static let consentDate = "signverse.consent.consentDate"
        static let consentVersion = "signverse.consent.consentVersion"
    }

    // MARK: - Initialization
    private init() {
        self.understoodBiometric = UserDefaults.standard.bool(forKey: UserDefaultsKey.understoodBiometric)
        self.trackingConsent = UserDefaults.standard.bool(forKey: UserDefaultsKey.trackingConsent)
        self.analyticsConsent = UserDefaults.standard.bool(forKey: UserDefaultsKey.analyticsConsent)

        if let consentDateData = UserDefaults.standard.data(forKey: UserDefaultsKey.consentDate),
           let decodedDate = try? JSONDecoder().decode(Date.self, from: consentDateData) {
            self.consentDate = decodedDate
        } else {
            self.consentDate = nil
        }

        self.consentVersion = UserDefaults.standard.string(forKey: UserDefaultsKey.consentVersion) ?? "1.0"
    }

    // MARK: - Computed Properties
    /// Returns true only if both required consents (biometric understanding and tracking) are granted.
    var hasRequiredConsent: Bool {
        understoodBiometric && trackingConsent
    }

    // MARK: - Public Methods
    /// Grants all consents by saving the current state with the current date and version.
    func grantConsent() {
        consentDate = Date()
        consentVersion = "1.0"
        saveToUserDefaults()
    }

    /// Revokes all consents by clearing all stored consent state.
    /// Users can re-consent by granting again.
    func revokeConsent() {
        understoodBiometric = false
        trackingConsent = false
        analyticsConsent = false
        consentDate = nil
        consentVersion = "1.0"
        saveToUserDefaults()
    }

    /// Exports the current consent record as a JSON string.
    /// - Returns: A JSON string representation of the current consent state.
    func exportConsentRecord() -> String {
        let record: [String: Any] = [
            "understoodBiometric": understoodBiometric,
            "trackingConsent": trackingConsent,
            "analyticsConsent": analyticsConsent,
            "consentDate": consentDate?.ISO8601Format() ?? NSNull(),
            "consentVersion": consentVersion,
            "exportedAt": Date().ISO8601Format()
        ]

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: record, options: .prettyPrinted)
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                return jsonString
            }
        } catch {
            return "{\"error\": \"Failed to serialize consent record\"}"
        }

        return "{\"error\": \"Failed to export consent record\"}"
    }

    // MARK: - Private Methods
    /// Persists the current consent state to UserDefaults.
    private func saveToUserDefaults() {
        UserDefaults.standard.set(understoodBiometric, forKey: UserDefaultsKey.understoodBiometric)
        UserDefaults.standard.set(trackingConsent, forKey: UserDefaultsKey.trackingConsent)
        UserDefaults.standard.set(analyticsConsent, forKey: UserDefaultsKey.analyticsConsent)
        UserDefaults.standard.set(consentVersion, forKey: UserDefaultsKey.consentVersion)

        if let consentDate = consentDate {
            do {
                let encodedDate = try JSONEncoder().encode(consentDate)
                UserDefaults.standard.set(encodedDate, forKey: UserDefaultsKey.consentDate)
            } catch {
                UserDefaults.standard.removeObject(forKey: UserDefaultsKey.consentDate)
            }
        } else {
            UserDefaults.standard.removeObject(forKey: UserDefaultsKey.consentDate)
        }
    }
}
