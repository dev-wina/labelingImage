import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { PAGE_PATHS } from "~constant"
import AnnotatorHome from './AnnotatorHome'
import DatasetLabel from './DatasetLabel'

function RootRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={PAGE_PATHS.HOME} component={AnnotatorHome} exact />
                <Route path={`${PAGE_PATHS.DATASET_LABEL}/:id`} component={DatasetLabel} exact />
                <Redirect path="*" to={PAGE_PATHS.HOME} />
            </Switch>
        </BrowserRouter>
    )
}

export default RootRouter