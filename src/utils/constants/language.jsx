import React, { createContext, useContext, useState, useEffect } from "react";
import { Language_API } from "../../utils/api/apiUrl";
import { Labels } from "./labels";
import { isSuccess } from "../commonFunction/common";
import { PostApi } from "../api/networking";

const Language = createContext();
export const LanguageProvider = ({ children }) => {
  const [labels, setLabels] = useState({});
  const [language, setLanguage] = useState(localStorage.getItem("lang") || Labels.language.en);

  const loadLabels = async (lang = Labels.language.en) => {
    try {
      const response = await PostApi(Language_API.Language, {
        Lang: lang
      });
      if (isSuccess(response)) {
        setLabels(response.data);
        localStorage.setItem("lang", lang);
      } else {
        setLabels({});
        localStorage.removeItem("lang");
      }
    } catch (error) {
      setLabels({});
      localStorage.removeItem("lang");
    }
  };

  useEffect(() => {
    loadLabels(language);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    loadLabels(lang);
  };

  const getLabel = (key) => {
    return labels[key] || key;
  };

  return (
    <Language.Provider
      value={{ labels, getLabel, changeLanguage, language }}
    >
      {children}
    </Language.Provider>
  );
};

export const useLanguage = () => useContext(Language);