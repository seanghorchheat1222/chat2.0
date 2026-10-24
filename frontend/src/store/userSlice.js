import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: '',
  name: '',
  email: '',
  profile: {},
}

const userSlice = createSlice(
  {
    name: "user",
    initialState,
    reducers: {
      setUser: (state, action) => {
          state.id = action.payload.id
          state.name = action.payload.name
          state.email = action.payload.email,
          state.profile = action.payload.profile
      },

      clearUser: () => initialState
    }
  }
)

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;