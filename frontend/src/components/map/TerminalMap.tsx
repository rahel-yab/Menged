
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { BusFront } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

type Terminal = {
  id: number;
  name: string;
  description: string;
  position: [number, number];
  crowd: "Low" | "Moderate" | "Busy";
};

// Demonstration locations only.
// Replace these coordinates with field-verified terminal locations.
const demoTerminals: Terminal[] = [
  {
    id: 1,
    name: "Demo Terminal A",
    description: "Sample starting terminal",
    position: [9.018, 38.752],
    crowd: "Low",
  },
  {
    id: 2,
    name: "Demo Terminal B",
    description: "Sample connecting terminal",
    position: [9.035, 38.763],
    crowd: "Moderate",
  },
  {
    id: 3,
    name: "Demo Terminal C",
    description: "Sample destination terminal",
    position: [9.045, 38.735],
    crowd: "Busy",
  },
];

const crowdColors = {
  Low: "#26965F",
  Moderate: "#E9A23B",
  Busy: "#DC5656",
};

function createTerminalIcon(crowd: Terminal["crowd"]) {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        width: "42px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: crowdColors[crowd],
        border: "3px solid white",
        borderRadius: "50% 50% 50% 4px",
        transform: "rotate(-45deg)",
        boxShadow: "0 3px 12px rgba(0,0,0,0.24)",
      }}
    >
      <span
        style={{
          color: "white",
          transform: "rotate(45deg)",
          display: "flex",
        }}
      >
        ${""}
      </span>
    </div>
  );

  // Use a simple custom HTML marker, avoiding Leaflet's
  // default image asset path issues with Vite.
  const html = iconMarkup.replace(
    "$",
    ""
  ).replace(
    "</span>",
    `${renderToStaticMarkup(
      <BusFront size={18} color="white" strokeWidth={2.5} />
    )}</span>`
  );

  return L.divIcon({
    className: "menged-terminal-marker",
    html,
    iconSize: [42, 42],
    iconAnchor: [21, 38],
    popupAnchor: [0, -36],
  });
}

export default function TerminalMap() {
  const routePositions = demoTerminals.map(
    (terminal) => terminal.position
  );

  return (
    <div className="terminal-map-frame">
      <MapContainer
        center={[9.03, 38.75]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        className="terminal-map"
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={routePositions}
          pathOptions={{
            color: "#26965F",
            weight: 5,
            opacity: 0.85,
            dashArray: "9 8",
          }}
        />

        {demoTerminals.map((terminal) => (
          <Marker
            key={terminal.id}
            position={terminal.position}
            icon={createTerminalIcon(terminal.crowd)}
          >
            <Popup>
              <div className="min-w-[170px]">
                <strong className="text-sm">
                  {terminal.name}
                </strong>
                <p className="mt-1 text-xs text-gray-600">
                  {terminal.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        crowdColors[terminal.crowd],
                    }}
                  />
                  <span>
                    Sample crowd level: {terminal.crowd}
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-gray-400">
                  Demonstration data, not live information.
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="terminal-map-legend">
        <span className="font-semibold">Sample crowd levels</span>
        <span><i className="legend-dot low" /> Low</span>
        <span><i className="legend-dot moderate" /> Moderate</span>
        <span><i className="legend-dot busy" /> Busy</span>
      </div>
    </div>
  );
}