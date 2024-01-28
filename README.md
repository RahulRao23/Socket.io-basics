# Chat App Documentation

## Overview

This project is a server-side code for a chat application developed using Node.js, Express.js, MongoDB, and Socket.IO. The main focus of this project is to understand the fundamental concepts of real-time communication using sockets.

## Features

### 1. User Authentication

- **Sign Up:** Allows users to create an account.
- **Login:** Users can log in with their credentials.
- **Logout:** Provides a way for users to log out of their accounts.
- **Note:** User validation, such as email verification, is not implemented in this version, as the primary goal is to focus on socket concepts.

### 2. Friend Management

- **Send Friend Requests:** Users can send friend requests to other users.
- **Respond to Friend Requests:** Accept or reject friend requests.
- **Real-time Notifications:** Users receive real-time pop-ups for friend requests. If the user is not logged in, notifications are stored and delivered upon the next login.
- **Friends List:** Provides a list of users who are friends with the user.

### 3. Group Creation and Management

- **Create a Group:** Users can create groups.
- **Add Friends to Group:** Add friends to the created group.

### 4. Real-time Messaging

- **Real-time Messages:** Users can send and receive real-time messages within the app.
- **Real-time Notifications:** Users receive real-time notifications for new messages.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing user and chat data.
- **Socket.IO:** Library for real-time web applications, enabling bidirectional communication between web clients and servers.
