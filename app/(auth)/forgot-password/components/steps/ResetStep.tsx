export default function ResetStep({
  newPass,
  confirmPass,
  setNewPass,
  setConfirmPass,
  onNext,
  loading
}: any) {

  return (
    <div>
      <h2>Set New Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />

      <button
        disabled={!newPass || newPass !== confirmPass}
        onClick={onNext}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  )
}