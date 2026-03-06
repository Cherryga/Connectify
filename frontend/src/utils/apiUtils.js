import axios from 'axios';

// ===== FREE APIs (No Key Required) =====

export const fetchRandomUsers = async (count = 10) => {
  const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
  return response.data.results.map((user, i) => ({
    id: `user_${i}`,
    name: `${user.name.first} ${user.name.last}`,
    username: user.login.username,
    profilePic: user.picture.large,
    followers: `${Math.floor(Math.random() * 500)}K`,
    verified: Math.random() > 0.7,
    online: Math.random() > 0.5,
  }));
};

export const fetchRandomQuotes = async (count = 10) => {
  const promises = Array(count).fill().map(() => 
    axios.get('https://api.quotable.io/random')
  );
  const responses = await Promise.all(promises);
  return responses.map(res => ({
    content: res.data.content,
    author: res.data.author
  }));
};

export const fetchPicsumImages = async (count = 10) => {
  return Array(count).fill().map((_, i) => 
    `https://picsum.photos/800/600?random=${Date.now() + i}`
  );
};

export const generateDynamicFeed = async (count = 10) => {
  const [quotes, users, images] = await Promise.all([
    fetchRandomQuotes(count),
    fetchRandomUsers(count),
    fetchPicsumImages(count)
  ]);

  return quotes.map((quote, i) => ({
    id: `post_${Date.now()}_${i}`,
    desc: `"${quote.content}" - ${quote.author}`,
    img: images[i],
    userId: users[i].id,
    name: users[i].name,
    profilePic: users[i].profilePic,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
};