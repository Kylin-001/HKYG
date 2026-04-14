## Plan to Complete Book Search Functionality

### Current Status Analysis
1. **Version**: Mini-program is at v1.4.0
2. **Campus Library Features**: 
   - Seat reservation is implemented
   - Book search page is created but has issues
   - Missing book detail page
   - Missing searchBooks API function
   - Oversized WXSS file (103KB)

### Implementation Plan

#### 1. Fix API and Navigation Issues
- **Add searchBooks function** to `/api/campus.js`
- **Add book-detail page** to app.json campus subpackage

#### 2. Create Book Detail Page
- Create `pages/campus/library/book-detail.js` for book detail logic
- Create `pages/campus/library/book-detail.wxml` for UI
- Create `pages/campus/library/book-detail.wxss` for styling

#### 3. Fix Oversized WXSS File
- Replace the oversized `book-search.wxss` with proper styling

#### 4. Test and Verify
- Ensure search functionality works correctly
- Verify navigation to book detail page works
- Ensure responsive design for multi-end compatibility

### Files to Modify/Create
1. **Modify**: `/api/campus.js` - Add searchBooks function
2. **Modify**: `/app.json` - Add book-detail page to campus subpackage
3. **Create**: `/pages/campus/library/book-detail.js` - Book detail logic
4. **Create**: `/pages/campus/library/book-detail.wxml` - Book detail UI
5. **Create**: `/pages/campus/library/book-detail.wxss` - Book detail styling
6. **Fix**: `/pages/campus/library/book-search.wxss` - Replace oversized file

### Expected Outcomes
- Complete book search functionality with search history and hot search
- Book detail page with comprehensive book information
- Proper navigation between search results and detail page
- Optimized styling with reasonable file size
- Compatible