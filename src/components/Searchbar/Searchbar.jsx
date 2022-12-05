import PropTypes from 'prop-types';

import { Component } from 'react';
import { BsSearch } from 'react-icons/bs';

import Notiflix from 'notiflix';

class Searchbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    text: '',
  };

  handleSubmit = e => {
    e.preventDefault();

    const { text } = this.state;
    const { onSubmit } = this.props;

    onSubmit(text);

    if (text === '') {
      Notiflix.Notify.failure('Please write something.');
    }
  };

  handleChange = e => {
    const { value } = e.currentTarget;

    this.setState({ text: value });
  };

  render() {
    return (
      <header className="searchbar">
        <form className="form" onSubmit={this.handleSubmit}>
          <button type="submit" className="button">
            <BsSearch className="button-label"></BsSearch>
          </button>

          <input
            className="input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;
