type Step = "mobile" | "otp" | "reset" | "success"

export default function RightPanel({ step }: { step: Step }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#0d1f33",
        color: "#fff",
        padding: 40,
      }}
    >
      <h2>Secure Recovery</h2>

      <ul>
        <li style={{ opacity: step === "mobile" ? 1 : 0.5 }}>
          Enter Mobile
        </li>
        <li style={{ opacity: step === "otp" ? 1 : 0.5 }}>
          Verify OTP
        </li>
        <li style={{ opacity: step === "reset" ? 1 : 0.5 }}>
          Reset Password
        </li>
      </ul>
    </div>
  )
}