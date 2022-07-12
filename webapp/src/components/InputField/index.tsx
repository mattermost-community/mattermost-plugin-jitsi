import React, {ReactNode} from 'react';

import {InputFieldType} from 'types';

type Props = {
    heading: ReactNode;
    tagType: string;
    type?: string;
    placeholder?: string;
    min?: number;
    rows?: number;
    defaultValue?: number;
    onChange: (e: React.ChangeEvent<InputFieldType>) => void;
    value: string | number;
    disabled?: boolean;
    description: ReactNode;
}

export const TextInput = ({heading, tagType, type, placeholder, min, rows, defaultValue, onChange, value, disabled, description}: Props) => {
    return (
        <>
            <div className='form-group'>
                <label className='col-sm-4'>
                    {heading}
                </label>
                <div className='col-sm-8'>
                    {tagType === 'input' ? (
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
                    ) : (
                        <textarea
                            className='form-control'
                            rows={rows}
                            onChange={onChange}
                            value={value}
                            disabled={disabled}
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
