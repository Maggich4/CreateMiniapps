import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (
      import.meta.env.VITE_API_BASE_URL ??
      "https://createminiapps.onrender.com"
    ).replace(/\/$/, "");

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  old_price: number | null;
  emoji: string;
  accent_color: string;
  is_new: boolean;
};

type Cart = Record<number, number>;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [category, setCategory] = useState("Все товары");
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError("Не удалось загрузить товары. Попробуйте обновить страницу.");
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => ["Все товары", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");
    return products.filter((product) => {
      const matchesCategory =
        category === "Все товары" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.description}`
          .toLocaleLowerCase("ru")
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = cartItems.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  );

  function addToCart(productId: number) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  }

  function changeQuantity(productId: number, change: number) {
    setCart((current) => {
      const quantity = (current[productId] ?? 0) + change;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: quantity };
    });
  }

  return (
    <div className="store">
      <div className="announcement">Бесплатная доставка от 5 000 ₽ · Собираем заказы с заботой</div>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Тихо — на главную">тихо<span>.</span></a>
        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#catalog">Каталог</a>
          <a href="#about">О нас</a>
          <a href="#footer">Контакты</a>
        </nav>
        <button className="cart-trigger" onClick={() => setIsCartOpen(true)} aria-label={`Открыть корзину, товаров: ${cartCount}`}>
          <span>Корзина</span><span className="cart-count">{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="about">
          <div className="hero-copy">
            <span className="eyebrow">МАЛЕНЬКИЕ РАДОСТИ КАЖДЫЙ ДЕНЬ</span>
            <h1>Дом — это<br />чувство <em>тихо.</em></h1>
            <p>Вещи, которые делают обычные моменты особенными. Выбираем с любовью, создаём надолго.</p>
            <a className="hero-link" href="#catalog">Открыть каталог <span aria-hidden="true">↘</span></a>
            <span className="hero-note">Новая коллекция · Весна 2026</span>
          </div>
          <div className="hero-art" aria-label="Керамическая ваза с ветками">
            <div className="sun-disc" />
            <span className="hero-stem stem-one">⌁</span>
            <span className="hero-stem stem-two">⌁</span>
            <span className="hero-leaf leaf-one">❧</span>
            <span className="hero-leaf leaf-two">❧</span>
            <span className="hero-vase">◒</span>
            <span className="art-caption">медленные утра, тёплый дом</span>
          </div>
        </section>

        <section className="catalog-section" id="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ВЫБРАННОЕ ДЛЯ ВАС</span>
              <h2>Вещи со смыслом</h2>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Найти что-то особенное"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Поиск товаров"
              />
            </label>
          </div>
          <div className="catalog-toolbar">
            <div className="category-list" aria-label="Категории товаров">
              {categories.map((item) => (
                <button
                  className={`category-chip${category === item ? " active" : ""}`}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <span className="product-count">{visibleProducts.length} предметов</span>
          </div>

          {isLoading ? (
            <div className="catalog-message">Подбираем красивые вещи…</div>
          ) : error ? (
            <div className="catalog-message error-message">{error}</div>
          ) : visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id}>
                  <div className={`product-visual product-visual-${index % 4}`} style={{ backgroundColor: product.accent_color }}>
                    {product.is_new && <span className="product-badge">НОВИНКА</span>}
                    {product.old_price && <span className="sale-badge">−{Math.round((1 - product.price / product.old_price) * 100)}%</span>}
                    <span className="product-emoji" role="img" aria-label={product.name}>{product.emoji}</span>
                    <button className="quick-add" onClick={() => addToCart(product.id)} aria-label={`Добавить ${product.name} в корзину`}>+</button>
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <div className="product-prices">
                        <span>{formatPrice(product.price)}</span>
                        {product.old_price && <del>{formatPrice(product.old_price)}</del>}
                      </div>
                    </div>
                    <p>{product.description}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="catalog-message">Ничего не нашлось. Попробуйте изменить запрос.</div>
          )}
        </section>
        <section className="manifesto">
          <span>МЕНЬШЕ, НО ЛУЧШЕ</span>
          <p>Не просто вещи для дома.<br />Маленькие поводы <em>остаться.</em></p>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <a className="wordmark" href="#">тихо<span>.</span></a>
        <span>Тёплые вещи для тёплого дома.</span>
        <span>© 2026 · Сделано с вниманием</span>
      </footer>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-panel" onClick={(event) => event.stopPropagation()} aria-label="Корзина" aria-modal="true" role="dialog">
            <div className="cart-heading">
              <div><span className="eyebrow">ВАШ ВЫБОР</span><h2>Корзина <span>({cartCount})</span></h2></div>
              <button className="close-cart" onClick={() => setIsCartOpen(false)} aria-label="Закрыть корзину">×</button>
            </div>
            {cartItems.length ? (
              <>
                <div className="cart-items">
                  {cartItems.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <div className="cart-item-visual" style={{ backgroundColor: product.accent_color }} aria-hidden="true">{product.emoji}</div>
                      <div className="cart-item-details">
                        <span className="product-category">{product.category}</span>
                        <strong>{product.name}</strong>
                        <span>{formatPrice(product.price)}</span>
                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(product.id, -1)} aria-label={`Уменьшить количество: ${product.name}`}>−</button>
                          <span>{cart[product.id]}</span>
                          <button onClick={() => changeQuantity(product.id, 1)} aria-label={`Увеличить количество: ${product.name}`}>+</button>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => changeQuantity(product.id, -cart[product.id])} aria-label={`Удалить ${product.name}`}>×</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Итого</span><strong>{formatPrice(cartTotal)}</strong></div>
                  <p>Доставка рассчитывается при оформлении</p>
                  <button className="checkout-button" onClick={() => window.alert("Спасибо за интерес! Оформление заказа скоро появится.")}>Перейти к оформлению <span>→</span></button>
                  <span className="demo-note">Демо-магазин · оплата пока не подключена</span>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span>◌</span>
                <h3>Пока здесь тихо</h3>
                <p>Добавьте что-нибудь, чтобы наполнить корзину.</p>
                <button onClick={() => setIsCartOpen(false)}>Вернуться к покупкам</button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;