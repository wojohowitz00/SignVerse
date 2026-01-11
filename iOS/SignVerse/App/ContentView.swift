import SwiftUI

struct ContentView: View {
    @StateObject private var consentManager = ConsentManager.shared

    var body: some View {
        if consentManager.hasRequiredConsent {
            MainAppView()
        } else {
            BiometricConsentView(
                understoodBiometric: $consentManager.understoodBiometric,
                consentTracking: $consentManager.trackingConsent,
                consentAnalytics: $consentManager.analyticsConsent,
                onConsent: { consentManager.grantConsent() }
            )
        }
    }
}

struct MainAppView: View {
    var body: some View {
        VStack {
            Text("SignVerse")
                .font(.largeTitle)
            Text("Consent granted - App ready")
                .foregroundColor(.green)
        }
    }
}

#Preview {
    ContentView()
}
