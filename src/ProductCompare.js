/**
 * Product Comparison Widget
 */

import $ from 'jquery';
import _ from 'lodash';
import trend from 'jquery-trend';
import revealer from 'jquery-revealer';
import EventEmitter from 'eventemitter2';

export default class ProductCompare extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = $.extend({
      scope: '[data-product-compare]',
      maxItems: 4,
      itemTemplate: _.template(`
        <div class="compare-item" data-compare-item>
          <a href="<%= url %>">
            <img class="compare-item-thumbnail" src="<%= thumbnail %>"/>
            <div class="compare-item-price"><%= price %></div>
            <div class="compare-item-title"><%= title %></div>
          </a>
          <button class="compare-item-remove" data-compare-item-remove="<%= id %>">&times;</button>
        </div>
      `),
    }, options);

    this.$scope = $(this.options.scope);
    this.$compareItems = $('[data-compare-items]');
    this.$compareLink = $('[data-compare-link]');

    this.checkbox = '[data-compare-checkbox]';
    this.compareItem = '[data-compare-item]';
    this.compareRemove = 'data-compare-item-remove';

    this._init();
    this._bindEvents();
  }


  /**
   *
   * Set up the compare list Map
   *
   */

  _init() {
    if (sessionStorage.getItem('compare')) {
      this.compareList = new Map(JSON.parse(sessionStorage.getItem('compare')));
      this._initWidget();
    } else {
      this.compareList = new Map();
    }
  }


  /**
   *
   * Bind event handlers for the compare widget
   *
   */

  _bindEvents() {
    this.$scope.on('change', this.checkbox, (event) => {
      this._toggleItem(event.target);
    });

    $('body').on('click', `[${this.compareRemove}]`, (event) => {
      const id = parseInt($(event.target).attr(this.compareRemove), 10);
      this._removeItem(id);

      return false;
    });
  }


  /**
   *
   * Sets the inital state of widget if loading from sessionStorage
   *
   */

  _initWidget() {
    for (const id of this.compareList.keys()) {
      this._checkCheckbox(id);

      this._populateWidget(id);

      this._updateWidgetState();
    }
  }


  /**
   *
   * Updates a checkbox state to "checked"
   *
   * @param {id} number The ID of the item / checkbox to target
   *
   */
  _checkCheckbox(id) {
    $(`[data-compare-id="${id}"]`).prop('checked', true);
  }


  /**
   *
   * Adds an item to the widget
   *
   * @param {id} number The ID of the item it add
   *
   */

  _populateWidget(id) {
    $(this.options.itemTemplate(this.compareList.get(id)))
      .appendTo(this.$compareItems)
      .revealer('show');
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
    const id = parseInt($checkbox.data('compare-id'), 10);
    const productData = {
      id: id,
      title: $checkbox.data('compare-title'),
      url: $checkbox.data('compare-url'),
      price: $checkbox.data('compare-price'),
      thumbnail: $checkbox.data('compare-thumbnail'),
    };

    // Add / remove item from compare list
    if (checkbox.checked) {
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
   * @param {object} productData Object containing the data of a compare item
   *
   */

  _addItem(id, productData) {
    this.emit('beforeadd', id);

    this.compareList.set(id, productData);

    this._populateWidget(id);

    this._updateWidgetState();

    this.emit('afteradd', id);
  }


  /**
   *
   * Removes an item from the compare list
   *
   * @param {number} id The ID of the item to remove
   *
   */

  _removeItem(id) {
    this.emit('beforeremove', id);

    this.compareList.delete(id);

    this.$compareItems
      .find(`[${this.compareRemove}=${id}]`)
      .closest(this.compareItem)
      .revealer('hide');

    $(this.compareItem).on('revealer-hide', (event) => {
      $(event.currentTarget).remove();
    });

    // Uncheck the checkbox if removed via button
    $(`[data-compare-id="${id}"]`).prop('checked', false);

    this._updateWidgetState();

    this.emit('afterremove', id);
  }


  /**
   *
   * Public method to clear the list and widget items
   *
   */

  removeAll() {
    for (const id of this.compareList.keys()) {
      this._removeItem(id);
    }
  }


  /**
   *
   * Sets each checkbox in the compare list to "checked". 
   * Useful if products are loaded dynamically and the widget is already initialized.
   *
   */

  updateCheckboxes() {
    for (const id of this.compareList.keys()) {
      this._checkCheckbox(id);
    }
  }


  /**
   *
   * Updates the compare widget state
   *
   */

  _updateWidgetState() {
    const compareLength = this.compareList.size;

    // Toggle widget state class
    $('[data-compare-widget]').toggleClass('is-enabled', !!compareLength);

    // Toggle compare link class
    this.$compareLink.toggleClass('is-disabled', (compareLength <= 1));

    // Set compare link href
    this.$compareLink.attr('href', `${this.$compareLink.data('compare-link')}/${[...this.compareList.keys()].join('/')}`);

    // Save the compare data for later
    sessionStorage.setItem('compare', JSON.stringify([...this.compareList]));

    this.emit('updated');
  }


  /**
   *
   * Over-ride EventEmitter's "on" method so that events can be fired immediately after they're bound
   *
   */

  on(eventName, handler, fireOnBind = false) {
    super.on(eventName, handler);
    if (fireOnBind) {
      this.emit(eventName);
    }
  }
}
