# Bigcommerce Product Compare Module

Session-based product compare widget

## Installation

```
jspm install --save bc-compare=bitbucket:pixelunion/bc-compare
```

## Usage
This module is made up of 2 template components. The compare checkbox and the compare widget.

### Checkbox

Add a checkbox to your product grid items with the appropriate `data` attributes. No form necessary!

```
<input
  type="checkbox"
  data-compare-checkbox
  data-compare-id="{{id}}"
  data-compare-title="{{name}}"
  data-compare-url="{{url}}"
  data-compare-thumbnail="{{getImage image 'thumb' (cdn default_image)}}">
```
Ideally the thumb that you are using will be the same size as the one that has already been loaded into the page.


### Widget




## Options


## Events

## Further Development

Since this module is dependent on BC data, further development can be done using an existing theme (ie. bc-skeleton).

* Clone bc-compare
* Checkout the compare branch in bc-skeleton (ProductCompare is instantiated in Category.js)
* Create a symlink for ProductCompare.js (browsersync won't work though):
`ln -s /xxx/xxx/bc-compare/dist/js/ProductCompare.js /xxx/xxx/bc-skeleton/assets/js/theme/components`
* Start developing
 
