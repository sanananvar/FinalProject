import React, { useState, useEffect } from 'react';
import "../../assets/scss/pages/survey.scss";
import kaffeinlogo from "../../assets/images/kaffeinlogo.svg";
import axios from 'axios';
import { useLanguage } from '../../Context/LanguageContext'; // Context-dən istifadə

function Survey() {
    const { languageId } = useLanguage(); // Seçilmiş dili alırıq
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [rating, setRating] = useState("");
    const [connection, setConnection] = useState("");
    const [contactSources, setContactSources] = useState([]);
    const [responses, setResponses] = useState({});
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dilə görə mətnlər və data
    const translations = {
        1: { // English
            title: "Customer Survey",
            opinion: "Your opinion is important to us!",
            gender: "Gender",
            male: "Male",
            female: "Female",
            age: "Age",
            rating: "How do you rate Kaffein products?",
            veryBad: "Very Bad",
            bad: "Bad",
            average: "Average",
            good: "Good",
            excellent: "Excellent",
            satisfactionPrompt: "Please indicate your satisfaction level with Kaffein in the table below.",
            connection: "How did you hear about us?",
            feedback: "Suggestions or feedback",
            send: "Send",
            sending: "Sending...",
            criteria: ["Cleanliness", "Wi-Fi", "Atmosphere", "Product Availability", "Staff"],
            levels: ["Satisfied", "Somewhat Satisfied", "Pleased", "Very Pleased"]
        },
        2: { // Azerbaijani
            title: "Müştəri Sorğusu",
            opinion: "Sizin fikriniz bizim üçün önəmlidir!",
            gender: "Cinsiyyət",
            male: "Kişi",
            female: "Qadın",
            age: "Yaş",
            rating: "Kaffein məhsullarını necə qiymətləndirirsiniz?",
            veryBad: "Çox Pis",
            bad: "Pis",
            average: "Orta",
            good: "Yaxşı",
            excellent: "Əla",
            satisfactionPrompt: "Zəhmət olmasa aşağıdakı cədvəldə Kaffein’ə məmnunluq səviyyəsini göstərin.",
            connection: "Bizimlə necə tanış oldunuz?",
            feedback: "Təklif və ya iradınız",
            send: "Send",
            sending: "Göndərilir...",
            criteria: ["Təmizlik", "Wi-Fi", "Atmosfer", "Kifayət qədər məhsul", "Kollektiv"],
            levels: ["Razı qaldım", "Biraz razı qaldım", "Məmnun", "Çox məmnun"]
        },
        3: { // Russian
            title: "Опрос клиентов",
            opinion: "Ваше мнение важно для нас!",
            gender: "Пол",
            male: "Мужчина",
            female: "Женщина",
            age: "Возраст",
            rating: "Как вы оцениваете продукцию Kaffein?",
            veryBad: "Очень плохо",
            bad: "Плохо",
            average: "Средне",
            good: "Хорошо",
            excellent: "Отлично",
            satisfactionPrompt: "Пожалуйста, укажите уровень удовлетворенности Kaffein в таблице ниже.",
            connection: "Как вы узнали о нас?",
            feedback: "Предложения или отзывы",
            send: "Отправить",
            sending: "Отправляется...",
            criteria: ["Чистота", "Wi-Fi", "Атмосфера", "Наличие продукции", "Персонал"],
            levels: ["Доволен", "Немного доволен", "Удовлетворен", "Очень удовлетворен"]
        }
    };

    const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər
    const criteria = t.criteria;
    const levels = t.levels;

    // Token-i localStorage-dan almaq
    const getAccessToken = () => {
        const token = localStorage.getItem("accessToken");
        return token ? JSON.parse(token) : null;
    };

    // Headers-ı dinamik olaraq yaratmaq
    const getAuthHeaders = () => {
        const token = getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ContactSource məlumatlarını çəkmək
    const fetchContactSources = async () => {
        try {
            const response = await axios.get("http://localhost:5135/api/v1/admin/ContactSources", {
                headers: getAuthHeaders(),
            });
            console.log("Fetched Contact Sources:", response.data);
            setContactSources(response.data.items || []);
        } catch (err) {
            console.error("Error fetching contact sources:", err);
            setError("Kontakt mənbələrini yükləyərkən xəta baş verdi.");
        }
    };

    useEffect(() => {
        fetchContactSources();
    }, []);

    const handleChangeFeedback = (e) => {
        setFeedback(e.target.value);
    };

    const handleChange = (criterion, level) => {
        setResponses({ ...responses, [criterion]: level });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        let ageValue;
        switch (age) {
            case "13-17": ageValue = 0; break;
            case "18-24": ageValue = 1; break;
            case "24-34": ageValue = 2; break;
            case "34 ve yuxari": ageValue = 3; break;
            default: ageValue = null;
        }

        let qualityPointValue;
        switch (rating) {
            case "coxpis": qualityPointValue = 0; break;
            case "pis": qualityPointValue = 1; break;
            case "orta": qualityPointValue = 2; break;
            case "yaxsi": qualityPointValue = 3; break;
            case "ela": qualityPointValue = 4; break;
            default: qualityPointValue = null;
        }

        const contactSourceValue = connection ? parseInt(connection) : null;

        const statisfactionDictionaries = criteria.map(category => {
            const value = responses[category] || levels[0];
            let statisfactionValue;
            switch (value) {
                case levels[0]: statisfactionValue = 0; break;
                case levels[1]: statisfactionValue = 1; break;
                case levels[2]: statisfactionValue = 2; break;
                case levels[3]: statisfactionValue = 3; break;
                default: statisfactionValue = 0;
            }
            return {
                Key: category,
                Value: statisfactionValue,
                LanguageId: languageId // Seçilmiş dilə uyğun LanguageId
            };
        });

        const surveyData = {
            Gender: gender === "male",
            Age: ageValue,
            QualityPoint: qualityPointValue,
            ContactSourceId: contactSourceValue,
            Comment: feedback.trim() === "" ? "No comment" : feedback,
            Statisfactions: [
                {
                    StatisfactionDictionaries: statisfactionDictionaries
                }
            ]
        };

        if (!surveyData.Gender && surveyData.Gender !== false) {
            setError(t.gender + " seçilməyib!");
            setLoading(false);
            return;
        }
        if (surveyData.Age === null) {
            setError(t.age + " seçilməyib!");
            setLoading(false);
            return;
        }
        if (surveyData.QualityPoint === null) {
            setError(t.rating + " seçilməyib!");
            setLoading(false);
            return;
        }
        if (surveyData.ContactSourceId === null) {
            setError(t.connection + " seçilməyib!");
            setLoading(false);
            return;
        }

        console.log('Göndərilən məlumat:', JSON.stringify(surveyData, null, 2));

        try {
            const response = await axios.post('http://localhost:5135/api/v1/client/Surveys', surveyData, {
                headers: getAuthHeaders(),
                'Content-Type': 'application/json'
            });
            console.log('Sorğu uğurla göndərildi:', response.data);
            alert('Təşəkkürlər! Cavabınız qeydə alındı.');
            setGender("");
            setAge("");
            setRating("");
            setConnection("");
            setResponses({});
            setFeedback("");
        } catch (err) {
            console.error('Xəta baş verdi:', err.response?.data || err.message);
            setError('Sorğu göndərilərkən xəta baş verdi: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="survey">
            <div className="survey">
                <div className="survey-wrapper">
                    <div className="survey-top">
                        <div className="survey-img">
                            <img src={kaffeinlogo} alt="Kaffein Logo" />
                        </div>
                        <h2>{t.title}</h2>
                        <p>{t.opinion}</p>
                    </div>
                    <div className="select-container">
                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>{t.gender}</option>
                            <option value="male">{t.male}</option>
                            <option value="female">{t.female}</option>
                        </select>
                        <select id="yas" value={age} onChange={(e) => setAge(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>{t.age}</option>
                            <option value="13-17">13-17</option>
                            <option value="18-24">18-24</option>
                            <option value="24-34">24-34</option>
                            <option value="34 ve yuxari">{languageId === 2 ? "34 və daha yuxarı" : languageId === 1 ? "34 and above" : "34 и выше"}</option>
                        </select>
                        <select id="qiymetlendirme" value={rating} onChange={(e) => setRating(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>{t.rating}</option>
                            <option value="coxpis">{t.veryBad}</option>
                            <option value="pis">{t.bad}</option>
                            <option value="orta">{t.average}</option>
                            <option value="yaxsi">{t.good}</option>
                            <option value="ela">{t.excellent}</option>
                        </select>
                    </div>
                    <div className="survey-content-heading">
                        <p className='survey-content'>{t.satisfactionPrompt}</p>
                    </div>

                    <div className="survey-container">
                        <div className="survey-left">
                            <div className="category">
                                <div className="div"></div>
                                {criteria.map((criterion) => (
                                    <div className="div" key={criterion}>{criterion}</div>
                                ))}
                            </div>
                        </div>
                        <div className="line"></div>
                        <div className="survey-right">
                            {levels.map((level) => (
                                <React.Fragment key={level}>
                                    <div className={`right-list ${level === levels[3] ? "last" : ""}`}>
                                        <div className="survey-header">{level}</div>
                                        {criteria.map((criterion) => (
                                            <div className="input" key={`${criterion}-${level}`}>
                                                <input
                                                    type="radio"
                                                    name={criterion}
                                                    value={level}
                                                    checked={responses[criterion] === level}
                                                    onChange={() => handleChange(criterion, level)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {level !== levels[3] && <div className="line"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="select-container">
                        <select
                            id="connection"
                            value={connection}
                            onChange={(e) => setConnection(e.target.value)}
                            className="select-dropdown"
                        >
                            <option value="" disabled hidden>{t.connection}</option>
                            {contactSources.map((source) => {
                                const name = source.contactSourceDictionaries.find(
                                    (dict) => dict.languageId === languageId
                                )?.name || "Unnamed";
                                return (
                                    <option key={source.id} value={source.id}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="feedback-container">
                        <textarea
                            value={feedback}
                            onChange={handleChangeFeedback}
                            placeholder={t.feedback}
                            className="feedback-textarea"
                        />
                    </div>

                    {loading && <p className="loading">{t.sending}</p>}
                    {error && <p className="error">{error}</p>}

                    <div className="survey-button">
                        <button
                            className="survey-button-send"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? t.sending : t.send}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Survey;