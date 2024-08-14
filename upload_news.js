const scriptUrl = 'https://script.google.com/macros/s/AKfycbxVoD5OAeD4E0SzJSbri5Ema6AuUpg7ussg_69_X-LQLBOLNvoQc6oBlA_S8kqoIT0IfA/exec';
    const imgbbApiKey = '656216fe38dc35e75f949dbd93bdcd20';
    
    document.getElementById('newsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitNews();
    });

    function submitNews() {
        const title = document.getElementById('title').value;
        const news = document.getElementById('news').value;
        const imageFile = document.getElementById('image').files[0];
        const username = localStorage.getItem('YopshLoc_Username');
        
        if (!username) {
            showMessage('Please log in to submit news.', 'error');
            return;
        }

        showLoading(true);
        
        uploadImage(imageFile)
            .then(imageUrl => {
                return submitToSheet(username, title, news, imageUrl);
            })
            .then(() => {
                showLoading(false);
                showMessage('News submitted successfully!', 'success');
                document.getElementById('newsForm').reset();
            })
            .catch(error => {
                showLoading(false);
                showMessage('Error: ' + error.message, 'error');
            });
    }

    function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        return fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.url) {
                return result.data.url;
            } else {
                throw new Error('Image upload failed');
            }
        });
    }

    function submitToSheet(username, title, news, imageUrl) {
        const formData = new FormData();
        formData.append('action', 'submitNews');
        formData.append('username', username);
        formData.append('title', title);
        formData.append('news', news);
        formData.append('imageUrl', imageUrl);
        return fetch(scriptUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                throw new Error(result.error || 'Submission to sheet failed');
            }
        });
    }

    function showMessage(message, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.className = type;
    }

    function showLoading(show) {
        const loadingElement = document.getElementById('loading');
        const dotsElement = document.getElementById('dots');
        if (show) {
            loadingElement.style.display = 'block';
            animateDots(dotsElement);
        } else {
            loadingElement.style.display = 'none';
            dotsElement.textContent = '';
        }
    }

    function animateDots(element) {
        let dots = 0;
        const intervalId = setInterval(() => {
            dots = (dots + 1) % 4;
            element.textContent = '.'.repeat(dots);
        }, 300);

        // Store the interval ID on the element to clear it later
        element.dataset.intervalId = intervalId;
    }