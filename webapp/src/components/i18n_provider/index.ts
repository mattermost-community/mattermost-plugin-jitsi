import {connect} from 'react-redux';

import {getCurrentUserLocale} from 'mattermost-redux/selectors/entities/i18n';
import {GlobalState} from 'mattermost-redux/types/store';

import {I18nProvider} from './i18n_provider';

function mapStateToProps(state: GlobalState) {
    return {
        currentLocale: getCurrentUserLocale(state)
    };
}

export default connect(mapStateToProps)(I18nProvider);
