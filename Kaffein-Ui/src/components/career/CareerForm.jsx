import React, { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

const CareerForm = ({ setSubmitted }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    number: "+994 _ __ _ _",
    email: "",
    cv: null,
  });

  const [cvName, setCvName] = useState("");

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

  const handleNumberChange = (e) => {
    let value = e.target.value;

    if (value === "+994 " || value.length < 6) {
      value = "+994 _ __ _ _";
    } else {
      value = formatNumber(value);
    }

    setFormData({ ...formData, number: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      if (file.size <= 2 * 1024 * 1024) {
        setFormData({ ...formData, cv: file });
        setCvName(file.name);
      } else {
        alert("File size should not exceed 2MB!");
        e.target.value = null;
      }
    } else {
      alert("Only PDF or DOCX files are allowed!");
      e.target.value = null;
    }
  };

  const handleRemoveCv = () => {
    setFormData({ ...formData, cv: null });
    setCvName("");
    document.getElementById("cvUpload").value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setSubmitted(true);
  };

  return (
    
      <form onSubmit={handleSubmit} className="career">
        <div className="form-row">
          <div className="form-group">
            <label>
              Name <span>*</span>
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
              Surname <span>*</span>
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
              Number <span>*</span>
            </label>
            <input
              type="tel"
              name="number"
              value={formData.number}
              onChange={handleNumberChange}
              maxLength="17"
              required
            />
          </div>
          <div className="form-group">
            <label>
              E-mail <span>*</span>
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
              Upload CV file <span>*</span>
            </label>
            <div className="inp">
              <input
                type="file"
                name="cv"
                id="cvUpload"
                onChange={handleFileChange}
                required={!formData.cv}
              />
              <label htmlFor="cvUpload">📎 Choose File</label>
              <p>Just a PDF or DOCX file (max. 2MB)</p>
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
          Send
        </button>
      </form>

  );
};

export default CareerForm;
