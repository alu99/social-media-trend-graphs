import React from 'react';
import LineGraph from './LineGraph.jsx';
import TextInput from './TextInput.jsx';
import moment from 'moment';

import './RedditPage.scss';

class RedditPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            subredditInputValue: 'r/collegebasketball',
            keyword: 'maryland',
        }
        fetch('http://localhost:5000/api/reddit-authenticate');
    }

    onSubredditInputValueChange = event => this.setState({ subredditInputValue: event.target.value });

    onKeywordValueChange = event => this.setState({ keyword: event.target.value });

    onSubmitClicked = () => {
        console.log(JSON.stringify({
            keyword: this.state.keyword,
            subreddit: this.state.subredditInputValue,
        }))
        fetch('http://localhost:5000/api/get-reddit-search-data', {
            method: 'POST',
            body: JSON.stringify({
                keyword: this.state.keyword,
                subreddit: this.state.subredditInputValue,
            }),
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(searchDataPromise => {
            searchDataPromise.json().then(result => this.setState({ data: result }));
        })
    }

    render() {

        const {
            data,
            keyword,
            subredditInputValue,
        } = this.state;
        if (data.length > 0) {
            console.log(data)
            console.log(typeof data[0].timestamp)
            console.log(moment(data[0].timestamp).diff(data[1].timestamp, 'days'))
        }
        return (
            <div className='RedditPage'>
                <div className='title'>Trend Graph for Reddit</div>

                <div className='input-row'>
                    <span className='input-span'>
                        <div>Subreddit: </div>
                        <TextInput
                            value={subredditInputValue}
                            placeholder={'r/collegebasketball'}
                            onChange={this.onSubredditInputValueChange}
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
                    <button
                        type='button'
                        className='submit-button'
                        onClick={this.onSubmitClicked}>
                        Submit
                        </button>
                </div>
                {data.length > 0 &&
                    <LineGraph data={data} />
                }
            </div>
        )
    }
}

export default RedditPage;
