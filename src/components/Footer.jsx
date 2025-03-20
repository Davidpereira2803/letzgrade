import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
    return (
      <footer className="bg-[#DFDFDFDF] text-black text-center p-4 mt-10 py-4" style={{ backgroundColor: "rgba(211, 211, 211, 0.9)" }}>

        <div className="flex flex-row gap-4 justify-center">
          <a href="/privacy-policy">{t("privacyPolicy")}</a>
          <a href="/terms-of-service">{t("termsOfService")}</a>
        </div>
        <div className="mt-2">
          <p>© {new Date().getFullYear()} LetzGrade</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  