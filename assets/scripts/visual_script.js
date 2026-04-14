const search_input = document.querySelector('.top_search');
const search_field = document.querySelector('.search_field');




if (search_input && search_field) {

  search_input.addEventListener('focus', () => {
    search_field.classList.add('active');
  });

  search_input.addEventListener('blur', () => {
    setTimeout(() => {
      search_field.classList.remove('active');
    }, 150);
  });

}
const openPopup = document.querySelector('.configure');
const closeButtons = document.querySelectorAll('.popup_close');
const popup = document.getElementById('popup');

openPopup.addEventListener('click', () => {
  popup.classList.add('active');
});

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    popup.classList.remove('active');
  });
});