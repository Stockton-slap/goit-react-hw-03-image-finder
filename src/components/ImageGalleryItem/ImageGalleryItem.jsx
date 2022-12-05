import { Component } from 'react';
import axios from 'axios';

import Loader from 'components/Loader';
import Button from 'components/Button';
import Modal from 'components/Modal';

import PropTypes from 'prop-types';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGalleryItem extends Component {
  static propTypes = {
    imageName: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    page: 1,
    isOpenImageIndex: null,
    error: null,
    status: Status.IDLE,
  };

  BASE_URL = 'https://pixabay.com';

  searchParams = () => {
    return new URLSearchParams({
      page: this.state.page,
      key: '30589696-b681d27f2a9352756d0078443',
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: 12,
    });
  };

  getImages = () => {
    const { imageName } = this.props;

    axios
      .get(`${this.BASE_URL}/api/?q=${imageName}&${this.searchParams()}`)
      .then(res =>
        this.setState(state => ({
          images: state.images.concat(res.data.hits),
          status: Status.RESOLVED,
        }))
      )
      .catch(error => this.setState({ error, status: Status.REJECTED }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { imageName } = this.props;

    if (prevProps.imageName !== imageName) {
      this.setState({ images: [], status: Status.PENDING });

      this.getImages();
    }

    if (prevState.page !== this.state.page) {
      this.getImages();
    }
  }

  handleLoadMoreClick = () => {
    this.setState(state => ({ page: state.page + 1 }));
  };

  handleImageClick = index => {
    this.setState({ isOpenImageIndex: index });
  };

  onCloseModal = () => {
    this.setState({ isOpenImageIndex: null });
  };

  smoothScroll = () => {};

  render() {
    const { images, isOpenImageIndex, status } = this.state;
    const { imageName } = this.props;

    if (status === 'pending') {
      return <Loader />;
    }

    if (status === 'resolved') {
      if (images.length === 0) {
        return (
          <p className="empty-results">Sorry, there is no images found.</p>
        );
      }

      return (
        <>
          {images.map(({ id, webformatURL }, index) => (
            <li key={id} className="gallery-item">
              <img
                src={webformatURL}
                alt={imageName}
                className="gallery-item__image"
                onClick={() => this.handleImageClick(index)}
              />
            </li>
          ))}
          {isOpenImageIndex !== null && (
            <Modal
              largeImage={images[isOpenImageIndex].largeImageURL}
              imageName={imageName}
              onCloseModal={this.onCloseModal}
            />
          )}
          {images.length !== 0 && <Button onClick={this.handleLoadMoreClick} />}
        </>
      );
    }

    if (status === 'rejected') {
      return <p>{this.state.error}</p>;
    }
  }
}

export default ImageGalleryItem;
