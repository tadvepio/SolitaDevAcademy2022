# SolitaDevAcademy2022
The pre-assignment for Solita Dev Academy 2022

Live url: https://bikejourney-client.herokuapp.com/
The Api is on a separate address and is probably sleeping, so when you go to the site, wait a few moments for the api to start and refresh the page.

<h1>Introduction</h1>

This project is a preassingment for Solita Devacademy fall 2022. The assingment can be found at https://github.com/solita/dev-academy-2022-fall-exercise.

<h2>What was done</h2>

<h3>Data</h3>
<ul>
<li>Import data from the CSV files to a database -> Done</li>
<li>Validate data -> Done</li>
<li>Don't import journeys that lasted for less than ten seconds -> Done</li>
<li>Don't import journeys that covered distances shorter than 10 meters -> Done</li>
</ul>
<h3>Journey list</h3>
![journeylist](https://user-images.githubusercontent.com/32989919/183706362-7c8a2791-fa8c-4ed9-b98d-cecce20499c5.png)

By default, the application finds all journeys from the database, paginating 20 journeys per page.
Searching includes departure/return stations, min/max distance/duration and ordering. The station name field suggests
stations that already exists and the user can only input ones that do exist.

<ul>
  <li>List journeys -> Done</li>
  <li>For each journey show departure and return stations, covered distance in kilometers and duration in minutes -> Done</li>
  <li>Pagination -> Done</li>
  <li>Ordering per column -> Done</li>
  <li>Searching -> Done</li>
  <li>Filtering -> Done</li>
</ul>
  
<h3>Station list</h3>
![stationlist](https://user-images.githubusercontent.com/32989919/183706403-a9fdff22-44ca-4457-84df-3236693e4054.png)

Station list with search/filter. No pagination needed. Lists all stations that are in the database.

<li>List all stations -> Done</li>
<li>Pagination -> Done</li>
<li>Searching -> More like filtering here, but done</li>

<h3>Single station view</h3>

![singlestation](https://user-images.githubusercontent.com/32989919/183704725-b0bc5cb3-ac5b-4407-8737-37b1c3565fad.png)
Single station with calculations and a map view of the station.

<li>Station name -> Done</li>
<li>Station address -> Done</li>
<li>Total number of journeys starting from the station -> Done</li>
<li>Total number of journeys ending at the station -> Done</li>
<li>Station location on the map -> Done</li>
<li>The average distance of a journey starting from the station -> Done</li>
<li>The average distance of a journey ending at the station -> Done</li>
<li>Top 5 most popular return stations for journeys starting from the station -> Done</li>
<li>Top 5 most popular departure stations for journeys ending at the station -> Done</li>
<li>Ability to filter all the calculations per month -> Not done</li>

<h3>Suprise part</h3>

<li>Runs on cloud(heroku)</li>
<li>Localizations with finnish, english and swedish</li>
<li>Ability to save new journeys and stations</li>

![addjourney](https://user-images.githubusercontent.com/32989919/183704960-ba908ebc-0683-47fe-9fbd-7337620354b3.png)
Journey adding. Name fields offer suggestions similarly as in the journey search.

![addstation](https://user-images.githubusercontent.com/32989919/183705000-529f303d-d806-4612-bc92-06526ea2adf9.png)
Adding stations with map suggestion. Drag the marker to a location and the fields will be filled with recommendations and
correct cordinates.

<h2>Local setup guide</h2>

<h3>Part 1: Data validation and import</h3>

Tools & Technologies: python, more_itertools(python), node, express, fast-csv, mongoose, mongodb

The repository contains a python script that removes all duplicates from the csv-files provided by hsl and makes a duplicate free file. Next validation happens on the import stream with fast-csv. If the columns don't match csv headers, the stream stops with an error. Additionally, all journeys that lasted less than 10 seconds or 10 meters are discarded with fast-csv validation. After running the express script once for every csv, the data will be succesffully uploaded to mongodb.

Setup guide:

Prequisites: nodejs(latest), python, more_itertools, visual code 

1. Create mongo atlas credentials and database. Create a collection there and get url to connect.
2. Create an .env file and add the connection url there: DATABASE_URL=<your connection url>.
3. Download csv files from: 
  https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv
  https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv
  https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv
  https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv
4. Add csv files to csv-duplicate-remove folder. Type one csv file name on the script and run it and repeat for all files.
5. Remove the dot from "Duration (sec.) header on the csv-files. Mongo reads it as JSON.
6. Go to database_export folder on terminal and run _npm i_
7. Move the processed journey files to database-export folder. Add one filename to line 32 and run _node journey_export.js_. Repeat for all journey files.
8. For station list, input the processed station csv file to station_export at line 30 and run node station_export.js
9. If successfull, the data can be seen at mongoDB as journey and stations collections.
  
<h3>Part 2: Express Api</h3>
  
The api works as an endpoint for the client to fetch data from the mongo database.
  
Running locally:
 
  1. On terminal, change directory to ./api
  2. Run _npm i_
  3. Create a .env file containing mongodb url: DATABASE_URL= your mongo url
  4. npm start on terminal to start the api
  
The api has 3 different routes:
  1. Journeys:
 
  Get journeys with pagination. The url has a page and limit queries to manage pagination.
  Post method to find journeys.
 
  2. Stations
  
  Get method to get all journeys, same queries as journey route.
  
  3. Station details
  
  Get details such as average distance or duration.
  
  4. Station search
  
  Get recommendations to client when searching journeys.
  
  <h3>Part 3: Client</h3>
  
Technologies & Tools: nodejs, react, react-bootstrap, il18next, leaflet
  
The client fetches data from the api and displays them on browser.
  
Local Setup:
  
  1. Change directory to ./client
  2. npm i
  3. Create .env file and put api url there: REACT_APP_API_URL = http://localhost:9000
  4. npm start
  5. Open browser at local host 9000 and you should automatically get all journeys from mongodb to your browser.
  
