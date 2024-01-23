import { all } from "redux-saga/effects";
import authSaga from "./sagaAuth";

export default function* rootSaga(){
    console.log("root_saga");
    yield all([authSaga()])
}