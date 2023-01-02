// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';
import axios from 'axios';

// ⚡️ Render Skeleton
const mock = [
  {
    name: 'name',
    src: feather.icons.user.toSvg(),
  },
  {
    name: 'email',
    src: feather.icons['at-sign'].toSvg(),
  },
  {
    name: 'age',
    src: feather.icons.calendar.toSvg(),
  },
  {
    name: 'street',
    src: feather.icons.map.toSvg(),
  },
  {
    name: 'phone',
    src: feather.icons.phone.toSvg(),
  },
  {
    name: 'password',
    src: feather.icons.lock.toSvg(),
  },
];

document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='random-user'>
    <h2>Random User</h2>
    <img src='#' alt='image' data-image=''>
    <p>
      <span data-title=''></span>
      <span data-value=''></span>
    </p>
    <ul>${mock.map(({ name, src }) => `<li><button class='active' data-label='${name}'>${src}</button></li>`).join('')}</ul>
    <button data-submit=''>Generate</button>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      image: document.querySelector('[data-image]'),
      title: document.querySelector('[data-title]'),
      value: document.querySelector('[data-value]'),
      icons: document.querySelectorAll('[data-label]'),
      submit: document.querySelector('[data-submit]'),
    };

    this.PROPS = {
      user: {},
      axios: axios.create({
        baseURL: 'https://randomuser.me/api/',
      }),
    };

    this.fetchData();

    this.DOM.icons.forEach(icon => icon.addEventListener('click', this.iconHandler));
    this.DOM.submit.addEventListener('click', () => this.fetchData());
  }

  /**
   * @function fetchData - Fetch data
   * @returns {Promise<void>}
   */
  fetchData = async () => {
    try {
      const { data: { results } } = await this.PROPS.axios.get();

      this.user = {
        phone: results[0].phone,
        email: results[0].email,
        image: results[0].picture.large,
        street: `${results[0].location.street.number} ${results[0].location.street.name}`,
        password: results[0].login.password,
        name: `${results[0].name.first} ${results[0].name.last}`,
        age: results[0].dob.age,
      };

      this.renderData();

    } catch (e) {
      showNotification('danger', 'Something went wrong, open dev console');
      console.log(e);
    }
  };

  /**
   * @function renderData - Render HTML
   */
  renderData = () => {
    this.DOM.image.src = this.user.image;
    this.DOM.title.textContent = `My ${this.DOM.icons[0].dataset.label} is`;
    this.DOM.value.textContent = this.user.name;
    this.DOM.icons.forEach(icon => icon.classList.remove('active'));
    this.DOM.icons[0].classList.add('active');
  };

  /**
   * @function iconHandler - Icon click event handler
   * @param target
   */
  iconHandler = ({ target }) => {
    console.log(target);
    this.DOM.title.textContent = `My ${target.dataset.label} is`;
    this.DOM.value.textContent = this.user[target.dataset.label];
    this.DOM.icons.forEach(icon => icon.classList.remove('active'));
    target.classList.add('active');
  };
}

// ⚡️Class instance
new App();
