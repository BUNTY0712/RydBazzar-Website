export default function OtpStep({
  mobile,
  otp,
  setOtp,
  onNext,
  onBack,
  resendTimer,
  loading
}: any) {

  const handleChange = (i: number, v: string) => {
    const newOtp = [...otp]
    newOtp[i] = v
    setOtp(newOtp)
  }

  return (
    <div>
      <h2>Verify OTP</h2>
      <p>+91 {mobile}</p>

      <div style={{ display: "flex", gap: 10 }}>
        {otp.map((d: string, i: number) => (
          <input
            key={i}
            value={d}
            maxLength={1}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
      </div>

      <button disabled={otp.join("").length !== 6} onClick={onNext}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button onClick={onBack}>Change</button>

      <p>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}</p>
    </div>
  )
}