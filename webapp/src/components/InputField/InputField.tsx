import * as React from 'react';
import {FormattedMessage} from 'react-intl';

type Props = {
    heading: {
        id: string;
        message: string;
    };
    tagType: any;
    input: {
        type?: string;
        placeholder?: string;
        maxLength?: number;
        min?: number;
        rows?: number;
        defaultValue?: number;
        onChange: (e: any) => void;
        value: string | number;
        disabled?: boolean;
    };
    description: {
        id: string;
        message: string;
    }
}

export const InputField = (props: Props) => {
    console.log(props.input.defaultValue);
    console.log(props.tagType);
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
                    <props.tagType
                        className='form-control'
                        type={props.input.type}
                        placeholder={props.input.placeholder}
                        maxLength={props.input.maxLength}
                        onChange={props.input.onChange}
                        value={props.input.value}
                        disabled={props.input.disabled}
                        min={props.input.min}
                        defaultValue={props.input.defaultValue}
                        rows={props.input.rows}
                    />
                    <div className='help-text'>
                        <span>
                            <FormattedMessage
                                id={props.description.id}
                                defaultMessage={props.description.message}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};
