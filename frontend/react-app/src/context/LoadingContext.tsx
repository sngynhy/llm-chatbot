import React, { createContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean;
  activeLoading: () => void;
  deactiveLoading: () => void;
}

// 📍 1. context 생성
export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  activeLoading: () => {},
  deactiveLoading: () => {},
});

interface LoadingContextProps {
  children: React.ReactNode;
}

// 📍 2. Provider 컴포넌트 > state와 state의 상태를 제어하는 함수 선언
export const LoadingProvider = ({ children }: LoadingContextProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const activeLoading = () => setIsLoading(true);
  const deactiveLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider
      value={{ isLoading, activeLoading, deactiveLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
