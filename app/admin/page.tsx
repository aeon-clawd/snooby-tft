"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">SnoobyTFT Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-200">
                <span className="font-medium">{session.user?.name}</span>
                <br />
                <span className="text-xs">{session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            🎮 Welcome to Admin Panel
          </h2>
          <p className="text-blue-200 mb-6">
            You're successfully authenticated as admin!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-white font-bold text-lg mb-2">
                Manage Comps
              </h3>
              <p className="text-blue-200 text-sm">
                Create and edit TFT team compositions
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-white font-bold text-lg mb-2">Users</h3>
              <p className="text-blue-200 text-sm">
                View analytics and user data
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-white font-bold text-lg mb-2">Settings</h3>
              <p className="text-blue-200 text-sm">
                Configure app settings and preferences
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-green-200 text-sm">
              ✅ Authentication system is working correctly!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
