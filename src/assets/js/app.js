/**
 * описание класса модалки
 */
class Modal {
    constructor(modal, button) {
        this.modal = modal;
        this.button = button;
        this.init();
    }

    init(){
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

    closeModal(instanse, modalOverlay = document.querySelector(this.modal)){
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

    propogation(modalOverlay){
        const modal = modalOverlay.children;
        modal[0].addEventListener('click', (event)=>{
            event.stopPropagation();
        })
    }

    scrollPadding(){
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

/**
 * инициализация функция
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = new Modal('[data-overlay]', '[data-review]');
    checkStars();
})