# Adjust Source-map Loader

[![NPM](https://nodei.co/npm/adjust-sourcemap-loader.png)](http://github.com/bholloway/adjust-sourcemap-loader)

Webpack loader that adjusts source maps.

## Usage

``` javascript
require('adjust-sourcemap?format=absolute!babel?sourceMap');
```

### Source maps required

Note that **source maps** must be enabled on any preceding loader. In the above example we use `babel?sourceMap`.

### Apply via webpack config

It is preferable to adjust your `webpack.config` so to avoid having to prefix every `require()` statement:

``` javascript
module.exports = {
  module: {
    loaders: [
      {
        test   : /\.js/,
        loaders: ['adjust-sourcemap?format=absolute', 'babel?sourceMap']
      }
    ]
  }
};
```

### Options

Options may be set using [query parameters](https://webpack.github.io/docs/using-loaders.html#query-parameters) or by using [programmatic parameters](https://webpack.github.io/docs/how-to-write-a-loader.html#programmable-objects-as-query-option). Programmatic means the following in your `webpack.config`.

``` javascript
module.exports = {
   adjustSourcemapLoader: {
      ...
   }
}
```

Where `...` is a hash of any of the following options.

* **`debug`** : `boolean|RegExp` May be used alone (boolean) or with a `RegExp` to match the resource(s) you are interested in debugging.

* **`format`** : `string` Optional output format for source-map `sources`. Must be the camel-case name of one of the available `codecs`. Omitting the format will result in **no changes** to the source-map.

* **`root`** : `boolean` A boolean flag that indices that a `sourceRoot` path sould be included in the output map. This is contingent on a `format` being specified.

* **`codecs`** : `Array.<{name:string, decode:function, encode:function, root:function}>` Optional Array of codecs. There are a number of built-in codecs available.

Note that query parameters take precedence over programmatic parameters.

Built-in codecs that may be specified as a format include `absolute`, `bowerComponent`, `outputRelative`, `projectRelative`, `sourceRelative`, `webpackProtocol`.

## How it works

The loader will receive a source map as the second parameter where the preceding loader created one.

The exception is the **css-loader** where the source-map is in the content, which is not currently supported.

The source-map `sources` are parsed by applying **codec.decode()** functions until one of them returns an absolute path to a file that exists.

If a format is specified then the source-map `sources` are recreated by applying the **codec.encode()** function for the stated `format`.

So long as a format is specified, the `root` option implies that the **codec.root()** function is set the source-map `sourceRoot`. Otherwise `sourceRoot` is omitted from the new source-map.

