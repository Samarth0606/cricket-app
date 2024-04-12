import axios from "axios";
import type { Choice, TroublemakerTag } from "types";
import type { Question } from "types/question";
import Qs from 'qs';

const ac = axios.create({
  baseURL: process.env.TROUBLEMAKER_API_HOST + "/api",
  headers: {
    Authorization: `Bearer ${process.env.TROUBLEMAKER_API_KEY}`,
  },
});

const getTags = (params: any) => {
  return ac.get<TroublemakerTag[]>("/tags", {
    params,
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets'})// use brackets with indexes
  });
};

const getQuestionById = (id: number, params: any) => {
  return ac.get<Question>("/questions/" + id, {
    params,
  });
};

const getQuestions = (params: any) => {
  return ac.get<Question[]>("/questions", {
    params,
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets'})// use brackets with indexes
    }
  );
};

const submitQuestionById = (questionId: number, answerIds: number[]) => {
  return ac.post<{
    score: number;
    correctlyAnswered?: Choice[];
    incorrectlyAnswered?: Choice[];
  }>(`/questions/${questionId}/submit`, {
    markedChoices: answerIds,
  });
};

export { getTags, getQuestionById, getQuestions, submitQuestionById };
