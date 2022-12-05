import PropTypes from 'prop-types';

import { Component } from 'react';

class Modal extends Component {
  static propTypes = {
    largeImage: PropTypes.string.isRequired,
    imageName: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleOverlayClick = e => {
    const { onCloseModal } = this.props;
    if (e.target === e.currentTarget) {
      onCloseModal();
    }
  };

  handleKeyDown = e => {
    const { onCloseModal } = this.props;

    if (e.code === 'Escape') {
      onCloseModal();
    }
  };

  render() {
    const { largeImage, imageName } = this.props;

    return (
      <div className="overlay" onClick={this.handleOverlayClick}>
        <div className="modal">
          <img src={largeImage} alt={imageName} />
        </div>
      </div>
    );
  }
}

export default Modal;
