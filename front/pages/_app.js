import React from 'react';
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import withReduxSaga from 'next-redux-saga';
import Proptypes from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import reducer from '../reducers';
import rootSaga from '../sagas';
import AppLayout from '../components/AppLayout';
import { LOAD_USER_REQUEST } from '../reducers/user';

const NodeBird = ({ Component, store }) => {
    return (
        <>
            <Provider store={ store }>
                <Helmet
                    title="NodeBird"
                    htmlAttributes={{ lang: 'ko' }}
                    meta={[{
                        charSet: 'UTF-8',
                    }, {
                        name: 'viewport',
                        content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
                    }, {
                        name: 'description', content: 'Kihat의 NodeBird SNS',
                    }, {
                        name: 'og:title', content: 'NodeBird',
                    }, {
                        name: 'og:description', content: 'Kihat의 NodeBird SNS',
                    }, {
                        name: 'og:type', content: 'website',
                    }, {
                        name: 'og:image', content: 'http://localhost:3000/favicon.ico?1',
                    }]}
                    link={[{
                        rel: 'shortcut icon', href: 'http://localhost:3000/favicon.ico?1',
                    }, {
                        rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/4.1.5/antd.css',
                    }]}
                />
                <AppLayout>
                    <Component />
                </AppLayout>
            </Provider>
        </>
    );
}

NodeBird.getInitialProps = async (context) => {
    const { Component, ctx } = context;

    let pageProps = {};

    const state = ctx.store.getState();

    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';

    if (ctx.isServer && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    if (!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx) || {};
    }
    return { pageProps };
}

NodeBird.propTypes = {
    Component: Proptypes.elementType.isRequired,
}

const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
}

export default withRedux(configureStore)(withReduxSaga(NodeBird));