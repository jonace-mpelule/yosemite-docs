import './hashCode.js';
import hashCode from './hashCode.js';

document.addEventListener('DOMContentLoaded', () => {



    document.querySelectorAll('.endpoint').forEach(endpoint => {
        endpoint.querySelector('.accordion-toggle').addEventListener('click', () => {
            const route = endpoint.querySelector('.route').innerHTML
            const content = endpoint.querySelector(`.${hashCode(route)}`);
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
            const arrowUp = endpoint.querySelector('.arrow-up');
            arrowUp.style.transitionDuration = "150ms";
            arrowUp.style.transform = content.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';

        })

    })


  
});