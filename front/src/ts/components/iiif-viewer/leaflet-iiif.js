/*
 * Leaflet-IIIF 2.0.1
 * IIIF Viewer for Leaflet
 * by Jack Reed, @mejackreed
 */

//function setTransform(el, offset, scale) {
//	var pos = offset || new Point(0, 0);
//
//	el.style[TRANSFORM] =
//		(ie3d ?
//			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
//			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
//		(scale ? ' scale(' + scale + ')' : (Browser.webkit?' scale(1.002)':""))
//(Ti?' scale(1.002)':"")
//}

L.TileLayer.Iiif = L.TileLayer.extend({
    options: {
        continuousWorld: true,
        tileSize: 256,
        updateWhenIdle: true,
        tileFormat: 'jpg',
        fitBounds: true,
        setMaxBounds: false
    },

    initialize: function (url, options) {
        //promise polyfil
        !function n(t,e,o){function i(u,f){if(!e[u]){if(!t[u]){var c="function"==typeof require&&require;if(!f&&c)return c(u,!0);if(r)return r(u,!0);var s=new Error("Cannot find module '"+u+"'");throw s.code="MODULE_NOT_FOUND",s}var a=e[u]={exports:{}};t[u][0].call(a.exports,function(n){var e=t[u][1][n];return i(e?e:n)},a,a.exports,n,t,e,o)}return e[u].exports}for(var r="function"==typeof require&&require,u=0;u<o.length;u++)i(o[u]);return i}({1:[function(n,t){function e(){}var o=t.exports={};o.nextTick=function(){var n="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(n)return function(n){return window.setImmediate(n)};if(t){var e=[];return window.addEventListener("message",function(n){var t=n.source;if((t===window||null===t)&&"process-tick"===n.data&&(n.stopPropagation(),e.length>0)){var o=e.shift();o()}},!0),function(n){e.push(n),window.postMessage("process-tick","*")}}return function(n){setTimeout(n,0)}}(),o.title="browser",o.browser=!0,o.env={},o.argv=[],o.on=e,o.addListener=e,o.once=e,o.off=e,o.removeListener=e,o.removeAllListeners=e,o.emit=e,o.binding=function(){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(){throw new Error("process.chdir is not supported")}},{}],2:[function(n,t){"use strict";function e(n){function t(n){return null===c?void a.push(n):void r(function(){var t=c?n.onFulfilled:n.onRejected;if(null===t)return void(c?n.resolve:n.reject)(s);var e;try{e=t(s)}catch(o){return void n.reject(o)}n.resolve(e)})}function e(n){try{if(n===l)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if("function"==typeof t)return void i(t.bind(n),e,u)}c=!0,s=n,f()}catch(o){u(o)}}function u(n){c=!1,s=n,f()}function f(){for(var n=0,e=a.length;e>n;n++)t(a[n]);a=null}if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof n)throw new TypeError("not a function");var c=null,s=null,a=[],l=this;this.then=function(n,e){return new l.constructor(function(i,r){t(new o(n,e,i,r))})},i(n,e,u)}function o(n,t,e,o){this.onFulfilled="function"==typeof n?n:null,this.onRejected="function"==typeof t?t:null,this.resolve=e,this.reject=o}function i(n,t,e){var o=!1;try{n(function(n){o||(o=!0,t(n))},function(n){o||(o=!0,e(n))})}catch(i){if(o)return;o=!0,e(i)}}var r=n("asap");t.exports=e},{asap:4}],3:[function(n,t){"use strict";function e(n){this.then=function(t){return"function"!=typeof t?this:new o(function(e,o){i(function(){try{e(t(n))}catch(i){o(i)}})})}}var o=n("./core.js"),i=n("asap");t.exports=o,e.prototype=o.prototype;var r=new e(!0),u=new e(!1),f=new e(null),c=new e(void 0),s=new e(0),a=new e("");o.resolve=function(n){if(n instanceof o)return n;if(null===n)return f;if(void 0===n)return c;if(n===!0)return r;if(n===!1)return u;if(0===n)return s;if(""===n)return a;if("object"==typeof n||"function"==typeof n)try{var t=n.then;if("function"==typeof t)return new o(t.bind(n))}catch(i){return new o(function(n,t){t(i)})}return new e(n)},o.all=function(n){var t=Array.prototype.slice.call(n);return new o(function(n,e){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(n){o(r,n)},e)}t[r]=u,0===--i&&n(t)}catch(c){e(c)}}if(0===t.length)return n([]);for(var i=t.length,r=0;r<t.length;r++)o(r,t[r])})},o.reject=function(n){return new o(function(t,e){e(n)})},o.race=function(n){return new o(function(t,e){n.forEach(function(n){o.resolve(n).then(t,e)})})},o.prototype["catch"]=function(n){return this.then(null,n)}},{"./core.js":2,asap:4}],4:[function(n,t){(function(n){function e(){for(;i.next;){i=i.next;var n=i.task;i.task=void 0;var t=i.domain;t&&(i.domain=void 0,t.enter());try{n()}catch(o){if(c)throw t&&t.exit(),setTimeout(e,0),t&&t.enter(),o;setTimeout(function(){throw o},0)}t&&t.exit()}u=!1}function o(t){r=r.next={task:t,domain:c&&n.domain,next:null},u||(u=!0,f())}var i={task:void 0,next:null},r=i,u=!1,f=void 0,c=!1;if("undefined"!=typeof n&&n.nextTick)c=!0,f=function(){n.nextTick(e)};else if("function"==typeof setImmediate)f="undefined"!=typeof window?setImmediate.bind(window,e):function(){setImmediate(e)};else if("undefined"!=typeof MessageChannel){var s=new MessageChannel;s.port1.onmessage=e,f=function(){s.port2.postMessage(0)}}else f=function(){setTimeout(e,0)};t.exports=o}).call(this,n("_process"))},{_process:1}],5:[function(){"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(){var n=arguments.length?this.then.apply(this,arguments):this;n.then(null,function(n){setTimeout(function(){throw n},0)})})},{}],6:[function(n){n("asap");"undefined"==typeof Promise&&(Promise=n("./lib/core.js"),n("./lib/es6-extensions.js")),n("./polyfill-done.js")},{"./lib/core.js":2,"./lib/es6-extensions.js":3,"./polyfill-done.js":5,asap:4}]},{},[6]);
        options = typeof options !== 'undefined' ? options : {};

        if (options.maxZoom) {
            this._customMaxZoom = true;
        }

        // Check for explicit tileSize set
        if (options.tileSize) {
            this._explicitTileSize = true;
        }

        // Check for an explicit quality
        if (options.quality) {
            this._explicitQuality = true;
        }

        options = L.setOptions(this, options);
        this._infoUrl = url;
        this._baseUrl = this._templateUrl();
        this._infoPromise = this._getInfo();
    },
    getTileUrl: function (coords) {
        var _this = this,
                x = coords.x,
                y = (coords.y),
                zoom = _this._getZoomForUrl(),
                scale = Math.pow(2, _this.maxNativeZoom - zoom),
                tileBaseSize = _this.options.tileSize * scale,
                minx = (x * tileBaseSize),
                miny = (y * tileBaseSize),
                maxx = Math.min(minx + tileBaseSize, _this.x),
                maxy = Math.min(miny + tileBaseSize, _this.y);

        var xDiff = (maxx - minx);
        var yDiff = (maxy - miny);

        return L.Util.template(this._baseUrl, L.extend({
            format: _this.options.tileFormat,
            quality: _this.quality,
            region: [minx, miny, xDiff, yDiff].join(','),
            rotation: 0,
            size: xDiff > yDiff ? (Math.round(xDiff / scale) + ',') : (',' + Math.round(yDiff / scale)) 
        }, this.options));
    },
    onAdd: function (map) {
        var _this = this;
        this._infoPromise.then(function() {
            // Store unmutated imageSizes
            _this._imageSizesOriginal = _this._imageSizes.slice(0);

            // Set maxZoom for map
            map._layersMaxZoom = _this.maxZoom;

            // Set minZoom and minNativeZoom based on how the imageSizes match up
            var smallestImage = _this._imageSizes[0];
            var mapSize = _this._map.getSize();
            var newMinZoom = 0;
            // Loop back through 5 times to see if a better fit can be found.
            for (var i = 1; i <= 5; i++) {
                if (smallestImage.x > mapSize.x || smallestImage.y > mapSize.y) {
                    smallestImage = smallestImage.divideBy(2);
                    _this._imageSizes.unshift(smallestImage);
                    newMinZoom = -i;
                } else {
                    break;
                }
            }
            _this.options.minZoom = newMinZoom;
            _this.options.minNativeZoom = newMinZoom;
            _this._prev_map_layersMinZoom = _this._map._layersMinZoom;
            _this._map._layersMinZoom = newMinZoom;

            // Call add TileLayer
            L.TileLayer.prototype.onAdd.call(_this, map);

            if (_this.options.fitBounds) {
                _this._fitBounds();
            }

            if (_this.options.setMaxBounds) {
                _this._setMaxBounds();
            }

            // Reset tile sizes to handle non 256x256 IIIF tiles
            _this.on('tileload', function (tile, url) {

                var height = tile.tile.naturalHeight,
                        width = tile.tile.naturalWidth;

                // No need to resize if tile is 256 x 256
                if (height === 256 && width === 256)
                    return;

                tile.tile.style.width = width + 'px';
                tile.tile.style.height = height + 'px';

            });
        });
    },
    onRemove: function (map) {
        var _this = this;

        map._layersMinZoom = _this._prev_map_layersMinZoom;
        _this._imageSizes = _this._imageSizesOriginal;

        // Remove maxBounds set for this image
        if (_this.options.setMaxBounds) {
            map.setMaxBounds(null);
        }

        // Call remove TileLayer
        L.TileLayer.prototype.onRemove.call(_this, map);

    },
    _fitBounds: function () {
        var _this = this;

        // Find best zoom level and center map
        var initialZoom = _this._getInitialZoom(_this._map.getSize());
        var offset = _this._imageSizes.length - 1 - _this.options.maxNativeZoom;
        var imageSize = _this._imageSizes[initialZoom + offset];
        var sw = _this._map.options.crs.pointToLatLng(L.point(0, imageSize.y), initialZoom);
        var ne = _this._map.options.crs.pointToLatLng(L.point(imageSize.x, 0), initialZoom);
        var bounds = L.latLngBounds(sw, ne);

        _this._map.fitBounds(bounds, {animate:true});
    },
    _setMaxBounds: function () {
        var _this = this;

        // Find best zoom level, center map, and constrain viewer
        var initialZoom = _this._getInitialZoom(_this._map.getSize());
        var imageSize = _this._imageSizes[initialZoom];
        var sw = _this._map.options.crs.pointToLatLng(L.point(0, imageSize.y), initialZoom);
        var ne = _this._map.options.crs.pointToLatLng(L.point(imageSize.x, 0), initialZoom);
        var bounds = L.latLngBounds(sw, ne);

        _this._map.setMaxBounds(bounds, true);
    },
    _getInfo: function () {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", _this._infoUrl);
            xhr.onload = function()  {
                var data = JSON.parse(xhr.responseText);
//                console.info(data);
                _this.y = data.height;
                _this.x = data.width;

                var tierSizes = [],
                        imageSizes = [],
                        scale,
                        width_,
                        height_,
                        tilesX_,
                        tilesY_;

                // Set quality based off of IIIF version
                if (data.profile instanceof Array) {
                    _this.profile = data.profile[0];
                } else {
                    _this.profile = data.profile;
                }

                _this._setQuality();

                // Unless an explicit tileSize is set, use a preferred tileSize
                if (!_this._explicitTileSize) {
                    // Set the default first
                    _this.options.tileSize = 256;
                    if (data.tiles) {
                        // Image API 2.0 Case
                        _this.options.tileSize = data.tiles[0].width;
                    } else if (data.tile_width) {
                        // Image API 1.1 Case
                        _this.options.tileSize = data.tile_width;
                    }
                }

                function ceilLog2(x) {
                    return Math.ceil(Math.log(x) / Math.LN2);
                }
                ;

                // Calculates maximum native zoom for the layer
                _this.maxNativeZoom = Math.max(ceilLog2(_this.x / _this.options.tileSize),
                        ceilLog2(_this.y / _this.options.tileSize));
                _this.options.maxNativeZoom = _this.maxNativeZoom;

                // Enable zooming further than native if maxZoom option supplied
                if (_this._customMaxZoom && _this.options.maxZoom > _this.maxNativeZoom) {
                    _this.maxZoom = _this.options.maxZoom;
                } else {
                    _this.maxZoom = _this.maxNativeZoom;
                }

                for (var i = 0; i <= _this.maxZoom; i++) {
                    scale = Math.pow(2, _this.maxNativeZoom - i);
                    width_ = Math.ceil(_this.x / scale);
                    height_ = Math.ceil(_this.y / scale);
                    tilesX_ = Math.ceil(width_ / _this.options.tileSize);
                    tilesY_ = Math.ceil(height_ / _this.options.tileSize);
                    tierSizes.push([tilesX_, tilesY_]);
                    imageSizes.push(L.point(width_, height_));
                }

                _this._tierSizes = tierSizes;
                _this._imageSizes = imageSizes;
                resolve();
            }
            xhr.send();
        });
    },

    _setQuality: function () {
        var _this = this;
        var profileToCheck = _this.profile;

        if (_this._explicitQuality) {
            return;
        }

        // If profile is an object
        if (typeof (profileToCheck) === 'object') {
            profileToCheck = profileToCheck['@id'];
        }

        // Set the quality based on the IIIF compliance level
        switch (true) {
            case / ^ http:\/\/library.stanford.edu\/iiif\/image-api\/1.1\/compliance.html.*$/.test(profileToCheck):
                _this.options.quality = 'native';
                break;
                // Assume later profiles and set to default
            default:
                _this.options.quality = 'default';
                break;
        }
    },

    _infoToBaseUrl: function () {
        return this._infoUrl.replace('info.json', '');
    },
    _templateUrl: function () {
        return this._infoToBaseUrl() + '{region}/{size}/{rotation}/{quality}.{format}';
    },
    _isValidTile: function (coords) {

        var tileBounds = this._tileCoordsToBounds(coords);
//        console.info("is-valid-tile", JSON.stringify(coords), JSON.stringify(tileBounds))
        var _this = this;
        var zoom = _this._getZoomForUrl();
        var sizes = _this._tierSizes[zoom];
//        console.info("size",_this._tierSizes)
        var x = coords.x;
        var y = coords.y;
//        console.info("js", zoom, sizes);
        if (zoom < 0 && x >= 0 && y >= 0) {
            return true;
        }


        if (!sizes)
            return false;
        if (x < 0 || sizes[0] <= x || y < 0 || sizes[1] <= y) {
            return false;
        } else {
            return true;
        }
    },
    _getInitialZoom: function (mapSize) {
        var _this = this;
        var tolerance = 0.8;
        var imageSize;
        // Calculate an offset between the zoom levels and the array accessors
        var offset = _this._imageSizes.length - 1 - _this.options.maxNativeZoom;
        for (var i = _this._imageSizes.length - 1; i >= 0; i--) {
            imageSize = _this._imageSizes[i];
            if (imageSize.x * tolerance < mapSize.x && imageSize.y * tolerance < mapSize.y) {
                return i - offset;
            }
        }
        // return a default zoom
        return 2;
    }
});

L.tileLayer.iiif = function (url, options) {
    return new L.TileLayer.Iiif(url, options);
};
