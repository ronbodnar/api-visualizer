const Input = ({ placeholder, onChange, value, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={className}
    />
  );
};

export default Input;