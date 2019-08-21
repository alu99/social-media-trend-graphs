import React from 'react';
import { Link } from "react-router-dom";

import './Landing.scss';

const Landing = () => {
    return (
        <div className='Landing'>
            <div className='title'>Social Media Trend Graphs</div>
            <div className='link-box'>
                <Link to="/reddit" className='link'>Reddit</Link>
                <div className='description'>A graph that displays the number of Reddit posts that have a keyword in the title or comments</div>
            </div>
        </div>
    );
};

export default Landing;
