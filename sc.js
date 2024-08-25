document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    window.location.href = 'mainpage.html'; 
});


document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    window.location.href = 'mainpage.html'; 
});

const signinBtnLink = document.querySelector('.signinBtn-Link');
        const signupBtnLink = document.querySelector('.signupBtn-Link');
        const wrapper = document.querySelector('.wrapper');
        
        signupBtnLink.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.add('active');
        });
        
        signinBtnLink.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.classList.remove('active');
        });
       

