export default function ProgressBar({ step }: any) {
  const steps = ["mobile", "otp", "reset"]
  const index = steps.indexOf(step)

  return (
    <div style={{ display: "flex", margin: "20px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          flex: 1,
          height: 4,
          marginRight: 5,
          background: i <= index ? "#0ea5d4" : "#ddd"
        }} />
      ))}
    </div>
  )
}