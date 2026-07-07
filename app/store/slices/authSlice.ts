import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  token: string | null
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthState["user"] }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isAuthenticated = true
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token!)
      }
    },
    clearCredentials: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer