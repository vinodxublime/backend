import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCheck, FiX, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import * as quizzesAPI from '../../api/quizzes';
import { useNotifications } from '../../context/NotificationContext';

const QuizContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const QuizHeader = styled.div`
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const QuizDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
`;

const QuizMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const QuizMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
`;

const QuestionText = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  color: #333;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionItem = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid ${props => {
    if (props.selected && props.showResults) {
      return props.correct ? '#28a745' : '#dc3545';
    }
    return props.selected ? '#000' : '#ddd';
  }};
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  background-color: ${props => {
    if (props.showResults) {
      if (props.correct) return 'rgba(40, 167, 69, 0.1)';
      if (props.selected && !props.correct) return 'rgba(220, 53, 69, 0.1)';
    }
    return props.selected ? 'rgba(0, 0, 0, 0.05)' : '#fff';
  }};
  
  &:hover {
    border-color: ${props => props.disabled ? props.selected ? props.showResults ? props.correct ? '#28a745' : '#dc3545' : '#000' : '#ddd' : '#000'};
    background-color: ${props => props.disabled ? props.selected ? props.showResults ? props.correct ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 0, 0, 0.05)' : '#fff' : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionLabel = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.selected ? '#000' : '#f5f5f5'};
  color: ${props => props.selected ? '#fff' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  flex-shrink: 0;
`;

const OptionText = styled.div`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
`;

const ResultIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.correct ? '#28a745' : '#dc3545'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeedbackContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.correct ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
  color: ${props => props.correct ? '#28a745' : '#dc3545'};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuizActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const QuizButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #333;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SkipButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background-color: #f5f5f5;
  border-radius: 3px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #000;
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

const ResultsContainer = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const ResultsScore = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => {
    if (props.score >= 80) return '#28a745';
    if (props.score >= 60) return '#ffc107';
    return '#dc3545';
  }};
  margin-bottom: 1rem;
`;

const ResultsText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Quiz = ({ quizId, programId, moduleId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showNotification } = useNotifications();
  
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const response = await quizzesAPI.getQuiz(quizId);
        setQuiz(response.quiz);
      } catch (error) {
        setError(error.message || 'Failed to load quiz');
        showNotification('Failed to load quiz. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId, showNotification]);
  
  const handleOptionSelect = (questionId, optionId) => {
    if (showResults) return;
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  const handleCheckAnswer = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = selectedOptions[currentQuestion._id];
    
    if (!selectedOption) {
      showNotification('Please select an option', 'warning');
      return;
    }
    
    setShowResults(true);
    
    // Find the selected option
    const option = currentQuestion.options.find(opt => opt._id === selectedOption);
    
    // Update score if correct
    if (option.isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Submit answer to API
    try {
      await quizzesAPI.submitQuizAnswer(quizId, currentQuestion._id, selectedOption);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResults(false);
    } else {
      completeQuiz();
    }
  };
  
  const completeQuiz = async () => {
    setQuizCompleted(true);
    
    const finalScore = Math.round((score / quiz.questions.length) * 100);
    
    try {
      await quizzesAPI.completeQuiz(quizId, {
        score: finalScore,
        programId,
        moduleId
      });
      
      if (onComplete) {
        onComplete({
          quizId,
          score: finalScore,
          passed: finalScore >= quiz.passingScore
        });
      }
      
      showNotification(
        finalScore >= quiz.passingScore
          ? 'Quiz completed successfully!'
          : 'Quiz completed. You did not reach the passing score.',
        finalScore >= quiz.passingScore ? 'success' : 'warning'
      );
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      showNotification('Failed to save quiz results. Please try again.', 'error');
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <p>Loading quiz...</p>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <QuizContainer>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <FiAlertCircle size={48} color="#dc3545" />
          <h3 style={{ marginTop: '1rem', color: '#333' }}>Failed to load quiz</h3>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{error}</p>
          <QuizButton 
            style={{ margin: '1.5rem auto 0', display: 'inline-flex' }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </QuizButton>
        </div>
      </QuizContainer>
    );
  }
  
  if (!quiz) {
    return null;
  }
  
  if (quizCompleted) {
    const finalScore = Math.round((score / quiz.questions.length) * 100);
    const passed = finalScore >= quiz.passingScore;
    
    return (
      <QuizContainer>
        <QuizHeader>
          <QuizTitle>{quiz.title.en}</QuizTitle>
          <QuizDescription>{quiz.description.en}</QuizDescription>
        </QuizHeader>
        
        <ResultsContainer>
          <ResultsScore score={finalScore}>{finalScore}%</ResultsScore>
          <ResultsText>
            {passed
              ? 'Congratulations! You have passed the quiz.'
              : `You did not reach the passing score of ${quiz.passingScore}%. Try again later.`}
          </ResultsText>
          
          <QuizButton onClick={() => onComplete && onComplete({
            quizId,
            score: finalScore,
            passed
          })}>
            {passed ? 'Continue to Next Module' : 'Review Module and Try Again'}
          </QuizButton>
        </ResultsContainer>
      </QuizContainer>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = selectedOptions[currentQuestion._id];
  const correctOption = currentQuestion.options.find(opt => opt.isCorrect);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  return (
    <QuizContainer>
      <QuizHeader>
        <QuizTitle>{quiz.title.en}</QuizTitle>
        <QuizDescription>{quiz.description.en}</QuizDescription>
        <QuizMeta>
          <QuizMetaItem>Questions: {quiz.questions.length}</QuizMetaItem>
          <QuizMetaItem>Passing Score: {quiz.passingScore}%</QuizMetaItem>
        </QuizMeta>
      </QuizHeader>
      
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      
      <QuestionContainer>
        <QuestionNumber>Question {currentQuestionIndex + 1} of {quiz.questions.length}</QuestionNumber>
        <QuestionText>{currentQuestion.text.en}</QuestionText>
        
        <OptionsContainer>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option._id;
            const isCorrect = option.isCorrect;
            
            return (
              <OptionItem 
                key={option._id}
                selected={isSelected}
                correct={isCorrect}
                showResults={showResults}
                disabled={showResults}
                onClick={() => handleOptionSelect(currentQuestion._id, option._id)}
              >
                <OptionContent>
                  <OptionLabel selected={isSelected}>
                    {String.fromCharCode(65 + index)}
                  </OptionLabel>
                  <OptionText>{option.text.en}</OptionText>
                </OptionContent>
                
                {showResults && isSelected && (
                  <ResultIcon correct={isCorrect}>
                    {isCorrect ? <FiCheck /> : <FiX />}
                  </ResultIcon>
                )}
              </OptionItem>
            );
          })}
        </OptionsContainer>
        
        {showResults && (
          <FeedbackContainer correct={selectedOption === correctOption._id}>
            {selectedOption === correctOption._id ? (
              <>
                <FiCheck />
                <span>Correct! {currentQuestion.explanation?.en}</span>
              </>
            ) : (
              <>
                <FiX />
                <span>
                  Incorrect. The correct answer is {correctOption.text.en}.
                  {currentQuestion.explanation?.en && ` ${currentQuestion.explanation.en}`}
                </span>
              </>
            )}
          </FeedbackContainer>
        )}
      </QuestionContainer>
      
      <QuizActions>
        {!showResults ? (
          <>
            <SkipButton 
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
            >
              Skip
            </SkipButton>
            <QuizButton 
              onClick={handleCheckAnswer}
              disabled={!selectedOption}
            >
              Check Answer
            </QuizButton>
          </>
        ) : (
          <QuizButton 
            onClick={handleNextQuestion}
            style={{ marginLeft: 'auto' }}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <FiArrowRight />
          </QuizButton>
        )}
      </QuizActions>
    </QuizContainer>
  );
};

export default Quiz;