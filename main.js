// main.js (Google Maps + Places version)
// Ghi chú: index.html phải load Google Maps JS với `libraries=places,geometry`
// và callback=initMap, ví dụ:
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,geometry&callback=initMap"></script>

// =================== DỮ LIỆU: ROUTES / OPERATORS / STOPS ===================
const ROUTES = [
    {
        id: 'hn-sp',
        name: 'Hà Nội — Sapa',
        A: 'Hà Nội',
        B: 'Sapa',
        operators: [
            {
                id: 'saoviet',
                name: 'Nhà xe Sao Việt',
                stopsAB: [
                    { id: 1, name: '114 Trần Nhật Duật', lat: 21.0340, lng: 105.8510 },
                    { id: 2, name: '789 Giải Phóng', lat: 21.0050, lng: 105.8560 },
                    { id: 3, name: '07 Phạm Văn Đồng', lat: 21.0335, lng: 105.7890 }
                ],
                stopsBA: [
                    { id: 101, name: '07 Phạm Văn Đồng', lat: 21.0335, lng: 105.7890 },
                    { id: 102, name: '789 Giải Phóng', lat: 21.0050, lng: 105.8560 },
                    { id: 103, name: '114 Trần Nhật Duật', lat: 21.0340, lng: 105.8510 }
                ]
            }
        ]
    }
];

// =================== CẤU HÌNH ===================
const ORS_API_KEY = ''; // (optional) nếu muốn dùng OpenRouteService như trước
const MAP_CENTER = { lat: 21.0, lng: 106.0 };
const SHORTLIST_N = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

// UI refs (DOM)
const logEl = document.getElementById('log');
const resultText = document.getElementById('resultText');
const routeSelect = document.getElementById('routeSelect');
const directionSelect = document.getElementById('directionSelect');
const operatorSelect = document.getElementById('operatorSelect');
const addrInput = document.getElementById('addr');
const btnUseGeol = document.getElementById('btnUseGeol');
const btnFind = document.getElementById('btnFind');
const suggestionsList = document.getElementById('suggestionsList');

// Google Maps vars
let map;
let placesService;
let autocompleteService;
let geometryService; // not needed as object, use google.maps.geometry.spherical
let userMarker = null;
let stopsMarkers = [];
let routePolyline = null;
let routeCache = {};

// helpers
function l(msg) { logEl.value = `${new Date().toLocaleTimeString()} ${msg}\n` + logEl.value; }
function haversine(a, b) {
    const R = 6371e3, toRad = v => v * Math.PI / 180;
    const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
    const Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lng - a.lng);
    const sinΔφ = Math.sin(Δφ / 2), sinΔλ = Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ), Math.sqrt(1 - (sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ)));
    return R * c;
}

// draw route on map (coords: array of {lat,lng} or [[lat,lng],...])
function drawRouteOnMap(coords) {
    // normalize coords
    const path = coords.map(c => (Array.isArray(c) ? { lat: c[0], lng: c[1] } : { lat: c.lat, lng: c.lng }));
    if (routePolyline) {
        routePolyline.setMap(null);
        routePolyline = null;
    }
    routePolyline = new google.maps.Polyline({ path, strokeColor: '#1976d2', strokeOpacity: 0.9, strokeWeight: 5 });
    routePolyline.setMap(map);

    // bounds
    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    if (userMarker) bounds.extend(userMarker.getPosition());
    map.fitBounds(bounds, 40);
}

function placeUserMarker(latlng) {
    const pos = new google.maps.LatLng(latlng.lat, latlng.lng);
    if (userMarker) userMarker.setPosition(pos);
    else {
        userMarker = new google.maps.Marker({
            position: pos,
            map,
            title: 'Bạn',
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#1e88e5', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 1 }
        });
    }
    map.setCenter(pos);
    map.setZoom(13);
}

function estimateDurationFromCoords(coords) {
    // sum haversine distances, convert to seconds at ~40 km/h
    if (!coords || coords.length < 2) return null;
    let m = 0;
    for (let i = 1; i < coords.length; i++) {
        const a = Array.isArray(coords[i - 1]) ? { lat: coords[i - 1][0], lng: coords[i - 1][1] } : coords[i - 1];
        const b = Array.isArray(coords[i]) ? { lat: coords[i][0], lng: coords[i][1] } : coords[i];
        m += haversine(a, b);
    }
    return m / 11.11; // meters / 11.11 m/s (~40 km/h)
}

// =================== INIT map & services (callback) ===================
window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: MAP_CENTER,
        zoom: 8,
        mapTypeControl: false
    });

    placesService = new google.maps.places.PlacesService(map);
    autocompleteService = new google.maps.places.AutocompleteService();

    initRouteOptions();
    attachUI();
    loadStopsForSelection();
    l('Google Maps initialized');
};

// =================== SELECTS / UI ===================
function initRouteOptions() {
    routeSelect.innerHTML = '';
    ROUTES.forEach(r => {
        const o = document.createElement('option'); o.value = r.id; o.text = r.name; routeSelect.appendChild(o);
    });
    onRouteChange();
}
function onRouteChange() {
    const rid = routeSelect.value;
    const r = ROUTES.find(x => x.id === rid);
    directionSelect.innerHTML = '';
    const optAB = document.createElement('option'); optAB.value = 'AB'; optAB.text = `${r.A} → ${r.B}`;
    const optBA = document.createElement('option'); optBA.value = 'BA'; optBA.text = `${r.B} → ${r.A}`;
    directionSelect.appendChild(optAB); directionSelect.appendChild(optBA);
    populateOperators();
}
function populateOperators() {
    operatorSelect.innerHTML = '';
    const r = ROUTES.find(x => x.id === routeSelect.value);
    if (!r) return;
    r.operators.forEach(op => {
        const o = document.createElement('option'); o.value = op.id; o.text = op.name; operatorSelect.appendChild(o);
    });
    loadStopsForSelection();
}
function clearStopsMarkers() {
    stopsMarkers.forEach(m => m.setMap(null));
    stopsMarkers = [];
}
function loadStopsForSelection() {
    clearStopsMarkers();
    const r = ROUTES.find(x => x.id === routeSelect.value);
    if (!r) return;
    const op = r.operators.find(o => o.id === operatorSelect.value) || r.operators[0];
    const dir = directionSelect.value || 'AB';
    const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
    stops.forEach(s => {
        const m = new google.maps.Marker({ position: { lat: s.lat, lng: s.lng }, map, title: s.name });
        const infow = new google.maps.InfoWindow({ content: `<strong>${s.name}</strong>` });
        m.addListener('click', () => infow.open(map, m));
        stopsMarkers.push(m);
    });
    if (stops.length) {
        const bounds = new google.maps.LatLngBounds();
        stops.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }));
        map.fitBounds(bounds, 40);
    }
}

// =================== FIND nearest (main logic) ===================
async function findNearestByName() {
    resultText.textContent = 'Đang xử lý...';
    try {
        const raw = addrInput.value.trim();
        if (!raw) throw 'Vui lòng nhập địa điểm (tên hoặc lat,lng)';
        let origin = null;

        // if dataset lat/lng already stored (from suggestion)
        if (addrInput.dataset.lat && addrInput.dataset.lng) {
            origin = { lat: parseFloat(addrInput.dataset.lat), lng: parseFloat(addrInput.dataset.lng) };
            l(`Sử dụng tọa độ đã chọn: ${origin.lat},${origin.lng}`);
        } else {
            // lat,lng typed
            if (raw.includes(',') && raw.split(',').length === 2 && !isNaN(raw.split(',')[0])) {
                const parts = raw.split(',').map(s => s.trim());
                origin = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
                l(`Parsed coordinates from input: ${origin.lat},${origin.lng}`);
            } else {
                // use Places text search to geocode name (bounded by viewbox if possible)
                origin = await geocodePlaceByText(raw);
                l(`Geocode Places: ${origin.lat},${origin.lng} (${origin.name || raw})`);
            }
        }

        placeUserMarker(origin);

        // get stops
        const route = ROUTES.find(r => r.id === routeSelect.value);
        const op = route.operators.find(o => o.id === operatorSelect.value);
        const dir = directionSelect.value || 'AB';
        const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
        if (!stops || stops.length === 0) throw 'Nhà xe chưa có điểm đón cho hướng này';

        // shortlist by straight distance (haversine)
        const arr = stops.map(s => ({ stop: s, d: haversine(origin, { lat: s.lat, lng: s.lng }) }));
        arr.sort((a, b) => a.d - b.d);
        const shortlist = arr.slice(0, Math.min(SHORTLIST_N, arr.length)).map(x => x.stop);
        l(`Shortlist: ${shortlist.map(s => s.name).join(', ')}`);

        // cache key
        const cacheKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}|${route.id}|${op.id}|${dir}`;
        const cached = routeCache[cacheKey];
        if (cached && (Date.now() - cached.ts) < CACHE_TTL_MS) {
            drawRouteOnMap(cached.coords);
            resultText.textContent = cached.stop.name;
            l(`Dùng cache cho ${cached.stop.name}`);
            return;
        }

        // Try ORS for accurate routing if key present; else fallback estimate
        let best = null;
        for (const cand of shortlist) {
            try {
                if (ORS_API_KEY) {
                    const r = await requestORSRoute(origin, { lat: cand.lat, lng: cand.lng });
                    const duration = r.summary?.duration || estimateDurationFromCoords(r.coords) || Number.MAX_SAFE_INTEGER;
                    if (!best || duration < best.duration) best = { stop: cand, coords: r.coords, summary: r.summary, duration };
                } else {
                    const d = haversine(origin, { lat: cand.lat, lng: cand.lng });
                    const estDur = d / 1000 / 40 * 3600; // seconds @40km/h
                    if (!best || estDur < best.duration) best = { stop: cand, coords: [[origin.lat, origin.lng], [cand.lat, cand.lng]], summary: { distance: d, duration: estDur }, duration: estDur };
                }
            } catch (e) {
                l(`Candidate ${cand.name} fail: ${e}`);
            }
        }

        if (!best) throw 'Không có route hợp lệ (ORS lỗi hoặc không có fallback).';

        routeCache[cacheKey] = { ts: Date.now(), stop: best.stop, coords: best.coords, summary: best.summary };
        drawRouteOnMap(best.coords);
        resultText.textContent = best.stop.name;
        l(`Chọn: ${best.stop.name} — ~${Math.round((best.summary?.duration || best.duration) / 60)} phút`);
    } catch (err) {
        resultText.textContent = 'Lỗi: ' + err;
        l('Error: ' + err);
    }
}
btnFind.addEventListener('click', findNearestByName);

// =================== Places Geocoding (text search) ===================
function geocodePlaceByText(q) {
    return new Promise((resolve, reject) => {
        if (!placesService) return reject('Places service chưa sẵn sàng');
        // optionally we can set bounds from current route to bias results
        const bounds = getBoundsForCurrentRoute();
        const req = { query: q, fields: ['geometry', 'name', 'formatted_address'] };
        if (bounds) req.bounds = bounds;
        // Use findPlaceFromQuery as text -> place with geometry
        placesService.findPlaceFromQuery(req, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length) {
                const p = results[0];
                const loc = p.geometry.location;
                resolve({ lat: loc.lat(), lng: loc.lng(), name: p.name || p.formatted_address });
            } else {
                // fallback: use AutocompleteService.getPlacePredictions + getDetails
                autocompleteService.getPlacePredictions({ input: q, bounds: bounds || null, types: [] }, (preds, st) => {
                    if (st === google.maps.places.PlacesServiceStatus.OK && preds && preds.length) {
                        placesService.getDetails({ placeId: preds[0].place_id, fields: ['geometry', 'name', 'formatted_address'] }, (det, st2) => {
                            if (st2 === google.maps.places.PlacesServiceStatus.OK && det && det.geometry) {
                                const loc2 = det.geometry.location;
                                resolve({ lat: loc2.lat(), lng: loc2.lng(), name: det.name || det.formatted_address });
                            } else reject('Không tìm thấy vị trí (places details)');
                        });
                    } else reject('Không tìm thấy vị trí (places text search)');
                });
            }
        });
    });
}

// bounds helper for Places bias
function getBoundsForCurrentRoute() {
    try {
        const r = ROUTES.find(x => x.id === routeSelect.value);
        if (!r) return null;
        const op = r.operators.find(o => o.id === operatorSelect.value) || r.operators[0];
        const dir = directionSelect.value || 'AB';
        const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
        if (!stops || stops.length === 0) return null;
        const bounds = new google.maps.LatLngBounds();
        stops.forEach(s => bounds.extend({ lat: s.lat, lng: s.lng }));
        return bounds;
    } catch (e) { return null; }
}

// =================== Autocomplete UI (use AutocompleteService predictions) ===================
function showSuggestions(items) {
    suggestionsList.innerHTML = '';
    if (!items || items.length === 0) { suggestionsList.style.display = 'none'; return; }
    items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it.description || it.name || '';
        li.dataset.placeId = it.place_id || '';
        li.addEventListener('click', async () => {
            // on select: get details
            if (li.dataset.placeId) {
                placesService.getDetails({ placeId: li.dataset.placeId, fields: ['geometry', 'name', 'formatted_address'] }, (det, st) => {
                    if (st === google.maps.places.PlacesServiceStatus.OK && det && det.geometry) {
                        const loc = det.geometry.location;
                        addrInput.value = li.textContent;
                        addrInput.dataset.lat = loc.lat();
                        addrInput.dataset.lng = loc.lng();
                        suggestionsList.style.display = 'none';
                        setTimeout(() => findNearestByName(), 150);
                    } else {
                        // fallback: use text search
                        addrInput.value = li.textContent;
                        suggestionsList.style.display = 'none';
                        setTimeout(() => findNearestByName(), 150);
                    }
                });
            } else {
                addrInput.value = li.textContent;
                suggestionsList.style.display = 'none';
                setTimeout(() => findNearestByName(), 150);
            }
        });
        suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = 'block';
}

function debounce(fn, wait) { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; }

const handleInput = debounce(async () => {
    const q = addrInput.value.trim();
    delete addrInput.dataset.lat; delete addrInput.dataset.lng;
    if (!q || q.length < 2) { showSuggestions([]); return; }
    l(`Autocomplete (places): "${q}"`);
    const bounds = getBoundsForCurrentRoute();
    autocompleteService.getPlacePredictions({ input: q, bounds: bounds || null, types: [] }, (preds, st) => {
        if (st === google.maps.places.PlacesServiceStatus.OK && preds && preds.length) {
            showSuggestions(preds);
        } else {
            showSuggestions([]); // nothing
        }
    });
}, 250);

addrInput.addEventListener('input', handleInput);
document.addEventListener('click', (e) => {
    const s = document.getElementById('suggestions');
    if (!s.contains(e.target) && e.target !== addrInput) suggestionsList.style.display = 'none';
});

// keyboard nav for suggestions (simple)
let focusedIndex = -1;
addrInput.addEventListener('keydown', (ev) => {
    const items = suggestionsList.querySelectorAll('li');
    if (!items.length) return;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
    else if (ev.key === 'Enter') { if (focusedIndex >= 0 && items[focusedIndex]) { ev.preventDefault(); items[focusedIndex].click(); focusedIndex = -1; } }
});

// =================== GEOLOCATION button ===================
btnUseGeol.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Trình duyệt không hỗ trợ Geolocation');
    navigator.geolocation.getCurrentPosition(p => {
        const lat = p.coords.latitude, lng = p.coords.longitude;
        addrInput.value = `${lat},${lng}`;
        addrInput.dataset.lat = lat; addrInput.dataset.lng = lng;
        placeUserMarker({ lat, lng });
    }, err => alert('Không lấy được vị trí: ' + err.message));
});

// =================== ORS helper (kept from original, optional) ===================
async function requestORSRoute(origin, dest) {
    if (!ORS_API_KEY) throw 'NO_ORS_KEY';
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    const body = { coordinates: [[origin.lng, origin.lat], [dest.lng, dest.lat]] };
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': ORS_API_KEY },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw `ORS lỗi ${res.status}`;
    const data = await res.json();
    const coords = data.features[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
    const summary = data.features[0].properties?.summary || null;
    return { coords, summary, raw: data };
}

// =================== Attach events ===================
function attachUI() {
    routeSelect.addEventListener('change', onRouteChange);
    directionSelect.addEventListener('change', loadStopsForSelection);
    operatorSelect.addEventListener('change', loadStopsForSelection);
    // Note: btnFind already attached above
}
