import { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles.css';
import Status from 'status';

import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';

import fetchImages from 'fetchImages';

export class App extends Component {
  static propTypes = {
    imageName: PropTypes.string.isRequired,
  };

  state = {
    imageName: '',
    images: [],
    page: 1,
    error: null,
    status: Status.IDLE,
    isShowBtn: false,
  };

  getImages = () => {
    const { imageName, page } = this.state;

    this.setState({ status: Status.PENDING });

    fetchImages(imageName, page)
      .then(({ data }) =>
        this.setState(({ images }) => {
          const imagesValue = images.concat(data.hits);

          return {
            isShowBtn: data.total > imagesValue.length,
            images: imagesValue.map(({ id, webformatURL, largeImageURL }) => ({
              id,
              webformatURL,
              largeImageURL,
            })),
            status: Status.RESOLVED,
          };
        })
      )
      .catch(error => this.setState({ error, status: Status.REJECTED }));
  };

  componentDidUpdate(_, prevState) {
    const { imageName } = this.state;

    if (prevState.imageName !== imageName) {
      if (imageName === '') {
        return this.setState({
          status: Status.IDLE,
          images: [],
          isShowBtn: false,
        });
      }

      this.setState({ images: [], isShowBtn: false }, function () {
        this.getImages();
      });
    }
  }

  handleLoadMoreClick = () => {
    this.setState(
      state => ({ page: state.page + 1, isShowBtn: false }),
      function () {
        this.getImages();
      }
    );
  };

  handleSearchSubmit = imageName => {
    this.setState({ imageName, page: 1 });
  };

  render() {
    const { imageName, status, images, isShowBtn } = this.state;

    return (
      <div className="app">
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {status === Status.REJECTED && <p>{this.state.error}</p>}

        <ImageGallery imageName={imageName} images={images} status={status} />
        {status === Status.PENDING && <Loader />}
        {isShowBtn && <Button onClick={this.handleLoadMoreClick} />}
      </div>
    );
  }
}
