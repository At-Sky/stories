const storiesList = document.querySelectorAll(".stories-item");
const container = document.querySelector(".daily-stories__outer");
const imgs_wrapper = document.querySelector(".daily-stories__container");

//need to call images like that because swiper creates container twice
const imgs = document.querySelector('.daily-stories__container').children;

const bars = document.querySelectorAll(".progress-bars .bar");
const prevBtn = document.querySelector(".prev-slide");
const nextBtn = document.querySelector(".next-slide");
// const prevBtn = document.querySelector(".swiper-button-next--overlay");
// const nextBtn = document.querySelector(".swiper-button-prev--overlay");
const closeBtn = document.querySelector(".close-button");
const centralArea = document.querySelector(".central-area");
const total_imgs = imgs.length;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let container_width = container.clientWidth;

let current_index = 0;
let pointer_is_down = false;
let [start_x, end_x] = [0, 0];
let move_distance = 0;
let timersSet = [];
let dataSet = [];
let timer;

function reload() {
    window.location.reload(false);
}

function init() {
    container_width = container.clientWidth;
    imgs_wrapper.style.width = `${container_width * total_imgs}px`;
}

function collections() {
    for (var i = 0; i < total_imgs; ++i) {
        timersSet.push(imgs[i].getAttribute("data-timeout"));

        if (imgs[i].classList.contains("video")) {
            dataSet.push(imgs[i].querySelector("video").getAttribute("src"));
        } else {
            dataSet.push(imgs[i].querySelector("img").getAttribute("src"));
        }
    }
}

function slidesAutoPlay() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        if (current_index < total_imgs - 1) {
            nextSlide();
        }
    }, timersSet[current_index]);
}

// Mousemove and Touchmove Event
function createDraggingEffects() {

    const max_distance = 2;
    const scrolled_distance =
        current_index * container_width + (start_x - end_x) / max_distance;

    switchImages(-scrolled_distance);
}

// Set slide "active"
function setSlideActive(i) {
    const currentSlide = imgs[i];

    Array.from(imgs).forEach((el) => el.classList.remove("active"));
    currentSlide.classList.add("active");

    playVideo();
}

// Set bar "active / animate"
function setBarActive(i) {
    bars.forEach((el, index) => {
        if (index >= i) {
            el.classList.remove("animate");
        }
        if (index < i) {
            el.classList.add("seen");
            el.classList.remove("animate");
        } else {
            el.classList.remove("seen");
        }
    });

    bars[i].classList.add("animate");
}

// Set current slide active
function setActive() {
    if (current_index < total_imgs - 1) {
        // if ain't LAST
        setBarActive(parseInt(current_index, 10) + 1);
    } else {
        setBarActive(0);
    }

    setTimeout(() => {
        setBarActive(current_index);
        setSlideActive(current_index);
    }, 1);
}

// Mouseup and Touchend Event
function calculateFinalMoveDistance() {
    const scrolled_distance = Math.abs(start_x - end_x);
    const minimum_distance = 50;

    if (scrolled_distance < minimum_distance && current_index !== 0) {
        move_distance = -(current_index * container_width);
        switchImages();
        return false;
    }

    stopVideo(); // Stop video on current slide if any were playing

    if ((start_x > end_x) & (current_index < total_imgs - 1)) {
        // scroll next
        current_index++;
    } else if (start_x < end_x && current_index > 0) {
        // scroll prev
        current_index--;
    } else if (current_index === 0) {
        setBarActive(1); // hack to reset animation's play state of first slide
    }

    move_distance = -(current_index * container_width);
    switchImages(move_distance);

    //updateSaveImgSrc();

    setActive();

    slidesAutoPlay();
}

// Switch to Next Slide
function nextSlide() {
    if (current_index < total_imgs - 1) {

        document.body.classList.remove("paused"); // Un-Pause slider

        stopVideo(); // Stop video on current slide if any were playing

        current_index++;

        move_distance = -(current_index * container_width);
        switchImages(move_distance);
        //updateSaveImgSrc();

        setActive();

        slidesAutoPlay();
    }
}

// Switch to Prev Slide
function prevSlide() {
    if (current_index >= 0) {
        // check if it isn't FIRST slide

        document.body.classList.remove("paused"); // Un-Pause slider

        stopVideo(); // Stop video on current slide if any were playing

        if (current_index > 0) {
            // decrease index only if larger than 0
            current_index--;
        }

        move_distance = -(current_index * container_width);
        switchImages(move_distance);
        //updateSaveImgSrc();

        setActive();

        slidesAutoPlay();
    }
}

// Switch to specific Slide
function slideTo(i) {

    document.body.classList.remove("paused"); // Un-Pause slider
    stopVideo(); // Stop video on current slide if any were playing

    current_index = i;

    move_distance = -(current_index * container_width);
    switchImages(move_distance);
    //updateSaveImgSrc();

    setActive();

    slidesAutoPlay();
}

function pauseVideo() {
    if (isVideo()) {
        const v = imgs[current_index].querySelector("video");
        v.muted = true;
        v.pause();
    }
}

function playVideo() {
    if (isVideo()) {
        const v = imgs[current_index].querySelector("video");
        v.muted = true;
        v.play();
    }
}

function stopVideo() {
    if (isVideo()) {
        const v = imgs[current_index].querySelector("video");
        v.pause();
        v.currentTime = 0;
    }
}

function toggleMute() {
    if (isVideo()) {
        const v = imgs[current_index].querySelector("video");
        v.muted = !v.muted;
    }
}

function cancelAnimation() {
    clearTimeout(timer);
}

// Switch Images
function switchImages(scrolled_number) {
    const distance = scrolled_number || move_distance;
    imgs_wrapper.style.transform = `translate3d(${distance}px, 0px, 0px)`;
}

// Mouseleave event
function handleMouseLeave(e) {
    if (!pointer_is_down) return false;

    pointer_is_down = false;
    [start_x, end_x] = [0, 0];
    switchImages();
}

// Toggle Play/Pause of Carousel
function toggleSliderAutoplay(e) {
    const state = e.target.getAttribute("data-state");

    if (state === "paused") {
        centralArea.setAttribute("data-state", "playing");
        closeBtn.setAttribute("data-state", "playing");
        document.body.classList.remove("paused");

        setActive();

        slidesAutoPlay();

        stopVideo();
        playVideo();
    } else {
        centralArea.setAttribute("data-state", "paused");
        closeBtn.setAttribute("data-state", "paused");
        document.body.classList.add("paused");
        cancelAnimation();
        pauseVideo();
    }
}

// Check if Slide contains video
function isVideo() {
    return imgs[current_index].classList.contains("video");
}

function copyText(element) {
    const textToCopy = element.href;
    const tempInput = document.createElement("input");

    tempInput.type = "text";
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("Copy");
    document.body.removeChild(tempInput);

    toaster("Link copied to clipboard", "success");
}

function toaster(message, type, timeout = 5000) {
    const body = document.body;

    if (typeof type === "undefined") {
        return;
    }

    const toast = document.createElement("div");

    toast.classList.add("toast-notification", type);
    toast.innerHTML = message;
    body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("active");
    }, 100);
    setTimeout(() => {
        toast.classList.remove("active");
    }, timeout - 500);
    setTimeout(() => {
        toast.parentNode.removeChild(toast);
    }, timeout);
}

// Bind Events on document ready
// document.addEventListener("DOMContentLoaded", () => {
//     init();
//     collections();

//     setSlideActive(0);
//     setBarActive(0);

//     slidesAutoPlay();

//     if (isMobile) {
//         document.body.classList.add("mobile");
//     }
// });
//preparing slider just when story icon is tapped 
storiesList.forEach(item => item.addEventListener('click', () => {
    init();
    collections();

    setSlideActive(0);
    setBarActive(0);

    slidesAutoPlay();

    if (isMobile) {
        document.body.classList.add("mobile");
    }
}))

// Handle PREV Slide btn
prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    prevSlide();
});

// Handle NEXT Slide btn
nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    nextSlide();
});

// Handle click on Central Area - Play/Pause animation
centralArea.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSliderAutoplay(e);
});


// Handle click on Close Button - Play/Pause animation
closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSliderAutoplay(e);
})

// Handle Mouse events
// container.addEventListener("mousedown", (e) => {
//     e.preventDefault();

//     pointer_is_down = true;
//     start_x = e.pageX;
// });

// container.addEventListener("mousemove", (e) => {
//     e.preventDefault();

//     if (!pointer_is_down) return false;
//     end_x = e.pageX;
//     createDraggingEffects();
// });

// container.addEventListener("mouseup", (e) => {
//     e.preventDefault();

//     pointer_is_down = false;
//     calculateFinalMoveDistance();
// });

// container.addEventListener("mouseleave", handleMouseLeave);

// // Handle Touch events
// container.addEventListener("touchstart", (e) => {
//     pointer_is_down = true;
//     start_x = e.touches[0].pageX;
// });

// container.addEventListener("touchmove", (e) => {
//     if (!pointer_is_down) return false;
//     end_x = e.touches[0].pageX;
//     createDraggingEffects();
// });

// container.addEventListener("touchend", (e) => {
//     pointer_is_down = false;
//     calculateFinalMoveDistance();
// });

// Handle Window resize
 window.addEventListener("resize", reload);  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Handle Progress Bar Click
bars.forEach((bar) => {
    bar.addEventListener("click", () => {
        slideTo(bar.getAttribute("data-index"));
    });
});


class Swiper {
    constructor(...args) {
      let el;
      let params;
  
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
        params = args[0];
      } else {
        [el, params] = args;
      }
  
      if (!params) params = {};
      params = extend({}, params);
      if (el && !params.el) params.el = el;
  
      if (params.el && $(params.el).length > 1) {
        const swipers = [];
        $(params.el).each(containerEl => {
          const newParams = extend({}, params, {
            el: containerEl
          });
          swipers.push(new Swiper(newParams));
        }); // eslint-disable-next-line no-constructor-return
  
        return swipers;
      } // Swiper Instance
  
  
      const swiper = this;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
  
      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }
  
      const allModulesParams = {};
      swiper.modules.forEach(mod => {
        mod({
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      }); // Extend defaults with modules params
  
      const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params
  
      swiper.params = extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend({}, swiper.params);
      swiper.passedParams = extend({}, params); // add event listeners
  
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach(eventName => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
  
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      } // Save Dom lib
  
  
      swiper.$ = $; // Extend Swiper
  
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: $(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
  
        // isDirection
        isHorizontal() {
          return swiper.params.direction === 'horizontal';
        },
  
        isVertical() {
          return swiper.params.direction === 'vertical';
        },
  
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEvents: function touchEvents() {
          const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
          const desktop = ['pointerdown', 'pointermove', 'pointerup'];
          swiper.touchEventsTouch = {
            start: touch[0],
            move: touch[1],
            end: touch[2],
            cancel: touch[3]
          };
          swiper.touchEventsDesktop = {
            start: desktop[0],
            move: desktop[1],
            end: desktop[2]
          };
          return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
        }(),
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: now(),
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          isTouchEvent: undefined,
          startMoving: undefined
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit('_swiper'); // Init
  
      if (swiper.params.init) {
        swiper.init();
      } // Return app instance
      // eslint-disable-next-line no-constructor-return
  
  
      return swiper;
    }
  
    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;
  
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
  
      swiper.emit('enable');
    }
  
    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;
  
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
  
      swiper.emit('disable');
    }
  
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(' ').filter(className => {
        return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit('_containerClasses', cls.join(' '));
    }
  
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed) return '';
      return slideEl.className.split(' ').filter(className => {
        return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(' ');
    }
  
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.each(slideEl => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit('_slideClass', slideEl, classNames);
      });
      swiper.emit('_slideClasses', updates);
    }
  
    slidesPerViewDynamic(view = 'current', exact = false) {
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
  
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex].swiperSlideSize;
        let breakLoop;
  
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
  
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        // eslint-disable-next-line
        if (view === 'current') {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
  
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          // previous
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
  
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
  
      return spv;
    }
  
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const {
        snapGrid,
        params
      } = swiper; // Breakpoints
  
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
  
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
  
      function setTranslate() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
  
      let translated;
  
      if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
        setTranslate();
  
        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
          translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
  
        if (!translated) {
          setTranslate();
        }
      }
  
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
  
      swiper.emit('update');
    }
  
    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
  
      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }
  
      if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
        return swiper;
      }
  
      swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.each(slideEl => {
        if (newDirection === 'vertical') {
          slideEl.style.width = '';
        } else {
          slideEl.style.height = '';
        }
      });
      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();
      return swiper;
    }
  
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
      swiper.rtl = direction === 'rtl';
      swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;
  
      if (swiper.rtl) {
        swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = 'rtl';
      } else {
        swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = 'ltr';
      }
  
      swiper.update();
    }
  
    mount(el) {
      const swiper = this;
      if (swiper.mounted) return true; // Find el
  
      const $el = $(el || swiper.params.el);
      el = $el[0];
  
      if (!el) {
        return false;
      }
  
      el.swiper = swiper;
  
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
      };
  
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items
  
          res.children = options => $el.children(options);
  
          return res;
        }
  
        if (!$el.children) {
          return $($el).children(getWrapperSelector());
        }
  
        return $el.children(getWrapperSelector());
      }; // Find Wrapper
  
  
      let $wrapperEl = getWrapper();
  
      if ($wrapperEl.length === 0 && swiper.params.createElements) {
        const document = getDocument();
        const wrapper = document.createElement('div');
        $wrapperEl = $(wrapper);
        wrapper.className = swiper.params.wrapperClass;
        $el.append(wrapper);
        $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
          $wrapperEl.append(slideEl);
        });
      }
  
      Object.assign(swiper, {
        $el,
        el,
        $wrapperEl,
        wrapperEl: $wrapperEl[0],
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
        rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
        wrongRTL: $wrapperEl.css('display') === '-webkit-box'
      });
      return true;
    }
  
    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit('beforeInit'); // Set breakpoint
  
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      } // Add Classes
  
  
      swiper.addClasses(); // Create loop
  
      if (swiper.params.loop) {
        swiper.loopCreate();
      } // Update size
  
  
      swiper.updateSize(); // Update slides
  
      swiper.updateSlides();
  
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      } // Set Grab Cursor
  
  
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }
  
      if (swiper.params.preloadImages) {
        swiper.preloadImages();
      } // Slide To Initial Slide
  
  
      if (swiper.params.loop) {
        swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      } // Attach events
  
  
      swiper.attachEvents(); // Init Flag
  
      swiper.initialized = true; // Emit
  
      swiper.emit('init');
      swiper.emit('afterInit');
      return swiper;
    }
  
}