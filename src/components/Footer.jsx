import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
    return (
      <footer className="bg-[#DFDFDFDF] text-black text-center p-4 mt-10" style={{ backgroundColor: "rgba(211, 211, 211, 0.9)" }}>
        <p>© {new Date().getFullYear()} LetzGrade</p>
        <p className="text-xs">{t("developedBy")}</p>
      </footer>
    );
  };
  
  export default Footer;
  