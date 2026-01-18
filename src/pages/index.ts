import { ROUTES } from '../config/constants';

export { default as Home } from './Home';
export { default as Error } from './Error';
export { default as Snake } from '../features/games/Snake';
export { default as Lights_Out } from '../features/games/lights-out/LightsOut';
export { default as ZSharp } from './ZSharp';
export { default as Oligopoly } from './Oligopoly';
export { default as Interpreters } from './Interpreters';
export { default as WikipediaQuiz } from '../features/quiz/pages/WikipediaQuizPage';

export const pages = ROUTES.pages;
