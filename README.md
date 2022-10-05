<a href="https://www.wrld3d.com/">
    <img src="https://cdn2.wrld3d.com/wp-content/uploads/2017/04/WRLD_Blue.png"  align="right" height="80px" />
</a>

# wrld.js

![WRLD](https://cdn2.wrld3d.com/wp-content/uploads/2017/04/screenselection01.png)

The WRLD JavaScript API allows you to easily embed [beautiful 3D maps](https://www.wrld3d.com/) into any web page for any modern, WebGL supporting browser. For an example of our 3D maps in action, see [these examples](https://docs.wrld3d.com/wrld.js/latest/docs/examples/).

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
    <script src="https://unpkg.com/wrld.js@1.x.x"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css" rel="stylesheet" />
  </head>
  <body>
    <div id="map" style="width: 400px; height: 400px;"></div>
    <script type="text/javascript">
      const map = Wrld.map("map", "your_api_key_here");
    </script>
  </body>
</html>
```

Just replace `your_api_key_here` with an API key from [wrld3d.com](https://www.wrld3d.com/register/).

### If you're using npm:

Install the wrld.js package:

```terminal
npm install wrld.js 
```

And in your application:

```TypeScript
import Wrld from "wrld.js";

const map = Wrld.map("map", "your_api_key_here");
```

### Using React?

We have a component that wraps `wrld.js`: <https://github.com/wrld3d/wrld-react>.

### Interested in the newest changes?

Bleeding edge build are available with the `bleeding-edge` tag.
You can get them from unpkg with
```html
<script src="http://unpkg.com/wrld.js@bleeding-edge"></script>
```
or from npm with
```sh
npm install wrld.js@bleeding-edge
```

## Migration from 0.1.x to 1.0.x

Starting from version 1.0.0, the `Wrld` object now extends `L` from Leaflet, instead of acting like a plugin – this simplifies using wrld.js with TypeScript and improves interoperability with other Leaflet maps on the same page.

- Replace `L.Wrld.polygon` with `Wrld.native.polygon`
- Replace `L.Wrld.polyline` with `Wrld.native.polyline`
- Replace all other `L.Wrld.*` calls to `Wrld.*`
- Replace all `L.*` calls with `Wrld.*`

## Support

If you have any questions, bug reports, or feature requests, feel free to submit to the [issue tracker](https://github.com/wrld3d/wrld.js/issues) for wrld.js on GitHub.

## Building the API

You may wish to build the API yourself. This is easy to do and only requires that you install [node.js](https://nodejs.org/en/).

### Requirements

* [Node.js](https://nodejs.org/en/) (v12 or newer)
* npm (installed with Node.js)

### Building

Follow the steps below to build the API:

1.  Clone this repo: `git clone https://github.com/wrld3d/wrld.js.git`
2.  In the root of the repo, run `npm install` to install the development dependencies.
3.  Still in the root of the repo, run the command `npm run build`.

This will create the file `cdn/wrld.js` which is the bundled UMD package, and various outputs in the `dist/` folder`.

You can also use the command `npm run watch` to build continuously, watching files for changes.

### Testing

Before executing automated tests, make sure you have eeGeoWebGL.js downloaded in `/tmp/sdk`. This can be achieved by running `./download-sdk.sh`.

- `npm run test` will execute automated tests and lint the project.
- `npm run test:unit` will only execute automated tests.
- `npm run test:watch` will watch the source files and execute affected tests.

## Contributing

If you wish to contribute to this repo, [pull requests](https://github.com/wrld3d/wrld.js) on GitHub are welcomed.

## License

The WRLD 3D Maps JavaScript API is released under the Simplified BSD License. See [LICENSE.md](https://github.com/wrld3d/wrld.js/blob/master/LICENSE.md) for details.
