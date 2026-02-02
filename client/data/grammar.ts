import { GrammarLesson } from "@/types";

export const grammarLessons: GrammarLesson[] = [
  {
    id: "1",
    title: "ASL Sentence Structure",
    description: "Learn the Topic-Comment structure unique to ASL",
    duration: "15 min",
    difficulty: "beginner",
    icon: require("../../assets/images/scenario-home.png"),
    progress: 0,
    content: [
      {
        id: "1-1",
        type: "text",
        content:
          "ASL uses a Topic-Comment structure, which is different from English's Subject-Verb-Object order. In ASL, you establish the topic first, then make a comment about it.",
      },
      {
        id: "1-2",
        type: "example",
        content: "English: I like pizza",
        example: "ASL: PIZZA, I LIKE (topic: pizza, comment: I like it)",
      },
      {
        id: "1-3",
        type: "text",
        content:
          "Time signs typically come at the beginning of a sentence to establish when something happened.",
      },
      {
        id: "1-4",
        type: "example",
        content: "English: I went to the store yesterday",
        example: "ASL: YESTERDAY STORE I GO-TO",
      },
      {
        id: "1-5",
        type: "practice",
        content:
          "Try signing: TOMORROW DOCTOR I GO-TO (I'm going to the doctor tomorrow)",
      },
    ],
  },
  {
    id: "2",
    title: "Facial Grammar",
    description: "Understand how facial expressions convey meaning",
    duration: "20 min",
    difficulty: "beginner",
    icon: require("../../assets/images/scenario-social.png"),
    progress: 0,
    content: [
      {
        id: "2-1",
        type: "text",
        content:
          "In ASL, facial expressions are grammatically required, not optional. They change the meaning of signs and indicate whether you're asking a question.",
      },
      {
        id: "2-2",
        type: "text",
        content:
          "Yes/No questions: Raise your eyebrows and tilt your head forward slightly.",
      },
      {
        id: "2-3",
        type: "example",
        content: "YOU HUNGRY? (with raised eyebrows)",
        example: "Are you hungry?",
      },
      {
        id: "2-4",
        type: "text",
        content:
          "WH-questions (who, what, where, when, why, how): Furrow your eyebrows and tilt your head.",
      },
      {
        id: "2-5",
        type: "example",
        content: "NAME YOUR WHAT? (with furrowed brows)",
        example: "What is your name?",
      },
      {
        id: "2-6",
        type: "practice",
        content:
          "Practice asking 'Are you okay?' with raised eyebrows: YOU OKAY?",
      },
    ],
  },
  {
    id: "3",
    title: "Directional Verbs",
    description: "Learn how movement indicates subject and object",
    duration: "25 min",
    difficulty: "intermediate",
    icon: require("../../assets/images/scenario-work.png"),
    progress: 0,
    content: [
      {
        id: "3-1",
        type: "text",
        content:
          "Many ASL verbs are directional - the movement of the sign shows who is doing the action and who is receiving it.",
      },
      {
        id: "3-2",
        type: "text",
        content:
          "GIVE: The direction you move your hand shows who gives to whom. Moving from yourself outward = I give to you. Moving toward yourself = You give to me.",
      },
      {
        id: "3-3",
        type: "example",
        content: "I-GIVE-YOU (move from self outward)",
        example: "I give it to you",
      },
      {
        id: "3-4",
        type: "example",
        content: "YOU-GIVE-ME (move toward self)",
        example: "You give it to me",
      },
      {
        id: "3-5",
        type: "text",
        content:
          "Other directional verbs include: HELP, TELL, ASK, SHOW, PAY, SEND",
      },
      {
        id: "3-6",
        type: "practice",
        content:
          "Practice: I-HELP-YOU (offering help) vs YOU-HELP-ME (asking for help)",
      },
    ],
  },
  {
    id: "4",
    title: "Using Space",
    description: "Master the use of signing space for referencing",
    duration: "20 min",
    difficulty: "intermediate",
    icon: require("../../assets/images/scenario-errands.png"),
    progress: 0,
    content: [
      {
        id: "4-1",
        type: "text",
        content:
          "In ASL, you use the space around you to represent people, places, and things. Once you establish where something is located, you can point back to that spot to reference it.",
      },
      {
        id: "4-2",
        type: "text",
        content:
          "To talk about two people: Place person A on your left side, person B on your right. Then point to each location when referring to them.",
      },
      {
        id: "4-3",
        type: "example",
        content:
          "MY MOTHER (point left), MY FATHER (point right), THEY (point to both) LOVE-EACH-OTHER",
        example: "My mother and father love each other",
      },
      {
        id: "4-4",
        type: "practice",
        content:
          "Practice describing your family members by placing each in a different location",
      },
    ],
  },
  {
    id: "5",
    title: "Negation",
    description: "Learn multiple ways to express 'not' in ASL",
    duration: "15 min",
    difficulty: "beginner",
    icon: require("../../assets/images/scenario-doctor.png"),
    progress: 0,
    content: [
      {
        id: "5-1",
        type: "text",
        content:
          "ASL has several ways to express negation. The most common is head shaking while signing, combined with negative signs.",
      },
      {
        id: "5-2",
        type: "text",
        content:
          "NOT: Thumb from under chin moves outward. Use while shaking head.",
      },
      {
        id: "5-3",
        type: "example",
        content: "I UNDERSTAND NOT (shake head)",
        example: "I don't understand",
      },
      {
        id: "5-4",
        type: "text",
        content:
          "Some signs have built-in negation: DON'T-KNOW, DON'T-WANT, DON'T-LIKE",
      },
      {
        id: "5-5",
        type: "practice",
        content:
          "Practice: I LIKE NOT COFFEE (I don't like coffee) with head shake",
      },
    ],
  },
];
