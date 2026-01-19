// Minimal frontend script to show sensor data when React build is not available.
console.log('React frontend loaded');

(async function () {
	const root = document.getElementById('root');
	if (!root) return;
	root.innerHTML = `
		<div style="font-family:Arial,Helvetica,sans-serif;padding:24px;">
			<h1 style="margin:0 0 12px 0;color:#0f172a">Smart Aquarium Dashboard</h1>
			<div id="latest" style="padding:12px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
				Loading sensor data...
			</div>
		</div>`;

	const latestEl = document.getElementById('latest');
	try {
		const res = await fetch('/api/sensors/');
		if (!res.ok) {
			latestEl.innerText = 'No data (status ' + res.status + '). Make sure backend is running and /api/sensors/ is available.';
			return;
		}
		const data = await res.json();
		if (!Array.isArray(data) || data.length === 0) {
			latestEl.innerText = 'No sensor data available yet.';
			return;
		}
		const latest = data[0];
		latestEl.innerHTML = `
			<div style="display:flex;gap:24px;align-items:center">
				<div style="min-width:160px;padding:8px;border-right:1px solid #eef2f7">
					<div style="font-size:12px;color:#64748b">Suhu</div>
					<div style="font-size:20px;font-weight:600">${latest.suhu ?? '—'} °C</div>
				</div>
				<div style="min-width:160px;padding:8px;border-right:1px solid #eef2f7">
					<div style="font-size:12px;color:#64748b">pH</div>
					<div style="font-size:20px;font-weight:600">${latest.ph ?? '—'}</div>
				</div>
				<div style="min-width:160px;padding:8px;">
					<div style="font-size:12px;color:#64748b">Kekeruhan</div>
					<div style="font-size:20px;font-weight:600">${latest.kekeruhan ?? '—'}</div>
				</div>
			</div>
			<div style="margin-top:12px;font-size:12px;color:#94a3b8">Timestamp: ${latest.timestamp || ''}</div>
		`;
	} catch (err) {
		latestEl.innerText = 'Error fetching sensor data: ' + (err.message || err);
	}
})();