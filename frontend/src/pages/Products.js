import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FiltersToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #666;
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#000' : '#f8f9fa'};
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
    width: 100%;
    padding: 2rem;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const SidebarHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0;

  input {
    margin: 0;
  }
`;

const PriceRange = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 6px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const ProductsGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: ${props => props.viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr'};
  gap: 2rem;
`;

const ProductsList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#000' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Products = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Available options
  const [brands, setBrands] = useState([]);
  
  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, [category, searchParams, currentPage, selectedBrands, priceRange, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (searchParams.get('search')) params.append('search', searchParams.get('search'));
      if (searchParams.get('featured')) params.append('featured', searchParams.get('featured'));
      
      params.append('page', currentPage);
      params.append('limit', 12);
      params.append('sort', sortBy);
      params.append('order', sortOrder);
      
      selectedBrands.forEach(brand => params.append('brand', brand));
      
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);

      const response = await axios.get(`/api/products?${params.toString()}`);
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/products/meta/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    const [sort, order] = value.split('-');
    setSortBy(sort);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    if (category) return `${category} Collection`;
    if (searchParams.get('search')) return `Search Results for "${searchParams.get('search')}"`;
    if (searchParams.get('featured')) return 'Featured Products';
    return 'All Products';
  };

  return (
    <Container>
      <Helmet>
        <title>{getPageTitle()} - StyleHub</title>
        <meta name="description" content={`Shop ${getPageTitle().toLowerCase()} at StyleHub. Discover the latest fashion trends with fast shipping.`} />
      </Helmet>

      <Header>
        <PageTitle>{getPageTitle()}</PageTitle>
        <PageDescription>
          Discover our curated collection of high-quality fashion items
        </PageDescription>
      </Header>

      <ControlsContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FiltersToggle onClick={() => setFiltersOpen(true)}>
            <FiFilter />
            Filters
          </FiltersToggle>
          
          <ResultsInfo>
            Showing {products.length} of {total} products
          </ResultsInfo>
        </div>

        <SortControls>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </ViewButton>
          </ViewToggle>

          <SortSelect 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </SortSelect>
        </SortControls>
      </ControlsContainer>

      <MainContent>
        <Sidebar isOpen={filtersOpen}>
          <SidebarHeader>
            <h3>Filters</h3>
            <CloseButton onClick={() => setFiltersOpen(false)}>
              <FiX />
            </CloseButton>
          </SidebarHeader>

          <FilterSection>
            <FilterTitle>Brands</FilterTitle>
            <FilterOptions>
              {brands.map(brand => (
                <FilterOption key={brand}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  {brand}
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRange>
              <PriceInput
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              <span>-</span>
              <PriceInput
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </PriceRange>
          </FilterSection>

          <button className="btn btn-outline" onClick={clearFilters}>
            Clear Filters
          </button>
        </Sidebar>

        {loading ? (
          <LoadingContainer>Loading products...</LoadingContainer>
        ) : products.length === 0 ? (
          <NoResults>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </NoResults>
        ) : (
          <ProductsGrid viewMode={viewMode}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductsGrid>
        )}
      </MainContent>

      {totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default Products;