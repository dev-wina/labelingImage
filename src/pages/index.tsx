import React from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import styled from 'styled-components'
import { PAGE_PATHS } from "~constant"
import AnnotatorHome from './AnnotatorHome'
import DatasetLabel from './DatasetLabel'

function RootRouter() {
    return (
        <SWapper>
            <BrowserRouter>
                <Switch>
                    <Route path={PAGE_PATHS.HOME} component={AnnotatorHome} exact />
                    <Route path={`${PAGE_PATHS.DATASET_LABEL}/:id`} component={DatasetLabel} exact />
                    <Redirect path="*" to={PAGE_PATHS.HOME} />
                </Switch>
            </BrowserRouter>
        </SWapper>
    )
}

export default RootRouter

const SWapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
`