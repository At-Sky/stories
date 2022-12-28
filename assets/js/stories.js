const storiesItems = document.querySelectorAll('.stories-item')
const overlay = document.querySelector('.stories-overlay')
const storiesOverlayBg = document.querySelector('.stories-overlay__bg')

const buttonNext = document.querySelector('.swiper-button-next--overlay')
const buttonPrev = document.querySelector('.swiper-button-prev--overlay')
const closeButton = document.querySelector('.close-button')

storiesItems.forEach(item => item.addEventListener('click', (e) => {
    overlay.classList.add('stories-overlay--show')

    //sets backgound on first open
    const item = e.path[6].lastElementChild.children[1].firstElementChild.children
    const itemPos = Array.from(item).find(el => el.classList.contains('swiper-slide-active')).firstElementChild
    const bg = window.getComputedStyle(itemPos).backgroundImage
    storiesOverlayBg.style.backgroundImage = bg
}))


overlay.addEventListener('click', (e) => {
    if (e.target == storiesOverlayBg) {
        overlay.classList.remove('stories-overlay--show')
    }
})

closeButton.addEventListener('click', (e) => {
    overlay.classList.remove('stories-overlay--show')
})

buttonNext.addEventListener('click', (e) => {
    //sets backgound on next button click
    const item = e.path[0].previousElementSibling.firstElementChild.children
    const itemPos = Array.from(item).find(el => el.classList.contains('swiper-slide-active')).firstElementChild
    const bg = window.getComputedStyle(itemPos).backgroundImage
    storiesOverlayBg.style.backgroundImage = bg
})

buttonPrev.addEventListener('click', (e) => {
    //sets backgound on prev button click
    const item = e.path[0].previousElementSibling.previousElementSibling.firstElementChild.children
    const itemPos = Array.from(item).find(el => el.classList.contains('swiper-slide-active')).firstElementChild
    const bg = window.getComputedStyle(itemPos).backgroundImage
    storiesOverlayBg.style.backgroundImage = bg
})

