# 🚀 SocialPulse Startup Guide

## Quick Setup Instructions

### 1. Database Setup
```bash
# Open MySQL and run:
mysql -u your_username -p

# Then run these commands:
source mydevify_social.sql
source setup_database.sql
```

### 2. Backend Setup
```bash
cd API
npm install
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Login Credentials
Use these test accounts to log in:

**Account 1:**
- Username: `testuser`
- Password: `password`

**Account 2:**
- Username: `john_doe`
- Password: `password`

**Account 3:**
- Username: `jane_smith`
- Password: `password`

## 🔧 Troubleshooting

### If you get 401 Unauthorized errors:

1. **Make sure you're logged in:**
   - Go to `http://localhost:5173/login`
   - Login with one of the test accounts above

2. **Check if backend is running:**
   - Backend should be on `http://localhost:8800`
   - Check console for any errors

3. **Check database connection:**
   - Make sure MySQL is running
   - Verify database `mydevify_social` exists
   - Check if tables are created properly

### If posts/stories don't appear:

1. **Check if you're logged in**
2. **Try refreshing the page**
3. **Check browser console for errors**
4. **Verify database has test data**

## 🎯 Features to Test

### ✅ Post Creation
1. Go to home page
2. Write something in the text area
3. Click "Share Post"
4. Should see your post appear

### ✅ Story Creation
1. Click "Story" button in share box
2. Upload an image
3. Add caption
4. Click "Share Story"
5. Should see story in stories section

### ✅ Follow Users
1. Go to Friends page
2. Click "Follow" on suggested users
3. Should see them in your friends list

### ✅ Like/Comment
1. Click heart icon on posts
2. Click comment icon to add comments
3. Should see likes/comments update

### ✅ Search Users
1. Use search bar in navbar
2. Type a username
3. Click on results to visit profiles

## 🐛 Common Issues & Solutions

### Issue: "Something went wrong" when posting
**Solution:** Make sure you're logged in and backend is running

### Issue: No posts showing
**Solution:** Check if you're logged in and database has data

### Issue: Can't upload images
**Solution:** Make sure the uploads folder exists and has write permissions

### Issue: Stories not loading
**Solution:** Check if stories table exists and has data

## 📞 Need Help?

1. Check browser console for errors
2. Check backend console for errors
3. Verify database tables exist
4. Make sure you're logged in

## 🎉 Success Indicators

When everything is working:
- ✅ You can log in without errors
- ✅ Posts appear on home page
- ✅ Stories show in stories section
- ✅ You can create new posts/stories
- ✅ Search works
- ✅ Rightbar shows suggested users
- ✅ No 401 errors in console

Your Instagram-like social media platform should now be fully functional! 🚀 