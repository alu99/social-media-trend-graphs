import React from 'react';
import LineGraph from './LineGraph.jsx';
import TextInput from './TextInput.jsx';
import GroupBySelector from './GroupBySelector.jsx';
import NumericalInput from './NumericalInput.jsx';
import { Link } from "react-router-dom";
import moment from 'moment';

import './RedditPage.scss';

class RedditPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            subreddit: '',
            keyword: '',
            groupBy: 'days',
            limit: 100,
            lastSearchedSubreddit: '',
            lastSearchedKeyword: '',
            lastSearchedLimit: '',
        }
        fetch('http://localhost:5000/api/reddit-authenticate');
    }

    onSubredditChange = event => this.setState({ subreddit: event.target.value });

    onKeywordValueChange = event => this.setState({ keyword: event.target.value });

    onLimitChange = newValue => this.setState({ limit: newValue });


    onSubmitClicked = () => {
        const {
            subreddit,
            keyword,
            limit,
        } = this.state;

        if(subreddit === '' || keyword === '') {
            alert('Invalid search criteria');
            return;
        }
        fetch('http://localhost:5000/api/get-reddit-search-data', {
            method: 'POST',
            body: JSON.stringify({
                keyword: keyword,
                subreddit: subreddit,
                limit: limit,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(searchDataPromise => {
            searchDataPromise.json().then(results => {
                const dataConvertedToMoment = results.map(datum => ({
                    ...datum,
                    timestamp: moment(datum.timestamp),
                }));
                this.setState({
                    data: dataConvertedToMoment,
                    lastSearchedSubreddit: subreddit,
                    lastSearchedKeyword: keyword,
                    lastSearchedLimit: limit.toString(),
                });
            });
        })
    }

    render() {

        const {
            data,
            keyword,
            subreddit,
            groupBy,
            limit,
            lastSearchedSubreddit,
            lastSearchedKeyword,
            lastSearchedLimit,
        } = this.state;

        return (
            <div className='RedditPage'>
                <div className='title'>Trend Graph for Reddit</div>
                <Link to="/" className='link'>Return Home</Link>
                <div className='input-row'>
                    <span className='input-span'>
                        <div>Subreddit: </div>
                        <TextInput
                            value={subreddit}
                            placeholder={'r/collegebasketball'}
                            onChange={this.onSubredditChange}
                        />
                    </span>
                    <span className='input-span'>
                        <div>Keyword: </div>
                        <TextInput
                            value={keyword}
                            placeholder={'Maryland'}
                            onChange={this.onKeywordValueChange}
                        />
                    </span>
                    <span className='input-span'>
                        <div>Results: </div>
                        <NumericalInput
                            value={limit}
                            placeholder={'Max of 100'}
                            onChange={this.onLimitChange}
                        />
                    </span>
                    <button
                        type='button'
                        className='submit-button'
                        onClick={this.onSubmitClicked}>
                        Submit
                        </button>
                </div>
                {data.length > 0 &&
                    <div className='graph-container'>
                        <GroupBySelector
                            value={groupBy}
                            onChange={event => this.setState({groupBy: event.target.value})}
                        />
                        <div className='graph-title'>
                            Occurences of "{lastSearchedKeyword}" in {lastSearchedSubreddit} over the last {lastSearchedLimit} results
                        </div>
                        <LineGraph
                            data={data}
                            width={1200}
                            height={550}
                            pointColor={'#FF5700'}
                            axisColor={'black'}
                            groupBy={groupBy}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default RedditPage;
