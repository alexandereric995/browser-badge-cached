var browserBadge = require('browser-badge');
var fs = require('fs');
var through = require('through');

function cachedBadgeFilename (cacheDir, browsers) {
    var browserNames = Object.keys(browsers).sort();
    var fileNameParts = [];
    browserNames.forEach(function (browserName) {
        var browserVersions = Object.keys(browsers[browserName]).sort();
        browserVersions.forEach(function (browserVersion) {
            fileNameParts.push(browserName + browserVersion + browserVersions[browserVersion] ? 's' : 'f');
        });
    });
    return cacheDir + '/' + fileNameParts.join('-') + '.png';
}

function isCachedBadge (cacheDir, browsers, cb) {
    fs.stat(cachedBadgeFilename(cacheDir, browsers), function (err, stat) {
        if (err) cb(err);
        cb(null, stat.isFile());
    });
}

module.exports = function (cacheDir) {
    return function (browsers) {
        var out = through();
        isCachedBadge(cacheDir, browsers, function (err, isCached) {
            if (err) {
               out.emit('error', err);
               return;
            }

            if (isCached) {
                fs.createReadStream(cachedBadgeFilename(cacheDir, browsers)).pipe(out);
            }
            else {
                browserBadge(browsers).pipe(out);
            }
        });
        return out;
    }
};

