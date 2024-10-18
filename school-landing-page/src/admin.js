// Your Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

$(document).ready(function () {
    // Sidebar toggle
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // Sidebar collapse on small screens when clicking outside
    $(document).click(function (e) {
        if ($(window).width() < 768 && !$(e.target).closest('#sidebar-wrapper, #menu-toggle').length) {
            $("#wrapper").removeClass("toggled");
        }
    });

    // Content section management
    $(".list-group-item").click(function (e) {
        e.preventDefault();
        const target = $(this).data('target');

        $(".content-section").removeClass('active');
        $(".list-group-item").removeClass('active');

        $(target).addClass('active');
        $(this).addClass('active');

        if ($(window).width() < 768) {
            $("#wrapper").removeClass("toggled");
        }
    });

    // Handle form submission for adding a class
    $("#add-class-form").on("subISC", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const newClass = {
            classID: Number($("#classID").val().trim()),
            className: $("#className").val().trim(),
            teacher: $("#teacher").val().trim()
        };

        // Add the new class to Firestore
        db.collection("classes").add(newClass)
            .then(() => {
                alert("Class added successfully.");
                fetchClassesData(); // Refresh the class data
                $("#add-class-form")[0].reset(); // Reset the form
            })
            .catch((error) => {
                console.error("Error adding class: ", error);
                alert("An error occurred while adding the class.");
            });
    });

    // Handle form submission for adding a new image
    $("#add-image-form").on("subISC", function (e) {
        e.preventDefault(); // Prevent the default form submission

        const newImage = {
            type: $("#imageType").val().trim(),
            imageUrl: $("#imageUrl").val().trim(),
            title: $("#imageTitle").val().trim(),
        };
        /*
Author:Lihawu Tech;
License:ISC License
*/
const copy = `<h1 class="text-blue-400" title="this is a product of Lihawu Tech ">&star;Lihawu Tech<!--/*
Author:Lihawu Tech;
License:ISC License
*/-->
</h1>`;
            const copyID = document.getElementById('copy');

            copyID.innerHTML= copy;/*
            Author:Lihawu Tech;
            License:ISC License
            */

        // Add the new image to Firestore
        db.collection("gallery").add(newImage)
            .then(() => {
                alert("Image added successfully.");
                $("#add-image-form")[0].reset(); // Reset the form
                fetchGalleryImages(); // Refresh the gallery
            })
            .catch((error) => {
                console.error("Error adding image: ", error);
                alert("An error occurred while adding the image.");
            });
    });

    // Handle edit profile button click
    $("#edit-profile").click(function () {
        const isEditing = $(this).text() === "Save Changes";
        if (isEditing) {
            saveChanges();
        } else {
            // Switch to edit mode
            $("#name").hide();
            $("#email").hide();
            $("#name-input").val($("#name").text()).show();
            $("#email-input").val($("#email").text()).show();
            $("#change-image").show();
            $(this).text("Save Changes");
        }
    });

    // Show image upload input
    $("#change-image").click(function () {
        $("#image-input").click(); // Trigger file input
    });

    // Handle image upload
    $("#image-input").change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#profile-picture").attr("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle logout
    $("#logout-button").click(function () {
        localStorage.removeItem("userEmail");
        window.location.href = "index.html"; // Redirect to login page
    });

    // Handle form submission for adding hero images
$("#add-hero-images-form").on("subISC", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const imageFiles = [
        $("#heroImage1")[0].files[0],
        $("#heroImage2")[0].files[0],
        $("#heroImage3")[0].files[0],
    ];

    const heroImages = {};

    // Upload each image to Firebase storage
    const uploadPromises = imageFiles.map((file, index) => {
        if (file) {
            const storageRef = firebase.storage().ref(`heroImages/image${index + 1}`);
            return storageRef.put(file).then(() => {
                return storageRef.getDownloadURL();
            }).then((downloadURL) => {
                heroImages[`image${index + 1}`] = downloadURL;
            });
        }
    });

    Promise.all(uploadPromises).then(() => {
        // Update Firestore with hero image URLs
        db.collection("hero").doc("heroImages").set(heroImages)
            .then(() => {
                alert("Hero images added successfully.");
                fetchGalleryImages(); // Refresh the gallery to include hero images
                $("#add-hero-images-form")[0].reset(); // Reset the form
            })
            .catch((error) => {
                console.error("Error adding hero images: ", error);
                alert("An error occurred while adding the hero images.");
            });
    }).catch(error => {
        console.error("Error uploading images: ", error);
        alert("An error occurred during image upload.");
    });
});

// Fetch functions to load data when the page loads
    console.log("Fetching data...");
    

    // Fetch admin profile
    fetchAdminProfile();
    fetchNewsData();
    fetchData();
    fetchTeachersData();
    fetchClassesData();
    fetchEventsData();
    fetchGalleryImages();
});

// Fetch and display admin profile information
async function fetchAdminProfile() {
    const email = localStorage.getItem("userEmail");

    if (!email) {
        alert("No email found in local storage.");
        return;
    }

    try {
        const userQueryRef = db.collection("users");
        const emailQuery = userQueryRef.where("email", "==", email);
        const emailSnapshot = await emailQuery.get();

        if (emailSnapshot.empty) {
            alert("User not found. Please log in again.");
            return;
        }

        emailSnapshot.forEach((doc) => {
            const userData = doc.data();
            // Update profile header with user data
            document.getElementById("profile-picture").src =
                userData.imageUrl || "https://via.placeholder.com/50?text=No+Image";
            document.getElementById("name").innerText =
                userData.name || "Name not available";
            document.getElementById("email").innerText =
                userData.email || "Email not available";
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("An error occurred while fetching the user profile.");
    }
}

// Function to save changes
async function saveChanges() {
    const name = $("#name-input").val();
    const email = $("#email-input").val();
    const imageFile = $("#image-input")[0].files[0];

    try {
        const userEmail = localStorage.getItem("userEmail");
        const userQueryRef = db.collection("users");
        const emailQuery = userQueryRef.where("email", "==", userEmail);
        const emailSnapshot = await emailQuery.get();

        emailSnapshot.forEach(async (doc) => {
            const userId = doc.id;
            let downloadURL;

            // Handle image upload if a new image is selected
            if (imageFile) {
                const storageRef = firebase.storage().ref(`profilePictures/${userId}/`);
                await storageRef.child(imageFile.name).put(imageFile);
                downloadURL = await storageRef.child(imageFile.name).getDownloadURL();
            }

            // Update user data in Firestore
            await userQueryRef.doc(userId).update({
                name: name,
                email: email,
                ...(downloadURL && { imageUrl: downloadURL }), // Only update if new image URL exists
            });

            alert("Profile updated successfully!");
            $("#name").text(name).show();
            $("#email").text(email).show();
            $("#name-input").hide();
            $("#email-input").hide();
            $("#change-image").hide();
            $("#edit-profile").text("Edit Profile");
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile.");
    }
}

// Fetch and display gallery images including hero images
function fetchGalleryImages() {
    const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';
    const placeholderTitle = 'No Image';

    // Fetch gallery images
    db.collection("gallery").onSnapshot((snapshot) => {
        const galleryContainer = $("#gallery-container");
        galleryContainer.empty(); // Clear the gallery container

        // Group images by type
        const imagesByType = {};
        snapshot.forEach((doc) => {
            const imageData = doc.data();
            const type = imageData.type;

            if (!imagesByType[type]) {
                imagesByType[type] = [];
            }
            imagesByType[type].push(imageData);
        });

        // Display gallery images
        for (const type in imagesByType) {
            const images = imagesByType[type];
            const firstImage = images[0] || { imageUrl: placeholderImage, title: placeholderTitle };

            galleryContainer.append(`
                <div class="gallery-item" style="position: relative; margin: 10px;">
                    <img src="${firstImage.imageUrl || placeholderImage}" alt="${firstImage.title || placeholderTitle}" style="width: 300px; height: 200px; object-fit: cover;">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.5); color: white; text-align: center;">
                        ${firstImage.title || placeholderTitle}
                    </div>
                </div>
            `);
        }

        // Fetch and display hero images
        fetchGalleryImages(galleryContainer);
    });
}

// Function to display hero images
function displayHeroImages() {
    const heroImageContainer = document.getElementById('hero-image-container');
    heroImageContainer.innerHTML = ''; // Clear existing images

    // Create and append images
    heroImages.forEach((imageSrc, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'rounded-lg shadow-md overflow-hidden';

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.alt = `Hero Image ${index + 1}`;
        imgElement.className = 'w-full h-auto';

        imgDiv.appendChild(imgElement);
        heroImageContainer.appendChild(imgDiv);
    });
}

// Event listener for adding hero images
document.getElementById('add-hero-images-form').addEventListener('subISC', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get files from the input
    const heroImage1 = document.getElementById('heroImage1').files[0];
    const heroImage2 = document.getElementById('heroImage2').files[0];
    const heroImage3 = document.getElementById('heroImage3').files[0];

    // Create image URLs for preview (you may replace this with actual upload logic)
    if (heroImage1) heroImages.push(URL.createObjectURL(heroImage1));
    if (heroImage2) heroImages.push(URL.createObjectURL(heroImage2));
    if (heroImage3) heroImages.push(URL.createObjectURL(heroImage3));

    // Clear the file inputs
    document.getElementById('heroImage1').value = '';
    document.getElementById('heroImage2').value = '';
    document.getElementById('heroImage3').value = '';

    // Display updated hero images
    displayHeroImages();
});

function toggleAddNewsModal() {
    const modal = document.getElementById("addNewsModal");
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}
function addNewNews() {
    const title = document.getElementById("newNewsTitle").value;
    const dateTimeValue = document.getElementById("newNewsDateTime").value;
    const description = document.getElementById("newNewsDescription").value;
    const fileInput = document.getElementById("newNewsImage");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image for the article.");
        return;
    }

    const newsData = {
        title: title,
        date: firebase.firestore.Timestamp.fromDate(new Date(dateTimeValue)),
        description: description,
        imageUrl: "" // Placeholder for the image URL
    };

    db.collection("news").add(newsData)
        .then((docRef) => {
            console.log("News added with ID: ", docRef.id);
            uploadNewNewsImage(docRef.id, file);  // Proceed to image upload
        })
        .catch((error) => {
            console.error("Error adding news: ", error);
            alert("Error adding news.");
        });
}

function uploadNewNewsImage(newsId, file) {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`newsImages/${newsId}/${file.name}`);

    imageRef.put(file).then(() => {
        return imageRef.getDownloadURL(); // Get the URL after upload
    }).then((url) => {
        return db.collection("news").doc(newsId).update({
            imageUrl: url,
        });
    }).then(() => {
        alert("News article added successfully with image!");
        toggleAddNewsModal();  // Close the modal after upload
        fetchNewsData();  // Refresh news data to show the new article
    }).catch((error) => {
        console.error("Error uploading image to Firebase Storage: ", error);
        alert("Error uploading image.");
    });
}

function fetchNewsData() {
    db.collection("news").onSnapshot((snapshot) => {
        const newsContainer = $("#news-container");
        newsContainer.empty(); // Clear the news container

        snapshot.forEach((doc) => {
            const newsData = doc.data();
            const newsId = doc.id;

            const newsCard = `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 relative m-4 p-4">
                <img src="${newsData.imageUrl || 'placeholder-image-url.jpg'}" alt="${newsData.title || 'News Image'}" class="w-full h-48 object-cover" />
                <div class="p-4">
                    <input type="text" class="font-bold text-xl text-midnight-blue border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" 
                           value="${newsData.title || 'News Title'}" id="news-title-${newsId}" />
                    <p class="text-gray-500" id="news-date-${newsId}">${formatDate(newsData.date) || 'News Date'}</p>
                    <textarea class="text-gray-700 mt-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" 
                              id="news-description-${newsId}">${newsData.description || 'News Description'}</textarea>
                </div>
                <div class="absolute bottom-2 right-2 flex space-x-2">
                    <button class="text-blue-500 hover:text-blue-700" onclick="saveNews('${newsId}')">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteNews('${newsId}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            `;

            newsContainer.append(newsCard);  // Append each news card
        });
    }, (error) => {
        console.error("Error fetching news: ", error);
    });
}



function deleteNews(newsId) {
    if (confirm("Are you sure you want to delete this article?")) {
        db.collection("news").doc(newsId).delete()
            .then(() => {
                console.log("News article successfully deleted!");
                alert("News article deleted successfully!");
            })
            .catch((error) => {
                console.error("Error removing article: ", error);
                alert("Error deleting article.");
            });
    }
}

function editNews(newsId) {
    // Implement your edit functionality here
    console.log("Edit news with ID:", newsId);
    // You can redirect to an edit form or open a modal for editing
}

// Initialize fetching news data when the page loads



function toggleAddEventModal() {
    const modal = document.getElementById("addEventModal");
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}

function addNewEvent() {
    const title = document.getElementById("newEventTitle").value;
    const dateTimeValue = document.getElementById("newEventDateTime").value;
    const description = document.getElementById("newEventDescription").value;
    const fileInput = document.getElementById("newEventImage");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image for the event.");
        return; // Exit if no file selected
    }

    // Create a new document in Firestore
    const eventData = {
        title: title,
        date: firebase.firestore.Timestamp.fromDate(new Date(dateTimeValue)),
        description: description,
        imageUrl: "" // Placeholder for the image URL, will update after upload
    };

    db.collection("events").add(eventData)
        .then((docRef) => {
            console.log("Event added with ID: ", docRef.id);
            uploadNewEventImage(docRef.id, file); // Upload the image after adding event
        })
        .catch((error) => {
            console.error("Error adding event: ", error);
            alert("Error adding event.");
        });
}

function saveNews(newsId) {
    const title = $(`#news-title-${newsId}`).val();
    const description = $(`#news-description-${newsId}`).val();
    const dateTimeValue = new Date(); // Use current date or implement a date picker if needed

    // Update the Firestore document with new data
    db.collection("news").doc(newsId).update({
        title: title,
        date: firebase.firestore.Timestamp.fromDate(dateTimeValue),
        description: description
    }).then(() => {
        console.log("News successfully updated!");
        alert("News updated successfully!"); // Alert on successful update
    }).catch((error) => {
        console.error("Error updating news: ", error);
        alert("Error updating news."); // Alert on error
    });
}

function uploadNewEventImage(eventId, file) {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`eventImages/${eventId}/${file.name}`);

    // Upload the file to Firebase Storage
    imageRef.put(file).then(() => {
        // Get the download URL
        return imageRef.getDownloadURL();
    }).then((url) => {
        // Update the Firestore document with the new image URL
        return db.collection("events").doc(eventId).update({
            imageUrl: url,
        });
    }).then(() => {
        alert("Event added successfully!");
        toggleAddEventModal(); // Close the modal after success
        fetchEventsData(); // Refresh events data
    }).catch((error) => {
        console.error("Error uploading image to Firebase Storage: ", error);
        alert("Error uploading image.");
    });
}

// Function to format date
function formatDate(date) {
    if (date instanceof firebase.firestore.Timestamp) {
        date = date.toDate();
    } else if (typeof date === 'string') {
        date = new Date(date);
    } else {
        return 'Invalid date';
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    return date.toLocaleString('en-US', options);
}

// Function to fetch and display events data
function fetchEventsData() {
    db.collection("events").onSnapshot((snapshot) => {
        const eventsContainer = $("#events-container");
        eventsContainer.empty(); // Clear the events container

        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventId = doc.id;

            // Format the date
            const formattedDate = formatDate(eventData.date);

            
            // Individual event item with edit and delete icons
            const eventItem = `
<div class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 relative">
<img src="${eventData.imageUrl || ''}" alt="${eventData.title || 'Event Image'}" class="w-full h-48 object-cover" id="image-${eventId}" onclick="document.getElementById('file-input-${eventId}').click();" />
<input type="file" accept="image/*" id="file-input-${eventId}" class="hidden" onchange="uploadImage('${eventId}')" />
<div class="p-4">
    <input type="text" class="font-bold text-xl text-midnight-blue border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" 
           value="${eventData.title || 'Event Title'}" id="title-${eventId}" />
    <p class="text-gray-500" id="date-${eventId}">${formattedDate || 'Event Date'}</p>
    <input type="datetime-local" class="text-gray-500 mt-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" 
           value="${eventData.date ? eventData.date.toDate().toISOString().slice(0, 16) : ''}" id="dateTime-${eventId}" />
    <textarea class="text-gray-700 mt-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" 
              id="description-${eventId}">${eventData.description || 'Event Description'}</textarea>
</div>
<div class="absolute bottom-2 right-2 flex space-x-2">
    <button class="text-blue-500 hover:text-blue-700" onclick="saveEvent('${eventId}')">
        <i class="fas fa-save"></i>
    </button>
    <button class="text-red-500 hover:text-red-700" onclick="deleteEvent('${eventId}')">
        <i class="fas fa-trash-alt"></i>
    </button>
</div>
</div>
`;



            eventsContainer.append(eventItem); // Append each event to the events container
        });
    }, (error) => {
        console.error("Error fetching events: ", error);
    });
}

function uploadImage(eventId) {
    const fileInput = document.getElementById(`file-input-${eventId}`);
    const file = fileInput.files[0];

    if (!file) {
        console.log("No file selected.");
        return; // Exit if no file selected
    }

    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`eventImages/${eventId}/${file.name}`);

    // Upload the file to Firebase Storage
    imageRef.put(file).then(() => {
        console.log("Upload successful, fetching download URL...");
        // Get the download URL
        return imageRef.getDownloadURL();
    }).then((url) => {
        console.log("Download URL fetched:", url);
        // Update the Firestore document with the new image URL
        return db.collection("events").doc(eventId).update({
            imageUrl: url,
        });
    }).then(() => {
        console.log("Image successfully uploaded and Firestore updated!");
        // Update the displayed image
        const imgElement = document.getElementById(`image-${eventId}`);
        imgElement.src = url; // Update the image displayed
        imgElement.alt = "Uploaded Event Image"; // Set alt text for accessibility
    }).catch((error) => {
        console.error("Error during image upload process: ", error);
    });
}

function saveEvent(eventId) {
    const title = $(`#title-${eventId}`).val();
    const dateTimeValue = $(`#dateTime-${eventId}`).val();
    const description = $(`#description-${eventId}`).val();

    // Retrieve the current event data to keep existing image URL
    db.collection("events").doc(eventId).get().then((doc) => {
        if (doc.exists) {
            const currentData = doc.data();
            const updatedEventData = {
                title: title,
                date: firebase.firestore.Timestamp.fromDate(new Date(dateTimeValue)),
                description: description,
                imageUrl: currentData.imageUrl // Use the existing image URL
            };

            // Update the Firestore document with new data
            db.collection("events").doc(eventId).update(updatedEventData)
                .then(() => {
                    console.log("Event successfully updated!");
                    // Optionally, update the displayed date without re-fetching
                    const updatedDate = formatDate(updatedEventData.date);
                    $(`#date-${eventId}`).text(updatedDate);
                    alert("Event updated successfully!"); // Alert on successful update
                })
                .catch((error) => {
                    console.error("Error updating event: ", error);
                    alert("Error updating event."); // Alert on error
                });
        }
    }).catch((error) => {
        console.error("Error fetching event data: ", error);
        alert("Error fetching event data."); // Alert on error
    });
}

function uploadImage(eventId) {
    const fileInput = document.getElementById(`file-input-${eventId}`);
    const file = fileInput.files[0];

    if (!file) {
        alert("No file selected."); // Alert if no file is selected
        return; // Exit if no file selected
    }

    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`eventImages/${eventId}/${file.name}`);

    // Upload the file to Firebase Storage
    imageRef.put(file).then(() => {
        // Get the download URL
        return imageRef.getDownloadURL();
    }).then((url) => {
        // Update the Firestore document with the new image URL
        return db.collection("events").doc(eventId).update({
            imageUrl: url,
        });
    }).then(() => {
        // Update the displayed image
        const imgElement = document.getElementById(`image-${eventId}`);
        imgElement.src = url; // Update the image displayed
        alert("Image uploaded successfully!"); // Alert on successful upload
    }).catch((error) => {
        console.error("Error during image upload process: ", error);
        alert("Error uploading image."); // Alert on error
    });
}

function deleteEvent(eventId) {
    if (confirm("Are you sure you want to delete this event?")) {
        db.collection("events").doc(eventId).delete()
            .then(() => {
                console.log("Event successfully deleted!");
                alert("Event deleted successfully!"); // Alert on successful deletion
            })
            .catch((error) => {
                console.error("Error removing event: ", error);
                alert("Error deleting event."); // Alert on error
            });
    }
}


// Function to edit an event (implement your logic here)
function editEvent(eventId) {
    // You can redirect to an edit form or open a modal for editing
    console.log("Edit event with ID:", eventId);
    // Implement your edit functionality here
}

// Function to fetch and display class data
function fetchClassesData() {
    db.collection("classes").onSnapshot((snapshot) => {
        const classesTable = $("#classes-table tbody");
        classesTable.empty(); // Clear the table body

        snapshot.forEach((doc) => {
            const classData = doc.data();
            const classId = doc.id;

            const classRow = `
                <tr data-id="${classId}">
                    <td>${classData.classID || ''}</td>
                    <td>${classData.className || ''}</td>
                    <td>${classData.teacher || ''}</td>
                    <td>
                        <button onclick="editClass('${classId}')" class="text-blue-500"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteClass('${classId}')" class="text-red-500"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            classesTable.append(classRow);
        });
    }, (error) => {
        console.error("Error fetching classes: ", error);
    });
}

// Edit Class function
window.editClass = function (classId) {
    const row = $(`#classes-table tbody tr[data-id='${classId}']`);
    const cells = row.find('td');

    // Replace cell content with input fields for editing
    cells.each(function (index) {
        const currentCell = $(this);
        const currentValue = currentCell.text().trim();
        if (index < cells.length - 1) { // Exclude the last cell (Actions)
            currentCell.html(`<input type="text" class="form-control" value="${currentValue}">`);
        }
    });

    const actionsCell = cells.last();
    actionsCell.html(`
    <button onclick="saveClass('${classId}')" class="text-green-500"><i class="fas fa-save"></i></button>
    <button onclick="cancelEditClass('${classId}')" class="text-red-500"><i class="fas fa-times"></i></button>
`);
};

// Save Class function after editing
window.saveClass = function (classId) {
    const row = $(`#classes-table tbody tr[data-id='${classId}']`);
    const inputs = row.find('input');

    // Gather updated class data
    const updatedClassData = {
        classID: inputs[0].value,
        className: inputs[1].value,
        teacher: inputs[2].value
    };

    // Update class in Firestore
    db.collection("classes").doc(classId).update(updatedClassData)
        .then(() => {
            alert("Class updated successfully.");
            fetchClassesData(); // Refresh class data
        })
        .catch((error) => {
            console.error("Error updating class: ", error);
            alert("An error occurred while updating the class.");
        });
};

// Delete Class function
window.deleteClass = function (classId) {
    if (confirm("Are you sure you want to delete this class?")) {
        db.collection("classes").doc(classId).delete()
            .then(fetchClassesData)
            .catch(console.error);
    }
};

// Cancel editing class
window.cancelEditClass = function (classId) {
    fetchClassesData(); // Reload class data to cancel edits
};



function fetchData() {
    db.collection("students").onSnapshot((snapshot) => {
        $("#total-students").text(snapshot.size);
    });
    db.collection("teachers").onSnapshot((snapshot) => {
        $("#total-teachers").text(snapshot.size);
    });
    db.collection("events").onSnapshot((snapshot) => {
        $("#total-events").text(snapshot.size);
    });
}

function fetchTeachersData() {
    db.collection("teachers").onSnapshot((snapshot) => {
        $("#teachers-table tbody").empty(); // Clear the table body

        snapshot.forEach((doc) => {
            const teacher = doc.data();
            const teacherId = doc.id;

            const teacherRow = `
                <tr data-id="${teacherId}">
                 <td>${teacher.userID || ''}</td>
                    <td>${teacher.fullName || ''}</td>
                    <td>${teacher.email || ''}</td>
                    <td>${teacher.phone || ''}</td>
                    <td>${teacher.subject || ''}</td>

                    <td>
                        <button onclick="editTeacher('${teacherId}')" class="text-blue-500"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteTeacher('${teacherId}')" class="text-red-500"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            $("#teachers-table tbody").append(teacherRow);
        });
    }, (error) => {
        console.error("Error fetching teachers: ", error);
    });
}

window.editTeacher = function (teacherId) {
    const row = $(`#teachers-table tbody tr[data-id='${teacherId}']`);
    const cells = row.find('td');

    // Replace cell content with input fields
    cells.each(function (index) {
        const currentCell = $(this);
        const currentValue = currentCell.text().trim();
        if (index < cells.length - 1) { // Exclude the last cell (Actions)
            currentCell.html(`<input type="text" class="form-control" value="${currentValue}">`);
        }
    });

    const actionsCell = cells.last();
    actionsCell.html(`
        <button onclick="saveTeacher('${teacherId}')" class="text-green-500"><i class="fas fa-save"></i></button>
        <button onclick="cancelEdit(this)" class="text-red-500"><i class="fas fa-times"></i></button>
    `);
};

window.saveTeacher = function (teacherId) {
    const row = $(`#teachers-table tbody tr[data-id='${teacherId}']`);
    const inputs = row.find('input');

    // Gather updated data
    const updatedData = {
      userID: inputs[0].value,
        fullName: inputs[1].value,
        email: inputs[2].value,
        phone: inputs[3].value,
        subject: inputs[4].value,
    };

    // Update the teacher document in Firestore
    db.collection("teachers").doc(teacherId).update(updatedData)
        .then(() => {
            alert("Teacher updated successfully.");
            fetchTeachersData(); // Refresh the teachers table
        })
        .catch((error) => {
            console.error("Error updating teacher: ", error);
            alert("An error occurred while updating the teacher.");
        });
};

function cancelEdit(button) {
    fetchTeachersData(); // Reload table to cancel edits
}

window.deleteTeacher = function (teacherId) {
    if (confirm("Are you sure you want to delete this teacher?")) {
        db.collection("teachers").doc(teacherId).delete()
            .then(fetchTeachersData)
            .catch(console.error);
    }
};



