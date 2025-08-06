// Comprehensive test script for SocialPulse features
// Run this in the browser console after logging in

console.log('🧪 Testing SocialPulse Features...');

// Test all features
const testFeatures = async () => {
  console.log('\n🔍 Running comprehensive tests...\n');
  
  const results = {
    auth: false,
    posts: false,
    stories: false,
    friends: false,
    messages: false,
    notifications: false,
    search: false
  };

  // Test 1: Authentication
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      console.log('✅ Authentication: User is logged in as', user.username);
      results.auth = true;
    } else {
      console.log('❌ Authentication: No user found');
    }
  } catch (error) {
    console.log('❌ Authentication: Error checking user');
  }

  // Test 2: Posts
  try {
    const response = await fetch('http://localhost:8800/api/posts', {
      credentials: 'include'
    });
    if (response.ok) {
      const posts = await response.json();
      console.log('✅ Posts: Loading successfully,', posts.length, 'posts found');
      results.posts = true;
    } else {
      console.log('❌ Posts: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Posts: Error:', error.message);
  }

  // Test 3: Stories
  try {
    const response = await fetch('http://localhost:8800/api/stories', {
      credentials: 'include'
    });
    if (response.ok) {
      const stories = await response.json();
      console.log('✅ Stories: Loading successfully,', stories.length, 'stories found');
      results.stories = true;
    } else {
      console.log('❌ Stories: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Stories: Error:', error.message);
  }

  // Test 4: Friends/Relationships
  try {
    const response = await fetch('http://localhost:8800/api/relationships/friends', {
      credentials: 'include'
    });
    if (response.ok) {
      const friends = await response.json();
      console.log('✅ Friends: Loading successfully,', friends.length, 'friends found');
      results.friends = true;
    } else {
      console.log('❌ Friends: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Friends: Error:', error.message);
  }

  // Test 5: Messages
  try {
    const response = await fetch('http://localhost:8800/api/messages/conversations', {
      credentials: 'include'
    });
    if (response.ok) {
      const conversations = await response.json();
      console.log('✅ Messages: Loading successfully,', conversations.length, 'conversations found');
      results.messages = true;
    } else {
      console.log('❌ Messages: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Messages: Error:', error.message);
  }

  // Test 6: Notifications
  try {
    const response = await fetch('http://localhost:8800/api/notifications', {
      credentials: 'include'
    });
    if (response.ok) {
      const notifications = await response.json();
      console.log('✅ Notifications: Loading successfully,', notifications.length, 'notifications found');
      results.notifications = true;
    } else {
      console.log('❌ Notifications: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Notifications: Error:', error.message);
  }

  // Test 7: Search
  try {
    const response = await fetch('http://localhost:8800/api/users/search?q=test', {
      credentials: 'include'
    });
    if (response.ok) {
      const users = await response.json();
      console.log('✅ Search: Working successfully,', users.length, 'users found');
      results.search = true;
    } else {
      console.log('❌ Search: Failed to load, status:', response.status);
    }
  } catch (error) {
    console.log('❌ Search: Error:', error.message);
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('Authentication:', results.auth ? '✅' : '❌');
  console.log('Posts:', results.posts ? '✅' : '❌');
  console.log('Stories:', results.stories ? '✅' : '❌');
  console.log('Friends:', results.friends ? '✅' : '❌');
  console.log('Messages:', results.messages ? '✅' : '❌');
  console.log('Notifications:', results.notifications ? '✅' : '❌');
  console.log('Search:', results.search ? '✅' : '❌');

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All features are working perfectly! Your Instagram-like app is ready!');
  } else {
    console.log('⚠️ Some features need attention. Check the issues above.');
  }

  return results;
};

// Test specific features
const testPostCreation = async () => {
  console.log('\n📝 Testing post creation...');
  try {
    const response = await fetch('http://localhost:8800/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        desc: 'Test post from console',
        img: ''
      })
    });
    
    if (response.ok) {
      console.log('✅ Post creation: Working');
      return true;
    } else {
      console.log('❌ Post creation: Failed, status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Post creation: Error:', error.message);
    return false;
  }
};

const testStoryCreation = async () => {
  console.log('\n📸 Testing story creation...');
  try {
    const response = await fetch('http://localhost:8800/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        img: 'test-story.jpg',
        caption: 'Test story from console'
      })
    });
    
    if (response.ok) {
      console.log('✅ Story creation: Working');
      return true;
    } else {
      console.log('❌ Story creation: Failed, status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Story creation: Error:', error.message);
    return false;
  }
};

// Run all tests
testFeatures();

// Export functions for manual testing
window.testSocialPulseFeatures = testFeatures;
window.testPostCreation = testPostCreation;
window.testStoryCreation = testStoryCreation; 