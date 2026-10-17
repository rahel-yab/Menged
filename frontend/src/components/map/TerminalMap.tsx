import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { BusFront } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

import type { Language } from "../../i18n/translations";
import type { RouteResult, Terminal } from "../../api";

type Props = {
  terminals: Terminal[];
  allStops: Terminal[];
  language: Language;
  selectedRoute: RouteResult | null;
  onChooseStop: (stop: Terminal, field: "from" | "to") => void;
  labels: {
    mapTitle: string;
    mapHint: string;
    unverified: string;
    verified: string;
    selectedRoute: string;
    transfer: string;
    origin: string;
    destination: string;
    setAsStart: string;
    setAsDestination: string;
    nearestStop: string;
    meters: string;
    kilometers: string;
  };
};

const routeColors = ["#157347", "#e28a17", "#315fbd", "#9a4f95"];

function RouteViewport({ route }: { route: RouteResult | null }) {
  const map = useMap();

  useEffect(() => {
    if (!route) return;
    const points = route.legs.flatMap((leg) => leg.shape);
    if (points.length < 2) return;
    map.fitBounds(L.latLngBounds(points.map(([latitude, longitude]) => [latitude, longitude])), {
      padding: [42, 42],
      maxZoom: 15,
      animate: true,
    });
  }, [map, route]);

  return null;
}

function distanceInMeters(latitude: number, longitude: number, stop: Terminal) {
  const radians = Math.PI / 180;
  const deltaLatitude = (stop.latitude - latitude) * radians;
  const deltaLongitude = (stop.longitude - longitude) * radians;
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(latitude * radians) * Math.cos(stop.latitude * radians) * Math.sin(deltaLongitude / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function StopActions({ stop, language, labels, onChooseStop }: {
  stop: Terminal;
  language: Language;
  labels: Props["labels"];
  onChooseStop: Props["onChooseStop"];
}) {
  return (
    <div className="map-stop-popup">
      <strong>{language === "am" ? stop.nameAm : stop.name}</strong>
      <span>{language === "am" ? stop.areaAm : stop.area}</span>
      <div className="map-stop-actions">
        <button type="button" onClick={() => onChooseStop(stop, "from")}>{labels.setAsStart}</button>
        <button type="button" onClick={() => onChooseStop(stop, "to")}>{labels.setAsDestination}</button>
      </div>
    </div>
  );
}

function MapStopPicker({ stops, language, labels, onChooseStop }: {
  stops: Terminal[];
  language: Language;
  labels: Props["labels"];
  onChooseStop: Props["onChooseStop"];
}) {
  const [picked, setPicked] = useState<{ stop: Terminal; distance: number } | null>(null);

  useMapEvents({
    click(event) {
      let closest: Terminal | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;
      for (const stop of stops) {
        const distance = distanceInMeters(event.latlng.lat, event.latlng.lng, stop);
        if (distance < closestDistance) {
          closest = stop;
          closestDistance = distance;
        }
      }
      if (closest) setPicked({ stop: closest, distance: closestDistance });
    },
  });

  if (!picked) return null;
  const distanceLabel = picked.distance < 1000
    ? `${Math.round(picked.distance)} ${labels.meters}`
    : `${(picked.distance / 1000).toFixed(1)} ${labels.kilometers}`;

  return (
    <Popup position={[picked.stop.latitude, picked.stop.longitude]}>
      <div className="map-stop-popup">
        <small>{labels.nearestStop} · {distanceLabel}</small>
        <StopActions stop={picked.stop} language={language} labels={labels} onChooseStop={onChooseStop} />
      </div>
    </Popup>
  );
}

const terminalIcon = L.divIcon({
  className: "menged-terminal-marker",
  html: renderToStaticMarkup(
    <div className="map-marker-icon"><BusFront size={19} /></div>,
  ),
  iconSize: [40, 40],
  iconAnchor: [20, 36],
  popupAnchor: [0, -34],
});

export default function TerminalMap({ terminals, allStops, language, labels, selectedRoute, onChooseStop }: Props) {
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
        scrollWheelZoom
        zoomControl={false}
        className="terminal-map"
        aria-label={labels.mapTitle}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RouteViewport route={selectedRoute} />
        <MapStopPicker stops={allStops} language={language} labels={labels} onChooseStop={onChooseStop} />
        {selectedRoute?.legs.map((leg, index) => (
          <Polyline
            key={`${leg.routeName}-${index}`}
            positions={leg.shape}
            pathOptions={{ color: routeColors[index % routeColors.length], weight: 6, opacity: 0.9, lineCap: "round", lineJoin: "round" }}
          >
            <Tooltip sticky>{leg.routeName} · {leg.routeLongName}</Tooltip>
          </Polyline>
        ))}
        {terminals.map((terminal) => (
          <Marker
            key={terminal.id}
            position={[terminal.latitude, terminal.longitude]}
            icon={terminalIcon}
          >
            <Popup>
              <StopActions stop={terminal} language={language} labels={labels} onChooseStop={onChooseStop} />
            </Popup>
          </Marker>
        ))}
        {selectedRoute?.legs.flatMap((leg, legIndex) => leg.stops.map((stop, stopIndex) => {
          if (legIndex > 0 && stopIndex === 0) return null;
          const isOrigin = legIndex === 0 && stopIndex === 0;
          const isDestination = legIndex === selectedRoute.legs.length - 1 && stopIndex === leg.stops.length - 1;
          const isTransfer = !isOrigin && !isDestination && stopIndex === leg.stops.length - 1 && legIndex < selectedRoute.legs.length - 1;
          return (
            <CircleMarker
              key={`${legIndex}-${stop.id}-${stopIndex}`}
              center={[stop.latitude, stop.longitude]}
              radius={isOrigin || isDestination ? 8 : isTransfer ? 7 : 4}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: isOrigin ? "#157347" : isDestination ? "#c44747" : isTransfer ? "#e28a17" : routeColors[legIndex % routeColors.length],
                fillOpacity: 1,
              }}
            >
              <Tooltip>{isOrigin ? labels.origin : isDestination ? labels.destination : isTransfer ? labels.transfer : (language === "am" ? stop.nameAm : stop.name)}</Tooltip>
            </CircleMarker>
          );
        }))}
      </MapContainer>
      <div className="terminal-map-caption">
        <strong>{labels.mapTitle}</strong>
        <span>{labels.mapHint}</span>
        {selectedRoute && (
          <div className="map-route-legend">
            <strong>{labels.selectedRoute}</strong>
            {selectedRoute.legs.map((leg, index) => (
              <span key={`${leg.routeName}-${index}`}><i style={{ backgroundColor: routeColors[index % routeColors.length] }} />{leg.routeName}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
