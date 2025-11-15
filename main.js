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
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYwYzI2ZDZlMDJhNDQ4ZmFhOTM4MzBhMGU1ODc1NDA5IiwiaCI6Im11cm11cjY0In0='; // <-- dán OpenRouteService API key vào nếu có (optional)
const MAP_CENTER = [21.0, 106.0];
const SHORTLIST_N = 3;
const CACHE_TTL_MS = 5 * 60 * 1000;

// =================== KHỞI TẠO MAP ===================
const map = L.map('map').setView(MAP_CENTER, 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

let stopsLayer = L.layerGroup().addTo(map);
let userMarker = null;
let routeLine = null;
let routeCache = {};

// UI refs
const logEl = document.getElementById('log');
const resultText = document.getElementById('resultText');
const routeSelect = document.getElementById('routeSelect');
const directionSelect = document.getElementById('directionSelect');
const operatorSelect = document.getElementById('operatorSelect');
const addrInput = document.getElementById('addr');
const btnUseGeol = document.getElementById('btnUseGeol');
const btnFind = document.getElementById('btnFind');
const suggestionsList = document.getElementById('suggestionsList');

// ========== HELPERS ==========
function l(msg) { logEl.value = `${new Date().toLocaleTimeString()} ${msg}\n` + logEl.value; }
function haversine(a, b) {
    const R = 6371e3, toRad = v => v * Math.PI / 180;
    const φ1 = toRad(a.lat), φ2 = toRad(b.lat);
    const Δφ = toRad(b.lat - a.lat), Δλ = toRad(b.lng - a.lng);
    const sinΔφ = Math.sin(Δφ / 2), sinΔλ = Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ), Math.sqrt(1 - (sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ)));
    return R * c;
}
function drawRouteOnMap(coords) {
    if (routeLine) { routeLine.remove(); routeLine = null; }
    routeLine = L.polyline(coords, { color: 'blue', weight: 4 }).addTo(map);
    const bounds = L.latLngBounds(coords);
    if (userMarker) bounds.extend(userMarker.getLatLng());
    map.fitBounds(bounds, { padding: [40, 40] });
}
function placeUserMarker(latlng) {
    if (userMarker) userMarker.remove();
    userMarker = L.circleMarker([latlng.lat, latlng.lng], { radius: 6, color: '#1e88e5', fillColor: '#1e88e5', fillOpacity: 1, weight: 1 })
        .addTo(map).bindPopup('Bạn');
    map.setView([latlng.lat, latlng.lng], 12);
}
function estimateDurationFromCoords(coords) {
    if (!coords || coords.length < 2) return null;
    let m = 0;
    for (let i = 1; i < coords.length; i++) {
        const a = { lat: coords[i - 1][0], lng: coords[i - 1][1] };
        const b = { lat: coords[i][0], lng: coords[i][1] };
        m += haversine(a, b);
    }
    return m / 11.11; // meters / 11.11 m/s (~40 km/h)
}

// ========== INIT selects ==========
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
function loadStopsForSelection() {
    stopsLayer.clearLayers();
    const r = ROUTES.find(x => x.id === routeSelect.value);
    if (!r) return;
    const op = r.operators.find(o => o.id === operatorSelect.value) || r.operators[0];
    const dir = directionSelect.value || 'AB';
    const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
    stops.forEach(s => L.marker([s.lat, s.lng]).addTo(stopsLayer).bindPopup(s.name));
    if (stops.length) map.fitBounds(stops.map(s => [s.lat, s.lng]), { padding: [40, 40] });
}

// attach events for selects
routeSelect.addEventListener('change', onRouteChange);
directionSelect.addEventListener('change', loadStopsForSelection);
operatorSelect.addEventListener('change', loadStopsForSelection);

// initial
initRouteOptions();
routeSelect.value = ROUTES[0].id;
directionSelect.value = 'AB';

// ========== GEOCODING (Nominatim) ==========
async function nominatimSearch(q, limit = 5) {
    if (!q || q.trim().length < 2) return [];
    const viewbox = getViewboxForCurrentRoute();
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${limit}&addressdetails=0`;
    if (viewbox) url += `&viewbox=${viewbox}&bounded=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'vi' } });
    if (!res.ok) return [];
    return await res.json();
}
async function geocodeNominatimSingle(q) {
    const arr = await nominatimSearch(q, 1);
    if (!arr || arr.length === 0) throw 'Không tìm thấy địa chỉ';
    return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon), display_name: arr[0].display_name };
}
function getViewboxForCurrentRoute() {
    try {
        const r = ROUTES.find(x => x.id === routeSelect.value);
        if (!r) return null;
        const op = r.operators.find(o => o.id === operatorSelect.value) || r.operators[0];
        const dir = directionSelect.value || 'AB';
        const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
        if (!stops || stops.length === 0) return null;
        const lats = stops.map(s => s.lat), lngs = stops.map(s => s.lng);
        const top = Math.max(...lats), bottom = Math.min(...lats), left = Math.min(...lngs), right = Math.max(...lngs);
        const padLat = (top - bottom) * 0.2 + 0.02, padLng = (right - left) * 0.2 + 0.02;
        const vLeft = (left - padLng).toFixed(6), vTop = (top + padLat).toFixed(6), vRight = (right + padLng).toFixed(6), vBottom = (bottom - padLat).toFixed(6);
        return `${vLeft},${vTop},${vRight},${vBottom}`;
    } catch (e) { return null; }
}

// ========== ORS route request ==========
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
    const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
    const summary = data.features[0].properties?.summary || null;
    return { coords, summary, raw: data };
}

// ========== MAIN: tìm điểm đón gần nhất ==========
async function findNearestByName() {
    resultText.textContent = 'Đang xử lý...';
    try {
        const raw = addrInput.value.trim();
        if (!raw) throw 'Vui lòng nhập địa điểm (tên hoặc lat,lng)';
        let origin = null;

        // if dataset lat/lng already stored (from suggestion)
        if (addrInput.dataset.lat && addrInput.dataset.lng) {
            origin = { lat: parseFloat(addrInput.dataset.lat), lng: parseFloat(addrInput.dataset.lng) };
            l(`Sử dụng tọa độ được chọn: ${origin.lat},${origin.lng}`);
        } else {
            // lat,lng typed
            if (raw.includes(',') && raw.split(',').length === 2 && !isNaN(raw.split(',')[0])) {
                const parts = raw.split(',').map(s => s.trim());
                origin = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
                l(`Parsed coordinates from input: ${origin.lat},${origin.lng}`);
            } else {
                // geocode by name
                const g = await geocodeNominatimSingle(raw);
                origin = { lat: g.lat, lng: g.lng };
                l(`Geocode result: ${origin.lat},${origin.lng} (${g.display_name})`);
            }
        }

        placeUserMarker(origin);

        // get stops for current selection
        const route = ROUTES.find(r => r.id === routeSelect.value);
        const op = route.operators.find(o => o.id === operatorSelect.value);
        const dir = directionSelect.value || 'AB';
        const stops = dir === 'AB' ? (op.stopsAB || []) : (op.stopsBA || op.stopsAB.slice().reverse());
        if (!stops || stops.length === 0) throw 'Nhà xe chưa có điểm đón cho hướng này';

        // shortlist by haversine
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

        // evaluate shortlist: if ORS key present, use ORS sequentially; otherwise fallback to straight distance
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

        // cache and draw
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

// ========== AUTOCOMPLETE (Nominatim) ==========
function debounce(fn, wait) { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; }

function showSuggestions(items) {
    suggestionsList.innerHTML = '';
    if (!items || items.length === 0) { suggestionsList.style.display = 'none'; return; }
    items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it.display_name || it.name || `${it.lat},${it.lon}`;
        li.dataset.lat = it.lat; li.dataset.lon = it.lon;
        li.addEventListener('click', () => {
            addrInput.value = li.textContent;
            addrInput.dataset.lat = li.dataset.lat; addrInput.dataset.lng = li.dataset.lon;
            suggestionsList.style.display = 'none';
            setTimeout(() => findNearestByName(), 150);
        });
        suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = 'block';
}

document.addEventListener('click', (e) => {
    const s = document.getElementById('suggestions');
    if (!s.contains(e.target) && e.target !== addrInput) suggestionsList.style.display = 'none';
});

const handleInput = debounce(async () => {
    const q = addrInput.value.trim();
    delete addrInput.dataset.lat; delete addrInput.dataset.lng;
    if (!q || q.length < 2) { showSuggestions([]); return; }
    try { l(`Autocomplete: "${q}"`); const list = await nominatimSearch(q); showSuggestions(list); } catch (e) { console.warn(e); showSuggestions([]); }
}, 300);

addrInput.addEventListener('input', handleInput);

// keyboard nav for suggestions
let focusedIndex = -1;
addrInput.addEventListener('keydown', (ev) => {
    const items = suggestionsList.querySelectorAll('li');
    if (!items.length) return;
    if (ev.key === 'ArrowDown') { ev.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0); items.forEach((it, idx) => it.style.background = idx === focusedIndex ? '#eef6ff' : '#fff'); }
    else if (ev.key === 'Enter') { if (focusedIndex >= 0 && items[focusedIndex]) { ev.preventDefault(); items[focusedIndex].click(); focusedIndex = -1; } }
});

// ========== GEOLOCATION BUTTON ==========
btnUseGeol.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Trình duyệt không hỗ trợ Geolocation');
    navigator.geolocation.getCurrentPosition(p => {
        const lat = p.coords.latitude, lng = p.coords.longitude;
        addrInput.value = `${lat},${lng}`;
        addrInput.dataset.lat = lat; addrInput.dataset.lng = lng;
        placeUserMarker({ lat, lng });
    }, err => alert('Không lấy được vị trí: ' + err.message));
});
