export default function SuccessStep({ mobile }: any) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Password Reset Successful 🎉</h2>
      <p>+91 {mobile}</p>

      <button onClick={() => (window.location.href = "/login")}>
        Go to Login
      </button>
    </div>
  )
}