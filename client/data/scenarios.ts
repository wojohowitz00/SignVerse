import { Scenario } from "@/types";

export const scenarios: Scenario[] = [
  {
    id: "home",
    title: "At Home",
    subtitle: "5 conversations",
    image: require("../../assets/images/scenario-home.png"),
    conversations: [
      {
        id: "home-1",
        title: "Morning Routine",
        description: "Practice greeting your family in the morning",
        messages: [
          {
            id: "h1-1",
            role: "partner",
            signDescription: "Wave hand, then point to self, spell G-O-O-D, touch chin and bring down (MORNING)",
            englishText: "Good morning!",
          },
          {
            id: "h1-2",
            role: "user",
            signDescription: "Wave, point to self, sign GOOD MORNING back",
            englishText: "Good morning to you too!",
          },
          {
            id: "h1-3",
            role: "partner",
            signDescription: "Point to you, sign SLEEP, question face, sign GOOD?",
            englishText: "Did you sleep well?",
          },
          {
            id: "h1-4",
            role: "user",
            signDescription: "Nod, sign YES, SLEEP GOOD",
            englishText: "Yes, I slept well",
          },
        ],
      },
      {
        id: "home-2",
        title: "Dinner Time",
        description: "Communicate during family meals",
        messages: [
          {
            id: "h2-1",
            role: "partner",
            signDescription: "Sign EAT, point to plate, sign HUNGRY?",
            englishText: "Are you hungry?",
          },
          {
            id: "h2-2",
            role: "user",
            signDescription: "Rub stomach, sign YES, VERY HUNGRY",
            englishText: "Yes, I'm very hungry",
          },
        ],
      },
      {
        id: "home-3",
        title: "Watching TV",
        description: "Discuss what to watch together",
        messages: [
          {
            id: "h3-1",
            role: "partner",
            signDescription: "Point to TV, sign WATCH, WHAT, WANT?",
            englishText: "What do you want to watch?",
          },
          {
            id: "h3-2",
            role: "user",
            signDescription: "Sign MOVIE or SHOW preference",
            englishText: "I want to watch a movie",
          },
        ],
      },
      {
        id: "home-4",
        title: "Before Bed",
        description: "Nighttime routines with family",
        messages: [
          {
            id: "h4-1",
            role: "partner",
            signDescription: "Sign TIRED, point to bed, SLEEP TIME",
            englishText: "Time to go to bed",
          },
          {
            id: "h4-2",
            role: "user",
            signDescription: "Sign GOOD NIGHT, I-LOVE-YOU handshape",
            englishText: "Good night, I love you",
          },
        ],
      },
      {
        id: "home-5",
        title: "Weekend Plans",
        description: "Discuss activities for the weekend",
        messages: [
          {
            id: "h5-1",
            role: "partner",
            signDescription: "Sign WEEKEND, PLAN, WHAT?",
            englishText: "What are your plans for the weekend?",
          },
          {
            id: "h5-2",
            role: "user",
            signDescription: "Sign REST or ACTIVITY preference",
            englishText: "I want to relax at home",
          },
        ],
      },
    ],
  },
  {
    id: "errands",
    title: "Running Errands",
    subtitle: "4 conversations",
    image: require("../../assets/images/scenario-errands.png"),
    conversations: [
      {
        id: "errands-1",
        title: "At the Grocery Store",
        description: "Shopping for food items",
        messages: [
          {
            id: "e1-1",
            role: "partner",
            signDescription: "Sign WHERE, FIND, fingerspell item",
            englishText: "Where can I find the bread?",
          },
          {
            id: "e1-2",
            role: "user",
            signDescription: "Point direction, sign AISLE, number",
            englishText: "It's in aisle 3",
          },
        ],
      },
      {
        id: "errands-2",
        title: "At the Bank",
        description: "Banking transactions",
        messages: [
          {
            id: "e2-1",
            role: "partner",
            signDescription: "Sign HELP, NEED, DEPOSIT MONEY",
            englishText: "I need to deposit money",
          },
          {
            id: "e2-2",
            role: "user",
            signDescription: "Sign FILL-OUT FORM, GIVE-ME",
            englishText: "Please fill out this form",
          },
        ],
      },
      {
        id: "errands-3",
        title: "At the Post Office",
        description: "Mailing packages",
        messages: [
          {
            id: "e3-1",
            role: "partner",
            signDescription: "Sign MAIL, PACKAGE, SEND",
            englishText: "I want to mail this package",
          },
          {
            id: "e3-2",
            role: "user",
            signDescription: "Sign WHERE, GO, ADDRESS?",
            englishText: "Where is it going?",
          },
        ],
      },
      {
        id: "errands-4",
        title: "Getting Gas",
        description: "At the gas station",
        messages: [
          {
            id: "e4-1",
            role: "partner",
            signDescription: "Sign GAS, PUMP, NUMBER?",
            englishText: "Which pump number?",
          },
          {
            id: "e4-2",
            role: "user",
            signDescription: "Sign number, THANK-YOU",
            englishText: "Pump number 5, thank you",
          },
        ],
      },
    ],
  },
  {
    id: "doctor",
    title: "Doctor Visit",
    subtitle: "4 conversations",
    image: require("../../assets/images/scenario-doctor.png"),
    conversations: [
      {
        id: "doctor-1",
        title: "Check-in",
        description: "Arriving at the doctor's office",
        messages: [
          {
            id: "d1-1",
            role: "partner",
            signDescription: "Sign APPOINTMENT, HAVE, NAME?",
            englishText: "Do you have an appointment? What's your name?",
          },
          {
            id: "d1-2",
            role: "user",
            signDescription: "Sign YES, fingerspell name",
            englishText: "Yes, my name is...",
          },
        ],
      },
      {
        id: "doctor-2",
        title: "Describing Symptoms",
        description: "Explaining how you feel",
        messages: [
          {
            id: "d2-1",
            role: "partner",
            signDescription: "Sign FEEL, HOW, WRONG, WHAT?",
            englishText: "How are you feeling? What's wrong?",
          },
          {
            id: "d2-2",
            role: "user",
            signDescription: "Point to body part, sign HURT, PAIN",
            englishText: "I have pain here",
          },
        ],
      },
      {
        id: "doctor-3",
        title: "Understanding Diagnosis",
        description: "Learning about your condition",
        messages: [
          {
            id: "d3-1",
            role: "partner",
            signDescription: "Sign MEDICINE, TAKE, DAY, HOW-MANY?",
            englishText: "Take this medicine. How many times a day?",
          },
          {
            id: "d3-2",
            role: "user",
            signDescription: "Sign UNDERSTAND, TWO TIME DAY",
            englishText: "I understand, twice a day",
          },
        ],
      },
      {
        id: "doctor-4",
        title: "Follow-up Appointment",
        description: "Scheduling next visit",
        messages: [
          {
            id: "d4-1",
            role: "partner",
            signDescription: "Sign COME-BACK, WEEK, NEXT",
            englishText: "Come back next week",
          },
          {
            id: "d4-2",
            role: "user",
            signDescription: "Sign OK, SCHEDULE, THANK-YOU",
            englishText: "Okay, I'll schedule it. Thank you",
          },
        ],
      },
    ],
  },
  {
    id: "social",
    title: "Meeting Friends",
    subtitle: "4 conversations",
    image: require("../../assets/images/scenario-social.png"),
    conversations: [
      {
        id: "social-1",
        title: "Greeting Friends",
        description: "Meeting up with friends",
        messages: [
          {
            id: "s1-1",
            role: "partner",
            signDescription: "Wave enthusiastically, sign LONG-TIME, SEE, HAPPY",
            englishText: "It's been so long! Great to see you!",
          },
          {
            id: "s1-2",
            role: "user",
            signDescription: "Wave back, sign MISS YOU, HAPPY SEE",
            englishText: "I missed you! Happy to see you too!",
          },
        ],
      },
      {
        id: "social-2",
        title: "Making Plans",
        description: "Deciding what to do",
        messages: [
          {
            id: "s2-1",
            role: "partner",
            signDescription: "Sign DO, WHAT, WANT?",
            englishText: "What do you want to do?",
          },
          {
            id: "s2-2",
            role: "user",
            signDescription: "Sign EAT, GO, RESTAURANT?",
            englishText: "Want to go eat at a restaurant?",
          },
        ],
      },
      {
        id: "social-3",
        title: "Catching Up",
        description: "Sharing life updates",
        messages: [
          {
            id: "s3-1",
            role: "partner",
            signDescription: "Sign LIFE, YOUR, HOW?",
            englishText: "How's your life going?",
          },
          {
            id: "s3-2",
            role: "user",
            signDescription: "Sign BUSY, WORK, BUT GOOD",
            englishText: "Busy with work, but good",
          },
        ],
      },
      {
        id: "social-4",
        title: "Saying Goodbye",
        description: "Ending the meetup",
        messages: [
          {
            id: "s4-1",
            role: "partner",
            signDescription: "Sign FUN, TODAY, SEE-YOU AGAIN SOON",
            englishText: "Today was fun! See you again soon!",
          },
          {
            id: "s4-2",
            role: "user",
            signDescription: "Sign AGREE, BYE-BYE, TAKE-CARE",
            englishText: "Agreed! Bye, take care!",
          },
        ],
      },
    ],
  },
  {
    id: "work",
    title: "At Work",
    subtitle: "4 conversations",
    image: require("../../assets/images/scenario-work.png"),
    conversations: [
      {
        id: "work-1",
        title: "Morning Meeting",
        description: "Starting the workday",
        messages: [
          {
            id: "w1-1",
            role: "partner",
            signDescription: "Sign MEETING, START, READY?",
            englishText: "The meeting is starting. Ready?",
          },
          {
            id: "w1-2",
            role: "user",
            signDescription: "Sign YES, READY, LET'S-GO",
            englishText: "Yes, I'm ready. Let's go",
          },
        ],
      },
      {
        id: "work-2",
        title: "Asking Questions",
        description: "Clarifying work tasks",
        messages: [
          {
            id: "w2-1",
            role: "partner",
            signDescription: "Sign QUESTION, HAVE, ASK",
            englishText: "Do you have any questions?",
          },
          {
            id: "w2-2",
            role: "user",
            signDescription: "Sign YES, DEADLINE, WHEN?",
            englishText: "Yes, when is the deadline?",
          },
        ],
      },
      {
        id: "work-3",
        title: "Taking a Break",
        description: "Lunch and coffee breaks",
        messages: [
          {
            id: "w3-1",
            role: "partner",
            signDescription: "Sign LUNCH, GO, TOGETHER?",
            englishText: "Want to go to lunch together?",
          },
          {
            id: "w3-2",
            role: "user",
            signDescription: "Sign SURE, HUNGRY, LET'S-GO",
            englishText: "Sure, I'm hungry. Let's go",
          },
        ],
      },
      {
        id: "work-4",
        title: "End of Day",
        description: "Wrapping up work",
        messages: [
          {
            id: "w4-1",
            role: "partner",
            signDescription: "Sign FINISH, WORK, HOME GO?",
            englishText: "Done with work? Going home?",
          },
          {
            id: "w4-2",
            role: "user",
            signDescription: "Sign YES, TIRED, SEE-YOU TOMORROW",
            englishText: "Yes, I'm tired. See you tomorrow",
          },
        ],
      },
    ],
  },
];
