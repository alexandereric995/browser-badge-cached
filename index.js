var browserBadge = require('browser-badge');
var fs = require('fs');
var through = require('through');

function cachedBadgeFilename (browsers) {
    var cacheDir = __dirname + "/badge-cache";
    var browserNames = Object.keys(browsers).sort();
    var fileNameParts = [];
    browserNames.forEach(function (browserName) {
        var browserVersions = Object.keys(browserNames[browserName]).sort();
        browserVersions.forEach(function (browserVersion) {
            fileNameParts.push(browserName + browserVersion + browserVersions[browserVersion] ? 's' : 'f');
        });
    });
    return cacheDir + '/' + fileNameParts.join('-') + '.png';
}

function isCachedBadge (browsers, cb) {
    fs.stat(cachedBadgeFilename(browsers), function (err, stat) {
        if (err) throw err;
        cb(stat.isFile());
    });
}

module.exports = function (cacheDir) {
    return function (browsers) {
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
};

