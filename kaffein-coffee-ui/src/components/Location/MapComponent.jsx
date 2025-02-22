import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LogoIcon from "../../../public/kaffeinLogoBlack.png";
import { useLanguage } from "../../Context/LanguageContext"; // LanguageContext-i idxal edirik

// Custom icon for marker
const customIcon = new L.Icon({
  iconUrl: LogoIcon, // Replace with your own icon URL
  iconSize: [80, 120], // Width, Height
  iconAnchor: [20, 40], // Where the icon is anchored
  popupAnchor: [0, -40], // Where the popup appears
});

// Default location (Kaffein Coffee, Baku)
const position = [40.4111469, 49.9436697];

const MapComponent = () => {
  const { languageId } = useLanguage(); // Seçilmiş dili alırıq

  // Dilə görə mətnlər
  const translations = {
    1: { // English
      popup: "Kaffein Coffee"
    },
    2: { // Azerbaijani
      popup: "Kaffein Qəhvəsi"
    },
    3: { // Russian
      popup: "Кофе Kaffein"
    }
  };

  const t = translations[languageId]; // Seçilmiş dilə uyğun mətnlər

  return (
    <MapContainer
      center={position}
      zoom={17}
      style={{ width: "100%", height: "100vh", filter: "grayscale(100%)" }}
    >
      {/* OpenStreetMap Tiles (No API Key Required) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker with Custom Icon */}
      <Marker position={position} icon={customIcon}>
        <Popup>{t.popup}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;