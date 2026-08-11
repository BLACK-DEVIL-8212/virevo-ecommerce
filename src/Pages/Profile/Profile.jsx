import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, LogOut, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      const profileData = JSON.parse(localStorage.getItem(`profile_${user.uid}`) || '{}');
      setPhone(profileData.phone || '');
      setAddress(profileData.address || '');
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-10 h-10 border-2 border-primary-light border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/profile' } }} replace />;
  }

  const handleSave = (e) => {
    e.preventDefault();
    const profileData = {
      phone,
      address,
    };
    localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profileData));
    setSaveMessage('Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = () => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 min-h-[calc(100vh-48px)]">
        <aside className="bg-white rounded-xl shadow-sm p-7 h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-7 pb-5 border-b border-gray-200">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {getInitials()}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-gray-800 truncate">{name || 'User'}</h3>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 bg-transparent border-none w-full text-left cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 ${activeTab === 'profile' ? 'bg-primary-light text-primary' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Profile Info</span>
            </button>
            <button
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 bg-transparent border-none w-full text-left cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 ${activeTab === 'settings' ? 'bg-primary-light text-primary' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </button>
            <Link to="/orders" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800">
              <ShoppingBag size={18} />
              <span>My Orders</span>
            </Link>
            <button className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-500 bg-transparent border-none w-full text-left cursor-pointer transition-all duration-200 hover:bg-red-50 mt-3" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        <main className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-7 pb-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
            <p className="text-sm text-slate-500">Manage your personal information</p>
          </div>

          {activeTab === 'profile' && (
            <div>
              {saveMessage && (
                <div className="bg-emerald-50 text-green-800 px-4 py-3 rounded-lg text-sm border border-emerald-200 mb-5">{saveMessage}</div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {getInitials()}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-semibold text-gray-800 mb-0.5">{name || 'User'}</h3>
                    <p className="text-sm text-slate-500">{email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-gray-800">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email-display" className="text-xs font-medium text-gray-800">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                      <input
                        id="email-display"
                        type="email"
                        value={email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-slate-500 bg-gray-50 cursor-not-allowed transition-all duration-200"
                        placeholder="Your email"
                      />
                    </div>
                    <span className="text-xs text-slate-400">Email cannot be changed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-medium text-gray-800">Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="address" className="text-xs font-medium text-gray-800">Address</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
                      <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] outline-none"
                        placeholder="123 Main St, City"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-primary-dark">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
                <p className="text-sm text-slate-500 mt-0.5">Manage your account preferences and security</p>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Security</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">Password</p>
                    <p className="text-xs text-slate-500">Update your password to keep your account secure</p>
                  </div>
                  <button className="px-4 py-2 bg-transparent border border-gray-200 rounded-lg text-sm font-medium text-gray-800 cursor-pointer transition-all duration-200 hover:bg-white hover:border-primary hover:text-primary" onClick={() => navigate('/forgot-password')}>
                    Change Password
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Notifications</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive updates about your orders and promotions</p>
                  </div>
                  <label className="relative inline-block w-11 h-6 cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <span className="absolute inset-0 bg-gray-200 rounded-full transition-all duration-300 peer-checked:bg-primary"></span>
                    <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Danger Zone</h4>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-0.5">Delete Account</p>
                    <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-200 hover:bg-red-600">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
