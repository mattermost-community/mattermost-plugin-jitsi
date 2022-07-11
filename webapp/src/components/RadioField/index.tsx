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

export const RadioField = ({heading, divClass, labelClass, options, onChange, description}: Props) => {
    return (
        <>
            <div className='form-group'>
                <label className='col-sm-4'>
                    <FormattedMessage
                        id={heading.id}
                        defaultMessage={heading.message}
                    />
                </label>
                <div className='col-sm-8'>
                    <>
                        <div className={`${divClass}`}>
                            {options.map((option) => (
                                <>
                                    <label className={`pt-0 ${labelClass}`}>
                                        <input
                                            key={option.value}
                                            type='radio'
                                            value={option.value}
                                            checked={option.checked}
                                            onChange={onChange}
                                        />
                                        <FormattedMessage
                                            id={option.id}
                                            defaultMessage={option.message}
                                        />
                                    </label>
                                </>
                            ))}
                        </div>
                        <div className='help-text'>
                            <span>
                                <FormattedMessage
                                    id={description.id}
                                    defaultMessage={description.message}
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
