/**
 * 1. No notification - CHECK INTERNET CONNECTION 
 * 
 * 2. Set offline - NOTIFICATION + TIMER + RECONNECT
 * 
 * 3. Set online - NOTIFICATION SUCCESSFUL CONNECTION
 */


const popup = document.querySelector( ".popup" );
const wifiIcon = popup.querySelector( ".wifi-icon" );
const icon = popup.querySelector( ".icon" );
const popupTitle = popup.querySelector( ".title" );
const popupDesc = popup.querySelector( ".desc" );
const reconnectBtn = popup.querySelector( ".reconnect" );

let isOnline = true; 
let intervalTimer;
let timer;

const checkConnection = async () => {
    try {
        const response = await fetch( "https://jsonplaceholder.typicode.com/posts" );
        isOnline = response.status >= 200 && response.status < 300;

        // Show the popup only the first time
        if ( popup.getAttribute( 'first-show' ) !== 'true' ) {
            wifiIcon.classList.add( 'online' );
            popup.classList.add( "show" );
            popup.classList.add( "online-alert" );
            popup.setAttribute( 'first-show', true );
        };
        
    } catch ( error ) {
        isOnline = false;
    }

    // Reset reconnect timer
    clearInterval( intervalTimer );

    // Populate popup based on network status
    handlePopup( isOnline );
};

const handlePopup = ( status ) => {
    if ( status ) {
        popup.classList.remove( 'offline-alert' );
        popup.classList.add( 'online-alert' );
        wifiIcon.classList.remove( 'offline' );
        wifiIcon.classList.add( 'online' );

        icon.className = "uil uil-wifi";
        popupDesc.innerHTML = "Your device is now successfully connected to the internet.";
        popupTitle.innerText = "Restored Connection";
        reconnectBtn.style.display = 'none';

        return setTimeout( () => popup.classList.remove( "show" ), 2000 );
    };

    wifiIcon.classList.remove( 'online' );
    wifiIcon.classList.add( 'offline' );
    icon.className = "uil uil-wifi-slash";
    popupDesc.innerHTML = "Your network is unavailable. We will attempt to reconnect you in <strong>10</strong> seconds.";
    popupTitle.innerText = "Lost Connection";
    popup.className = "popup show offline-alert";
    reconnectBtn.style.display = 'block';
    
    timer = 10;

    intervalTimer = setInterval( () => {
        timer--;
        if ( timer === 0 ) checkConnection();
        popup.querySelector( "strong" ).innerText = timer;
    }, 1000 );
};

setInterval( () => {
    if ( isOnline ) checkConnection();
}, 3000 );

reconnectBtn.addEventListener( "click", checkConnection );        
