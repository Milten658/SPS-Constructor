const options = document.querySelectorAll('.posluga_wrapper');
const body = document.body;

options.forEach(option => {
  option.addEventListener('click', () => {

    const form = option.nextElementSibling;
    const isOpen = option.classList.contains('active');

    options.forEach(o => o.classList.remove('active'));
    document.querySelectorAll('.posluga_form').forEach(f => {
      f.style.height = '0px';
    });

    body.classList.remove('remont', 'obmin');

    if (!isOpen) {
      option.classList.add('active');
      form.style.height = form.scrollHeight + 'px';

      const name = option.dataset.name;

      if (name) {
        body.classList.add(name);
        function updateLittleP(name) {
  littlePs.forEach(el => {
    const text = el.dataset[name];
    if (text) {
      el.textContent = text;
    }
  });
}
      }
    }
  });
});

const warrantyCheckbox = document.getElementById('warranty_checkbox');
const warrantyFields = document.querySelectorAll('.warranty_fields select');

const nonWarrantyCheckbox = document.getElementById('nonwarranty_checkbox');
const nonWarrantyFields = document.querySelectorAll('.nonwarranty_fields select');

function toggleFields(checkbox, fields) {
  fields.forEach(field => {
    field.disabled = !checkbox.checked;
  });
}

warrantyCheckbox.addEventListener('change', () => {
  toggleFields(warrantyCheckbox, warrantyFields);
});

nonWarrantyCheckbox.addEventListener('change', () => {
  toggleFields(nonWarrantyCheckbox, nonWarrantyFields);
});