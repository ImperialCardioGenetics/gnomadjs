import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import throttle from "redux-throttle"

const logger = createLogger()

const defaultWait = 400
const defaultThrottleOption = { // https://lodash.com/docs#throttle
  leading: true,
  trailing: false,
}

const store = createStore(
  () => {},
  applyMiddleware(
    throttle(defaultWait, defaultThrottleOption),
    thunk,
    logger,
  ),
)

export default store
