CSS = import 'quickcss'
module.exports = ()->
    CSS.animation 'checkmarkAnimateSuccessTip',
        '0%, 54%':  {width:0, left:0, top:3}
        '70%':      {width:14, left:-2, top:8}
        '84%':      {width:5, left:5, top:10}
        '100%':     {width:8, left:3, top:10}


    CSS.animation 'checkmarkAnimateSuccessLong',
        '0%, 65%':  {width:0, right:12, top:12}
        '84%':      {width:14, right:0, top:7}
        '100%':     {width:12, right:2, top:8}


    CSS.animation 'checkmarkAnimateError',
        '0%, 65%':  transform: 'scale(0.4)', opacity: 0
        '84%':      transform: 'scale(1.15)'
        '100%':     transform: 'scale(1)'


    CSS.animation 'checkmarkRotatePlaceholder',
        '0%, 5%':   transform: 'rotate(-45deg)'
        '12%, 100%':transform: 'rotate(-405deg)'


    CSS.animation 'fieldErrorShake',
        '0%, 50%':  transform: 'translateX(-10px)'
        '25%, 75%': transform: 'translateX(10px)'
        '100%':     transform: 'translateX(0px)'

    module.exports = ()->

