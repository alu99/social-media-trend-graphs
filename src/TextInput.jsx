import React from 'react';

import './TextInput.scss';

const TextInput = ({
    value,
    placeholder,
    onChange,
}) => {
    return (
        <div className='TextInput'>
            <input
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            >
            </input>
        </div>
    );
};

export default TextInput;
