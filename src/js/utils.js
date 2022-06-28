const imagesLoaded = require('imagesloaded');

/**
 * Map number x from range [a, b] to [c, d] 
 * @param {Number} x - changing value
 * @param {Number} a 
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 */
const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;

/**
 * Preload images
 * @param {String} selector - Selector/scope from where images need to be preloaded. Default is 'img'
 */
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    });
};

/** 
 * Calculates how much (x and y) the element1 needs to move away from element2 for a distance of [spread]px
 * @param {Element} element1
 * @param {Element} element2
 * @param {Number} spread - The maximum distance the element1 could have from element2. This will depend on how far the elements are from each other. The closer they are, the higher the returned values. If the distance equals or is higher than [maxDistance] then the return value will be {0,0}
 * @param {Number} maxDistance - The maximum distance between the two elements for a possible translation to occur
 * @returns {JSON} the x,y translation values
 */
const getTranslationDistance = (element1, element2, spread = 80, maxDistance = 500) => {
    const elCenter = {x: element1.offsetLeft + element1.offsetWidth/2, y: element1.offsetTop + element1.offsetHeight/2};
    const elCenter2 = {x: element2.offsetLeft + element2.offsetWidth/2, y: element2.offsetTop + element2.offsetHeight/2};

    spread = Math.max( map(getDistance(element1, element2), 0, maxDistance, spread, 0) , 0);

    const angle = Math.atan2(Math.abs(elCenter2.y - elCenter.y), Math.abs(elCenter2.x - elCenter.x));
    
    let x = Math.abs(Math.cos(angle) * spread);
    let y = Math.abs(Math.sin(angle) * spread);
    
    return {
        x: elCenter.x < elCenter2.x ? x*-1 : x,
        y: elCenter.y < elCenter2.y ? y*-1 : y
    };
};

/**
 * Gets the distance between two elements (elemen's center)
 * @param {Element} element1
 * @param {Element} element2
 * @returns {Number} The distance value
 */
const getDistance = (element1, element2) => {
    const elCenter = {x: element1.offsetLeft + element1.offsetWidth/2, y: element1.offsetTop + element1.offsetHeight/2};
    const elCenter2 = {x: element2.offsetLeft + element2.offsetWidth/2, y: element2.offsetTop + element2.offsetHeight/2};
    return Math.hypot(elCenter.x - elCenter2.x, elCenter.y - elCenter2.y);
}

export {
    map,
    preloadImages,
    getTranslationDistance,
    getDistance
};