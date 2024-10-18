import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { collection, doc, getDoc, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1biSer_PoTi1jOPQLr8hMJEo8lzcJDaM",
  authDomain: "school-management-1dac2.firebaseapp.com",
  projectId: "school-management-1dac2",
  storageBucket: "school-management-1dac2.appspot.com",
  messagingSenderId: "545480440389",
  appId: "1:545480440389:web:84f127bb00c44a473ac12c",
  measurementId: "G-LELWKCKHN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Fetch subjects from Firestore 'subjects' collection
async function fetchSubjects(callback) {
  const subjectsCollection = collection(db, 'subjects'); // Reference to 'subjects' collection in Firestore
  const subjectsSnapshot = await getDocs(subjectsCollection);
  const subjectsList = subjectsSnapshot.docs.map(doc => doc.data()); // Convert documents to data
  callback(subjectsList); // Pass the data to the callback function
}

// Fetch events from Firestore 'events' collection
async function fetchEvents(callback) {
  const eventsCollection = collection(db, 'events'); // Reference to 'events' collection in Firestore
  const eventsSnapshot = await getDocs(eventsCollection);
  const eventsList = eventsSnapshot.docs.map(doc => doc.data()); // Convert documents to data
  callback(eventsList); // Pass the data to the callback function
}

// Fetch news from Firestore
async function fetchNews(callback) {
  try {
      const newsCollection = collection(db, 'news'); // Reference to 'news' collection in Firestore
      const newsSnapshot = await getDocs(newsCollection);
      const newsList = newsSnapshot.docs.map(doc => doc.data()); // Convert documents to data
      callback(newsList); // Pass the data to the callback function
  } catch (error) {
      console.error("Error fetching news: ", error);
      callback([]); // Call callback with an empty array on error
  }
}


// Fetch teachers from Firestore
async function fetchTeachers(callback) {
  const teachersCollection = collection(db, 'teachers'); // Reference to 'teachers' collection in Firestore
  const teachersSnapshot = await getDocs(teachersCollection);
  const teacherList = teachersSnapshot.docs.map(doc => doc.data()); // Convert documents to data
  callback(teacherList); // Pass the data to the callback function
}

async function fetchFirstHeroData(callback) {
  const heroCollection = collection(db, 'hero'); // Reference to the 'hero' collection
  const heroSnapshot = await getDocs(heroCollection); // Get all documents from the 'hero' collection

  if (!heroSnapshot.empty) {
      const firstDoc = heroSnapshot.docs[0]; // Get the first document in the snapshot
      const heroData = firstDoc.data(); // Get the document data
      callback(heroData); // Pass the data to the callback function to update the images
  } else {
      console.error("No documents found in the 'hero' collection.");
  }
}

// Fetch gallery images from Firestore
async function fetchGallery(callback) {
  const galleryCollection = collection(db, 'gallery'); // Reference to 'gallery' collection in Firestore
  const gallerySnapshot = await getDocs(galleryCollection);
  const galleryList = gallerySnapshot.docs.map(doc => doc.data()); // Convert documents to data
  callback(galleryList); // Pass the data to the callback function
}

export { fetchEvents, fetchGallery, fetchFirstHeroData , fetchNews, fetchSubjects, fetchTeachers };

