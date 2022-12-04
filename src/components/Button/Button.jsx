const Button = ({ onClick }) => {
  return (
    <button type="button" className="load-more-button" onClick={onClick}>
      Load more
    </button>
  );
};

export default Button;
