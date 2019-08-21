import React from 'react';

import './GroupBySelector.scss';

const GroupBySelector = ({
    value,
    onChange,
}) => {
    return (
        <div className='GroupBySelector'>
            <select value={value} onChange={onChange}>
                <option value='days'>Days</option>
                <option value='weeks'>Weeks</option>
                <option value='months'>Months</option>
                <option value='years'>Years</option>
            </select>
        </div>
    );
};

export default GroupBySelector;