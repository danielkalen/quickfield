# QuickField
[![Build Status](https://travis-ci.org/danielkalen/quickdom.svg?branch=master)](https://travis-ci.org/danielkalen/quickdom)
[![Coverage](.config/badges/coverage.png?raw=true)](https://github.com/danielkalen/quickdom)
[![Code Climate](https://codeclimate.com/github/danielkalen/quickdom/badges/gpa.svg)](https://codeclimate.com/github/danielkalen/quickdom)
[![NPM](https://img.shields.io/npm/v/quickdom.svg)](https://npmjs.com/package/quickdom)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/quickdom.svg)](https://saucelabs.com/u/quickdom)

Note: this library is still under development stage and is being processed through heavy real-world battle testing. Full documentation will be released once this module is ready for alpha release.


## Usage
```javascript
let quickfield = require('quickfield')

let field = quickfield({type:'text', label:'Full Name', placeholder:'John Doe'})
field.appendTo(document.body);

field.value = 'abc123' //-> sets field value
console.log(field.value) //-> 'abc123'
```

## API
#### `quickfield(settings)`
`settings` is a required argument and represents the configuration of your field. There are various settings that are shared amongst all fields (a.k.a. global settings):

##### fontFamily
Type: `string`
Default: `system-ui, sans-serif`
Font family to use for field UI.

##### templates
Type: `object`
Default: `{}`

##### events
Type: `object`

##### label
Type: `string|boolean`
Default: `false`
Acts as the field's label. Use `false` to disable.

##### error
Type: `string`
Default: ``

The default error message to show when field is invalid or `field.state.error = true`

##### help
Type: `string`
Default: ``

The default help message to show when field `field.state.showHelp = true`

##### required
Type: `boolean`
Default: `false`

##### disabled
Type: `string`
Default: `false`

##### defaultValue
Type: `string`

##### width
Type: `string`
Default: `'100%'`

##### mobileWidth
Type: `string`

##### mobileThreshold
Type: `string`
Default: `736`

##### border
Type: `string`
Default: `1`

##### margin
Type: `string`

##### padding
Type: `string`

##### distance
Type: `string`

##### inputPadding
Type: `string`
Default: `12`

##### fontSize
Type: `string`
Default: `14`

##### labelSize
Type: `string`

##### icon
Type: `string`

##### iconSize
Type: `string`
Default: `22`

##### getter
Type: `string`

##### setter
Type: `string`

##### validator
Type: `string`

##### clearErrorOnValid
Type: `string`
Default: `true`

##### makeRoomForHelp
Type: `string`
Default: `true`
