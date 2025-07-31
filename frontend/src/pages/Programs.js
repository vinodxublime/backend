import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiSearch, FiFilter, FiClock, FiAward, FiUsers, FiX, FiChevronDown } from 'react-icons/fi';
import { usePrograms } from '../context/ProgramContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const PageDescription = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 800px;
`;

const SearchAndFilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#333' : '#f5f5f5'};
  }
`;

const FiltersContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: ${props => props.show ? 'block' : 'none'};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const FilterSelect = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: left;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  display: ${props => props.show ? 'block' : 'none'};
`;

const SelectOption = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  ${props => props.selected && `
    background-color: #f0f0f0;
    font-weight: 500;
  `}
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ApplyButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: #333;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const RemoveFilter = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const ResultsInfo = styled.div`
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const ProgramsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProgramCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProgramImage = styled.div`
  height: 160px;
  background-color: #e9ecef;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ProgramCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProgramContent = styled.div`
  padding: 1.5rem;
`;

const ProgramTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProgramDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProgramMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6c757d;
`;

const ProgramMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProgramFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const ProgramPrice = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
`;

const ViewButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background-color: #333;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? '#000' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#000' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const NoResultsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const NoResultsText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const Programs = () => {
  const { programs, fetchPrograms, loading } = usePrograms();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    price: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Filter options
  const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const durations = ['Less than 5 hours', '5-10 hours', '10-20 hours', 'More than 20 hours'];
  const priceRanges = ['Free', 'Under $50', '$50-$100', 'Over $100'];
  
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        // Convert filters to API query params
        const queryParams = {
          page: currentPage,
          limit: 9,
          search: searchTerm,
          ...Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
          }, {})
        };
        
        await fetchPrograms(queryParams);
        
        // Set total pages based on API response
        // This is a placeholder - actual implementation would use pagination data from API
        setTotalPages(Math.ceil(programs.length / 9) || 1);
      } catch (error) {
        console.error('Error loading programs:', error);
      }
    };
    
    loadPrograms();
  }, [fetchPrograms, currentPage, searchTerm, filters]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setOpenDropdown(null);
  };
  
  const handleApplyFilters = () => {
    // Create active filters array for display
    const newActiveFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => ({ type: key, value }));
    
    setActiveFilters(newActiveFilters);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleClearFilters = () => {
    setFilters({
      category: '',
      level: '',
      duration: '',
      price: ''
    });
    setActiveFilters([]);
  };
  
  const removeFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));
    
    setActiveFilters(prev => prev.filter(filter => filter.type !== filterType));
  };
  
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <PageButton 
        key="prev" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </PageButton>
    );
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PageButton 
          key={i} 
          active={currentPage === i}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </PageButton>
      );
    }
    
    // Next button
    pages.push(
      <PageButton 
        key="next" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        &gt;
      </PageButton>
    );
    
    return pages;
  };
  
  return (
    <Container>
      <Helmet>
        <title>Programs - Learning Platform</title>
        <meta name="description" content="Browse all available learning programs" />
      </Helmet>
      
      <PageHeader>
        <PageTitle>Programs</PageTitle>
        <PageDescription>
          Explore our comprehensive collection of learning programs designed to help you master new skills and advance your career.
        </PageDescription>
      </PageHeader>
      
      <SearchAndFilterBar>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search programs..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <FilterButton 
          active={showFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          Filters
        </FilterButton>
      </SearchAndFilterBar>
      
      <FiltersContainer show={showFilters}>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <FilterSelect>
              <SelectButton onClick={() => toggleDropdown('category')}>
                {filters.category || 'All Categories'}
                <FiChevronDown />
              </SelectButton>
              <SelectDropdown show={openDropdown === 'category'}>
                <SelectOption 
                  selected={filters.category === ''}
                  onClick={() => handleFilterChange('category', '')}
                >
                  All Categories
                </SelectOption>
                {categories.map(category => (
                  <SelectOption 
                    key={category}
                    selected={filters.category === category}
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                  </SelectOption>
                ))}
              </SelectDropdown>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Level</FilterLabel>
            <FilterSelect>
              <SelectButton onClick={() => toggleDropdown('level')}>
                {filters.level || 'All Levels'}
                <FiChevronDown />
              </SelectButton>
              <SelectDropdown show={openDropdown === 'level'}>
                <SelectOption 
                  selected={filters.level === ''}
                  onClick={() => handleFilterChange('level', '')}
                >
                  All Levels
                </SelectOption>
                {levels.map(level => (
                  <SelectOption 
                    key={level}
                    selected={filters.level === level}
                    onClick={() => handleFilterChange('level', level)}
                  >
                    {level}
                  </SelectOption>
                ))}
              </SelectDropdown>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Duration</FilterLabel>
            <FilterSelect>
              <SelectButton onClick={() => toggleDropdown('duration')}>
                {filters.duration || 'Any Duration'}
                <FiChevronDown />
              </SelectButton>
              <SelectDropdown show={openDropdown === 'duration'}>
                <SelectOption 
                  selected={filters.duration === ''}
                  onClick={() => handleFilterChange('duration', '')}
                >
                  Any Duration
                </SelectOption>
                {durations.map(duration => (
                  <SelectOption 
                    key={duration}
                    selected={filters.duration === duration}
                    onClick={() => handleFilterChange('duration', duration)}
                  >
                    {duration}
                  </SelectOption>
                ))}
              </SelectDropdown>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Price</FilterLabel>
            <FilterSelect>
              <SelectButton onClick={() => toggleDropdown('price')}>
                {filters.price || 'Any Price'}
                <FiChevronDown />
              </SelectButton>
              <SelectDropdown show={openDropdown === 'price'}>
                <SelectOption 
                  selected={filters.price === ''}
                  onClick={() => handleFilterChange('price', '')}
                >
                  Any Price
                </SelectOption>
                {priceRanges.map(price => (
                  <SelectOption 
                    key={price}
                    selected={filters.price === price}
                    onClick={() => handleFilterChange('price', price)}
                  >
                    {price}
                  </SelectOption>
                ))}
              </SelectDropdown>
            </FilterSelect>
          </FilterGroup>
        </FiltersGrid>
        
        <FilterActions>
          <ClearButton onClick={handleClearFilters}>
            Clear All
          </ClearButton>
          <ApplyButton onClick={handleApplyFilters}>
            Apply Filters
          </ApplyButton>
        </FilterActions>
      </FiltersContainer>
      
      {activeFilters.length > 0 && (
        <ActiveFilters>
          {activeFilters.map(filter => (
            <FilterTag key={filter.type}>
              <span>{filter.type}: {filter.value}</span>
              <RemoveFilter onClick={() => removeFilter(filter.type)}>
                <FiX />
              </RemoveFilter>
            </FilterTag>
          ))}
        </ActiveFilters>
      )}
      
     <ResultsInfo>
  Showing {Array.isArray(programs) ? programs.length : 0} results
  </ResultsInfo>
      
      {loading ? (
  <LoadingContainer>
    <p>Loading programs...</p>
  </LoadingContainer>
) : Array.isArray(programs) && programs.length > 0 ? (
  <>
    <ProgramsGrid>
      {programs.map(program => (
        <ProgramCard key={program._id}>
          <ProgramImage image={program.thumbnail?.url}>
            <ProgramCategory>{program.category}</ProgramCategory>
          </ProgramImage>
          <ProgramContent>
            <ProgramTitle>{program.title.en}</ProgramTitle>
            <ProgramDescription>{program.description.en}</ProgramDescription>
            <ProgramMeta>
              <ProgramMetaItem>
                <FiClock /> {program.duration}
              </ProgramMetaItem>
              <ProgramMetaItem>
                <FiAward /> {program.level}
              </ProgramMetaItem>
              <ProgramMetaItem>
                <FiUsers /> {program.enrollmentCount || 0} students
              </ProgramMetaItem>
            </ProgramMeta>
            <ProgramFooter>
              <ProgramPrice>
                {program.price === 0 ? 'Free' : `$${program.price}`}
              </ProgramPrice>
              <ViewButton to={`/programs/${program._id}`}>
                View Program
              </ViewButton>
            </ProgramFooter>
          </ProgramContent>
        </ProgramCard>
      ))}
    </ProgramsGrid>

    <Pagination>{renderPagination()}</Pagination>
  </>
) : (
  <NoResults>
    <NoResultsTitle>No programs found</NoResultsTitle>
    <NoResultsText>
      We couldn't find any programs matching your search criteria. Try adjusting your filters or search term.
    </NoResultsText>
    <ClearButton onClick={handleClearFilters}>
      Clear All Filters
    </ClearButton>
  </NoResults>
)}

    </Container>
  );
};

export default Programs;