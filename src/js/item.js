/**
 * Class representing a Grid Item
 */
export class Item {
    // DOM elements
	DOM = {
		// main element (.grid__item)
		el: null,
        // image element (.grid__item-img)
        image: null
	}
    
    /**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.grid__item)
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
        this.DOM.image = this.DOM.el.querySelector('.grid__item-img');
	}
}