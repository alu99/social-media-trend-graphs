# social-media-trend-graphs
Counts keywords mentioned on various social media sites and graphs them as a function of time. React, Webpack, Flask. 

### Technical Info
* Front-end hosted by webpack dev server on `localhost:8080`
* Back-end Flask server on `localhost:5000`
* Flask endpoints hit the social media site's API to search for keyword. Returns data to front end.
* Graphs implemented using `HTML Canvas` (for drawing graph components) and `d3-scale` (for sizing and positioning data points and graph components relative to the canvas)
* Planning on adding tooltips that appear when hovering over data points that give more info about the occurences of that time period
* Planning on configuring Flask and webpack for production mode and hosting site on Github pages
* Currently only have trend graphs for Reddit. Trend graphs for other social media platforms coming soon!

### Trend Graphs for Reddit
* In this example, we search for the keyword "Maryland" (go terps!) in the subreddit "r/collegebasketball"
* We can group the data points by days, weeks, months, or years to improve the readability of the data
* Reddit API only allows us to query the past 100 posts. Because of this, most keywords will only yield a graph covering the recent past instead of all time

* Grouped by days:
![image](https://user-images.githubusercontent.com/13570258/63402679-44f0d000-c3aa-11e9-925f-43819cba314e.png)

* Grouped by weeks (this is the most readable option). As you can see, the number of posts containing "Maryland" spiked in mid-March when they played Belmont and LSU in the NCAA tournament:
![image](https://user-images.githubusercontent.com/13570258/63402940-4078e700-c3ab-11e9-88f3-8d46e5136952.png)

* Grouped by months:
![image](https://user-images.githubusercontent.com/13570258/63402971-57b7d480-c3ab-11e9-9856-832a89fb7b3e.png)

* Grouped by years (as you can see, this is not very helpful for this particular search):
![image](https://user-images.githubusercontent.com/13570258/63402929-1f17fb00-c3ab-11e9-8f5c-2ebd28169663.png)





