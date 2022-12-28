let mainSlider = new Swiper(".stories__swiper--main", {
  slidesPerView: 8,
  spaceBetween: 10,
  loop: true,
  loopFillGroupWithBlank: true,
  // autoplay: {
  //   delay: 5000,
  // },
  // pagination: {
  //   el: ".swiper-pagination",
  //   clickable: true,
  // },
  navigation: {
    nextEl: ".swiper-button-next--main",
    prevEl: ".swiper-button-prev--main",
  },
});


let overlaySlider = new Swiper(".stories__swiper--overlay", {
  slidesPerView: 1,
  //spaceBetween: 10,
  loop: true,
  loopFillGroupWithBlank: true,
  // autoplay: {
  //   delay: 5000,
  // },
  pagination: {
    el: ".swiper-pagination--overlay",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next--overlay",
    prevEl: ".swiper-button-prev--overlay",
  },
});

