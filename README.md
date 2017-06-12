Baasic BMW K-BUS With RaspberryPI Showcase
============

## Showcase Functionality

Our team has put together a small show case using RaspberryPI connected to BMW 528iA E39 K-BUS in order to communicate with the car and collect metrics.
More information about the RaspberryPI implementation can be found in the blog post [here](http://mono.software/2016/12/01/hacking-bmw-i-bus-with-raspberry-pi/) and [here](http://mono.software/2017/06/12/hacking-bmw-k-bus-with-raspberry-pi/). NodeJS RaspberryPI source code can be found [here](https://github.com/Baasic/baasic-demo-nodejs-raspberrypi-bmw).

## Working with the showcase
 
As a client-side prerequisite, you should install the basic tools for your operating system: Node.js (4.x and above), Bower and Gulp. Start by cloning the [Baasic BMW K-BUS With RaspberryPI Showcase repository](https://github.com/Baasic/baasic-showcase-iot-raspberrypi-bmw/). After that, go into the root folder of the showcase you just cloned and type

    npm install
    
npm (Node Package Manager) will go through its configuration file (package.json) and install all dependencies. It may take a couple of minutes to download and install everything; when it is finished, just type

    gulp serve
   

and you are *almost* ready to go. 

## Base url option

You can also add a `--baseUrl` command if showcase destination is not in root of your website 

For example:
`--baseUrl "/angularjs/baasic-showcase-iot-raspberrypi-bmw/"`

Now there's a `./dist` folder with all scripts and stylesheets concatenated and minified, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.

## Get in touch

Get in touch using one of the community channels 

* GitHub: [Baasic](https://github.com/Baasic)
* Google Groups: [Baasic Support](https://groups.google.com/forum/#!forum/baasic-baas)
* Twitter: [@baasical](https://twitter.com/baasical)




