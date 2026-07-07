export default function MobileStep({ mobile, setMobile, onNext, loading }: any) {
  return (
    <div>
      <h2>Forgot your password?</h2>

      <input
        type="tel"
        placeholder="9999999999"
        value={mobile}
        maxLength={10}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
      />

      <button disabled={mobile.length !== 10 || loading} onClick={onNext}>
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </div>
  )
}