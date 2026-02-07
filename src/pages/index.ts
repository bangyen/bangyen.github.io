import { ROUTES } from '../config/constants';

export { default as Home } from '../features/home/pages/Home';
export { default as Error } from './Error';
export { default as Lights_Out } from '../features/games/lights-out/LightsOut';
export { default as ZSharp } from '../features/research/pages/ZSharp';
export { default as Oligopoly } from '../features/research/pages/Oligopoly';
export { default as Interpreters } from '../features/interpreters/pages/Interpreters';
export { default as WikipediaQuiz } from '../features/quiz/pages/WikipediaQuizPage';

export const pages = ROUTES.pages;
