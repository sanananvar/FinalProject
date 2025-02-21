import React, { useState } from 'react';
import "../../assets/scss/pages/survey.scss";
import kaffeinlogo from "../../assets/images/kaffeinlogo.svg";

function Survey() {
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [rating, setRating] = useState("");
    const [connection, setConnection] = useState("");
    const criteria = ["Təmizlik", "Wi-Fi", "Atmosfer", "Kifayət qədər məhsul", "Kollektiv"];
    const levels = ["Razı qaldım", "Biraz razı qaldım", "Məmnun", "Çox məmnun"];
    const [responses, setResponses] = useState({});
    const [feedback, setFeedback] = useState("");

    const handleChangeFeedback = (e) => {
        setFeedback(e.target.value);
    };
    const handleChange = (criterion, level) => {
        setResponses({ ...responses, [criterion]: level });
    };

    return (
        <section id="survey">
            <div className="survey">
                <div className="survey-wrapper">
                    <div className="survey-top">
                        <div className="survey-img">
                            <img src={kaffeinlogo} alt="Kaffein Logo" />
                        </div>
                        <h2>Customer survey</h2>
                        <p>Your opinion is important to us!</p>
                    </div>
                    <div className="select-container">
                        {/* Gender Select */}
                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>
                                Cinsiyyət
                            </option>
                            <option value="male">Kişi</option>
                            <option value="female">Qadın</option>
                        </select>

                        {/* Age Select */}
                        <select id="yas" value={age} onChange={(e) => setAge(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>
                                Yaş
                            </option>
                            <option value="13-17">13-17</option>
                            <option value="18-24">18-24</option>
                            <option value="24-34">24-34</option>
                            <option value="34 ve yuxari">34 və daha yuxarı</option>
                        </select>

                        {/* Rating Select */}
                        <select id="qiymetlendirme" value={rating} onChange={(e) => setRating(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>
                                Kaffein məhsullarını necə qiymətləndirirsiniz?
                            </option>
                            <option value="coxpis">Çox Pis</option>
                            <option value="pis">Pis</option>
                            <option value="orta">Orta</option>
                            <option value="yaxsi">Yaxşı</option>
                            <option value="ela">Əla</option>
                        </select>


                    </div>
                    <div className="survey-content-heading">
                        <p className='survey-content'>Zəhmət olmasa aşağıdakı cədvəldə Kaffein’ə məmnunluq 
                        səviyyəsini göstərin.
                        </p>
                    </div>


                    <div className="survey-container">
                        <div className="survey-left">
                            <div className="category">
                                <div className="div"></div>
                                <div className="div">Təmizlik</div>
                                <div className="div">Wi-Fi</div>
                                <div className="div">Atmosfer</div>
                                <div className="div">Kifayət qədər məhsul</div>
                                <div className="div">Kollektiv</div>
                            </div>
                        </div>
                        <div className="line"></div>
                        <div className="survey-right">
                            <div className="right-list">
                                <div className="survey-header">
                                    Razı qaldım
                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>

                            </div>
                            <div className="line"></div>

                            <div className="right-list">
                                <div className="survey-header">
                                    Biraz razı qaldım
                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>

                            </div>
                            <div className="line"></div>

                            <div className="right-list">
                                <div className="survey-header">
                                    Məmnun
                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>

                            </div>
                            <div className="line"></div>
                            <div className="right-list last">
                                <div className="survey-header">
                                    Çox məmnun
                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>
                                <div className="input">
                                    <input type="radio" />

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="select-container">
                        {/* Connection Select */}
                        <select id="connection" value={connection} onChange={(e) => setConnection(e.target.value)} className="select-dropdown">
                            <option value="" disabled hidden>
                                Bizimlə necə tanış oldunuz?
                            </option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="tesaduf">Təsadüfən</option>
                            <option value="dost">Dost və ya tanış vasitəsilə</option>
                        </select>
                    </div>

                    <div className="feedback-container">
                        <textarea
                            value={feedback}
                            onChange={handleChangeFeedback}
                            placeholder="Təklif və ya iradınız"
                            className="feedback-textarea"
                        />
                    </div>
                    <div className="survey-button">
                        <button className='survey-button-send'>Send</button>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Survey;
