var browserBadge = require('browser-badge');
var fs = require('fs');
var through = require('through');
var path = require('path');

function cachedBadgeFilename (cacheDir, browsers) {
    var browserNames = Object.keys(browsers).sort();
    var fileNameParts = [];
    browserNames.forEach(function (browserName) {
        var browserVersions = Object.keys(browsers[browserName]).sort();
        browserVersions.forEach(function (browserVersion) {
            var browser = browserName.substr(0,1) + browserVersion;
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
        var fileName = cachedBadgeFilename(cacheDir, browsers);
        out.fileName = path.basename(fileName);
        isCachedBadge(cacheDir, browsers, function (isCached) {
            if (isCached) {
                fs.createReadStream(fileName).pipe(out);
            }
            else {
                var b = browserBadge(browsers);
                var fileOut = fs.createWriteStream(fileName);
                var target = through();
                target.pipe(fileOut);
                target.pipe(out);
                b.pipe(target);
                b.on('error', function (err) {
                    out.emit('error', err);
                    fs.unlink(fileName, function (err) {
                        if (err) out.emit('error', err);
                    });
                });
            }
        });
        return out;
    }
};

