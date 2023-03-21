import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState, MyRouterType } from "../../utils/typings";
import { MyRouteObject } from "../../utils/constants";

const initialState: AppState = {
  openDraw: false,
  title: MyRouteObject.home.title,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeDraw: (state) => {
      state.openDraw = !state.openDraw;
    },
    changeTitle: (state, action: PayloadAction<MyRouterType>) => {
      state.title = action.payload.title;
    },
  },
});

export const { changeDraw, changeTitle } = appSlice.actions;

export default appSlice.reducer;
