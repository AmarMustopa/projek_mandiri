export default function NotificationBar({ kekeruhan }) {
  return kekeruhan > 50 ? (
    <div className="bg-red-500 text-white p-2">Warning: Air Keruh!</div>
  ) : null;
}
