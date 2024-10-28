const Input = ({ placeholder, onChange, value, className, disabled = false }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={className}
      disabled={disabled}
    />
  );
};

export default Input;