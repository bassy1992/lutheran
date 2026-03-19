# Home Page Backend Integration Test

This document provides instructions for manually testing the Home page backend integration.

## Prerequisites

1. Backend server running on `http://localhost:8000`
2. Frontend dev server running on `http://localhost:3000`
3. Database populated with test data

## Test Data Setup

Before testing, ensure the backend database has the following data:

### 1. Church Info
- At least one ChurchInfo record with:
  - name
  - description
  - contact information

### 2. Service Times
- At least 3 active ServiceTime records with:
  - day (e.g., Sunday, Wednesday, Friday)
  - time
  - service_type
  - description
  - is_active = True

### 3. Core Values
- At least 4 CoreValue records with:
  - title
  - description
  - icon (BookOpen, Heart, Users, Zap)
  - order

### 4. Featured Events
- At least 3 Event records with:
  - title
  - description
  - event_type
  - start_date
  - location
  - is_featured = True
  - is_published = True

## Test Cases

### Test Case 1: Service Times Display
**Steps:**
1. Navigate to `http://localhost:3000`
2. Scroll to the "Service Times Quick Info" section

**Expected Results:**
- ✅ Service times load from backend API
- ✅ Skeleton loaders display while loading
- ✅ Active service times are displayed in cards
- ✅ Each card shows: day, time, and description
- ✅ Cards have hover effects

**Error Scenario:**
- If API fails, error message displays with "Try Again" button
- Clicking "Try Again" retries the API call

### Test Case 2: Core Values Display
**Steps:**
1. Navigate to `http://localhost:3000`
2. Scroll to the "Core Values Section"

**Expected Results:**
- ✅ Core values load from backend API
- ✅ Skeleton loaders display while loading
- ✅ Church description displays from ChurchInfo
- ✅ Core values display with icons, titles, and descriptions
- ✅ Values are ordered correctly

**Error Scenario:**
- If API fails, error message displays with "Try Again" button
- Clicking "Try Again" retries the API call

### Test Case 3: Featured Events Display
**Steps:**
1. Navigate to `http://localhost:3000`
2. Scroll to the "What's Happening" section

**Expected Results:**
- ✅ Featured events load from backend API
- ✅ Skeleton loaders display while loading
- ✅ Up to 3 featured events are displayed
- ✅ Each event shows: title, event_type, date, location
- ✅ Event dates are formatted correctly
- ✅ "LEARN MORE" links to event detail page

**Error Scenario:**
- If API fails, error message displays with "Try Again" button
- Clicking "Try Again" retries the API call
- If no featured events exist, displays "No featured events at this time"

### Test Case 4: Loading States
**Steps:**
1. Open browser DevTools Network tab
2. Throttle network to "Slow 3G"
3. Navigate to `http://localhost:3000`

**Expected Results:**
- ✅ Skeleton loaders display for all sections
- ✅ Loaders are visually appealing with pulse animation
- ✅ Content replaces loaders when data loads
- ✅ No layout shift when content loads

### Test Case 5: Error Handling
**Steps:**
1. Stop the backend server
2. Navigate to `http://localhost:3000`

**Expected Results:**
- ✅ Error messages display for each failed section
- ✅ Error messages are user-friendly
- ✅ "Try Again" buttons are present
- ✅ Clicking "Try Again" attempts to refetch data
- ✅ Page remains functional despite errors

### Test Case 6: Empty Data Handling
**Steps:**
1. Clear all service times from database
2. Navigate to `http://localhost:3000`

**Expected Results:**
- ✅ "No service times available" message displays
- ✅ No errors in console
- ✅ Other sections still load correctly

## API Endpoints Tested

- `GET /api/church/info/` - Church information
- `GET /api/church/service-times/` - Service times
- `GET /api/church/core-values/` - Core values
- `GET /api/events/?is_featured=true` - Featured events

## Success Criteria

All test cases pass with:
- ✅ Data loads from backend APIs
- ✅ Loading states display correctly
- ✅ Error handling works as expected
- ✅ No console errors
- ✅ Responsive design maintained
- ✅ Performance is acceptable

## Notes

- The Home page no longer uses hardcoded data from `constants.tsx`
- All data is fetched from the backend API
- The page gracefully handles loading, error, and empty states
- Retry functionality allows users to recover from temporary failures
