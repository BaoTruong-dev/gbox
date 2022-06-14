// Convert SVG img
$(window).on('load', function () {
    gsap.from('.text-shake', {
        duration: 1.5,
        opacity: 0,
        x: 80,
        ease: "elastic.out(1, 0.3)",
        stagger: .5
    });
    $('.svg').svgToInline();
});
// Mobile nav
let topLine = $('.menu-hamburger #top');
let midLine = $('.menu-hamburger #mid');
let botLine = $('.menu-hamburger #bot');
let mobileNav = $('header .mobile-nav');
$('.menu-hamburger').on('click', () => {
    midLine.toggleClass('close');
    topLine.toggleClass('close');
    botLine.toggleClass('close');
    mobileNav.toggleClass('active');
});


// Button Top
$('.to-top .button').on('click', () => {
    let heightBody = $('html').height();
    window.scrollTo(
        {
            top: -heightBody,
            behavior: 'smooth',
        }
    );
});

// Category
let listFilter = document.querySelectorAll('.category__list li');
let categoryBox = document.querySelectorAll('.category__products .category__products--box .info-box');
listFilter.forEach((item) => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        listFilter.forEach(function (li) {
            li.classList.remove('active');
        });
        item.classList.add('active');
        let dataId = item.getAttribute('data-id');
        categoryBox.forEach(function (info) {
            info.classList.add('hidden');
        });
        if (dataId == '--all') {
            categoryBox.forEach(function (info) {
                info.classList.remove('hidden');
            });
        }
        categoryBox.forEach(function (li) {
            let liData = li.getAttribute('data-id');
            if (dataId == liData) {
                li.classList.add('show');
            } else {
                li.classList.remove('show');
            }
        });

    });
});

// Slider detail-studio
let $carousel = $('.allInfo__imgs .main-carousel');
$carousel.flickity({
    // options
    cellAlign: 'left',
    contain: true,
    freeScroll: false,
    prevNextButtons: false,
    pageDots: false,
    draggable: false,
    wrapAround: true,
});
// Mobile next-prev
$('.allInfo__imgs .preNext-mobile .--prev').on('click', function (e) {
    e.stopPropagation();
    console.log('child');
    $carousel.flickity('previous', true);
});
$('.allInfo__imgs .preNext-mobile .--next').on('click', function () {
    $carousel.flickity('next', true);
});
// Desktop next-prev
$('.allInfo__options .move-page .--prev').on('click', function () {
    $carousel.flickity('previous', true);
});
$('.allInfo__options .move-page .--next').on('click', function () {
    $carousel.flickity('next', true);
});

// Photoswipe fr
var initPhotoSwipeFromDOM = function (gallerySelector) {
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};
        if (hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };
        if (fromURL) {
            if (options.galleryPIDs) {
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if (isNaN(options.index)) {
            return;
        }
        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};


// full screen detail studio
$(window).ready(function () {
    initPhotoSwipeFromDOM('.detail__img');
});


// photoswipe gallery coffee
$(window).ready(function () {
    initPhotoSwipeFromDOM('.coffee .gallery .gallery__carousel .gallery__carousel--wrapper');
});

// redirect to other link
$('.info__wrap--child').click(() => {
    window.location.href = 'https://baotruong-dev.github.io/gbox/studio-details.html';
});
