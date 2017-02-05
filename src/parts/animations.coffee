prefix = if document.createElement('div').style.animation? then '' else '-webkit-'
animations = "
@#{prefix}keyframes checkmarkAnimateSuccessTip {
    0%, 54% {
        width: 0;
        left: 0px;
        top: 3px
    }
    70% {
        width: 14px;
        left: -2px;
        top: 8px
    }
    84% {
        width: 5px;
        left: 5px;
        top: 10px
    }
    100% {
        width: 8px;
        left: 3px;
        top: 10px
    }
}

@#{prefix}keyframes checkmarkAnimateSuccessLong {
    0%, 65% {
        width: 0;
        right: 12px;
        top: 12px
    }
    84% {
        width: 14px;
        right: 0px;
        top: 7px
    }
    100% {
        width: 12px;
        right: 2px;
        top: 8px
    }
}

@#{prefix}keyframes checkmarkAnimateError {
    0%, 65% {
        #{prefix}transform: scale(0.4);
        opacity: 0
    }
    84% {
        #{prefix}transform: scale(1.15)
    }
    100% {
        #{prefix}transform: scale(1)
    }
}


@#{prefix}keyframes checkmarkRotatePlaceholder {
    0%, 5% {
        #{prefix}transform: rotate(-45deg)
    }
    12%, 100% {
        #{prefix}transform: rotate(-405deg)
    }
}

@#{prefix}keyframes fieldErrorShake {
    0%, 50% {
        #{prefix}transform: translateX(-10px)
    }
    25%, 75% {
        #{prefix}transform: translateX(10px)
    }
    100% {
        #{prefix}transform: translateX(0px)
    }
}
"



appendAnimationStyles = ()->
    styleElement = document.createElement('style')
    styleElement.innerHTML = animations
    document.body.appendChild(styleElement)
    
    appendAnimationStyles.appended = styleElement
















