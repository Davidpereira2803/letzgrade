const Button = ({ text, onClick, type = "button", className = "", style={} }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        style={style} 
        className={`bg-[#424242] px-4 py-2 rounded-md text-white font-semibold transition duration-300 ${className}`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  