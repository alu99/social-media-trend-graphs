from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

#fill in with own info
REDDIT_USERNAME = ''
REDDIT_PASSWORD = ''
REDDIT_APP_ID = ''
REDDIT_SECRET = ''
REDDIT_APP_NAME = ''

reddit_access_token = ''
reddit_base_url = 'https://www.reddit.com'
reddit_oauth_url = 'https://oauth.reddit.com'


# retrieves reddit access token
@app.route('/api/reddit-authenticate')
def authenticate():
	post_data = {'grant_type': 'password', 'username': REDDIT_USERNAME, 'password': REDDIT_PASSWORD}
	client_auth = requests.auth.HTTPBasicAuth(REDDIT_APP_ID, REDDIT_SECRET)
	headers = {'User-Agent': REDDIT_APP_NAME + ' by ' + REDDIT_USERNAME}
	response = requests.post(reddit_base_url + "/api/v1/access_token", auth=client_auth, data=post_data, headers=headers)
	response_json = response.json()
	access_token = response_json['access_token']
	reddit_access_token = access_token
	return 'success'

@app.route('/api/get-reddit-search-data', methods=[ 'POST' ])
def reddit_occurences():
	parameters = request.get_json()
	subreddit = parameters['subreddit']
	keyword = parameters['keyword']
	limit = parameters['limit']

	if (subreddit == '') | (keyword == ''):
		return jsonify([])
	
	headers = {"Authorization": "bearer " + reddit_access_token, "User-Agent": "reddit-trend-graphs by bermudanvegetable"}
	params = {
		'q': keyword,
		'limit': limit,
		'sort': 'new',
		'restrict_sr': True,
		'type': 'link'
	}
	response = requests.get(reddit_oauth_url + '/' + subreddit + '/search', headers=headers, params=params)
	response_html = response.text

	soup = BeautifulSoup(response_html, 'html.parser')
	search_results = soup.find_all('div', attrs={'class': 'search-result'})
	data = []

	for result in search_results:
		result_data = {}

		result_link = reddit_base_url + result.find('a')['href']
		search_result_meta = result.find('div', attrs={'class': 'search-result-meta'})
		timestamp = search_result_meta.find('time')['datetime']
		
		#points comes in form '123 points'. need to trim off 'points' to obtain numerical value
		#implement later?
		# points_string = search_result_meta.find('span', attrs={'class': 'search-score'}).text.strip()
		# points_index = points_string.index(' points')
		# points = points_string[:points_index]

		result_data['link'] = result_link
		result_data['timestamp'] = timestamp

		data.append(result_data)
	
	return jsonify(data)

if __name__ == '__main__':
	app.run()
