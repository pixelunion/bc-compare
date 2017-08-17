# Bigcommerce Product Compare Module

Session-based product compare widget

## Installation

```
npm i --save bitbucket:pixelunion/bc-compare
```

## Usage

### Templates

This module is made up of 2 template components. The compare checkbox and the compare widget. The templates rely on `data` attributes as hooks for the JS, so they need to be included, but the structure is completely up to you.

#### Checkbox

Add a checkbox to your product grid items with the appropriate `data` attributes. No form necessary!

```
<input
  type="checkbox"
  data-compare-checkbox
  data-compare-id="{{id}}"
  data-compare-title="{{name}}"
  data-compare-url="{{url}}"
  data-compare-price="{{price}}"
  data-compare-thumbnail="{{getImage image 'thumb' (cdn default_image)}}">
```
Ideally the thumb that you are using will be the same size as the one that has already been loaded into the page.

#### Scope

Scope / container of items to compare: `[data-product-compare]`

#### Widget

Container that the compare items will be injected into.

```
<div data-compare-widget>
  <span class="compare-title">{{lang 'compare.title' num=0}}</span>
  <a href="{{urls.compare}}" data-compare-link="{{urls.compare}}">{{lang 'core.product.compare'}}</a>
  <div data-compare-items>
	<!-- Compare items injected here -->
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

  compare.on('beforeadd', (id) => {
    console.log('compare before add');
  });

  compare.on('afteradd', (id) => {
    console.log('compare after add');
    console.log(`${compare.compareList.get(id).title} added to compare`);
  });

  compare.on('beforeremove', (id) => {
    console.log('compare before remove');
  });

  compare.on('afterremove', (id) => {
    console.log('compare after remove');
  });

  compare.on('updated', () => {
    console.log('compare updated');
    const compareMessage = this.context.compareTitle.replace('*num*', compare.compareList.size);
    $('.compare-title').text(compareMessage);

    if (compare.compareList.size > 0) {
      $('[data-compare-widget]').show();
    } else {
      $('[data-compare-widget]').hide();
    }
  }, true);

  $('.compare-remove-all').on('click', () => {
    compare.removeAll();
  });
}

```


## Options & Defaults
##### `scope`
default: `'[data-product-compare]'`

**Important: the scope selector must be added into your markup for the module to function**

The container of the product list items - should be set to wrap the faceted search / dynamic content area.

For example: 
`<section class="product-list" data-facet-content {{#if category.show_compare}}data-product-compare{{/if}}>`

##### `maxItems`
default: `4`

You can set the `maxItems`, which will remove the oldest compare item from the list, when it's value is exceeded.

##### `itemTemplate`
default:

```
_.template(`
  <div class="compare-item" data-compare-item>
    <a href="<%= url %>">
      <img class="compare-item-thumbnail" src="<%= thumbnail %>"/>
      <div class="compare-item-price"><%= price %></div>
      <div class="compare-item-title"><%= title %></div>
    </a>
    <button class="compare-item-remove" data-compare-item-remove="<%= id %>">&times;</button>
  </div>
`)
```
Custom lodash `itemTemplate`. The properties of `url, thumbnail, title, id, price` are available.


## Events

See the _JavaScript_ section above for a list of events that are available.
Note that all the add/remove events have the `id` available as an argument in the callback.

## Classes
* The compare widget has the `is-enabled` class added to it when there are items in the compare list. 
* The compare link has the `is-disabled` class added to it when there are less than 2 items in the compare list. 

## Methods

##### `on`
This is an extension of EventEmitter's `on` method. The only difference is that it accepts a third parameter, which allows the event to be fired immediately after binding it. This is primarily useful with the `enabled` and `updated` events so that the state of the widget is correct when loaded from `sessionStorage`.

##### `removeAll`
Removes all items from the compare list.

##### `updateCheckboxes`
Updates any checkboxes on the page to the correct "checked" state. Useful if products are loaded dynamically and the widget is already initialized.

## Further Development

The original src of the module is still JSPM, but the demo is built on webpack

Install:

```
npm install

jspm install 
```

Build out compiled script (for use with webpack - /dist/js/ProductCompare.js) :

```
gulp bundle
```

Demo:

```
webpack --watch

npm run serve
```