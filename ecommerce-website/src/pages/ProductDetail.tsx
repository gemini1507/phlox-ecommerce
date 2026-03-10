import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Check, Truck, Shield, RotateCcw, Package } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

type Product = {
  id: number;
  name: string;
  description: string | null;
  specs: string | null;
  reviews: string | null;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const { addItem } = useCart();
  const { isLoggedIn, token } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark mb-2">Product Not Found</h2>
        <Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/shop" className="hover:text-primary flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Shop</Link>
        <span>/</span>
        <span className="text-gray-400">{product.category}</span>
        <span>/</span>
        <span className="text-dark font-medium">{product.name}</span>
      </div>

      {/* Main */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center relative min-h-[400px]">
          <button onClick={() => setLiked(!liked)} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <Heart className={`w-5 h-5 ${liked ? 'fill-primary text-primary' : 'text-gray-400'}`} />
          </button>
          {product.stock === 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Sold Out</span>
          )}
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="max-h-80 object-contain drop-shadow-xl" />
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs text-primary font-semibold uppercase tracking-widest">{product.category}</span>
          <h1 className="text-3xl font-bold text-dark mt-2 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.0) · 128 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black text-primary">${product.price}</span>
            <span className="text-gray-400 line-through text-lg">${(product.price * 1.2).toFixed(2)}</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">-20%</span>
          </div>

          {/* Description preview */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description || 'Premium quality product from PHLOX. Authentic and guaranteed original.'}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors text-lg font-medium">−</button>
              <span className="px-5 py-3 font-semibold text-dark min-w-[50px] text-center bg-white">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors text-lg font-medium">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all text-sm ${
                added ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {added ? <><Check className="w-4 h-4" /> Added to Cart!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Shipping', desc: 'Orders over $50' },
              { icon: Shield, label: '2 Year Warranty', desc: 'Official guarantee' },
              { icon: RotateCcw, label: '30 Day Returns', desc: 'Easy returns' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                <badge.icon className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs font-semibold text-dark">{badge.label}</p>
                <p className="text-[10px] text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200 gap-6">
          {(['description', 'specs', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="leading-relaxed whitespace-pre-wrap">{product.description || 'Premium quality product from PHLOX with authentic guarantee. Built with the finest materials and cutting-edge technology to deliver an exceptional experience.'}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {(() => {
                let parsedSpecs = [];
                try {
                  if (product.specs) parsedSpecs = JSON.parse(product.specs);
                } catch (e) {
                  // Fallback if not valid JSON
                  parsedSpecs = [{ label: 'Details', value: product.specs }];
                }

                if (!parsedSpecs || parsedSpecs.length === 0) {
                  return <p className="text-gray-500 text-sm">No specifications available for this product.</p>;
                }

                return parsedSpecs.map((spec: any, i: number) => (
                  <div key={i} className={`flex justify-between py-3 px-4 rounded-lg text-sm ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <span className="text-gray-500">{spec.label || spec.name || 'Specification'}</span>
                    <span className="text-dark font-medium">{spec.value || spec.detail || '-'}</span>
                  </div>
                ));
              })()}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {(() => {
                  let parsedReviews = [];
                  try {
                    if (product.reviews) parsedReviews = JSON.parse(product.reviews);
                  } catch (e) {
                    parsedReviews = [{ name: 'User', rating: 5, date: 'Recent', text: product.reviews }];
                  }

                  if (!parsedReviews || parsedReviews.length === 0) {
                    return <p className="text-gray-500 text-sm">No reviews yet for this product. Be the first to review!</p>;
                  }

                  return parsedReviews.map((review: any, i: number) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                            {(review.name || 'U')[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-dark text-sm">{review.name || 'Anonymous User'}</span>
                        </div>
                        <span className="text-xs text-gray-500">{review.date || 'Recently'}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                      </div>
                      <p className="text-sm text-gray-600">{review.text || 'Good product.'}</p>
                    </div>
                  ));
                })()}
              </div>

              {/* Review Form */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-semibold text-dark mb-4">Write a Review</h4>
                {!isLoggedIn ? (
                  <p className="text-sm text-gray-500">Please <Link to="/login" className="text-primary font-medium hover:underline">login</Link> to leave a review.</p>
                ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!token) return;
                    const form = e.target as HTMLFormElement;
                    const text = (form.elements.namedItem('text') as HTMLTextAreaElement).value;
                    const rating = (form.elements.namedItem('rating') as HTMLSelectElement).value;
                    setReviewSubmitting(true);
                    try {
                      await apiFetch(`/products/${product!.id}/reviews`, {
                        method: 'POST',
                        body: JSON.stringify({ rating: Number(rating), text })
                      });
                      form.reset();
                      window.location.reload();
                    } catch (err) {
                      alert('Failed to submit review: ' + (err as Error).message);
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }} 
                  className="space-y-4 max-w-lg"
                >
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Rating</label>
                    <select name="rating" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" required>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Your Review</label>
                    <textarea name="text" rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary resize-none" placeholder="What do you think about this product?" required></textarea>
                  </div>
                  <button type="submit" disabled={reviewSubmitting} className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors text-sm disabled:opacity-50">
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
