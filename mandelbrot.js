// Version 9 has been put through the rigors of JSLint

function makeMandelbrot(width, height) {
    "use strict";

    // var white = [255, 255, 255, 255];
    var black = [0, 0, 0, 255];
    // var red = [255,0,0,255];
    // var yellow = [255,240,120,255];
    // var teal = [0,255,255,255];
    // var chosenColor = red;

    var zoom = 1; // Doesn't really do anything currently except be printed

    // Example: xmax = xcenter + span; xmin = xcenter - span
    // 2*span = sideLength (math numbers)
    var span = 2.0;
    var xcenter = 0.0;
    var ycenter = 0.0;
    var xmin = -2.0;
    var xmax = 2.0;
    var ymin = -2.0;
    var ymax = 2.0;

    // var width = 1000; // in pixels
    // var height = 1000;

    // Scalers convert between pixel lengths and math lengths
    // Pixels per x unit, pixels per y unit
    var xscale = width / (xmax - xmin);
    var yscale = height / (ymax - ymin);

    var maxIterationsDefault = 255;
    var maxIterations = maxIterationsDefault;

    // helper function to create HTML element tree on which to hang stuff
    function elt(type) {
        // Make HTML Element Tree function modified from eloquent javascript

        var node = document.createElement(type);
        var i;
        var child;
        var attr;
        for (i = 1; i < arguments.length; i += 1) {
            child = arguments[i];
            if (typeof child === "string") {

                if (child.includes("=")) {
                    attr = child.split("=");
                    node.setAttribute(attr[0], attr[1]);
                } else {
                    child = document.createTextNode(child);
                    node.appendChild(child);
                }

            } else {
                node.appendChild(child);
            }
        }
        return node;
    }

    var node = elt("div", "id=mandelbro",
        elt("h1", "Mandelbro"),
        elt("button", "id=resetButton", "Reset"),
        elt("label", "Max Iterations"),
        elt("input", "id=inputField"),
        elt("button", "id=drawButton", "Draw"),
        elt("br"),
        elt("p", "id=infoPara"),
        elt("canvas", "id=canvas"),
        elt("p"),
        elt("p", "id=console")
    );

    var infoPara = node.querySelector("#infoPara");
    var resetButton = node.querySelector("#resetButton");
    var drawButton = node.querySelector("#drawButton");
    var inputField = node.querySelector("#inputField");

    var canvas = node.querySelector("#canvas");
    canvas.height = height;
    canvas.width = width;

    // get the image from the context - image: {width, height, data}
    var ctx = canvas.getContext("2d");
    var imgData = ctx.getImageData(0, 0, width, height);
    var data = imgData.data;

    function hslToRgb(h, s, l) {
        var r;
        var g;
        var b;
        function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        if (s === 0) {
            r = 1;
            g = 1;
            b = 1; // achromatic
        } else {

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function drawMandelbrot() {

        var x;
        var y;
        // Zn+1 = Zn^2 + c
        // Z0 = 0
        // c is pixel value
        var zx;
        var zxtemp;
        var zy;
        var cx;
        var cy;

        var rgb;
        var i;
        var inputValue;

        var inSet; // true,false
        var pos;
        var stride = 4; // 4 bytes per pixel

        maxIterations = 255 + (20 * Math.log2(zoom)); 	    // maxIterations=Math.sqrt(Math.abs(2*Math.sqrt(Math.abs(1-Math.sqrt(5*zoom)))))*66.5;

        inputValue = parseInt(inputField.value);
        if (!isNaN(inputValue)) {
            maxIterations = inputValue;
        }

        infoPara.innerHTML = "x: " + xcenter + ", y: " + ycenter + ", zoom: " + zoom + ", maxIterations: " + maxIterations + "<br>";


        // Make Black Image
        for (i = 0; i < data.length; i += stride) {
            data[i + 0] = black[0];
            data[i + 1] = black[1];
            data[i + 2] = black[2];
            data[i + 3] = black[3];
        }

        // ctx.putImageData(imgData, 0, 0); // Put data in canvas' 2D context
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {


                // convert pixel to math number
                // 0,0 -> -2,-2
                // 500,500 -> 0,0
                // 500,0 -> 2,0 -> 0,-2
                // 500,250 -> 2,1 -> 0, -1
                // 500, 125 -> 2,0.5 -> 0, -1.5
                cx = xcenter - span + x / xscale;
                cy = ycenter - span + y / yscale;
                // image is flipped vertically. numbers go up, pixels go down 
                zx = 0;
                zy = 0;

                inSet = true;
                for (i = 1; i <= maxIterations; i += 1) {
                    zxtemp = zx * zx - zy * zy + cx;
                    zy = 2 * zx * zy + cy;
                    zx = zxtemp;
                    if (zx * zx + zy * zy > 4) {
                        inSet = false;
                        break;
                    }
                }

                if (inSet === false) {
                    pos = y * width * stride + x * stride;
                    rgb = hslToRgb((i % 255) / 255, 1, 0.5);
                    data[pos + 0] = rgb[0];
                    data[pos + 1] = rgb[1];
                    data[pos + 2] = rgb[2];
                    // data[pos + 3] = chosenColor[3] * i / maxIterations; // don't mess with opacity
                }
            }

        }

        ctx.putImageData(imgData, 0, 0);

    }

    // getClickedPosition and resetZoom also draw the mandelbrot image in addition to their other functionality.
    function getClickPosition(e) {
        var rect = e.currentTarget.getBoundingClientRect();
        var xPixel = e.clientX - rect.left;
        var yPixel = e.clientY - rect.top;
        // print(xPixel+" "+yPixel);

        if (e.which === 1) {

            // convert pixel to math number
            xcenter = xmin + xPixel / xscale;
            ycenter = ymin + yPixel / yscale;

            zoom *= 2; // zoom doesn't really do anything
            span /= 2;

            // maxIterations *= 1.1;
            // maxIterations += 20;

        } else if (e.which === 3) { // right click on mac touchpad for some reason

            zoom /= 2;
            span *= 2;

            // maxIterations /= 1.1;
            // maxIterations -= 20;


        }

        xmin = xcenter - span;
        xmax = xcenter + span;
        ymin = ycenter - span;
        ymax = ycenter + span;

        xscale = width / (xmax - xmin);
        yscale = height / (ymax - ymin);

        drawMandelbrot();


    }
    function resetZoom() {

        zoom = 1;
        xcenter = 0;
        ycenter = 0;
        span = 2;
        xmin = -2;
        xmax = 2;
        ymin = -2;
        ymax = 2;

        xscale = width / (xmax - xmin);
        yscale = height / (ymax - ymin);
        maxIterations = maxIterationsDefault;

        drawMandelbrot();

        infoPara.innerHTML = "Left click to zoom in, right click to zoom out. Increase max iterations for more detail."

    }

    // Begin main
    drawMandelbrot();

    infoPara.innerHTML = "Left click to zoom in, right click to zoom out. Increase max iterations for more detail."

    // Event Listeners
    canvas.addEventListener("mousedown", getClickPosition, false);
    canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
    resetButton.addEventListener("click", resetZoom, false);
    drawButton.addEventListener("click", drawMandelbrot, false);
    inputField.addEventListener("keypress", function (e) {
        // http://stackoverflow.com/questions/14542062/eventlistener-enter-key
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            drawMandelbrot();
        }
    });

    // canvas.addEventListener("contextmenu", (event) => event.preventDefault());  	// Block Context Menu on canvas - http://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page



    return node;

}

