import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { 
  FiClock, 
  FiAward, 
  FiUsers, 
  FiCalendar, 
  FiBook, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiPlay,
  FiFileText,
  FiLock,
  FiStar
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePrograms } from '../context/ProgramContext';
import { useNotifications } from '../context/NotificationContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const BreadcrumbNav = styled.div`
  margin: 1rem 0 2rem;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
  }
`;

const ProgramHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProgramInfo = styled.div``;

const ProgramTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const ProgramDescription = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ProgramMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const ProgramTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background-color: #f5f5f5;
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const ProgramEnrollment = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 2rem;
`;

const ProgramPrice = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PriceDescription = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const EnrollButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EnrollmentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ProgramIncludes = styled.div`
  margin-bottom: 1.5rem;
`;

const IncludesTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const IncludesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const IncludesItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  
  svg {
    color: #28a745;
  }
`;

const ContentTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#000' : 'transparent'};
  color: ${props => props.active ? '#000' : '#666'};
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #000;
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const ModulesSection = styled.div`
  margin-bottom: 3rem;
`;

const ModuleAccordion = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const ModuleHeader = styled.div`
  padding: 1.25rem;
  background-color: ${props => props.isOpen ? '#f8f9fa' : '#fff'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ModuleTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModuleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
`;

const ModuleContent = styled.div`
  padding: ${props => props.isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem'};
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const ModuleDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const LessonList = styled.div``;

const Lesson = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  
  &:first-child {
    border-top: none;
  }
`;

const LessonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LessonIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.locked ? '#f8f9fa' : '#e8f5e9'};
  color: ${props => props.locked ? '#adb5bd' : '#28a745'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LessonDetails = styled.div``;

const LessonTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.25rem;
  color: ${props => props.locked ? '#adb5bd' : '#333'};
`;

const LessonMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LessonAction = styled.div``;

const PreviewButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const InstructorSection = styled.div`
  margin-bottom: 3rem;
`;

const InstructorCard = styled.div`
  display: flex;
  gap: 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InstructorAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e9ecef;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const InstructorInfo = styled.div`
  flex: 1;
`;

const InstructorName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const InstructorTitle = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const InstructorBio = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const ReviewsSection = styled.div`
  margin-bottom: 3rem;
`;

const ReviewStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const RatingSummary = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AverageRating = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const TotalReviews = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const RatingBreakdown = styled.div`
  flex: 2;
`;

const RatingBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const RatingLabel = styled.div`
  min-width: 30px;
  font-size: 0.9rem;
  color: #666;
`;

const RatingProgress = styled.div`
  flex: 1;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
`;

const RatingFill = styled.div`
  height: 100%;
  background-color: #ffc107;
  width: ${props => props.percentage}%;
`;

const RatingCount = styled.div`
  min-width: 40px;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
`;

const ReviewsList = styled.div``;

const ReviewCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReviewerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e9ecef;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ReviewerName = styled.div`
  font-weight: 500;
  color: #333;
`;

const ReviewDate = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ReviewRating = styled.div`
  color: #ffc107;
  font-size: 1.2rem;
  display: flex;
  gap: 0.25rem;
`;

const ReviewContent = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const FAQSection = styled.div`
  margin-bottom: 3rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const FAQQuestion = styled.div`
  padding: 1.25rem;
  background-color: ${props => props.isOpen ? '#f8f9fa' : '#fff'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const QuestionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #333;
`;

const FAQAnswer = styled.div`
  padding: ${props => props.isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem'};
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AnswerText = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const ErrorTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const ErrorText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    fetchProgramById, 
    enrollInProgram, 
    isEnrolled, 
    loading, 
    error 
  } = usePrograms();
  const { showNotification } = useNotifications();
  
  const [program, setProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [openModules, setOpenModules] = useState([]);
  const [openFAQs, setOpenFAQs] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  
  useEffect(() => {
    const loadProgram = async () => {
      try {
        const data = await fetchProgramById(id);
        setProgram(data);
        // Open the first module by default
        if (data.modules && data.modules.length > 0) {
          setOpenModules([data.modules[0]._id]);
        }
      } catch (error) {
        console.error('Error loading program details:', error);
      }
    };
    
    loadProgram();
  }, [fetchProgramById, id]);
  
  const toggleModule = (moduleId) => {
    setOpenModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  const toggleFAQ = (faqId) => {
    setOpenFAQs(prev => 
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };
  
  const handleEnroll = async () => {
    if (!user) {
      showNotification('Please log in to enroll in this program', 'warning');
      navigate('/login', { state: { from: `/programs/${id}` } });
      return;
    }
    
    setEnrolling(true);
    try {
      await enrollInProgram(id);
      showNotification('Successfully enrolled in program!', 'success');
    } catch (error) {
      showNotification('Failed to enroll in program. Please try again.', 'error');
      console.error('Error enrolling in program:', error);
    } finally {
      setEnrolling(false);
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <p>Loading program details...</p>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorTitle>Error loading program</ErrorTitle>
        <ErrorText>
          We encountered an error while loading the program details. Please try again later.
        </ErrorText>
        <PreviewButton onClick={() => navigate('/programs')}>
          Back to Programs
        </PreviewButton>
      </ErrorContainer>
    );
  }
  
  if (!program) {
    return null;
  }
  
  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: null
      },
      rating: 5,
      date: '2023-06-15',
      content: 'This program exceeded my expectations. The content is well-structured and the instructor explains complex concepts in a simple way.'
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        avatar: null
      },
      rating: 4,
      date: '2023-05-22',
      content: 'Great program with practical examples. I would have liked more exercises, but overall it was very informative and useful.'
    }
  ];
  
  // Mock data for FAQs
  const faqs = [
    {
      id: 1,
      question: 'How long do I have access to the program?',
      answer: 'Once enrolled, you have lifetime access to the program content. You can revisit the materials at any time.'
    },
    {
      id: 2,
      question: 'Is there a certificate upon completion?',
      answer: 'Yes, you will receive a certificate of completion after finishing all the modules and passing the final assessment.'
    },
    {
      id: 3,
      question: 'Can I download the course materials for offline viewing?',
      answer: 'Yes, most of the course materials are available for download. Videos can be viewed offline through our mobile app.'
    }
  ];
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Calculate rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    ratingCounts[review.rating - 1]++;
  });
  
  const alreadyEnrolled = isEnrolled(id);
  
  return (
    <Container>
      <Helmet>
        <title>{program.title.en} - Learning Platform</title>
        <meta name="description" content={program.description.en} />
      </Helmet>
      
      <BreadcrumbNav>
        <a href="/">Home</a>
        <span>/</span>
        <a href="/programs">Programs</a>
        <span>/</span>
        {program.title.en}
      </BreadcrumbNav>
      
      <ProgramHeader>
        <ProgramInfo>
          <ProgramTitle>{program.title.en}</ProgramTitle>
          <ProgramDescription>{program.description.en}</ProgramDescription>
          
          <ProgramMeta>
            <MetaItem>
              <FiClock />
              {program.duration}
            </MetaItem>
            <MetaItem>
              <FiAward />
              {program.level}
            </MetaItem>
            <MetaItem>
              <FiUsers />
              {program.enrollmentCount || 0} students enrolled
            </MetaItem>
            <MetaItem>
              <FiCalendar />
              Last updated {new Date(program.updatedAt).toLocaleDateString()}
            </MetaItem>
          </ProgramMeta>
          
          <ProgramTags>
            {program.tags && program.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ProgramTags>
        </ProgramInfo>
        
        <ProgramEnrollment>
          <ProgramPrice>
            <Price>{program.price === 0 ? 'Free' : `$${program.price}`}</Price>
            <PriceDescription>
              {program.price === 0 
                ? 'Enroll now for free access to all content' 
                : 'One-time payment for lifetime access'}
            </PriceDescription>
          </ProgramPrice>
          
          <EnrollButton 
            onClick={handleEnroll}
            disabled={alreadyEnrolled || enrolling}
          >
            {alreadyEnrolled 
              ? 'Already Enrolled - Continue Learning' 
              : enrolling 
                ? 'Enrolling...' 
                : 'Enroll Now'}
          </EnrollButton>
          
          <EnrollmentStats>
            <StatItem>
              <StatValue>{program.modules?.length || 0}</StatValue>
              <StatLabel>Modules</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {program.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0}
              </StatValue>
              <StatLabel>Lessons</StatLabel>
            </StatItem>
          </EnrollmentStats>
          
          <ProgramIncludes>
            <IncludesTitle>This program includes:</IncludesTitle>
            <IncludesList>
              <IncludesItem>
                <FiCheckCircle />
                {program.duration} of content
              </IncludesItem>
              <IncludesItem>
                <FiCheckCircle />
                Access on mobile and desktop
              </IncludesItem>
              <IncludesItem>
                <FiCheckCircle />
                Certificate of completion
              </IncludesItem>
              <IncludesItem>
                <FiCheckCircle />
                Downloadable resources
              </IncludesItem>
            </IncludesList>
          </ProgramIncludes>
        </ProgramEnrollment>
      </ProgramHeader>
      
      <ContentTabs>
        <Tab 
          active={activeTab === 'curriculum'} 
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </Tab>
        <Tab 
          active={activeTab === 'instructor'} 
          onClick={() => setActiveTab('instructor')}
        >
          Instructor
        </Tab>
        <Tab 
          active={activeTab === 'reviews'} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </Tab>
        <Tab 
          active={activeTab === 'faq'} 
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </Tab>
      </ContentTabs>
      
      <TabContent active={activeTab === 'curriculum'}>
        <ModulesSection>
          {program.modules && program.modules.map((module, index) => (
            <ModuleAccordion key={module._id}>
              <ModuleHeader 
                isOpen={openModules.includes(module._id)}
                onClick={() => toggleModule(module._id)}
              >
                <ModuleTitle>
                  <FiBook />
                  Module {index + 1}: {module.title.en}
                </ModuleTitle>
                <ModuleInfo>
                  <span>{module.lessons?.length || 0} lessons</span>
                  <span>{module.duration}</span>
                  {openModules.includes(module._id) ? <FiChevronUp /> : <FiChevronDown />}
                </ModuleInfo>
              </ModuleHeader>
              
              <ModuleContent isOpen={openModules.includes(module._id)}>
                <ModuleDescription>{module.description.en}</ModuleDescription>
                
                <LessonList>
                  {module.lessons && module.lessons.map((lesson, lessonIndex) => {
                    const isLocked = !alreadyEnrolled && lessonIndex > 0;
                    
                    return (
                      <Lesson key={lesson._id}>
                        <LessonInfo>
                          <LessonIcon locked={isLocked}>
                            {isLocked ? <FiLock /> : lesson.type === 'video' ? <FiPlay /> : <FiFileText />}
                          </LessonIcon>
                          <LessonDetails>
                            <LessonTitle locked={isLocked}>
                              {lessonIndex + 1}. {lesson.title.en}
                            </LessonTitle>
                            <LessonMeta>
                              <span>{lesson.type === 'video' ? 'Video' : 'Reading'}</span>
                              <span>{lesson.duration}</span>
                            </LessonMeta>
                          </LessonDetails>
                        </LessonInfo>
                        
                        <LessonAction>
                          {!isLocked && (
                            <PreviewButton>
                              {alreadyEnrolled ? 'Start' : 'Preview'}
                            </PreviewButton>
                          )}
                        </LessonAction>
                      </Lesson>
                    );
                  })}
                </LessonList>
              </ModuleContent>
            </ModuleAccordion>
          ))}
        </ModulesSection>
      </TabContent>
      
      <TabContent active={activeTab === 'instructor'}>
        <InstructorSection>
          <InstructorCard>
            <InstructorAvatar image={program.instructor?.avatar?.url} />
            <InstructorInfo>
              <InstructorName>{program.instructor?.name || 'Instructor Name'}</InstructorName>
              <InstructorTitle>{program.instructor?.title || 'Instructor Title'}</InstructorTitle>
              <InstructorBio>
                {program.instructor?.bio || 
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
              </InstructorBio>
            </InstructorInfo>
          </InstructorCard>
        </InstructorSection>
      </TabContent>
      
      <TabContent active={activeTab === 'reviews'}>
        <ReviewsSection>
          <ReviewStats>
            <RatingSummary>
              <AverageRating>{averageRating.toFixed(1)}</AverageRating>
              <TotalReviews>{reviews.length} reviews</TotalReviews>
            </RatingSummary>
            
            <RatingBreakdown>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingCounts[rating - 1];
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <RatingBar key={rating}>
                    <RatingLabel>{rating}</RatingLabel>
                    <RatingProgress>
                      <RatingFill percentage={percentage} />
                    </RatingProgress>
                    <RatingCount>{count}</RatingCount>
                  </RatingBar>
                );
              })}
            </RatingBreakdown>
          </ReviewStats>
          
          <ReviewsList>
            {reviews.map(review => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <ReviewerInfo>
                    <ReviewerAvatar image={review.user.avatar} />
                    <div>
                      <ReviewerName>{review.user.name}</ReviewerName>
                      <ReviewDate>{new Date(review.date).toLocaleDateString()}</ReviewDate>
                    </div>
                  </ReviewerInfo>
                  <ReviewRating>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </ReviewRating>
                </ReviewHeader>
                <ReviewContent>{review.content}</ReviewContent>
              </ReviewCard>
            ))}
          </ReviewsList>
        </ReviewsSection>
      </TabContent>
      
      <TabContent active={activeTab === 'faq'}>
        <FAQSection>
          {faqs.map(faq => (
            <FAQItem key={faq.id}>
              <FAQQuestion
                isOpen={openFAQs.includes(faq.id)}
                onClick={() => toggleFAQ(faq.id)}
              >
                <QuestionText>{faq.question}</QuestionText>
                {openFAQs.includes(faq.id) ? <FiChevronUp /> : <FiChevronDown />}
              </FAQQuestion>
              <FAQAnswer isOpen={openFAQs.includes(faq.id)}>
                <AnswerText>{faq.answer}</AnswerText>
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQSection>
      </TabContent>
    </Container>
  );
};

export default ProgramDetails;