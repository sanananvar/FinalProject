import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoTrashOutline } from "react-icons/io5";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik

const CareerForm = ({ setSubmitted }) => {
  const navigate = useNavigate();
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    number: "+994 _ __ _ _",
    email: "",
    resumeFile: null,
  });

  const [cvName, setCvName] = useState("");

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      nameLabel: "Name",
      surnameLabel: "Surname",
      numberLabel: "Number",
      emailLabel: "E-mail",
      uploadCVLabel: "Upload CV file",
      chooseFile: "📎 Choose File",
      fileHint: "Just a PDF or DOCX file (max. 2MB)",
      sendButton: "Send",
      sizeError: "File size should not exceed 2MB!",
      typeError: "Only PDF or DOCX files are allowed!"
    },
    2: { // Azerbaijani
      nameLabel: "Ad",
      surnameLabel: "Soyad",
      numberLabel: "Nömrə",
      emailLabel: "E-poçt",
      uploadCVLabel: "CV faylını yüklə",
      chooseFile: "📎 Fayl seç",
      fileHint: "Yalnız PDF və ya DOCX faylı (maks. 2MB)",
      sendButton: "Göndər",
      sizeError: "Faylın ölçüsü 2MB-dan çox olmamalıdır!",
      typeError: "Yalnız PDF və ya DOCX faylları qəbul olunur!"
    },
    3: { // Russian
      nameLabel: "Имя",
      surnameLabel: "Фамилия",
      numberLabel: "Номер",
      emailLabel: "Электронная почта",
      uploadCVLabel: "Загрузить файл резюме",
      chooseFile: "📎 Выбрать файл",
      fileHint: "Только PDF или DOCX файл (макс. 2MB)",
      sendButton: "Отправить",
      sizeError: "Размер файла не должен превышать 2MB!",
      typeError: "Разрешены только файлы PDF или DOCX!"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  const formatNumber = (input) => {
    let numbersOnly = input.replace(/\D/g, "");
    if (numbersOnly.startsWith("994")) {
      numbersOnly = numbersOnly.slice(3);
    }

    let formatted = "+994 ";
    if (numbersOnly.length > 0) formatted += numbersOnly.slice(0, 2);
    if (numbersOnly.length > 2) formatted += " " + numbersOnly.slice(2, 5);
    if (numbersOnly.length > 5) formatted += " " + numbersOnly.slice(5, 7);
    if (numbersOnly.length > 7) formatted += " " + numbersOnly.slice(7, 9);

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      setFormData({ ...formData, number: formatNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      if (file.size <= 2 * 1024 * 1024) {
        setFormData((prevData) => ({ ...prevData, resumeFile: file }));
        setCvName(file.name);
      } else {
        alert(t.sizeError); // Dilə uyğun xəbərdarlıq
        e.target.value = null;
      }
    } else {
      alert(t.typeError); // Dilə uyğun xəbərdarlıq
      e.target.value = null;
    }
  };

  const handleRemoveCv = () => {
    setFormData({ ...formData, resumeFile: null });
    setCvName("");
    document.getElementById("cvUpload").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("number", formData.number);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("resumeFile", formData.resumeFile);

    try {
      const response = await axios.post(
        "http://localhost:5135/api/v1/client/Candidates",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Başarılı!", response.data);
      setSubmitted(true); // ✅ Forma göndərildikdən sonra submitted true olur
      navigate("/thanks"); // Başarıyla göndərildikdə yönləndir
    } catch (error) {
      console.error("CV gönderme hatası:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="career">
      <div className="form-row">
        <div className="form-group">
          <label>
            {t.nameLabel} <span>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            {t.surnameLabel} <span>*</span>
          </label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            {t.numberLabel} <span>*</span>
          </label>
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            maxLength="17"
            required
          />
        </div>
        <div className="form-group">
          <label>
            {t.emailLabel} <span>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group upload">
        <div className="file-upload">
          <label>
            {t.uploadCVLabel} <span>*</span>
          </label>
          <div className="inp">
            <input
              type="file"
              name="resumeFile"
              id="cvUpload"
              onChange={handleFileChange}
              required={!formData.resumeFile}
            />
            <label htmlFor="cvUpload">{t.chooseFile}</label>
            <p>{t.fileHint}</p>
          </div>
          {cvName && (
            <div className="cv-preview">
              <span>{cvName}</span>
              <button type="button" onClick={handleRemoveCv}>
                <IoTrashOutline />
              </button>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        {t.sendButton}
      </button>
    </form>
  );
};

export default CareerForm;