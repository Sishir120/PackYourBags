# 🎮 Professional Game Development Plan

## Overview
This document outlines the roadmap to transform the PackYourBags Arcade into a professional mobile-gaming experience, featuring three core games: **Flag Dash (Marble Race)**, **Travel Bingo**, and **Who Pays (Tic Tac Toe)**.

## 1. Flag Dash (Marble Racing) 🏁
**Objective**: Replicate the thrill of physics-based marble racing.
- **Current Status**: Basic 3D implementation exists.
- **Upgrade Plan**:
    - [ ] **Physics Tuning**: Refine mass, friction, and restitution for "heavy" marble feel.
    - [ ] **Track Design**: Add ramps, obstacles (spinners, bumpers), and dynamic lighting.
    - [ ] **Monetization**:
        - **Free**: Limit to 2 marbles/countries.
        - **Premium**: Unlock 200+ countries, custom textures, and "Chaos Mode".
    - [ ] **Audio**: Add rolling sounds, collision clicks, and energetic BGM.

## 2. Travel Bingo (Enhanced) 🎫
**Objective**: A strategic, visually polished bingo experience.
- **Current Status**: Basic grid exists.
- **Upgrade Plan**:
    - [ ] **Modes**: Implement "Speed Bingo" (timer based) and "Blackout".
    - [ ] **Power-ups**: "Instant Daub", "Double XP".
    - [ ] **Visuals**: Particle effects on daub, winning animations.
    - [ ] **Multiplayer**: Use Supabase Realtime for live rooms (Future Phase).

## 3. Who Pays? (Tic Tac Toe Variant) ❌⭕
**Objective**: A social mini-game to decide who foots the bill.
- **Current Status**: Not started.
- **Implementation Plan**:
    - [ ] **Core Logic**: Standard 3x3 grid with win detection.
    - [ ] **The Twist**: Loser receives a "Payment Challenge" (e.g., "Buy the next coffee").
    - [ ] **Visuals**: Neon/Glassmorphism UI, satisfying "slam" animations for X/O.
    - [ ] **Monetization**: Unlock custom markers (e.g., Planes vs Trains) and themes.

## 🛠 Shared Technical Requirements
- **Audio Engine**: Use `howler.js` for low-latency SFX and BGM.
- **Haptics**: Use `navigator.vibrate` for mobile feedback.
- **State Management**: React Context + LocalStorage for persistence.
- **Responsive Design**: Mobile-first CSS (Touch targets, safe areas).

---
*Created: November 22, 2025*
