import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './reducers/store';
import JaaSConference from './components/conference';

function JaaSRoot() {
    return (<JaaSConference/>);
}

export class InjectionProvider extends React.Component<any> {
    public render(): JSX.Element {
        const stores = {...this.props};
        delete stores.children;
        return React.createElement(Provider as any, stores, this.props.children);
    }
}

ReactDOM.render(<InjectionProvider store={store}>
    <JaaSRoot/>
</InjectionProvider>, document.getElementById('jaas-root'));
