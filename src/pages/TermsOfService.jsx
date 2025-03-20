import React from "react";
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="w-4/5 max-w-5xl bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">{t("termsOfService")}</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("termsIntroduction")}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{t("termsIntroText")}</p>
          <p className="text-gray-600 leading-relaxed">{t("termsEffectiveDate")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("userResponsibilities")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("userResponsibilitiesText")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("acceptableUse")}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{t("acceptableUseText")}</p>
          <ul className="list-disc list-inside inline-block text-left text-gray-600 space-y-2">
            <li>{t("acceptableUse1")}</li>
            <li>{t("acceptableUse2")}</li>
            <li>{t("acceptableUse3")}</li>
            <li>{t("acceptableUse4")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("terminationClause")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("terminationText")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("disclaimer")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("disclaimerText")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("governingLaw")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("governingLawText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("contactUs")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("contactUsText")}</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-md inline-block text-gray-700">
            <p className="font-medium">LetzGrade</p>
            <p>{t("contactEmail")}</p>
            <p>{t("contactAddress")}</p>
            <p>{t("contactCity")}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
