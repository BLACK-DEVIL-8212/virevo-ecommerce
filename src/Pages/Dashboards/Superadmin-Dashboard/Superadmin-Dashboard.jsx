import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  DollarSign, BarChart3, Search, Shield, Settings, UserCog, Activity
} from 'lucide-react';
import './Superadmin-Dashboard.scss';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'admins', label: 'Admin Management', icon: UserCog },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const STATUS_CONFIG = {
  Pending: { color: '#f59e0b', bg: '#fef3c7' },
  Processing: { color: '#2563eb', bg: '#dbeafe' },
  Shipped: { color: '#8b5cf6', bg: '#ede9fe' },
  Delivered: { color: '#10b981', bg: '#d1fae5' },
  Cancelled: { color: '#ef4444', bg: '#fee2e2' }
};

const USERS_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'Active', joined: '2024-11-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'Active', joined: '2024-11-20' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'admin', status: 'Active', joined: '2024-10-05' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'Inactive', joined: '2024-12-01' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'Active', joined: '2024-12-05' },
  { id: 6, name: 'Eva Green', email: 'eva@example.com', role: 'admin', status: 'Active', joined: '2024-09-20' },
];

export default function SuperadminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { cartItems } = useCart();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(USERS_DATA);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (storedOrders.length === 0) {
      const sampleOrders = [
        { id: 'ORD-2024-001', date: '2024-12-01', customer: 'John Doe', email: 'john@example.com', status: 'Delivered', total: 249.97, items: 3 },
        { id: 'ORD-2024-002', date: '2024-12-05', customer: 'Jane Smith', email: 'jane@example.com', status: 'Shipped', total: 149.99, items: 1 },
        { id: 'ORD-2024-003', date: '2024-12-08', customer: 'Bob Wilson', email: 'bob@example.com', status: 'Processing', total: 89.99, items: 1 },
        { id: 'ORD-2024-004', date: '2024-12-10', customer: 'Alice Brown', email: 'alice@example.com', status: 'Pending', total: 169.98, items: 2 },
        { id: 'ORD-2024-005', date: '2024-12-11', customer: 'Charlie Davis', email: 'charlie@example.com', status: 'Delivered', total: 329.97, items: 3 },
      ];
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
      setOrders(sampleOrders);
    } else {
      setOrders(storedOrders);
    }
  }, []);

  const stats = {
    totalSales: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalCustomers: USERS_DATA.filter(u => u.role === 'user').length,
    totalProducts: products.length,
    totalAdmins: USERS_DATA.filter(u => u.role === 'admin').length,
    totalUsers: USERS_DATA.length,
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0,
  };

  const monthlyData = [
    { month: 'Jul', sales: 4200, orders: 42 },
    { month: 'Aug', sales: 3800, orders: 38 },
    { month: 'Sep', sales: 5100, orders: 51 },
    { month: 'Oct', sales: 4700, orders: 47 },
    { month: 'Nov', sales: 6200, orders: 62 },
    { month: 'Dec', sales: 5800, orders: 58 },
  ];

  const maxSales = Math.max(...monthlyData.map(d => d.sales));
  const maxOrders = Math.max(...monthlyData.map(d => d.orders));

  const topProducts = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="superadmin-dashboard">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'superadmin') {
    return (
      <div className="access-denied">
        <div className="denied-content">
          <Shield size={64} color="#ef4444" strokeWidth={1.5} />
          <h1>Access Denied</h1>
          <p>You don't have permission to access the superadmin dashboard.</p>
          <a href="/">Go Home</a>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="superadmin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Virevo Superadmin</h2>
          <span className="user-role">Superadmin</span>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{activeTab === 'dashboard' ? 'Dashboard Overview' :
            activeTab === 'products' ? 'Product Management' :
              activeTab === 'orders' ? 'Order Management' :
                activeTab === 'customers' ? 'Customer Management' :
                  activeTab === 'admins' ? 'Admin Management' :
                    activeTab === 'analytics' ? 'Analytics & Reports' :
                      'System Settings'}</h1>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon sales">
                  <DollarSign size={24} />
                </div>
                <div className="stat-info">
                  <h3>${stats.totalSales.toFixed(2)}</h3>
                  <p>Total Sales</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon orders">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
                <Activity size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon customers">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon products">
                  <Package size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon admins">
                  <UserCog size={24} />
                </div>
                <div className="stat-info">
                  <h3>{stats.totalAdmins}</h3>
                  <p>Total Admins</p>
                </div>
                <UserCog size={16} className="stat-trend" />
              </div>

              <div className="stat-card">
                <div className="stat-icon avg">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-info">
                  <h3>${stats.avgOrderValue.toFixed(2)}</h3>
                  <p>Avg. Order Value</p>
                </div>
                <TrendingUp size={16} className="stat-trend" />
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card sales-card">
                <div className="card-header">
                  <h3><BarChart3 size={20} /> Sales Overview</h3>
                </div>
                <div className="sales-chart">
                  {monthlyData.map(data => (
                    <div key={data.month} className="chart-bar">
                      <div className="bar-fill" style={{ height: `${(data.sales / maxSales) * 100}%` }}>
                        <span className="bar-value">${data.sales}</span>
                      </div>
                      <span className="bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card orders-chart-card">
                <div className="card-header">
                  <h3><ShoppingBag size={20} /> Orders Trend</h3>
                </div>
                <div className="sales-chart">
                  {monthlyData.map(data => (
                    <div key={data.month} className="chart-bar">
                      <div className="bar-fill orders-bar" style={{ height: `${(data.orders / maxOrders) * 100}%` }}>
                        <span className="bar-value">{data.orders}</span>
                      </div>
                      <span className="bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card top-products-card">
                <div className="card-header">
                  <h3><TrendingUp size={20} /> Top Selling Products</h3>
                </div>
                <div className="top-products-list">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <span className="product-rank">#{index + 1}</span>
                      <img src={product.image} alt={product.name} />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.reviews} reviews</p>
                      </div>
                      <span className="product-price">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card recent-activity-card">
                <div className="card-header">
                  <h3><Activity size={20} /> Recent Activity</h3>
                </div>
                <div className="activity-list">
                  {orders.slice(0, 5).map((order, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-dot" />
                      <div className="activity-info">
                        <p className="activity-text">New order <strong>{order.id}</strong></p>
                        <span className="activity-time">{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card orders-card">
              <div className="card-header">
                <h3><ShoppingBag size={20} /> Recent Orders</h3>
              </div>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 10).map(order => {
                      const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                      return (
                        <tr key={order.id}>
                          <td className="order-id-cell">{order.id}</td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.customer}</span>
                              <span className="customer-email">{order.email}</span>
                            </div>
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span className="table-status-badge" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}>
                              {order.status}
                            </span>
                          </td>
                          <td className="total-cell">${order.total.toFixed(2)}</td>
                          <td>{order.items}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>All Products ({products.length})</h3>
              </div>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card-admin">
                    <img src={product.image} alt={product.name} />
                    <div className="product-details">
                      <h4>{product.name}</h4>
                      <p className="product-category">{product.category}</p>
                      <div className="product-meta">
                        <span className="product-price-admin">${product.price}</span>
                        <span className="product-rating">★ {product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>All Orders ({orders.length})</h3>
              </div>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                      return (
                        <tr key={order.id}>
                          <td className="order-id-cell">{order.id}</td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.customer}</span>
                              <span className="customer-email">{order.email}</span>
                            </div>
                          </td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span className="table-status-badge" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}>
                              {order.status}
                            </span>
                          </td>
                          <td className="total-cell">${order.total.toFixed(2)}</td>
                          <td>{order.items}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>User Management ({users.length} users)</h3>
              </div>
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td className="user-name-cell">{u.name}</td>
                        <td className="user-email-cell">{u.email}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${u.status.toLowerCase()}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>{new Date(u.joined).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="dashboard-content">
            <div className="card">
              <div className="card-header">
                <h3>Admin Management</h3>
              </div>
              <div className="admins-grid">
                {users.filter(u => u.role === 'admin').map(admin => (
                  <div key={admin.id} className="admin-card">
                    <div className="admin-avatar">
                      {admin.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="admin-info">
                      <h4>{admin.name}</h4>
                      <p>{admin.email}</p>
                      <span className="admin-status">
                        <span className="status-dot active" />
                        Active
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button className="admin-btn edit">Edit</button>
                      <button className="admin-btn remove">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="add-admin-section">
                <button className="add-admin-btn">
                  <Users size={18} />
                  Add New Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <div className="dashboard-grid">
              <div className="card sales-card">
                <div className="card-header">
                  <h3><DollarSign size={20} /> Revenue Analytics</h3>
                </div>
                <div className="sales-chart">
                  {monthlyData.map(data => (
                    <div key={data.month} className="chart-bar">
                      <div className="bar-fill" style={{ height: `${(data.sales / maxSales) * 100}%` }}>
                        <span className="bar-value">${data.sales}</span>
                      </div>
                      <span className="bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3><ShoppingBag size={20} /> Orders Analytics</h3>
                </div>
                <div className="sales-chart">
                  {monthlyData.map(data => (
                    <div key={data.month} className="chart-bar">
                      <div className="bar-fill orders-bar" style={{ height: `${(data.orders / maxOrders) * 100}%` }}>
                        <span className="bar-value">{data.orders}</span>
                      </div>
                      <span className="bar-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-summary">
              <div className="card summary-card">
                <div className="card-header">
                  <h3><BarChart3 size={20} /> Key Metrics</h3>
                </div>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Conversion Rate</span>
                    <span className="metric-value">3.24%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Avg. Order Value</span>
                    <span className="metric-value">${stats.avgOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Total Revenue</span>
                    <span className="metric-value">${stats.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Active Users</span>
                    <span className="metric-value">{USERS_DATA.filter(u => u.status === 'Active').length}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Product Views</span>
                    <span className="metric-value">12.5K</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Cart Abandonment</span>
                    <span className="metric-value">24.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <div className="settings-grid">
              <div className="card">
                <div className="card-header">
                  <h3><Globe size={20} /> General Settings</h3>
                </div>
                <div className="settings-content">
                  <div className="setting-item">
                    <div>
                      <h4>Store Name</h4>
                      <p>Virevo E-Commerce</p>
                    </div>
                    <button className="setting-btn">Edit</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Store URL</h4>
                      <p>https://virevo.com</p>
                    </div>
                    <button className="setting-btn">Edit</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Currency</h4>
                      <p>USD ($)</p>
                    </div>
                    <button className="setting-btn">Edit</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3><Settings size={20} /> System Configuration</h3>
                </div>
                <div className="settings-content">
                  <div className="setting-item">
                    <div>
                      <h4>Maintenance Mode</h4>
                      <p>Disable storefront for maintenance</p>
                    </div>
                    <button className="setting-btn toggle">Disabled</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Registration</h4>
                      <p>Allow new user registrations</p>
                    </div>
                    <button className="setting-btn toggle enabled">Enabled</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Email Notifications</h4>
                      <p>Send order confirmation emails</p>
                    </div>
                    <button className="setting-btn toggle enabled">Enabled</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3><Shield size={20} /> Security</h3>
                </div>
                <div className="settings-content">
                  <div className="setting-item">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Require 2FA for admin accounts</p>
                    </div>
                    <button className="setting-btn toggle">Disabled</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Session Timeout</h4>
                      <p>30 minutes</p>
                    </div>
                    <button className="setting-btn">Edit</button>
                  </div>
                  <div className="setting-item">
                    <div>
                      <h4>Password Policy</h4>
                      <p>Minimum 8 characters</p>
                    </div>
                    <button className="setting-btn">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
