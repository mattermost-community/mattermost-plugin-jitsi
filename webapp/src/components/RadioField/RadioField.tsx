import * as React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    heading: {
        id: string;
        message: string;
    };
    divClass?: string;
    labelClass?: string;
    options: {
        value: string;
        checked: boolean;
        id?: string;
        message?: string;
    }[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    description: {
        id: string;
        message: string;
    }
}

export const RadioField = (props: Props) => {
    return (
        <>
            <div className='form-group'>
                <label className='col-sm-4'>
                    <FormattedMessage
                        id={props.heading.id}
                        defaultMessage={props.heading.message}
                    />
                </label>
                <div className='col-sm-8'>
                    <>
                        <div className={`${props.divClass}`}>
                            {props.options.map((option) => (
                                <>
                                    <label className={`pt-0 ${props.labelClass}`}>
                                        <input
                                            key={option.value}
                                            type='radio'
                                            value={option.value}
                                            checked={option.checked}
                                            onChange={props.onChange}
                                        />
                                        {option.value === 'true' || option.value === 'false' ?
                                            <span>{option.value}</span> :
                                            <FormattedMessage
                                                id={option.id}
                                                defaultMessage={option.message}
                                            />}
                                    </label>
                                </>
                            ))}
                        </div>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id={props.description.id}
                                    defaultMessage={props.description.message}
                                />
                            </span>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

RadioField.defaultProps = {
    divClass: '',
    labelClass: ''
};
