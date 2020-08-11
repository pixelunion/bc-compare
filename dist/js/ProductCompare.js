'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash.template');

var _lodash2 = _interopRequireDefault(_lodash);

var _jqueryTrend = require('jquery-trend');

var _jqueryTrend2 = _interopRequireDefault(_jqueryTrend);

var _jqueryRevealer = require('jquery-revealer');

var _jqueryRevealer2 = _interopRequireDefault(_jqueryRevealer);

var _eventemitter = require('eventemitter2');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Product Comparison Widget
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProductCompare = function (_EventEmitter) {
  _inherits(ProductCompare, _EventEmitter);

  function ProductCompare() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ProductCompare);

    var _this = _possibleConstructorReturn(this, (ProductCompare.__proto__ || Object.getPrototypeOf(ProductCompare)).call(this));

    _this.options = _jquery2.default.extend({
      scope: '[data-product-compare]',
      maxItems: 4,
      itemTemplate: (0, _lodash2.default)('\n        <div class="compare-item" data-compare-item>\n          <a href="<%= url %>">\n            <img class="compare-item-thumbnail" src="<%= thumbnail %>"/>\n            <div class="compare-item-price"><%= price %></div>\n            <div class="compare-item-title"><%= title %></div>\n          </a>\n          <button class="compare-item-remove" data-compare-item-remove="<%= id %>">&times;</button>\n        </div>\n      ')
    }, options);

    _this.$scope = (0, _jquery2.default)(_this.options.scope);
    _this.$compareItems = (0, _jquery2.default)('[data-compare-items]');
    _this.$compareLink = (0, _jquery2.default)('[data-compare-link]');

    _this.checkbox = '[data-compare-checkbox]';
    _this.compareItem = '[data-compare-item]';
    _this.compareRemove = 'data-compare-item-remove';

    _this._init();
    _this._bindEvents();
    return _this;
  }

  /**
   *
   * Set up the compare list Map
   *
   */

  _createClass(ProductCompare, [{
    key: '_init',
    value: function _init() {
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

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      this.$scope.on('change', this.checkbox, function (event) {
        _this2._toggleItem(event.target);
      });

      (0, _jquery2.default)('body').on('click', '[' + this.compareRemove + ']', function (event) {
        var id = parseInt((0, _jquery2.default)(event.target).attr(_this2.compareRemove), 10);
        _this2._removeItem(id);

        return false;
      });
    }

    /**
     *
     * Sets the inital state of widget if loading from sessionStorage
     *
     */

  }, {
    key: '_initWidget',
    value: function _initWidget() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.compareList.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var id = _step.value;

          this._checkCheckbox(id);

          this._populateWidget(id);

          this._updateWidgetState();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     *
     * Updates a checkbox state to "checked"
     *
     * @param {id} number The ID of the item / checkbox to target
     *
     */

  }, {
    key: '_checkCheckbox',
    value: function _checkCheckbox(id) {
      (0, _jquery2.default)('[data-compare-id="' + id + '"]').prop('checked', true);
    }

    /**
     *
     * Adds an item to the widget
     *
     * @param {id} number The ID of the item it add
     *
     */

  }, {
    key: '_populateWidget',
    value: function _populateWidget(id) {
      (0, _jquery2.default)(this.options.itemTemplate(this.compareList.get(id))).appendTo(this.$compareItems).revealer('show');
    }

    /**
     *
     * Controls whether to add or remove a product from the compare list
     *
     * @param {string} checkbox The checkbox (dom element)
     *
     */

  }, {
    key: '_toggleItem',
    value: function _toggleItem(checkbox) {
      var $checkbox = (0, _jquery2.default)(checkbox);
      var id = parseInt($checkbox.data('compare-id'), 10);
      var productData = {
        id: id,
        title: $checkbox.data('compare-title'),
        url: $checkbox.data('compare-url'),
        price: $checkbox.data('compare-price'),
        thumbnail: $checkbox.data('compare-thumbnail')
      };

      // Add / remove item from compare list
      if (checkbox.checked) {
        this._addItem(id, productData);

        // Generate an array of the compare IDs so we can target the first item
        var compareIds = [].concat(_toConsumableArray(this.compareList.keys()));

        // Remove the first item from the list if > maxItems
        if (this.compareList.size > this.options.maxItems) {
          var firstItem = compareIds[0];
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

  }, {
    key: '_addItem',
    value: function _addItem(id, productData) {
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

  }, {
    key: '_removeItem',
    value: function _removeItem(id) {
      this.emit('beforeremove', id);

      this.compareList.delete(id);

      this.$compareItems.find('[' + this.compareRemove + '=' + id + ']').closest(this.compareItem).revealer('hide');

      (0, _jquery2.default)(this.compareItem).on('revealer-hide', function (event) {
        (0, _jquery2.default)(event.currentTarget).remove();
      });

      // Uncheck the checkbox if removed via button
      (0, _jquery2.default)('[data-compare-id="' + id + '"]').prop('checked', false);

      this._updateWidgetState();

      this.emit('afterremove', id);
    }

    /**
     *
     * Public method to clear the list and widget items
     *
     */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.compareList.keys()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var id = _step2.value;

          this._removeItem(id);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     *
     * Sets each checkbox in the compare list to "checked".
     * Useful if products are loaded dynamically and the widget is already initialized.
     *
     */

  }, {
    key: 'updateCheckboxes',
    value: function updateCheckboxes() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.compareList.keys()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var id = _step3.value;

          this._checkCheckbox(id);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     *
     * Updates the compare widget state
     *
     */

  }, {
    key: '_updateWidgetState',
    value: function _updateWidgetState() {
      var compareLength = this.compareList.size;

      // Toggle widget state class
      (0, _jquery2.default)('[data-compare-widget]').toggleClass('is-enabled', !!compareLength);

      // Toggle compare link class
      this.$compareLink.toggleClass('is-disabled', compareLength <= 1);

      // Set compare link href
      this.$compareLink.attr('href', this.$compareLink.data('compare-link') + '/' + [].concat(_toConsumableArray(this.compareList.keys())).join('/'));

      // Save the compare data for later
      sessionStorage.setItem('compare', JSON.stringify([].concat(_toConsumableArray(this.compareList))));

      this.emit('updated');
    }

    /**
     *
     * Over-ride EventEmitter's "on" method so that events can be fired immediately after they're bound
     *
     */

  }, {
    key: 'on',
    value: function on(eventName, handler) {
      var fireOnBind = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      _get(ProductCompare.prototype.__proto__ || Object.getPrototypeOf(ProductCompare.prototype), 'on', this).call(this, eventName, handler);
      if (fireOnBind) {
        this.emit(eventName);
      }
    }
  }]);

  return ProductCompare;
}(_eventemitter2.default);

exports.default = ProductCompare;