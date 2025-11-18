import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Filter, BookOpen, Users, Clock, Shield, Truck, IndianRupee, Home, Gem, Sparkles, Calendar, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SpiritualStore: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Product categories with Lucide icons
  const categories = [
    { id: 'books', name: 'Sacred Texts', icon: BookOpen, count: 45 },
    { id: 'pooja', name: 'Pooja Services', icon: Sparkles, count: 23 },
    { id: 'murti', name: 'Divine Idols', icon: Home, count: 67 },
    { id: 'yantra', name: 'Sacred Yantras', icon: Gem, count: 34 },
    { id: 'accessories', name: 'Accessories', icon: Star, count: 89 },
    { id: 'courses', name: 'Spiritual Courses', icon: Users, count: 56 }
  ];

  // Featured products for slider
  const featuredProducts = [
    {
      id: 'featured-1',
      name: 'Bhagavad Gita Premium',
      description: 'Gold-embossed leather bound edition with commentary',
      category: 'Sacred Texts',
      price: 2499,
      originalPrice: 3499,
      rating: 4.9,
      sales: '2.5K+',
      discount: 30
    },
    {
      id: 'featured-2',
      name: 'Maha Rudrabhishek',
      description: 'Complete Vedic rituals by certified priests',
      category: 'Pooja Services',
      price: 4999,
      originalPrice: 6999,
      rating: 4.8,
      sales: '1.8K+',
      discount: 25
    },
    {
      id: 'featured-3',
      name: 'Crystal Shiva Lingam',
      description: 'Handcrafted crystal for home temple',
      category: 'Divine Idols',
      price: 12999,
      originalPrice: 15999,
      rating: 4.7,
      sales: '1.2K+',
      discount: 20
    }
  ];

  // Sample products for grid
  const sampleProducts = [
    {
      id: '1',
      name: 'Bhagavad Gita Hard Cover',
      description: 'Authentic Sanskrit text with Hindi translation',
      category: 'Sacred Texts',
      price: 499,
      originalPrice: 699,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Satyanarayan Pooja',
      description: 'Online pooja by certified priests',
      category: 'Pooja Services',
      price: 1999,
      originalPrice: 2499,
      rating: 4.9
    },
    {
      id: '3',
      name: 'Brass Ganesha Idol',
      description: 'Handcrafted brass idol for home temple',
      category: 'Divine Idols',
      price: 2999,
      originalPrice: 3999,
      rating: 4.7
    },
    {
      id: '4',
      name: 'Copper Shri Yantra',
      description: 'Authentic copper for prosperity',
      category: 'Sacred Yantras',
      price: 1599,
      originalPrice: 1999,
      rating: 4.6
    }
  ];

  // Auto-slide functionality
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const addToCart = (product: any) => {
    console.log('Added to cart:', product.name);
  };

  const addToWishlist = (product: any) => {
    console.log('Added to wishlist:', product.name);
  };

  const filteredProducts = searchQuery
    ? sampleProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 lg:relative">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">DivineStore</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-600">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-600">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 text-sm border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3">
            <div className="space-y-4">
              <a href="#" className="block text-sm font-medium text-gray-700 hover:text-amber-600 py-2">Home</a>
              <a href="#" className="block text-sm font-medium text-gray-700 hover:text-amber-600 py-2">Categories</a>
              <a href="#" className="block text-sm font-medium text-gray-700 hover:text-amber-600 py-2">Services</a>
              <a href="#" className="block text-sm font-medium text-gray-700 hover:text-amber-600 py-2">New Arrivals</a>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-8 lg:py-16 border-b border-gray-100">
        <div className="px-4 text-center">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
            Spiritual Essentials
          </h1>
          <p className="text-sm lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto">
            Discover authentic spiritual products and services
          </p>
          
          {/* Desktop Search Bar */}
          <div className="hidden lg:block max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products, services or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base border-gray-300 shadow-sm rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Categories
            </h2>
            <p className="text-xs lg:text-base text-gray-600 max-w-2xl mx-auto">
              Explore our spiritual collection
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:gap-6 lg:grid-cols-6 mb-12 lg:mb-16">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="group text-center cursor-pointer p-3 lg:p-4"
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                    <IconComponent className="h-5 w-5 lg:h-7 lg:w-7 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 leading-tight">{category.name}</h3>
                  <p className="text-gray-500 text-xs">{category.count}</p>
                </div>
              );
            })}
          </div>

          {/* Featured Products Slider */}
          <div className="mb-12 lg:mb-16">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Featured</h2>
                <p className="text-gray-600 text-xs lg:text-base mt-1">Handpicked spiritual essentials</p>
              </div>
              <div className="hidden lg:flex space-x-2">
                <Button variant="outline" size="sm" onClick={prevSlide} className="w-10 h-10 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextSlide} className="w-10 h-10 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {featuredProducts.map((product, index) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div className="p-6 lg:p-12 lg:grid lg:grid-cols-2 lg:gap-12">
                      <div className="space-y-4 lg:space-y-6">
                        <Badge className="bg-red-500 text-white border-0 px-2 py-1 lg:px-3 lg:py-1 text-xs">
                          {product.discount}% OFF
                        </Badge>
                        <h2 className="text-xl lg:text-3xl font-bold text-gray-900 leading-tight">
                          {product.name}
                        </h2>
                        <p className="text-sm lg:text-lg text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 lg:space-x-6">
                          <div className="flex items-center space-x-1 lg:space-x-2">
                            <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current" />
                            <span className="font-semibold text-gray-900 text-sm lg:text-base">{product.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1 lg:space-x-2 text-gray-600 text-sm">
                            <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                            <span>{product.sales}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <span className="text-lg lg:text-2xl font-bold text-gray-900">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-sm lg:text-lg text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-3 lg:space-x-4 pt-2 lg:pt-4">
                          <Button 
                            onClick={() => addToCart(product)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-sm lg:text-base px-4 lg:px-8 py-2 lg:py-3 rounded-lg flex-1 lg:flex-none"
                          >
                            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="px-3 lg:px-8 py-2 lg:py-3 rounded-lg border-gray-300 hidden lg:flex">
                            <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            Wishlist
                          </Button>
                        </div>
                      </div>
                      <div className="hidden lg:flex items-center justify-center">
                        <div className="w-64 h-64 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl flex items-center justify-center">
                          <div className="w-20 h-20 bg-amber-200 rounded-2xl flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-amber-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Slider Controls */}
              <div className="lg:hidden flex justify-center space-x-2 pb-4">
                <Button variant="outline" size="sm" onClick={prevSlide} className="w-8 h-8 p-0">
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextSlide} className="w-8 h-8 p-0">
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Slider Dots */}
              <div className="absolute bottom-3 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1 lg:space-x-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trust Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
            <div className="text-center p-4 lg:p-6">
              <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 bg-green-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Truck className="h-4 w-4 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 lg:mb-2">Free Shipping</h3>
              <p className="text-gray-600 text-xs">Over ₹1000</p>
            </div>
            <div className="text-center p-4 lg:p-6">
              <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 bg-blue-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Shield className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 lg:mb-2">Authentic</h3>
              <p className="text-gray-600 text-xs">Quality</p>
            </div>
            <div className="text-center p-4 lg:p-6">
              <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 bg-purple-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 lg:mb-2">Expert Support</h3>
              <p className="text-gray-600 text-xs">Guidance</p>
            </div>
            <div className="text-center p-4 lg:p-6">
              <div className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 lg:mb-4 bg-amber-50 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Users className="h-4 w-4 lg:h-6 lg:w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 lg:mb-2">50K+ Customers</h3>
              <p className="text-gray-600 text-xs">Trusted</p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900">All Products</h2>
                <p className="text-gray-600 text-xs lg:text-base mt-1">Curated spiritual collection</p>
              </div>
              <div className="hidden lg:flex space-x-3">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                  <option>Most Popular</option>
                  <option>New Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Bar */}
            <div className="lg:hidden flex space-x-3 mb-4 overflow-x-auto pb-2">
              <Button variant="outline" size="sm" className="flex-shrink-0 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white flex-shrink-0">
                <option>Popular</option>
                <option>New</option>
                <option>Price: Low</option>
                <option>Price: High</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-8 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg lg:rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-3 lg:p-5">
                    {/* Product Image Placeholder */}
                    <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 lg:mb-4 flex items-center justify-center group-hover:from-amber-50 group-hover:to-orange-50 transition-all duration-300">
                      <div className="w-10 h-10 lg:w-16 lg:h-16 bg-amber-100 rounded-lg lg:rounded-2xl flex items-center justify-center">
                        <Sparkles className="h-5 w-5 lg:h-8 lg:w-8 text-amber-600" />
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-2 lg:space-y-3">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0 text-xs">
                        {product.category}
                      </Badge>
                      
                      <h3 className="font-semibold text-gray-900 text-xs lg:text-sm leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 hidden lg:block">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-900">{product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <span className="text-sm lg:text-lg font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs lg:text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2 lg:pt-4">
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs lg:text-sm py-1 lg:py-2"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Cart
                        </Button>
                        <Button
                          onClick={() => addToWishlist(product)}
                          size="sm"
                          variant="outline"
                          className="px-2 lg:px-3 border-gray-300"
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 lg:py-16">
                <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-gray-100 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Search className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base lg:text-lg mb-4">
                  No products found
                </p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline" 
                  className="px-6 text-sm lg:text-base"
                >
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualStore;