// Simple test script to verify the application is working
// Run this in the browser console after logging in

console.log('🧪 Testing SocialPulse Application...');

// Test 1: Check if user is logged in
const checkAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    console.log('✅ User is logged in:', user.username);
    return true;
  } else {
    console.log('❌ User is not logged in');
    return false;
  }
};

// Test 2: Check if backend is accessible
const checkBackend = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/posts');
    if (response.ok) {
      console.log('✅ Backend is accessible');
      return true;
    } else {
      console.log('❌ Backend returned:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend is not accessible:', error.message);
    return false;
  }
};

// Test 3: Check if posts are loading
const checkPosts = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/posts', {
      credentials: 'include'
    });
    if (response.ok) {
      const posts = await response.json();
      console.log('✅ Posts are loading:', posts.length, 'posts found');
      return true;
    } else {
      console.log('❌ Posts failed to load:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Posts check failed:', error.message);
    return false;
  }
};

// Test 4: Check if stories are loading
const checkStories = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/stories', {
      credentials: 'include'
    });
    if (response.ok) {
      const stories = await response.json();
      console.log('✅ Stories are loading:', stories.length, 'stories found');
      return true;
    } else {
      console.log('❌ Stories failed to load:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Stories check failed:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('\n🔍 Running tests...\n');
  
  const authOk = checkAuth();
  const backendOk = await checkBackend();
  const postsOk = await checkPosts();
  const storiesOk = await checkStories();
  
  console.log('\n📊 Test Results:');
  console.log('Authentication:', authOk ? '✅' : '❌');
  console.log('Backend:', backendOk ? '✅' : '❌');
  console.log('Posts:', postsOk ? '✅' : '❌');
  console.log('Stories:', storiesOk ? '✅' : '❌');
  
  if (authOk && backendOk && postsOk && storiesOk) {
    console.log('\n🎉 All tests passed! Your app is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the issues above.');
  }
};

// Run tests when script is loaded
runTests();

// Export for manual testing
window.testSocialPulse = runTests; 