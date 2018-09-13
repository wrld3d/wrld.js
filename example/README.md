# POI View Example

## Requirements

* Python 2

## Getting Set up

### Importing POIs from a CSV

1. Log into your WRLD account and select 'Places Designer'.

2. In the Places Designer select 'New Places Collection'. Give it a title and add it to the app you want to associate it with.

3. Select 'Upload New Collection'. Drag the poi-examples.csv provided, or your own .csv, into the upload box.

4. Done!

#### Tip
You can edit and preview the POIs you have imported here in the Places Designer by selecting them and clicking the tabs on the right side panel.

### Setting up the example

1. Clone this repository if you have not already.

2. Open index.html and replace 'your-api-key' with the api-key of the map you have added your POI collection to.

3. (Optional) You may also want to set the start location of the map to where you have places you POIs. It is currently set on line 30 as 'center: [37.79505, -122.40815],'.

4. Open up a terminal in this directory.

5. Run the command 'python -m SimpleHTTPServer 8000'

6. Open 'http://localhost:8000/' in your browser.

### Viewing your POIs

1. Navigate to the location of your POIs.

2. Open the searchbar menu located at the very top left of the screen.

3. Select 'Find' and then 'Around Me'.

4. You can now select one of your POIs from the list of results.

### Types of POIs

In this example there are two types of POIs:

The first is a standard POI that uses the default layout and customization option offered in Places Designer.

The second is a custom html POI. This type of POI is created by setting 'custom_view', within the 'user_data' field of a POI, to a custom html view. You can read more about the 'user_data' fields [here](https://github.com/wrld3d/wrld-poi-api) under Points of Interest. In this example we have set custom_view to: "custom_view": "http://localhost:8000/example.html", which just points to a example html page we are serving locally. Additionally we have (Optionally) added, "custom_view_height": 350, which lets us control the height of our POI card.
