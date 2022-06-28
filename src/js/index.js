import { preloadImages } from './utils';
import {SpreadGrid} from './spreadGrid';

[...document.querySelectorAll('.grid')].forEach(grid => new SpreadGrid(grid));

// Preload images
preloadImages('.grid__item-img').then( _ => document.body.classList.remove('loading'));