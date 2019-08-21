import React from 'react';

import './NumericalInput.scss';

const NumericalInput = ({
    value,
    placeholder,
    onChange,
}) => {
    return (
        <div className='NumericalInput'>
            <input
                value={value}
                placeholder={placeholder}
                onChange={event => {
                    if(event.target.value === '') {
                        onChange('');
                    } else if(isNaN(event.target.value)) { // no change if user enters a non numerical char
                        onChange(value);
                    } else {
                        onChange(event.target.value);
                    }
                }}
            >
            </input>
        </div>
    );
};

export default NumericalInput;
