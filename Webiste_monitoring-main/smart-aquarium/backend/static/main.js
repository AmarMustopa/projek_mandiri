/* Smart Aquarium dashboard script
	 - Reads /api/sensor-data/ which returns { data: [...], stats: {...} }
	 - Renders Temperature & pH line charts, Status pie, Oxygen & Ammonia gauges
	 - Rotates gauge needle SVG overlays placed in the template
*/

console.log('Smart Aquarium dashboard script loaded');

function toNum(v, fallback = 0) { const n = parseFloat(v); return Number.isFinite(n) ? n : fallback; }

function createLineChart(canvasId, color) {
	const ctx = document.getElementById(canvasId).getContext('2d');
	return new Chart(ctx, {
		type: 'line',
		data: { labels: [], datasets: [{ label: '', data: [], borderColor: color, backgroundColor: color, fill: true }] },
		options: {
			responsive: true, maintainAspectRatio: false,
			interaction: { mode: 'index', intersect: false },
			plugins: { legend: { display: false } },
			elements: { line: { tension: 0.36, borderWidth: 2 }, point: { radius: 0 } },
			scales: { x: { grid: { display: false }, ticks: { color: '#94A3B8' } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94A3B8' } } }
		}
	});
}

function createHalfDoughnut(canvasId, color, maxValue) {
	const ctx = document.getElementById(canvasId).getContext('2d');
	const gradient = ctx.createLinearGradient(0, 0, 200, 0);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, color + 'CC');
	return new Chart(ctx, { type: 'doughnut', data: { datasets: [{ data: [0, maxValue], backgroundColor: [gradient, 'rgba(255,255,255,0.04)'], borderWidth: 0 }] }, options: { rotation: -90 * (Math.PI / 180), circumference: 180 * (Math.PI / 180), cutout: '78%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
}

function createPie(canvasId, colors) {
	const ctx = document.getElementById(canvasId).getContext('2d');
	return new Chart(ctx, { type: 'doughnut', data: { labels: [], datasets: [{ data: [], backgroundColor: colors }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' } });
}

function valueToAngle(value, max) { const ratio = Math.max(0, Math.min(1, value / max)); return ratio * 180 - 90; }

// charts
const tempChart = createLineChart('temperatureChart', '#60A5FA');
const phChart = createLineChart('phChart', '#7C3AED');
const statusPie = createPie('statusChart', ['#10B981', '#F59E0B', '#EF4444']);
const oxygenGauge = createHalfDoughnut('oxygenGauge', '#3B82F6', 10);
const ammoniaGauge = createHalfDoughnut('ammoniaGauge', '#EF4444', 1);

function setNeedleRotation(containerSelector, angleDeg) {
	try {
		const container = document.querySelector(containerSelector);
		if (!container) return;
		const needle = container.querySelector('.gauge-needle');
		if (!needle) return;
		needle.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
	} catch (e) { console.warn(e); }
}

function updateFromCsv(resp) {
	if (!resp || !resp.data) return;
	const rows = resp.data.slice(-30);
	const labels = rows.map(r => r.timestamp);
	const temps = rows.map(r => toNum(r.temperature, null));
	const phs = rows.map(r => toNum(r.ph_level, null));

	tempChart.data.labels = labels; tempChart.data.datasets[0].data = temps; tempChart.update();
	phChart.data.labels = labels; phChart.data.datasets[0].data = phs; phChart.update();

	// status pie
	if (resp.stats && resp.stats.status_distribution) {
		const sd = resp.stats.status_distribution;
		statusPie.data.labels = ['Normal','Warning','Critical'];
		statusPie.data.datasets[0].data = [sd.Normal||0, sd.Warning||0, sd.Critical||0];
	} else {
		const counts = { Normal:0, Warning:0, Critical:0 };
		rows.forEach(r => { counts[r.status] = (counts[r.status]||0)+1; });
		statusPie.data.labels = ['Normal','Warning','Critical']; statusPie.data.datasets[0].data = [counts.Normal, counts.Warning, counts.Critical];
	}
	statusPie.update();

	// latest for gauges
	const latest = rows[rows.length-1] || rows[0];
	if (latest) {
		const oxy = toNum(latest.oxygen_level, 0);
		const ammo = toNum(latest.ammonia_level, 0);
		oxygenGauge.data.datasets[0].data = [oxy, Math.max(0,10-oxy)]; oxygenGauge.update();
		ammoniaGauge.data.datasets[0].data = [ammo, Math.max(0,1-ammo)]; ammoniaGauge.update();

		setNeedleRotation('#oxygenGauge', valueToAngle(oxy, 10));
		setNeedleRotation('#ammoniaGauge', valueToAngle(ammo, 1));

		const oxyEl = document.getElementById('oxygenValue'); if (oxyEl) oxyEl.textContent = `${oxy} mg/L`;
		const ammoEl = document.getElementById('ammoniaValue'); if (ammoEl) ammoEl.textContent = `${ammo} mg/L`;
	}

	// automation log (derive simple actions)
	const logTbody = document.getElementById('automationLog');
	if (logTbody) {
		const logs = rows.slice(-6).reverse().map(r => {
			const ts = r.timestamp.replace('T',' ').split('.')[0];
			const action = r.status === 'Critical' ? 'Alarm - cek parameter' : (r.status === 'Warning' ? 'Auto-adjust filter' : 'Monitoring OK');
			const badge = r.status === 'Critical' ? '<span class="badge danger">Kritis</span>' : (r.status === 'Warning' ? '<span class="badge warning">Perhatian</span>' : '<span class="badge success">Normal</span>');
			return `<tr><td>${ts}</td><td>${action}</td><td>${badge}</td></tr>`;
		}).join('');
		logTbody.innerHTML = logs;
	}

	// device status remains static for now
	const devTbody = document.getElementById('deviceStatus');
	if (devTbody) {
		devTbody.innerHTML = `\
			<tr><td>Sensor Suhu</td><td><span class="badge success">Online</span></td><td>1 menit lalu</td></tr>\
			<tr><td>Sensor pH</td><td><span class="badge success">Online</span></td><td>1 menit lalu</td></tr>\
			<tr><td>Sensor Oksigen</td><td><span class="badge success">Online</span></td><td>1 menit lalu</td></tr>\
			<tr><td>Sensor Amonia</td><td><span class="badge success">Online</span></td><td>1 menit lalu</td></tr>\
			<tr><td>Aerator</td><td><span class="badge success">Aktif</span></td><td>1 menit lalu</td></tr>\
			<tr><td>Pompa Filter</td><td><span class="badge success">Aktif</span></td><td>1 menit lalu</td></tr>\
		`;
	}
}

function fetchAndUpdate() {
	fetch('/api/sensor-data/')
		.then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json(); })
		.then(updateFromCsv)
		.catch(err => console.warn('sensor-data fetch failed', err));
}

fetchAndUpdate();
setInterval(fetchAndUpdate, 5000);

*** End Patch

