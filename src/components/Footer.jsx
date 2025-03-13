const Footer = () => {
    return (
      <footer className="bg-[#DFDFDFDF] text-black text-center p-4 mt-10" style={{ backgroundColor: "rgba(211, 211, 211, 0.9)" }}>
        <p>© {new Date().getFullYear()} LetzGrade</p>
        <p className="text-xs">Developed & Maintained by David Pereira de Magalhaes</p>
      </footer>
    );
  };
  
  export default Footer;
  