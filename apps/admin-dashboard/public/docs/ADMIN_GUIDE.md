# FanFlick Admin Dashboard - User Guide

Welcome to the FanFlick Admin Dashboard documentation. This guide will help you navigate and utilize the features of the administration panel to manage users, moderate content, and oversee platform activity.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Report Management](#report-management)
5. [Content Moderation](#content-moderation)
6. [Audit Logs](#audit-logs)

---

## 1. Getting Started

### Accessing the Dashboard
The dashboard is accessible at `/login`. You must have an account with `admin` privileges to log in.

### Authentication
- Enter your admin email and password.
- Upon successful login, you will be redirected to the main Dashboard.
- Your session is secure and will automatically refresh. If your session expires, you will be redirected to the login page.
- **Note**: The dashboard uses a dark theme by default to reduce eye strain during long moderation sessions.

---

## 2. Dashboard Overview

The **Home** page provides a high-level view of the platform's health and recent activity.

### Key Metrics
Top-level cards show real-time counters for:
- **Users**: Total registered users, new creators, viewers, and suspended accounts.
- **Content**: Total trailers uploaded, views, likes, and average engagement.
- **Reports**: Pending, reviewed, and actioned report counts.

### Analytics Charts
- **User Growth**: Line chart showing new registrations over the last 30 days.
- **Content Creation**: Bar chart breaking down uploads by type (Original, Parody, Remix, Response).
- **Report Volume**: Pie chart showing the distribution of report reasons (Spam, Harassment, etc.).

### Recent Activity
A live feed on the right side shows the latest system events, such as new user registrations or content uploads.

---

## 3. User Management

Navigate to the **Users** section to oversee the user base.

### User List
- **Search**: Find users by username or email using the search bar.
- **Filters**:
  - **Role**: Filter by Admin or User.
  - **Status**: Filter by Active or Suspended.
  - **Type**: Filter by Creator or Viewer.
- **Actions**: Click on any row to view valid details for that user.

### User Details Page
Clicking a user takes you to their profile view, which includes:
- **Profile Info**: Avatar, bio, and account stats (Followers, Following, Likes).
- **Activity Timeline**: Recent actions performed by the user (Uploads, Comments).
- **Reports History**:
  - *Filed by User*: Reports this user has submitted.
  - *Filed Against User*: Reports other users have submitted against this user's content.

### Suspending a User
To suspend a violator:
1. Go to the User Details page.
2. Click the red **Suspend User** button in the header.
3. This action will be logged in the Audit Logs.
4. To restore access, click the **Unsuspend User** button.

---

## 4. Report Management

Navigate to the **Reports** section to handle user-submitted flags.

### Reports List
- Displays a table of all content reports.
- **Status Badges**:
  - `Pending`: Needs review.
  - `Reviewed`: Looked at but no action taken yet.
  - `Actioned`: Content deleted or user punished.
  - `Dismissed`: Report was invalid.
- **Filter**: Use the "All Statuses" dropdown to focus on Pending reports.

### Processing a Report
Click on a report ID to open the **Report Detail** view:
1. **Review Content**: See the reported trailer or comment.
2. **Review Reason**: See why the user reported it (e.g., Harassment, Copyright).
3. **Update Status**: Change the status to Reviewed, Dismissed, or Actioned.
4. **Take Action**:
   - Use the **Take Action** button to open the enforcement modal.
   - Options include: **Delete Content** or **Suspend User**.
   - These actions are irreversible and are logged for accountability.

---

## 5. Content Moderation

Navigate to the **Moderation** (or "Content") section for proactive oversight.

### Content Browser
- View a unified list of all **Trailers** and **Comments** on the platform.
- **Sorting**: Sort by Newest, Oldest, or "Quality Score".
- **Filtering**: View only Video, only Comments, or specific categories.

### Bulk Actions
1. Click the checkboxes on the left side of the table rows to select multiple items.
2. A bulk action bar will appear at the bottom.
3. Click **Delete Selected** to remove multiple items at once.
   - *Warning*: This permanently removes the content from the database.

---

## 6. Audit Logs

Navigate to **Audit Logs** to ensure transparency and accountability.

### What is Logged?
The system automatically records critical administrative actions, including:
- **User Suspensions/Unsuspensions**
- **Media Deletion** (Admin overrides)
- **Comment Deletion** (Admin overrides)
- **Report Validations**

### Viewing Logs
- The table shows the **Admin** who performed the action, the **Action Type**, the **Target** (User ID / Content ID), and a timestamp.
- Use this log to audit team usage and investigate moderation disputes.
