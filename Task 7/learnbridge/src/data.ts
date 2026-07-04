import { CourseModule, UserRecord, UserRole, CourseFeedItem } from "./types";

export const UNIVERSITY_INFO = {
  institution: "University of Buea",
  faculty: "Faculty of Engineering and Technology",
  department: "Department of Computer Engineering",
  courseCode: "CEF440",
  courseName: "Internet Programming and Mobile Programming",
  instructor: "Dr. Nkemeni Valery"
};

export const INITIAL_STUDENTS: UserRecord[] = [
  {
    id: "stud1",
    name: "Njinya Ngecha Ryan Brown",
    matricule: "FE23A116",
    role: UserRole.STUDENT,
    email: "ryan.njinya@ubuea.cm",
    lastActive: "2026-07-04 10:15",
    attendanceRate: 94,
    progressRate: 85
  },
  {
    id: "stud2",
    name: "Karl Jonas Wenge Acha",
    matricule: "FE23A072",
    role: UserRole.STUDENT,
    email: "karl.acha@ubuea.cm",
    lastActive: "2026-07-04 09:40",
    attendanceRate: 88,
    progressRate: 72
  },
  {
    id: "stud3",
    name: "Brianna Tebesick Tsamo",
    matricule: "FE23A028",
    role: UserRole.STUDENT,
    email: "brianna.tsamo@ubuea.cm",
    lastActive: "2026-07-03 16:30",
    attendanceRate: 96,
    progressRate: 90
  },
  {
    id: "stud4",
    name: "Kelsey Njock-Awoh Njock Oben",
    matricule: "FE23A073",
    role: UserRole.STUDENT,
    email: "kelsey.njock@ubuea.cm",
    lastActive: "2026-07-04 10:30",
    attendanceRate: 91,
    progressRate: 78
  }
];

export const INITIAL_INSTRUCTORS: UserRecord[] = [
  {
    id: "inst1",
    name: "Dr. Nkemeni Valery",
    matricule: "UB-INS-002",
    role: UserRole.INSTRUCTOR,
    email: "nkemeni.valery@ubuea.cm",
    lastActive: "2026-07-04 10:45",
    attendanceRate: 100,
    progressRate: 100
  }
];

export const INITIAL_ADMINS: UserRecord[] = [
  {
    id: "admin1",
    name: "System Admin (Buea Portal)",
    matricule: "UB-ADM-001",
    role: UserRole.ADMIN,
    email: "admin.fet@ubuea.cm",
    lastActive: "2026-07-04 10:40",
    attendanceRate: 100,
    progressRate: 100
  }
];

export const INITIAL_FEED: CourseFeedItem[] = [
  {
    id: "feed1",
    title: "Offline Sync Support Activated",
    type: "update",
    date: "July 3, 2026",
    content: "We have optimized LearnBridge for student smartphone caching. You can now tap 'Download Module' while connected on campus, and all slides, lecture audio files, and quizzes will work perfectly offline. When you reconnect, your quiz attempts and attendance will automatically sync to our University database.",
    author: "Dr. Nkemeni Valery"
  },
  {
    id: "feed2",
    title: "Assignment 1: Responsive Design & PWA Basics",
    type: "assignment",
    date: "June 28, 2026",
    content: "Construct a basic web view that operates cleanly on 3G speeds under 200kbps. Submit your compressed ZIP folder including offline caching strategies. Due date: July 10, 2026, 23:59 WAT.",
    author: "Dr. Nkemeni Valery"
  },
  {
    id: "feed3",
    title: "Special Note on Bandwidth Adaptivity",
    type: "announcement",
    date: "June 25, 2026",
    content: "Please toggle the 'Data Saving Mode' in your profile settings if you are using mobile data bundles. This compressed mode drops the media assets to lightweight, transcript-only fallback text, cutting data consumption by up to 85%!",
    author: "System Admin (Buea Portal)"
  }
];

export const INITIAL_MODULES: CourseModule[] = [
  {
    id: "mod-1",
    title: "Introduction to Web Protocols & Client-Server Architecture",
    code: "CEF440-M1",
    description: "Explore the foundations of the web: HTTP/1.1 vs HTTP/2, TCP handshake, request/response lifecycles, and how latency impacts clients in low-connectivity areas.",
    instructorName: "Dr. Nkemeni Valery",
    progress: 100,
    isCachedOffline: true,
    materials: [
      {
        id: "mat-1-1",
        type: "text",
        title: "Lecture Notes: HTTP and Internet Infrastructure",
        url: "#",
        size: "1.4 MB",
        compressedSize: "180 KB",
        content: `### HTTP Requests, Responses, and Low-Bandwidth Optimizations

The Hypertext Transfer Protocol (HTTP) is the protocol of the World Wide Web. When a student requests a resource (e.g. loading the LearnBridge dashboard), a client-server conversation begins.

1. **The TCP Connection:** The client opens a TCP connection to the port (e.g., 3000 or 80) of the target server. In high-latency settings (such as 2G/3G mobile networks in remote regions), the initial 3-way handshake (SYN, SYN-ACK, ACK) can take up to 2.5 seconds alone.
2. **The Request Headers:** The browser sends a request message detailing what resource it needs (e.g., GET /index.html).
3. **The Response Payload:** The server replies with a status code (e.g., 200 OK) followed by the requested file representation.

#### Adapting to Low Resource Settings:
- **Header Compression:** Under HTTP/2, HPACK is used to reduce redundant headers, saving up to 1KB per request.
- **Persistent Connections:** Re-using the same TCP connection avoids repeating handshakes.
- **Local Caching:** Instructing the browser to store static files locally using Cache-Control headers guarantees instant subsequent loads without touching the cellular network.`
      },
      {
        id: "mat-1-2",
        type: "audio",
        title: "Audio Lesson: Dealing with High Latency (Voicemail style)",
        url: "#",
        size: "8.2 MB",
        compressedSize: "980 KB",
        duration: "4:15",
        content: "[AUDIO PLAYBACK SIMULATION] In this compressed voice lecture, Dr. Nkemeni Valery explains that high latency is more problematic than raw bandwidth. He explains that reducing Round Trip Times (RTT) through CDN edge proxies and local Service Worker caches is essential for software serving rural Cameroon."
      },
      {
        id: "mat-1-3",
        type: "slides",
        title: "Slides: Client-Server Paradigms",
        url: "#",
        size: "3.1 MB",
        compressedSize: "410 KB",
        content: `### Slide 1: Web Core Definitions
- Client: The requester (smartphone, browser).
- Server: The resolver (Express.js, Cloud Run container).
- Peer-to-Peer: Multi-host alternative.

### Slide 2: The Handshake Bottleneck
- Each roundtrip multiplies latency.
- Solution: Avoid network roundtrips altogether by caching locally.`
      }
    ],
    quiz: {
      id: "quiz-1",
      title: "Quiz: Web Protocols Mastery",
      questions: [
        {
          id: "q1-1",
          question: "Which of the following is most critical for improving software usability in high-latency, low-bandwidth settings?",
          options: [
            "Upgrading colors to 4K resolution",
            "Minimizing network roundtrips through aggressive local caching",
            "Using client-side JavaScript for all data storage",
            "Increasing the CPU speed of the server container"
          ],
          correctIndex: 1
        },
        {
          id: "q1-2",
          question: "What is the primary objective of HPACK header compression in HTTP/2?",
          options: [
            "To make video files download faster",
            "To encrypt student passwords",
            "To reduce overhead headers, preserving valuable byte packets",
            "To disable browser cookies"
          ],
          correctIndex: 2
        }
      ]
    }
  },
  {
    id: "mod-2",
    title: "Responsive Layouts & Progressive Web App (PWA) Technologies",
    code: "CEF440-M2",
    description: "Learn how to build lightweight user interfaces using Tailwind CSS that dynamically render on ultra-low-end smartphones and offline service workers.",
    instructorName: "Dr. Nkemeni Valery",
    progress: 60,
    isCachedOffline: false,
    materials: [
      {
        id: "mat-2-1",
        type: "text",
        title: "PWA Principles & Cache Storage API",
        url: "#",
        size: "2.1 MB",
        compressedSize: "220 KB",
        content: `### Progressive Web Apps (PWAs) & Offline Resilience

A Progressive Web App uses modern web capabilities to deliver app-like experiences directly in the browser.

#### The Core Pillars of a PWA:
1. **The Web App Manifest:** A simple JSON file specifying how the application appears when installed on a student's home screen (standalone window, background color, brand color #1D9E75).
2. **Service Workers:** Event-driven background scripts that act as a proxy between the application, the local cache, and the network.
3. **The Cache Storage API:** Allows developers to store network requests (HTML, JS, CSS, images) locally.

#### Strategies for Power Outages:
When a power outage cuts off cell towers, a standard web app fails with 'No Internet'. A PWA handles the 'fetch' event:
- It checks the Cache Storage first.
- If found, it serves the cached files instantly in <100ms.
- If not, it falls back to a custom, offline-friendly template.`
      },
      {
        id: "mat-2-2",
        type: "video",
        title: "Video Lecture: Building Mobile-First layouts (Highly Compressed)",
        url: "#",
        size: "14.5 MB",
        compressedSize: "1.9 MB",
        duration: "8:40",
        content: "[VIDEO EMBED SIMULATION] This lecture demonstrates how to utilize Tailwind CSS grid systems and responsive prefixes to fit complex dashboards into compact 360px smartphone views, ensuring students don't need to scroll horizontally."
      }
    ],
    quiz: {
      id: "quiz-2",
      title: "Quiz: Responsive Layouts & Offline Caching",
      questions: [
        {
          id: "q2-1",
          question: "Which component of a PWA acts as a client-side network proxy to intercept and cache network requests?",
          options: [
            "The Web App Manifest",
            "The Service Worker",
            "The index.html entry point",
            "The MySQL database connector"
          ],
          correctIndex: 1
        },
        {
          id: "q2-2",
          question: "How does designing 'Mobile-First' benefit low-resource environments?",
          options: [
            "It forces developers to build heavy desktop views first",
            "It reduces the initial code footprint by loading only essential styling and assets",
            "It disables access for desktop computers",
            "It turns off CSS parsing in the browser"
          ],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: "mod-3",
    title: "Client-Side Caching & Local DB Integration (IndexedDB & LocalStorage)",
    code: "CEF440-M3",
    description: "Deep dive into local structured persistence. Understand how to design resilient local caches that sync to cloud endpoints as soon as network returns.",
    instructorName: "Dr. Nkemeni Valery",
    progress: 10,
    isCachedOffline: false,
    materials: [
      {
        id: "mat-3-1",
        type: "text",
        title: "Resilient Offline Form Submissions with LocalStorage",
        url: "#",
        size: "1.1 MB",
        compressedSize: "95 KB",
        content: `### Client-Side State Synchronization Strategies

When network connectivity is highly intermittent, client applications should follow an **Offline-First transactional pattern**.

#### Step-by-Step Sync Workflow:
1. **User Action:** The student answers a quiz or submits attendance.
2. **Connectivity Check:** The app checks the browser's \`navigator.onLine\` state.
3. **Queueing:** If offline, the request payload is stored inside a LocalStorage transaction array called \`pending_syncs\`.
4. **User Feedback:** The UI informs the student: *'Saved locally to phone (Offline Mode). We will sync this automatically when your connection is restored.'*
5. **Auto-Background Synchronization:** The application listens for the browser's 'online' event, reads \`pending_syncs\`, sends each item sequentially to \`/api/sync\`, and purges the local queue upon successful HTTP 200 status.`
      }
    ]
  }
];
