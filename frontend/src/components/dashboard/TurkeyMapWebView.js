import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

/**
 * Leaflet.js + GeoJSON tabanlı Türkiye İl Haritası.
 * GeoJSON verisini React tarafında fetch edip iframe'e inline olarak gömer.
 * Bu sayede iframe sandbox kısıtlamaları sorun çıkarmaz.
 */

const GEOJSON_URL =
  'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json';

const DEFAULT_DISASTER_STATUS = {
  "Kahramanmaraş": "afet",
  "Hatay": "afet",
  "Gaziantep": "afet",
  "Adıyaman": "afet",
};

function buildLeafletHTML(disasterStatus = {}, geoJsonString = 'null') {
  const disasterJSON = JSON.stringify(disasterStatus);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Türkiye Afet Haritası</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #f0fdf4; }
    #map { width: 100%; height: 100%; }

    .leaflet-popup-content-wrapper {
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      border: none;
    }
    .leaflet-popup-content {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 4px 2px;
    }
    .popup-title {
      font-size: 16px;
      font-weight: 800;
      color: #052e16;
      margin-bottom: 6px;
    }
    .popup-status-afet {
      background: #fff1f2;
      color: #e11d48;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      display: inline-block;
      border: 1px solid #fecaca;
    }
    .popup-status-normal {
      background: #f0fdf4;
      color: #15803d;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      display: inline-block;
      border: 1px solid #bbf7d0;
    }
    .leaflet-control-zoom {
      border-radius: 12px !important;
      overflow: hidden;
      border: none !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12) !important;
    }
    .leaflet-control-zoom a {
      width: 36px !important;
      height: 36px !important;
      line-height: 36px !important;
      font-size: 18px !important;
      color: #052e16 !important;
    }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var disasterStatus = ${disasterJSON};
    var geoData = ${geoJsonString};

    var map = L.map('map', {
      center: [39.0, 35.0],
      zoom: 6,
      minZoom: 5,
      maxZoom: 10,
      zoomControl: true,
    });

    function getStyle(feature) {
      var name = feature.properties.name || '';
      var isDisaster = disasterStatus[name] === 'afet';
      return {
        fillColor: isDisaster ? '#ef4444' : '#4b7c59',
        weight: 1.5,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: isDisaster ? 0.82 : 0.58,
      };
    }

    var geojsonLayer;

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: function(e) {
          var l = e.target;
          var name = feature.properties.name || '';
          var isDisaster = disasterStatus[name] === 'afet';
          l.setStyle({
            fillOpacity: isDisaster ? 0.95 : 0.80,
            weight: 2.5,
            color: '#ffffff',
          });
          l.bringToFront();
        },
        mouseout: function(e) {
          geojsonLayer.resetStyle(e.target);
        },
        click: function(e) {
          var props = feature.properties;
          var name = props.name || props.il_adi || props.NAME_1 || 'Bilinmiyor';
          var isDisaster = disasterStatus[name] === 'afet';
          var statusHtml = isDisaster
            ? '<span class="popup-status-afet">🚨 AFET BÖLGESİ</span>'
            : '<span class="popup-status-normal">✅ Normal</span>';
          layer.bindPopup(
            '<div class="popup-title">' + name + '</div>' + statusHtml
          ).openPopup();
        }
      });
    }

    if (geoData) {
      geojsonLayer = L.geoJSON(geoData, {
        style: getStyle,
        onEachFeature: onEachFeature
      }).addTo(map);
      map.fitBounds(geojsonLayer.getBounds(), { padding: [10, 10] });
    } else {
      document.getElementById('map').innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;color:#64748b;font-size:14px;">Harita verisi yüklenemedi.</div>';
    }
  <\/script>
</body>
</html>`;
}

export default function TurkeyMapWebView({ disasterStatus, style }) {
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(text => {
        if (!cancelled) {
          setGeoJson(text);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('GeoJSON fetch error:', err);
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const status = disasterStatus && Object.keys(disasterStatus).length > 0
    ? disasterStatus
    : DEFAULT_DISASTER_STATUS;

  if (loading) {
    return (
      <View style={[styles.container, style, styles.loadingWrap]}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={styles.loadingText}>Harita yükleniyor…</Text>
      </View>
    );
  }

  if (error || !geoJson) {
    return (
      <View style={[styles.container, style, styles.fallback]}>
        <Text style={styles.errorText}>🗺️ Harita yüklenemedi</Text>
        <Text style={styles.errorSub}>{error || 'GeoJSON verisi alınamadı'}</Text>
      </View>
    );
  }

  // GeoJSON string'i doğrudan HTML'e gömüyoruz — iframe dış ağa erişmek zorunda değil
  const htmlContent = buildLeafletHTML(status, geoJson);
  const iframeKey = JSON.stringify(status);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <iframe
          key={iframeKey}
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 20,
          }}
          title="Türkiye Afet Haritası"
        />
      </View>
    );
  }

  // Native: react-native-webview
  try {
    const { WebView } = require('react-native-webview');
    return (
      <View style={[styles.container, style]}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  } catch {
    return (
      <View style={[styles.container, style]}>
        <iframe
          key={iframeKey}
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 20,
          }}
          title="Türkiye Afet Haritası"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 480,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0fdf4',
  },
  webview: {
    flex: 1,
    borderRadius: 20,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '700',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748b',
  },
  errorSub: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
