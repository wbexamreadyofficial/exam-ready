/**
 * The teacher-facing PDF format, in one place.
 *
 * The guide page renders these samples and the field table; the parser on the
 * backend must stay in step with them. If a marker changes, it changes here
 * and in the backend's pattern constants — nowhere else.
 */

export const META_SAMPLE = `#META
EXAM: WB Constable Preliminary 2026
SET_TITLE: WB Constable Prelim — Mock Test 05
AUTHOR: Sujit Das
LANGUAGE: BN
DURATION: 60
TOTAL_QUESTIONS: 100
MARKS_PER_QUESTION: 1
NEGATIVE_MARKS: 0.25
PASSING_MARKS: 35
DIFFICULTY: MEDIUM
SECTION: gk | General Awareness | 25
SECTION: math | Mathematics | 25
SECTION: reasoning | Reasoning | 25
SECTION: english | English | 25
#END_META`;

export const QUESTION_SAMPLE = `Q1. সংবিধানে মৌলিক কর্তব্য অন্তর্ভুক্ত করার সুপারিশ কোন কমিটি করেছিল?
A) স্বর্ণ সিং কমিটি
B) সরকারিয়া কমিশন
C) বলবন্ত রাই মেহতা কমিটি
D) ভার্মা কমিটি
ANS: A
SUB: Polity
DIFF: MEDIUM
EXP: ১৯৭৬ সালে স্বর্ণ সিং কমিটি এই সুপারিশ করে।

Q2. Who was the first Governor-General of Bengal under the Regulating Act of 1773?
A) Lord Clive
B) Warren Hastings
C) Lord Cornwallis
D) Lord William Bentinck
ANS: B
SUB: History
DIFF: EASY`;

export const BILINGUAL_SAMPLE = `Q3. What is the capital of West Bengal? ||| পশ্চিমবঙ্গের রাজধানী কোথায়?
A) Kolkata ||| কলকাতা
B) Howrah ||| হাওড়া
C) Siliguri ||| শিলিগুড়ি
D) Durgapur ||| দুর্গাপুর
ANS: A`;

export interface FormatField {
  marker: string;
  required: boolean;
  notes: { EN: string; BN: string };
}

export const FORMAT_FIELDS: FormatField[] = [
  {
    marker: '#META … #END_META',
    required: true,
    notes: {
      EN: 'Must be the first block in the file, before any question.',
      BN: 'ফাইলের একদম প্রথমে, কোনো প্রশ্নের আগে থাকতে হবে।',
    },
  },
  {
    marker: 'EXAM:',
    required: true,
    notes: {
      EN: 'The exam this paper belongs to. If we do not have it yet, you will be asked during upload.',
      BN: 'কোন পরীক্ষার প্রশ্নপত্র। আমাদের কাছে না থাকলে আপলোডের সময় জিজ্ঞেস করা হবে।',
    },
  },
  {
    marker: 'SET_TITLE:',
    required: true,
    notes: {
      EN: 'The name students will see for this paper.',
      BN: 'ছাত্ররা এই প্রশ্নসেটের যে নাম দেখবে।',
    },
  },
  {
    marker: 'AUTHOR:',
    required: false,
    notes: { EN: 'Your name, shown as the paper’s contributor.', BN: 'আপনার নাম, প্রশ্নসেটের সাথে দেখানো হবে।' },
  },
  {
    marker: 'LANGUAGE:',
    required: false,
    notes: { EN: 'EN, BN or BILINGUAL. Defaults to BN.', BN: 'EN, BN বা BILINGUAL। না দিলে BN ধরা হবে।' },
  },
  {
    marker: 'DURATION:',
    required: true,
    notes: { EN: 'Whole minutes, digits only. e.g. 60', BN: 'পূর্ণ মিনিট, শুধু সংখ্যা। যেমন 60' },
  },
  {
    marker: 'TOTAL_QUESTIONS:',
    required: true,
    notes: {
      EN: 'Checked against how many questions we actually find.',
      BN: 'আমরা যতগুলো প্রশ্ন পাব, তার সাথে মিলিয়ে দেখা হবে।',
    },
  },
  {
    marker: 'MARKS_PER_QUESTION:',
    required: true,
    notes: { EN: 'Decimals allowed, e.g. 0.5', BN: 'দশমিক চলবে, যেমন 0.5' },
  },
  {
    marker: 'NEGATIVE_MARKS:',
    required: false,
    notes: { EN: 'Marks cut per wrong answer. Defaults to 0.', BN: 'ভুল উত্তরে কত কাটা যাবে। না দিলে 0।' },
  },
  {
    marker: 'PASSING_MARKS:',
    required: false,
    notes: { EN: 'Defaults to 33% of the total.', BN: 'না দিলে মোট নম্বরের ৩৩% ধরা হবে।' },
  },
  {
    marker: 'DIFFICULTY:',
    required: false,
    notes: {
      EN: 'EASY, MEDIUM or HARD — used for questions with no DIFF: line.',
      BN: 'EASY, MEDIUM বা HARD — যেসব প্রশ্নে DIFF: নেই তাদের জন্য।',
    },
  },
  {
    marker: 'SECTION:',
    required: false,
    notes: {
      EN: 'key | Display Name | count. One line per section; counts must add up to TOTAL_QUESTIONS.',
      BN: 'key | নাম | সংখ্যা। প্রতি সেকশনে একটি লাইন; যোগফল TOTAL_QUESTIONS-এর সমান হতে হবে।',
    },
  },
  {
    marker: 'Q1.  Q2.  Q3. …',
    required: true,
    notes: {
      EN: 'Sequential from 1, no gaps. Both Q1. and Q1) are accepted.',
      BN: '১ থেকে ক্রমানুসারে, কোনো ফাঁক নয়। Q1. ও Q1) দুটোই চলবে।',
    },
  },
  {
    marker: 'A)  B)  C)  D)',
    required: true,
    notes: { EN: 'Two to six options per question.', BN: 'প্রতি প্রশ্নে দুই থেকে ছয়টি অপশন।' },
  },
  {
    marker: 'ANS:',
    required: true,
    notes: {
      EN: 'A single option letter that exists in that question.',
      BN: 'একটিমাত্র অপশনের অক্ষর, যেটি ঐ প্রশ্নে আছে।',
    },
  },
  {
    marker: 'SUB:',
    required: false,
    notes: { EN: 'Subject. Falls back to the section’s subject.', BN: 'বিষয়। না দিলে সেকশনের বিষয় ধরা হবে।' },
  },
  {
    marker: 'DIFF:',
    required: false,
    notes: { EN: 'Falls back to the set-level DIFFICULTY.', BN: 'না দিলে উপরের DIFFICULTY ধরা হবে।' },
  },
  {
    marker: 'EXP:',
    required: false,
    notes: {
      EN: 'Explanation. May run over several lines, until the next Q marker.',
      BN: 'ব্যাখ্যা। পরের Q আসা পর্যন্ত কয়েক লাইন লেখা যাবে।',
    },
  },
];

export const BLOCKING_ERRORS: { EN: string; BN: string }[] = [
  { EN: 'The #META block is missing or malformed', BN: '#META ব্লক নেই বা ভুলভাবে লেখা' },
  { EN: 'Question count does not match TOTAL_QUESTIONS', BN: 'প্রশ্নসংখ্যা TOTAL_QUESTIONS-এর সাথে মিলছে না' },
  { EN: 'A question number is missing or repeated', BN: 'কোনো প্রশ্ন নম্বর বাদ পড়েছে বা দুবার এসেছে' },
  { EN: 'A question has fewer than two options', BN: 'কোনো প্রশ্নে দুটির কম অপশন' },
  { EN: 'ANS: is missing, or names an option that does not exist', BN: 'ANS: নেই, বা এমন অপশন বলা হয়েছে যা নেই' },
  { EN: 'Section counts do not add up to the total', BN: 'সেকশনের যোগফল মোট প্রশ্নের সমান নয়' },
  { EN: 'The file is blank, or is a scan with no readable text', BN: 'ফাইল ফাঁকা, বা স্ক্যান করা — লেখা পড়া যাচ্ছে না' },
];

export const WARNINGS: { EN: string; BN: string }[] = [
  { EN: 'A question has no EXP: explanation', BN: 'কোনো প্রশ্নে EXP: ব্যাখ্যা নেই' },
  { EN: 'SUB: names a subject we do not have yet', BN: 'SUB:-এ এমন বিষয় আছে যা আমাদের কাছে নেই' },
  { EN: 'Question text looks too short — possibly cut off', BN: 'প্রশ্নের লেখা খুব ছোট — কেটে গেছে কিনা দেখুন' },
  { EN: 'Two questions in the paper look identical', BN: 'দুটি প্রশ্ন হুবহু এক দেখাচ্ছে' },
  { EN: 'An option looks unusually long — lines may have merged', BN: 'কোনো অপশন অস্বাভাবিক লম্বা — লাইন জুড়ে গেছে কিনা দেখুন' },
];
