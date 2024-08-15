document.getElementById('newsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var title = document.getElementById('title').value;
    var imageInput = document.getElementById('image').files[0];
    var loadingElement = document.getElementById('loading');
    var dotsElement = document.getElementById('dots');
    var username = localStorage.getItem('YopshLoc_Username');

    if (!imageInput) {
        showAlert('Please attach an image.');
        return;
    }

    loadingElement.style.display = 'block';

    var dotInterval = setInterval(function() {
        dotsElement.textContent = dotsElement.textContent.length < 3 ? dotsElement.textContent + '.' : '';
    }, 500);

    var formData = new FormData();
    formData.append('key', '656216fe38dc35e75f949dbd93bdcd20'); // Your imgbb API key
    formData.append('image', imageInput);

    fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            var imageUrl = data.data.url;

            fetch('https://script.google.com/macros/s/AKfycbzqMVuR63ai-cnGQQIJvL-ee3WE8iLUU5mkswH0hGN-P4ctkhfAX3uer2Ib0sXvZOoRLQ/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'submitNews',
                    timestamp: new Date().toISOString(),
                    title: title,
                    imageUrl: imageUrl,
                    username: username
                })
            })
            .then(response => response.json())
            .then(data => {
                clearInterval(dotInterval);
                loadingElement.style.display = 'none';

                if (data.success) {
                    showAlert('News posted successfully!');
                    document.getElementById('newsForm').reset();
                } else {
                    showAlert('Failed to post news.');
                }
            })
            .catch(error => {
                clearInterval(dotInterval);
                loadingElement.style.display = 'none';
                showAlert('Error: ' + error);
            });
        } else {
            clearInterval(dotInterval);
            loadingElement.style.display = 'none';
            showAlert('Failed to upload image.');
        }
    })
    .catch(error => {
        clearInterval(dotInterval);
        loadingElement.style.display = 'none';
        showAlert('Error: ' + error);
    });
});

function showAlert(message) {
    document.getElementById('alertMessage').textContent = `Yopsh! Page Says That: ${message}`;
    var alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'block';
    document.getElementById('closeAlertBtn').onclick = function() {
        alertBox.style.display = 'none';
    };
}