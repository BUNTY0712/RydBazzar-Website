"use client"
import { useState } from "react"
import Image from "next/image"
import logo from "../../../src/assets/Image/vrm_transport.png"

// import { Step } from "../page"
import MobileStep from "./steps/MobileStep"
import OtpStep from "./steps/OtpStep"
import ResetStep from "./steps/ResetStep"
import SuccessStep from "./steps/SuccessStep"
import ProgressBar from "./ProgressBar"

export type Step = "mobile" | "otp" | "reset" | "success";
export default function LeftPanel({ step, setStep }: any) {
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const simulate = (next: Step) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(next)
    }, 1500)
  }

  const startResend = () => {
    setResendTimer(30)
    const t = setInterval(() => {
      setResendTimer((p) => {
        if (p <= 1) {
          clearInterval(t)
          return 0
        }
        return p - 1
      })
    }, 1000)
  }

  return (
    <div style={{
      flex:1,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      background:"#f8fafc"
    }}>
      <div style={{ width: "400px" }}>
        
        <Image src={logo} alt="logo" style={{ height: 40 }} />

        {step !== "success" && <ProgressBar step={step} />}

        {step === "mobile" && (
          <MobileStep
            mobile={mobile}
            setMobile={setMobile}
            loading={loading}
            onNext={() => {
              simulate("otp")
              startResend()
            }}
          />
        )}

        {step === "otp" && (
          <OtpStep
            mobile={mobile}
            otp={otp}
            setOtp={setOtp}
            resendTimer={resendTimer}
            loading={loading}
            onNext={() => simulate("reset")}
            onBack={() => setStep("mobile")}
          />
        )}

        {step === "reset" && (
          <ResetStep
            newPass={newPass}
            confirmPass={confirmPass}
            setNewPass={setNewPass}
            setConfirmPass={setConfirmPass}
            loading={loading}
            onNext={() => simulate("success")}
          />
        )}

        {step === "success" && <SuccessStep mobile={mobile} />}
      </div>
    </div>
  )
}