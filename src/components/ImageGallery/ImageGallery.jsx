import PropTypes from 'prop-types';
import axios from 'axios';

import { Component } from 'react';

import ImageGalleryItem from 'components/ImageGalleryItem';
import Loader from 'components/Loader';
import Button from 'components/Button';
import Modal from 'components/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class ImageGallery extends Component {
  static propTypes = {
    imageName: PropTypes.string.isRequired,
  };

  state = {
    images: [],
    page: 1,
    isOpenImageIndex: null,
    error: null,
    status: Status.IDLE,
    isShowBtn: false,
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

  componentDidUpdate(prevProps, prevState) {
    const { imageName } = this.props;
    const { page } = this.state;

    if (prevProps.imageName !== imageName) {
      this.setState({ images: [], page: 1, status: Status.PENDING });

      if (imageName === '') {
        return this.setState({ status: Status.IDLE });
      }

      this.getImages();
    }

    if (prevState.page < page) {
      this.getImages();
    }
  }

  handleLoadMoreClick = () => {
    this.setState(state => ({ page: state.page + 1 }));
  };

  onCloseModal = () => {
    this.setState({ isOpenImageIndex: null });
  };

  handleImageClick = index => {
    this.setState({ isOpenImageIndex: index });
  };

  render() {
    const { images, isOpenImageIndex, status, isShowBtn } = this.state;
    const { imageName } = this.props;

    if (status === Status.IDLE) {
      return null;
    }

    if (status === Status.PENDING) {
      return <Loader />;
    }

    if (status === Status.RESOLVED) {
      if (images.length === 0) {
        return (
          <p className="empty-results">Sorry, there is no images found.</p>
        );
      }

      return (
        <>
          <ul className="gallery">
            {images.map(({ id, webformatURL }, index) => (
              <ImageGalleryItem
                key={id}
                smallImage={webformatURL}
                imageName={imageName}
                handleImageClick={() => this.handleImageClick(index)}
                imagesIndex={index}
              />
            ))}
          </ul>
          {isOpenImageIndex !== null && (
            <Modal
              largeImage={images[isOpenImageIndex].largeImageURL}
              imageName={imageName}
              onCloseModal={this.onCloseModal}
            />
          )}
          {isShowBtn && <Button onClick={this.handleLoadMoreClick} />}
        </>
      );
    }

    if (status === Status.REJECTED) {
      return <p>{this.state.error}</p>;
    }
  }
}

export default ImageGallery;
