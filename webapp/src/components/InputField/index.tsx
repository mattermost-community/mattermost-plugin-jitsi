import * as React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    heading: {
        id: string;
        message: string;
    };
    tagType: string;
    input: {
        type?: string;
        placeholder?: string;
        maxLength?: number;
        min?: number;
        rows?: number;
        defaultValue?: number;
        onChange: (e: React.ChangeEvent<any>) => void;
        value: string | number;
        disabled?: boolean;
    };
    description: {
        id: string;
        message: string;
    }
}

export const InputField = ({heading, tagType, input, description}: Props) => {
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
                    {tagType === 'input' ? (
                        <input
                            className='form-control'
                            type={input.type}
                            placeholder={input.placeholder}
                            maxLength={input.maxLength}
                            onChange={input.onChange}
                            value={input.value}
                            disabled={input.disabled}
                            min={input.min}
                            defaultValue={input.defaultValue}
                        />
                    ) : (
                        <textarea
                            className='form-control'
                            maxLength={input.maxLength}
                            rows={input.rows}
                            onChange={input.onChange}
                            value={input.value}
                            disabled={input.disabled}
                        />
                    )}
                    <div className='help-text'>
                        <span>
                            <FormattedMessage
                                id={description.id}
                                defaultMessage={description.message}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
