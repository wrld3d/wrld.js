<a href="https://www.wrld3d.com/">
    <img src="https://cdn2.wrld3d.com/wp-content/uploads/2017/04/WRLD_Blue.png"  align="right" height="80px" />
</a>

# wrld.js

![WRLD](https://cdn2.wrld3d.com/wp-content/uploads/2017/04/screenselection01.png)

The WRLD JavaScript API allows you to easily embed [beautiful 3D maps](https://www.wrld3d.com/) into any web page for any modern, WebGL supporting browser. For an example of our 3D maps in action, see [https://www.wrld3d.com/wrld.js/examples/](https://www.wrld3d.com/wrld.js/examples/).

It is based on [Leaflet.js](http://leafletjs.com/), providing a familiar API for embedding 3D maps in a web page.

## Examples

You can find [feature-by-feature examples](https://www.wrld3d.com/wrld.js/examples/) on our website.

## API

A [full API reference](https://www.wrld3d.com/wrld.js/docs/) is also available on our website.

## Getting Started

Before you begin, you will need to acquire an API key, which you can do by [signing up](https://www.wrld3d.com/register/) for an account at [wrld3d.com](https://www.wrld3d.com) and selecting the Digital Twin plan - free trials are available!

You can easily embed a 3D map in any web page. The code below shows a simple example:

```html
<!-- Create a map in an HTML element with wrld.js -->
<!DOCTYPE HTML>
<html>
  <head>
    <script src="https://cdn-webgl.wrld3d.com/wrldjs/dist/latest/wrld.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map" style="width: 400px; height: 400px;"></div>
    <script type="text/javascript">
      var map = L.Wrld.map("map", "your_api_key_here");
    </script>
  </body>
</html>
```

Just replace `your_api_key_here` with an API key from [wrld3d.com](https://www.wrld3d.com/register/).

## Support

If you have any questions, bug reports, or feature requests, feel free to submit to the [issue tracker](https://github.com/wrld3d/wrld.js/issues) for wrld.js on GitHub.

## Building the API

You may wish to build the API yourself. This is easy to do and only requires that you install [node.js](https://nodejs.org/en/).

### Requirements

*   [Node.js](https://nodejs.org/en/) (v4.4.1 tested)
*   npm (installed with Node.js)

### Building

Follow the steps below to build the API:

1.  Clone this repo: `git clone https://github.com/wrld3d/wrld.js.git`
2.  In the root of the repo, run `npm install` to install the development dependencies.
3.  Still in the root of the repo, run the command `npm run build`.

This will create the files `dist/wrld.js` and `dist/wrld.min.js` which are the API and the minified form respectively.

You can also use the command `npm run watch` to build continuously, watching files for changes.

## Contributing

If you wish to contribute to this repo, [pull requests](https://github.com/wrld3d/wrld.js) on GitHub are welcomed.

## License

The WRLD 3D Maps JavaScript API is released under the Simplified BSD License. See [LICENSE.md](https://github.com/wrld3d/wrld.js/blob/master/LICENSE.md) for details.
