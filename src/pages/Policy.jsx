import React from "react";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="w-4/5 max-w-5xl bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">{t("privacyPolicy")}</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("introduction")}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{t("privacyIntroText")}</p>
          <p className="text-gray-600 leading-relaxed">{t("privacyEffectiveDate")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("informationWeCollect")}</h2>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-gray-700">{t("personalData")}</h3>
            <p className="text-gray-600 mb-3 leading-relaxed">{t("personalDataText")}</p>
            <ul className="list-disc list-inside inline-block text-left text-gray-600 space-y-2">
              <li>{t("personalDataEmail")}</li>
              <li>{t("personalDataName")}</li>
              <li>{t("personalDataPhone")}</li>
              <li>{t("personalDataAddress")}</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-gray-700">{t("usageData")}</h3>
            <p className="text-gray-600 leading-relaxed">{t("usageDataText")}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("howWeUseYourData")}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{t("dataUsePurpose")}</p>
          <ul className="list-disc list-inside inline-block text-left text-gray-600 space-y-2">
            <li>{t("dataUseProvide")}</li>
            <li>{t("dataUseNotify")}</li>
            <li>{t("dataUseParticipate")}</li>
            <li>{t("dataUseCustomer")}</li>
            <li>{t("dataUseAnalysis")}</li>
            <li>{t("dataUseMonitor")}</li>
            <li>{t("dataUseDetect")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("dataRetention")}</h2>
          <p className="text-gray-600 leading-relaxed">{t("dataRetentionText")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t("yourDataRights")}</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{t("dataRightsText")}</p>
          <ul className="list-disc list-inside inline-block text-left text-gray-600 space-y-2">
            <li>{t("dataRightsAccess")}</li>
            <li>{t("dataRightsCorrect")}</li>
            <li>{t("dataRightsErase")}</li>
            <li>{t("dataRightsRestrict")}</li>
            <li>{t("dataRightsObject")}</li>
            <li>{t("dataRightsPortability")}</li>
          </ul>
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

export default Policy;
