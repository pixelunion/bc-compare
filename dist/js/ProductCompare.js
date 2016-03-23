/**
 * Product Comparison Widget
 */

import $ from 'jquery';
import _ from 'lodash';
import 'jquery-trend';
import 'jquery-revealer';
import EventEmitter from 'asyncly/EventEmitter2';

export default class ProductCompare extends EventEmitter {
  constructor(options = {}, messages) {
    super();

    this.messages = messages;

    this.options = $.extend({
      scope: '[data-product-compare]',
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
    }, options);

    this.$scope = $(this.options.scope);
    this.$checkbox = $(this.options.checkbox);
    this.$compareWidget = $(this.options.compare.widget);
    this.$compareItems = $(this.options.compare.items);
    this.$compareLink = $(this.options.compare.link);
    this.compareRemove = this.options.compare.remove;

    if (sessionStorage.getItem('compare')) {
      this.compareList = new Map(JSON.parse(sessionStorage.getItem('compare')));
      this._initWidget();
    } else {
      this.compareList = new Map();
    }

    this._bindEvents();
  }


  /**
   *
   * Bind event handlers for the compare widget
   *
   */

  _bindEvents() {
    this.$scope.on('change', this.options.checkbox, (event) => {
      this._toggleItem(event.target);
    });

    $('body').on('click', `[${this.compareRemove}]`, (event) => {
      event.preventDefault();

      const id = parseInt($(event.target).attr(this.compareRemove), 10);
      this._removeItem(id);
    });
  }


  /**
   *
   * Sets the inital state of widget if loading from sessionStorage
   *
   */

  _initWidget() {
    for (const id of this.compareList.keys()) {
      $(`[data-compare-id="${id}"]`).prop('checked', true);

      this._populateWidget(id);
    }
  }


  /**
   *
   * Adds an items to the widget
   *
   * @param {id} number The ID of the item it add
   *
   */

  _populateWidget(id) {
    // TODO change this to revealer
    this.$compareItems.append(this.options.itemTemplate(this.compareList.get(id)));
  }


  /**
   *
   * Controls whether to add or remove a product from the compare list
   *
   * @param {string} checkbox The checkbox (dom element)
   *
   */

  _toggleItem(checkbox) {
    const $checkbox = $(checkbox);
    const id = parseInt($checkbox.data(this.options.product.id), 10);
    const productData = {
      id: id,
      title: $checkbox.data(this.options.product.title),
      url: $checkbox.data(this.options.product.url),
      thumbnail: $checkbox.data(this.options.product.thumbnail),
    };

    // Add / remove item from compare list
    if (checkbox.checked) {
      //this.compareList.set(id, productData);
      this._addItem(id, productData);

      // Generate an array of the compare IDs so we can target the first item
      const compareIds = [...this.compareList.keys()];

      // Remove the first item from the list if > maxItems
      if (this.compareList.size > this.options.maxItems) {
        const firstItem = compareIds[0];
        this._removeItem(firstItem);
      }
    } else {
      this._removeItem(id);
    }
  }


  /**
   *
   * Adds an item to the compare list
   *
   * @param {number} id The ID of the item to add
   *
   */

  _addItem(id, productData) {
    this.emit('beforeadd');

    this.compareList.set(id, productData);

    this._populateWidget(id);

    this._updateWidgetState();

    this.emit('afteradd');
  }


  /**
   *
   * Removes an item from the compare list
   *
   * @param {number} id The ID of the item to remove
   *
   */

  _removeItem(id) {
    this.emit('beforeremove');

    this.compareList.delete(id);

    // TODO change this to revealer
    this.$compareItems.find(`[${this.compareRemove}=${id}]`).closest(`[${this.options.compare.item}]`).remove();

    // Uncheck the checkbox if removed via button
    $(`[data-compare-id="${id}"]`).prop('checked', false);

    this._updateWidgetState();

    this.emit('afterremove');
  }


  /**
   *
   * Public method to clear the list and widget items
   *
   */

  removeAll() {
    this.compareList.clear();

    // TODO revealer?
    this.$compareItems.html('');

    this._updateWidgetState();
  }


  /**
   *
   * Updates the compare widget state
   *
   */

  _updateWidgetState() {
    const compareLength = this.compareList.size;

    // Emit widget state events
    compareLength < 1 ? this.emit('disabled') : this.emit('enabled');

    // Toggle compare link class
    this.$compareLink.toggleClass('is-disabled', (compareLength <= 1));

    // Set compare link href
    this.$compareLink.attr('href', `${this.$compareLink.data('compare-link')}/${[...this.compareList.keys()].join('/')}`);

    // Save the compare data for later
    sessionStorage.setItem('compare', JSON.stringify([...this.compareList]));

    this.emit('updated');
  }
}
