# 🧪 Maximally Hack - Complete Testing Guide

## Quick Start

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:5000`

3. **Sign up/Login** using:
   - Email/Password registration
   - Google OAuth (recommended for quick testing)

4. **Switch user roles** using the role switcher in the navbar dropdown (🎭 Test Mode)

---

## 🎭 Testing by User Role

### 👨‍💻 PARTICIPANT Testing

#### **Basic Participant Flow**
1. **Sign up and set role to Participant**
   - Use navbar role switcher: Click profile → 👨‍💻 button
   - Your badge should show "👨‍💻 Participant"

2. **Explore Events**
   - Visit `/explore` or click "Explore Hackathons" in nav
   - Filter events by status, format, prize
   - Click on event cards to view details

3. **Team Management**
   - Go to `/teams` (Teams nav item)
   - **Create a Team**: Click "Create Team" → Fill form → Submit
     - Test: Name, description, skills, max team size
   - **Browse Teams**: Click "Find Teams"
   - **Team Matching**: Try `/teams/match` for AI-powered matching
     - Swipe right (❤️) to show interest
     - Swipe left (❌) to pass
   - **View Invitations**: Go to `/teams/invites`
     - Accept/decline team invitations
   - **Manage Requests**: Visit `/teams/requests`
     - View incoming requests to join your teams
     - Track your applications to other teams

4. **Looking for Group (LFG)**
   - Visit `/teams/lfg`
   - Create individual LFG posts
   - Browse other participants and teams looking for members

5. **Project Submission**
   - Go to `/projects/create`
   - Fill project details:
     - Title, description, demo URL, GitHub
     - Select team, add tags
   - Save as draft or submit

6. **Dashboard Usage**
   - Visit `/dashboard`
   - View your teams, projects, statistics
   - Track participation history

#### **Participant Test Checklist**
- [ ] Can create and join teams successfully
- [ ] Team matching system works (no errors on swipe)
- [ ] Can create LFG posts and browse others
- [ ] Project creation/editing works without crashes
- [ ] Dashboard shows correct team and project data
- [ ] All navigation links work (no 404s)

---

### 🏢 ORGANIZER Testing

#### **Basic Organizer Flow**
1. **Switch to Organizer Role**
   - Use navbar role switcher: Click profile → 🏢 button
   - Badge should show "🏢 Organizer"

2. **Event Creation**
   - Visit `/organize` or `/organizer/events/new`
   - **Complete Event Creation Wizard**:
     - **Step 1**: Basic info (title, description, dates)
     - **Step 2**: Location and format
     - **Step 3**: Tracks and categories
     - **Step 4**: Prizes and rewards
     - **Step 5**: Rules and timeline
   - **Preview Event**: Use preview button
   - **Save Draft**: Test draft saving
   - **Publish Event**: Complete publication

3. **Event Management**
   - Go to `/organizer` (Organizer Dashboard)
   - View created events
   - **Edit Events**: Click on events → Edit
   - **Manage Content**: Edit descriptions, rules, FAQs
   - **Judge Management**: Assign judges to events

4. **Team and Participant Oversight**
   - View registered participants
   - Monitor team formation
   - Review submissions

5. **Partnership Requests**
   - Visit `/organizer/partnership`
   - Submit partnership requests

#### **Organizer Test Checklist**
- [ ] Event creation wizard completes without errors
- [ ] Can save drafts and publish events
- [ ] Event preview works correctly
- [ ] Event editing maintains data integrity
- [ ] Judge assignment interface functions
- [ ] Partnership page loads properly
- [ ] Dashboard shows event analytics

---

### ⚖️ JUDGE Testing

#### **Basic Judge Flow**
1. **Switch to Judge Role**
   - Use navbar role switcher: Click profile → ⚖️ button
   - Badge should show "⚖️ Judge"

2. **Judge Dashboard**
   - Visit `/judge` or `/judge/dashboard`
   - View assigned events and submissions
   - Track judging progress

3. **Submission Review**
   - Browse event submissions
   - Open project details
   - Test all external links (demo, GitHub, slides)

4. **Scoring System**
   - Create scorecards for submissions
   - Test multi-criteria scoring:
     - Innovation/Originality
     - Technical execution
     - Design/UX
     - Impact/Usefulness
   - Save draft scores
   - Submit final scores

5. **Judge Profile**
   - Update judge bio and expertise
   - Manage availability status

#### **Judge Test Checklist**
- [ ] Judge dashboard loads with correct data
- [ ] Can view and navigate between assigned submissions
- [ ] Scoring interface works (can input and save scores)
- [ ] Can provide written feedback
- [ ] Progress tracking updates correctly
- [ ] Judge profile editing works

---

## 🔧 Technical Testing Scenarios

### **Cross-Role Integration Tests**

#### **Complete Hackathon Lifecycle**
1. **Organizer**: Create event "Test Hackathon 2024"
2. **Participant**: Register and create team
3. **Participant**: Submit project
4. **Judge**: Review and score submission
5. **All Roles**: Verify data consistency across dashboards

#### **Team Formation Flow**
1. **Participant A**: Creates team "AI Innovators"
2. **Participant B**: Finds team via search/matching
3. **Participant B**: Applies to join team
4. **Participant A**: Accepts application via `/teams/requests`
5. **Both**: Verify team membership in `/teams`

#### **Project Submission Pipeline**
1. **Team**: Create project via `/projects/create`
2. **Team**: Add all required information
3. **Organizer**: Verify submission appears in event dashboard
4. **Judge**: Confirm project available for judging

### **Error Handling Tests**

#### **Authentication Edge Cases**
- [ ] Test unauthenticated access to protected routes
- [ ] Role-based access control (participant can't access organizer pages)
- [ ] Session persistence across browser refreshes
- [ ] Logout functionality from all pages

#### **Data Validation**
- [ ] Form validation on all input fields
- [ ] URL validation in project submissions
- [ ] Date validation in event creation
- [ ] File upload limits and formats

#### **Network and Performance**
- [ ] Offline behavior (show appropriate messages)
- [ ] Loading states during API calls
- [ ] Error messages for failed operations
- [ ] React Query cache invalidation

---

## 🚀 Advanced Testing Scenarios

### **Multi-User Collaboration**
1. **Team Collaboration**: Multiple browsers/users in same team
2. **Judge Panel**: Multiple judges scoring same project
3. **Live Event**: Real-time registration during active hackathon

### **Data Persistence Tests**
1. **Draft Recovery**: Leave forms half-filled, return later
2. **Profile Updates**: Change user information, verify across app
3. **Team Membership**: Join/leave teams, check consistency

### **Mobile Responsiveness**
1. **Responsive Design**: Test all pages on mobile viewport
2. **Touch Interactions**: Swipe gestures in team matching
3. **Mobile Navigation**: Hamburger menu and mobile UX

---

## 🐛 Common Issues & Solutions

### **Known Issues to Watch For**
1. **UUID Error**: Ensure eventId is properly set when creating teams
2. **React Hook Errors**: All hooks are called before conditional returns
3. **Navigation 404s**: All routes are properly defined in App.tsx
4. **API Inconsistency**: Check that imports use correct API (lib/api vs lib/supabaseApi)

### **Troubleshooting Steps**
1. **Clear browser cache** if seeing stale data
2. **Check browser console** for JavaScript errors
3. **Verify network tab** for failed API calls
4. **Test in incognito mode** to rule out extension conflicts

### **Performance Benchmarks**
- [ ] Page load times < 2 seconds
- [ ] Form submissions < 1 second response
- [ ] Image loading optimized
- [ ] No memory leaks during navigation

---

## 📊 Test Results Template

### **Testing Session Report**
**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________  

#### **Participant Features** ✅/❌
- [ ] Sign up/login
- [ ] Team creation
- [ ] Team joining
- [ ] Project submission
- [ ] Dashboard navigation

#### **Organizer Features** ✅/❌
- [ ] Event creation
- [ ] Event editing
- [ ] Judge assignment
- [ ] Participant management

#### **Judge Features** ✅/❌
- [ ] Submission review
- [ ] Scoring system
- [ ] Progress tracking

#### **Critical Issues Found**
1. ___________________
2. ___________________
3. ___________________

#### **User Experience Rating** (1-10)
- **Ease of Use**: ___/10
- **Visual Design**: ___/10
- **Functionality**: ___/10
- **Performance**: ___/10

---

## 🎯 Success Criteria

**The website is ready for production when:**
- [ ] All three user roles can complete their primary workflows
- [ ] No 404 errors on any navigation
- [ ] All forms submit successfully
- [ ] Real-time features work across multiple tabs/users
- [ ] Mobile experience is fully functional
- [ ] Performance meets benchmarks
- [ ] No critical JavaScript errors in console

**Happy Testing! 🚀**

Remember: This is a comprehensive hackathon platform with complex interactions. Take your time to test thoroughly and report any issues you find. The role switcher in the navbar makes it easy to test different user perspectives quickly.
