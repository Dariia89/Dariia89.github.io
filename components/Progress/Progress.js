const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="./components/Progress/Progress.css" />
    <div class="progress">
        <div class="progress__title">Progress</div>
        <div class="progress__container">
            <div class="progress__circle__container">
                <div class="progress__circle">
                    <svg class="svg__circle" width="120" height="120">
                        <circle class="svg__circle-bg" r="46" cx="60" cy="60" fill="transparent" stroke="#dae6ec" stroke-width="10" />
                        <circle class="svg__circle-bar" r="46" cx="60" cy="60" fill="transparent" stroke="#005eff" stroke-width="10" />
                    </svg>
                </div>
            </div>
            <div class="progress__controls__container">
                <div class="progress__controls">
                    <div class="progress__controls__item">
                        <label class="controls__item">
                            <input id="value" type="number" class="controls__item__input" value="50" min="0" max="100" >
                        </label>
                        <div class="controls__item__text">
                            Value
                        </div>
                    </div>
                    <div class="progress__controls__item">
                        <label class="switch controls__item" onmousedown="return false">
                            <input id="animate" type="checkbox" class="switch__input">
                            <span class="switch__slider"></span>
                        </label>
                        <div class="controls__item__text">
                            Animate
                        </div>
                    </div>
                    <div class="progress__controls__item">
                        <label class="switch controls__item" onmousedown="return false">
                            <input id="hide" type="checkbox" class="switch__input">
                            <span class="switch__slider"></span>
                        </label>
                        <div class="controls__item__text">
                            Hide
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

class Progress extends HTMLElement {
    strokeLength = 0;
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.append(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
        console.log('Элемент ProgressComponent был добавлен в документ.');
    }

    render() {
        this.setStrokeLength();
        this.setBarValue();

        let valueInput = this.shadowRoot.querySelector('#value');
        valueInput.addEventListener('change', (event) => this.setBarValue(event));
        
        let animateInput = this.shadowRoot.querySelector('#animate');
        animateInput.addEventListener('change', (event) => this.toggleCircleAnimation());

        const hideInput = this.shadowRoot.querySelector('#hide');
        hideInput.addEventListener('change', (event) => this.toggleCircleVisibility());
    }
    
    setStrokeLength() {
        let circle = this.shadowRoot.querySelector('.svg__circle-bg');
        this.strokeLength = Math.ceil(circle.getTotalLength());
        circle.style.setProperty('--strokeLength', this.strokeLength);
    }

    setBarValue(event)  {
        let newValue = event?.target.value || 50;

        if (newValue > 100) {
            newValue = 100;
            event.target.value = newValue;
            console.error('Внимание! Значение value не может превышать 100.');
        } else if (newValue < 0) {
            newValue = 0;
            event.target.value = newValue;
            console.error('Внимание! Значение value не может быть отрицательным числом.');
        }
        this.shadowRoot.querySelector('.svg__circle-bar').style.setProperty('--bar-value', newValue);
    }

    toggleCircleAnimation() {
        this.shadowRoot.querySelector('.svg__circle').classList.toggle('svg__circle_rotating');
    }

    toggleCircleVisibility() {
        this.shadowRoot.querySelector('.progress__circle__container').classList.toggle('progress__circle_hidden');
    }
    
    disconnectedCallback() {
        console.log('Элемент ProgressComponent был удален из документа.');
    }
    
    //   static get observedAttributes() {
    //     // 
    //   }
    
    //   attributeChangedCallback(name, oldValue, newValue) {
    //     // 
    //   }

}

export default Progress;