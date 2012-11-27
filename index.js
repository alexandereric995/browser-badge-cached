var browserBadge = require('browser-badge');
var mkdirp = require('mkdirp');
var fs = require('fs');
var through = require('through');

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

function isCachedBadge (browsers, cb) {
    fs.stat(cachedBadgeFilename(browsers), function (err, stat) {
        if (err) throw err;
        cb(stat.isFile());
    });
}

module.exports = function (cacheDir) {
    checkCacheDir(cacheDir, function () {
        return function (browsers) {            // this function should be returned from above function
            var out = through(function () {
                isCachedBadge(browsers, function (isCached) {
                    if (isCached) {
                        fs.createReadStream(cachedBadgeFilename(browsers)).pipe(out);
                    }
                    else {
                        browserBadge(browsers).pipe(out);
                    }
                });
            });
            return out;
        }
    });
};

