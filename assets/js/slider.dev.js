"use strict";

var swiper = new Swiper(".stories__swiper--main", {
  slidesPerView: 8,
  spaceBetween: 10,
  loop: true,
  loopFillGroupWithBlank: true,
  // autoplay: {
  //   delay: 5000,
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  }
});