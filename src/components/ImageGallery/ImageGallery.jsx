import PropTypes from 'prop-types';

import { Component } from 'react';

import ImageGalleryItem from 'components/ImageGalleryItem';
import Loader from 'components/Loader';
import Button from 'components/Button';
import Modal from 'components/Modal';
import fetchImages from 'fetchImages';

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

  getImages = () => {
    const { imageName } = this.props;

    this.setState({ status: Status.PENDING });

    fetchImages(imageName, this.state.page)
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
      this.setState({ images: [], page: 1, isShowBtn: false });

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
    this.setState(state => ({ page: state.page + 1, isShowBtn: false }));
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

    if (status === Status.REJECTED) {
      return <p>{this.state.error}</p>;
    }

    if (status === Status.RESOLVED && images.length === 0) {
      return <p className="empty-results">Sorry, there is no images found.</p>;
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
        {status === Status.PENDING && <Loader />}
      </>
    );
  }
}

export default ImageGallery;
