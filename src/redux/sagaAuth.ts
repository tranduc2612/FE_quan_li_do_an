import { PayloadAction } from '@reduxjs/toolkit';
import { call, fork, put, take } from 'redux-saga/effects';
import { ILoginPayload, login, loginFailed, loginSucces, logout } from './slices/authSlice';
import axios, { AxiosResponse } from 'axios'; // Import AxiosResponse
import { IUser } from '~/types/IUser';
import { BASE_URL } from '~/ultis/contants';
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* logger(action: PayloadAction) {
  console.log('log_saga', action);
}

const fetchApiAuth = async (payload: ILoginPayload): Promise<AxiosResponse> => {
  const response = await axios.post(BASE_URL+'Auth/login', { ...payload });
  return response;
};

function* handleLogin(payload: ILoginPayload) {
  try {
    const response: AxiosResponse = yield call(fetchApiAuth, payload);
    const dataRes = response.data;
    if(dataRes){
      if(!dataRes?.success){
        yield put(loginFailed({
          ...dataRes?.returnObj
        }));
      }else{
        const dataUser: IUser = {
          ...dataRes?.returnObj
        };
        yield put(loginSucces(dataUser));
        if(dataUser.token){
            localStorage.setItem('access_token',dataUser.token)
        }
        if(dataUser.refreshToken){
          localStorage.setItem('refresh_token',dataUser.refreshToken)
      }
      }
    }else{

      yield put(loginFailed({
        typeError: "System",
        messageError: dataRes.message
      }));
    }
  } catch (error: any) {

    // Handle error if needed
    yield put(loginFailed({
      typeError: "Error",
      messageError: error.message
    }));

    console.error('Error in handleLogin:', error);
  }
}

function* handleLogout() {
  console.log('handle_logout');
  localStorage.removeItem('access_token');
  yield put(logout())
}

function* watchFlow() {
  while (true) {
    const isLogin = Boolean(localStorage.getItem('access_token'));
    console.log(isLogin)
    if (!isLogin) {
      const action: PayloadAction<ILoginPayload> = yield take(login.type);
      yield call(handleLogin, action.payload);
      continue
    }

    yield take(logout.type);
    yield call(handleLogout);
  }
}

function* authSaga() {
  //   yield takeEvery('*', logger)
  yield fork(watchFlow);
}

export default authSaga;
