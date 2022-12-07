import { Component } from 'react';

import '../styles.css';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';

export class App extends Component {
  state = {
    imageName: '',
  };

  handleSearchSubmit = imageName => {
    this.setState({ imageName });
  };

  render() {
    const { imageName } = this.state;

    return (
      <div className="app">
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery imageName={imageName}></ImageGallery>
      </div>
    );
  }
}
