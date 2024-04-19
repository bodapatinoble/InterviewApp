import React, {createContext, useContext, useState} from 'react';

const QuestionContext = createContext();

export const useQuestionContext = () => useContext(QuestionContext);

export const QuestionProvider = ({children}) => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = question => {
    setQuestions([...questions, question]);
  };

  return (
    <QuestionContext.Provider value={{questions, addQuestion}}>
      {children}
    </QuestionContext.Provider>
  );
};
