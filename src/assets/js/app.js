/**
 * описание класса модалки
 */
class Modal {
    constructor(modal, button) {
        this.modal = modal;
        this.button = button;
        this.init();
    }

    init() {
        this.openModal();
        this.scrollPadding();
    }

    openModal() {
        const buttons = document.querySelectorAll(this.button);
        const modalOverlay = document.querySelector(this.modal);

        if (buttons.length == 0) {
            this.debug('кнопки не найдены');
            return;
        }
        if (!modalOverlay) {
            this.debug('модальное окно не найдено');
            return;
        }

        buttons.forEach(element => {
            element.addEventListener('click', (event) => {
                this.cancelClick(event);
                modalOverlay.classList.add('active');
                setTimeout(() => {
                    modalOverlay.classList.add('animation');
                }, 300);
                this.propogation(modalOverlay);
                this.closedElements(modalOverlay);
            })
        });
    }

    closedElements(modalOverlay) {
        const buttonClose = modalOverlay?.querySelector('[data-close]');
        if (!buttonClose) {
            this.debug('не найдена кнопка закрытия');
            return;
        }
        this.closeModal(buttonClose);
        this.closeModal(modalOverlay);
    }

    closeModal(instanse, modalOverlay = document.querySelector(this.modal)) {
        instanse.addEventListener('click', () => {
            modalOverlay.classList.remove('animation');
            setTimeout(() => {
                modalOverlay.classList.remove('active');
            }, 300);
        })
    }

    cancelClick(event) {
        event.preventDefault();
    }

    debug(element) {
        console.log(element);
    }

    propogation(modalOverlay) {
        const modal = modalOverlay.children;
        modal[0].addEventListener('click', (event) => {
            event.stopPropagation();
        })
    }

    scrollPadding() {
        const body = document.body;
        const inner = document.querySelector('.container');
        const scrollBarWidth = window.innerWidth - body.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);
    }
}

/**
 * 
 *  логика выбора звезд
 */
function checkStars() {
    const stars = document.querySelectorAll('.radio_star');
    if (stars.length === 0) {
        return;
    }
    stars.forEach((star, index) => {
        star.addEventListener('click', (event) => {

            stars.forEach(element => {
                element.classList.remove('active');
            });

            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('active');
            }
        })
    });
}

//кнопка читать больше.
class ReadMore {
    constructor(text) {
        this.text = text;

        this.init();
    }

    init() {
        this.checkOverflow();
    }

    checkOverflow() {
        const textAll = document.querySelectorAll(`${this.text}`);
        if (textAll.length == 0) {
            console.log('комментариев на странице не обнаружено');
            return;
        }
        textAll.forEach(text => {
            text.scrollHeight > text.clientHeight ? this._buttonActive(text) : '';
        });
    }

    _buttonActive(text) {
        const button = text.nextElementSibling;
        if (!button) {
            console.log('кнопка не обнаружена');
            return;
        }
        button.style.display = "block";
        this._handleClick(button, text);
    }
    _handleClick(button, text) {
        const container = button.closest('.review_inner_item');
        if (!container) {
            console.log('родитель не обнаружен');
        }
        button.addEventListener('click', () => {
            container.classList.toggle('active');
            if (container.classList.contains('active')) {
                text.style.maxHeight = text.scrollHeight + "px"; 
                button.textContent = "Read less";
            } else {
                text.style.maxHeight = "7.2em";
                button.textContent = "Read more";
            }
        })
    }
}

class FooterMenu{
    static height = '1.5em';

    constructor(footerClass){
        this.footerClass = footerClass;

        this.init();
    }

    init(){
        this.setupAccordion();
    }

    setupAccordion(){
        const menus = document.querySelectorAll(this.footerClass);
        menus.forEach(menu => {
            if(this._checkCount(menu)){
                const title = menu.querySelector('.footer_name');
                this._addClass(title);
                this._hideMenu(menu);
                this._toggleMenu(title, menu);
            }
        });
    }

    _checkCount(menu){
        return menu.children.length > 1;
    }

    static get HEIGHT() {
        return '1.5em';
    }

    _addClass(item){
        item.classList.add('image');
    }

    _hideMenu(menu){
        menu.style.maxHeight = FooterMenu.HEIGHT;
    }

    _toggleMenu(title, menu){
        title.querySelector('a').addEventListener('click', (event)=>{
            event.preventDefault();
            menu.classList.toggle('show');
            menu.style.maxHeight = menu.classList.contains('show') ? `${menu.scrollHeight}px` : FooterMenu.HEIGHT;
        })
    }
}

/**
 * фильтр категорий
 */
class Filter{
        static flag = false;

        /**
         * 
         * @param {*} show - элемент показа и скрытия фильтров
         * @param {*} height - высота - считается из css
         * @returns 
         */
        constructor(show, height){
            this.show = document.querySelector(`[${show}]`);
            this.height = height;
            if(!this.show){
                console.log('кнопка показа не найдена');
                return;
            } 
            this.parent = this.show.closest('ul');
            if(!this.parent){
                console.log('родитель не найден')
                return;
            }
        
            this.#init();  
        }

        /**
         * инициализация клика
         */
        #init(){
            this.#clickOnShow();
        }

        /**
         * обработчик клика
         */
        #clickOnShow(){
            this.show.addEventListener('click',(event)=>{
                event.preventDefault();
                this.parent.classList.toggle('active');
                this.#filterAnimation(this.parent);
            })
        }

        /**
         * Анимация раскрытия и открытия
         * @param {*} parent родительская директория
         */
        #filterAnimation(parent){
            if(!Filter.flag){
                Filter.flag = true;
                this.height = window.getComputedStyle(parent).maxHeight;
            }
            if(parent.classList.contains('active')){
                parent.style.maxHeight = `${parent.scrollHeight}px`;
                this.#changeLabel('Hide all');
            }else{
                parent.style.maxHeight = this.height;
                this.#changeLabel('Show all');
            }
        }

        /**
         * изменение текста кнопки
         * @param {*} text 
         */
        #changeLabel(text){
            this.show.querySelector('[data-text]').innerText = text;
        }  
}
/**
 * сласс для работы мобильного фильтра
 */
class MobileFilter{

    constructor(classOpen, classList,classClose){
        this.buttonOpen = document.querySelector(`.${classOpen}`);
        this.categoryList = document.querySelector(`.${classList}`);
        this.buttonClose = document.querySelector(`.${classClose}`);

        if (!this.buttonOpen && !this.categoryList && !this.buttonClose){
            console.log('аргументы не верны');
            return;
        }
        this.#init();
    }

    #init(){
        this.#listOpen();
        this.#listClose();
    }

    #listOpen(){
        this.buttonOpen.addEventListener('click',(event)=>{
            event.preventDefault();
            this.categoryList.classList.add('active');
        })
    }
    #listClose(){
        this.buttonClose.addEventListener('click',()=>{
            this.categoryList.classList.remove('active');
        })
    }


}


/**
 * инициализация функций и классов
*/

document.addEventListener('DOMContentLoaded', () => {
    const modal = new Modal('[data-overlay]', '[data-review]');
    const text = new ReadMore('.review_inner_item p');
    checkStars();
    if(window.innerWidth < 501){
        const footerMenu = new FooterMenu('.footer_menu');
    }
    if(window.innerWidth > 576){
        const filter = new Filter('data-show');
    }else{
        const filter = new MobileFilter('blog_categories_all','blog_categories_mobile','blog_categories_close');
    }

})
