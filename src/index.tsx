import "regenerator-runtime/runtime"
import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import {Provider} from "react-redux"
import {applyMiddleware, createStore} from "redux"
import rootReducer, { rootSaga } from "~modules"
import createSagaMiddleware from 'redux-saga'
import GlobalStyle from "~styles/global-styles"
import { ThemeProvider } from "~styles/themed-components"
import theme from "~styles/themes"
import { createBrowserHistory } from "history"

const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

ReactDOM.render(
    <>
        <Provider store={store}>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                <App history={history} />
            </ThemeProvider>
        </Provider>
    </>,
    document.getElementById("root")
)
