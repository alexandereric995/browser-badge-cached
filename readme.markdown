# browser-badge

Generate browser version compatibility badges or serve them from cache.

# cache dir must exist

Make sure the cache dir exists. This library doesn't create a cache dir for you.

# methods

``` js
var browserBadgeCached = require('browser-badge-cached')(cacheDir)
```

Then use it just like [browser-badge](https://github.com/substack/browser-badge).

## browserBadgeCached(cacheDir)

Return a readable stream of png data from the browser version compatability
object `browsers`.

`browsers` should map browser names to maps of versions to booleans expressing
compatbility.

# install

To install the library with [npm](http://npmjs.org) do:

```
npm install browser-badge-cached
```
