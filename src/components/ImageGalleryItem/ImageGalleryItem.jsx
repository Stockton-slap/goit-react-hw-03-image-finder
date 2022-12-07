import PropTypes from 'prop-types';

const ImageGalleryItem = ({ smallImage, imageName, handleImageClick }) => {
  return (
    <li className="gallery-item">
      <img
        src={smallImage}
        alt={imageName}
        className="gallery-item__image"
        onClick={handleImageClick}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  smallImage: PropTypes.string.isRequired,
  imageName: PropTypes.string.isRequired,
  handleImageClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
