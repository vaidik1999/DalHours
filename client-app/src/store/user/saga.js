import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '../../config/Axios';
import * as actionTypes from './actionTypes';

const {takeLatest, all, put} = require('redux-saga/effects');

function* getUserInfoSaga() {
  try {
    yield put({type: actionTypes.SET_USER_INFO_LOADING});
    const {data} = yield AxiosInstance.get('/user');
    if (data?.data?.role) {
      yield put({
        type: actionTypes.GET_USER_INFO_SUCCESS,
        payload: data.data,
        role: data.data.role,
      });
    } else {
      yield put({
        type: actionTypes.GET_USER_INFO_FAIL,
        error: data.message,
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.GET_USER_INFO_FAIL,
      error: 'Something went wrong',
    });
  }
}

function* logoutUserSaga() {
  try {
    yield AsyncStorage.clear();
    yield put({type: actionTypes.LOGOUT_USER_SUCCESS});
  } catch (error) {
    yield put({type: actionTypes.LOGOUT_USER_FAIL});
  }
}

function* userSaga() {
  yield all([
    yield takeLatest(actionTypes.GET_USER_INFO, getUserInfoSaga),
    yield takeLatest(actionTypes.LOGOUT_USER, logoutUserSaga),
  ]);
}

export default userSaga;
