# SolitaDevAcademy2022
The pre-assignment for Solita Dev Academy 2022

Live url: https://bikejourney-client.herokuapp.com/

<h1>Introduction</h1>

This project is a preassingment for Solita Devacademy fall 2022. The assingment can be found at https://github.com/solita/dev-academy-2022-fall-exercise.

<h2>What was done</h2>

<h3>Data</h3>

Import data from the CSV files to a database -> Done
Validate data -> Done
Don't import journeys that lasted for less than ten seconds -> Done
Don't import journeys that covered distances shorter than 10 meters -> Done

<h3>Journey list</h3>

-List journeys -> Done
-For each journey show departure and return stations, covered distance in kilometers and duration in minutes -> Done
-Pagination -> Done
-Ordering per column -> Partly done
-Searching -> Partly done
-Filtering -> Not done

<h3>Station list</h3>

-List all stations -> Done
-Pagination -> Done
-Searching -> More like filtering here, but done

<h3>Single station view</h3>

-Station name -> Done
-Station address -> Done
-Total number of journeys starting from the station -> Done
-Total number of journeys ending at the station -> Done
-Station location on the map -> Done
-The average distance of a journey starting from the station -> Done
-The average distance of a journey ending at the station -> Done
-Top 5 most popular return stations for journeys starting from the station -> Done
-Top 5 most popular departure stations for journeys ending at the station -> Done
-Ability to filter all the calculations per month -> Not done


<h3>Suprise part</h3>

-Runs on cloud


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
4. Add csv files to csv-duplicate-remove folder. Type one csv file name on the script and run it. Do that for all 3.
5. Go to database_export folder on terminal and run _npm i_
6. Move the processed files to database-export folder. Add one filename to line 32 and run _node journey_export.js_. Repeat for all csv-files.
7. If successfull, the data can be seen at mongoDB after all is done.
  
<h3>Part 2: Express Api</h3>
  
The api works as an endpoint for the client to fetch data from the mongo database.
  
Running locally:
 
  1. On terminal, change directory to ./api
  2. Run _npm i_
  3. Create a .env file containing mongodb url: DATABASE_URL=<your mongo url>
  4. npm start on terminal to start the api
  
The api has 3 different routes:
  1. Journeys
 
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
  
  
  
  
