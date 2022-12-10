import ImageGalleryItem from 'components/ImageGalleryItem';
import Modal from 'components/Modal';

import Status from 'status';

import { Component } from 'react';

class ImageGallery extends Component {
  state = {
    isOpenImageIndex: null,
  };

  handleImageClick = index => {
    this.setState({ isOpenImageIndex: index });
  };

  onCloseModal = () => {
    this.setState({ isOpenImageIndex: null });
  };

  render() {
    const { images, imageName, status } = this.props;
    const { isOpenImageIndex } = this.state;

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
      </>
    );
  }
}

export default ImageGallery;
