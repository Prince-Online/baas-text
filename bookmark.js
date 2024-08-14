function loadSavedPosts() {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
      const container = document.getElementById('savedContainer');

      if (savedPosts.length === 0) {
        container.innerHTML = '<p>No saved posts.</p>';
        return;
      }

      container.innerHTML = ''; // Clear any existing content

      savedPosts.forEach((post, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        const username = document.createElement('div');
        username.textContent = `Username: ${post.username}`;
        itemDiv.appendChild(username);

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = `Title: ${post.title}`;
        itemDiv.appendChild(title);

        const news = document.createElement('div');
        news.textContent = `News: ${post.news}`;
        itemDiv.appendChild(news);

        const image = document.createElement('img');
        image.className = 'image-url';
        image.src = post.imageUrl;
        image.alt = post.title;
        itemDiv.appendChild(image);

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removePost(index);
        itemDiv.appendChild(removeButton);

        container.appendChild(itemDiv);
      });
    }

    function removePost(index) {
      let savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
      savedPosts.splice(index, 1); // Remove the post at the given index
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
      loadSavedPosts(); // Reload the saved posts
    }

    loadSavedPosts();