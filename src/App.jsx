
import { useState } from "react";
import {
  ShoppingCart, Search, Store, Trash2,
  Plus, Minus, X, Package, LayoutDashboard
} from "lucide-react";
import "./App.css";

const initialProducts = [
  {id:1,name:"Wireless Headphones",category:"Electronics",price:1999,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",description:"Premium sound and comfortable design."},
  {id:2,name:"Smart Watch",category:"Electronics",price:2499,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",description:"Track your fitness and daily activities."},
  {id:3,name:"Running Shoes",category:"Fashion",price:1599,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",description:"Comfortable shoes for everyday use."},
  {id:4,name:"Travel Backpack",category:"Accessories",price:999,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",description:"Spacious backpack for daily travel."},
  {id:5,name:"Digital Camera",category:"Electronics",price:12999,image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",description:"Capture your favourite memories."},
  {id:6,name:"Sunglasses",category:"Fashion",price:799,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",description:"Stylish sunglasses for every occasion."},
  {id:7,name:"Laptop",category:"Electronics",price:45999,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",description:"Powerful laptop for work and study."},
  {id:8,name:"Sports Shoes",category:"Fashion",price:1899,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",description:"Lightweight shoes for active lifestyles."}
];

function App() {
  const [products,setProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("products")) || initialProducts;
    } catch { return initialProducts; }
  });

  const [cart,setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart")) || []; }
    catch { return []; }
  });

  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("All");
  const [sort,setSort] = useState("default");
  const [page,setPage] = useState("shop");
  const [showCart,setShowCart] = useState(false);
  const [form,setForm] = useState({name:"",category:"Electronics",price:"",image:"",description:""});

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem("products",JSON.stringify(data));
  };

  const saveCart = (data) => {
    setCart(data);
    localStorage.setItem("cart",JSON.stringify(data));
  };

  const addToCart = (product) => {
    const existing = cart.find(p=>p.id===product.id);
    saveCart(existing
      ? cart.map(p=>p.id===product.id?{...p,qty:p.qty+1}:p)
      : [...cart,{...product,qty:1}]);
  };

  const updateQty = (id,amount) => {
    saveCart(cart.map(p=>p.id===id?{...p,qty:p.qty+amount}:p).filter(p=>p.qty>0));
  };

  const removeCart = (id) => saveCart(cart.filter(p=>p.id!==id));

  const addProduct = (e) => {
    e.preventDefault();
    saveProducts([...products,{...form,id:Date.now(),price:Number(form.price)}]);
    setForm({name:"",category:"Electronics",price:"",image:"",description:""});
    alert("Product added successfully!");
  };

  const deleteProduct = (id) => {
    saveProducts(products.filter(p=>p.id!==id));
  };

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category==="All" || p.category===category)
  );

  if(sort==="low") filtered=[...filtered].sort((a,b)=>a.price-b.price);
  if(sort==="high") filtered=[...filtered].sort((a,b)=>b.price-a.price);

  const total = cart.reduce((sum,p)=>sum+p.price*p.qty,0);
  const count = cart.reduce((sum,p)=>sum+p.qty,0);

  const checkout = () => {
    if(!cart.length) return alert("Your cart is empty!");
    const order = {
      id:"ORD"+Date.now(),
      items:cart,
      total,
      date:new Date().toLocaleString(),
      status:"Demo Order"
    };
    const orders=JSON.parse(localStorage.getItem("orders")||"[]");
    localStorage.setItem("orders",JSON.stringify([order,...orders]));
    saveCart([]);
    setShowCart(false);
    alert("Demo order placed successfully! Order ID: "+order.id);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand" onClick={()=>setPage("shop")}>
          <Store size={28}/><span>ShopEase</span>
        </div>

        <div className="navlinks">
          <button className={page==="shop"?"selected":""} onClick={()=>setPage("shop")}>Home</button>
          <button className={page==="admin"?"selected":""} onClick={()=>setPage("admin")}>Admin</button>
        </div>

        <button className="cart-button" onClick={()=>setShowCart(true)}>
          <ShoppingCart size={19}/> Cart <span>{count}</span>
        </button>
      </nav>

      {page==="shop" ? (
        <>
          <section className="hero">
            <span className="eyebrow">WELCOME TO SHOPEASE</span>
            <h1>Discover Products<br/><span>You'll Love.</span></h1>
            <p>Find amazing products at prices you'll love. Your shopping journey starts here.</p>
            <button onClick={()=>document.getElementById("products").scrollIntoView({behavior:"smooth"})}>Explore Products →</button>
          </section>

          <main className="container" id="products">
            <div className="section-heading">
              <div>
                <span className="eyebrow">OUR COLLECTION</span>
                <h2>Explore Products</h2>
              </div>
              <span className="result-count">{filtered.length} products found</span>
            </div>

            <div className="toolbar">
              <div className="search-box">
                <Search size={19}/>
                <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                <option>All</option><option>Electronics</option><option>Fashion</option><option>Accessories</option>
              </select>
              <select value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="default">Sort by: Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            <div className="product-grid">
              {filtered.map(p=>(
                <article className="product-card" key={p.id}>
                  <div className="product-image">
                    <img src={p.image} alt={p.name}/>
                    <span>{p.category}</span>
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="product-bottom">
                      <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                      <button onClick={()=>addToCart(p)}>+ Add to Cart</button>
                    </div>
                  </div>
                </article>
              ))}
              {!filtered.length && <p>No products found.</p>}
            </div>
          </main>
        </>
      ) : (
        <main className="container admin-page">
          <span className="eyebrow">MANAGEMENT PANEL</span>
          <h1><LayoutDashboard/> Admin Dashboard</h1>
          <div className="stats">
            <div><Package/><span>Total Products</span><strong>{products.length}</strong></div>
            <div><ShoppingCart/><span>Cart Items</span><strong>{count}</strong></div>
            <div><Store/><span>Categories</span><strong>{new Set(products.map(p=>p.category)).size}</strong></div>
          </div>

          <h2>Add New Product</h2>
          <form className="admin-form" onSubmit={addProduct}>
            <input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              <option>Electronics</option><option>Fashion</option><option>Accessories</option>
            </select>
            <input required type="number" min="1" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
            <input required type="url" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/>
            <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <button type="submit"><Plus size={18}/> Add Product</button>
          </form>

          <h2>Manage Products</h2>
          {products.map(p=>(
            <div className="manage-item" key={p.id}>
              <img src={p.image} alt=""/>
              <span>{p.name}</span>
              <strong>₹{p.price.toLocaleString("en-IN")}</strong>
              <button onClick={()=>deleteProduct(p.id)}><Trash2 size={17}/></button>
            </div>
          ))}
        </main>
      )}

      <footer>
        <h2>ShopEase.</h2>
        <p>Your one-stop destination for online shopping.</p>
        <small>© 2026 ShopEase. All rights reserved.</small>
      </footer>

      {showCart && (
        <div className="overlay" onClick={()=>setShowCart(false)}>
          <aside className="cart-panel" onClick={e=>e.stopPropagation()}>
            <div className="cart-title">
              <h2>Your Shopping Cart</h2>
              <button onClick={()=>setShowCart(false)}><X/></button>
            </div>
            {!cart.length && <p>Your cart is empty. Start shopping!</p>}
            {cart.map(p=>(
              <div className="cart-item" key={p.id}>
                <img src={p.image} alt=""/>
                <div className="cart-details">
                  <strong>{p.name}</strong>
                  <span>₹{p.price.toLocaleString("en-IN")}</span>
                  <div className="quantity">
                    <button onClick={()=>updateQty(p.id,-1)}><Minus size={14}/></button>
                    {p.qty}
                    <button onClick={()=>updateQty(p.id,1)}><Plus size={14}/></button>
                    <button className="remove" onClick={()=>removeCart(p.id)}><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <h3>Total</h3><h3>₹{total.toLocaleString("en-IN")}</h3>
            </div>
            <button className="checkout" disabled={!cart.length} onClick={checkout}>Place Demo Order</button>
            <small className="demo-note">Demo checkout only. No real payment is processed.</small>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
