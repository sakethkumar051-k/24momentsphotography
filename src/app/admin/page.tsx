import { redirect } from 'next/navigation';

export default function AdminHome() {
  // If someone visits `/admin` (no sub-route), send them to the dashboard.
  redirect('/admin/dashboard');
}

