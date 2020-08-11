import $ from 'jquery';
import ProductCompare from '../../dist/js/ProductCompare';

$(function () {
  for (let i = 6; i > 0; i--) {
    const product = template(`
      <article class="product">
        <img src="./demo/img/<%- value %>.jpg" />
        <h1>Product <%- value %></h1>
        <h4>$100</h4>
        <label>
          <input
            type="checkbox"
            data-compare-checkbox
            data-compare-id="<%- value %>"
            data-compare-title="Product <%- value %>"
            data-compare-price="$100"
            data-compare-url="http://google.ca"
            data-compare-thumbnail="./demo/img/<%- value %>.jpg">

          Compare
        </label>
      </article>
    `);

    $('.products').prepend(product({ value: i }));
  }

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

  compare.on(
    'updated',
    () => {
      console.log('compare updated');
      $('.compare-title .num-items').text(compare.compareList.size);

      if (compare.compareList.size > 0) {
        $('[data-compare-widget]').show();
      } else {
        $('[data-compare-widget]').hide();
      }
    },
    true
  );

  $('.compare-remove-all').on('click', () => {
    compare.removeAll();
  });
});
