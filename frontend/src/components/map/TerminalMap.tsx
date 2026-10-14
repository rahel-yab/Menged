import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { BusFront } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

import type { Language } from "../../i18n/translations";
import type { Terminal } from "../../api";

type Props = {
  terminals: Terminal[];
  language: Language;
  labels: {
    mapTitle: string;
    mapHint: string;
    unverified: string;
    verified: string;
  };
};

const terminalIcon = L.divIcon({
  className: "menged-terminal-marker",
  html: renderToStaticMarkup(
    <div className="map-marker-icon"><BusFront size={19} /></div>,
  ),
  iconSize: [40, 40],
  iconAnchor: [20, 36],
  popupAnchor: [0, -34],
});

export default function TerminalMap({ terminals, language, labels }: Props) {
  const center: [number, number] = terminals.length
    ? [
        terminals.reduce((sum, item) => sum + item.latitude, 0) / terminals.length,
        terminals.reduce((sum, item) => sum + item.longitude, 0) / terminals.length,
      ]
    : [9.03, 38.75];

  return (
    <div className="terminal-map-frame">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        className="terminal-map"
        aria-label={labels.mapTitle}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {terminals.map((terminal) => (
          <Marker
            key={terminal.id}
            position={[terminal.latitude, terminal.longitude]}
            icon={terminalIcon}
          >
            <Popup>
              <div className="min-w-[170px]">
                <strong className="text-sm">
                  {language === "am" ? terminal.nameAm : terminal.name}
                </strong>
                <p className="mt-1 text-xs text-gray-600">
                  {language === "am" ? terminal.areaAm : terminal.area}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {terminal.verified ? labels.verified : labels.unverified}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="terminal-map-caption">
        <strong>{labels.mapTitle}</strong>
        <span>{labels.mapHint}</span>
      </div>
    </div>
  );
}
