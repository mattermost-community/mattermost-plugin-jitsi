import React, {ReactNode} from 'react';

import {InputFieldType, Types} from 'types';

type Props = {
    heading: string | ReactNode;
    type: Types;
    placeholder?: string;
    min?: number;
    rows?: number;
    defaultValue?: number | string;
    onChange: (e: React.ChangeEvent<InputFieldType>) => void;
    value: string | number;
    disabled?: boolean;
    description: string | ReactNode;
}

export const TextInput = ({heading, type, placeholder, min, rows, defaultValue, onChange, value, disabled, description}: Props) => {
    return (
        <>
            <div className='form-group'>
                <label className='col-sm-4'>
                    {heading}
                </label>
                <div className='col-sm-8'>
                    {type === Types.textArea ? (
                        <textarea
                            className='form-control'
                            rows={rows}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
                        />
                    ) : (
                        <input
                            className='form-control'
                            type={type}
                            placeholder={placeholder}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
                            min={min}
                            defaultValue={defaultValue}
                        />
                    )}
                    <div className='help-text'>
                        <span>
                            {description}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
