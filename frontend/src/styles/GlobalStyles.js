import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    background-color: #000;
    color: #fff;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-align: center;
    
    &:hover {
      background-color: #333;
      transform: translateY(-2px);
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }

  .btn-outline {
    background-color: transparent;
    color: #000;
    border: 2px solid #000;
    
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }

  .btn-secondary {
    background-color: #f8f9fa;
    color: #333;
    
    &:hover {
      background-color: #e9ecef;
    }
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .d-flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .align-center {
    align-items: center;
  }

  .gap-1 {
    gap: 0.5rem;
  }

  .gap-2 {
    gap: 1rem;
  }

  .gap-3 {
    gap: 1.5rem;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 2rem;
  }

  .mt-1 {
    margin-top: 0.5rem;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .mt-3 {
    margin-top: 1.5rem;
  }

  .mt-4 {
    margin-top: 2rem;
  }

  .grid {
    display: grid;
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: 1fr;
    }
  }

  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default GlobalStyles;