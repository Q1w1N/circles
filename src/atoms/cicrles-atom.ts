import { atom } from 'jotai';
import { Circle } from '../components/circle';

export const circlesAtom = atom<Circle[]>([]);
