import React from 'react';

import {Svgs} from '../constants';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export default class Icon extends React.PureComponent {
    render() {
        const style = getStyle();
        return (
            <span
                style={style.iconStyle}
                aria-hidden='true'
                dangerouslySetInnerHTML={{__html: Svgs.VIDEO_CAMERA}}
            />
        );
    }
}
const getStyle = makeStyleFromTheme(() => {
    return {
        iconStyle: {
            position: 'relative',
            top: '-1px'
        }
    };
});