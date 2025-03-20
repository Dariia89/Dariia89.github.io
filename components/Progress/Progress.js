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
                            <input id="value" type="text" pattern="[0-9]*" class="controls__item__input" value="50" >
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
    barValue = 50;

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
        this.updateCircleProperties();
        this.setBarValue();

        let valueInput = this.shadowRoot.querySelector('#value');
        valueInput.addEventListener('change', (event) => this.setBarValue(event));
        valueInput.addEventListener('input', (event) => this.validateInput(event));

        let animateInput = this.shadowRoot.querySelector('#animate');
        animateInput.addEventListener('change', (event) => this.toggleCircleAnimation());

        const hideInput = this.shadowRoot.querySelector('#hide');
        hideInput.addEventListener('change', (event) => this.toggleCircleVisibility());
    }

    validateInput(event) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
    
    updateCircleProperties() {
        let circle = this.shadowRoot.querySelector('.svg__circle-bg');
        this.strokeLength = Math.ceil(circle.getTotalLength()) + 1;
        circle.style.setProperty('stroke-dasharray', this.strokeLength);

        this.updateStrokeDashOffset();
    }

    updateStrokeDashOffset() {
        let circle = this.shadowRoot.querySelector('.svg__circle-bar');
        circle.style.setProperty('stroke-dashoffset', this.dashOffsetValue);
    }

    get dashOffsetValue() {
        return (100 - this.barValue) * (this.strokeLength / 100);
    }

    setBarValue(event)  {
        let newValue;
        
        if (!event) {
            newValue = 50;
        } else if (event?.target.value) {
            newValue = parseInt(event.target.value);
            event.target.value = newValue;
        } else {
            return;
        }

        if (newValue > 100) {
            newValue = 100;
            event.target.value = newValue;
            console.error('Внимание! Значение value не может превышать 100.');
        } 
        
        this.barValue = newValue;
        this.updateStrokeDashOffset();
    }

    toggleCircleAnimation() {
        let circle = this.shadowRoot.querySelector('.svg__circle');
        let playState = circle.style.animationPlayState;

        if (!playState) {
            circle.classList.toggle('svg__circle_rotating');
            circle.style.setProperty('animation-play-state', 'running');
        } else if (playState == 'paused') {
            circle.style.setProperty('animation-play-state', 'running');
        } else if (playState == 'running') {
            circle.style.setProperty('animation-play-state', 'paused');
        }
    }

    toggleCircleVisibility() {
        this.shadowRoot.querySelector('.progress__circle__container').classList.toggle('progress__circle_hidden');
    }
    
    disconnectedCallback() {
        console.log('Элемент ProgressComponent был удален из документа.');
    }
}

export default Progress;