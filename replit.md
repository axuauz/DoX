# DoX Health Diagnosis Service

## Overview

DoX is an AI-powered health diagnosis web application specifically designed for elderly users. The application provides a user-friendly interface where users can input their symptoms and receive personalized health advice and medication recommendations. The system focuses on accessibility with large fonts, simple interfaces, and emergency contact information to serve the elderly population effectively.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: HTML5/CSS3/JavaScript with TensorFlow.js for AI-powered features
- **Styling**: Custom CSS with modern design patterns optimized for elderly users
- **AI Integration**: Real-time pose detection using Teachable Machine and TensorFlow.js
- **UI Components**: Interactive posture analysis interface with live camera feed and pose visualization
- **Design System**: Senior-friendly interface with large fonts, high contrast, and intuitive navigation

### Backend Architecture
- **Server**: Node.js with native HTTP server for API endpoints
- **API Design**: RESTful API with `/api/diagnose`, `/api/pose-analysis`, and `/api/emergency` endpoints
- **Data Processing**: Enhanced symptom database including posture-related conditions and comprehensive health recommendations
- **AI Integration**: Pose analysis API that processes Teachable Machine predictions and maps to health conditions
- **Response Format**: Structured JSON responses with diagnosis, medication, exercises, and severity classifications

### Data Storage Solutions
- **Symptom Database**: In-memory mock database containing symptom-to-diagnosis mappings
- **Data Structure**: Each symptom entry includes diagnosis, medication recommendations, advice, and severity classification
- **No Persistent Storage**: Currently operates with static data without external database dependencies

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Security Model**: Open access application focused on public health information sharing
- **Privacy Approach**: No personal data collection or storage

### User Experience Design
- **Accessibility Focus**: Large fonts, high contrast colors, and simplified navigation for elderly users
- **Responsive Design**: Mobile-first approach ensuring usability across all device sizes
- **Emergency Features**: Prominent emergency contact information and quick access to emergency services
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features

### Form Handling and Validation
- **Client-Side Validation**: React Hook Form with Zod schema validation for type-safe form handling
- **User Input Processing**: Age, gender, and symptom description collection with structured data validation
- **Error Handling**: User-friendly error messages and loading states during diagnosis processing

### Component Architecture
- **Modular Design**: Separated sections for Hero, DiagnosisForm, PostureAnalysis, EmergencySection, and AboutSection
- **AI-Powered Components**: Real-time pose detection with canvas visualization and prediction display
- **Integrated Systems**: Seamless connection between pose analysis and traditional diagnosis workflows
- **State Management**: JavaScript-based state management for camera access, pose predictions, and user interactions
- **Animation System**: Smooth transitions and interactive feedback for enhanced user experience

## External Dependencies

### UI and Styling Libraries
- **@radix-ui/react-***: Complete suite of accessible UI primitives including radio groups, selects, dialogs, and form components
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **framer-motion**: Animation library for smooth transitions and interactive animations
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for conditionally joining CSS classes

### Development and Build Tools
- **next**: React framework with server-side rendering and automatic code splitting
- **typescript**: Static type checking for improved code quality and developer experience
- **eslint**: Code linting for consistent code style and error detection

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Resolvers for validation libraries integration
- **zod**: TypeScript-first schema validation library

### Server Dependencies
- **express**: Web framework for Node.js API development
- **cors**: Cross-origin resource sharing middleware for API access
- **body-parser**: Middleware for parsing request bodies

### AI/ML Integration Features
- **Teachable Machine Pose Detection**: Integrated real-time posture analysis using custom-trained pose detection model
- **TensorFlow.js**: Client-side machine learning for real-time health monitoring and pose classification
- **AI-Powered Health Pipeline**: Complete integration from visual pose analysis to medical diagnosis recommendations

### Deployment and Hosting
- **Vercel/Netlify Ready**: Configured for modern deployment platforms with Next.js optimization
- **Environment Variables**: Support for configuration management across different environments
- **Static Asset Optimization**: Automatic image optimization and asset compression through Next.js