import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-linear-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back Test Dashboard, {user?.contactPerson || 'User'}!
          </h2>
        </div>

      </main>
    </div>
  );
}