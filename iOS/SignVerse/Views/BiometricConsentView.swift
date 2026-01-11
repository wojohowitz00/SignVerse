import SwiftUI

struct BiometricConsentView: View {
    @Binding var understoodBiometric: Bool
    @Binding var consentTracking: Bool
    @Binding var consentAnalytics: Bool
    var onConsent: () -> Void

    var body: some View {
        ZStack {
            Color(.systemBackground)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 12) {
                        Image(systemName: "hand.raised.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.blue)

                        Text("Important Privacy Information")
                            .font(.system(size: 28, weight: .bold, design: .default))
                            .multilineTextAlignment(.center)
                    }
                    .padding(.vertical, 24)

                    // Main explanation
                    VStack(spacing: 16) {
                        Text("SignVerse uses hand tracking to help you learn American Sign Language (ASL). Understanding how this works is important for your privacy.")
                            .font(.system(size: 16, weight: .regular, design: .default))
                            .lineSpacing(2)

                        VStack(spacing: 12) {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: "exclamationmark.circle.fill")
                                    .font(.system(size: 16))
                                    .foregroundColor(.orange)
                                    .padding(.top, 2)

                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Hand Movement is Biometric Data")
                                        .font(.system(size: 15, weight: .semibold, design: .default))

                                    Text("Like fingerprints, your hand movement patterns are unique biometric identifiers. They can be used to recognize who you are.")
                                        .font(.system(size: 14, weight: .regular, design: .default))
                                        .foregroundColor(.secondary)
                                }
                            }
                            .padding(12)
                            .background(Color.orange.opacity(0.1))
                            .cornerRadius(8)
                        }
                    }
                    .padding(.horizontal, 16)

                    Divider()
                        .padding(.vertical, 8)

                    // What we DO section
                    VStack(alignment: .leading, spacing: 14) {
                        HStack(spacing: 8) {
                            Image(systemName: "shield.fill")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.green)

                            Text("What We DO")
                                .font(.system(size: 16, weight: .semibold, design: .default))
                        }

                        VStack(alignment: .leading, spacing: 12) {
                            PrivacyFeatureRow(
                                icon: "checkmark.circle.fill",
                                iconColor: .green,
                                title: "Process hand tracking on your device only",
                                description: "All analysis happens locally, never sent to servers"
                            )

                            PrivacyFeatureRow(
                                icon: "checkmark.circle.fill",
                                iconColor: .green,
                                title: "Never upload video or images",
                                description: "Raw camera data never leaves your device"
                            )

                            PrivacyFeatureRow(
                                icon: "checkmark.circle.fill",
                                iconColor: .green,
                                title: "Add noise to shared data",
                                description: "Differential privacy protects your identity if you choose to share"
                            )

                            PrivacyFeatureRow(
                                icon: "checkmark.circle.fill",
                                iconColor: .green,
                                title: "Let you delete all data anytime",
                                description: "Complete control over your information"
                            )
                        }
                    }
                    .padding(16)
                    .background(Color.green.opacity(0.05))
                    .cornerRadius(12)
                    .padding(.horizontal, 16)

                    // What we DON'T do section
                    VStack(alignment: .leading, spacing: 14) {
                        HStack(spacing: 8) {
                            Image(systemName: "hand.thumbsup.fill")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.red)

                            Text("What We DON'T Do")
                                .font(.system(size: 16, weight: .semibold, design: .default))
                        }

                        VStack(alignment: .leading, spacing: 12) {
                            PrivacyFeatureRow(
                                icon: "xmark.circle.fill",
                                iconColor: .red,
                                title: "Never share raw hand coordinates",
                                description: "Your exact movement data stays private"
                            )

                            PrivacyFeatureRow(
                                icon: "xmark.circle.fill",
                                iconColor: .red,
                                title: "Never sell or share biometric data",
                                description: "Your hand patterns are never sold or transferred"
                            )

                            PrivacyFeatureRow(
                                icon: "xmark.circle.fill",
                                iconColor: .red,
                                title: "Never use data for identification",
                                description: "We won't identify or track you across apps"
                            )
                        }
                    }
                    .padding(16)
                    .background(Color.red.opacity(0.05))
                    .cornerRadius(12)
                    .padding(.horizontal, 16)

                    Divider()
                        .padding(.vertical, 8)

                    // Consent toggles
                    VStack(spacing: 16) {
                        ConsentToggleRow(
                            icon: "checkmark.circle.fill",
                            iconColor: .blue,
                            title: "I understand this is biometric data",
                            subtitle: "Required to continue",
                            isRequired: true,
                            isOn: $understoodBiometric
                        )

                        ConsentToggleRow(
                            icon: "checkmark.circle.fill",
                            iconColor: .blue,
                            title: "I consent to on-device hand tracking",
                            subtitle: "Required to use SignVerse",
                            isRequired: true,
                            isOn: $consentTracking
                        )

                        ConsentToggleRow(
                            icon: "chart.bar.fill",
                            iconColor: .purple,
                            title: "I consent to sharing anonymized learning progress",
                            subtitle: "Optional - helps improve SignVerse",
                            isRequired: false,
                            isOn: $consentAnalytics
                        )
                    }
                    .padding(.horizontal, 16)

                    // Continue button
                    Button(action: onConsent) {
                        Text("Continue")
                            .font(.system(size: 16, weight: .semibold))
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .foregroundColor(.white)
                            .background(
                                understoodBiometric && consentTracking ?
                                Color.blue : Color.gray
                            )
                            .cornerRadius(12)
                    }
                    .disabled(!(understoodBiometric && consentTracking))
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 24)
                }
                .padding(.vertical, 16)
            }
        }
    }
}

// MARK: - Helper Components

struct PrivacyFeatureRow: View {
    let icon: String
    let iconColor: Color
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(iconColor)
                .padding(.top, 2)
                .frame(width: 20)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 14, weight: .semibold, design: .default))

                Text(description)
                    .font(.system(size: 13, weight: .regular, design: .default))
                    .foregroundColor(.secondary)
                    .lineSpacing(0.5)
            }

            Spacer()
        }
    }
}

struct ConsentToggleRow: View {
    let icon: String
    let iconColor: Color
    let title: String
    let subtitle: String
    let isRequired: Bool
    @Binding var isOn: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    Text(title)
                        .font(.system(size: 15, weight: .semibold, design: .default))

                    if isRequired {
                        Text("*")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.red)
                    }
                }

                Text(subtitle)
                    .font(.system(size: 13, weight: .regular, design: .default))
                    .foregroundColor(.secondary)
            }

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
        }
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(10)
    }
}

// MARK: - Preview

#Preview {
    @Previewable @State var understoodBiometric = false
    @Previewable @State var consentTracking = false
    @Previewable @State var consentAnalytics = false

    BiometricConsentView(
        understoodBiometric: $understoodBiometric,
        consentTracking: $consentTracking,
        consentAnalytics: $consentAnalytics,
        onConsent: {
            print("User consented to biometric data handling")
        }
    )
}
