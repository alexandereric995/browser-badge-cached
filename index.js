var browserBadge = require('browser-badge');
var fs = require('fs');
var through = require('through');

function cachedBadgeFilename (cacheDir, browsers) {
    var browserNames = Object.keys(browsers).sort();
    var fileNameParts = [];
    browserNames.forEach(function (browserName) {
        var browserVersions = Object.keys(browsers[browserName]).sort();
        browserVersions.forEach(function (browserVersion) {
            var browser = browserName + browserVersion;
            var success = browsers[browserName][browserVersion] ? 's' : 'f';
            fileNameParts.push(browser + success);
        });
    });
    return cacheDir + '/' + fileNameParts.join('-') + '.png';
}

function isCachedBadge (cacheDir, browsers, cb) {
    fs.stat(cachedBadgeFilename(cacheDir, browsers), function (err, stat) {
        if (err) cb(false);
        else cb(true);
    });
}

module.exports = function (cacheDir) {
    return function (browsers) {
        var out = through();
        isCachedBadge(cacheDir, browsers, function (isCached) {
            if (isCached) {
                fs.createReadStream(cachedBadgeFilename(cacheDir, browsers)).pipe(out);
            }
            else {
                var b = browserBadge(browsers);
                var fileName = cachedBadgeFilename(cacheDir, browsers);
                var fileOut = fs.createWriteStream(fileName);
                b.pipe(fileOut);
                b.pipe(out);
                b.on('error', function () {
                    fs.unlink(fileName, function (err) {
                        if (err) out.emit('error', err);
                    });
                }
            }
        });
        return out;
    }
};

