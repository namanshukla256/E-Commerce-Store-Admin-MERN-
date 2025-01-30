import React, { useState, useEffect } from 'react';

function FeaturedProducts({ featuredProducts }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  if (!Array.isArray(featuredProducts)) {
    return <div>No featured products available</div>;
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2>
        <div className='relative'>
          <div className='overflow-hidden'>
            <div
              className='flex transition-transform duration-300 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
                  <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
                    <div className='overflow-hidden'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='text-lg font-semibold mb-2 text-white'>{product.name}</h3>
                      <p className='text-emerald-300 font-medium mb-4'>
                        ${product.price.toFixed(2)}
                      </p>
                      <button className='bg-emerald-500 text-white px-4 py-2 rounded'>Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;