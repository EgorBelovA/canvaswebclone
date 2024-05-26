import { useCookies } from 'react-cookie';
import { useState, useLayoutEffect } from 'react';
import russian from '../localization/Russian.json';
import ukranian from '../localization/Ukrainian.json';
import english from '../localization/English.json';

const Language = () => {
  const [cookies, _] = useCookies(['language']);
  const [language, setLanguage] = useState<any>({});
  const languages: { [key: string]: any } = {
    russian,
    ukranian,
    english,
  };

  useLayoutEffect(() => {
    if (cookies.language !== undefined) {
      setLanguage(languages[cookies.language]);
    } else if (navigator.language) {
      console.log(navigator.language.slice(0, 2));

      switch (navigator.language.slice(0, 2)) {
        // case 'ru':
        //   setLanguage(languages['russian']);
        //   break;
        // case 'uk':
        //   setLanguage(languages['ukranian']);
        //   break;
        default:
          setLanguage(languages['english']);
          break;
      }
    }
  }, []);

  return language;
};

export default Language;
