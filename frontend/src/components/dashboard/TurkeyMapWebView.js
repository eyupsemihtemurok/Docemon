import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

/**
 * Leaflet.js + GeoJSON tabanlı Türkiye İl Haritası.
 * Web platformunda iframe (srcdoc), native'de WebView kullanır.
 * GeoJSON: cihadturhan/tr-geojson (GitHub) — CDN üzerinden yüklenir.
 */

// Afet durumları: { "plateCode": "afet" | "normal" }
const DEFAULT_DISASTER_STATUS = {
  "46": "afet",   // Kahramanmaraş
  "31": "afet",   // Hatay
  "27": "afet",   // Gaziantep
  "02": "afet",   // Adıyaman
};

function buildLeafletHTML(disasterStatus = {}) {
  const disasterJSON = JSON.stringify(disasterStatus);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Türkiye Afet Haritası</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
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

    var map = L.map('map', {
      center: [39.0, 35.0],
      zoom: 6,
      minZoom: 5,
      maxZoom: 10,
      zoomControl: true,
    });

    function getStyle(feature) {
      var plate = String(feature.properties.number || feature.properties.id || '');
      if (plate.length === 1) plate = '0' + plate;
      var isDisaster = disasterStatus[plate] === 'afet';
      return {
        fillColor: isDisaster ? '#ef4444' : '#4b7c59',
        weight: 1.5,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: isDisaster ? 0.82 : 0.58,
      };
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: function(e) {
          var l = e.target;
          var plate = String(feature.properties.number || feature.properties.id || '');
          if (plate.length === 1) plate = '0' + plate;
          var isDisaster = disasterStatus[plate] === 'afet';
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
          var plate = String(props.number || props.id || '');
          if (plate.length === 1) plate = '0' + plate;
          var isDisaster = disasterStatus[plate] === 'afet';
          var statusHtml = isDisaster
            ? '<span class="popup-status-afet">🚨 AFET BÖLGESİ</span>'
            : '<span class="popup-status-normal">✅ Normal</span>';
          layer.bindPopup(
            '<div class="popup-title">' + name + '</div>' + statusHtml
          ).openPopup();
        }
      });
    }

    var geojsonLayer;

    // Türkiye il sınırları GeoJSON (cihadturhan/tr-geojson)
    fetch('https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        geojsonLayer = L.geoJSON(data, {
          style: getStyle,
          onEachFeature: onEachFeature
        }).addTo(map);
        map.fitBounds(geojsonLayer.getBounds(), { padding: [10, 10] });
      })
      .catch(function(err) {
        console.error('GeoJSON yüklenemedi:', err);
        // Fallback: basit Türkiye çerçevesi
        document.getElementById('map').innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:sans-serif;color:#64748b;font-size:14px;">Harita yüklenirken hata oluştu. İnternet bağlantısını kontrol edin.</div>';
      });
  </script>
</body>
</html>`;
}

export default function TurkeyMapWebView({ disasterStatus, style }) {
  const status = disasterStatus || DEFAULT_DISASTER_STATUS;
  const htmlContent = buildLeafletHTML(status);

  if (Platform.OS === 'web') {
    // Web platformu: dangerouslySetInnerHTML ile iframe
    return (
      <View style={[styles.container, style]}>
        <iframe
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 20,
          }}
          title="Türkiye Afet Haritası"
          sandbox="allow-scripts allow-same-origin"
        />
      </View>
    );
  }

  // Native: react-native-webview (eğer kuruluysa)
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
      <View style={[styles.container, style, styles.fallback]}>
        <iframe
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 20,
          }}
          title="Türkiye Afet Haritası"
          sandbox="allow-scripts allow-same-origin"
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
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
});
