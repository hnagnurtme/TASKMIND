import { faker } from '@faker-js/faker';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './src/configurations/firebase.config.js';
import { Task } from './src/interface/task.js';

// --- Priority calculation same as in TaskModal ---
const calculatePriority = (value: string, complexity: string, deadline: string) => {
  const now = new Date();
  const due = new Date(deadline);
  const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 24 || value === "high" || complexity === "high") return "high";
  if (hoursLeft <= 72 || value === "medium" || complexity === "medium") return "medium";
  return "low";
};

// --- Helper to pick realistic completedAt ---
const generateCompletedAt = (deadline: Date, completed: boolean) => {
  if (!completed) return null;
  const now = new Date();
  const latest = deadline < now ? deadline : now;
  return faker.date.between({ from: new Date(latest.getTime() - 7 * 24 * 60 * 60 * 1000), to: latest }).toISOString();
};

// --- Seed function ---
async function seedRealisticTasks() {
  try {
    console.log('Logging in...');
    const userCredential = await signInWithEmailAndPassword(auth, 'testuser@gmail.com', '123456');
    const uid = userCredential.user.uid;
    console.log('Logged in successfully, UID:', uid);

    const fakeTasks: Task[] = [];

    const fields = ['Work', 'Study', 'Health', 'Finance', 'Entertainment'];
    const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
    const complexities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

    for (let i = 0; i < 30; i++) {
      const field = faker.helpers.arrayElement(fields);
      let title = '';
      let note = '';

      // --- Generate realistic title & note based on field ---
      switch (field) {
        case 'Work':
          title = faker.hacker.verb() + ' ' + faker.hacker.noun();
          note = `Prepare report for ${faker.company.name()} or attend team meeting.`;
          break;
        case 'Study':
          title = `Read "${faker.lorem.words(3)}"`;
          note = `Focus on chapter ${faker.number.int({ min: 1, max: 12 })}, take notes.`;
          break;
        case 'Health':
          title = `Exercise: ${faker.word.adjective()} ${faker.word.noun()}`;
          note = `Duration: ${faker.number.int({ min: 20, max: 90 })} mins, remember to hydrate.`;
          break;
        case 'Finance':
          title = `Pay ${faker.finance.transactionType()}`;
          note = `Amount: $${faker.finance.amount()}, check bank statement.`;
          break;
        case 'Entertainment':
          title = `Watch ${faker.lorem.words(2)} movie`;
          note = `Platform: ${faker.helpers.arrayElement(['Netflix', 'YouTube', 'Disney+', 'HBO Max'])}`;
          break;
      }

      // --- Generate deadline: past 1 week → future 2 weeks ---
      const now = new Date();
      const randomDays = faker.number.int({ min: -7, max: 14 }); // past 7 → future 14
      const deadline = new Date(now.getTime() + randomDays * 24 * 60 * 60 * 1000);

      // --- Value & Complexity ---
      const value = faker.helpers.arrayElement(priorities);
      const complexity = faker.helpers.arrayElement(complexities);

      // --- Completed? Only tasks past deadline or present can be completed ---
      const completed = deadline <= now ? faker.datatype.boolean() : false;
      const completedAt = generateCompletedAt(deadline, completed);

      // --- Priority calculated automatically ---
      const priority = calculatePriority(value, complexity, deadline.toISOString());

      const task: Task = {
        id: faker.string.uuid(),
        title,
        deadline: deadline.toISOString(),
        value,
        complexity,
        priority,
        note,
        completed,
        completedAt,
      };

      fakeTasks.push(task);
    }


    const userRef = doc(db, 'users', uid);
    try {
      await updateDoc(userRef, { tasks: fakeTasks });
      console.log('✅ Successfully seeded 30 realistic tasks!');
    } catch (error: any) {
      if (error.code === 'not-found') {
        // Document does not exist, create it
        await setDoc(userRef, { tasks: fakeTasks });
        console.log('✅ User document created and seeded 30 realistic tasks!');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error seeding tasks:', error);
  }
}

seedRealisticTasks();
