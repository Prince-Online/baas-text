const fetchUrl = 'https://script.google.com/macros/s/AKfycbzglW9a3xCTAKrwEj0zd4QBhp6vAaAiWofxJ8O9kOxM6WTycjVyuEeIkh60VeAvPBy_vQ/exec'; // Replace with your deployed script URL

        async function fetchData() {
            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();
                const shuffledData = shuffleArray(data);
                displayData(shuffledData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                document.getElementById('loadingOverlay').style.display = 'none';
            }
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function displayData(data) {
            const container = document.getElementById('dataContainer');
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';

                const title = document.createElement('div');
                title.className = 'title-class';
                title.textContent = `${item.title}`;
                itemDiv.appendChild(title);

                const image = document.createElement('img');
                image.className = 'image-another-class';
                image.src = item.imageUrl;
                image.alt = item.title;
                itemDiv.appendChild(image);

                const news = document.createElement('div');
                news.className = 'news-class';
                news.textContent = `News: ${item.news}`;
                itemDiv.appendChild(news);

                const username = document.createElement('div');
                username.className = 'username-class';
                username.textContent = `Username: ${item.username}`;
                itemDiv.appendChild(username);

                const saveButton = document.createElement('button');
                saveButton.className = 'save-button';
                const icon = document.createElement('i');
                icon.className = 'fa-regular fa-bookmark';
                saveButton.appendChild(icon);
                saveButton.appendChild(document.createTextNode(''));
                saveButton.onclick = () => savePost(item, icon);
                itemDiv.appendChild(saveButton);

                container.appendChild(itemDiv);
            });

            // Restore saved posts icon color
            const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
            savedPosts.forEach(savedPost => {
                const savedPostElements = [...document.querySelectorAll('.item')].filter(item =>
                    item.querySelector('.title-class').textContent.includes(savedPost.title) &&
                    item.querySelector('.username-class').textContent.includes(savedPost.username)
                );
                savedPostElements.forEach(element => {
                    const icon = element.querySelector('.fa-bookmark');
                    icon.classList.add('saved-icon');
                });
            });
        }

        function savePost(post, icon) {
            let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
            // Check if the post is already saved
            const isAlreadySaved = savedPosts.some(savedPost => savedPost.title === post.title && savedPost.username === post.username);
            if (isAlreadySaved) {
                showAlert('This post is already saved!');
            } else {
                savedPosts.push(post);
                localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
                icon.classList.add('saved-icon'); // Change icon color
                showAlert('Yopsh! Your post has been saved.');
            }
        }

        function showAlert(message) {
            document.getElementById('alertMessage').textContent = message;
            document.getElementById('customAlert').style.display = 'block';
        }

        function closeAlert() {
            document.getElementById('customAlert').style.display = 'none';
        }

        fetchData();