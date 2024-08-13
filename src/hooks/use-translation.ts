import { languageState } from "atom";
import TRANSLATIONS from "constants/language";
import { useRecoilValue } from "recoil";

const useTranslation = () => {
  const lang = useRecoilValue(languageState);
  return (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][lang];
  };
};

export default useTranslation;
