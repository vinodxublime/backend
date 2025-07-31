import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiBook, FiAward, FiBarChart2, FiClock, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePrograms } from '../context/ProgramContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.bgColor || '#f1f3f5'};
  color: ${props => props.color || '#495057'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  color: ${props => props.positive ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ViewAllLink = styled(Link)`
  color: #495057;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    color: #000;
    text-decoration: underline;
  }
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

const ProgramProgress = styled.div`
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #28a745;
  width: ${props => props.progress || 0}%;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
`;

const UpcomingSection = styled.div`
  margin-bottom: 2.5rem;
`;

const UpcomingEvent = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const EventDate = styled.div`
  min-width: 80px;
  height: 80px;
  background-color: #f8f9fa;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EventDay = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
`;

const EventMonth = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EventDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const EventTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6c757d;
`;

const EventAction = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EventButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #333;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Home = () => {
  const { user } = useAuth();
  const { 
    enrolledPrograms, 
    featuredPrograms, 
    fetchEnrolledPrograms, 
    fetchPrograms,
    getProgramCompletion
  } = usePrograms();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchEnrolledPrograms(),
          fetchPrograms({ featured: true, limit: 3 })
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchEnrolledPrograms, fetchPrograms]);
  
  // Format date for upcoming events
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      time: date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      description: 'Learn the basics of machine learning algorithms and applications.',
      date: '2023-08-15T14:00:00',
      duration: '1 hour'
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      description: 'Hands-on workshop on modern web development techniques.',
      date: '2023-08-18T10:00:00',
      duration: '2 hours'
    }
  ];
  
  return (
    <Container>
      <Helmet>
        <title>Dashboard - Learning Platform</title>
        <meta name="description" content="Your learning dashboard" />
      </Helmet>
      
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user?.name || 'Student'}!</WelcomeTitle>
        <WelcomeSubtitle>Track your progress and continue your learning journey.</WelcomeSubtitle>
      </WelcomeSection>
      
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Enrolled Programs</StatTitle>
            <StatIcon bgColor="#e3f2fd" color="#1976d2">
              <FiBook />
            </StatIcon>
          </StatHeader>
          <StatValue>{enrolledPrograms.length || 0}</StatValue>
          <StatChange positive={true}>
            <FiTrendingUp /> 2 new this month
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatTitle>Completed Programs</StatTitle>
            <StatIcon bgColor="#e8f5e9" color="#388e3c">
              <FiAward />
            </StatIcon>
          </StatHeader>
          <StatValue>3</StatValue>
          <StatChange positive={true}>
            <FiTrendingUp /> 1 new this month
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatTitle>Overall Progress</StatTitle>
            <StatIcon bgColor="#fff3e0" color="#f57c00">
              <FiBarChart2 />
            </StatIcon>
          </StatHeader>
          <StatValue>68%</StatValue>
          <StatChange positive={true}>
            <FiTrendingUp /> 12% increase
          </StatChange>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatTitle>Learning Hours</StatTitle>
            <StatIcon bgColor="#e8eaf6" color="#3f51b5">
              <FiClock />
            </StatIcon>
          </StatHeader>
          <StatValue>42</StatValue>
          <StatChange positive={true}>
            <FiTrendingUp /> 8 hours this week
          </StatChange>
        </StatCard>
      </StatsGrid>
      
      <SectionHeader>
        <SectionTitle>
          <FiBook />
          My Learning
        </SectionTitle>
        <ViewAllLink to="/my-learning">View All</ViewAllLink>
      </SectionHeader>
      
      <ProgramsGrid>
        {enrolledPrograms.slice(0, 3).map(program => (
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
              </ProgramMeta>
              <ProgramProgress>
                <ProgressBar>
                  <ProgressFill progress={getProgramCompletion(program._id)} />
                </ProgressBar>
                <ProgressText>
                  <span>{getProgramCompletion(program._id)}% Complete</span>
                  <span>Continue</span>
                </ProgressText>
              </ProgramProgress>
            </ProgramContent>
          </ProgramCard>
        ))}
        
        {enrolledPrograms.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <p>You haven't enrolled in any programs yet.</p>
            <Link to="/programs" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Browse Programs
            </Link>
          </div>
        )}
      </ProgramsGrid>
      
      <SectionHeader>
        <SectionTitle>
          <FiCalendar />
          Upcoming Events
        </SectionTitle>
        <ViewAllLink to="/events">View All</ViewAllLink>
      </SectionHeader>
      
      <UpcomingSection>
        {upcomingEvents.map(event => {
          const date = formatDate(event.date);
          return (
            <UpcomingEvent key={event.id}>
              <EventDate>
                <EventDay>{date.day}</EventDay>
                <EventMonth>{date.month}</EventMonth>
              </EventDate>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
                <EventTime>
                  <FiClock /> {date.time} • {event.duration}
                </EventTime>
              </EventContent>
              <EventAction>
                <EventButton>Join Event</EventButton>
              </EventAction>
            </UpcomingEvent>
          );
        })}
        
        {upcomingEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No upcoming events scheduled.</p>
          </div>
        )}
      </UpcomingSection>
      
      <SectionHeader>
        <SectionTitle>
          <FiAward />
          Recommended Programs
        </SectionTitle>
        <ViewAllLink to="/programs">View All</ViewAllLink>
      </SectionHeader>
      
      <ProgramsGrid>
        {featuredPrograms.slice(0, 3).map(program => (
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
              </ProgramMeta>
            </ProgramContent>
          </ProgramCard>
        ))}
        
        {featuredPrograms.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <p>No recommended programs available.</p>
          </div>
        )}
      </ProgramsGrid>
    </Container>
  );
};

export default Home;