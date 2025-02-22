import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../Context/LanguageContext";

const About = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      home: "Home",
      philosophy: "Philosophy",
      title: "Philosophy",
      text1: "At Kaffein Coffee, we believe that every cup of coffee tells a story, embracing the philosophy of modern coffee. We combine the rich heritage of the past with the dynamic and creative touches of today, carefully selecting high-quality coffee beans to deliver an experience that speaks to both the palate and the soul with every sip.",
      text2: "Always open to innovation, Kaffein Coffee welcomes its guests not only with flavors but also with surprises and unforgettable experiences. Through our campaigns and creative menus, we strive to make each visit a unique memory. For us, coffee is not just a drink but the beginning of happy moments.",
      text3: "Our mission is to send you off with not only a perfect taste but also an unforgettable feeling. We are always ready to welcome you back with open arms!"
    },
    2: { // Azerbaijani
      home: "Ana Səhifə",
      philosophy: "Fəlsəfə",
      title: "Fəlsəfə",
      text1: "Kaffein Coffee-də biz inanırıq ki, hər fincan qəhvə bir hekayə danışır və müasir qəhvə fəlsəfəsini əhatə edir. Biz keçmişin zəngin irsini bu günün dinamik və yaradıcı toxunuşları ilə birləşdirir, yüksək keyfiyyətli qəhvə dənələrini diqqətlə seçərək hər yudumda damağa və ruhə səslənən bir təcrübə təqdim edirik.",
      text2: "Həmişə yeniliyə açıq olan Kaffein Coffee qonaqlarını təkcə ləzzətlərlə deyil, həm də sürprizlər və unudulmaz təcrübələrlə qarşılayır. Kampaniyalarımız və yaradıcı menyularımız vasitəsilə hər ziyarəti unikal bir xatirəyə çevirməyə çalışırıq. Bizim üçün qəhvə sadəcə bir içki deyil, xoşbəxt anların başlanğıcıdır.",
      text3: "Missiyamız sizi təkcə mükəmməl bir dadla deyil, həm də unudulmaz bir hiss ilə yola salmaqdır. Sizi həmişə açıq qollarla geri qayıtmağa hazır gözləyirik!"
    },
    3: { // Russian
      home: "Главная",
      philosophy: "Философия",
      title: "Философия",
      text1: "В Kaffein Coffee мы верим, что каждая чашка кофе рассказывает историю, воплощая философию современного кофе. Мы сочетаем богатое наследие прошлого с динамичными и креативными штрихами настоящего, тщательно отбирая высококачественные кофейные зерна, чтобы подарить вам опыт, который говорит как с вашим вкусом, так и с душой в каждом глотке.",
      text2: "Всегда открытые к инновациям, Kaffein Coffee встречает своих гостей не только вкусами, но и сюрпризами, а также незабываемыми впечатлениями. Через наши кампании и креативные меню мы стремимся сделать каждое посещение уникальным воспоминанием. Для нас кофе — это не просто напиток, а начало счастливых моментов.",
      text3: "Наша миссия — проводить вас не только с идеальным вкусом, но и с незабываемым чувством. Мы всегда готовы приветствовать вас снова с распростертыми объятиями!"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <div className="about-wrapper">
      <div className="about">
        <div className="section-wrapper">
          <div className="bread-crumbs">
            <Link to="/" className="break-link">
              {t.home}{" "}
            </Link>
            <span> /</span>
            <Link to="/about">{t.philosophy}</Link>
          </div>
          <div className="about-header">
            <p>{t.title}</p>
            <img src="public/kaffeinTextLogo.svg" alt="" />
          </div>
          <div className="about-text">
            <p>{t.text1}</p>
            <p>{t.text2}</p>
            <p>{t.text3}</p>
          </div>
          <div className="about-image">
            <img src="src/assets/images/img27.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;