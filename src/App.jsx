import { useState, useEffect } from 'react'
import backgroundImage from './login-bg.png';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activePage, setActivePage] = useState("inventory") 
  const [isBtnHovered, setIsBtnHovered] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [orderSearch, setOrderSearch] = useState("");

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("inventoryData");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("ordersData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("inventoryData", JSON.stringify(inventory));
    localStorage.setItem("ordersData", JSON.stringify(orders));
  }, [inventory, orders]);

  // Naye order ke liye temporary input state
  const [newOrder, setNewOrder] = useState({ customer: '', itemId: '', qty: '', status: 'Pending', price: '' });

  // --- FORM STATE (Naya item add karne ke liye) ---
  const [newItem, setNewItem] = useState({ name: '', model: '', stock: '', price: '', category: '' });
  const [editingId, setEditingId] = useState(null); // Kis item ko edit kar rahe hain

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === "admin" && password === "123") setIsLoggedIn(true)
    else alert("Invalid credentials! Please enter admin/123.")
  };
  
  const handleAction = () => { // Add/Edit dono ke liye same function
    if(!newItem.name || !newItem.model) return alert("Name and Model are required!");

    if (editingId) {
      // Update existing item
      setInventory(inventory.map(item => 
        item.id === editingId ? { ...newItem, id: editingId, stock: Number(newItem.stock), price: Number(newItem.price) } : item
      ));
    } else {
      // Add new item
      const itemToAdd = { ...newItem, id: Date.now(), stock: Number(newItem.stock), price: Number(newItem.price) };
      setInventory([...inventory, itemToAdd]);
    }
    setNewItem({ name: '', model: '', stock: '', price: '', category: '' });
    setEditingId(null);
  };

  const startEdit = (item) => {
    setNewItem(item);
    setEditingId(item.id);
  };

  const deleteItem = (id) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  // Logout Logic
  const handleLogout = () => {
    setActivePage("logout"); // Pehle violet highlight dikhayenge
    setTimeout(() => {
      setIsLoggedIn(false);
      setActivePage("inventory"); // Reset for next login
    }, 300); // 300ms ka transition time
  }

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.glassCard}>
          <h2 style={styles.title}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>👤</span> 
              <input 
                type="text" 
                placeholder="Username" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                style={styles.input} 
              />
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🔐</span>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                style={styles.input} 
              />
            </div>
            <button type="submit" onMouseEnter={()=>setIsBtnHovered(true)} onMouseLeave={()=>setIsBtnHovered(false)}
              style={{...styles.button, ...(isBtnHovered ? styles.buttonHover : {})}}>Login
            </button>
          </form>
        </div>
      </div>
    )
  }
    return (
      <div style={styles.appContainer}>
        <div style={styles.navbar}> {/*--- TOP NAVBAR ---*/}
          <div style={styles.logo}>🚀 Order & Inventory Pro</div>
          
          <div style={styles.navContainer}> {/* Sliding Navigation Container */}
              <div style={{
                  ...styles.navIndicator,
                  transform: activePage === "inventory" ? "translateX(0px)" : 
                            activePage === "orders" ? "translateX(110px)" :
                            activePage === "reports" ? "translateX(220px)" : "translateX(330px)",
                  backgroundColor: '#8A2BE2' // Violet color highlight
                }}/>
                <button onClick={() => setActivePage("inventory")} style={styles.navTabBtn}>Inventory</button>
                <button onClick={() => setActivePage("orders")} style={styles.navTabBtn}>Orders</button>
                <button onClick={() => setActivePage("reports")} style={styles.navTabBtn}>Reports</button>
                <button onClick={handleLogout} style={styles.navTabBtn}>Logout</button>
              </div>
          </div>

          {/* --- MAIN CONTENT CARD --- */}
          <div style={styles.mainContent}>
            <div style={styles.whiteCard}>
              {activePage === "inventory" ? (
                <>
                  {/* --- 1. TOP STATS (Right Aligned & Box Style) --- */}
                  <div style={{
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'flex-end', // Items ko ekdum right mein push karega
                    gap: '20px', 
                    marginBottom: '35px'}}>
                      {/* Box 1: Total Items */}
                      <div style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #eee', 
                        padding: '15px 30px', 
                        borderRadius: '15px', 
                        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                        textAlign: 'center',
                        minWidth: '110px',
                        borderBottom: '4px solid #8A2BE2' // Violet accent for Total Items
                      }}>
                        <h2 style={{ fontSize: '32px', margin: 0, color: '#333' }}>{inventory.length}</h2>
                        <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Items</p>
                      </div>

                    {/* Box 2: Total Stock */}
                      <div style={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #eee', 
                        padding: '15px 30px', 
                        borderRadius: '15px', 
                        boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                        textAlign: 'center',
                        minWidth: '110px',
                        borderBottom: '4px solid #2ecc71' // Violet accent for Total Stock
                      }}>
                        <h2 style={{ fontSize: '32px', margin: 0, color: '#333' }}>
                          {inventory.reduce((sum, item) => sum + item.stock, 0)}
                        </h2>
                        <p style={{ fontSize: '11px', margin: '5px 0 0 0', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Stock</p>
                      </div>
                  </div>

                  {/* 2. FORM (Fixed: model mapping) */}
                    <div style={styles.formContainer}>
                      <h3 style={{textAlign: 'left', marginBottom: '15px'}}>{editingId ? "Edit Item" : "➕ Add New Item"}</h3>
                      <div style={styles.formRow}>
                        <input placeholder="Item Name" value={newItem.name} onChange={(e)=>setNewItem({...newItem, name: e.target.value})} style={styles.formInput} />
                        <input placeholder="Model" value={newItem.model} onChange={(e)=>setNewItem({...newItem, model: e.target.value})} style={styles.formInput} />
                      </div>
                      <div style={styles.formRow}>
                        <input type="number" placeholder="Stock" value={newItem.stock} onChange={(e)=>setNewItem({...newItem, stock: e.target.value})} style={styles.formInput} />
                        <input type="number" placeholder="Price" value={newItem.price} onChange={(e)=>setNewItem({...newItem, price: e.target.value})} style={styles.formInput} />
                        <input placeholder="Category" value={newItem.category} onChange={(e)=>setNewItem({...newItem, category: e.target.value})} style={styles.formInput} />
                      </div>
                      <button onClick={handleAction} style={{...styles.addItemBtn, backgroundColor: editingId ? '#8A2BE2' : 'black'}}>
                        {editingId ? "Update Item" : "Add Item"}
                      </button>
                    </div>

                  {/* --- 2.5 SEARCH FILTER BAR (Form aur Table ke beech mein) --- */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      marginBottom: '20px',
                      marginTop: '10px' 
                    }}>
                      <div style={{ position: 'relative', width: '300px' }}>
                        <span style={{ 
                          position: 'absolute', 
                          left: '15px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: '#ffffff',
                          fontSize: '14px',
                          opacity: 0.5
                        }}></span>
                        <input 
                          type="text" 
                          placeholder="🔍 Search by Name or Model..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{padding: '10px 15px', width: '250px', borderRadius: '20px', border: '2px solid #bbb', fontSize: '12px', outline: 'none', backgroundColor: '#dddada', color: 'black', fontWeight: '500', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                        />
                      </div>
                    </div>

                  {/* 3. TABLE (Fixed: Edit Button) */}
                    <table style={styles.table}>
                      <thead>
                        <tr style={{borderBottom: '2px solid #eee', textAlign: 'center'}}>
                          <th style={{padding: '10px'}}>Name</th><th>Model</th><th>Stock</th><th>Price</th><th>Category</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory
                          .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.model.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(item => (
                          <tr key={item.id} style={styles.tr}>
                            <td style={{padding: '12px'}}>{item.name}</td>
                            <td>{item.model}</td>
                            <td style={{color: item.stock < 10 ? 'red' : 'green', fontWeight: 'bold'}}>{item.stock}</td>
                            <td>{item.price.toLocaleString()} Rs</td>
                            <td>{item.category}</td>
                            <td>
                              <button onClick={() => startEdit(item)} style={styles.editBtn}>Edit</button>
                              <button onClick={()=>deleteItem(item.id)} style={styles.deleteBtn}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </>
              ) : activePage === "orders" ? (
                <>
                  {/* 1. TOP STATS */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '35px' }}>
                      <div style={styles.orderStatBox}>
                        <h2 style={{ fontSize: '32px', margin: 0, color: '#333' }}>{orders.length}</h2>
                        <p style={styles.orderStatLabel}>Total Orders</p>
                      </div>
                      <div style={{ ...styles.orderStatBox, borderBottom: '4px solid #2ecc71' }}>
                        <h2 style={{ fontSize: '32px', margin: 0, color: '#333' }}>
                          {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                        </h2>
                        <p style={styles.orderStatLabel}>Total Revenue (Rs)</p>
                      </div>
                    </div>

                  {/* 2. CREATE ORDER FORM */}
                    <div style={styles.formContainer}>
                      <h3 style={{ textAlign: 'left', marginBottom: '20px' }}>
                        {editingOrderId ? "Edit Order" : "➕ Create New Order"}
                      </h3>
                      <div style={styles.formRow}>
                        <input placeholder="Customer Name" value={newOrder.customer} onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })} style={styles.formInput} />
                          <select value={newOrder.itemId} onChange={(e) => {
                            const item = inventory.find(i => i.id === Number(e.target.value));
                            setNewOrder({ ...newOrder, itemId: e.target.value, price: item ? item.price : '' });
                          }} style={styles.formInput}
                          >
                            <option value="">Select Product</option>
                            {inventory.map(item => <option key={item.id} value={item.id}>{item.name} ({item.stock} left)</option>)}
                          </select>
                      </div>
                      <div style={styles.formRow}>
                        <input type="number" placeholder="Price" value={newOrder.price || ''} onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })} style={{ ...styles.formInput, flex: 1 }} />
                        <input type="number" placeholder="Qty" value={newOrder.qty} onChange={(e) => setNewOrder({ ...newOrder, qty: e.target.value })} style={{ ...styles.formInput, flex: 0.5 }} />
                        <select value={newOrder.status || "Pending"} onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })} style={{ ...styles.formInput, flex: 1 }}>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <button onClick={() => {
                        const item = inventory.find(i => i.id === Number(newOrder.itemId));
                        if (!newOrder.customer || !item || !newOrder.price) return alert("Details bharo!");

                        const orderTotal = Number(newOrder.price) * Number(newOrder.qty);

                        if (editingOrderId) {
                          setOrders(orders.map(o => o.id === editingOrderId ? { ...newOrder, id: editingOrderId, item: item.name, total: orderTotal } : o));
                          setEditingOrderId(null);
                        } 
                        else {
                          if (item.stock < newOrder.qty) return alert("Stock nahi hai!");
                          // ID Logic: Agar pehla order hai toh 101, nahi toh last ID + 1
                          const nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;

                          setOrders([{
                            id: nextId, customer: newOrder.customer, item: item.name,
                            qty: Number(newOrder.qty), total: orderTotal, status: newOrder.status || "Pending",
                            date: new Date().toLocaleDateString(), itemId: item.id
                          }, ...orders]);
          
                          setInventory(inventory.map(invItem => invItem.id === item.id ? { ...invItem, stock: invItem.stock - newOrder.qty } : invItem));
                        }
                        setNewOrder({ customer: '', itemId: '', qty: '', status: 'Pending', price: '' });
                        setEditingOrderId(null);
                      }} style={{...styles.addItemBtn, backgroundColor: editingOrderId ? '#8A2BE2' : 'black', marginTop: '10px'}}>
                        {editingOrderId ? "Update Order" : "Place Order"}
                      </button>
                    </div>

                  {/* 3. ORDER SEARCH BAR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '30px', alignItems: 'center' }}>
                      <h3 style={{ textAlign: 'left', marginBottom: '15px' }}>📜 Order History</h3>
                      <input 
                        type="text" 
                        placeholder="🔍 Search Customer or Product..." 
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        style={{ padding: '10px 15px', width: '250px', borderRadius: '20px', border: '2px solid #bbb', fontSize: '12px', outline: 'none', backgroundColor: '#dddada', color: 'black', fontWeight: '500', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                      />
                    </div>

                  {/* 4. TABLE */}
                    <table style={styles.table}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'center' }}>
                          <th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter(o => o.customer.toLowerCase().includes(orderSearch.toLowerCase()) || o.item.toLowerCase().includes(orderSearch.toLowerCase()))
                          .map(order => (
                            <tr key={order.id} style={styles.tr}>
                              <td style={{ padding: '12px' }}>#{order.id}</td>
                              <td>{order.customer}</td><td>{order.item}</td><td>{order.qty}</td><td>{order.total} Rs</td>
                              <td><span style={{ color: order.status === 'Completed' ? 'green' : 'orange', fontWeight: 'bold' }}>{order.status}</span></td>
                              <td>
                                <button onClick={() => {setNewOrder(order); setEditingOrderId(order.id);}} style={styles.editBtn}>Edit</button>
                                <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} style={styles.deleteBtn}>Delete</button>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                </>
              ) : activePage === "reports" ? (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                  <h2 style={{ textAlign: 'left', marginBottom: '30px', color: '#333', fontWeight: 'bold' }}>📊 Business Analytics</h2>
      
                  {/* --- 1. TOP SUMMARY CARDS --- */}
                  <div style={{ display: 'flex', gap: '25px', marginBottom: '40px' }}>
                    {[
                      { label: 'TOTAL REVENUE', value: `${orders.reduce((s, o) => s + o.total, 0).toLocaleString()} Rs`, color: '#8A2BE2' },
                      { label: 'ITEMS SOLD', value: orders.reduce((s, o) => s + o.qty, 0), color: '#2ecc71' },
                      { label: 'PENDING ORDERS', value: orders.filter(o => o.status === "Pending").length, color: '#e74c3c' }
                    ].map((card, idx) => (
                      <div key={idx} style={{ ...styles.reportCard3D, borderTop: `6px solid ${card.color}`, textAlign: 'center' }}>
                        <h3 style={{ color: '#999', fontSize: '13px', margin: '0 0 10px 0', letterSpacing: '1px' }}>{card.label}</h3>
                        <h2 style={{ fontSize: '30px', margin: 0, color: '#222', fontWeight: '600' }}>{card.value}</h2>
                      </div>
                    ))}
                  </div>

                  
                    {/* --- 2. LOW STOCK ALERT (DANGER ZONE) --- */}
                    <div style={{ 
                      backgroundColor: '#fffcfc', 
                      padding: '30px', 
                      borderRadius: '20px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)', 
                      border: '1px solid #fed7d7', 
                      marginBottom: '40px' 
                    }}>
                      <h4 style={{ color: '#c53030', margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        ⚠️ Low Stock Inventory (Below 10)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {inventory.filter(i => i.stock < 10).length > 0 ? (
                          inventory.filter(i => i.stock < 10).map((item, index) => (
                            <div key={item.id} style={{ 
                              padding: '12px 20px', 
                              background: index % 2 === 0 ? '#fff' : '#fff5f5', // zebra striping for better readability
                              borderRadius: '12px', 
                              border: '1px solid #eee', 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{ color: '#888', fontWeight: 'bold' }}>{index + 1}.</span>
                                <span style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>{item.name}</span>
                                <span style={{ color: '#777', fontSize: '13px' }}>[{item.model}]</span>
                              </div>
                              <div style={{ 
                                backgroundColor: '#ffe5e5', 
                                color: '#e74c3c', 
                                padding: '5px 15px', 
                                borderRadius: '20px', 
                                fontWeight: 'bold',
                                fontSize: '14px'
                              }}>
                                Only {item.stock} left
                              </div>
                            </div>
                          ))
                        ) : ( 
                          <div style={{ textAlign: 'center', padding: '20px', color: '#2ecc71', fontWeight: '500' }}>
                            Great! All items are well stocked.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- 3. RECENT SALES ACTIVITY --- */}
                      <div style={{ 
                        backgroundColor: 'white', 
                        padding: '30px', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                        border: '1px solid #eee',
                        marginBottom: '20px'
                      }}>
                        <h4 style={{ margin: '0 0 25px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                          📈 Top Selling Products (by Quantity)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Graph Logic Start */}
                          {Array.from(new Set(orders.map(o => o.item))).length > 0 ? (
                            Array.from(new Set(orders.map(o => o.item))).slice(0, 5).map(itemName => {
                              const totalQty = orders.filter(o => o.item === itemName).reduce((s, o) => s + o.qty, 0);
                              const maxOrderQty = Math.max(...orders.map(o => o.qty), 1);
                              const barWidth = Math.min((totalQty / (maxOrderQty * 2)) * 100, 100);

                              return (
                                <div key={itemName} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                  <div style={{ width: '150px', fontSize: '14px', fontWeight: '600', textAlign: 'right', color: '#555' }}>
                                    {itemName}
                                  </div>
                                  <div style={{ flex: 1, height: '30px', backgroundColor: '#f0f0f0', borderRadius: '15px', overflow: 'hidden' }}>
                                    <div style={{ 
                                      width: `${barWidth || 10}%`, 
                                      height: '100%', 
                                      background: 'linear-gradient(90deg, #8A2BE2, #C77DFF)', 
                                      borderRadius: '15px', 
                                      transition: 'width 1s ease-in-out' 
                                    }}/>
                                    </div>
                                    <div style={{ width: '80px', fontWeight: 'bold', color: '#8A2BE2', fontSize: '16px' }}>
                                      {totalQty} sold
                                    </div>
                                  </div>
                                )
                            })
                          ) : (
                            <div style={{textAlign: 'center', color: '#999', padding: '20px'}}>
                              No sales data yet to show graph. Place some orders first!
                            </div>
                          )}
                          {/* Graph Logic End */}
                        </div>
                      </div>
                  </div>
                
              ) : (                          
                <h2 style={{textAlign: 'center'}}>Logging out...</h2>
              )}
          </div>
        </div>
      </div>
    )
}

const styles = {
  // ... Purane Login Styles ...
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'Arial' },
  glassCard: { 
    background: 'rgba(255, 255, 255, 0.15)', 
    backdropFilter: 'blur(15px)', 
    padding: '40px', // Spacing thodi kam ki
    borderRadius: '25px', 
    width: '380px', 
    textAlign: 'center', 
    color: 'white', 
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  },
  title: { fontSize: '36px', marginBottom: '25px', fontWeight: '600'},
  inputGroup: { position: 'relative', margin: '15px 0', width: '100%' },
  input: { 
    width: '100%', 
    padding: '14px 15px 14px 45px', // Left padding icons ke liye
    borderRadius: '25px', 
    border: '1px solid rgba(255, 255, 255, 0.5)', 
    background: 'rgba(255,255,255,0.1)', 
    color: 'white',
    fontSize: '16px', // Font thoda bada
    outline: 'none', 
    boxSizing: 'border-box' 
  },
  button: {
    width: '100%', padding: '14px', borderRadius: '25px', border: 'none',
    backgroundColor: 'white', color: '#333', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
  },
  inputIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 1.9 },
  optionsRow: { display: 'flex', justifyContent: 'space-between', margin: '15px 0 25px 0', fontSize: '14px' },
  buttonHover: { boxShadow: '0 0 20px white', transform: 'scale(1.02)' },

  // --- NEW SLIDING INTERFACE STYLES ---
  appContainer: { minHeight: '100vh', backgroundColor: '#8A2BE2', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#333' },
  
  navContainer: {
    position: 'relative',
    display: 'flex',
    backgroundColor: '#f0f0f0',
    borderRadius: '30px',
    padding: '5px',
    width: '445px', // Teeno buttons ke liye fixed width
    height: '45px',
    alignItems: 'center'
  },
  navIndicator: {
    position: 'absolute',
    width: '105px', // Ek button ki width
    height: '35px',
    borderRadius: '25px',
    transition: 'all 0.4s ease-in-out', // Sliding effect yahan se aata hai
    zIndex: 1
  },
  navTabBtn: {
    width: '110px',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 2, // Text indicator ke upar rahega
    color: '#333',
    transition: 'color 0.3s'
  },
  // Inventory Page Styles
  mainContent: { flex: 1, padding: '40px', display: 'flex', justifyContent: 'center' },
  whiteCard: { backgroundColor: 'white', width: '100%', maxWidth: '1100px', borderRadius: '40px', padding: '40px', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', minHeight: '600px' },

  inventoryStats: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
  statHeading: { fontSize: '36px', margin: 0, color: '#333' }, // Number ko dark kiya
  statLabel: { color: '#555', fontWeight: 'bold', fontSize: '14px' },

  formContainer: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '20px', marginBottom: '30px' },
  formRow: { display: 'flex', gap: '10px', marginBottom: '10px' },
  formInput: { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ccc', outline: 'none' },
  addItemBtn: { width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  tr: { borderBottom: '1px solid #eee', textAlign: 'center' },
  editBtn: { padding: '6px 15px', backgroundColor: '#000', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', marginRight: '5px' },
  deleteBtn: { padding: '6px 15px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },

  orderStatBox: {
  backgroundColor: '#fff', 
  border: '1px solid #eee', 
  padding: '15px 30px', 
  borderRadius: '15px', 
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  textAlign: 'center',
  minWidth: '130px',
  borderBottom: '4px solid #8A2BE2' 
},
orderStatLabel: { 
  fontSize: '11px', 
  margin: '5px 0 0 0', 
  color: '#888', 
  fontWeight: 'bold', 
  textTransform: 'uppercase', 
  letterSpacing: '0.5px' 
},

reportCard3D: {
  flex: 1,
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '20px',
  boxShadow: '8px 8px 20px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.8)', // Neumorphic 3D effect
  border: '1px solid #eee',
  transition: 'transform 0.3s'
},
};

export default App;