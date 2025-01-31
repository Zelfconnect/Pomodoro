document.addEventListener('DOMContentLoaded', () => {
    // Load featured posts if we're on the homepage
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        loadFeaturedPosts();
    }
});

async function loadFeaturedPosts() {
    try {
        // In a real application, this would fetch from your posts directory
        // For now, we'll use dummy data
        const posts = [
            {
                title: 'First Blog Post',
                excerpt: 'This is a preview of the first blog post...',
                date: '2024-03-20',
                slug: 'first-post'
            },
            {
                title: 'Second Blog Post',
                excerpt: 'This is a preview of the second blog post...',
                date: '2024-03-19',
                slug: 'second-post'
            }
        ];

        const postsHTML = posts.map(post => `
            <article class="post-card">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <small>${post.date}</small>
                <a href="/blog/posts/${post.slug}.html">Read more</a>
            </article>
        `).join('');

        document.getElementById('posts-container').innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading posts:', error);
    }
} 