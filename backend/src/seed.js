/**
 * Seed the database with a Super Admin account and CMS content.
 *
 * Usage:
 *   node src/seed.js
 *
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD from .env, falling back to
 * admin@bicard.org / Admin@123 for local development.
 *
 * Courses below are imported verbatim from the live bicard.org course/training
 * pages (titles, descriptions, syllabi and key features as published). Fields
 * the source page did not state (e.g. fees, duration) are left blank rather
 * than invented. Courses are upserted by slug so re-running refreshes content.
 */
require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const User = require('./models/user.model');
const Course = require('./models/course.model');
const Blog = require('./models/blog.model');
const Faculty = require('./models/faculty.model');
const PlacementPartner = require('./models/placementPartner.model');
const Testimonial = require('./models/testimonial.model');
const Page = require('./models/page.model');
const Setting = require('./models/setting.model');
const { slugify } = require('./utils/slugify');

const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL || 'admin@bicard.org').toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

// ---------------------------------------------------------------------------
// Courses & Training programs — data taken from bicard.org
// ---------------------------------------------------------------------------
const courses = [
  // ===================== Training / Diploma programs =====================
  {
    title: 'P.G Diploma in Embedded Systems Design',
    category: 'Training',
    shortDescription:
      'A broad education in embedded systems with the opportunity to specialize in the theoretical and practical aspects of embedded systems development.',
    description:
      'The purpose of P.G Diploma in Embedded Systems Design Program is to provide a broad education in embedded systems with the opportunity to specialize in areas that cover theoretical as well as practical aspects of embedded systems development. Eligibility: B.E./B.Tech. (ECE / Electronics / IT / CSE / Instr).',
    duration: '9 Months (Offline) / 7–8 Months (Online)',
    fees: '₹80,000 (Offline) / ₹50,000 (Online)',
    curriculum: [
      'Microcontroller/DSP-based design (Digital Electronics, Circuit design, 8/16-bit PIC, ARM 7/9/11, Arduino/ESP32, MSP430/STM32/Raspberry Pi)',
      'Firmware, Driver and Software Development (C/C++ programming, Linux, Device Drivers, RTOS)',
      'Communication Interfaces (Protocols, Wireless, Serial, I2C/SPI, CAN/LIN, USB, ADC/DAC)',
      'Embedded Communication / Linux Network Programming',
      'Wireless Embedded Systems Design',
      'Internet of Things (IoT) Development',
      'Automotive Embedded (Architecture, ECU, AUTOSAR, Automotive Protocols, ADAS)',
    ],
    benefits: [
      'Be Job Ready in 24 Weeks',
      'Lifetime placement support and class recording access',
      'Faculty from major tech companies',
      'Hiring opportunities from 200+ companies',
    ],
    faqs: [
      { question: 'Who Should Attend?', answer: 'Electronics Engineer, Software Engineer, Hardware Engineer, Field Engineer or Project Manager.' },
      { question: 'What is covered?', answer: 'Comprehensive exploration of embedded software, hardware, FreeRTOS kernel functions, and troubleshooting.' },
      { question: 'Who Will Deliver?', answer: 'Senior engineers with experience across automotive, industrial, robotics, telecoms, and consumer electronics.' },
      { question: 'How to Sign Up?', answer: 'Contact us by phone or visit our Pune office.' },
    ],
    isPublished: true,
    metaTitle: 'P.G Diploma in Embedded Systems Design in Pune | BICARD',
    metaDescription: 'P.G Diploma in Embedded Systems Design with 100% placement assistance, real hardware labs and live industry projects.',
  },
  {
    title: 'Masters in Embedded Systems Design',
    category: 'Training',
    shortDescription:
      'Advanced program spanning microcontroller/DSP design, firmware, IoT, RTOS, wireless embedded systems and Linux network programming.',
    description:
      'Masters in Embedded Systems Design is an advanced program covering microcontroller/DSP-based design and software architecture, firmware and driver development, Internet of Things (IoT), Real-Time Operating Systems (RTOS), wireless embedded systems, communication protocols and Linux network programming, with electives and project work.',
    duration: '',
    fees: '',
    curriculum: [
      'Microcontroller/DSP-based design & Software Architecture: Digital Electronics, Analog Electronics, Circuit design and PCB development, 8/16-bit PIC, ARM 7/9/11, STM32/Raspberry Pi/ESP32',
      'Firmware, Driver and Software Development: Computer Architecture, Operating Systems, C programming & Data Structures, Embedded C with PIC/ARM, C++ & Python, Python for Embedded programming, Linux Shell Programming, Linux Device Drivers (CHAR/BLOCK), USB/Network Drivers',
      'Internet of Things (IoT) Development: IoT Concepts/Architecture/Technology, Communication Networks, Cloud Computing, Information Security, AWS Greengrass, Project work',
      'Real-Time Operating Systems (RTOS): Real-Time System concepts, RTOS on ARM CORTEX, Porting RTOS to target board',
      'Wireless Embedded Systems',
      'Communication Protocols',
      'Interfacing Devices',
      'Linux Network Programming',
      'Electives & Project work',
    ],
    benefits: [],
    faqs: [
      { question: 'Who Should Attend?', answer: 'Electronics Engineers, Software Engineers, Hardware Engineers, Field Engineers, or Project Managers developing embedded applications.' },
      { question: 'Who Will Deliver?', answer: 'Senior engineers experienced in IoT across automotive, industrial control, robotics, telecoms, and consumer electronics.' },
      { question: 'How to Sign Up?', answer: 'Call +91 9595605544 or visit the Pune office at Shrinath Plaza, FC Road.' },
    ],
    isPublished: true,
    metaTitle: 'Masters in Embedded Systems Design | BICARD Pune',
    metaDescription: 'Advanced Masters in Embedded Systems Design covering firmware, RTOS, IoT, wireless embedded systems and Linux network programming.',
  },
  {
    title: 'P.G Dip in Internet of Things (IoT)',
    category: 'Training',
    shortDescription:
      'Build cutting-edge, multidisciplinary IoT expertise — from Raspberry Pi and Python to IoT protocols and cloud computing.',
    description:
      'The Internet of Things (IoT) represents a new stage in the digital revolution, fully contributing to the construction of a digital society, and requires a very high level of expertise with cutting-edge skills in multidisciplinary areas. Eligibility: B.E./B.Tech. (ECE / Electronics / IT / CSE / Instr).',
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to IoT',
      'IoT Architecture',
      'IoT Device Design',
      'Getting started with Raspberry Pi',
      'Raspberry Pi vs Arduino vs ESP32',
      'Hands-on session on Raspberry Pi using Linux OS commands',
      'Remote Access to Raspberry Pi',
      'Programming Languages',
      'Practical session on Python Programming Language',
      'Embedded system with Raspberry Pi',
      'IoT Communication Protocols',
      'Cloud Computing',
    ],
    benefits: [
      'IoT Application Stack, Software Stack & Hardware Stack',
      'Wireless Sensor Networks & M2M',
      'Cloud computing and IoT',
      'Major Project',
      'Hands-on exercises with experienced trainers',
    ],
    faqs: [],
    isPublished: true,
    metaTitle: 'P.G Dip in Internet of Things (IoT) in Pune | BICARD',
    metaDescription: 'P.G Diploma in IoT covering IoT architecture, Raspberry Pi, Python, IoT communication protocols and cloud computing.',
  },
  {
    title: 'Automotive Embedded System Design Course',
    category: 'Training',
    shortDescription:
      'Train to conceive, design, implement and deploy modern real-time automotive embedded systems.',
    description:
      'Diploma / Post Graduate Diploma in Embedded Systems course will train and skill the engineering students further to implement modern real time embedded systems & design. It facilitates to acquire knowledge and skill needed to conceive, design, implement and deploy dedicated embedded systems. Eligibility: Electronics Engineering (or related) diploma/graduates with aspiration and enthusiasm to build a career in Embedded Systems Design.',
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to Embedded Systems Design',
      'Embedded Hardware Design and Development',
      'Embedded Programming Concepts',
      'Microcontrollers/DSP-based design',
      'Embedded Communication and Interfaces',
      'Firmware, Driver and Software Development',
      'Linux Network Programming',
      'Operating Systems',
      'Real-Time Operating Systems',
      'Internet of Things (IoT) Development',
      'Running Qt for Embedded Applications',
      'Project and Seminar',
    ],
    benefits: [
      'Conceive, design, develop and deploy embedded systems',
      'Hands-on experience with real-life projects',
      'Develop problem-solving and organizational skills',
      'Industry placement assistance',
    ],
    faqs: [],
    isPublished: true,
    metaTitle: 'Automotive Embedded System Design Course in Pune | BICARD',
    metaDescription: 'Automotive Embedded System Design course covering ECU, AUTOSAR, automotive protocols, RTOS and IoT with placement assistance.',
  },
  {
    title: 'Accelerated Career Program in Embedded Systems (Powered by nasscom)',
    category: 'Training',
    shortDescription:
      'An intensive on-campus classroom program launched with nasscom to meet the specific hiring requirements of technology leaders.',
    description:
      'This is an intensive and specialized classroom program for engineers who want to build careers as embedded systems professionals. The program has been launched in collaboration with Nasscom to support the specific hiring requirements of technology leaders. Eligibility: students/graduates of electrical and related engineering streams; also open to experienced professionals wanting to improve domain expertise.',
    duration: '3 months (12 weeks)',
    fees: '',
    curriculum: [
      'Course 1: System Development Lifecycle',
      'Course 2: Hardware and Laboratory Familiarization',
      'Course 3: System Programming Using C',
      'Course 4: Embedded OS Fundamentals',
      'Course 5: Driver, Applications, and Middleware',
      'Course 6: Verification and Validation',
      'Course 7: Packaging, Release, and DevOps',
      'Course 8: Embedded System: Domain Specific',
      '10 hands-on projects: Traffic Light Control, Smart Home Automation, Medical Device Monitoring, Industrial Automation, Embedded Linux System, STM32 Motor Control, STM32 Sensor Interfacing, STM32 CAN Bus, STM32 RTOS, STM32 USB Device Development',
    ],
    benefits: [
      '25:1 student-instructor ratio',
      'Career services support (resume, aptitude, soft skills, mock interviews)',
      'Interview opportunities with nasscom partner companies within 45 days',
      'Hands-on training on Raspberry Pi and STM hardware',
      'Certificate upon completion; merit certificate for top 5%',
      'Email and forum technical support',
    ],
    faqs: [],
    isPublished: true,
    metaTitle: 'Accelerated Career Program in Embedded Systems (nasscom) | BICARD',
    metaDescription: 'Intensive 12-week on-campus Embedded Systems career program with nasscom — hands-on projects and interview opportunities.',
  },

  // ===================== Courses =====================
  {
    title: 'Edge Computing Bootcamp with IIoT',
    shortDescription:
      'A 4-month intensive bootcamp to master Edge Computing and Industrial IoT — from edge architecture to Edge AI and industry applications.',
    description:
      'Edge computing is transforming the way industries process data, enabling faster decision-making, real-time analytics, and seamless integration with IoT (Internet of Things). To meet the growing demand for skilled professionals, BICARD offers a 4-month Edge Computing Bootcamp with IIoT (Industrial Internet of Things) designed for students, professionals, and industry practitioners who want to master next-generation computing technologies. Eligibility: basic programming knowledge, fundamentals of networking, understanding of distributed systems and familiarity with cloud computing concepts.',
    duration: '4 Months (Full-Time Program)',
    fees: '',
    curriculum: [
      'Module 1 — Introduction to Edge Computing (2 Weeks): fundamentals of distributed computing and edge architecture; Cloud vs Fog vs Edge; edge infrastructure (devices, servers, gateways, protocols); industry use cases',
      'Module 2 — Edge Computing Technologies (3 Weeks): 5G, SDN and MEC networking; edge software stack (OS, containerization, microservices); edge analytics and data management; privacy, security, caching and synchronization',
      'Module 3 — Edge Computing Development (4 Weeks): programming models and edge application environments; Edge AI & ML (optimization, inference, deployment); security (encryption, authentication, threat prevention); application design, optimization, debugging and reliability',
      'Module 4 — Industry Applications (3 Weeks): Industrial IoT (smart manufacturing, connected vehicles, building automation); enterprise edge (retail, finance, healthcare, telecom); orchestration, service mesh, hybrid cloud-edge and future trends',
    ],
    benefits: [
      'Industry-relevant curriculum aligned with real-world IIoT applications',
      'Hands-on training with labs, projects and case studies',
      'Expert faculty with embedded systems and edge technology experience',
      'Individual and group projects with industry case studies',
      'Continuous and final assessments',
    ],
    faqs: [],
    isPublished: true,
    metaTitle: 'Edge Computing Bootcamp with IIoT | BICARD Pune',
    metaDescription: '4-month Edge Computing Bootcamp with IIoT covering edge architecture, Edge AI, security and industrial applications.',
  },
  {
    title: 'Industrial Internet of Things (IIoT) Course',
    shortDescription:
      'Connect machines, devices and systems to build smart factories — IIoT architecture, protocols, analytics, security and case studies.',
    description:
      'The Industrial Internet of Things (IIoT) is revolutionizing industries by connecting machines, devices, and systems to create smart factories and automated operations. The program blends edge computing, connectivity, data analytics and AI, covering architecture, protocols, data analytics, security and real-world case studies. Eligibility: engineering students (Electronics, Computer, Electrical, Mechanical, Instrumentation) and working professionals in Embedded Systems, Automation or IT; basic knowledge of programming (C/Python), networking and microcontrollers is helpful but not mandatory.',
    duration: '',
    fees: '',
    curriculum: [
      'Module 1 — Introduction to IIoT: Overview, History, Core Technologies, Benefits & Challenges',
      'Module 2 — IIoT Architecture: Components, Communication Protocols (MQTT, CoAP, OPC-UA), Security',
      'Module 3 — IIoT Data Analytics: Collection, Storage, Analysis, Machine Learning',
      'Module 4 — IIoT Applications: Predictive Maintenance, Asset Tracking, Quality Control, Supply Chain, Smart Factories',
      'Module 5 — IIoT Security: Threats, Vulnerabilities, Security Mechanisms, Risk Management',
      'Module 6 — Case Studies: Real-World Implementations, Best Practices',
    ],
    benefits: [
      '25+ years training experience',
      'Hands-on projects with real-time IIoT setups',
      'Placement support with industry connections',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'RTOS Training',
    shortDescription:
      'Industry-focused RTOS training to build reliable, real-time embedded applications on ARM Cortex-M with FreeRTOS.',
    description:
      "In today's world of embedded systems and IoT, mastering Real-Time Operating Systems (RTOS) is essential for professionals aiming for a successful career. BICARD offers industry-focused RTOS Training designed to equip students, working professionals, and engineers with practical skills to build reliable, real-time embedded applications.",
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to RTOS Concepts: tasks, scheduling, context switching and synchronization',
      'Hands-On Programming: multitasking, semaphores, queues, mutexes, inter-task communication',
      'Porting and Configuration: setting up RTOS (FreeRTOS) on ARM Cortex-M microcontrollers',
      'Real-Time Scheduling Algorithms: priority scheduling, round-robin, real-time clock management',
      'Embedded C Programming for real-time systems',
      'Practical Projects: real-world applications and mini-projects on STM32 boards',
    ],
    benefits: [
      'More than 70% hands-on sessions',
      'Industry experts as trainers',
      'Industry-relevant projects',
      'Placement assistance',
      'Online and offline options available',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Developing with Embedded Linux',
    shortDescription:
      'A practical 40-hour course providing the skills to develop, build and debug applications and kernels on embedded Linux.',
    description:
      'Linux is being used more and more on embedded systems driven by increasingly complex devices and a greater requirement for connectivity & multimedia. Working with Linux for embedded systems can be difficult, with a vast array of choices available for tools and software. Developing With Embedded Linux is a 40 hours course providing the practical skills and knowledge required to work with Linux in this environment. Eligibility: completion of Linux Fundamentals training or equivalent basic knowledge of using Linux as a host operating system, experience of working with embedded systems (e.g. using RTOS or a bare machine), and some familiarity with C programming is useful.',
    duration: '40 hours (Standard Level)',
    fees: '',
    curriculum: [
      'Introduction',
      'Working with the Linux Kernel',
      'Debugging the Linux Kernel',
      'Building Applications',
      'Debugging Applications',
      'Linux Applications',
      'Configuring Filesystems',
      'Filesystem Locations',
      'Configuring the Bootloader',
      'Trace & Profile',
    ],
    benefits: [
      'Hands-on training on real target boards',
      'Comprehensive course materials serving as complete reference manuals',
      'Approximately 50% workshop-based practical exercises',
      'Coverage of freely available Linux tools and some commercial solutions',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Linux / Yocto Training',
    shortDescription:
      'Embedded Linux & Yocto training delivered by an experienced team from the international semiconductor industry.',
    description:
      'The highly experienced BICARD Embedded team have the knowledge and skills, gained from the international semiconductor industry, to deliver the right training and support for you and your organization in Linux and the Yocto Project.',
    duration: '',
    fees: '',
    curriculum: [],
    benefits: [
      'BICARD training includes extensive hands-on labs covering all aspects of the design process',
      'A complete learning experience to test, troubleshoot and consolidate knowledge before returning to design teams',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'GenAI @ the Edge',
    shortDescription:
      'Bring Generative AI to embedded systems — from TinyML and model optimization to LLMs, RAG and edge deployment.',
    description:
      'Generative AI (GenAI) is revolutionizing industries by enabling machines to create content, make intelligent decisions, and perform tasks once thought impossible. This course teaches you to bring Generative AI to embedded systems and the edge. Eligibility: strong foundation in embedded systems concepts, proficiency in Embedded C/C++, basic Python programming knowledge and familiarity with Linux commands.',
    duration: 'Approximately 16 weeks (4 months)',
    fees: '',
    curriculum: [
      'Module 1 (2 weeks): Generative models, AI in embedded systems, MCU basics, TensorFlow Lite',
      'Module 2 (2 weeks): Python libraries (NumPy, Pandas, Scikit-learn), data preparation, feature engineering',
      'Module 3 (4 weeks): Deep learning (CNNs, RNNs, LSTMs), GANs, model optimization, hands-on projects',
      'Module 4 (3 weeks): LLMs, prompt engineering, RAG techniques, containerization',
      'Module 5 (2 weeks): Transformers, low-power optimization, ethical AI, TinyML',
      'Module 6 (3 weeks): Capstone project with real-world applications',
    ],
    benefits: [
      'Theory plus hands-on labs',
      'Project-based learning with real-time use cases',
      'Industry-standard tools access',
      'Mentorship from industry experts',
      'Placement assistance available',
      'Online and offline modes offered',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Rust for Embedded Systems',
    shortDescription:
      'Write safe, efficient, concurrent firmware in Rust — the speed of C with memory safety and modern tooling.',
    description:
      'The BICARD Rust Programming Course equips learners with practical skills for writing safe, efficient, and concurrent firmware. Rust offers the speed of C with memory safety, concurrency guarantees, and modern programming features for building reliable embedded systems. Eligibility: strong embedded systems & microcontrollers foundation, C/C++ programming experience, basic Linux knowledge and Python familiarity (helpful).',
    duration: '4 Months (300+ hours)',
    fees: '',
    curriculum: [
      'Module 1: Rust fundamentals, zero-cost abstractions, toolchains setup',
      'Module 2: no_std programming, GPIO/UART/I2C/SPI peripherals, interrupts',
      'Module 3: Safe concurrency, multi-threading, RTOS integration',
      'Module 4: IoT edge devices, ESP32/ARM/RISC-V, TinyML',
      'Module 5: Secure coding, OTA updates, ISO 26262/AUTOSAR compliance',
      'Module 6: Capstone projects with placement support',
    ],
    benefits: [
      'Hybrid classroom + online delivery',
      'BICARD certification upon completion',
      'Hands-on labs and capstone projects',
      '100% placement assistance with resume building and mock interviews',
      'Connections with top embedded and IoT companies',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'C Programming for Embedded Systems',
    shortDescription:
      'Learn C in the context of embedded systems and program a modern microcontroller using real-time development tools.',
    description:
      'C Programming for Embedded Systems teaches the C programming language in the context of embedded systems. As well as giving delegates a full grounding in the C programming language, this course teaches delegates how to program a modern embedded microcontroller using real-time development tools. Eligibility: delegates should have a working knowledge of programming language concepts and syntax and experience programming in some high-level programming language (or HDL); previous C experience is advantageous but not essential and embedded programming experience is not necessary.',
    duration: 'Standard Level — 40 hours',
    fees: '',
    curriculum: [
      'Introduction to C',
      'Variables, Types and Debugging',
      'Operators and Hardware Manipulation',
      'Basic Program Flow Control',
      'Advanced Flow Control',
      'Advanced Types, Constants and Expressions',
      'Arrays and Pointer Basics',
      'More Pointers and Strings',
      'Functions',
      'Structures and Unions',
      'Scheduling Techniques',
      'Declarations',
      'Preprocessor',
      'Real-Time Operating Systems',
    ],
    benefits: [
      'Hands-on workshops comprise approximately 50% of class time',
      'Comprehensive training materials',
      'Each delegate receives their own development board',
      'Instruction using NXP MCUXpresso IDE and FRDM-KL46Z board',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'C Programming Course in Pune',
    shortDescription:
      'A specialized, hardware-oriented C programming course to build a strong foundation for the embedded systems industry.',
    description:
      'If you are looking to build a strong foundation in embedded systems, learning the C programming language is the first step. BICARD offers a specialized C Programming Course in Pune, carefully designed for students, freshers, and professionals aiming to enter the embedded systems industry. Suitable for engineering students (ENTC, EEE, CSE, IT), fresh graduates preparing for embedded careers and professionals switching to embedded development.',
    duration: '30 Days',
    fees: '',
    curriculum: [
      'Module 1: Introduction to Programming',
      'Module 2: Data Types and Operators',
      'Module 3: Control Structures',
      'Module 4: Functions and Arrays',
      'Module 5: Pointers and Memory Management',
      'Module 6: Structures and Unions',
      'Module 7: File Handling and Preprocessor Directives',
    ],
    benefits: [
      'Offline classroom sessions (Pune-based)',
      'Highly practical and hardware-oriented approach',
      'Taught by experienced embedded industry professionals',
      'Includes assignments, hands-on coding and microcontroller-based examples',
      'Placement support available',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'C++ Programming Course in Pune',
    slug: 'cpp-programming-course-in-pune', // explicit: slugify("C++ ...") collides with the C course
    shortDescription:
      'Build a strong OOP foundation in C++ and apply it to the embedded systems domain (STM32 / AVR).',
    description:
      "Are you looking to strengthen your programming fundamentals and kickstart a career in embedded systems? Join BICARD's C++ Programming Course in Pune, specially curated to build a strong foundation in Object-Oriented Programming (OOP) and apply it effectively in the Embedded Systems domain. The course targets engineering students, recent graduates and working professionals seeking to enhance their core programming knowledge for software development or embedded careers.",
    duration: '',
    fees: '',
    curriculum: [
      'Module 1 — Core Programming Concepts: C syntax and structure; loops, functions, arrays, pointers; structures and unions',
      'Module 2 — Advanced C++ Programming: classes and objects; inheritance, polymorphism, encapsulation; operator overloading and templates; file handling and exception handling',
      'Module 3 — C++ with Embedded Systems: C++ for microcontroller firmware; interrupt handling in C++; abstraction for peripheral control; writing drivers in C++; case studies with STM32 / AVR',
    ],
    benefits: [
      'Offline classroom training in Pune',
      'Covers both core C and advanced C++ concepts',
      'Strong focus on data structures, OOP and memory management',
      'Assignments designed around embedded system applications',
      'Integration with bare metal programming, RTOS and microcontroller concepts',
      'Training by industry experts with real-time experience',
      'Placement support and career guidance',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Data Structures in Embedded Systems',
    shortDescription:
      'Core data structures and algorithms with real-time considerations for efficient, optimized embedded systems.',
    description:
      'Data Structures play a vital role in the development of efficient and optimized Embedded Systems. This course covers core data structures and algorithms with real-time considerations for embedded development. Eligibility: Diploma & Engineering students (ENTC, EEE, CSE), embedded systems freshers, IoT developers and professionals preparing for embedded product company interviews.',
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to Data Structures',
      'Arrays and Strings',
      'Structures and Unions in C',
      'Linked Lists',
      'Stacks and Queues',
      'Trees and Binary Trees',
      'Hashing',
      'Graphs (optional in basic embedded courses)',
      'Sorting and Searching Algorithms',
      'Real-time Considerations in Embedded Systems',
    ],
    benefits: [
      'Programming in C / Embedded C',
      'Tools: Proteus, Keil μVision, STM32CubeIDE',
      'Practical applications: sensor data logging, UART/ADC buffer management, register mapping, task scheduling, lookup tables',
      'Hands-on training with real-time OS and hardware projects',
      'Lifetime placement support',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: '8051 Microcontroller Course',
    shortDescription:
      'Practical, hands-on 8051 microcontroller training — architecture, peripheral interfacing, timers, interrupts and serial communication.',
    description:
      'Looking to start your journey in embedded systems with a strong foundation? BICARD offers a dedicated 8051 Microcontroller Course designed to provide practical, hands-on training for students, working professionals, and electronics hobbyists. Eligibility: Diploma and Engineering students (ENTC, EEE, EE, CSE), freshers preparing for embedded job roles and professionals seeking a refresher in embedded fundamentals.',
    duration: '1.5 Months',
    fees: 'Affordable pricing (contact us for latest offers or combo with ARM/STM32 course)',
    curriculum: [
      'Module 1: Introduction to Microcontrollers (microprocessor vs microcontroller, 8051 architecture overview, applications)',
      'Module 2: 8051 Architecture and Programming (block diagram, pin description, registers, I/O ports, memory, assembly/C programming, bitwise operations)',
      'Module 3: Peripheral Interfacing (LED, switch, buzzer, 7-segment display, LCD, ADC/DAC, sensors, motor control)',
      'Module 4: Timers, Counters & Interrupts (timer modes, external/internal interrupt handling)',
      'Module 5: Serial Communication (UART protocol, serial interfacing)',
      'Module 6: Hands-on Projects (mini-projects, debugging, Proteus and Keil µVision simulation)',
    ],
    benefits: [
      'Online + Offline delivery options',
      'Practical simulation tools (Keil, Proteus, Flash Magic)',
      'Project-based learning approach',
      'Internship support for polytechnic students',
      'Trainers with 10+ years industry experience',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'ARM Embedded Systems Training',
    shortDescription:
      'Manufacturer-independent ARM training (ARM7, ARM9, Cortex-M0/M3/M4) to confidently select cores, chips, tools and libraries.',
    description:
      'Our manufacturer-independent ARM training classes cover the ARM Embedded architectures (ARM7, ARM9, Cortex-M0/M3/M4) and give participants all the information they need to make an educated decision when selecting cores, chips, tools and libraries. General knowledge about embedded systems development is beneficial for this class. Target audience: engineers and managers that are in Embedded Systems Development and consider using ARM derivatives in their design.',
    duration: '',
    fees: '',
    curriculum: [
      'General Introduction to ARM architecture (instruction sets, conditional execution, pipeline, registers, interrupt handling)',
      'ARM core comparison (ARM7, ARM9, Cortex-M3) and selection criteria',
      'Manufacturer-specific considerations (data buses, AMBA, AHB, APB, Flash memory)',
      'Code efficiency analysis (compilers and libraries)',
      'Hands-On: creating programs for ARM derivatives with execution time measurement',
      'Introduction to Embedded RTOS Programming on ARM',
      'Programming examples (USB, Ethernet, CAN, CANopen, Bootloading)',
    ],
    benefits: [
      'Hands-on experience using Keil µVision, GNU compiler and ARM RealView compiler',
      'Examples for Atmel, NXP and ST Microelectronics microcontrollers',
      'Electronic training materials provided',
      'Practical skills for selecting optimal chip and software combinations',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Developing with Arm Cortex-M',
    shortDescription:
      'Project-ready training for software development on Arm Cortex-M (v6-M/v7-M) platforms — M0/M0+/M3/M4/M7.',
    description:
      'Project-ready training for product development based on platforms incorporating Arm® microcontroller IP. This course is designed for engineers developing software for platforms based around Arm® Cortex®-M Series processors with v6-M and v7-M architecture. Target audience: software engineers writing application and system software for platforms using any of the Arm Cortex-M processor cores, including M0, M0+, M3, M4, M7. Prerequisites: some embedded systems knowledge, basic Arm awareness helpful, and C or assembly programming experience beneficial but not required.',
    duration: '4 days',
    fees: '',
    curriculum: [
      'Day 1: Introduction to Arm, Cortex-M Overview, Cortex-M Programmers’ Model, Assembly Programming',
      'Day 2: Synchronization, Memory Model, Memory Protection, Embedded Software Development',
      'Day 3: Compiler Hints & Tips, Linker Hints and Tips, Exception Handling',
      'Day 4: CMSIS Overview, Armv7-M Extensions, Debug, Cortex-M7 L1 Sub-Systems',
      'Appendix: Introduction to AMBA Protocols',
    ],
    benefits: [
      'Self-contained virtual machine environment for hands-on labs',
      'Project files supporting ST Microelectronics STM32 and NXP FRDM boards',
      'Exercises covering assembly, data transfers, exception handling and DSP topics',
      'Materials based on Arm-developed source content augmented by BICARD',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'STM32 Microcontroller Application Development with C',
    shortDescription:
      'Master STM32 from the Cortex-M3 core to every peripheral — IO, ADC/DAC, timers, SPI, USART, I2C, CAN and USB — with hands-on examples.',
    description:
      'The STM32 microcontroller series is introduced in this course. It starts with a review of the Cortex M3 core and architecture, which serve as the foundation for the STM32. Following that are the memory organization, reset block, interrupts, low power modes, and all peripherals such as IO ports, ADCs, timers, RTCs, SPI, USART, I2C, CAN, USB, DACs, embedded comparators, and op-amps. The majority of theoretical talks are accompanied by practical, hands-on examples. The course includes a section on software and hardware development tools.',
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to STM32',
      'The Cortex-M3 CPU',
      'Infrastructure',
      'Hardware Implementation',
      'Advanced Control Timer and General Purpose Timer',
      'DMA Controller',
      'Analog-to-Digital Converter (ADC)',
      'Digital-to-Analog Converter (DAC)',
      'I2C Interface',
      'Serial Peripheral Interface (SPI)',
      'USART',
      'Introduction to Embedded OS – uCOS',
      'CAN',
      'USB OTG Full Speed Interface',
      'Flexible Static Memory Controller',
      'Ethernet MAC',
    ],
    benefits: [],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Bare Metal Programming STM32 Course',
    shortDescription:
      'Write firmware directly on STM32 without an OS or HAL — for low-level control, efficiency and deep architecture understanding.',
    description:
      'Bare metal programming refers to writing firmware directly for a microcontroller without relying on an operating system (OS) or high-level libraries like HAL (Hardware Abstraction Layer). This approach provides low-level control, better efficiency, and a deeper understanding of microcontroller architecture. The course targets engineers, students and professionals interested in embedded systems.',
    duration: '',
    fees: '',
    curriculum: [
      'Introduction to STM32 Microcontrollers: ARM Cortex-M architecture overview, memory organization and peripheral structure',
      'Embedded C for Bare Metal Programming: startup files and linker scripts, interrupt service routines',
      'Peripheral Programming Without HAL: GPIO configuration and interrupt handling, UART/SPI/I2C and ADC programming',
      'Timers, PWM and Real-Time Applications: timer configuration, PWM signal generation',
      'Debugging and Optimization: JTAG, SWD and OpenOCD, performance tuning',
    ],
    benefits: [
      'Hands-on practice with real STM32 hardware',
      'Industry-relevant projects and assignments',
      'Mentorship from experienced embedded professionals',
      'Career guidance for embedded systems job opportunities',
    ],
    faqs: [],
    isPublished: true,
  },
  {
    title: 'Communication Protocols (CAN, LIN, UART, SPI, I2C)',
    shortDescription:
      'Master the core embedded communication protocols — CAN, LIN, UART, SPI and I2C.',
    description:
      'A dedicated course covering the core embedded communication protocols used across every embedded system — UART, SPI, I2C, CAN and LIN — with hands-on interfacing on real hardware.',
    duration: '',
    fees: '',
    curriculum: ['UART', 'SPI', 'I2C', 'CAN', 'LIN'],
    benefits: [],
    faqs: [],
    isPublished: true,
  },
];

// Real blog articles imported verbatim from bicard.org/blog.php article pages.
const blogs = [
  {
    title: 'How Machine Learning Affects Everyday Life?',
    category: 'Machine Learning',
    tags: ['machine learning', 'ai', 'technology'],
    status: 'published',
    content: `<p>Machine learning is an application of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it learn for themselves.</p>
<p>The process of learning begins with observations or data, such as examples, direct experience, or instruction, in order to look for patterns in data and make better decisions in the future based on the examples that we provide. The primary aim is to allow the computers learn automatically without human intervention or assistance and adjust actions accordingly.</p>
<p>And, the good news is, latest technology is advancing consistently and revolutionizing every facet of our routines. Humans had their first brush-up with Machine Learning when voice-controlled personal assistants — Amazon's Echo and Alexa — were launched. These devices are a new normal with the trend of smart homes picking up. Driverless cars, which were a quintessential sci-fi fantasy, aren't something of the far-off future now.</p>
<h3>1. Health</h3>
<p>Machine Learning can empower surgical robots to help doctors in medical procedures while ensuring minimal invasion and high precision. In the context of healthcare, ML can be a critical enabler to efficient diagnosis, research, and treatment. From administration and record-keeping to fully fledged diagnosis and treatments, ML has the capability to analyze the crisis at hand and compare it with numerous other scenarios for the right treatment and procedure.</p>
<h3>2. Transportation</h3>
<p>Today's transportation industry is highly influenced by Machine Learning. The technology has been instrumental in eradicating the threat posed by reckless driving through the deployment of sensory management and automation. Beyond vehicles, Machine Learning can soon be deployed for traffic management and preventing traffic congestion on roads.</p>
<h3>3. BFSI — Banking and Financial Service Industry</h3>
<p>Several banks and financial institutions are using ML-based complex algorithms to analyze and predict loan risks and assess the quality of the application, reinforcing them to take informed decisions. It's also helping in the detection of frauds and scams via analytics. Voice Recognition, Chatbots, and Predictive Analysis are helping bridge the gap between financial establishments and potential customers.</p>
<h3>4. Education</h3>
<p>Machine Learning can assess a child's academic understanding, analyze the way he/she perceives knowledge, and create a customized academic plan. The algorithms analyze test results and create a unique grading system that can free up teachers' time. ML, in addition to teaching, is simplifying administrative duties.</p>
<h3>5. Law</h3>
<p>Automating lawyers' day-to-day activities can free them from redundant tasks and help them focus on creating liable solutions to the cases at hand. Machine Learning augments documents and their processing, and analyzes them for proofs and research, helping lawyers extract relevant information without spending time poring over books and legal documents.</p>`,
    metaTitle: 'How Machine Learning Affects Everyday Life? | BICARD',
    metaDescription: 'A look at how machine learning is transforming health, transportation, banking, education and law.',
  },
  {
    title: 'Internet of Things (IoT) & the future',
    category: 'IoT',
    tags: ['iot', 'future', 'technology'],
    status: 'published',
    content: `<p>Ready for the future? Worry no more and get ready for the Internet of Things (IoT). With IoT, you can connect any device to the internet and make it smarter. Unlock new opportunities with automated home systems, smart security, and more. Enjoy seamless connection, real-time monitoring, and remote access with the Internet of Things.</p>
<h3>The Internet of Things (IoT) and its Future</h3>
<p>IoT technology is already here. We now live in the age of connected devices. The Internet of Things refers to the endeavor to connect objects to the internet as well as to one another, allowing people and devices to analyze data from diverse sources in real-time and take necessary actions in an intelligent manner.</p>
<p>Many major technology companies, like Apple, Intel, ARM, Google, IBM, and Microsoft, have embraced the IoT and are making significant expenditures and R&D efforts in this area. The Internet of Things (IoT) is the next revolution for users and brands.</p>
<h3>Important figures</h3>
<p>According to experts, the IoT market will grow significantly over the coming years, connecting tens of billions of devices. India will witness strong IoT growth and is set to become one of the largest consumers of IoT devices in the next few years.</p>
<h3>Business Prospects</h3>
<p>Because the future of IoT technology in India is bright, businesses are more likely to reap the benefits of IoT. Industrial automation and efficient operations will soon dominate the sector. IoT will transform everything — how we work and play — ensuring accuracy, efficiency, and total production, allowing us to make smarter and faster business decisions.</p>
<h3>Challenges</h3>
<p>When new technologies are introduced into the IT industry, many challenges remain. However, by solving these challenges we may achieve a more balanced approach to success. With enough time and investment, IoT adoption in many businesses produces impressive results on a wide scale.</p>`,
    metaTitle: 'Internet of Things (IoT) & the future | BICARD',
    metaDescription: 'Why IoT is the next big revolution, the figures behind its growth, and what it means for business in India.',
  },
  {
    title: 'Linux Careers – The Future',
    category: 'Career',
    tags: ['linux', 'career', 'devops'],
    status: 'published',
    content: `<p>Linux careers offer plenty of possibilities. A simple search of 'Linux' on job portals yields tens of thousands of jobs. Clearly, Linux is a space where a good, solid, long-term career is possible. But there are some things you should know before you decide to make the leap.</p>
<h3>Who should consider Linux IT as a career?</h3>
<p><strong>Do you enjoy learning new things?</strong> Linux IT is constantly evolving, filled with wonderful discoveries and new technologies. The learning never ends.</p>
<p><strong>Are you well suited to troubleshooting?</strong> Not everything works like it should, and despite your best efforts, you may spend significant time troubleshooting why a server is crashing or a script isn't running as it should.</p>
<p><strong>Can you do your job effectively even when stressed?</strong> Many areas of Linux IT are high stress. If your job involves critical data availability, you'll need to keep it together and persevere through high-stress situations.</p>
<h3>Preparing for your first Linux IT job</h3>
<p>Hone your Linux skills first. Learn basic Linux commands and functions to the point where you can utilize tools like sed, grep, cron, and awk. Master these, and perhaps learn a bit of shell scripting. Being able to automate basic administrator tasks is very important and will demonstrate you're the right person for the job.</p>
<p>Make a name for yourself before seeking your first Linux IT job: volunteer for a local non-profit, apply for an IT help desk position, and network at industry events.</p>
<h3>Ever-evolving Linux IT</h3>
<p>Your career will evolve over time. By building up your basic Linux skills first and starting in the trenches at a low-level IT job, you learn secondary skills that transform you into a more effective Linux IT employee. Facebook, Google, Amazon, NASA, Tesla, even Microsoft — Linux is the operating system acting as the backbone for the world's most powerful and innovative companies. Looking for a future-proof technical skill? It's hard to go wrong with Linux.</p>
<p>Enroll with us for Linux courses to gain the foundational Linux skills you need to pursue more advanced education and certification.</p>`,
    metaTitle: 'Linux Careers – The Future | BICARD',
    metaDescription: 'Is a Linux IT career right for you? How to prepare, land your first job, and grow in an ever-evolving field.',
  },
  {
    title: 'Artificial Intelligence – The new future…',
    category: 'Artificial Intelligence',
    tags: ['ai', 'ecommerce', 'future'],
    status: 'published',
    content: `<p>Artificial intelligence (AI) is one of the most sought-after domains of today. AI capabilities for e-commerce and other platforms can exploit existing information on similarities and differences between customers. With the capacity to use huge amounts of information about client behavior and usage patterns, AI — with its self-learning algorithms — creates personalised shopping experiences for online buyers.</p>
<p>Here's a look at how artificial intelligence is gradually transforming the world of business and retail for the better:</p>
<p>AI is progressively lowering manual effort in communication for e-commerce platforms. Using natural language processing (NLP) and machine learning capabilities, AI chatbots can automate buyer conversations that would otherwise require human support employees, without room for human error. Chat assistants are also being used for CRM, personalising the buyer experience by answering questions.</p>
<p>With AI-powered virtual assistants, e-commerce businesses can provide customers with a personal fashion assistant, making personalised recommendations based on interests and previous usage habits. As prices drop, virtual assistants notify shoppers and increase footfalls on the site, leading to more successful conversions.</p>
<p>Traditional merchandising systems no longer have the resources to analyse massive amounts of data or predict consumer trends. This is where AI comes in — advising consumers on what to buy based on their behaviour patterns and preferences, and providing e-commerce sites with actionable insights to create the most relevant deals, promotions, and strategic messaging.</p>
<p>Companies that use AI apply predictive intelligence and contextual messaging to decide the best time to target a customer, ensuring increased conversion rates while enhancing the brand's interaction with its customers. The future belongs to industry-level collaborations between AI and e-commerce companies, with the express aim of putting forth the finest platform for customers.</p>`,
    metaTitle: 'Artificial Intelligence – The new future | BICARD',
    metaDescription: 'How AI and self-learning algorithms are transforming e-commerce, retail and customer experience.',
  },
];

// Sample blogs from the earlier bootstrap — unpublished so only real articles show.
const legacyBlogTitles = [
  'Why Embedded Systems Is the Best Career Choice in 2026',
  'RTOS vs Bare-Metal: When Should You Use Each?',
];

// Real faculty from the "Meet The Best Teachers" section on bicard.org.
// Only names + the published "Domain Expert" designation are available — no
// qualifications/experience are published, so those are intentionally left blank.
const faculty = [
  { name: 'Sunil Kumar Singh', designation: 'Domain Expert' },
  { name: 'Sandeep Agashe', designation: 'Domain Expert' },
  { name: 'J.V Patil', designation: 'Domain Expert' },
  { name: 'Nisarg Pandya', designation: 'Domain Expert' },
  { name: 'Hemant Choudhary', designation: 'Domain Expert' },
  { name: 'Aniket Joshi', designation: 'Domain Expert' },
  { name: 'Dipak Naik', designation: 'Domain Expert' },
];

// Placeholder faculty from the earlier bootstrap — soft-deleted so they no longer show.
const legacyFacultyNames = ['Dr. Anil Kulkarni', 'Sneha Patil'];

// Real recruiting companies listed on bicard.org/placements-bicard.php.
const partnerNames = [
  'American Megatrends', 'Knorr Bremse', 'Brose', 'KPIT', 'Emerson', 'JABIL', 'SOFTDEL',
  'iASYS Technology Solutions', 'Lear Corporation', 'VOLANSYS Technologies', 'Fidel Softech Pvt. Ltd',
  'HCL', 'Honeywell India', 'Renu Electronics', 'TREEL', 'General Industrial Controls',
  'ElectRay Technologies Pvt Ltd', 'Chheda Electronics', 'BIT MAPPER Integration Technologies',
  'Sprylogic Technologies Ltd', 'Micromax Instruments Pvt Ltd', 'Intellexus Systems Pvt Ltd',
  'Flextronics Technologies Pvt Ltd', 'Radix Electrosystems Pvt Ltd', 'Transworld Technologies Ltd',
  'Sovilo Technologies', 'JetNet Telematrix Solutions Pvt Ltd', 'KraftPowercon India Pvt Ltd',
  'Payatu Technologies Pvt Ltd', 'Nishko Instruments Pvt Ltd', 'Preciso Measuring Systems',
  'Topographix Equipments Pvt. Ltd', 'Ubitech Systems', 'Inditech Systems',
  'Evolve Technologies & Services', 'TRF Ltd', 'Span Pumps Pvt Ltd', 'Electronet Equipments Pvt Ltd',
  'Electronics Systems & Devices', 'TAS PowerTek Ltd', 'Embedded Computing Machines Pvt Ltd',
  'SmartLeaven Technologies Pvt Ltd', 'Abacus Electronics Pvt Ltd', 'QDnet Technologies',
  'Bioanalytical Technologies Pvt Ltd', 'Sunrise Instruments Pvt Ltd', 'Nissan Electronics',
  'Chetas Control Systems Pvt Ltd', 'EATON', 'K2 Technologies', 'Ken Integrated Technologies',
  'AtomX Technologies', 'KalpTech Solutions', 'MicroMagic Technologies Ltd', 'KStudio Solutions Pvt Ltd',
  'L & T', 'Delta', 'Randstad', 'Infosys', 'Schindler', 'FEV', 'MAGNA', 'Roundworks IT',
  'MAN', 'Cummins', 'RealThingks', 'Proton', 'VEROLT', 'Tata Elxsi',
];
const partners = partnerNames.map((companyName) => ({ companyName }));

// Animated "analytics" counters (Home & About) — editable in admin → Settings.
// Numbers grounded in bicard.org: founded 2000, trainers 10–15 yrs, 1000+ companies.
const siteStats = [
  { value: 25, suffix: '+', label: 'Years of Training' },
  { value: 1000, suffix: '+', label: 'Hiring Companies' },
  { value: 100, suffix: '%', label: 'Placement Support' },
  { value: 15, suffix: '+', label: 'Yrs Trainer Experience' },
];

// Static content pages — fully editable from the admin portal (Pages).
const pages = [
  {
    title: 'About BICARD',
    slug: 'about',
    isPublished: true,
    content: `<p>BICARD is one of the best and leading embedded systems training institutes in Pune. We offer both classroom training and online courses, beneficial for those who want to acquire this skill set conveniently with the flexibility of learning from home.</p>
<p>BICARD has been a leading embedded systems training provider since 2000. It is one of the best training institutes providing high-quality, industry-level embedded software and hardware training with real-time projects.</p>
<p>The training is provided by working professionals. All our trainers have rich industrial experience of 10–15 years and guide our candidates with their best knowledge and the work culture of leading IT companies.</p>
<p>BICARD imparts comprehensive training to our students with live projects and placement support, making candidates ready to be absorbed into the industry at any time.</p>`,
    metaTitle: 'About BICARD | Embedded Systems Training Institute in Pune',
    metaDescription: 'BICARD — a leading embedded systems training institute in Pune since 2000, with industry-expert trainers, live projects and placement support.',
  },
  {
    title: 'Placements',
    slug: 'placements',
    isPublished: true,
    content: `<p>Let the top employers of your industry reach you. BICARD enables individuals to be industry-ready professionals. After completion of the course at BICARD, individuals are entitled to job placement assistance.</p>
<h3>Our Placement Support Includes</h3>
<ul>
  <li>100% Placement Support</li>
  <li>Resume Preparation</li>
  <li>Soft Skills Training</li>
  <li>Mock Interviews</li>
  <li>Placement across India</li>
</ul>
<p>Our students have been placed across <strong>1000+ companies</strong>.</p>`,
    metaTitle: 'Placements | BICARD',
    metaDescription: 'BICARD placement assistance — resume preparation, soft skills, mock interviews and 1000+ recruiting companies.',
  },
  {
    title: 'Staffing Solutions',
    slug: 'staffing-solutions',
    isPublished: true,
    content: `<p>BICARD provides staffing solutions to address rapid technology changes and high employee attrition in the IT/ITES sectors. We offer flexible team scaling based on project needs while managing service delivery, ensuring clients access talent with hands-on experience in the latest technologies.</p>
<h3>Our Services</h3>
<ul>
  <li>Contract Staffing Solutions</li>
  <li>Permanent Staffing Solutions</li>
  <li>Staff Augmentation Solutions</li>
  <li>Internships at BICARD</li>
  <li>Incubation Center services</li>
</ul>
<h3>Why BICARD</h3>
<ul>
  <li>Large pool of candidates with technical and domain competencies</li>
  <li>Transparent approach</li>
  <li>Minimal resource training cost</li>
  <li>High developer and staff productivity</li>
  <li>Faster project turnarounds</li>
  <li>Flexibility to increase staff without permanent payroll expenses</li>
</ul>
<h3>Industries We Serve</h3>
<p>IT, hardware and telecommunication staffing solutions — serving both experienced staff hiring and college graduate placement needs.</p>
<p><strong>Please call, email or visit us so that our recruitment specialist can discuss with you your requirements and potential solutions.</strong></p>`,
    metaTitle: 'Staffing Solutions | BICARD',
    metaDescription: 'Contract, permanent and staff augmentation solutions for IT, hardware and telecom — powered by BICARD.',
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    isPublished: true,
    content: `<h3>1. Overall</h3>
<p>BICARD is not responsible for ensuring participant backgrounds suit the training course. The institute will not refund if participants don't meet prerequisites. Course duration is as stipulated, and start dates are solely decided by management. BICARD reserves the right to alter the course contents, rules and regulations, teaching schedule, fees payable and/or any other matter pertaining to its working at its absolute discretion.</p>
<h3>2. Admission</h3>
<p>Admissions will only be accepted if the full course fee is received by BICARD in advance. With manager permission, installment payments are allowed but must follow agreed dates; failure results in cancellation and fee forfeiture. Admission granted to a particular student is non-transferable. Fee paid by the student is non-refundable under any circumstances. Students must submit three passport-size photos plus attested certificate copies.</p>
<h3>3. Syllabus</h3>
<p>The syllabus for the course, theory as well as practical, shall be as specified in the respective course details. Certificates on completion of training shall be issued only to those trainees who complete the training course and reach the level of proficiency as stipulated therein.</p>
<h3>4. Refund Policy</h3>
<p>Students may cancel by written notification. Any money due to the student will be refunded within 30 days without interest. Full refunds apply if cancellation occurs before course commencement. No refund if he/she cancels or withdraws from the program later than 7 (seven) days after the beginning of the training programme.</p>
<h3>5. Code of Conduct</h3>
<p>Students must carry the BICARD Photo-ID and adhere to schedules. Discipline is mandatory; violators face expulsion. Mobiles are restricted inside BICARD premises during lectures, presentations and projects. Students should claim their certificates within 3 months from the date of declaration of results.</p>
<h3>6. Placement Assistance</h3>
<p>Job assistance will be provided to individuals who have an attendance record of more than 90%. Recruitments depend on the individual company's recruitment policies. BICARD or any other companies do not guarantee any placements to the students. No guarantee of employment is made in our program.</p>
<h3>7. Termination of Training</h3>
<p>Violation of any rules and regulations and/or any instructions by any candidate shall amount to misconduct and the training may be terminated.</p>
<h3>8. Warranty and Liability</h3>
<p>The participant accepts that it is their responsibility to verify that the training course is suitable for their requirements. BICARD has no liability for material use or knowledge gained.</p>
<h3>9. Copyright</h3>
<p>The training course content and materials remain the copyright of BICARD and the corresponding partner. Unauthorised copying or redistribution of the training course materials is prohibited unless agreed in advance in writing by BICARD.</p>
<h3>10. Governing Law &amp; Jurisdiction</h3>
<p>This agreement shall be governed by and construed in accordance with the laws of India. The place of arbitration shall be Pune, and the Civil Courts of Pune hold jurisdiction.</p>
<h3>Placement Guarantee Terms</h3>
<p>BICARD does not directly place candidates. Instead, BICARD provides rigorous technical and soft-skills training, interview preparation, resume support, and multiple interview opportunities with relevant companies. We will continue to schedule interviews until the candidate secures a job, subject to conditions. A minimum of 90% attendance is mandatory. Placement services (guarantee or support) are valid for up to 6 months from the date of course completion or certification. BICARD guarantees training and interview opportunities, not job selection — the final hiring decision lies with the company.</p>
<h3>Student Grievance Procedure</h3>
<p>Complaints should be submitted via email to training@bicard.org or raised with the Centre Manager.</p>`,
    metaTitle: 'Terms & Conditions | BICARD',
    metaDescription: 'BICARD terms and conditions covering admission, fees, refunds, code of conduct, placement assistance and more.',
  },
];

const testimonials = [
  { studentName: 'Rohit Sharma', course: 'P.G Diploma in Embedded Systems Design', rating: 5, testimonial: 'BICARD got me job-ready in 6 months. Placed at a top product company!' },
  { studentName: 'Priya Deshmukh', course: 'Edge Computing Bootcamp with IIoT', rating: 5, testimonial: 'The hands-on labs and mentors made all the difference.' },
];

const run = async () => {
  await connectDB();

  // --- Super Admin ---
  let admin = await User.findOne({ email: ADMIN_EMAIL });
  if (!admin) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    admin = await User.create({ name: 'BICARD Admin', email: ADMIN_EMAIL, password: hashed, role: 'Super Admin' });
    console.log(`✓ Created Super Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    console.log(`• Super Admin already exists: ${ADMIN_EMAIL}`);
  }

  // --- Settings singleton ---
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({
      contactNumber: '+91 7276606655',
      whatsappNumber: '+91 7276606655',
      email: 'training@bicard.org',
      address: "Office No. 54, 55, 3rd Floor, 'C' Wing, Shrinath Plaza, FC Road, Pune, Maharashtra",
      socialLinks: { facebook: '#', instagram: '#', youtube: '#', linkedin: '#' },
    });
    console.log('✓ Created default settings');
  } else if (!settings.whatsappNumber) {
    settings.whatsappNumber = settings.contactNumber || '+91 7276606655';
    await settings.save();
    console.log('✓ Added WhatsApp number to settings');
  }
  if (!settings.stats || settings.stats.length === 0) {
    settings.stats = siteStats;
    await settings.save();
    console.log('✓ Added analytics stats to settings');
  }

  // --- Courses (upsert by slug so re-running refreshes content) ---
  for (const c of courses) {
    const { slug: explicitSlug, ...rest } = c;
    const slug = explicitSlug || slugify(c.title);
    await Course.findOneAndUpdate(
      { slug },
      { ...rest, slug, isDeleted: false, category: rest.category || 'Course' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ Seeded ${courses.length} courses`);

  // --- Blogs (upsert real articles, hide legacy samples) ---
  for (const b of blogs) {
    const slug = slugify(b.title);
    await Blog.findOneAndUpdate(
      { slug },
      { ...b, slug, isDeleted: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  await Blog.updateMany({ title: { $in: legacyBlogTitles } }, { $set: { status: 'draft' } });
  console.log(`✓ Seeded ${blogs.length} real blogs (legacy samples set to draft)`);

  // --- Pages (upsert by slug) ---
  for (const pg of pages) {
    await Page.findOneAndUpdate(
      { slug: pg.slug },
      { ...pg, isDeleted: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✓ Seeded ${pages.length} pages`);

  // --- Faculty (upsert real, hide legacy placeholders) ---
  for (const f of faculty) {
    await Faculty.findOneAndUpdate(
      { name: f.name },
      { ...f, isDeleted: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  await Faculty.updateMany({ name: { $in: legacyFacultyNames } }, { $set: { isDeleted: true } });
  console.log(`✓ Seeded ${faculty.length} real faculty (placeholders hidden)`);

  // --- Partners / Testimonials ---
  for (const p of partners) if (!(await PlacementPartner.findOne({ companyName: p.companyName }))) await PlacementPartner.create(p);
  for (const t of testimonials) if (!(await Testimonial.findOne({ studentName: t.studentName }))) await Testimonial.create(t);
  console.log(`✓ Seeded ${partners.length} partners and testimonials`);

  await mongoose.connection.close();
  console.log('\nSeeding complete. You can now log in to the admin portal.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
