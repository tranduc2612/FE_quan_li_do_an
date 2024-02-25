import { ThunkAction, configureStore,Action } from "@reduxjs/toolkit";
import countReducer from "./slices/counterSlice";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./sagaRoot";
import authReducer, { refreshToken } from "./slices/authSlice";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer:{
    count: countReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
})

// then run the saga
sagaMiddleware.run(rootSaga);

var refresh_token = String(localStorage.getItem('refresh_token'));

if(refresh_token){
    store.dispatch(refreshToken(refresh_token));
}

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>