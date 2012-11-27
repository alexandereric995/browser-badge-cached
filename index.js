var browserBadge = require('browser-badge');
var mkdirp = require('mkdirp');
var fs = require('fs');

function checkCacheDir (dir, cb) {
    fs.stat(dir, function (err, stat) {
        if (err) throw err;
        if (!stat.isDirectory()) {
            mkdirp(cacheDir, function (err) {
                if (err) throw err;
            });
        }
        cb();
    });
}

function cachedBadgeFilename (browsers) {
    return 'x.png';
}

function cachedBadge (browsers, cb) {
    checkCacheDir(browsers, function () {
        fs.stat(cachedBadgeFilename(browsers), function (err, stat) {
            if (err) throw err;
            cb(stat.isFile());
        });
    });
}

module.exports = function (cacheDir) {
    // module.exports returns this function that emulates the browser-badge api
    return function (browsers) {
        // however I can't get it to return the stream because it's deeper in here .
        if (cachedBadge(browsers, function (isCached))) {                       // |
            if (isCached) {                                                     // |
                return fs.createReadStream(cachedBadgeFilename(browsers)); // <----|
            }
            else {
                return browserBadge(browsers);
            }
        }
    };
}

