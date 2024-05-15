import { useCookies } from 'react-cookie';
import { useState } from 'react';

const Country = (props: any) => {
  const [, setCookie] = useCookies(['language']);
  const [, setLanguage] = useState('russian');
  const changeLanguage = (language: string) => {
    setLanguage(language);
    setCookie('language', props.languageSlug, { path: '/' });
    window.location.reload();
  };

  return (
    <div
      onClick={() => changeLanguage(props.language)}
      className='country-container'
    >
      <h1 id={props.languageSlug}>{props.language}</h1>
    </div>
  );
};

export default Country;
