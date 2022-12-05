import PropTypes from 'prop-types';

const ImageGallery = ({ children }) => {
  return <ul className="gallery">{children}</ul>;
};

ImageGallery.propTypes = {
  children: PropTypes.node,
};

export default ImageGallery;
