import { map, getTranslationDistance, getDistance } from './utils';
import { gsap } from 'gsap';
import {Item} from './item';

/**
 * Class representing a Spread Grid
 */
export class SpreadGrid {
    // DOM elements
	DOM = {
		// main element (.grid)
		el: null,
        // items (.grid__item)
        items: null,
	}
    // Index of the current expanded item
    expanded = -1;
    // Cached index of previous expanded item
    previousExpanded = -1;
    
    /**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.grid)
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
        this.DOM.items = [...this.DOM.el.querySelectorAll('.grid__item')];
        this.items = [];
        this.DOM.items.forEach(item => this.items.push(new Item(item)));

        // Options passed in data attributes and defaults.
        this.options = {};
        this.options.duration = Number(this.DOM.el.dataset.duration) || 0.8;
        this.options.ease = this.DOM.el.dataset.ease || 'power4';
        this.options.scale = Number(this.DOM.el.dataset.scale) || 2;
        this.options.skew = Number(this.DOM.el.dataset.skew) || 0;
        this.options.maxRotation = Number(this.DOM.el.dataset.maxRotation) || 0;
        this.options.spread = Number(this.DOM.el.dataset.spread) || 80;
        this.options.maxDistance = Number(this.DOM.el.dataset.maxDistance) || 500;
        
        this.initEvents();
	}
    /**
	 * Initialize events.
	 */
    initEvents() {
        for (const item of this.items) {
            item.DOM.el.addEventListener('click', () => this.expand(item));
        }
    }
    /**
	 * Expands clicked item.
     * @param {Item} item - the clicked item.
	 */
    expand(item) {

        if ( this.tl ) {
            this.tl.kill();
        }

        const itemIdx = this.items.indexOf(item);

        this.previousExpanded = this.expanded !== -1 && this.expanded !== itemIdx ? this.expanded : -1;
        this.expanded = this.expanded === itemIdx ? -1 : itemIdx;

        this.tl = gsap.timeline({
            defaults: {
                duration: this.options.duration,
                ease: this.options.ease
            }
        })
        .addLabel('start', 0)
        .addLabel('end', this.options.duration)
        .set(item.DOM.el, {
            zIndex: this.expanded === -1 ? 1 : 999
        }, this.expanded === -1 ? 'end' : 'start')
        
        if ( this.options.skew ) {
            this.tl.to(item.DOM.el, {
                duration: this.options.duration*.4,
                ease: 'sine.in',
                scale: 1+(this.options.scale-1)/2,
                skewX: this.expanded === -1 ? -1*this.options.skew : this.options.skew,
                skewY: this.expanded === -1 ? -1*this.options.skew : this.options.skew,
                x: 0,
                y: 0,
                rotation: 0,
            }, 'start')
            .to(item.DOM.el, {
                duration: this.options.duration*.6,
                ease: 'power4',
                scale: this.expanded === -1 ? 1 : this.options.scale,
                skewX: 0,
                skewY: 0,
            }, `start+=${this.options.duration*.4}`)
        }
        else {
            this.tl.to(item.DOM.el, {
                scale: this.expanded === -1 ? 1 : this.options.scale,
                x: 0,
                y: 0,
                rotation: 0,
            }, 'start');
        }

        // Close previous one
        if ( this.previousExpanded !== -1 ) {
            const prevItem = this.items[this.previousExpanded];
            const delay = 0//map(getDistance(prevItem.DOM.el, item.DOM.el), 0, 1500, 0, 0.2);
            
            this.tl
            .set(prevItem.DOM.el, {
                zIndex: 1,
                delay: delay,
            }, 'start')
            .to(prevItem.DOM.el, {
                scale: 1,
                x: 0,
                y: 0,
                rotation: 0,
                delay: delay,
            }, 'start');
        }

        // All items except the clicked one
        const filteredArray = this.items.filter(otherItem => otherItem != item);
        
        for (let otherItem of filteredArray) {

            const {x,y} = this.expanded === -1 ? {x:0,y:0} : getTranslationDistance(otherItem.DOM.el, item.DOM.el, this.options.spread, this.options.maxDistance);
            const delay = 0//this.expanded === -1 ? 0 : map(getDistance(otherItem.DOM.el, item.DOM.el), 0, 1500, 0, 0.2);
            
            const zIndex = Math.round(map(getDistance(otherItem.DOM.el, item.DOM.el), 0, 100000, 998, 1));
            
            const rotationInterval = this.options.maxRotation ? Math.max( Math.round(map(getDistance(otherItem.DOM.el, item.DOM.el), 0, 500, this.options.maxRotation, 0)), 0 ) : 0;
            
            this.tl
            .set(otherItem.DOM.el, {
                zIndex: this.expanded === -1 ? 1 : zIndex,
                delay: delay,
            }, this.expanded === -1 ? 'end' : 'start')
            .to(otherItem.DOM.el, {
                x: x,
                y: y,
                rotation: this.expanded === -1 ? 0 : gsap.utils.random(rotationInterval*-1, rotationInterval),
                delay: delay,
            }, 'start');

        }

    }
}