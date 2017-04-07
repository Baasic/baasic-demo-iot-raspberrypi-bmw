Baasic BMW K-BUS With RaspberryPI Showcase
============

## Showcase Functionality


More information about the Starter Kit can be found in the series of blog posts [here](http://www.baasic.com/posts/AngularJS-Blog-Starter-Kit-part-1/).

## Working with the showcase
 
As a client-side prerequisite, you should install the basic tools for your operating system: Node.js (4.x and above), Bower and Gulp. Start by cloning the [Baasic BMW K-BUS With RaspberryPI Showcase repository](https://github.com/Baasic/baasic-showcase-iot-raspberrypi-bmw/). After that, go into the root folder of the showcase you just cloned and type

    npm install
    
npm (Node Package Manager) will go through its configuration file (package.json) and install all dependencies. It may take a couple of minutes to download and install everything; when it is finished, just type

    gulp serve
   

and you are *almost* ready to go. 

## Production ready build

To make the app ready for deploy to production run:

```bash
gulp dist
```
or
```bash
gulp dist --theme gastro-thumbnail
```

## Base url option

You can also add a `--baseUrl` command if your blog destination is not in root of your website 

For example:
`--baseUrl "/sub-folder/baasic-showcase-iot-raspberrypi-bmw/"`

Now there's a `./dist` folder with all scripts and stylesheets concatenated and minified, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.

## Get in touch

Get in touch using one of the community channels 

* GitHub: [Baasic](https://github.com/Baasic)
* Google Groups: [Baasic Support](https://groups.google.com/forum/#!forum/baasic-baas)
* Twitter: [@baasical](https://twitter.com/baasical)

## Credits


