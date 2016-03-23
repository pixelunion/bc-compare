# Bigcommerce Product Compare Module

Session-based product compare widget

## Installation

```
jspm install --save bc-compare=bitbucket:pixelunion/bc-compare
```

## Usage

### Templates

This module is made up of 2 template components. The compare checkbox and the compare widget.

#### Checkbox

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


#### Widget

Container that the compare items will be inject into.

```
<div data-compare-widget>
  <h6 class="compare-title">{{lang 'compare.title' num=0}}</h6>
  `<a href="{{urls.compare}}" data-compare-link="{{urls.compare}}">{{lang 'core.product.compare'}}</a>
  <div data-compare-items>

  </div>
</div>
```

### JavaScript 

Import the compare class in your theme JS (Category / ProductListing or Global).

```
import ProductCompare from 'bc-compare';
```

Below is an example of instantiation and event handlers. Note that once Compare is instantiated, you have access to the `compareList` Map, meaning you can directly access the compare item data in your event handlers. This is useful for things like counting the number of items in the compare list, retrieving the name of the most recently added product, etc.

```
loaded(next) {
  if ($('.compare-enabled').length) {
    this._initCompare();
  }

  next();
}
 
_initCompare() {
  const compare = new ProductCompare({
    maxItems: 3,
  });

  compare.on('beforeadd', () => {
    console.log('compare before add');
  });

  compare.on('afteradd', () => {
    console.log('compare after add');
    const compareIds = [...compare.compareList.keys()];
    const addedId = compareIds[compareIds.length - 1];
    console.log(compare.compareList.get(addedId).title);
  });

  compare.on('beforeremove', () => {
    console.log('compare before remove');
  });

  compare.on('afterremove', () => {
    console.log('compare after remove');
  });

  compare.on('enabled', () => {
    console.log('compare enabled');
    $('[data-compare-widget]').show();
  }, true);

  compare.on('disabled', () => {
    console.log('compare disabled');
    $('[data-compare-widget]').hide();
  });

  compare.on('updated', () => {
    console.log('compare updated');
    const compareMessage = this.context.compareTitle.replace('*num*', compare.compareList.size);
    $('.compare-title').text(compareMessage);
  }, true);

  $('.compare-remove-all').on('click', () => {
    compare.removeAll();
  });
}

```


## Options & Defaults
Most of the options are selectors that you likely won't need to change if you structure your html as above. You can also set the `maxItems` option, which will remove the oldest compare item from the list, when it's value is exceeded. You can also use a custom lodash `itemTemplate` with the properties of `url, thumbnail, title, id` being available.

```
scope: '[data-product-compare]',`
checkbox: '[data-compare-checkbox]',
product: {
  id: 'compare-id',
  title: 'compare-title',
  url: 'compare-url',
  thumbnail: 'compare-thumbnail',
},
compare: {
  widget: '[data-compare-widget]',
  items: '[data-compare-items]',
  item: 'data-compare-item',
  remove: 'data-compare-item-remove',
  link: '[data-compare-link]',
},
maxItems: 4,
itemTemplate: _.template(`
  <div data-compare-item>
    <a href="<%= url %>">
      <img src="<%= thumbnail %>"/>
      <div><%= title %></div>
    </a>
    <button data-compare-item-remove="<%= id %>">X</button>
  </div>
`),
```


## Events

See the _JavaScript_ section above for a list of events that are available.

## Methods

##### `on`
This is an extension of EventEmitter's `on` method. The only difference is that it accepts a third parameter, which allows the event to be fired immediately after binding it. This is primarily useful with the `enabled` and `updated` events so that the state of the widget is correct when loaded from `sessionStorage`.

##### `removeAll`
Removes all items from the compare list. 

## Further Development

Not sure what the best approach is here, since the module needs BC data.
 
