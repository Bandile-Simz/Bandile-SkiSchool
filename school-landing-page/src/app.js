// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Firebase configuration
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
const storage = getStorage(app);
const firestore = getFirestore(app);

// Open modals
document.getElementById('openAddNewsModal').addEventListener('click', () => {
    document.getElementById('addNewsModal').style.display = 'flex';
});
document.getElementById('openAddEventModal').addEventListener('click', () => {
    document.getElementById('addEventModal').style.display = 'flex';
});

// Close modals
document.getElementById('closeAddNewsModal').addEventListener('click', () => {
    document.getElementById('addNewsModal').style.display = 'none';
});
document.getElementById('closeEditModal').addEventListener('click', () => {
    document.getElementById('editNewsModal').style.display = 'none';
});
document.getElementById('closeAddEventModal').addEventListener('click', () => {
    document.getElementById('addEventModal').style.display = 'none';
});
document.getElementById('closeEditEventModal').addEventListener('click', () => {
    document.getElementById('editEventModal').style.display = 'none';
});

// Add News
document.getElementById('addNewsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('addNewsTitle').value;
    const content = document.getElementById('addNewsContent').value;
    const imageFile = document.getElementById('addNewsImage').files[0];

    // Upload image
    const imageRef = ref(storage, `news/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Add news item to Firestore
    await addDoc(collection(firestore, 'news'), {
        title,
        content,
        imageUrl,
        timestamp: new Date()
    });

    // Close modal
    document.getElementById('addNewsModal').style.display = 'none';
    loadNews(); // Reload news list
});

// Edit News
document.getElementById('editNewsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newsId = document.getElementById('newsId').value;
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const imageFile = document.getElementById('newsImage').files[0];
    
    const newsRef = doc(firestore, 'news', newsId);

    if (imageFile) {
        // Upload image
        const imageRef = ref(storage, `news/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        // Update news item with new image
        await updateDoc(newsRef, {
            title,
            content,
            imageUrl
        });
    } else {
        // Update news item without changing the image
        await updateDoc(newsRef, {
            title,
            content
        });
    }

    // Close modal
    document.getElementById('editNewsModal').style.display = 'none';
    loadNews(); // Reload news list
});

// Add Event
document.getElementById('addEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('addEventTitle').value;
    const description = document.getElementById('addEventDescription').value;
    const imageFile = document.getElementById('addEventImage').files[0];
    const link = document.getElementById('addEventLink').value;

    // Upload image
    const imageRef = ref(storage, `events/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Add event item to Firestore
    await addDoc(collection(firestore, 'events'), {
        title,
        description,
        imageUrl,
        link,
        timestamp: new Date()
    });

    // Close modal
    document.getElementById('addEventModal').style.display = 'none';
    loadEvents(); // Reload events list
});

// Edit Event
document.getElementById('editEventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventId = document.getElementById('eventId').value;
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const imageFile = document.getElementById('eventImage').files[0];
    const link = document.getElementById('eventLink').value;

    const eventRef = doc(firestore, 'events', eventId);

    if (imageFile) {
        // Upload image
        const imageRef = ref(storage, `events/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        // Update event item with new image
        await updateDoc(eventRef, {
            title,
            description,
            imageUrl,
            link
        });
    } else {
        // Update event item without changing the image
        await updateDoc(eventRef, {
            title,
            description,
            link
        });
    }

    // Close modal
    document.getElementById('editEventModal').style.display = 'none';
    loadEvents(); // Reload events list
});

// Load News
async function loadNews() {
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = ''; // Clear current news

    const querySnapshot = await getDocs(collection(firestore, 'news'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const newsItem = document.createElement('div');
        newsItem.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-md');
        newsItem.innerHTML = `
            <h3 class="text-2xl font-bold">${data.title}</h3>
            <p>${data.content}</p>
            <img src="${data.imageUrl}" alt="${data.title}" class="mt-2 w-full h-auto rounded-md">
            <button data-id="${doc.id}" class="editNews bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Edit</button>
        `;
        newsList.appendChild(newsItem);
    });

    // Attach event listeners to edit buttons
    document.querySelectorAll('.editNews').forEach(button => {
        button.addEventListener('click', async () => {
            const newsId = button.getAttribute('data-id');
            const newsDoc = await doc(firestore, 'news', newsId).get();
            const data = newsDoc.data();

            // Populate edit form
            document.getElementById('newsId').value = newsId;
            document.getElementById('newsTitle').value = data.title;
            document.getElementById('newsContent').value = data.content;
            document.getElementById('newsImagePreview').src = data.imageUrl;

            // Open edit modal
            document.getElementById('editNewsModal').style.display = 'flex';
        });
    });
}

// Load Events
async function loadEvents() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = ''; // Clear current events

    const querySnapshot = await getDocs(collection(firestore, 'events'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const eventItem = document.createElement('div');
        eventItem.classList.add('p-4', 'bg-white', 'rounded-lg', 'shadow-md');
        eventItem.innerHTML = `
            <h3 class="text-2xl font-bold">${data.title}</h3>
            <p>${data.description}</p>
            <img src="${data.imageUrl}" alt="${data.title}" class="mt-2 w-full h-auto rounded-md">
            <a href="${data.link}" target="_blank" class="text-blue-500 mt-2 inline-block">Learn More</a>
            <button data-id="${doc.id}" class="editEvent bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Edit</button>
        `;
        eventsList.appendChild(eventItem);
    });

    // Attach event listeners to edit buttons
    document.querySelectorAll('.editEvent').forEach(button => {
        button.addEventListener('click', async () => {
            const eventId = button.getAttribute('data-id');
            const eventDoc = await doc(firestore, 'events', eventId).get();
            const data = eventDoc.data();

            // Populate edit form
            document.getElementById('eventId').value = eventId;
            document.getElementById('eventTitle').value = data.title;
            document.getElementById('eventDescription').value = data.description;
            document.getElementById('eventImagePreview').src = data.imageUrl;
            document.getElementById('eventLink').value = data.link;

            // Open edit modal
            document.getElementById('editEventModal').style.display = 'flex';
        });
    });
}

// Initial load
loadNews();
loadEvents();
