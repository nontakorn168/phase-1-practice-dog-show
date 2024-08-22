document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const dogTableBody = document.getElementById('table-body')
    
    // Fetch dogs and render them in the table
    function fetchDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dog => {
          dogTableBody.innerHTML = ''; // Clear the table body before re-rendering
          dog.forEach(dog => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td><button data-id="${dog.id}">Edit</button></td>
            `;
            dogTableBody.appendChild(tr);
          });
        });
    }
  
    // Initial fetch and render
    fetchDogs();
  
    // Handle the edit button click
    dogTableBody.addEventListener('click', event => {
      if (event.target.tagName === 'BUTTON') {
        const dogId = event.target.dataset.id;
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            // Populate the form with the dog's current information
            dogForm.name.value = dog.name;
            dogForm.breed.value = dog.breed;
            dogForm.sex.value = dog.sex;
            dogForm.dataset.id = dog.id; // Store the dog's id in the form for later use
          });
      }
    });
  
    // Handle the form submission
    dogForm.addEventListener('submit', event => {
      event.preventDefault();
      const dogId = dogForm.dataset.id;
      const updatedDog = {
        name: dogForm.name.value,
        breed: dogForm.breed.value,
        sex: dogForm.sex.value
      };
  
      // Update the dog info with PATCH
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDog)
      })
      .then(response => response.json())
      .then(() => {
        fetchDogs(); // Re-fetch and re-render all dogs
        dogForm.reset(); // Clear the form
        delete dogForm.dataset.id; // Remove the stored dog id
      });
    });
  });
  